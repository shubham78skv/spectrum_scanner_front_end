import React, { useState } from 'react';
import { useSpectrumSimulation } from '../hooks/useSpectrumSimulation';
import { INITIAL_SESSIONS } from '../data/simulationData';
import { ScanSession } from '../types';
import { History as HistoryIcon, Download, Search, CheckCircle2, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface HistoryProps {
  sim: ReturnType<typeof useSpectrumSimulation>;
}

export const History: React.FC<HistoryProps> = ({ sim }) => {
  const [sessions, setSessions] = useState<ScanSession[]>(INITIAL_SESSIONS);
  const [selectedSession, setSelectedSession] = useState<ScanSession | null>(sessions[0]);
  const [filterMode, setFilterMode] = useState<string>('ALL');

  const filteredSessions = sessions.filter(s => {
    if (filterMode === 'ALL') return true;
    return s.mode === filterMode;
  });

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sessions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `smartscan_ai_history_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-4 pb-8 font-mono">
      {/* Page Header */}
      <div className="bg-[#0d131d] border border-[#1f2e47] p-4 rounded-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#00e5ff]/10 text-[#00e5ff] rounded-sm border border-[#00e5ff]/30">
            <HistoryIcon size={20} />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              SCAN SESSION HISTORY & BENCHMARKS
              <span className="text-xs px-2 py-0.5 bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30 rounded-xs">
                SIMULATION RECORDS
              </span>
            </h1>
            <p className="text-xs text-[#637b99]">
              Historical receiver mission logs comparing sequential sweep vs adaptive scan performance
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter */}
          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            className="bg-[#070a0f] border border-[#1f2e47] px-3 py-1.5 text-xs text-white rounded-sm focus:outline-none focus:border-[#00e5ff]"
          >
            <option value="ALL">All Modes</option>
            <option value="SMART">Smart Scan (AI)</option>
            <option value="BASELINE">Baseline (Sweep)</option>
          </select>

          {/* Export button */}
          <button
            onClick={handleExport}
            className="px-3 py-1.5 bg-[#152033] hover:bg-[#1f2e47] text-[#00e5ff] border border-[#2a3f60] rounded-sm text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Download size={13} />
            <span>EXPORT JSON</span>
          </button>
        </div>
      </div>

      {/* Main Sessions Table */}
      <div className="bg-[#0d131d] border border-[#1f2e47] p-4 rounded-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#152033] text-[10px] text-[#637b99] uppercase bg-[#070a0f]">
                <th className="py-2.5 px-3 font-medium">SESSION ID</th>
                <th className="py-2.5 px-3 font-medium">TIME</th>
                <th className="py-2.5 px-3 font-medium">DURATION</th>
                <th className="py-2.5 px-3 font-medium">MODE</th>
                <th className="py-2.5 px-3 font-medium">SIGNALS DETECTED</th>
                <th className="py-2.5 px-3 font-medium">MISSES</th>
                <th className="py-2.5 px-3 font-medium">INTERCEPT RATE</th>
                <th className="py-2.5 px-3 font-medium">AVG INTERCEPT TIME</th>
                <th className="py-2.5 px-3 font-medium text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#152033] text-[11px]">
              {filteredSessions.map((s) => {
                const isSelected = selectedSession?.sessionId === s.sessionId;
                return (
                  <tr
                    key={s.sessionId}
                    onClick={() => setSelectedSession(s)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#00e5ff]/10 text-white font-semibold'
                        : 'hover:bg-[#111927]'
                    }`}
                  >
                    <td className="py-2.5 px-3 text-[#00e5ff] font-bold">{s.sessionId}</td>
                    <td className="py-2.5 px-3 text-[#8b9eb5]">{s.timestamp}</td>
                    <td className="py-2.5 px-3 text-white">{s.duration}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-xs border ${
                        s.mode === 'SMART'
                          ? 'bg-[#00e5ff]/15 text-[#00e5ff] border-[#00e5ff]/40'
                          : 'bg-[#ffb300]/15 text-[#ffb300] border-[#ffb300]/40'
                      }`}>
                        {s.mode}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-[#00ff88] font-bold">{s.signalsDetected}</td>
                    <td className="py-2.5 px-3 text-[#ff3344] font-bold">{s.misses}</td>
                    <td className="py-2.5 px-3 text-[#00e5ff] font-bold">{s.interceptionRate}%</td>
                    <td className="py-2.5 px-3 text-white">{s.avgInterceptTime} s</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSession(s);
                        }}
                        className="px-2 py-1 bg-[#152033] hover:bg-[#1f2e47] text-[#00e5ff] rounded-xs text-[10px]"
                      >
                        VIEW DETAILS
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Session Deep Dive Card */}
      {selectedSession && (
        <div className="bg-[#0d131d] border border-[#1f2e47] p-5 rounded-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#152033] mb-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#00ff88]" />
              SESSION BREAKDOWN: {selectedSession.sessionId}
            </h2>
            <span className="text-xs text-[#00e5ff] font-bold">
              MODE: {selectedSession.mode}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-4">
            <div className="bg-[#070a0f] p-3 rounded-sm border border-[#152033]">
              <span className="text-[10px] text-[#637b99] block mb-1">TOTAL SCANS RUN</span>
              <span className="text-lg font-bold text-white">{selectedSession.totalScans}</span>
            </div>
            <div className="bg-[#070a0f] p-3 rounded-sm border border-[#152033]">
              <span className="text-[10px] text-[#637b99] block mb-1">PREDICTION ACCURACY</span>
              <span className="text-lg font-bold text-[#00ff88]">{selectedSession.accuracy}%</span>
            </div>
            <div className="bg-[#070a0f] p-3 rounded-sm border border-[#152033]">
              <span className="text-[10px] text-[#637b99] block mb-1">EFFICIENCY ADVANTAGE</span>
              <span className="text-lg font-bold text-[#00e5ff]">+{selectedSession.efficiencyGain}%</span>
            </div>
            <div className="bg-[#070a0f] p-3 rounded-sm border border-[#152033]">
              <span className="text-[10px] text-[#637b99] block mb-1">INTERCEPT TIME</span>
              <span className="text-lg font-bold text-white">{selectedSession.avgInterceptTime} s</span>
            </div>
          </div>

          <p className="text-xs text-[#8b9eb5] leading-relaxed bg-[#070a0f] p-3 rounded-sm border border-[#152033]">
            {selectedSession.mode === 'SMART'
              ? 'This session utilized the Closed-Loop Contextual Multi-Armed Bandit model. High-value intermittent radars (116.79 MHz, 134.25 MHz) were repeatedly captured within milliseconds of initial transmission burst, resulting in minimal time-to-intercept error.'
              : 'This baseline session used traditional monotonic sweeping. Because the scanner dwelt across empty spectrum bins (140-155 MHz), intermittent burst transmissions were frequently missed or intercepted after substantial delay.'}
          </p>
        </div>
      )}
    </div>
  );
};
