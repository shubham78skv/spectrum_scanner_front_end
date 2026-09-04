import React from 'react';
import { useSpectrumSimulation } from '../hooks/useSpectrumSimulation';
import { SpectrumChart } from '../components/SpectrumChart';
import { ScanCursor } from '../components/ScanCursor';
import { SchedulerPanel } from '../components/SchedulerPanel';
import { DecisionExplanation } from '../components/DecisionExplanation';
import { SignalTable } from '../components/SignalTable';
import { SignalDetails } from '../components/SignalDetails';
import { 
  Play, 
  Pause, 
  Square, 
  SlidersHorizontal, 
  Zap, 
  Radio, 
  Crosshair, 
  Gauge,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

interface ScanProps {
  sim: ReturnType<typeof useSpectrumSimulation>;
}

export const Scan: React.FC<ScanProps> = ({ sim }) => {
  return (
    <div className="space-y-4 pb-8 font-mono">
      {/* Page Title & Control Bar */}
      <div className="bg-[#0d131d] border border-[#1f2e47] p-4 rounded-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
            ESM SCANNING WORKBENCH
            <span className="text-xs px-2 py-0.5 bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30 rounded-xs">
              LIVE RECEIVER CONTROLS
            </span>
          </h1>
          <p className="text-xs text-[#637b99]">
            Configure strategy: Dynamic AI Targeted Scheduling vs Conventional Sequential Sweep
          </p>
        </div>

        {/* Primary Scanner Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Start / Pause */}
          <button
            onClick={sim.togglePause}
            className={`px-4 py-2 rounded-sm text-xs font-bold flex items-center gap-1.5 transition-all ${
              sim.isPaused
                ? 'bg-[#00ff88] text-black hover:bg-[#33ff9f] shadow-[0_0_12px_rgba(0,255,136,0.3)]'
                : 'bg-[#ffb300] text-black hover:bg-[#ffc533] shadow-[0_0_12px_rgba(255,179,0,0.3)]'
            }`}
          >
            {sim.isPaused ? <Play size={14} className="fill-black" /> : <Pause size={14} className="fill-black" />}
            <span>{sim.isPaused ? 'START SCAN' : 'PAUSE SCAN'}</span>
          </button>

          {/* Stop / Reset */}
          <button
            onClick={sim.resetSimulation}
            className="px-3 py-2 bg-[#152033] hover:bg-[#1f2e47] text-[#c8d6e5] border border-[#2a3f60] rounded-sm text-xs font-bold flex items-center gap-1.5"
          >
            <Square size={13} />
            <span>STOP / RESET</span>
          </button>

          {/* Mode Switch Buttons */}
          <div className="flex items-center border border-[#1f2e47] rounded-sm overflow-hidden bg-[#070a0f] p-0.5">
            <button
              onClick={() => sim.toggleScanMode('SMART')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xs transition-all flex items-center gap-1 ${
                sim.scanMode === 'SMART'
                  ? 'bg-[#00e5ff] text-black shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                  : 'text-[#637b99] hover:text-white'
              }`}
            >
              <Zap size={12} />
              <span>SMART (AI)</span>
            </button>
            <button
              onClick={() => sim.toggleScanMode('BASELINE')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xs transition-all flex items-center gap-1 ${
                sim.scanMode === 'BASELINE'
                  ? 'bg-[#ffb300] text-black shadow-[0_0_10px_rgba(255,179,0,0.4)]'
                  : 'text-[#637b99] hover:text-white'
              }`}
            >
              <Radio size={12} />
              <span>BASELINE (SWEEP)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode Operational Difference Explanation Callout */}
      <div className={`p-3 rounded-sm border flex items-start gap-3 ${
        sim.scanMode === 'SMART'
          ? 'bg-[#00e5ff]/10 border-[#00e5ff]/40 text-[#00e5ff]'
          : 'bg-[#ffb300]/10 border-[#ffb300]/40 text-[#ffb300]'
      }`}>
        <ShieldAlert size={18} className="shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <span className="font-bold uppercase tracking-wider block">
            {sim.scanMode === 'SMART'
              ? '⚡ SMART SCAN MODE ACTIVE — Contextual Multi-Armed Bandit'
              : '⟲ BASELINE MODE ACTIVE — Open-Loop Fixed Step Sequential Sweep'}
          </span>
          <p className="text-[#c8d6e5] text-[11px] leading-relaxed">
            {sim.scanMode === 'SMART'
              ? 'The receiver evaluates prior hit rates, emitter pulse duty cycles, and switching costs to jump straight to high-probability frequency bins. Intercept time is minimized and intermittent radars are captured instantly.'
              : 'The receiver steps through frequencies monotonically from 100 MHz to 200 MHz in fixed 2.5 MHz steps. It dwells equally on empty spectrum, causing high latency and missed intermittent burst signals.'}
          </p>
        </div>
      </div>

      {/* Scan Telemetry Bar */}
      <ScanCursor
        currentFrequency={sim.currentFrequency}
        scanProgress={sim.scanProgress}
        currentBand={sim.currentBand}
        scanMode={sim.scanMode}
        dwellTimeMs={sim.settings.dwellTimeMs}
      />

      {/* Main Spectrum & Scheduler Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
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

        <div className="lg:col-span-4 space-y-4">
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

      {/* Live Detected Signals Directory */}
      <SignalTable
        signals={sim.signals}
        onSelectSignal={(s) => sim.setSelectedSignal(s)}
        selectedSignalId={sim.selectedSignal?.id}
      />

      {/* Signal Drawer */}
      <SignalDetails
        signal={sim.selectedSignal}
        emitter={sim.emitters.find(e => e.id === sim.selectedSignal?.emitterId)}
        recentResults={sim.recentScanResults}
        onClose={() => sim.setSelectedSignal(null)}
      />
    </div>
  );
};
