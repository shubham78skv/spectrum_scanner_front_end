import React, { useState } from 'react';
import { Signal, SignalPriority, SignalStatus } from '../types';
import { SignalHigh, Search, Filter, ArrowUpDown, ChevronRight, Eye } from 'lucide-react';

interface SignalTableProps {
  signals: Signal[];
  onSelectSignal: (signal: Signal) => void;
  selectedSignalId?: string;
}

export const SignalTable: React.FC<SignalTableProps> = ({
  signals,
  onSelectSignal,
  selectedSignalId
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortField, setSortField] = useState<keyof Signal>('lastSeen');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const filteredSignals = signals.filter(s => {
    const matchesSearch = s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.frequency.toString().includes(searchTerm);
    const matchesPriority = priorityFilter === 'ALL' || s.priority === priorityFilter;
    const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter;
    return matchesSearch && matchesPriority && matchesStatus;
  }).sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const handleSort = (field: keyof Signal) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const getPriorityBadge = (prio: SignalPriority) => {
    switch (prio) {
      case 'CRITICAL':
        return <span className="px-1.5 py-0.2 text-[10px] font-bold bg-[#ff3344]/15 text-[#ff3344] border border-[#ff3344]/40 rounded-xs">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-1.5 py-0.2 text-[10px] font-bold bg-[#00e5ff]/15 text-[#00e5ff] border border-[#00e5ff]/40 rounded-xs">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-1.5 py-0.2 text-[10px] font-bold bg-[#ffb300]/15 text-[#ffb300] border border-[#ffb300]/40 rounded-xs">MEDIUM</span>;
      default:
        return <span className="px-1.5 py-0.2 text-[10px] font-bold bg-gray-800 text-gray-400 border border-gray-700 rounded-xs">LOW</span>;
    }
  };

  const getStatusBadge = (status: SignalStatus) => {
    switch (status) {
      case 'DETECTED':
        return <span className="text-[#00ff88] font-bold">DETECTED</span>;
      case 'TRACKING':
        return <span className="text-[#00e5ff] font-bold">TRACKING</span>;
      case 'SEARCHING':
        return <span className="text-[#ffb300]">SEARCHING</span>;
      default:
        return <span className="text-[#637b99]">{status}</span>;
    }
  };

  return (
    <div className="bg-[#0d131d] border border-[#1f2e47] p-4 rounded-sm font-mono flex flex-col justify-between">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#152033] mb-3 gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#00e5ff]/10 text-[#00e5ff] rounded-sm">
            <SignalHigh size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              DETECTED SIGNALS
              <span className="text-[10px] text-[#00e5ff] px-1.5 py-0.2 bg-[#00e5ff]/10 border border-[#00e5ff]/30 rounded-sm">
                {signals.length} ACTIVE TARGETS
              </span>
            </h2>
            <p className="text-[10px] text-[#637b99]">
              Real-time ES receiver signal intercepts and intelligence ledger
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Search Box */}
          <div className="relative">
            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#637b99]" />
            <input
              type="text"
              placeholder="Search frequency / ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#070a0f] border border-[#1f2e47] pl-7 pr-2.5 py-1 text-xs text-white rounded-sm focus:outline-none focus:border-[#00e5ff]"
            />
          </div>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-[#070a0f] border border-[#1f2e47] px-2 py-1 text-xs text-[#c8d6e5] rounded-sm focus:outline-none focus:border-[#00e5ff]"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#070a0f] border border-[#1f2e47] px-2 py-1 text-xs text-[#c8d6e5] rounded-sm focus:outline-none focus:border-[#00e5ff]"
          >
            <option value="ALL">All Statuses</option>
            <option value="DETECTED">Detected</option>
            <option value="TRACKING">Tracking</option>
            <option value="SEARCHING">Searching</option>
          </select>
        </div>
      </div>

      {/* Signals Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#152033] text-[10px] text-[#637b99] uppercase bg-[#070a0f]">
              <th className="py-2 px-2.5 font-medium cursor-pointer" onClick={() => handleSort('id')}>
                <div className="flex items-center gap-1">ID <ArrowUpDown size={10} /></div>
              </th>
              <th className="py-2 px-2.5 font-medium cursor-pointer" onClick={() => handleSort('frequency')}>
                <div className="flex items-center gap-1">Frequency <ArrowUpDown size={10} /></div>
              </th>
              <th className="py-2 px-2.5 font-medium">Strength</th>
              <th className="py-2 px-2.5 font-medium cursor-pointer" onClick={() => handleSort('snr')}>
                <div className="flex items-center gap-1">SNR <ArrowUpDown size={10} /></div>
              </th>
              <th className="py-2 px-2.5 font-medium">Priority</th>
              <th className="py-2 px-2.5 font-medium">Status</th>
              <th className="py-2 px-2.5 font-medium cursor-pointer" onClick={() => handleSort('confidence')}>
                <div className="flex items-center gap-1">Confidence <ArrowUpDown size={10} /></div>
              </th>
              <th className="py-2 px-2.5 font-medium">First Seen</th>
              <th className="py-2 px-2.5 font-medium cursor-pointer" onClick={() => handleSort('lastSeen')}>
                <div className="flex items-center gap-1">Last Seen <ArrowUpDown size={10} /></div>
              </th>
              <th className="py-2 px-2.5 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#152033] text-[11px]">
            {filteredSignals.length > 0 ? (
              filteredSignals.map((signal) => {
                const isSelected = selectedSignalId === signal.id;
                return (
                  <tr
                    key={signal.id}
                    onClick={() => onSelectSignal(signal)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#00e5ff]/10 text-white font-semibold'
                        : 'hover:bg-[#111927]'
                    }`}
                  >
                    <td className="py-2 px-2.5 text-[#00e5ff] font-bold">{signal.id}</td>
                    <td className="py-2 px-2.5 text-white font-bold">{signal.frequency.toFixed(2)} MHz</td>
                    <td className="py-2 px-2.5 text-[#8b9eb5]">{signal.strength} ({signal.rawStrengthDbm} dBm)</td>
                    <td className="py-2 px-2.5 text-[#00ff88] font-bold">{signal.snr} dB</td>
                    <td className="py-2 px-2.5">{getPriorityBadge(signal.priority)}</td>
                    <td className="py-2 px-2.5">{getStatusBadge(signal.status)}</td>
                    <td className="py-2 px-2.5 text-[#00e5ff]">{signal.confidence.toFixed(1)}%</td>
                    <td className="py-2 px-2.5 text-[#637b99]">{signal.firstSeen}</td>
                    <td className="py-2 px-2.5 text-[#8b9eb5]">{signal.lastSeen}</td>
                    <td className="py-2 px-2.5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSignal(signal);
                        }}
                        className="p-1 hover:bg-[#152033] text-[#00e5ff] rounded-xs"
                      >
                        <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={10} className="py-6 text-center text-[#637b99]">
                  NO SIGNALS MATCH FILTER CRITERIA
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-2.5 pt-2 border-t border-[#152033] flex items-center justify-between text-[10px] text-[#637b99]">
        <span>Click any row to open comprehensive tactical signal intelligence drawer</span>
        <span className="text-[#00ff88]">Total Tracked: {signals.length}</span>
      </div>
    </div>
  );
};
