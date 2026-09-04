import React from 'react';
import { DecisionStep } from '../types';
import { 
  Eye, 
  Search, 
  Database, 
  BrainCircuit, 
  Sliders, 
  Crosshair, 
  CheckCircle, 
  GraduationCap,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface DecisionEngineProps {
  activeStep: DecisionStep;
  scanMode: 'SMART' | 'BASELINE';
}

interface PipelineStage {
  id: DecisionStep;
  label: string;
  subLabel: string;
  icon: React.ElementType;
}

export const DecisionEngine: React.FC<DecisionEngineProps> = ({
  activeStep,
  scanMode
}) => {
  const stages: PipelineStage[] = [
    { id: 'OBSERVE', label: 'OBSERVE', subLabel: 'Spectrum Trace', icon: Eye },
    { id: 'DETECT', label: 'DETECT', subLabel: 'Threshold / SNR', icon: Search },
    { id: 'UPDATE HISTORY', label: 'UPDATE HISTORY', subLabel: 'Duty Cycle Prior', icon: Database },
    { id: 'PREDICT', label: 'PREDICT', subLabel: 'Activity Likelihood', icon: BrainCircuit },
    { id: 'PRIORITIZE', label: 'PRIORITIZE', subLabel: 'Threat Matrix', icon: Sliders },
    { id: 'SELECT NEXT SCAN', label: 'SELECT NEXT SCAN', subLabel: 'Optimal Retune', icon: Crosshair },
    { id: 'EVALUATE HIT/MISS', label: 'EVALUATE HIT/MISS', subLabel: 'Reward / Cost', icon: CheckCircle },
    { id: 'LEARN', label: 'LEARN', subLabel: 'Bayesian Update', icon: GraduationCap },
  ];

  const getActiveIndex = () => stages.findIndex(s => s.id === activeStep);
  const activeIdx = getActiveIndex();

  return (
    <div className="bg-[#0d131d] border border-[#1f2e47] p-4 rounded-sm font-mono flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#152033] mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#00e5ff]/10 text-[#00e5ff] rounded-sm">
            <BrainCircuit size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              DECISION ENGINE
              <span className="text-[10px] text-[#00ff88] px-1.5 py-0.2 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-sm">
                CLOSED-LOOP ML PIPELINE
              </span>
            </h2>
            <p className="text-[10px] text-[#637b99]">
              Real-time sequential stage progression: Feedback loop from observation to policy update
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#637b99]">CURRENT STAGE:</span>
          <span className="text-[#00e5ff] font-bold px-2 py-0.5 bg-[#00e5ff]/10 border border-[#00e5ff]/30 rounded-xs">
            {activeStep}
          </span>
        </div>
      </div>

      {/* Horizontal Pipeline Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 relative">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isActive = stage.id === activeStep;
          const isPassed = idx < activeIdx;

          return (
            <div
              key={stage.id}
              className={`relative p-2.5 rounded-sm border transition-all duration-200 flex flex-col items-center text-center ${
                isActive
                  ? 'bg-[#00e5ff]/15 border-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.3)] scale-[1.02]'
                  : isPassed
                  ? 'bg-[#111927] border-[#1f2e47] text-[#8b9eb5]'
                  : 'bg-[#070a0f] border-[#152033] text-[#485e7a]'
              }`}
            >
              {/* Step Number Tag */}
              <div className="w-full flex items-center justify-between text-[9px] mb-1.5">
                <span className={`font-mono ${isActive ? 'text-[#00e5ff] font-bold' : 'text-[#485e7a]'}`}>
                  0{idx + 1}
                </span>
                {isActive && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e5ff] opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00e5ff]" />
                  </span>
                )}
              </div>

              {/* Stage Icon */}
              <div className={`p-1.5 rounded-sm mb-1.5 ${
                isActive 
                  ? 'bg-[#00e5ff] text-black' 
                  : isPassed 
                  ? 'bg-[#152033] text-[#00e5ff]' 
                  : 'bg-[#111927] text-[#485e7a]'
              }`}>
                <Icon size={14} />
              </div>

              {/* Stage Title */}
              <div className={`text-[10px] font-bold tracking-wider leading-tight uppercase ${
                isActive ? 'text-[#00e5ff]' : isPassed ? 'text-white' : 'text-[#637b99]'
              }`}>
                {stage.label}
              </div>

              {/* Stage Subtitle */}
              <div className="text-[8px] text-[#637b99] tracking-tight mt-0.5 truncate w-full">
                {stage.subLabel}
              </div>

              {/* Connecting Arrow for lg screens */}
              {idx < stages.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-[#1f2e47]">
                  <ArrowRight size={10} className={isActive ? 'text-[#00e5ff]' : ''} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Narrative Legend Bar */}
      <div className="mt-3 pt-2.5 border-t border-[#152033] flex flex-wrap items-center justify-between text-[10px] text-[#637b99]">
        <div className="flex items-center gap-2">
          <span className="text-[#00e5ff] font-bold">SMARTSCAN LOOP:</span>
          <span className="text-[#c8d6e5]">Observe → Detect → Predict → Prioritize → Scan → Evaluate → Learn</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[#00ff88]">● Active Step: Online</span>
          <span className="text-[#637b99]">Latency: ~1.8 ms</span>
        </div>
      </div>
    </div>
  );
};
