import React from 'react';
import { 
  Play, 
  RotateCcw, 
  Radio, 
  Cpu, 
  Activity, 
  Clock, 
  SlidersHorizontal,
  Maximize2,
  Minimize2,
  HelpCircle,
  Pause
} from 'lucide-react';
import { StatusIndicator } from './StatusIndicator';

interface TopBarProps {
  simTime: string;
  isPaused: boolean;
  presentationMode: boolean;
  onTogglePresentation: () => void;
  onStartDemo: () => void;
  onResetSimulation: () => void;
  onTogglePause: () => void;
  isDemoActive: boolean;
  activePhaseName?: string;
  scanMode: 'SMART' | 'BASELINE';
  onToggleMode: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  simTime,
  isPaused,
  presentationMode,
  onTogglePresentation,
  onStartDemo,
  onResetSimulation,
  onTogglePause,
  isDemoActive,
  activePhaseName,
  scanMode,
  onToggleMode
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#070a0f] border-b border-[#1f2e47] px-4 py-2.5 flex items-center justify-between gap-4">
      {/* Brand & Subtitle */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-sm bg-[#00e5ff]/10 border border-[#00e5ff]/40 flex items-center justify-center text-[#00e5ff] shadow-[0_0_12px_rgba(0,229,255,0.25)]">
          <Radio size={18} className="animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-mono font-bold tracking-wider text-white flex items-center gap-1.5">
              SMARTSCAN <span className="text-[#00e5ff]">AI</span>
            </h1>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#152033] border border-[#2a3f60] text-[#00e5ff] uppercase tracking-wider rounded-sm">
              DRDO PS-26055
            </span>
          </div>
          <p className="text-[10px] font-mono tracking-widest text-[#637b99] uppercase">
            Adaptive Spectrum Intelligence & Smart Scan Scheduling
          </p>
        </div>
      </div>

      {/* Global Status Telemetry */}
      <div className="hidden lg:flex items-center gap-6 px-4 py-1.5 bg-[#0d131d] border border-[#1f2e47] rounded-sm">
        {/* Sim Time */}
        <div className="flex items-center gap-2">
          <Clock size={13} className="text-[#637b99]" />
          <div className="flex flex-col">
            <span className="text-[9px] font-mono text-[#637b99] tracking-wider uppercase">SIM TIME</span>
            <span className="text-xs font-mono font-semibold text-white tracking-widest">{simTime}</span>
          </div>
        </div>

        <div className="w-px h-6 bg-[#1f2e47]" />

        {/* Receiver Status */}
        <div className="flex items-center gap-2">
          <Activity size={13} className="text-[#00ff88]" />
          <div className="flex flex-col">
            <span className="text-[9px] font-mono text-[#637b99] tracking-wider uppercase">RECEIVER</span>
            <span className="text-xs font-mono font-semibold text-[#00ff88]">
              {isPaused ? 'PAUSED' : 'ONLINE'}
            </span>
          </div>
        </div>

        <div className="w-px h-6 bg-[#1f2e47]" />

        {/* Model Status */}
        <div className="flex items-center gap-2">
          <Cpu size={13} className="text-[#00e5ff]" />
          <div className="flex flex-col">
            <span className="text-[9px] font-mono text-[#637b99] tracking-wider uppercase">MODEL</span>
            <span className="text-xs font-mono font-semibold text-[#00e5ff]">READY (ONLINE)</span>
          </div>
        </div>

        <div className="w-px h-6 bg-[#1f2e47]" />

        {/* Data Stream */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff88] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff88]" />
          </span>
          <div className="flex flex-col">
            <span className="text-[9px] font-mono text-[#637b99] tracking-wider uppercase">DATA STREAM</span>
            <span className="text-xs font-mono font-semibold text-white">LIVE (SIMULATED)</span>
          </div>
        </div>
      </div>

      {/* Action Controls & Demo Launcher */}
      <div className="flex items-center gap-2.5">
        {/* Mode Toggle Button */}
        <button
          onClick={onToggleMode}
          title="Toggle scan mode between SmartScan AI and Baseline Sequential Sweep"
          className={`px-2.5 py-1.5 rounded-sm font-mono text-xs font-semibold flex items-center gap-1.5 transition-all border ${
            scanMode === 'SMART'
              ? 'bg-[#00e5ff]/10 text-[#00e5ff] border-[#00e5ff]/50 hover:bg-[#00e5ff]/20'
              : 'bg-[#ffb300]/10 text-[#ffb300] border-[#ffb300]/50 hover:bg-[#ffb300]/20'
          }`}
        >
          <SlidersHorizontal size={13} />
          <span>MODE: {scanMode}</span>
        </button>

        {/* Pause/Resume button */}
        <button
          onClick={onTogglePause}
          title={isPaused ? 'Resume Simulation' : 'Pause Simulation'}
          className="px-2 py-1.5 bg-[#0d131d] hover:bg-[#152033] border border-[#1f2e47] text-[#c8d6e5] hover:text-white rounded-sm text-xs font-mono transition-colors flex items-center gap-1"
        >
          {isPaused ? <Play size={13} className="text-[#00ff88]" /> : <Pause size={13} className="text-[#ffb300]" />}
          <span className="hidden sm:inline">{isPaused ? 'RESUME' : 'PAUSE'}</span>
        </button>

        {/* Reset button */}
        <button
          onClick={onResetSimulation}
          title="Reset Simulation State"
          className="p-1.5 bg-[#0d131d] hover:bg-[#152033] border border-[#1f2e47] text-[#637b99] hover:text-white rounded-sm text-xs font-mono transition-colors"
        >
          <RotateCcw size={14} />
        </button>

        {/* Judge Demo Big Button */}
        <button
          onClick={onStartDemo}
          className={`px-3 py-1.5 rounded-sm font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
            isDemoActive
              ? 'bg-[#ff3344] text-white shadow-[0_0_15px_rgba(255,51,68,0.5)] animate-pulse'
              : 'bg-[#00e5ff] hover:bg-[#33ebff] text-black shadow-[0_0_15px_rgba(0,229,255,0.4)]'
          }`}
        >
          <Play size={13} className={isDemoActive ? 'fill-white' : 'fill-black'} />
          <span>{isDemoActive ? 'DEMO RUNNING' : '▶ START JUDGE DEMO'}</span>
        </button>

        {/* Presentation Mode Toggle */}
        <button
          onClick={onTogglePresentation}
          title={presentationMode ? 'Exit Presentation Mode' : 'Enter Presentation Mode (Full Screen UI for Judges)'}
          className={`p-1.5 rounded-sm border font-mono text-xs transition-colors ${
            presentationMode
              ? 'bg-[#00e5ff]/20 text-[#00e5ff] border-[#00e5ff]'
              : 'bg-[#0d131d] text-[#637b99] hover:text-white border-[#1f2e47]'
          }`}
        >
          {presentationMode ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </button>
      </div>
    </header>
  );
};
