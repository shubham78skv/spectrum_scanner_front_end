import React from 'react';
import { SchedulerDecision, SchedulerState } from '../types';
import { Cpu, ArrowRight, Target, Clock, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface SchedulerPanelProps {
  decision: SchedulerDecision | null;
  status: SchedulerState;
  scanMode: 'SMART' | 'BASELINE';
}

export const SchedulerPanel: React.FC<SchedulerPanelProps> = ({
  decision,
  status,
  scanMode
}) => {
  const currentTarget = decision?.currentTarget || 104.99;
  const nextTarget = decision?.nextTarget || 116.79;
  const priority = decision?.priority || 'HIGH';
  const predictedActivity = decision?.predictedActivity || 'HIGH';
  const confidence = decision?.confidence || 93.4;
  const expectedInterceptTime = decision?.expectedInterceptTime || 2.4;

  const getStatusColor = () => {
    switch (status) {
      case 'ANALYZING...':
        return 'text-[#ffb300] bg-[#ffb300]/10 border-[#ffb300]/40';
      case 'TARGET SELECTED':
        return 'text-[#00e5ff] bg-[#00e5ff]/10 border-[#00e5ff]/40';
      case 'SCANNING...':
        return 'text-[#38bdf8] bg-[#38bdf8]/10 border-[#38bdf8]/40';
      case 'SIGNAL DETECTED':
        return 'text-[#00ff88] bg-[#00ff88]/10 border-[#00ff88]/40';
      case 'MODEL UPDATED':
        return 'text-[#b388ff] bg-[#b388ff]/10 border-[#b388ff]/40';
      default:
        return 'text-[#637b99] bg-[#152033] border-[#2a3f60]';
    }
  };

  const getPriorityBadgeColor = (prio: string) => {
    switch (prio) {
      case 'CRITICAL':
        return 'text-[#ff3344] bg-[#ff3344]/15 border-[#ff3344]/50';
      case 'HIGH':
        return 'text-[#00e5ff] bg-[#00e5ff]/15 border-[#00e5ff]/50';
      case 'MEDIUM':
        return 'text-[#ffb300] bg-[#ffb300]/15 border-[#ffb300]/50';
      default:
        return 'text-[#637b99] bg-[#637b99]/15 border-[#637b99]/50';
    }
  };

  return (
    <div className="bg-[#0d131d] border border-[#1f2e47] p-4 rounded-sm flex flex-col justify-between font-mono relative overflow-hidden">
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#152033] mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#00e5ff]/10 text-[#00e5ff] rounded-sm">
            <Cpu size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              AI SCAN SCHEDULER
            </h2>
            <p className="text-[10px] text-[#637b99]">
              {scanMode === 'SMART' ? 'Deep Contextual ESM Scheduler' : 'Sequential Sweep Engine (Baseline)'}
            </p>
          </div>
        </div>

        {/* Animated State Pill */}
        <div className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-sm border flex items-center gap-1.5 ${getStatusColor()}`}>
          <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
          <span>{status}</span>
        </div>
      </div>

      {/* Target Transition Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 bg-[#070a0f] p-3 rounded-sm border border-[#152033]">
        {/* Current Target */}
        <div className="flex flex-col">
          <span className="text-[10px] text-[#637b99] uppercase tracking-wider">
            CURRENT TARGET
          </span>
          <div className="text-xl font-bold text-white flex items-baseline gap-1 mt-0.5">
            <span>{currentTarget.toFixed(2)}</span>
            <span className="text-xs text-[#637b99] font-normal">MHz</span>
          </div>
        </div>

        {/* Next Target */}
        <div className="flex flex-col md:border-l md:border-[#152033] md:pl-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#00e5ff] uppercase tracking-wider font-semibold flex items-center gap-1">
              <Sparkles size={11} />
              NEXT TARGET
            </span>
            <span className="text-[9px] px-1 bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30 rounded-xs">
              RECOMMENDED
            </span>
          </div>
          <div className="text-xl font-bold text-[#00e5ff] flex items-baseline gap-1 mt-0.5">
            <span className="glow-cyan">{nextTarget.toFixed(2)}</span>
            <span className="text-xs text-[#637b99] font-normal">MHz</span>
          </div>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        {/* Priority */}
        <div className="bg-[#111927] p-2.5 rounded-sm border border-[#1f2e47]">
          <span className="text-[10px] text-[#637b99] uppercase block mb-1">
            PRIORITY
          </span>
          <span className={`inline-block px-1.5 py-0.5 text-[11px] font-bold rounded-xs border ${getPriorityBadgeColor(priority)}`}>
            {priority}
          </span>
        </div>

        {/* Predicted Activity */}
        <div className="bg-[#111927] p-2.5 rounded-sm border border-[#1f2e47]">
          <span className="text-[10px] text-[#637b99] uppercase block mb-1">
            PREDICTED ACTIVITY
          </span>
          <span className="text-sm font-bold text-[#00ff88]">
            {predictedActivity}
          </span>
        </div>

        {/* Model Confidence */}
        <div className="bg-[#111927] p-2.5 rounded-sm border border-[#1f2e47]">
          <span className="text-[10px] text-[#637b99] uppercase block mb-1">
            MODEL CONFIDENCE
          </span>
          <span className="text-sm font-bold text-[#00e5ff]">
            {confidence.toFixed(1)}%
          </span>
        </div>

        {/* Expected Intercept Time */}
        <div className="bg-[#111927] p-2.5 rounded-sm border border-[#1f2e47]">
          <span className="text-[10px] text-[#637b99] uppercase block mb-1">
            EXP. INTERCEPT TIME
          </span>
          <span className="text-sm font-bold text-white flex items-baseline gap-0.5">
            <span>{expectedInterceptTime}</span>
            <span className="text-[10px] text-[#637b99] font-normal">s</span>
          </span>
        </div>
      </div>
    </div>
  );
};
