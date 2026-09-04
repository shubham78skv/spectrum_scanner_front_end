import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subValue?: string;
  delta?: {
    value: string | number;
    isPositive?: boolean;
    label?: string;
  };
  icon?: LucideIcon;
  variant?: 'cyan' | 'green' | 'amber' | 'red' | 'default';
  isSimulationLabel?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  subValue,
  delta,
  icon: Icon,
  variant = 'default',
  isSimulationLabel = false
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'cyan':
        return {
          border: 'border-[#1f2e47] hover:border-[#00e5ff]/50',
          accent: 'text-[#00e5ff]',
          iconBg: 'bg-[#00e5ff]/10 text-[#00e5ff]',
          glow: 'group-hover:shadow-[0_0_15px_rgba(0,229,255,0.15)]'
        };
      case 'green':
        return {
          border: 'border-[#1f2e47] hover:border-[#00ff88]/50',
          accent: 'text-[#00ff88]',
          iconBg: 'bg-[#00ff88]/10 text-[#00ff88]',
          glow: 'group-hover:shadow-[0_0_15px_rgba(0,255,136,0.15)]'
        };
      case 'amber':
        return {
          border: 'border-[#1f2e47] hover:border-[#ffb300]/50',
          accent: 'text-[#ffb300]',
          iconBg: 'bg-[#ffb300]/10 text-[#ffb300]',
          glow: 'group-hover:shadow-[0_0_15px_rgba(255,179,0,0.15)]'
        };
      case 'red':
        return {
          border: 'border-[#1f2e47] hover:border-[#ff3344]/50',
          accent: 'text-[#ff3344]',
          iconBg: 'bg-[#ff3344]/10 text-[#ff3344]',
          glow: 'group-hover:shadow-[0_0_15px_rgba(255,51,68,0.15)]'
        };
      default:
        return {
          border: 'border-[#1f2e47] hover:border-[#2a3f60]',
          accent: 'text-[#c8d6e5]',
          iconBg: 'bg-[#152033] text-[#637b99]',
          glow: ''
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`group relative bg-[#0d131d] border ${styles.border} p-3.5 rounded-sm transition-all duration-200 ${styles.glow} corner-bracket`}>
      <div className="flex items-start justify-between mb-1.5">
        <div className="flex flex-col">
          <span className="text-[11px] font-mono tracking-wider text-[#637b99] uppercase font-medium">
            {label}
          </span>
          {isSimulationLabel && (
            <span className="text-[9px] font-mono text-[#00e5ff]/60 uppercase tracking-widest mt-0.5">
              [SIMULATION DATA]
            </span>
          )}
        </div>
        {Icon && (
          <div className={`p-1.5 rounded-sm ${styles.iconBg}`}>
            <Icon size={15} />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5 mt-1">
        <span className={`text-2xl font-mono font-bold tracking-tight ${styles.accent}`}>
          {value}
        </span>
        {unit && (
          <span className="text-xs font-mono text-[#637b99] font-medium">
            {unit}
          </span>
        )}
      </div>

      {(subValue || delta) && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#152033] text-[11px] font-mono">
          {subValue && (
            <span className="text-[#637b99] truncate">{subValue}</span>
          )}
          {delta && (
            <span className={`inline-flex items-center gap-0.5 ml-auto font-semibold ${
              delta.isPositive ? 'text-[#00ff88]' : 'text-[#ff3344]'
            }`}>
              {delta.isPositive ? '▲' : '▼'} {delta.value}
              {delta.label && <span className="text-[#637b99] font-normal ml-0.5">({delta.label})</span>}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
