import React from 'react';
import { useSpectrumSimulation } from '../hooks/useSpectrumSimulation';
import { SignalTable } from '../components/SignalTable';
import { SignalDetails } from '../components/SignalDetails';
import { RFEnvironment } from '../components/RFEnvironment';
import { MetricCard } from '../components/MetricCard';
import { SignalHigh, Radio, ShieldAlert, Cpu, Sparkles, Filter } from 'lucide-react';

interface SignalsProps {
  sim: ReturnType<typeof useSpectrumSimulation>;
}

export const Signals: React.FC<SignalsProps> = ({ sim }) => {
  const criticalCount = sim.signals.filter(s => s.priority === 'CRITICAL').length;
  const highCount = sim.signals.filter(s => s.priority === 'HIGH').length;
  const trackingCount = sim.signals.filter(s => s.status === 'TRACKING' || s.status === 'DETECTED').length;

  return (
    <div className="space-y-4 pb-8 font-mono">
      {/* Page Header */}
      <div className="bg-[#0d131d] border border-[#1f2e47] p-4 rounded-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#00e5ff]/10 text-[#00e5ff] rounded-sm border border-[#00e5ff]/30">
            <SignalHigh size={20} />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              DETECTED SIGNALS & EMITTER DIRECTORY
              <span className="text-xs px-2 py-0.5 bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30 rounded-xs">
                {sim.signals.length} ACTIVE CLASSIFICATIONS
              </span>
            </h1>
            <p className="text-xs text-[#637b99]">
              Comprehensive electronic intelligence ledger with modulation type, SNR, PRI/PRF, and threat weighting
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-[#637b99]">ACTIVE RECEIVER:</span>
          <span className="text-xs font-bold text-[#00ff88] px-2 py-1 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-xs">
            WIDEBAND ESM CH-1
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          label="TOTAL SIGNALS LOGGED"
          value={sim.signals.length}
          subValue="Simulated VHF/UHF"
          variant="cyan"
        />
        <MetricCard
          label="CRITICAL THREAT TARGETS"
          value={criticalCount}
          subValue="Fire Control & Trackers"
          variant="red"
        />
        <MetricCard
          label="HIGH PRIORITY SIGNALS"
          value={highCount}
          subValue="Surveillance & Bursts"
          variant="amber"
        />
        <MetricCard
          label="ACTIVE TRACKING LOCK"
          value={trackingCount}
          subValue="Continuous State"
          variant="green"
        />
      </div>

      {/* Main Signal Directory Table */}
      <SignalTable
        signals={sim.signals}
        onSelectSignal={(s) => sim.setSelectedSignal(s)}
        selectedSignalId={sim.selectedSignal?.id}
      />

      {/* Simulated RF Emitter Rack */}
      <RFEnvironment
        emitters={sim.emitters}
        onToggleEmitter={sim.toggleEmitterActive}
        onInjectPulse={sim.injectEmitterPulse}
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
