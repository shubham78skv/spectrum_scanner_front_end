export type ActivityState = 'ACTIVE' | 'INACTIVE' | 'INTERMITTENT';

export type SignalPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type SignalStatus = 'DETECTED' | 'TRACKING' | 'SEARCHING' | 'LOST' | 'UNCONFIRMED';

export type ScanMode = 'SMART' | 'BASELINE';

export type SchedulerState = 
  | 'ANALYZING...' 
  | 'TARGET SELECTED' 
  | 'SCANNING...' 
  | 'SIGNAL DETECTED' 
  | 'MODEL UPDATED';

export type DecisionStep = 
  | 'OBSERVE' 
  | 'DETECT' 
  | 'UPDATE HISTORY' 
  | 'PREDICT' 
  | 'PRIORITIZE' 
  | 'SELECT NEXT SCAN' 
  | 'EVALUATE HIT/MISS' 
  | 'LEARN';

export interface DecisionReason {
  id: string;
  text: string;
  type: 'positive' | 'neutral' | 'warning';
  score: number;
  weightLabel: string;
}

export interface Signal {
  id: string;
  emitterId: string;
  name: string;
  frequency: number; // in MHz
  strength: 'HIGH' | 'MEDIUM' | 'LOW';
  rawStrengthDbm: number;
  snr: number; // in dB
  bandwidthKHz: number;
  modulation: 'PULSE' | 'FMCW' | 'PRI-STAGGER' | 'BARKER' | 'CW';
  priority: SignalPriority;
  status: SignalStatus;
  confidence: number; // 0 - 100
  firstSeen: string;
  lastSeen: string;
  detectionCount: number;
  missCount: number;
  band: string;
  description: string;
}

export interface Emitter {
  id: string;
  name: string;
  frequency: number; // in MHz
  bandwidth: number; // in MHz
  activity: ActivityState;
  signalStrength: 'HIGH' | 'MEDIUM' | 'LOW';
  strengthDbm: number;
  snr: number; // in dB
  lastSeen: string;
  pattern: 'Periodic' | 'Hopping' | 'Burst' | 'Random' | 'Continuous';
  dutyCyclePct: number;
  pulseWidthUs: number;
  prfHz: number;
  isTransmitting: boolean;
  priority: SignalPriority;
  description: string;
  band: string;
  historicalHitRate: number;
}

export interface ScanResult {
  id: string;
  timestamp: string;
  scanIndex: number;
  frequency: number; // in MHz
  mode: ScanMode;
  isHit: boolean;
  signalDetected?: Signal;
  signalStrengthDbm: number;
  snr: number;
  noiseFloorDbm: number;
  interceptTimeSeconds: number;
  reward: number;
  cost: number;
  decisionReason: string;
  modelConfidence: number;
}

export interface SchedulerDecision {
  id: string;
  timestamp: string;
  currentTarget: number; // in MHz
  nextTarget: number; // in MHz
  predictedActivity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  priority: SignalPriority;
  confidence: number; // 0 - 100
  expectedInterceptTime: number; // in seconds
  reasons: DecisionReason[];
  breakdown: {
    activityLikelihood: number; // 0 - 100
    historicalRelevance: number; // 0 - 100
    expectedReward: number; // 0 - 100
    searchCost: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  stepScores: {
    frequency: number;
    score: number;
    urgency: number;
    uncertainty: number;
  }[];
}

export interface BaseMetrics {
  detectionRate: number; // percentage
  interceptionRate: number; // percentage
  avgInterceptTime: number; // in seconds
  falseAlarmRate: number; // percentage
  predictionAccuracy: number; // percentage
  missedSignals: number;
  totalScans: number;
  hits: number;
  misses: number;
  averageReward: number;
  averageCost: number;
  interceptionRatio: number;
}

export interface PerformanceMetrics extends BaseMetrics {
  probabilityOfDetection: number;
  probabilityOfFalseAlarm: number;
  averageInterceptRate: number;
  averageRewardCostRatio: number;
  percentageCorrectPredictions: number;
  avgInterceptTimeError: number;
  baseline: BaseMetrics;
  smart: BaseMetrics;
  detectionImprovementPct: number;
  timeReductionPct: number;
  missReductionPct: number;
}

export interface SpectrumDataPoint {
  frequency: number; // in MHz
  powerDbm: number;
  noiseFloorDbm: number;
  isSignal: boolean;
  emitterId?: string;
  isTargeted?: boolean;
  isScanned?: boolean;
  confidenceZone?: boolean;
}

export interface LearningEvent {
  id: string;
  scanIndex: number;
  timestamp: string;
  targetFrequency: number;
  isHit: boolean;
  previousConfidence: number;
  updatedConfidence: number;
  rewardChange: number;
  emitterName?: string;
  mode: ScanMode;
}

export interface ScanSession {
  sessionId: string;
  timestamp: string;
  duration: string;
  durationSeconds: number;
  mode: ScanMode;
  signalsDetected: number;
  misses: number;
  interceptionRate: number;
  avgInterceptTime: number;
  totalScans: number;
  accuracy: number;
  efficiencyGain: number;
}

export interface SimulationSettings {
  simSpeed: number; // 1x, 2x, 5x
  numberOfEmitters: number;
  signalActivityRate: number; // 0 - 100%
  noiseFloorDbm: number; // -100 to -70 dBm
  refreshRateMs: number;
  predictionThreshold: number; // 0 - 100%
  priorityWeight: number; // 0 - 1
  explorationRate: number; // 0 - 1 (epsilon)
  exploitationRate: number; // 0 - 1
  dwellTimeMs: number;
  startFreqMHz: number;
  stopFreqMHz: number;
  stepSizeMHz: number;
}

export interface ModelMetadata {
  modelName: string;
  architecture: string;
  status: 'ONLINE' | 'TRAINING' | 'UPDATING' | 'OFFLINE';
  trainingSamples: number;
  lastUpdate: string;
  learningRate: number;
  explorationEpsilon: number;
  featureDimension: number;
  inferenceLatencyMs: number;
}

export interface JudgeDemoState {
  isActive: boolean;
  currentPhase: number; // 1 to 8
  phaseName: string;
  phaseDescription: string;
  timeRemainingSeconds: number;
  isPaused: boolean;
  speed: number;
}
