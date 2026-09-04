import React from 'react';
import { SchedulerDecision } from '../types';
import { HelpCircle, CheckCircle2, ChevronRight, Zap, TrendingUp, DollarSign } from 'lucide-react';

interface DecisionExplanationProps {
  decision: SchedulerDecision | null;
}

export const DecisionExplanation: React.FC<DecisionExplanationProps> = ({
  decision
}) => {
  const breakdown = decision?.breakdown || {
    activityLikelihood: 91,
    historicalRelevance: 87,
    expectedReward: 84,
    searchCost: 'LOW'
  };

  const reasons = decision?.reasons || [
    { id: 'r1', text: 'Recent simulated activity observed in band', type: 'positive', score: 91, weightLabel: '+0.35' },
    { id: 'r2', text: 'High predicted transmission probability based on duty cycle', type: 'positive', score: 88, weightLabel: '+0.30' },
    { id: 'r3', text: 'Previous successful detection reinforcement', type: 'positive', score: 87, weightLabel: '+0.25' },
    { id: 'r4', text: 'Lower expected retuning and search cost', type: 'positive', score: 84, weightLabel: '-0.05' }
  ];

  return (
    <div className="bg-[#0d131d] border border-[#1f2e47] p-4 rounded-sm font-mono flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-[#152033] mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#00e5ff]/10 text-[#00e5ff] rounded-sm">
            <HelpCircle size={16} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              WHY THIS TARGET?
              <span className="text-[10px] font-mono text-[#00e5ff] px-1.5 py-0.2 bg-[#00e5ff]/10 border border-[#00e5ff]/30 rounded-sm">
                EXPLAINABLE ML
              </span>
            </h2>
            <p className="text-[10px] text-[#637b99]">
              Transparent attribution weights for frequency target selection
            </p>
          </div>
        </div>

        <span className="text-xs text-[#00ff88] font-bold">
          CONFIDENCE: {decision?.confidence || 93.4}%
        </span>
      </div>

      {/* Rationale Bullet Points */}
      <div className="space-y-2 mb-3 bg-[#070a0f] p-3 rounded-sm border border-[#152033]">
        {reasons.map((r) => (
          <div key={r.id} className="flex items-start gap-2 text-xs">
            <span className="text-[#00ff88] font-bold shrink-0 mt-0.5">+</span>
            <span className="text-[#c8d6e5] flex-1 leading-relaxed">
              {r.text}
            </span>
            <span className="text-[10px] px-1.5 py-0.2 bg-[#152033] text-[#00e5ff] border border-[#2a3f60] rounded-xs font-mono shrink-0">
              {r.weightLabel}
            </span>
          </div>
        ))}
      </div>

      {/* Confidence Breakdown Bars */}
      <div>
        <div className="text-[10px] uppercase text-[#637b99] tracking-wider mb-2 font-semibold">
          SCORING ATTRIBUTION BREAKDOWN
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {/* Activity Likelihood */}
          <div className="bg-[#111927] p-2 rounded-sm border border-[#1f2e47]">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[#8b9eb5] text-[11px]">Activity likelihood</span>
              <span className="text-[#00ff88] font-bold">{breakdown.activityLikelihood}%</span>
            </div>
            <div className="w-full h-1 bg-[#152033] rounded-sm overflow-hidden">
              <div 
                className="h-full bg-[#00ff88]" 
                style={{ width: `${breakdown.activityLikelihood}%` }} 
              />
            </div>
          </div>

          {/* Historical Relevance */}
          <div className="bg-[#111927] p-2 rounded-sm border border-[#1f2e47]">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[#8b9eb5] text-[11px]">Historical relevance</span>
              <span className="text-[#00e5ff] font-bold">{breakdown.historicalRelevance}%</span>
            </div>
            <div className="w-full h-1 bg-[#152033] rounded-sm overflow-hidden">
              <div 
                className="h-full bg-[#00e5ff]" 
                style={{ width: `${breakdown.historicalRelevance}%` }} 
              />
            </div>
          </div>

          {/* Expected Reward */}
          <div className="bg-[#111927] p-2 rounded-sm border border-[#1f2e47]">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[#8b9eb5] text-[11px]">Expected reward</span>
              <span className="text-[#38bdf8] font-bold">{breakdown.expectedReward}%</span>
            </div>
            <div className="w-full h-1 bg-[#152033] rounded-sm overflow-hidden">
              <div 
                className="h-full bg-[#38bdf8]" 
                style={{ width: `${breakdown.expectedReward}%` }} 
              />
            </div>
          </div>

          {/* Search Cost */}
          <div className="bg-[#111927] p-2 rounded-sm border border-[#1f2e47]">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[#8b9eb5] text-[11px]">Search cost</span>
              <span className={`font-bold ${
                breakdown.searchCost === 'LOW' ? 'text-[#00ff88]' : breakdown.searchCost === 'MEDIUM' ? 'text-[#ffb300]' : 'text-[#ff3344]'
              }`}>
                {breakdown.searchCost}
              </span>
            </div>
            <div className="w-full h-1 bg-[#152033] rounded-sm overflow-hidden">
              <div 
                className={`h-full ${
                  breakdown.searchCost === 'LOW' ? 'bg-[#00ff88] w-1/4' : breakdown.searchCost === 'MEDIUM' ? 'bg-[#ffb300] w-1/2' : 'bg-[#ff3344] w-3/4'
                }`} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
