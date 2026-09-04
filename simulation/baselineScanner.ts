import { SimulationSettings } from '../types';

export class BaselineScanner {
  private currentFrequency: number;
  private settings: SimulationSettings;
  private isScanningUp: boolean = true;

  constructor(settings: SimulationSettings) {
    this.settings = { ...settings };
    this.currentFrequency = settings.startFreqMHz;
  }

  public updateSettings(newSettings: Partial<SimulationSettings>) {
    this.settings = { ...this.settings, ...newSettings };
  }

  public reset(): void {
    this.currentFrequency = this.settings.startFreqMHz;
    this.isScanningUp = true;
  }

  public getCurrentFrequency(): number {
    return +this.currentFrequency.toFixed(2);
  }

  public getProgressPercentage(): number {
    const { startFreqMHz, stopFreqMHz } = this.settings;
    const progress = ((this.currentFrequency - startFreqMHz) / (stopFreqMHz - startFreqMHz)) * 100;
    return Math.min(100, Math.max(0, +progress.toFixed(1)));
  }

  /**
   * Determine the next frequency in a sequential sweep
   */
  public getNextFrequency(): number {
    const { startFreqMHz, stopFreqMHz, stepSizeMHz } = this.settings;
    let nextFreq = this.currentFrequency;

    if (this.isScanningUp) {
      nextFreq += stepSizeMHz;
      if (nextFreq >= stopFreqMHz) {
        nextFreq = stopFreqMHz;
        this.isScanningUp = false;
      }
    } else {
      nextFreq -= stepSizeMHz;
      if (nextFreq <= startFreqMHz) {
        nextFreq = startFreqMHz;
        this.isScanningUp = true;
      }
    }

    this.currentFrequency = +nextFreq.toFixed(2);
    return this.currentFrequency;
  }
}
