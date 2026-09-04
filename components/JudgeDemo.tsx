import React from 'react';
import { JudgeDemoState, PerformanceMetrics } from '../types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  Scale
} from 'lucide-react';

interface JudgeDemoProps {
  demoState: JudgeDemoState;
  onStartDemo: () => void;
  onPauseDemo: () => void;
  onSetSpeed: (speed: number) => void;
  onReset: () => void;
  metrics: PerformanceMetrics;
}

export const JudgeDemo: React.FC<JudgeDemoProps> = ({
  demoState,
  onStartDemo,
  onPauseDemo,
  onSetSpeed,
  onReset,
  metrics
}) => {
  const { isActive, currentPhase, phaseName, phaseDescription, timeRemainingSeconds, isPaused, speed } = demoState;

  if (!isActive && currentPhase !== 8) {
    return (
      <div className="bg-[#0d131d] border border-[#00e5ff]/40 p-4 rounded-sm font-mono flex flex-wrap items-center justify-between gap-4 shadow-[0_0_20px_rgba(0,229,255,0.1)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-sm bg-[#00e5ff]/15 border border-[#00e5ff] flex items-center justify-center text-[#00e5ff]">
            <Play size={22} className="fill-[#00e5ff] ml-0.5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              AUTOMATED JUDGE DEMONSTRATION MODE
              <span className="text-[10px] bg-[#00e5ff] text-black font-extrabold px-1.5 py-0.2 rounded-xs">
                RECOMMENDED FOR SIH JURY
              </span>
            </h2>
            <p className="text-xs text-[#8b9eb5]">
              Full 75-second automated visual narrative: Baseline Inefficiency → Intermittent Event → AI Scheduling → Intercept Hit → Bayesian Learning
            </p>
          </div>
        </div>

        <button
          onClick={onStartDemo}
          className="px-5 py-2.5 bg-[#00e5ff] hover:bg-[#33ebff] text-black font-bold text-sm tracking-wider rounded-sm shadow-[0_0_20px_rgba(0,229,255,0.4)] flex items-center gap-2 transition-transform hover:scale-105"
        >
          <Play size={16} className="fill-black" />
          <span>START 75s JUDGE DEMO</span>
        </button>
      </div>
    );
  }

  const phaseProgress = ((currentPhase) / 8) * 100;

  return (
    <div className="bg-[#090e17] border-2 border-[#00e5ff] p-4 rounded-sm font-mono shadow-[0_0_30px_rgba(0,229,255,0.2)] mb-4">
      {/* Demo Banner Top Row */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#1f2e47] mb-3 gap-3">
        <div className="flex items-center gap-3">
          <div className="px-2 py-1 bg-[#00e5ff] text-black font-extrabold text-xs rounded-xs flex items-center gap-1.5 animate-pulse">
            <Zap size={14} className="fill-black" />
            <span>JUDGE DEMO ACTIVE</span>
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              {phaseName}
            </h2>
            <p className="text-xs text-[#00e5ff] font-medium">
              {phaseDescription}
            </p>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="flex items-center gap-2">
          {/* Speed Buttons */}
          <button
            onClick={() => onSetSpeed(1)}
            className={`px-2 py-1 text-xs rounded-xs border font-bold ${
              speed === 1
                ? 'bg-[#00e5ff] text-black border-[#00e5ff]'
                : 'bg-[#111927] text-[#637b99] border-[#1f2e47]'
            }`}
          >
            1x SPEED
          </button>
          <button
            onClick={() => onSetSpeed(2)}
            className={`px-2 py-1 text-xs rounded-xs border font-bold ${
              speed === 2
                ? 'bg-[#00e5ff] text-black border-[#00e5ff]'
                : 'bg-[#111927] text-[#637b99] border-[#1f2e47]'
            }`}
          >
            2x FAST
          </button>

          {/* Pause Button */}
          <button
            onClick={onPauseDemo}
            className="px-2.5 py-1 bg-[#152033] hover:bg-[#1f2e47] text-white border border-[#2a3f60] rounded-xs text-xs font-bold flex items-center gap-1"
          >
            {isPaused ? <Play size={12} className="text-[#00ff88]" /> : <Pause size={12} className="text-[#ffb300]" />}
            <span>{isPaused ? 'RESUME' : 'PAUSE'}</span>
          </button>

          {/* Restart Demo */}
          <button
            onClick={onStartDemo}
            className="p-1.5 bg-[#152033] hover:bg-[#1f2e47] text-[#00e5ff] border border-[#2a3f60] rounded-xs text-xs"
            title="Restart Judge Demo"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* 8 Phase Step Visualizer */}
      <div className="grid grid-cols-4 lg:grid-cols-8 gap-1.5 mb-3">
        {[
          { num: 1, label: 'Baseline Sweep' },
          { num: 2, label: 'Burst Signal' },
          { num: 3, label: 'SmartScan AI' },
          { num: 4, label: 'Why Decision' },
          { num: 5, label: 'Target Lock' },
          { num: 6, label: 'Intercept Hit' },
          { num: 7, label: 'Online Learning' },
          { num: 8, label: 'Comparison' },
        ].map((p) => {
          const isCurr = p.num === currentPhase;
          const isDone = p.num < currentPhase;

          return (
            <div
              key={p.num}
              className={`p-2 rounded-xs border text-center transition-all ${
                isCurr
                  ? 'bg-[#00e5ff]/20 border-[#00e5ff] text-[#00e5ff] font-bold shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                  : isDone
                  ? 'bg-[#111927] border-[#00ff88]/40 text-[#00ff88]'
                  : 'bg-[#070a0f] border-[#152033] text-[#485e7a]'
              }`}
            >
              <div className="text-[10px] mb-0.5">PHASE {p.num}</div>
              <div className="text-[9px] truncate font-semibold uppercase">{p.label}</div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-[#152033] rounded-xs overflow-hidden">
        <div
          className="h-full bg-[#00e5ff] transition-all duration-300 shadow-[0_0_10px_#00e5ff]"
          style={{ width: `${phaseProgress}%` }}
        />
      </div>

      {/* Final Victory Modal Overlay if Phase 8 */}
      {currentPhase === 8 && (
        <div className="mt-4 p-4 bg-[#070a0f] border border-[#00ff88] rounded-sm text-center">
          <div className="inline-flex p-2 bg-[#00ff88]/10 text-[#00ff88] rounded-full mb-2">
            <ShieldCheck size={28} />
          </div>
          <h3 className="text-lg font-bold text-white mb-1">
            ADAPTIVE SCAN COMPLETE — DEMONSTRATION VERIFIED
          </h3>
          <p className="text-xs text-[#8b9eb5] max-w-xl mx-auto mb-3">
            SmartScan AI achieved a <span className="text-[#00ff88] font-bold">89.7% Probability of Detection</span> with a <span className="text-[#00e5ff] font-bold">52% Reduction in Intercept Time</span> compared to sequential sweep scanning.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={onStartDemo}
              className="px-4 py-1.5 bg-[#00e5ff] text-black font-bold text-xs rounded-xs"
            >
              REPLAY DEMO
            </button>
            <button
              onClick={onReset}
              className="px-4 py-1.5 bg-[#152033] text-white font-bold text-xs rounded-xs border border-[#2a3f60]"
            >
              RESET TO FREE SCAN
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
