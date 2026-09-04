import React from 'react';
import { PerformanceMetrics } from '../types';
import { Scale, TrendingUp, Clock, AlertOctagon, CheckCircle, Zap } from 'lucide-react';

interface PerformanceComparisonProps {
  metrics: PerformanceMetrics;
}

export const PerformanceComparison: React.FC<PerformanceComparisonProps> = ({
  metrics
}) => {
  const { baseline, smart, detectionImprovementPct, timeReductionPct, missReductionPct } = metrics;

  const comparisonRows = [
    {
      metric: 'Detection Rate',
      baselineVal: `${baseline.detectionRate.toFixed(1)}%`,
      smartVal: `${smart.detectionRate.toFixed(1)}%`,
      improvement: `+${detectionImprovementPct.toFixed(1)}%`,
      isBetter: smart.detectionRate >= baseline.detectionRate
    },
    {
      metric: 'Interception Rate',
      baselineVal: `${baseline.interceptionRate.toFixed(1)}%`,
      smartVal: `${smart.interceptionRate.toFixed(1)}%`,
      improvement: `+${(smart.interceptionRate - baseline.interceptionRate).toFixed(1)}%`,
      isBetter: smart.interceptionRate >= baseline.interceptionRate
    },
    {
      metric: 'Average Intercept Time',
      baselineVal: `${baseline.avgInterceptTime.toFixed(1)} s`,
      smartVal: `${smart.avgInterceptTime.toFixed(1)} s`,
      improvement: `-${timeReductionPct.toFixed(1)}% (Faster)`,
      isBetter: smart.avgInterceptTime <= baseline.avgInterceptTime
    },
    {
      metric: 'False Alarm Rate',
      baselineVal: `${baseline.falseAlarmRate.toFixed(1)}%`,
      smartVal: `${smart.falseAlarmRate.toFixed(1)}%`,
      improvement: `${(baseline.falseAlarmRate - smart.falseAlarmRate).toFixed(1)}%`,
      isBetter: smart.falseAlarmRate <= baseline.falseAlarmRate
    },
    {
      metric: 'Prediction Accuracy',
      baselineVal: `${baseline.predictionAccuracy.toFixed(1)}%`,
      smartVal: `${smart.predictionAccuracy.toFixed(1)}%`,
      improvement: `+${(smart.predictionAccuracy - baseline.predictionAccuracy).toFixed(1)}%`,
      isBetter: smart.predictionAccuracy >= baseline.predictionAccuracy
    },
    {
      metric: 'Missed Signals',
      baselineVal: `${baseline.missedSignals}`,
      smartVal: `${smart.missedSignals}`,
      improvement: `-${missReductionPct.toFixed(1)}% (Reduced)`,
      isBetter: smart.missedSignals <= baseline.missedSignals
    },
  ];

  return (
    <div className="bg-[#0d131d] border border-[#1f2e47] p-4 rounded-sm font-mono flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-2.5 border-b border-[#152033] mb-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#00e5ff]/10 text-[#00e5ff] rounded-sm">
            <Scale size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              SIMULATION PERFORMANCE
              <span className="text-[9px] px-1.5 py-0.2 bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30 rounded-xs uppercase">
                SIMULATION RESULTS
              </span>
            </h2>
            <p className="text-[10px] text-[#637b99]">
              Direct comparison: Conventional Sequential Sweep vs SMARTSCAN AI Scheduler
            </p>
          </div>
        </div>

        {/* Big Improvement Badge */}
        <div className="flex items-center gap-2 px-2.5 py-1 bg-[#00ff88]/10 border border-[#00ff88]/40 rounded-sm text-[#00ff88] text-xs font-bold">
          <Zap size={13} />
          <span>+{detectionImprovementPct.toFixed(1)}% DETECTION BOOST</span>
        </div>
      </div>

      {/* Side-by-Side Quick Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Baseline Card */}
        <div className="bg-[#070a0f] p-3 rounded-sm border border-[#1f2e47]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#ffb300]">BASELINE (SWEEP)</span>
            <span className="text-[9px] text-[#637b99] uppercase">Open-Loop</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[#637b99]">Detection Rate:</span>
              <span className="font-bold text-white">{baseline.detectionRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#637b99]">Intercept Rate:</span>
              <span className="font-bold text-white">{baseline.interceptionRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#637b99]">Avg Intercept Time:</span>
              <span className="font-bold text-[#ff3344]">{baseline.avgInterceptTime.toFixed(1)} s</span>
            </div>
          </div>
        </div>

        {/* SmartScan Card */}
        <div className="bg-[#070a0f] p-3 rounded-sm border border-[#00e5ff]/40 shadow-[inset_0_0_15px_rgba(0,229,255,0.06)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#00e5ff]">SMARTSCAN AI</span>
            <span className="text-[9px] px-1 bg-[#00e5ff]/20 text-[#00e5ff] rounded-xs font-bold">ML ACTIVE</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-[#637b99]">Detection Rate:</span>
              <span className="font-bold text-[#00ff88]">{smart.detectionRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#637b99]">Intercept Rate:</span>
              <span className="font-bold text-[#00ff88]">{smart.interceptionRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#637b99]">Avg Intercept Time:</span>
              <span className="font-bold text-[#00e5ff]">{smart.avgInterceptTime.toFixed(1)} s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#152033] text-[10px] text-[#637b99] uppercase">
              <th className="pb-1.5 font-medium">Evaluation Metric</th>
              <th className="pb-1.5 font-medium">Baseline</th>
              <th className="pb-1.5 font-medium text-[#00e5ff]">SmartScan AI</th>
              <th className="pb-1.5 font-medium text-right">Advantage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#152033] text-[11px]">
            {comparisonRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-[#111927]/60 transition-colors">
                <td className="py-1.5 text-[#c8d6e5] font-medium">{row.metric}</td>
                <td className="py-1.5 text-[#8b9eb5]">{row.baselineVal}</td>
                <td className="py-1.5 text-[#00e5ff] font-bold">{row.smartVal}</td>
                <td className="py-1.5 text-right font-bold text-[#00ff88]">{row.improvement}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Banner */}
      <div className="mt-3 pt-2 border-t border-[#152033] flex items-center justify-between text-[9px] text-[#637b99]">
        <span>Simulated metrics evaluated under identical RF emitter transition distributions.</span>
        <span className="text-[#00e5ff]">DRDO PS-26055 Evaluation Benchmark</span>
      </div>
    </div>
  );
};
