'use client';

import { useEffect, useRef } from 'react';
import type { ECGWaveformParameters } from '@/app/domain/waveform';

type ECGWaveformProps = {
  parameters: ECGWaveformParameters;
  showsLabels?: boolean;
  height?: number;
  label: string;
};

const DISPLAY_DURATION = 1.2;
const HORIZONTAL_MARGIN = 18;
const VERTICAL_MARGIN = 18;

export function ECGWaveform({
  parameters,
  showsLabels = false,
  height = 170,
  label,
}: ECGWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const draw = () => {
      const width = Math.max(1, canvas.clientWidth);
      const ratio = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);

      const context = canvas.getContext('2d');
      if (!context) return;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, width, height);
      context.fillStyle = 'rgba(245, 252, 255, 0.72)';
      context.fillRect(0, 0, width, height);

      const amplitudes = [
        0,
        parameters.pWaveAmplitude,
        parameters.qWaveAmplitude,
        parameters.rWaveAmplitude,
        parameters.sWaveAmplitude,
        parameters.stLevel,
        parameters.stLevel + parameters.tWaveAmplitude,
        ...(showsLabels ? [-0.3] : []),
      ];
      const minimum = Math.min(...amplitudes) - 0.12;
      const maximum = Math.max(...amplitudes) + 0.12;
      const amplitudeRange = Math.max(1, maximum - minimum);
      const spacingByWidth = (width - HORIZONTAL_MARGIN * 2) /
        (DISPLAY_DURATION * parameters.paperSpeedMmPerSec);
      const spacingByHeight = (height - VERTICAL_MARGIN * 2) /
        (parameters.gainMmPerMv * amplitudeRange);
      const spacing = Math.max(5.5, Math.min(spacingByWidth, spacingByHeight));

      for (let column = 0; column <= Math.ceil(width / spacing) + 1; column += 1) {
        const x = column * spacing;
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.strokeStyle = column % 5 === 0
          ? 'rgba(20, 110, 214, 0.16)'
          : 'rgba(20, 110, 214, 0.08)';
        context.lineWidth = column % 5 === 0 ? 1 : 0.6;
        context.stroke();
      }

      for (let row = 0; row <= Math.ceil(height / spacing) + 1; row += 1) {
        const y = row * spacing;
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.strokeStyle = row % 5 === 0
          ? 'rgba(20, 110, 214, 0.16)'
          : 'rgba(20, 110, 214, 0.08)';
        context.lineWidth = row % 5 === 0 ? 1 : 0.6;
        context.stroke();
      }

      const horizontalScale = parameters.paperSpeedMmPerSec * spacing;
      const verticalScale = parameters.gainMmPerMv * spacing;
      const drawingWidth = DISPLAY_DURATION * horizontalScale;
      const xOffset = Math.max(HORIZONTAL_MARGIN, (width - drawingWidth) / 2);
      const naturalBaseline = VERTICAL_MARGIN + maximum * verticalScale;
      const baseline = Math.min(Math.max(naturalBaseline, VERTICAL_MARGIN), height - VERTICAL_MARGIN);
      const point = (time: number, amplitude: number): [number, number] => [
        xOffset + time * horizontalScale,
        baseline - amplitude * verticalScale,
      ];

      context.beginPath();
      context.moveTo(0, baseline);
      context.lineTo(width, baseline);
      context.strokeStyle = 'rgba(10, 31, 87, 0.32)';
      context.lineWidth = 1.2;
      context.stroke();

      const pStart = parameters.pWaveOnset;
      const qrsStart = pStart + parameters.prInterval;
      const qrsEnd = qrsStart + parameters.qrsDuration;
      const tStart = qrsStart + parameters.qtInterval - parameters.tWaveDuration;
      const tEnd = qrsStart + parameters.qtInterval;

      const addSmoothWave = (
        start: number,
        duration: number,
        baseAmplitude: number,
        peakAmplitude: number,
      ) => {
        const peak = start + duration * 0.5;
        const end = start + duration;
        const peakPoint = point(peak, peakAmplitude);
        const endPoint = point(end, baseAmplitude);
        const controlOne = point(start + duration * 0.18, baseAmplitude);
        const controlTwo = point(start + duration * 0.34, peakAmplitude);
        context.bezierCurveTo(controlOne[0], controlOne[1], controlTwo[0], controlTwo[1], peakPoint[0], peakPoint[1]);
        const controlThree = point(start + duration * 0.66, peakAmplitude);
        const controlFour = point(start + duration * 0.82, baseAmplitude);
        context.bezierCurveTo(controlThree[0], controlThree[1], controlFour[0], controlFour[1], endPoint[0], endPoint[1]);
      };

      context.beginPath();
      context.moveTo(...point(0, 0));
      context.lineTo(...point(pStart, 0));
      addSmoothWave(pStart, parameters.pWaveDuration, 0, parameters.pWaveAmplitude);
      context.lineTo(...point(qrsStart, 0));
      context.lineTo(...point(qrsStart + parameters.qrsDuration * 0.22, parameters.qWaveAmplitude));
      context.lineTo(...point(qrsStart + parameters.qrsDuration * 0.5, parameters.rWaveAmplitude));
      context.lineTo(...point(qrsStart + parameters.qrsDuration * 0.78, parameters.sWaveAmplitude));
      context.lineTo(...point(qrsEnd, parameters.stLevel));
      context.lineTo(...point(tStart, parameters.stLevel));
      addSmoothWave(tStart, parameters.tWaveDuration, parameters.stLevel, parameters.stLevel + parameters.tWaveAmplitude);
      context.lineTo(...point(tEnd + 0.18, 0));
      context.lineTo(...point(DISPLAY_DURATION, 0));
      context.strokeStyle = '#0a1f57';
      context.lineWidth = 2.4;
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.stroke();

      if (showsLabels) {
        context.fillStyle = 'rgba(20, 110, 214, 0.72)';
        context.font = '600 12px system-ui, sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        const pLabel = point(pStart + parameters.pWaveDuration / 2, -0.3);
        const tLabel = point(tStart + parameters.tWaveDuration / 2, -0.3);
        context.fillText('P', pLabel[0], pLabel[1]);
        context.fillText('T', tLabel[0], tLabel[1]);
      }
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [height, parameters, showsLabels]);

  return (
    <canvas
      className="ecg-canvas"
      ref={canvasRef}
      role="img"
      aria-label={label}
      style={{ height }}
    />
  );
}
