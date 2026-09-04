import { 
  Emitter, 
  SchedulerDecision, 
  DecisionReason, 
  SimulationSettings, 
  ScanResult, 
  SignalPriority 
} from '../types';

interface FrequencyStats {
  frequency: number;
  totalScans: number;
  hits: number;
  lastScannedTime: number; // tick count
  lastHitTime: number;
  estimatedDutyCycle: number;
  priorityWeight: number;
  confidence: number;
}

export class SmartScheduler {
  private settings: SimulationSettings;
  private freqStats: Map<number, FrequencyStats> = new Map();
  private candidateFrequencies: number[] = [];
  private currentTarget: number;
  private nextTarget: number;
  private tickCount: number = 0;
  private lastDecision: SchedulerDecision | null = null;
  private currentStepIndex: number = 0;

  constructor(emitters: Emitter[], settings: SimulationSettings) {
    this.settings = { ...settings };
    this.initializeCandidates(emitters);
    this.currentTarget = this.candidateFrequencies[0] || 104.99;
    this.nextTarget = this.candidateFrequencies[1] || 116.79;
  }

  public updateSettings(newSettings: Partial<SimulationSettings>) {
    this.settings = { ...this.settings, ...newSettings };
  }

  private initializeCandidates(emitters: Emitter[]) {
    // Generate candidate scan bins based on known regions + intermediate exploration grid
    const candidateSet = new Set<number>();

    emitters.forEach(e => {
      candidateSet.add(+e.frequency.toFixed(2));
      candidateSet.add(+(e.frequency - 1.5).toFixed(2));
      candidateSet.add(+(e.frequency + 1.5).toFixed(2));
    });

    // Add general exploration grid
    for (let f = this.settings.startFreqMHz; f <= this.settings.stopFreqMHz; f += 5.0) {
      candidateSet.add(+f.toFixed(2));
    }

    this.candidateFrequencies = Array.from(candidateSet).sort((a, b) => a - b);

    this.candidateFrequencies.forEach(freq => {
      const matchedEmitter = emitters.find(e => Math.abs(e.frequency - freq) < 1.0);
      let prioWeight = 0.5;
      let initialHitRate = 0.3;

      if (matchedEmitter) {
        if (matchedEmitter.priority === 'CRITICAL') prioWeight = 1.0;
        else if (matchedEmitter.priority === 'HIGH') prioWeight = 0.85;
        else if (matchedEmitter.priority === 'MEDIUM') prioWeight = 0.6;
        else prioWeight = 0.35;
        initialHitRate = matchedEmitter.historicalHitRate / 100;
      }

      this.freqStats.set(freq, {
        frequency: freq,
        totalScans: 0,
        hits: 0,
        lastScannedTime: 0,
        lastHitTime: 0,
        estimatedDutyCycle: initialHitRate,
        priorityWeight: prioWeight,
        confidence: 70 + Math.random() * 20
      });
    });
  }

  public reset(emitters: Emitter[]): void {
    this.tickCount = 0;
    this.initializeCandidates(emitters);
    this.currentTarget = this.candidateFrequencies[0] || 104.99;
    this.nextTarget = this.candidateFrequencies[1] || 116.79;
    this.lastDecision = null;
  }

  public advanceTick(): void {
    this.tickCount++;
  }

  /**
   * ML Scoring Function:
   * Score = w1 * ActivityLikelihood + w2 * HitRate + w3 * Priority + w4 * Urgency (time since last scan) - w5 * FrequencySwitchCost
   */
  public evaluateCandidates(currentFreq: number): {
    bestTarget: number;
    decision: SchedulerDecision;
  } {
    const scores: {
      frequency: number;
      score: number;
      urgency: number;
      uncertainty: number;
      activityLikelihood: number;
      historicalHitRate: number;
      priorityWeight: number;
      cost: number;
    }[] = [];

    const isExploration = Math.random() < this.settings.explorationRate;

    for (const freq of this.candidateFrequencies) {
      const stats = this.freqStats.get(freq) || {
        frequency: freq,
        totalScans: 0,
        hits: 0,
        lastScannedTime: 0,
        lastHitTime: 0,
        estimatedDutyCycle: 0.4,
        priorityWeight: 0.5,
        confidence: 70
      };

      // 1. Activity likelihood (modeled via estimated duty cycle + periodic recency decay)
      const timeSinceLastHit = this.tickCount - stats.lastHitTime;
      const recencyBoost = stats.lastHitTime > 0 ? Math.exp(-0.05 * Math.max(0, timeSinceLastHit)) * 0.3 : 0;
      const activityLikelihood = Math.min(1.0, stats.estimatedDutyCycle * 0.7 + recencyBoost);

      // 2. Historical hit rate
      const historicalHitRate = stats.totalScans > 0 ? (stats.hits / stats.totalScans) : stats.estimatedDutyCycle;

      // 3. Priority weight
      const priorityWeight = stats.priorityWeight;

      // 4. Urgency (Upper Confidence Bound / Age since last inspected)
      const timeSinceLastScan = this.tickCount - stats.lastScannedTime;
      const urgency = Math.min(1.0, timeSinceLastScan / 25.0);

      // 5. Switching / RF Search Cost (Frequency agility distance)
      const freqDistance = Math.abs(freq - currentFreq);
      const normalizedDistCost = Math.min(1.0, freqDistance / 80.0) * 0.15;

      // Weighted Multi-Attribute Utility Score
      const wPrio = this.settings.priorityWeight;
      const wExploit = this.settings.exploitationRate;
      
      let compositeScore = (
        (activityLikelihood * 0.35) +
        (historicalHitRate * 0.25) +
        (priorityWeight * 0.25 * wPrio) +
        (urgency * 0.15 * (1 - wExploit + 0.1))
      ) - normalizedDistCost;

      // If random exploration step
      if (isExploration && Math.random() < 0.3) {
        compositeScore += (Math.random() - 0.5) * 0.4;
      }

      scores.push({
        frequency: freq,
        score: +compositeScore.toFixed(3),
        urgency: +(urgency * 100).toFixed(0),
        uncertainty: +(100 - stats.confidence).toFixed(0),
        activityLikelihood: +(activityLikelihood * 100).toFixed(1),
        historicalHitRate: +(historicalHitRate * 100).toFixed(1),
        priorityWeight: priorityWeight,
        cost: +(normalizedDistCost * 100).toFixed(1)
      });
    }

    // Sort descending by score
    scores.sort((a, b) => b.score - a.score);

    // Pick best candidate (or second best if best is identical to current)
    let best = scores[0];
    if (Math.abs(best.frequency - currentFreq) < 0.1 && scores.length > 1) {
      best = scores[1];
    }

    const bestStats = this.freqStats.get(best.frequency);
    const confidence = bestStats ? bestStats.confidence : 88.5;

    // Determine predicted priority level
    let predictedPrio: SignalPriority = 'MEDIUM';
    if (best.priorityWeight >= 0.9) predictedPrio = 'CRITICAL';
    else if (best.priorityWeight >= 0.7) predictedPrio = 'HIGH';
    else if (best.priorityWeight < 0.4) predictedPrio = 'LOW';

    // Generate explainable decision reasons
    const reasons: DecisionReason[] = [];

    if (best.activityLikelihood > 75) {
      reasons.push({
        id: 'r1',
        text: `High predicted activity likelihood (${best.activityLikelihood}%)`,
        type: 'positive',
        score: 92,
        weightLabel: '+0.35'
      });
    } else {
      reasons.push({
        id: 'r1',
        text: `Periodic transmission cycle window active (${best.activityLikelihood}%)`,
        type: 'positive',
        score: 78,
        weightLabel: '+0.25'
      });
    }

    if (best.historicalHitRate > 70) {
      reasons.push({
        id: 'r2',
        text: `Strong historical intercept track record (${best.historicalHitRate}% hit rate)`,
        type: 'positive',
        score: 87,
        weightLabel: '+0.30'
      });
    } else {
      reasons.push({
        id: 'r2',
        text: `Exploration urgency bonus for unvisited spectrum bin`,
        type: 'neutral',
        score: 65,
        weightLabel: '+0.20'
      });
    }

    if (predictedPrio === 'CRITICAL' || predictedPrio === 'HIGH') {
      reasons.push({
        id: 'r3',
        text: `High tactical priority weighting (${predictedPrio} classification)`,
        type: 'positive',
        score: 95,
        weightLabel: '+0.35'
      });
    }

    reasons.push({
      id: 'r4',
      text: best.cost < 8 ? `Minimal frequency retuning latency (Local RF Band)` : `Optimal expected reward vs search cost tradeoff`,
      type: 'positive',
      score: 84,
      weightLabel: '-0.05'
    });

    // Compute expected intercept time
    const expectedTime = +(1.6 + (100 - confidence) * 0.02).toFixed(1);

    const decision: SchedulerDecision = {
      id: `DEC-${this.tickCount.toString().padStart(4, '0')}`,
      timestamp: new Date().toTimeString().split(' ')[0],
      currentTarget: currentFreq,
      nextTarget: best.frequency,
      predictedActivity: best.activityLikelihood > 80 ? 'HIGH' : best.activityLikelihood > 50 ? 'MEDIUM' : 'LOW',
      priority: predictedPrio,
      confidence: +confidence.toFixed(1),
      expectedInterceptTime: expectedTime,
      reasons,
      breakdown: {
        activityLikelihood: +best.activityLikelihood,
        historicalRelevance: +best.historicalHitRate,
        expectedReward: +(best.score * 100).toFixed(0),
        searchCost: best.cost < 6 ? 'LOW' : best.cost < 12 ? 'MEDIUM' : 'HIGH'
      },
      stepScores: scores.slice(0, 5).map(s => ({
        frequency: s.frequency,
        score: s.score,
        urgency: s.urgency,
        uncertainty: s.uncertainty
      }))
    };

    this.lastDecision = decision;
    return {
      bestTarget: best.frequency,
      decision
    };
  }

  /**
   * Online Learning Update: Update model weights & confidence following scan outcome
   */
  public updateFromScanResult(result: ScanResult): void {
    const stats = this.freqStats.get(result.frequency);
    if (!stats) return;

    stats.totalScans++;
    stats.lastScannedTime = this.tickCount;

    if (result.isHit) {
      stats.hits++;
      stats.lastHitTime = this.tickCount;
      // Exponential moving average for estimated duty cycle
      stats.estimatedDutyCycle = stats.estimatedDutyCycle * 0.85 + 0.15 * 1.0;
      stats.confidence = Math.min(99.0, stats.confidence + 1.8);
    } else {
      stats.estimatedDutyCycle = stats.estimatedDutyCycle * 0.90 + 0.10 * 0.0;
      stats.confidence = Math.max(50.0, stats.confidence - 0.9);
    }
  }

  public getLastDecision(): SchedulerDecision | null {
    return this.lastDecision;
  }
}
