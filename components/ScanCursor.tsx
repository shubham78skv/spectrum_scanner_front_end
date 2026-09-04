import React from 'react';
import { Radio, Crosshair, Zap, Activity } from 'lucide-react';

interface ScanCursorProps {
  currentFrequency: number;
  scanProgress: number;
  currentBand: string;
  scanMode: 'SMART' | 'BASELINE';
  dwellTimeMs?: number;
}

export const ScanCursor: React.FC<ScanCursorProps> = ({
  currentFrequency,
  scanProgress,
  currentBand,
  scanMode,
  dwellTimeMs = 120
}) => {
  return (
    <div className="bg-[#0d131d] border border-[#1f2e47] p-3 rounded-sm flex flex-wrap items-center justify-between gap-4 font-mono">
      {/* Current Frequency */}
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-sm ${
          scanMode === 'SMART' 
            ? 'bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/40 shadow-[0_0_10px_rgba(0,229,255,0.2)]' 
            : 'bg-[#ffb300]/10 text-[#ffb300] border border-[#ffb300]/40 shadow-[0_0_10px_rgba(255,179,0,0.2)]'
        }`}>
          <Crosshair size={18} className="animate-spin" style={{ animationDuration: '6s' }} />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-[#637b99]">
            CURRENT FREQUENCY
          </div>
          <div className="text-xl font-bold tracking-tight text-white flex items-baseline gap-1.5">
            <span className={scanMode === 'SMART' ? 'text-[#00e5ff]' : 'text-[#ffb300]'}>
              {currentFrequency.toFixed(2)}
            </span>
            <span className="text-xs text-[#637b99] font-normal">MHz</span>
          </div>
        </div>
      </div>

      {/* Current Band */}
      <div className="hidden sm:block">
        <div className="text-[10px] uppercase tracking-wider text-[#637b99]">
          CURRENT BAND
        </div>
        <div className="text-xs font-semibold text-[#c8d6e5] flex items-center gap-1.5">
          <Activity size={12} className="text-[#00e5ff]" />
          <span>{currentBand}</span>
        </div>
      </div>

      {/* Scan Mode */}
      <div>
        <div className="text-[10px] uppercase tracking-wider text-[#637b99]">
          SCAN MODE
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`px-2 py-0.5 text-xs font-bold rounded-sm border ${
            scanMode === 'SMART'
              ? 'bg-[#00e5ff]/15 text-[#00e5ff] border-[#00e5ff]/50'
              : 'bg-[#ffb300]/15 text-[#ffb300] border-[#ffb300]/50'
          }`}>
            {scanMode === 'SMART' ? '⚡ SMART SCAN (ML)' : '⟲ BASELINE (SWEEP)'}
          </span>
        </div>
      </div>

      {/* Scan Progress */}
      <div className="w-full sm:w-44 flex flex-col justify-center">
        <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-[#637b99] mb-1">
          <span>SCAN PROGRESS</span>
          <span className="text-white font-bold">{scanProgress}%</span>
        </div>
        <div className="w-full h-1.5 bg-[#152033] rounded-sm overflow-hidden relative">
          <div
            className={`h-full transition-all duration-150 ${
              scanMode === 'SMART' ? 'bg-[#00e5ff] shadow-[0_0_8px_#00e5ff]' : 'bg-[#ffb300] shadow-[0_0_8px_#ffb300]'
            }`}
            style={{ width: `${scanProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
