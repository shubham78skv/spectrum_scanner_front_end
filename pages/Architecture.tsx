import React from 'react';
import { 
  Radio, 
  Cpu, 
  BrainCircuit, 
  Search, 
  Database, 
  Crosshair, 
  CheckCircle2, 
  GraduationCap, 
  ArrowDown, 
  ArrowRight,
  Layers,
  Sparkles,
  ShieldAlert,
  Sliders
} from 'lucide-react';

export const Architecture: React.FC = () => {
  const pipelineBlocks = [
    {
      category: 'INPUT',
      categoryColor: 'text-[#00ff88] border-[#00ff88]/30 bg-[#00ff88]/10',
      id: 'BLOCK-01',
      title: 'SIMULATED RF ENVIRONMENT',
      icon: Radio,
      description: 'Generates multi-band synthetic RF spectrum (100–200 MHz) with stochastic noise floor (-88 dBm), intermittent burst radars, and agile hopping emitters.',
      techSpecs: ['Rayleigh / Gaussian Noise', '5 Fictional Radar Emitters', 'Dynamic Duty Cycles (15–90%)']
    },
    {
      category: 'INPUT',
      categoryColor: 'text-[#00ff88] border-[#00ff88]/30 bg-[#00ff88]/10',
      id: 'BLOCK-02',
      title: 'WIDEBAND SPECTRUM SENSOR',
      icon: Layers,
      description: 'Digitizes instantaneous frequency slice via simulated Fast Fourier Transform (FFT). Delivers I/Q power spectral density bins across receiver bandwidth.',
      techSpecs: ['100 discrete FFT bins', '120 ms Dwell Time', 'Dynamic Retuning Interface']
    },
    {
      category: 'PROCESSING',
      categoryColor: 'text-[#00e5ff] border-[#00e5ff]/30 bg-[#00e5ff]/10',
      id: 'BLOCK-03',
      title: 'SIGNAL DETECTION & CFAR',
      icon: Search,
      description: 'Constant False Alarm Rate (CFAR) energy threshold detector compares instantaneous signal power with local noise floor to declare candidate detections.',
      techSpecs: ['Cell-Averaging CFAR', 'SNR > 6.0 dB Threshold', 'PFA < 0.02 Regulation']
    },
    {
      category: 'PROCESSING',
      categoryColor: 'text-[#00e5ff] border-[#00e5ff]/30 bg-[#00e5ff]/10',
      id: 'BLOCK-04',
      title: 'FEATURE EXTRACTION',
      icon: Database,
      description: 'Extracts time-frequency attributes including Center Frequency, Bandwidth, Pulse Width, PRF/PRI stagger, and signal modulation classification.',
      techSpecs: ['Modulation: Pulse / FMCW / Barker', 'Temporal Intercept Timestamp', 'Emitter Fingerprint Vector']
    },
    {
      category: 'DECISION',
      categoryColor: 'text-[#b388ff] border-[#b388ff]/30 bg-[#b388ff]/10',
      id: 'BLOCK-05',
      title: 'ML PREDICTION ENGINE',
      icon: BrainCircuit,
      description: 'Estimates instantaneous transmission probability for each candidate frequency band using Markov state transition matrices and historical duty cycle priors.',
      techSpecs: ['Bayesian Prior Likelihood', 'Markovian State-Space Model', 'Temporal Recency Decay']
    },
    {
      category: 'DECISION',
      categoryColor: 'text-[#b388ff] border-[#b388ff]/30 bg-[#b388ff]/10',
      id: 'BLOCK-06',
      title: 'SMART SCAN SCHEDULER',
      icon: Sliders,
      description: 'Closed-loop Contextual Multi-Armed Bandit (Q-MAB) optimizer balances Exploration (Upper Confidence Bound) vs Exploitation (Priority Weighted Score).',
      techSpecs: ['Multi-Attribute Utility Function', 'Agility / Retuning Cost Penalty', 'Threat Priority Matrix (0.35–1.00)']
    },
    {
      category: 'DECISION',
      categoryColor: 'text-[#b388ff] border-[#b388ff]/30 bg-[#b388ff]/10',
      id: 'BLOCK-07',
      title: 'NEXT SCAN TARGET SELECTION',
      icon: Crosshair,
      description: 'Directs ES receiver tuning synthesizer to optimal target frequency. Replaces blind sequential sweep with highly focused intelligence-guided scans.',
      techSpecs: ['Sub-millisecond Command Latency', 'Explainable Attribution Weights', 'Zero Blind Dwell on Empty Bands']
    },
    {
      category: 'FEEDBACK',
      categoryColor: 'text-[#ffb300] border-[#ffb300]/30 bg-[#ffb300]/10',
      id: 'BLOCK-08',
      title: 'HIT / MISS EVALUATION',
      icon: CheckCircle2,
      description: 'Measures physical scan outcome against receiver ground truth. Calculates instantaneous reward/cost delta and intercept time latency.',
      techSpecs: ['Reward: +10 / +15 on Hit', 'Penalty: -1 on Miss', 'Time-to-Intercept Logging']
    },
    {
      category: 'FEEDBACK',
      categoryColor: 'text-[#ffb300] border-[#ffb300]/30 bg-[#ffb300]/10',
      id: 'BLOCK-09',
      title: 'ONLINE MODEL UPDATE (LEARN)',
      icon: GraduationCap,
      description: 'Performs online Bayesian reinforcement update. Adjusts frequency confidence scores and estimated duty cycles to refine all subsequent scan decisions.',
      techSpecs: ['Exponential Moving Average Update', 'Confidence Bounds Convergence', 'Closed-Loop Continuous Feedback']
    }
  ];

  return (
    <div className="space-y-4 pb-8 font-mono">
      {/* Header */}
      <div className="bg-[#0d131d] border border-[#1f2e47] p-4 rounded-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#00e5ff]/10 text-[#00e5ff] rounded-sm border border-[#00e5ff]/30">
            <Cpu size={20} />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              SYSTEM ARCHITECTURE & ML PIPELINE
              <span className="text-xs px-2 py-0.5 bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30 rounded-xs">
                CLOSED-LOOP ES RECEIVER
              </span>
            </h1>
            <p className="text-xs text-[#637b99]">
              DRDO PS-26055 End-to-End Functional Architecture: From Spectrum Sensing to Online Policy Learning
            </p>
          </div>
        </div>

        {/* 4 Pillars Legend */}
        <div className="flex items-center gap-3 text-xs">
          <span className="px-2 py-1 bg-[#00ff88]/10 text-[#00ff88] border border-[#00ff88]/30 rounded-xs font-bold">1. INPUT</span>
          <span className="px-2 py-1 bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30 rounded-xs font-bold">2. PROCESSING</span>
          <span className="px-2 py-1 bg-[#b388ff]/10 text-[#b388ff] border border-[#b388ff]/30 rounded-xs font-bold">3. DECISION</span>
          <span className="px-2 py-1 bg-[#ffb300]/10 text-[#ffb300] border border-[#ffb300]/30 rounded-xs font-bold">4. FEEDBACK</span>
        </div>
      </div>

      {/* Visual Pipeline Blocks */}
      <div className="space-y-3">
        {pipelineBlocks.map((block, idx) => {
          const Icon = block.icon;
          return (
            <div key={block.id} className="relative">
              <div className="bg-[#0d131d] border border-[#1f2e47] hover:border-[#00e5ff]/50 p-4 rounded-sm transition-all duration-150">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#152033] text-[#00e5ff] rounded-sm border border-[#2a3f60]">
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#637b99]">{block.id}</span>
                        <h3 className="text-sm font-bold text-white tracking-wide">{block.title}</h3>
                      </div>
                      <span className={`inline-block px-1.5 py-0.2 text-[9px] font-bold rounded-xs border mt-1 ${block.categoryColor}`}>
                        {block.category} STAGE
                      </span>
                    </div>
                  </div>

                  {/* Tech Specs Pills */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {block.techSpecs.map((spec, sIdx) => (
                      <span key={sIdx} className="text-[10px] px-2 py-0.5 bg-[#070a0f] text-[#8b9eb5] border border-[#152033] rounded-xs">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <p className="text-xs text-[#c8d6e5] leading-relaxed pl-11">
                  {block.description}
                </p>
              </div>

              {/* Connecting Down Arrow between blocks */}
              {idx < pipelineBlocks.length - 1 && (
                <div className="flex justify-center my-1 text-[#00e5ff]/60">
                  <ArrowDown size={16} className="animate-bounce" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Closed-Loop Feedback Loop Indicator */}
      <div className="bg-[#070a0f] border-2 border-dashed border-[#00ff88]/50 p-4 rounded-sm text-center">
        <div className="inline-flex p-2 bg-[#00ff88]/10 text-[#00ff88] rounded-full mb-1">
          <GraduationCap size={22} />
        </div>
        <h3 className="text-sm font-bold text-white mb-1 uppercase tracking-wider">
          CLOSED-LOOP REINFORCEMENT CYCLE (↺ FEEDBACK LOOP)
        </h3>
        <p className="text-xs text-[#8b9eb5] max-w-2xl mx-auto leading-relaxed">
          The updated Bayesian duty cycle priors and frequency confidence weights directly feed back into <span className="text-[#00e5ff] font-bold">BLOCK-05 (ML PREDICTION)</span> and <span className="text-[#b388ff] font-bold">BLOCK-06 (SMART SCHEDULER)</span>, ensuring continuous learning and dynamic adaptation to agile radar hopping.
        </p>
      </div>
    </div>
  );
};
