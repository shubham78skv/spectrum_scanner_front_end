import React from 'react';

interface StatusIndicatorProps {
  status: 'ONLINE' | 'ACTIVE' | 'READY' | 'LIVE' | 'WARNING' | 'CRITICAL' | 'OFFLINE' | 'INTERMITTENT' | 'TRACKING';
  label?: string;
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  pulse = true,
  size = 'md'
}) => {
  const getColor = () => {
    switch (status) {
      case 'ONLINE':
      case 'ACTIVE':
      case 'READY':
      case 'LIVE':
        return {
          dot: 'bg-[#00ff88]',
          glow: 'rgba(0, 255, 136, 0.4)',
          text: 'text-[#00ff88]',
          border: 'border-[#00ff88]/30',
          bg: 'bg-[#00ff88]/10'
        };
      case 'TRACKING':
        return {
          dot: 'bg-[#00e5ff]',
          glow: 'rgba(0, 229, 255, 0.4)',
          text: 'text-[#00e5ff]',
          border: 'border-[#00e5ff]/30',
          bg: 'bg-[#00e5ff]/10'
        };
      case 'WARNING':
      case 'INTERMITTENT':
        return {
          dot: 'bg-[#ffb300]',
          glow: 'rgba(255, 179, 0, 0.4)',
          text: 'text-[#ffb300]',
          border: 'border-[#ffb300]/30',
          bg: 'bg-[#ffb300]/10'
        };
      case 'CRITICAL':
        return {
          dot: 'bg-[#ff3344]',
          glow: 'rgba(255, 51, 68, 0.4)',
          text: 'text-[#ff3344]',
          border: 'border-[#ff3344]/30',
          bg: 'bg-[#ff3344]/10'
        };
      default:
        return {
          dot: 'bg-gray-500',
          glow: 'rgba(156, 163, 175, 0.2)',
          text: 'text-gray-400',
          border: 'border-gray-600/30',
          bg: 'bg-gray-800/30'
        };
    }
  };

  const colors = getColor();
  const dotSize = size === 'sm' ? 'w-1.5 h-1.5' : size === 'lg' ? 'w-3 h-3' : 'w-2 h-2';

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm font-mono uppercase text-xs ${colors.bg} ${colors.border} border`}>
      <span className="relative flex">
        {pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colors.dot}`}
          />
        )}
        <span className={`relative inline-flex rounded-full ${dotSize} ${colors.dot}`} />
      </span>
      <span className={`font-semibold tracking-wider ${colors.text}`}>
        {label || status}
      </span>
    </div>
  );
};
