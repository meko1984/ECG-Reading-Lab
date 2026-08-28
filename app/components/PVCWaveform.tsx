import type { PVCBundlePattern, PVCPolarity } from '@/app/domain/pvc';

type PVCWaveformProps = { lead: string; color: string; bundlePattern?: PVCBundlePattern; polarity?: PVCPolarity };

const LEAD_LABELS: Record<string, string> = { I: 'Ⅰ', II: 'Ⅱ', III: 'Ⅲ' };
const leadLabel = (lead: string) => LEAD_LABELS[lead] ?? lead;

function pvcPath(bundlePattern?: PVCBundlePattern, polarity?: PVCPolarity): string {
  if (bundlePattern === 'rbbb-like') return 'M205 62 H224 L233 67 L245 25 L258 46 L272 20 L288 69 L303 62 H332';
  if (bundlePattern === 'lbbb-like') return 'M205 62 H224 L234 55 L247 91 L265 101 L284 52 L299 66 L309 62 H332';
  if (polarity === 'negative') return 'M205 62 H225 L236 56 L250 88 L268 102 L286 34 L302 67 L313 62 H332';
  return 'M205 62 H225 L236 68 L252 18 L270 28 L289 89 L304 58 L314 62 H332';
}

export function PVCWaveform({ lead, color, bundlePattern, polarity }: PVCWaveformProps) {
  const visibleLead = leadLabel(lead);
  const direction = bundlePattern ? bundlePattern === 'rbbb-like' ? '右脚ブロック様' : '左脚ブロック様' : polarity === 'negative' ? '陰性' : '陽性';
  const patternId = lead.replace(/[^a-zA-Z0-9]/g, '-');
  return (
    <figure className="pvc-waveform-figure">
      <svg viewBox="0 0 520 118" role="img" aria-label={`${visibleLead}誘導の連続模式心電図。洞調律、${direction}の心室性期外収縮、洞調律の順に示します。`}>
        <defs>
          <pattern id={`pvc-small-${patternId}`} width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" className="pvc-grid-small" /></pattern>
          <pattern id={`pvc-large-${patternId}`} width="50" height="50" patternUnits="userSpaceOnUse"><rect width="50" height="50" fill={`url(#pvc-small-${patternId})`} /><path d="M50 0H0V50" className="pvc-grid-large" /></pattern>
        </defs>
        <rect width="520" height="118" className="pvc-paper" /><rect width="520" height="118" fill={`url(#pvc-large-${patternId})`} /><rect x="194" width="150" height="118" className="pvc-beat-window" />
        <path className="pvc-normal-trace" d="M0 62 H24 C31 62 35 54 40 54 C45 54 49 62 56 62 H76 L82 67 L88 34 L95 78 L102 62 H118 C127 62 134 50 144 50 C154 50 161 62 170 62 H205" />
        <path className="pvc-wide-trace" style={{ stroke: color }} d={pvcPath(bundlePattern, polarity)} />
        <path className="pvc-normal-trace" d="M332 62 H366 C373 62 377 54 382 54 C387 54 391 62 398 62 H418 L424 67 L430 34 L437 78 L444 62 H460 C469 62 476 50 486 50 C496 50 503 62 512 62 H520" />
        <text x="268" y="15" className="pvc-wave-label" style={{ fill: color }}>PVC</text>
      </svg>
      <figcaption><strong>{visibleLead}</strong><span>{direction}</span></figcaption>
    </figure>
  );
}
