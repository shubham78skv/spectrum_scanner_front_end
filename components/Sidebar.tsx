import React from 'react';
import { 
  LayoutDashboard, 
  Radio, 
  SignalHigh, 
  History, 
  BarChart3, 
  Network, 
  Settings, 
  ShieldAlert,
  Zap,
  Layers
} from 'lucide-react';

export type PageId = 'dashboard' | 'scan' | 'signals' | 'history' | 'analytics' | 'architecture' | 'settings';

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  detectedCount: number;
  scanMode: 'SMART' | 'BASELINE';
}

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  detectedCount,
  scanMode
}) => {
  const navItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scan', label: 'Scan', icon: Radio, badge: scanMode },
    { id: 'signals', label: 'Signals', icon: SignalHigh, badge: detectedCount },
    { id: 'history', label: 'History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'architecture', label: 'Architecture', icon: Network },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-56 bg-[#090e17] border-r border-[#1f2e47] flex flex-col justify-between select-none shrink-0 min-h-[calc(100vh-53px)]">
      {/* Navigation Links */}
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-widest text-[#637b99]">
          MAIN NAVIGATION
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectPage(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-sm font-mono text-xs transition-all duration-150 ${
                isActive
                  ? 'bg-[#00e5ff]/15 text-[#00e5ff] font-semibold border-l-2 border-[#00e5ff] pl-2.5 shadow-[inset_0_0_12px_rgba(0,229,255,0.08)]'
                  : 'text-[#8b9eb5] hover:text-white hover:bg-[#111927] border-l-2 border-transparent'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon size={16} className={isActive ? 'text-[#00e5ff]' : 'text-[#637b99]'} />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span className={`px-1.5 py-0.2 text-[10px] rounded-sm font-mono uppercase ${
                  isActive 
                    ? 'bg-[#00e5ff] text-black font-bold' 
                    : 'bg-[#152033] text-[#637b99] border border-[#2a3f60]'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tactical EW Quick Info Footer */}
      <div className="p-3 m-2 bg-[#0d131d] border border-[#1f2e47] rounded-sm text-[11px] font-mono space-y-2">
        <div className="flex items-center justify-between text-[#637b99] text-[10px] uppercase tracking-wider">
          <span className="flex items-center gap-1">
            <ShieldAlert size={12} className="text-[#00e5ff]" />
            ESM SCHEDULER
          </span>
          <span className="text-[#00ff88]">v2.4</span>
        </div>

        <div className="space-y-1 text-[#8b9eb5] text-[10px]">
          <div className="flex justify-between">
            <span>BAND:</span>
            <span className="text-white">100 - 200 MHz</span>
          </div>
          <div className="flex justify-between">
            <span>STRATEGY:</span>
            <span className="text-[#00e5ff] font-semibold">ADAPTIVE Q-MAB</span>
          </div>
          <div className="flex justify-between">
            <span>SIMULATION:</span>
            <span className="text-[#00ff88]">ACTIVE</span>
          </div>
        </div>

        <div className="pt-2 border-t border-[#1f2e47] text-[9px] text-[#637b99] leading-tight">
          Academic simulation. Contains no classified EW intelligence.
        </div>
      </div>
    </aside>
  );
};
