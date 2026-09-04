import React from 'react';
import { useSpectrumSimulation } from '../hooks/useSpectrumSimulation';
import { SpectrumChart } from '../components/SpectrumChart';
import { ScanCursor } from '../components/ScanCursor';
import { SchedulerPanel } from '../components/SchedulerPanel';
import { DecisionExplanation } from '../components/DecisionExplanation';
import { DecisionEngine } from '../components/DecisionEngine';
import { PerformanceComparison } from '../components/PerformanceComparison';
import { ActivityTimeline } from '../components/ActivityTimeline';
import { LearningPanel } from '../components/LearningPanel';
import { RFEnvironment } from '../components/RFEnvironment';
import { SignalTable } from '../components/SignalTable';
import { SignalDetails } from '../components/SignalDetails';
import { JudgeDemo } from '../components/JudgeDemo';
import { MetricCard } from '../components/MetricCard';
import { Radio, Crosshair, TrendingUp, Zap, Clock, ShieldCheck } from 'lucide-react';

interface DashboardProps {
  sim: ReturnType<typeof useSpectrumSimulation>;
}

export const Dashboard: React.FC<DashboardProps> = ({ sim }) => {
  return (
    <div className="space-y-4 pb-8">
      {/* Automated Judge Demo Banner (if active or ready) */}
      <JudgeDemo
        demoState={sim.judgeDemo}
        onStartDemo={sim.startJudgeDemo}
        onPauseDemo={sim.pauseJudgeDemo}
        onSetSpeed={sim.setJudgeDemoSpeed}
        onReset={sim.resetSimulation}
        metrics={sim.metrics}
      />

      {/* Top Telemetry KPI Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard
          label="PROBABILITY OF DETECTION"
          value={`${(sim.metrics.probabilityOfDetection * 100).toFixed(1)}%`}
          delta={{ value: `+${sim.metrics.detectionImprovementPct.toFixed(1)}%`, isPositive: true, label: 'vs baseline' }}
          variant="green"
          isSimulationLabel
        />
        <MetricCard
          label="INTERCEPTION RATE"
          value={`${sim.metrics.averageInterceptRate.toFixed(1)}%`}
          delta={{ value: `+${(sim.metrics.smart.interceptionRate - sim.metrics.baseline.interceptionRate).toFixed(1)}%`, isPositive: true }}
          variant="cyan"
          isSimulationLabel
        />
        <MetricCard
          label="AVG INTERCEPT TIME"
          value={`${sim.metrics.smart.avgInterceptTime.toFixed(1)}`}
          unit="s"
          delta={{ value: `-${sim.metrics.timeReductionPct.toFixed(1)}%`, isPositive: true, label: 'faster' }}
          variant="cyan"
          isSimulationLabel
        />
        <MetricCard
          label="FALSE ALARM PROB (PFA)"
          value={`${(sim.metrics.probabilityOfFalseAlarm * 100).toFixed(1)}%`}
          delta={{ value: `${sim.metrics.smart.falseAlarmRate < 3 ? 'LOW' : 'NORMAL'}`, isPositive: true }}
          variant="amber"
          isSimulationLabel
        />
        <MetricCard
          label="PREDICTION ACCURACY"
          value={`${sim.metrics.percentageCorrectPredictions.toFixed(1)}%`}
          delta={{ value: 'Online Q-MAB', isPositive: true }}
          variant="green"
          isSimulationLabel
        />
        <MetricCard
          label="REWARD / COST RATIO"
          value={`${sim.metrics.averageRewardCostRatio.toFixed(1)}x`}
          delta={{ value: 'OPTIMAL', isPositive: true }}
          variant="cyan"
          isSimulationLabel
        />
      </div>

      {/* Instantaneous Scan Cursor Banner */}
      <ScanCursor
        currentFrequency={sim.currentFrequency}
        scanProgress={sim.scanProgress}
        currentBand={sim.currentBand}
        scanMode={sim.scanMode}
        dwellTimeMs={sim.settings.dwellTimeMs}
      />

      {/* Primary Section: LIVE SPECTRUM + AI SCAN SCHEDULER & WHY EXPLANATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Live Spectrum Chart (7 cols on lg) */}
        <div className="lg:col-span-7">
          <SpectrumChart
            spectrumData={sim.spectrumData}
            currentFrequency={sim.currentFrequency}
            predictedTarget={sim.currentDecision?.nextTarget || 116.79}
            detectedSignals={sim.signals}
            emitters={sim.emitters}
            scanMode={sim.scanMode}
            onFrequencyClick={(freq) => sim.injectEmitterPulse(freq)}
          />
        </div>

        {/* AI Scan Scheduler + Why This Target? (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          <SchedulerPanel
            decision={sim.currentDecision}
            status={sim.schedulerStatus}
            scanMode={sim.scanMode}
          />
          <DecisionExplanation
            decision={sim.currentDecision}
          />
        </div>
      </div>

      {/* Secondary Section: PERFORMANCE COMPARISON + DECISION ENGINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Performance Comparison (5 cols on lg) */}
        <div className="lg:col-span-5">
          <PerformanceComparison
            metrics={sim.metrics}
          />
        </div>

        {/* Decision Engine Closed-Loop Pipeline (7 cols on lg) */}
        <div className="lg:col-span-7">
          <DecisionEngine
            activeStep={sim.activeDecisionStep}
            scanMode={sim.scanMode}
          />
        </div>
      </div>

      {/* Tertiary Section: SIGNAL ACTIVITY TIMELINE + ADAPTIVE LEARNING */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Signal Activity Timeline (6 cols on lg) */}
        <div className="lg:col-span-6">
          <ActivityTimeline
            recentResults={sim.recentScanResults}
          />
        </div>

        {/* Adaptive Learning Panel (6 cols on lg) */}
        <div className="lg:col-span-6">
          <LearningPanel
            learningEvents={sim.learningEvents}
            metrics={sim.metrics}
          />
        </div>
      </div>

      {/* Quaternary Section: SIMULATED RF ENVIRONMENT */}
      <div>
        <RFEnvironment
          emitters={sim.emitters}
          onToggleEmitter={sim.toggleEmitterActive}
          onInjectPulse={sim.injectEmitterPulse}
        />
      </div>

      {/* Quinary Section: DETECTED SIGNALS TABLE */}
      <div>
        <SignalTable
          signals={sim.signals}
          onSelectSignal={(s) => sim.setSelectedSignal(s)}
          selectedSignalId={sim.selectedSignal?.id}
        />
      </div>

      {/* Signal Details Modal/Drawer */}
      <SignalDetails
        signal={sim.selectedSignal}
        emitter={sim.emitters.find(e => e.id === sim.selectedSignal?.emitterId)}
        recentResults={sim.recentScanResults}
        onClose={() => sim.setSelectedSignal(null)}
      />
    </div>
  );
};
