import { Emitter, SpectrumDataPoint, SimulationSettings } from '../types';

export class RFSimulator {
  private emitters: Emitter[];
  private settings: SimulationSettings;
  private timeStep: number = 0;
  private noiseFloorBase: number = -88;

  constructor(initialEmitters: Emitter[], settings: SimulationSettings) {
    this.emitters = JSON.parse(JSON.stringify(initialEmitters));
    this.settings = { ...settings };
  }

  public updateSettings(newSettings: Partial<SimulationSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    if (newSettings.noiseFloorDbm !== undefined) {
      this.noiseFloorBase = newSettings.noiseFloorDbm;
    }
  }

  public getEmitters(): Emitter[] {
    return this.emitters;
  }

  public setEmitterState(id: string, isTransmitting: boolean, activity?: 'ACTIVE' | 'INACTIVE' | 'INTERMITTENT') {
    const emitter = this.emitters.find(e => e.id === id);
    if (emitter) {
      emitter.isTransmitting = isTransmitting;
      if (activity) emitter.activity = activity;
      if (isTransmitting) {
        emitter.lastSeen = new Date().toTimeString().split(' ')[0];
      }
    }
  }

  public injectSignalEvent(frequency: number, durationMs: number = 5000): string {
    let target = this.emitters.find(e => Math.abs(e.frequency - frequency) < 2.0);
    if (!target) {
      target = this.emitters[1]; // fallback to EMITTER-02
    }
    target.isTransmitting = true;
    target.activity = 'ACTIVE';
    target.lastSeen = new Date().toTimeString().split(' ')[0];
    
    setTimeout(() => {
      if (target) {
        target.isTransmitting = false;
        target.activity = 'INTERMITTENT';
      }
    }, durationMs);

    return target.id;
  }

  /**
   * Advance simulation by one step: updates emitter duty cycle state & noise fluctuations
   */
  public tick(): void {
    this.timeStep++;
    const nowStr = new Date().toTimeString().split(' ')[0];

    this.emitters.forEach(emitter => {
      // Dynamic pattern behavior simulation
      if (emitter.pattern === 'Continuous') {
        emitter.isTransmitting = true;
        emitter.lastSeen = nowStr;
      } else if (emitter.pattern === 'Periodic') {
        // Toggle on a periodic cycle
        const periodTicks = Math.max(10, Math.floor(1000 / emitter.prfHz * 20));
        const onTicks = Math.floor(periodTicks * (emitter.dutyCyclePct / 100));
        const cycle = this.timeStep % periodTicks;
        emitter.isTransmitting = cycle < onTicks;
        if (emitter.isTransmitting) emitter.lastSeen = nowStr;
      } else if (emitter.pattern === 'Burst') {
        // Pseudo-random bursty transitions
        const threshold = (emitter.dutyCyclePct / 100) * (this.settings.signalActivityRate / 100);
        if (Math.random() < 0.15) {
          emitter.isTransmitting = Math.random() < threshold;
          if (emitter.isTransmitting) emitter.lastSeen = nowStr;
        }
      } else if (emitter.pattern === 'Hopping') {
        // Intermittent frequency hopping channel
        if (this.timeStep % 6 === 0) {
          emitter.isTransmitting = Math.random() < 0.35;
          if (emitter.isTransmitting) emitter.lastSeen = nowStr;
        }
      } else if (emitter.pattern === 'Random') {
        if (this.timeStep % 12 === 0) {
          emitter.isTransmitting = Math.random() < 0.2;
          if (emitter.isTransmitting) emitter.lastSeen = nowStr;
        }
      }
    });
  }

  /**
   * Generates discrete spectrum bins from startFreq to stopFreq
   */
  public generateSpectrum(
    currentScanFreq: number, 
    predictedTargetFreq: number,
    numBins: number = 100
  ): SpectrumDataPoint[] {
    const { startFreqMHz, stopFreqMHz } = this.settings;
    const step = (stopFreqMHz - startFreqMHz) / (numBins - 1);
    const data: SpectrumDataPoint[] = [];

    for (let i = 0; i < numBins; i++) {
      const freq = +(startFreqMHz + i * step).toFixed(2);
      
      // Realistic Gaussian + Rayleigh simulated noise floor
      const noiseVariation = (Math.random() - 0.5) * 4.5 + (Math.sin(freq * 0.1 + this.timeStep * 0.05) * 1.5);
      let power = this.noiseFloorBase + noiseVariation;
      let isSignal = false;
      let matchedEmitterId: string | undefined = undefined;

      // Add signal peak contributions for transmitting emitters
      for (const emitter of this.emitters) {
        const freqDiff = Math.abs(freq - emitter.frequency);
        const bw = emitter.bandwidth;

        // If within emitter band
        if (freqDiff < bw * 1.8) {
          const attenuation = Math.exp(-0.5 * Math.pow(freqDiff / (bw * 0.4), 2));
          
          if (emitter.isTransmitting) {
            // Signal present
            const signalPeakPower = emitter.strengthDbm + (Math.random() - 0.5) * 2.0;
            const contribution = (signalPeakPower - this.noiseFloorBase) * attenuation;
            power = Math.max(power, this.noiseFloorBase + contribution);
            if (freqDiff < bw * 0.6) {
              isSignal = true;
              matchedEmitterId = emitter.id;
            }
          } else {
            // Low residual memory trace / faint ghost reflection
            const ghostContribution = 3.0 * attenuation;
            power = Math.max(power, this.noiseFloorBase + ghostContribution);
          }
        }
      }

      // Small spurious noise spikes
      if (Math.random() < 0.015) {
        power += Math.random() * 8;
      }

      const isTargeted = Math.abs(freq - predictedTargetFreq) < step * 1.2;
      const isScanned = Math.abs(freq - currentScanFreq) < step * 1.2;
      const confidenceZone = isTargeted || Math.abs(freq - predictedTargetFreq) < 4.0;

      data.push({
        frequency: freq,
        powerDbm: +power.toFixed(1),
        noiseFloorDbm: this.noiseFloorBase,
        isSignal,
        emitterId: matchedEmitterId,
        isTargeted,
        isScanned,
        confidenceZone
      });
    }

    return data;
  }

  /**
   * Check if a scan at `frequency` results in a signal detection hit
   */
  public probeFrequency(frequency: number, toleranceMHz: number = 1.2): {
    isHit: boolean;
    emitter?: Emitter;
    powerDbm: number;
    snr: number;
    noiseFloorDbm: number;
  } {
    const noise = this.noiseFloorBase + (Math.random() - 0.5) * 3;
    
    // Find active emitter near this frequency
    const hitEmitter = this.emitters.find(e => 
      e.isTransmitting && Math.abs(e.frequency - frequency) <= (e.bandwidth / 2 + toleranceMHz)
    );

    if (hitEmitter) {
      const freqDelta = Math.abs(hitEmitter.frequency - frequency);
      const attenuation = Math.max(0.6, 1 - (freqDelta / (hitEmitter.bandwidth + toleranceMHz)));
      const power = hitEmitter.strengthDbm * attenuation + (Math.random() - 0.5) * 1.5;
      const snr = +(power - noise).toFixed(1);

      return {
        isHit: true,
        emitter: hitEmitter,
        powerDbm: +power.toFixed(1),
        snr: Math.max(4.0, snr),
        noiseFloorDbm: +noise.toFixed(1)
      };
    }

    // False alarm simulation (very low probability ~1.8%)
    const falseAlarm = Math.random() < 0.018;
    if (falseAlarm) {
      const faPower = noise + 8 + Math.random() * 4;
      return {
        isHit: false,
        powerDbm: +faPower.toFixed(1),
        snr: +(faPower - noise).toFixed(1),
        noiseFloorDbm: +noise.toFixed(1)
      };
    }

    return {
      isHit: false,
      powerDbm: +noise.toFixed(1),
      snr: 0,
      noiseFloorDbm: +noise.toFixed(1)
    };
  }
}
