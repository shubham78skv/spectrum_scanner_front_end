import React, { useRef, useEffect } from 'react';
import { SpectrumDataPoint, Signal, Emitter } from '../types';
import { Activity, Target, Zap, AlertTriangle, Eye } from 'lucide-react';

interface SpectrumChartProps {
  spectrumData: SpectrumDataPoint[];
  currentFrequency: number;
  predictedTarget: number;
  detectedSignals: Signal[];
  emitters: Emitter[];
  scanMode: 'SMART' | 'BASELINE';
  onFrequencyClick?: (freq: number) => void;
}

export const SpectrumChart: React.FC<SpectrumChartProps> = ({
  spectrumData,
  currentFrequency,
  predictedTarget,
  detectedSignals,
  emitters,
  scanMode,
  onFrequencyClick
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // High performance Canvas rendering loop for 60fps crisp spectrum
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || spectrumData.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = '#070a0f';
    ctx.fillRect(0, 0, width, height);

    // Padding for axes
    const padding = { top: 28, right: 24, bottom: 32, left: 48 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const minFreq = 100.0;
    const maxFreq = 200.0;
    const minPower = -100.0;
    const maxPower = -20.0;

    const freqToX = (f: number) => padding.left + ((f - minFreq) / (maxFreq - minFreq)) * chartW;
    const powerToY = (p: number) => padding.top + chartH - ((p - minPower) / (maxPower - minPower)) * chartH;

    // Draw grid lines
    ctx.strokeStyle = '#152033';
    ctx.lineWidth = 1;

    // Horizontal power grid lines (-90, -80, -70, -60, -50, -40, -30 dBm)
    for (let p = -90; p <= -30; p += 10) {
      const y = powerToY(p);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = '#485e7a';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${p} dBm`, padding.left - 6, y + 3);
    }

    // Vertical frequency grid lines (100, 110, 120... 200 MHz)
    for (let f = 100; f <= 200; f += 10) {
      const x = freqToX(f);
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();

      ctx.fillStyle = '#485e7a';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${f}`, x, height - padding.bottom + 16);
    }

    // Label X-Axis
    ctx.fillStyle = '#637b99';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText('FREQUENCY (MHz)', width - padding.right, height - 6);

    // Draw Predicted High-Interest Region / Confidence Zone
    if (scanMode === 'SMART') {
      const predX = freqToX(predictedTarget);
      const zoneWidth = chartW * 0.08;

      const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
      gradient.addColorStop(0, 'rgba(0, 229, 255, 0.22)');
      gradient.addColorStop(1, 'rgba(0, 229, 255, 0.02)');

      ctx.fillStyle = gradient;
      ctx.fillRect(predX - zoneWidth / 2, padding.top, zoneWidth, chartH);

      // Border outline for predicted zone
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.5)';
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(predX - zoneWidth / 2, padding.top, zoneWidth, chartH);
      ctx.setLineDash([]);

      // Predicted target top tag
      ctx.fillStyle = '#00e5ff';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('AI PREDICTED TARGET', predX, padding.top - 10);
    }

    // Draw Simulated Noise Floor line (-88 dBm)
    const noiseY = powerToY(-88);
    ctx.strokeStyle = 'rgba(255, 179, 0, 0.35)';
    ctx.setLineDash([2, 4]);
    ctx.beginPath();
    ctx.moveTo(padding.left, noiseY);
    ctx.lineTo(width - padding.right, noiseY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = 'rgba(255, 179, 0, 0.6)';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText('NOISE FLOOR (-88 dBm)', padding.left + 8, noiseY - 4);

    // Draw RF Spectrum Power Trace
    ctx.beginPath();
    const firstPoint = spectrumData[0];
    ctx.moveTo(freqToX(firstPoint.frequency), powerToY(firstPoint.powerDbm));

    for (let i = 1; i < spectrumData.length; i++) {
      const pt = spectrumData[i];
      ctx.lineTo(freqToX(pt.frequency), powerToY(pt.powerDbm));
    }

    // Fill under curve
    ctx.lineTo(freqToX(spectrumData[spectrumData.length - 1].frequency), powerToY(minPower));
    ctx.lineTo(freqToX(firstPoint.frequency), powerToY(minPower));
    ctx.closePath();

    const areaGrad = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    areaGrad.addColorStop(0, scanMode === 'SMART' ? 'rgba(0, 229, 255, 0.35)' : 'rgba(255, 179, 0, 0.25)');
    areaGrad.addColorStop(1, 'rgba(7, 10, 15, 0.05)');
    ctx.fillStyle = areaGrad;
    ctx.fill();

    // Trace Stroke Line
    ctx.beginPath();
    ctx.moveTo(freqToX(firstPoint.frequency), powerToY(firstPoint.powerDbm));
    for (let i = 1; i < spectrumData.length; i++) {
      const pt = spectrumData[i];
      ctx.lineTo(freqToX(pt.frequency), powerToY(pt.powerDbm));
    }
    ctx.strokeStyle = scanMode === 'SMART' ? '#00e5ff' : '#ffb300';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Draw Emitter Markers & Labels
    emitters.forEach(emitter => {
      const ex = freqToX(emitter.frequency);
      const ey = powerToY(emitter.strengthDbm);

      // Marker line
      ctx.strokeStyle = emitter.isTransmitting ? '#00ff88' : '#637b99';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex, ey - 14);
      ctx.stroke();

      // Pill badge
      ctx.fillStyle = emitter.isTransmitting ? '#00ff88' : '#152033';
      ctx.beginPath();
      ctx.arc(ex, ey - 14, 3, 0, Math.PI * 2);
      ctx.fill();

      // Emitter Label
      ctx.fillStyle = emitter.isTransmitting ? '#00ff88' : '#637b99';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${emitter.id} (${emitter.frequency}M)`, ex, ey - 18);
    });

    // Draw Active Scanning Cursor (Vertical Laser Line)
    const curX = freqToX(currentFrequency);
    const cursorColor = scanMode === 'SMART' ? '#00e5ff' : '#ffb300';

    ctx.strokeStyle = cursorColor;
    ctx.lineWidth = 2;
    ctx.shadowColor = cursorColor;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(curX, padding.top);
    ctx.lineTo(curX, height - padding.bottom);
    ctx.stroke();
    ctx.shadowBlur = 0; // reset

    // Scan cursor top indicator tag
    ctx.fillStyle = cursorColor;
    ctx.beginPath();
    ctx.moveTo(curX, padding.top);
    ctx.lineTo(curX - 5, padding.top - 8);
    ctx.lineTo(curX + 5, padding.top - 8);
    ctx.closePath();
    ctx.fill();

  }, [spectrumData, currentFrequency, predictedTarget, detectedSignals, emitters, scanMode]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onFrequencyClick || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const paddingLeft = 48;
    const paddingRight = 24;
    const chartW = rect.width - paddingLeft - paddingRight;

    if (x >= paddingLeft && x <= rect.width - paddingRight) {
      const ratio = (x - paddingLeft) / chartW;
      const freq = +(100.0 + ratio * (200.0 - 100.0)).toFixed(2);
      onFrequencyClick(freq);
    }
  };

  return (
    <div className="bg-[#0d131d] border border-[#1f2e47] p-4 rounded-sm relative">
      {/* Header Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2.5 border-b border-[#152033]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#00e5ff]/10 text-[#00e5ff] rounded-sm">
            <Activity size={16} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-mono font-bold text-white tracking-wide flex items-center gap-2">
              LIVE RF SPECTRUM
              <span className="text-[10px] font-mono text-[#00ff88] px-1.5 py-0.2 bg-[#00ff88]/10 border border-[#00ff88]/30 rounded-sm">
                REAL-TIME FFT TRACE
              </span>
            </h2>
            <p className="text-[10px] font-mono text-[#637b99]">
              Simulated 100.00 MHz – 200.00 MHz Bandwidth with Dynamic Noise Floor & Emitters
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[10px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-[#00e5ff]" />
            <span className="text-[#c8d6e5]">RF Power Trace</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#00e5ff]/20 border border-[#00e5ff]/50 rounded-xs" />
            <span className="text-[#00e5ff]">AI Target Zone</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00ff88]" />
            <span className="text-[#00ff88]">Transmitting Emitter</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-[#ffb300] border-t border-dashed" />
            <span className="text-[#ffb300]">Noise Floor</span>
          </div>
        </div>
      </div>

      {/* Canvas Spectrum Display */}
      <div className="relative w-full overflow-hidden bg-[#070a0f] border border-[#152033] rounded-sm cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={800}
          height={260}
          onClick={handleCanvasClick}
          className="w-full h-[260px] block"
        />

        {/* Tactical Scan Line Sweep overlay */}
        <div className="absolute inset-0 pointer-events-none scan-sweep opacity-30" />
      </div>

      {/* Footnote */}
      <div className="flex items-center justify-between mt-2.5 text-[10px] font-mono text-[#637b99]">
        <span>Click anywhere on graph to manually probe simulated frequency slot</span>
        <span className="text-[#00e5ff]">Sweep Resolution: 100 bins / 100 MHz</span>
      </div>
    </div>
  );
};
