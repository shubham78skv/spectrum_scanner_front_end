import React from 'react';
import { ScanResult } from '../types';
import { Activity, CheckCircle2, XCircle, Clock, Zap } from 'lucide-react';

interface ActivityTimelineProps {
  recentResults: ScanResult[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  recentResults
}) => {
  return (
    <div className="bg-[#0d131d] border border-[#1f2e47] p-4 rounded-sm font-mono flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#152033] mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#00e5ff]/10 text-[#00e5ff] rounded-sm">
            <Activity size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              SIGNAL ACTIVITY TIMELINE
              <span className="text-[10px] text-[#00ff88] px-1.5 py-0.2 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-sm">
                LIVE INTERCEPTS
              </span>
            </h2>
            <p className="text-[10px] text-[#637b99]">
              Real-time temporal stream of scanner probes, hits, misses, and intercept latencies
            </p>
          </div>
        </div>

        <span className="text-xs text-[#637b99]">
          BUFFER: {recentResults.length} EVENTS
        </span>
      </div>

      {/* Events List */}
      <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
        {recentResults.length > 0 ? (
          recentResults.map((res) => (
            <div
              key={res.id}
              className="p-2 bg-[#070a0f] rounded-xs border border-[#152033] flex items-center justify-between text-xs hover:border-[#1f2e47] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className={`font-bold flex items-center gap-1 ${
                  res.isHit ? 'text-[#00ff88]' : 'text-[#ff3344]'
                }`}>
                  {res.isHit ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                  <span>{res.isHit ? 'HIT' : 'MISS'}</span>
                </span>

                <span className="text-white font-bold">
                  {res.frequency.toFixed(2)} MHz
                </span>

                <span className="text-[10px] px-1 py-0.2 bg-[#111927] text-[#8b9eb5] rounded-xs border border-[#1f2e47]">
                  {res.mode}
                </span>

                {res.snr > 0 && (
                  <span className="text-[11px] text-[#00e5ff] hidden sm:inline">
                    SNR: {res.snr} dB
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-[#637b99] text-[11px]">
                <span className="hidden md:inline truncate max-w-[200px]">
                  {res.decisionReason}
                </span>
                <span className="text-[#8b9eb5]">{res.timestamp}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-[#637b99] text-xs">
            WAITING FOR SCANNER TELEMETRY...
          </div>
        )}
      </div>

      {/* Footer Summary */}
      <div className="mt-2.5 pt-2 border-t border-[#152033] flex justify-between text-[10px] text-[#637b99]">
        <span>Continuous rolling intercept trace</span>
        <span className="text-[#00ff88]">ESM Receiver Active</span>
      </div>
    </div>
  );
};
