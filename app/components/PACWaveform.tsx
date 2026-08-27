import {
  PAC_WAVEFORM_SCALE,
  continueSvgPath,
  pWaveHalfWidth,
  polarityLabel,
  polarityPath,
  type PACLead,
  type PWaveMorphology,
  type PWavePolarity,
} from '@/app/domain/pac';

type PACWaveformProps = {
  lead: PACLead;
  polarity: PWavePolarity;
  color: string;
  morphology?: PWaveMorphology;
  pWaveScale?: number;
};

type PACMiniWaveProps = {
  polarity: PWavePolarity;
};

const baseline = 80;
const pxPerMs = 8 / 40;
const firstP = 76;
const pacP = firstP + PAC_WAVEFORM_SCALE.prematureCouplingMs * pxPerMs;
const nextSinusP = pacP + PAC_WAVEFORM_SCALE.normalCycleMs * pxPerMs;
const prIntervalPx = 160 * pxPerMs;
const qrsWidthPx = PAC_WAVEFORM_SCALE.qrsDurationMs * pxPerMs;

type LeadShape = {
  sinusPolarity: PWavePolarity;
  sinusScale: number;
  q: number;
  r: number;
  s: number;
  t: number;
};

const LEAD_SHAPES: Record<PACLead, LeadShape> = {
  I: { sinusPolarity: 'positive', sinusScale: 0.62, q: 2, r: -20, s: 5, t: -8 },
  II: { sinusPolarity: 'positive', sinusScale: 0.78, q: 3, r: -27, s: 8, t: -11 },
  III: { sinusPolarity: 'positive', sinusScale: 0.48, q: 3, r: -15, s: 7, t: -7 },
  aVL: { sinusPolarity: 'positive', sinusScale: 0.38, q: 2, r: -9, s: 4, t: -5 },
  aVF: { sinusPolarity: 'positive', sinusScale: 0.68, q: 3, r: -23, s: 7, t: -9 },
  V1: { sinusPolarity: 'positive-negative', sinusScale: 0.52, q: 1, r: -6, s: 24, t: 7 },
};

function ventricularPath(pCenter: number, shape: LeadShape): string {
  const qrsStart = pCenter + prIntervalPx;
  const q = qrsStart + qrsWidthPx * 0.18;
  const r = qrsStart + qrsWidthPx * 0.42;
  const s = qrsStart + qrsWidthPx * 0.7;
  const qrsEnd = qrsStart + qrsWidthPx;
  const tStart = qrsEnd + 12;
  const tPeak = tStart + 16;
  const tEnd = tStart + 34;
  return `M${pCenter + 16} ${baseline} H${qrsStart} L${q} ${baseline + shape.q} L${r} ${baseline + shape.r} L${s} ${baseline + shape.s} L${qrsEnd} ${baseline} H${tStart} C${tStart + 7} ${baseline} ${tPeak - 6} ${baseline + shape.t} ${tPeak} ${baseline + shape.t} C${tPeak + 7} ${baseline + shape.t} ${tEnd - 7} ${baseline} ${tEnd} ${baseline}`;
}

function pacMorphology(lead: PACLead, polarity: PWavePolarity, override?: PWaveMorphology): PWaveMorphology {
  if (override) return override;
  if (lead === 'V1' && polarity === 'positive') return 'broad';
  if ((lead === 'II' || lead === 'V1') && polarity === 'positive') return 'notched';
  return 'smooth';
}

export function PACMiniWave({ polarity }: PACMiniWaveProps) {
  return (
    <svg className="pac-mini-wave" viewBox="0 0 112 50" aria-hidden="true">
      <path d="M5 25H107" className="pac-mini-baseline" />
      <path d={polarityPath(polarity, 56, 25, 1.35)} className="pac-mini-trace" />
    </svg>
  );
}

export function PACWaveform({ lead, polarity, color, morphology, pWaveScale = 1 }: PACWaveformProps) {
  const shape = LEAD_SHAPES[lead];
  const sinusBefore = polarityPath(shape.sinusPolarity, firstP, baseline, shape.sinusScale);
  const prematureScale = 0.82 * pWaveScale;
  const prematureMorphology = pacMorphology(lead, polarity, morphology);
  const premature = polarityPath(polarity, pacP, baseline, prematureScale, prematureMorphology);
  const prematureHalfWidth = pWaveHalfWidth(prematureScale, prematureMorphology);
  const sinusAfter = polarityPath(shape.sinusPolarity, nextSinusP, baseline, shape.sinusScale);
  const traceBeforePrematureP = [
    `M7 ${baseline} H${firstP - 16}`,
    continueSvgPath(sinusBefore),
    continueSvgPath(ventricularPath(firstP, shape)),
    `H${pacP - prematureHalfWidth}`,
  ].join(' ');
  const traceAfterPrematureP = [
    `M${pacP + prematureHalfWidth} ${baseline}`,
    continueSvgPath(ventricularPath(pacP, shape)),
    `H${nextSinusP - 16}`,
    continueSvgPath(sinusAfter),
    continueSvgPath(ventricularPath(nextSinusP, shape)),
    'H513',
  ].join(' ');
  const summary = `${lead}誘導の連続模式心電図。洞調律、${polarityLabel(polarity)}のPダッシュ波を伴う心房期外収縮、洞調律の順に3拍を示します。`;

  return (
    <figure className="pac-waveform-figure">
      <svg viewBox="0 0 520 132" role="img" aria-label={summary}>
        <defs>
          <pattern id={`pac-small-grid-${lead}`} width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M8 0L0 0 0 8" className="pac-grid-small" />
          </pattern>
          <pattern id={`pac-grid-${lead}`} width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill={`url(#pac-small-grid-${lead})`} />
            <path d="M40 0L0 0 0 40" className="pac-grid-large" />
          </pattern>
        </defs>
        <rect width="520" height="132" className="pac-paper" />
        <rect width="520" height="132" fill={`url(#pac-grid-${lead})`} />
        <rect x={pacP - 20} y="5" width="122" height="122" className="pac-beat-window" />
        <path d={traceBeforePrematureP} className="pac-trace pac-trace-before-p-prime" />
        <path d={premature} className="pac-p-prime" style={{ stroke: color }} />
        <path d={traceAfterPrematureP} className="pac-trace pac-trace-after-p-prime" />
        <text x={firstP + 28} y="18" className="pac-beat-label">洞調律</text>
        <text x={pacP + 30} y="18" className="pac-beat-label pac-beat-label-accent" style={{ fill: color }}>PAC</text>
        <text x={nextSinusP + 28} y="18" className="pac-beat-label">洞調律</text>
        <text x="14" y="42" className="lead-label">{lead}</text>
        <text x="506" y="122" className="pac-scale-label" textAnchor="end">25 mm/s</text>
      </svg>
      <figcaption>
        <strong>{lead}：P′は{polarityLabel(polarity)}</strong>
        <span>洞性P・QRS・Tも誘導別</span>
      </figcaption>
    </figure>
  );
}
