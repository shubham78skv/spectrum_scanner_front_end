import React from 'react';
import { Emitter } from '../types';
import { Radio, Zap, Activity, Waves, Power } from 'lucide-react';

interface RFEnvironmentProps {
  emitters: Emitter[];
  onToggleEmitter?: (id: string) => void;
  onInjectPulse?: (freq: number) => void;
}

export const RFEnvironment: React.FC<RFEnvironmentProps> = ({
  emitters,
  onToggleEmitter,
  onInjectPulse
}) => {
  const getActivityBadge = (activity: string, isTransmitting: boolean) => {
    if (isTransmitting) {
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/40 rounded-xs flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
          ACTIVE (TX)
        </span>
      );
    }
    if (activity === 'INTERMITTENT') {
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold bg-[#ffb300]/15 text-[#ffb300] border border-[#ffb300]/40 rounded-xs flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ffb300]" />
          INTERMITTENT
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 text-[10px] font-bold bg-gray-800 text-gray-400 border border-gray-700 rounded-xs flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
        INACTIVE
      </span>
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'text-[#ff3344]';
      case 'HIGH': return 'text-[#00e5ff]';
      case 'MEDIUM': return 'text-[#ffb300]';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-[#0d131d] border border-[#1f2e47] p-4 rounded-sm font-mono flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-2.5 border-b border-[#152033] mb-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#00e5ff]/10 text-[#00e5ff] rounded-sm">
            <Radio size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              SIMULATED RF ENVIRONMENT
              <span className="text-[9px] px-1.5 py-0.2 bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30 rounded-xs uppercase">
                5 SYNTHETIC EMITTERS
              </span>
            </h2>
            <p className="text-[10px] text-[#637b99]">
              Simulated RF emitters with stochastic burst patterns and transmission states
            </p>
          </div>
        </div>

        <div className="text-[10px] text-[#637b99] hidden sm:block">
          Click <span className="text-[#00e5ff]">"TRIGGER PULSE"</span> to test AI adaptation
        </div>
      </div>

      {/* Emitter Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {emitters.map((emitter) => (
          <div
            key={emitter.id}
            className={`p-3 rounded-sm border transition-all duration-150 flex flex-col justify-between ${
              emitter.isTransmitting
                ? 'bg-[#111927] border-[#00ff88]/50 shadow-[0_0_12px_rgba(0,255,136,0.12)]'
                : 'bg-[#070a0f] border-[#152033]'
            }`}
          >
            {/* Top Tag & Status */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white tracking-wide">
                  {emitter.id}
                </span>
                <span className={`text-[10px] font-bold ${getPriorityColor(emitter.priority)}`}>
                  {emitter.priority}
                </span>
              </div>

              <div className="mb-2">
                {getActivityBadge(emitter.activity, emitter.isTransmitting)}
              </div>

              {/* Specs */}
              <div className="space-y-1 text-[11px] text-[#8b9eb5] pt-2 border-t border-[#152033]">
                <div className="flex justify-between">
                  <span className="text-[#637b99]">Freq:</span>
                  <span className="text-white font-bold">{emitter.frequency} MHz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#637b99]">Power:</span>
                  <span className="text-[#c8d6e5]">{emitter.strengthDbm} dBm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#637b99]">SNR:</span>
                  <span className={emitter.snr > 15 ? 'text-[#00ff88]' : 'text-[#ffb300]'}>
                    {emitter.snr} dB
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#637b99]">Pattern:</span>
                  <span className="text-[#00e5ff]">{emitter.pattern}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#637b99]">Last Seen:</span>
                  <span className="text-[#8b9eb5]">{emitter.lastSeen}</span>
                </div>
              </div>
            </div>

            {/* Interactive Control Buttons */}
            <div className="mt-3 pt-2 border-t border-[#152033] flex items-center gap-1.5">
              <button
                onClick={() => onToggleEmitter && onToggleEmitter(emitter.id)}
                title="Toggle Emitter On/Off"
                className={`flex-1 py-1 text-[10px] rounded-xs font-bold transition-colors flex items-center justify-center gap-1 border ${
                  emitter.isTransmitting
                    ? 'bg-[#ff3344]/15 text-[#ff3344] border-[#ff3344]/40 hover:bg-[#ff3344]/30'
                    : 'bg-[#00ff88]/15 text-[#00ff88] border-[#00ff88]/40 hover:bg-[#00ff88]/30'
                }`}
              >
                <Power size={10} />
                <span>{emitter.isTransmitting ? 'DISABLE' : 'ENABLE'}</span>
              </button>

              <button
                onClick={() => onInjectPulse && onInjectPulse(emitter.frequency)}
                title="Inject Intermittent Burst Pulse"
                className="px-2 py-1 bg-[#00e5ff]/10 hover:bg-[#00e5ff]/25 border border-[#00e5ff]/40 text-[#00e5ff] rounded-xs text-[10px] font-bold flex items-center gap-0.5"
              >
                <Zap size={10} />
                <span>PULSE</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Security notice */}
      <div className="mt-2.5 pt-2 border-t border-[#152033] text-[9px] text-[#637b99] flex justify-between">
        <span>Fictional simulated emitters for academic evaluation. DRDO Hackathon PS-26055</span>
        <span className="text-[#00ff88]">Dynamic RF Synthesis Active</span>
      </div>
    </div>
  );
};
