import type { PVCLead, PVCOriginId } from '@/app/domain/pvc';
import { PVC_QUICK_LAYOUT, PVC_TIMING, pvcBeatVoltage, pvcLeadDescription, pvcLeadLabel, pvcQrsDuration, pvcStripVoltage, pvcSvgPath } from '@/app/domain/pvc-waveform';

type Props = { lead: PVCLead; color: string; originId: PVCOriginId };

export function PVCWaveform({ lead, color, originId }: Props) {
  const label = pvcLeadLabel(lead);
  const description = pvcLeadDescription(originId, lead);
  const start = PVC_TIMING.prematureQrs;
  const qrsEnd = start + pvcQrsDuration(originId);
  const recoveryEnd = qrsEnd + 320;
  const sample = (ms: number) => pvcStripVoltage(originId, lead, ms);
  const path = (from: number, to: number) => pvcSvgPath(sample, from, to, 0.125, 96, 50, from * 0.125);
  const grid = `pvc-strip-grid-${lead}`;
  const rPeaks = PVC_TIMING.sinusQrs.map(onset => (onset + PVC_TIMING.normalRPeakOffset) * 0.125);
  const height = lead === 'II' ? 232 : 186;
  return (
    <figure className="pvc-waveform-figure" data-lead={lead}>
      <figcaption><strong>{label}</strong><span>{description}</span></figcaption>
      <svg viewBox={`0 0 400 ${height}`} role="img" aria-label={`${label}誘導：${description}。2拍の洞性QRSの後にPVCと二次性ST-Tがあり、長い間隔を経て洞性拍に戻る模式心電図。`}>
        <defs>
          <pattern id={`${grid}-small`} width="5" height="5" patternUnits="userSpaceOnUse"><path d="M5 0H0V5" className="pvc-grid-small" /></pattern>
          <pattern id={grid} width="25" height="25" patternUnits="userSpaceOnUse"><rect width="25" height="25" fill={`url(#${grid}-small)`} /><path d="M25 0H0V25" className="pvc-grid-large" /></pattern>
        </defs>
        <rect width="400" height={height} className="pvc-paper" />
        <rect width="400" height="186" fill={`url(#${grid})`} />
        <rect x={start * 0.125} width={(recoveryEnd - start) * 0.125} height="186" className="pvc-beat-window" />
        <path className="pvc-normal-trace" d={path(0, start)} />
        <path className="pvc-wide-trace" style={{ stroke: color }} d={path(start, qrsEnd)} />
        <path className="pvc-recovery-trace" style={{ stroke: color }} d={path(qrsEnd, recoveryEnd)} />
        <path className="pvc-normal-trace" d={path(recoveryEnd, PVC_TIMING.stripEnd)} />
        <text x={start * 0.125 + 10} y="15" className="pvc-wave-label">PVC</text>
        <text x={(qrsEnd + 170) * 0.125} y="175" className="pvc-stt-label">ST-T</text>
        {lead === 'II' ? <g className="pvc-timing-labels">
          <path d={`M${rPeaks[0]} 197V204H${rPeaks[1]}V197 M${rPeaks[1]} 220V227H${rPeaks[2]}V220`} />
          <text x={(rPeaks[0] + rPeaks[1]) / 2} y="200">RR 800 ms</text>
          <text x={(rPeaks[1] + rPeaks[2]) / 2} y="223">2 × RR = 1600 ms</text>
        </g> : null}
      </svg>
    </figure>
  );
}

export function PVCQuickWaveform({ lead, color, originId }: Props) {
  const qrsEnd = pvcQrsDuration(originId);
  const sample = (ms: number) => pvcBeatVoltage(originId, lead, ms);
  const { width, height, baseline, pxPerMs, pxPerMv } = PVC_QUICK_LAYOUT;
  const path = (from: number, to: number) => pvcSvgPath(sample, from, to, pxPerMs, baseline, pxPerMv, (from + 100) * pxPerMs);
  return (
    <figure className="pvc-quick-waveform" data-lead={lead}>
      <figcaption className="pvc-quick-caption" aria-hidden="true">{pvcLeadLabel(lead)}</figcaption>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" role="img" aria-label={`${pvcLeadLabel(lead)}誘導：${pvcLeadDescription(originId, lead)}のPVCと二次性ST-T。時間軸を拡大した模式波形。`}>
        <rect width={width} height={height} className="pvc-paper" />
        <path d={`M8 ${baseline}H208`} className="pvc-quick-baseline" />
        <path className="pvc-wide-trace" style={{ stroke: color }} d={path(-100, qrsEnd)} />
        <path className="pvc-recovery-trace" style={{ stroke: color }} d={path(qrsEnd, 620)} />
        <text x="10" y="20" className="pvc-quick-lead-label">{pvcLeadLabel(lead)}</text>
      </svg>
    </figure>
  );
}
