import React from 'react';
import { Signal, Emitter, ScanResult } from '../types';
import { X, Radio, Activity, ShieldAlert, Cpu, CheckCircle2, History, Target } from 'lucide-react';

interface SignalDetailsProps {
  signal: Signal | null;
  emitter?: Emitter;
  recentResults: ScanResult[];
  onClose: () => void;
}

export const SignalDetails: React.FC<SignalDetailsProps> = ({
  signal,
  emitter,
  recentResults,
  onClose
}) => {
  if (!signal) return null;

  const matchingResults = recentResults.filter(r => 
    Math.abs(r.frequency - signal.frequency) < 2.0
  );

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-[#090e17] border-l border-[#1f2e47] shadow-2xl z-50 p-5 overflow-y-auto font-mono flex flex-col justify-between">
      <div>
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1f2e47] mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#00e5ff]/10 text-[#00e5ff] rounded-sm">
              <Radio size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                SIGNAL DOSSIER: {signal.id}
              </h2>
              <p className="text-[10px] text-[#637b99]">
                Tactical ESM Receiver Profile & Parameter Classification
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 bg-[#111927] hover:bg-[#152033] text-[#637b99] hover:text-white rounded-sm transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Primary Parameter Matrix */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <div className="bg-[#0d131d] p-3 rounded-sm border border-[#1f2e47]">
            <span className="text-[10px] text-[#637b99] uppercase block">Frequency</span>
            <span className="text-lg font-bold text-[#00e5ff]">{signal.frequency.toFixed(2)} MHz</span>
          </div>

          <div className="bg-[#0d131d] p-3 rounded-sm border border-[#1f2e47]">
            <span className="text-[10px] text-[#637b99] uppercase block">SNR / Power</span>
            <span className="text-lg font-bold text-[#00ff88]">{signal.snr} dB ({signal.rawStrengthDbm} dBm)</span>
          </div>

          <div className="bg-[#0d131d] p-3 rounded-sm border border-[#1f2e47]">
            <span className="text-[10px] text-[#637b99] uppercase block">Priority</span>
            <span className="text-sm font-bold text-[#ff3344] uppercase">{signal.priority}</span>
          </div>

          <div className="bg-[#0d131d] p-3 rounded-sm border border-[#1f2e47]">
            <span className="text-[10px] text-[#637b99] uppercase block">Confidence</span>
            <span className="text-sm font-bold text-[#00e5ff]">{signal.confidence.toFixed(1)}%</span>
          </div>
        </div>

        {/* Technical Emitter Metadata */}
        <div className="bg-[#0d131d] p-3.5 rounded-sm border border-[#1f2e47] mb-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Activity size={13} className="text-[#00e5ff]" />
            WAVEFORM & MODULATION
          </h3>
          <div className="space-y-1.5 text-xs text-[#8b9eb5]">
            <div className="flex justify-between">
              <span className="text-[#637b99]">Bandwidth:</span>
              <span className="text-white">{signal.bandwidthKHz} kHz</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#637b99]">Modulation:</span>
              <span className="text-[#00e5ff] font-bold">{signal.modulation}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#637b99]">Status:</span>
              <span className="text-[#00ff88]">{signal.status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#637b99]">First Detected:</span>
              <span className="text-[#c8d6e5]">{signal.firstSeen}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#637b99]">Last Intercepted:</span>
              <span className="text-white font-semibold">{signal.lastSeen}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#637b99]">Cumulative Detections:</span>
              <span className="text-[#00ff88] font-bold">{signal.detectionCount} hits</span>
            </div>
          </div>
        </div>

        {/* Tactical Rationale */}
        <div className="bg-[#0d131d] p-3.5 rounded-sm border border-[#1f2e47] mb-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Cpu size={13} className="text-[#00e5ff]" />
            SCHEDULER TACTICAL PROFILE
          </h3>
          <p className="text-xs text-[#c8d6e5] leading-relaxed mb-2">
            {signal.description}
          </p>
          <div className="p-2 bg-[#070a0f] rounded-xs border border-[#152033] text-[11px] text-[#00e5ff]">
            ✓ Priority weight assigned: {signal.priority === 'CRITICAL' ? '1.00 (Max Urgent)' : signal.priority === 'HIGH' ? '0.85 (High Duty)' : '0.60 (Medium)'}
          </div>
        </div>

        {/* Recent Hit/Miss Events for this Frequency */}
        <div className="bg-[#0d131d] p-3.5 rounded-sm border border-[#1f2e47]">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <History size={13} className="text-[#00e5ff]" />
            RECENT SCAN INTERCEPTS
          </h3>
          <div className="space-y-1.5 text-xs max-h-[140px] overflow-y-auto">
            {matchingResults.length > 0 ? (
              matchingResults.map((res, i) => (
                <div key={i} className="flex items-center justify-between p-1.5 bg-[#070a0f] rounded-xs text-[11px]">
                  <span className="text-[#637b99]">{res.timestamp}</span>
                  <span className="text-[#8b9eb5]">{res.mode}</span>
                  <span className={`font-bold ${res.isHit ? 'text-[#00ff88]' : 'text-[#ff3344]'}`}>
                    {res.isHit ? 'HIT (DETECTED)' : 'MISS'}
                  </span>
                  <span className="text-[#00e5ff]">{res.snr} dB</span>
                </div>
              ))
            ) : (
              <div className="text-[#637b99] text-xs py-2 text-center">
                Continuous background tracking active for {signal.frequency} MHz
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drawer Close CTA */}
      <div className="mt-4 pt-3 border-t border-[#1f2e47]">
        <button
          onClick={onClose}
          className="w-full py-2 bg-[#152033] hover:bg-[#1f2e47] text-white rounded-sm text-xs font-bold uppercase tracking-wider transition-colors"
        >
          CLOSE DOSSIER
        </button>
      </div>
    </div>
  );
};
