import React, { useState } from 'react';
import { useSpectrumSimulation } from '../hooks/useSpectrumSimulation';
import { DEFAULT_MODEL_METADATA } from '../data/simulationData';
import { Settings as SettingsIcon, Sliders, Cpu, Save, RotateCcw, ShieldAlert, Sparkles } from 'lucide-react';

interface SettingsProps {
  sim: ReturnType<typeof useSpectrumSimulation>;
}

export const Settings: React.FC<SettingsProps> = ({ sim }) => {
  const { settings, updateSimulationSettings, resetSimulation } = sim;
  const [localSettings, setLocalSettings] = useState(settings);
  const [savedBanner, setSavedBanner] = useState(false);

  const handleChange = (key: string, value: number) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateSimulationSettings(localSettings);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  const handleResetDefaults = () => {
    resetSimulation();
    setLocalSettings(settings);
  };

  return (
    <div className="space-y-4 pb-8 font-mono">
      {/* Header */}
      <div className="bg-[#0d131d] border border-[#1f2e47] p-4 rounded-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#00e5ff]/10 text-[#00e5ff] rounded-sm border border-[#00e5ff]/30">
            <SettingsIcon size={20} />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              SIMULATION & SCHEDULER SETTINGS
              <span className="text-xs px-2 py-0.5 bg-[#00e5ff]/10 text-[#00e5ff] border border-[#00e5ff]/30 rounded-xs">
                SIMULATION CONFIG
              </span>
            </h1>
            <p className="text-xs text-[#637b99]">
              Configure RF physics parameters, ML exploration weights, and scheduler hyperparameters
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleResetDefaults}
            className="px-3 py-1.5 bg-[#152033] hover:bg-[#1f2e47] text-[#c8d6e5] border border-[#2a3f60] rounded-sm text-xs font-bold flex items-center gap-1.5"
          >
            <RotateCcw size={13} />
            <span>RESET DEFAULTS</span>
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 bg-[#00e5ff] hover:bg-[#33ebff] text-black rounded-sm text-xs font-bold flex items-center gap-1.5 shadow-[0_0_12px_rgba(0,229,255,0.3)]"
          >
            <Save size={13} />
            <span>APPLY SETTINGS</span>
          </button>
        </div>
      </div>

      {savedBanner && (
        <div className="p-3 bg-[#00ff88]/15 border border-[#00ff88] text-[#00ff88] text-xs font-bold rounded-sm animate-pulse flex items-center justify-between">
          <span>✓ Simulation hyperparameters updated successfully. Dynamic RF synthesizer and ML weights reloaded.</span>
          <span className="text-[10px] text-white">[OK]</span>
        </div>
      )}

      {/* 3 Main Configuration Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: RF Simulation Settings */}
        <div className="bg-[#0d131d] border border-[#1f2e47] p-4 rounded-sm space-y-4">
          <div className="flex items-center gap-2 pb-2.5 border-b border-[#152033]">
            <Sliders size={16} className="text-[#00e5ff]" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              SIMULATION SETTINGS
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            {/* Simulation Speed */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#8b9eb5]">Simulation Speed</span>
                <span className="text-[#00e5ff] font-bold">{localSettings.simSpeed}x</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={localSettings.simSpeed}
                onChange={(e) => handleChange('simSpeed', +e.target.value)}
                className="w-full accent-[#00e5ff] bg-[#152033]"
              />
            </div>

            {/* Signal Activity Rate */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#8b9eb5]">Signal Activity Rate</span>
                <span className="text-[#00ff88] font-bold">{localSettings.signalActivityRate}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={localSettings.signalActivityRate}
                onChange={(e) => handleChange('signalActivityRate', +e.target.value)}
                className="w-full accent-[#00ff88] bg-[#152033]"
              />
            </div>

            {/* Noise Floor Level */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#8b9eb5]">Noise Floor (dBm)</span>
                <span className="text-[#ffb300] font-bold">{localSettings.noiseFloorDbm} dBm</span>
              </div>
              <input
                type="range"
                min="-100"
                max="-70"
                step="1"
                value={localSettings.noiseFloorDbm}
                onChange={(e) => handleChange('noiseFloorDbm', +e.target.value)}
                className="w-full accent-[#ffb300] bg-[#152033]"
              />
            </div>

            {/* Refresh Rate */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#8b9eb5]">Data Refresh Rate</span>
                <span className="text-white font-bold">{localSettings.refreshRateMs} ms</span>
              </div>
              <input
                type="range"
                min="50"
                max="300"
                step="10"
                value={localSettings.refreshRateMs}
                onChange={(e) => handleChange('refreshRateMs', +e.target.value)}
                className="w-full accent-[#00e5ff] bg-[#152033]"
              />
            </div>

            {/* Dwell Time */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#8b9eb5]">Receiver Dwell Time</span>
                <span className="text-white font-bold">{localSettings.dwellTimeMs} ms</span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="10"
                value={localSettings.dwellTimeMs}
                onChange={(e) => handleChange('dwellTimeMs', +e.target.value)}
                className="w-full accent-[#00e5ff] bg-[#152033]"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Scheduler Settings */}
        <div className="bg-[#0d131d] border border-[#1f2e47] p-4 rounded-sm space-y-4">
          <div className="flex items-center gap-2 pb-2.5 border-b border-[#152033]">
            <Cpu size={16} className="text-[#00ff88]" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              SCHEDULER SETTINGS (ML)
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            {/* Prediction Threshold */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#8b9eb5]">Prediction Threshold</span>
                <span className="text-[#00e5ff] font-bold">{localSettings.predictionThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={localSettings.predictionThreshold}
                onChange={(e) => handleChange('predictionThreshold', +e.target.value)}
                className="w-full accent-[#00e5ff] bg-[#152033]"
              />
            </div>

            {/* Priority Weight */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#8b9eb5]">Priority Weight (Threat Bias)</span>
                <span className="text-[#ff3344] font-bold">{localSettings.priorityWeight}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={localSettings.priorityWeight}
                onChange={(e) => handleChange('priorityWeight', +e.target.value)}
                className="w-full accent-[#ff3344] bg-[#152033]"
              />
            </div>

            {/* Exploration Rate */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#8b9eb5]">Exploration Rate (ε-greedy)</span>
                <span className="text-[#ffb300] font-bold">{localSettings.explorationRate}</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.05"
                value={localSettings.explorationRate}
                onChange={(e) => handleChange('explorationRate', +e.target.value)}
                className="w-full accent-[#ffb300] bg-[#152033]"
              />
            </div>

            {/* Exploitation Rate */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#8b9eb5]">Exploitation Rate</span>
                <span className="text-[#00ff88] font-bold">{localSettings.exploitationRate}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="0.95"
                step="0.05"
                value={localSettings.exploitationRate}
                onChange={(e) => handleChange('exploitationRate', +e.target.value)}
                className="w-full accent-[#00ff88] bg-[#152033]"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Model Metadata & Backend Integration */}
        <div className="bg-[#0d131d] border border-[#1f2e47] p-4 rounded-sm space-y-4">
          <div className="flex items-center gap-2 pb-2.5 border-b border-[#152033]">
            <Sparkles size={16} className="text-[#b388ff]" />
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">
              MODEL STATUS & INTEGRATION
            </h2>
          </div>

          <div className="space-y-2 text-xs text-[#8b9eb5]">
            <div className="p-2.5 bg-[#070a0f] rounded-xs border border-[#152033]">
              <span className="text-[10px] text-[#637b99] block">ACTIVE MODEL NAME</span>
              <span className="text-white font-bold">{DEFAULT_MODEL_METADATA.modelName}</span>
            </div>

            <div className="p-2.5 bg-[#070a0f] rounded-xs border border-[#152033]">
              <span className="text-[10px] text-[#637b99] block">MODEL STATUS</span>
              <span className="text-[#00ff88] font-bold flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
                ONLINE (CONTINUOUS LEARNING)
              </span>
            </div>

            <div className="p-2.5 bg-[#070a0f] rounded-xs border border-[#152033]">
              <span className="text-[10px] text-[#637b99] block">TRAINING SAMPLES INGESTED</span>
              <span className="text-white font-bold">{DEFAULT_MODEL_METADATA.trainingSamples.toLocaleString()} samples</span>
            </div>

            <div className="p-2.5 bg-[#070a0f] rounded-xs border border-[#152033]">
              <span className="text-[10px] text-[#637b99] block">INFERENCE LATENCY</span>
              <span className="text-[#00e5ff] font-bold">{DEFAULT_MODEL_METADATA.inferenceLatencyMs} ms / decision</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
