import { pvcLeadMorphology, type PVCBundlePattern, type PVCLead, type PVCLeadMorphology, type PVCOriginId, type PVCPolarity, type PVCRegion } from '@/app/domain/pvc';

type PVCWaveformProps = {
  lead: string;
  color: string;
  bundlePattern?: PVCBundlePattern;
  polarity?: PVCPolarity;
  region: PVCRegion;
  originId: PVCOriginId;
};

type PVCQRSKind = PVCBundlePattern | PVCPolarity | PVCLeadMorphology | 'qs';

const LEAD_LABELS: Record<string, string> = { I: 'Ⅰ', II: 'Ⅱ', III: 'Ⅲ' };
const LEAD_AMPLITUDE: Record<string, number> = {
  I: 0.9,
  II: 1,
  III: 0.88,
  aVL: 0.76,
  aVF: 0.94,
  V1: 1,
  V5: 0.92,
  V6: 0.82,
};

const leadLabel = (lead: string) => LEAD_LABELS[lead] ?? lead;

function qrsKind(originId: PVCOriginId, lead: PVCLead, bundlePattern: PVCBundlePattern | undefined, polarity: PVCPolarity | undefined, region: PVCRegion): PVCQRSKind {
  const detailedMorphology = pvcLeadMorphology(originId, lead);
  if (detailedMorphology) return detailedMorphology;
  if (bundlePattern) return bundlePattern;
  const isLeftwardLead = lead === 'I' || lead === 'aVL' || lead === 'V5' || lead === 'V6';
  if (polarity === 'negative' && isLeftwardLead && (region === 'upper-inner' || region === 'apex')) return 'qs';
  return polarity ?? 'positive';
}

function amplitudeFor(lead: string, kind: PVCQRSKind, region: PVCRegion): number {
  const leadScale = LEAD_AMPLITUDE[lead] ?? 1;
  if (kind !== 'qs') return leadScale;
  return leadScale * (region === 'apex' ? 1.22 : 0.92);
}

function directionLabel(kind: PVCQRSKind, region: PVCRegion): string {
  if (kind === 'rvot-low-rs') return '低振幅rS型（実波形例）';
  if (kind === 'rvot-inferior-rs') return '高いR優位・終末S型（実波形例）';
  if (kind === 'rvot-avl-qs') return 'QS型（実波形例）';
  if (kind === 'rvot-v1-qs') return 'QS優位の左脚ブロック様（実波形例）';
  if (kind === 'rvot-lateral-rs') return 'R優位・終末S型（実波形例）';
  if (kind === 'rbbb-like') return '右脚ブロック様';
  if (kind === 'lbbb-like') return '左脚ブロック様';
  if (kind === 'qs') return region === 'apex' ? '深いQS型（心尖部）' : 'QS型（心尖部寄り）';
  return kind === 'negative' ? '陰性' : '陽性';
}

function isPositiveKind(kind: PVCQRSKind): boolean {
  return kind === 'rbbb-like' || kind === 'positive' || kind === 'rvot-inferior-rs' || kind === 'rvot-lateral-rs';
}

function fullQrsPath(kind: PVCQRSKind): string {
  if (kind === 'rvot-low-rs') return 'M202 62 H211 C215 62 216 58 220 56 L223 59 L229 74 L233 77 L238 73 C244 68 249 64 254 62 H266';
  if (kind === 'rvot-inferior-rs') return 'M202 62 H211 C215 59 218 38 222 25 L225 18 L229 30 C232 43 233 62 238 76 L243 84 L248 80 C254 73 257 65 261 62 H266';
  if (kind === 'rvot-avl-qs') return 'M202 62 H214 C219 64 221 79 226 90 L234 99 L241 91 C247 82 252 69 258 64 C261 62 263 62 266 62';
  if (kind === 'rvot-v1-qs') return 'M202 62 H211 C215 62 216 57 220 55 L223 59 C226 70 228 84 233 93 L238 99 L244 90 C249 82 253 70 258 64 C261 62 263 62 266 62';
  if (kind === 'rvot-lateral-rs') return 'M202 62 H211 C215 60 217 44 221 31 L224 22 L228 31 C232 42 233 60 238 71 L244 78 L250 73 C255 68 258 63 262 62 H266';
  if (kind === 'rbbb-like') return 'M202 62 H211 C216 62 217 67 221 69 L225 63 C227 53 229 43 233 37 L239 28 L245 38 C249 47 251 61 256 68 L260 71 L263 65 L266 62';
  if (kind === 'lbbb-like') return 'M202 62 H211 C215 62 217 57 221 55 L225 61 C228 72 230 84 235 91 L240 98 L246 89 C250 82 254 71 259 65 C262 62 264 62 266 62';
  if (kind === 'qs') return 'M202 62 H214 C220 62 221 74 227 86 L236 99 L244 91 C250 84 254 73 259 66 C262 63 264 62 266 62';
  if (kind === 'negative') return 'M202 62 H211 C216 62 217 57 221 55 L225 61 C228 72 230 82 235 89 L240 97 L246 88 C251 81 254 71 259 65 C262 62 264 62 266 62';
  return 'M202 62 H211 C215 62 217 68 221 69 L225 62 C227 50 229 38 233 30 L237 23 L242 32 C246 42 247 58 252 69 L257 78 L261 70 C263 66 264 63 266 62';
}

function quickQrsPath(kind: PVCQRSKind): string {
  if (kind === 'rvot-low-rs') return 'M8 58 H51 C55 58 56 54 60 52 L63 55 L69 70 L73 73 L78 69 C84 64 89 60 94 58 H105';
  if (kind === 'rvot-inferior-rs') return 'M8 58 H51 C55 55 58 34 62 21 L65 14 L69 26 C72 39 73 58 78 72 L83 80 L88 76 C94 69 97 61 101 58 H105';
  if (kind === 'rvot-avl-qs') return 'M8 58 H54 C59 60 61 75 66 86 L74 95 L81 87 C87 78 92 65 98 60 C101 58 103 58 105 58';
  if (kind === 'rvot-v1-qs') return 'M8 58 H51 C55 58 56 53 60 51 L63 55 C66 66 68 80 73 89 L78 95 L84 86 C89 78 93 66 98 60 C101 58 103 58 105 58';
  if (kind === 'rvot-lateral-rs') return 'M8 58 H51 C55 56 57 40 61 27 L64 18 L68 27 C72 38 73 56 78 67 L84 74 L90 69 C95 64 98 59 102 58 H105';
  if (kind === 'rbbb-like') return 'M8 58 H51 C56 58 57 63 61 65 L65 59 C67 49 69 39 73 33 L79 24 L85 34 C89 43 91 57 96 64 L100 67 L103 61 L105 58';
  if (kind === 'lbbb-like') return 'M8 58 H51 C55 58 57 53 61 51 L65 57 C68 68 70 80 75 87 L80 94 L86 85 C90 78 94 67 99 61 C102 58 104 58 105 58';
  if (kind === 'qs') return 'M8 58 H54 C60 58 61 70 67 82 L76 95 L84 87 C90 80 94 69 99 62 C102 59 104 58 105 58';
  if (kind === 'negative') return 'M8 58 H51 C56 58 57 53 61 51 L65 57 C68 68 70 78 75 85 L80 93 L86 84 C91 77 94 67 99 61 C102 58 104 58 105 58';
  return 'M8 58 H51 C55 58 57 64 61 65 L65 58 C67 46 69 34 73 26 L77 19 L82 28 C86 38 87 54 92 65 L97 74 L101 66 C103 62 104 59 105 58';
}

function fullRecoveryPath(positiveQrs: boolean): string {
  return positiveQrs
    ? 'M266 62 C273 64 278 68 284 69 H292 C300 69 304 82 314 83 C325 84 334 68 342 64 C349 61 356 62 364 62'
    : 'M266 62 C273 60 278 56 284 55 H292 C300 55 304 42 314 41 C325 40 334 56 342 60 C349 63 356 62 364 62';
}

function quickRecoveryPath(positiveQrs: boolean): string {
  return positiveQrs
    ? 'M105 58 C112 60 117 64 123 65 H131 C139 65 143 78 153 79 C164 80 173 64 181 60 C188 57 195 58 202 58 H232'
    : 'M105 58 C112 56 117 52 123 51 H131 C139 51 143 38 153 37 C164 36 173 52 181 56 C188 59 195 58 202 58 H232';
}

export function PVCWaveform({ lead, color, bundlePattern, polarity, region, originId }: PVCWaveformProps) {
  const visibleLead = leadLabel(lead);
  const kind = qrsKind(originId, lead as PVCLead, bundlePattern, polarity, region);
  const direction = directionLabel(kind, region);
  const amplitude = amplitudeFor(lead, kind, region);
  const patternId = lead.replace(/[^a-zA-Z0-9]/g, '-');
  const transform = `translate(0 62) scale(1 ${amplitude}) translate(0 -62)`;

  return (
    <figure className="pvc-waveform-figure">
      <svg viewBox="0 0 520 118" role="img" aria-label={`${visibleLead}誘導の連続模式心電図。洞調律より早く出た${direction}の心室性期外収縮と、主QRS方向に対して逆向きのST-T、その後の洞性拍を示します。`}>
        <defs>
          <pattern id={`pvc-small-${patternId}`} width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" className="pvc-grid-small" /></pattern>
          <pattern id={`pvc-large-${patternId}`} width="50" height="50" patternUnits="userSpaceOnUse"><rect width="50" height="50" fill={`url(#pvc-small-${patternId})`} /><path d="M50 0H0V50" className="pvc-grid-large" /></pattern>
        </defs>
        <rect width="520" height="118" className="pvc-paper" /><rect width="520" height="118" fill={`url(#pvc-large-${patternId})`} /><rect x="194" width="174" height="118" className="pvc-beat-window" />
        <path className="pvc-normal-trace" d="M0 62 H24 C31 62 35 54 40 54 C45 54 49 62 56 62 H76 L82 67 L88 34 L95 78 L102 62 H118 C127 62 134 50 144 50 C154 50 161 62 170 62 H202" />
        <g transform={transform}>
          <path className="pvc-wide-trace" style={{ stroke: color }} d={fullQrsPath(kind)} />
          <path className="pvc-recovery-trace" style={{ stroke: color }} d={fullRecoveryPath(isPositiveKind(kind))} />
        </g>
        <path className="pvc-normal-trace" d="M364 62 H366 C373 62 377 54 382 54 C387 54 391 62 398 62 H418 L424 67 L430 34 L437 78 L444 62 H460 C469 62 476 50 486 50 C496 50 503 62 512 62 H520" />
        <text x="235" y="15" className="pvc-wave-label" style={{ fill: color }}>PVC</text>
        <text x="306" y="108" className="pvc-stt-label" style={{ fill: color }}>二次性ST-T</text>
      </svg>
      <figcaption><strong>{visibleLead}</strong><span>{direction}</span></figcaption>
    </figure>
  );
}

export function PVCQuickWaveform({ lead, color, bundlePattern, polarity, region, originId }: PVCWaveformProps) {
  const visibleLead = leadLabel(lead);
  const kind = qrsKind(originId, lead as PVCLead, bundlePattern, polarity, region);
  const direction = directionLabel(kind, region);
  const amplitude = amplitudeFor(lead, kind, region);
  const patternId = `quick-${lead.replace(/[^a-zA-Z0-9]/g, '-')}`;
  const transform = `translate(0 58) scale(1 ${amplitude}) translate(0 -58)`;

  return (
    <figure className="pvc-quick-waveform">
      <svg viewBox="0 0 240 104" role="img" aria-label={`${visibleLead}誘導。${direction}の幅広いPVCと逆向きの二次性ST-Tを示す模式波形。`}>
        <defs>
          <pattern id={`pvc-small-${patternId}`} width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" className="pvc-grid-small" /></pattern>
          <pattern id={`pvc-large-${patternId}`} width="50" height="50" patternUnits="userSpaceOnUse"><rect width="50" height="50" fill={`url(#pvc-small-${patternId})`} /><path d="M50 0H0V50" className="pvc-grid-large" /></pattern>
        </defs>
        <rect width="240" height="104" className="pvc-paper" />
        <rect width="240" height="104" fill={`url(#pvc-large-${patternId})`} />
        <rect x="42" width="166" height="104" className="pvc-beat-window" />
        <g transform={transform}>
          <path className="pvc-wide-trace" style={{ stroke: color }} d={quickQrsPath(kind)} />
          <path className="pvc-recovery-trace" style={{ stroke: color }} d={quickRecoveryPath(isPositiveKind(kind))} />
        </g>
        <text x="12" y="18" className="pvc-quick-lead-label">{visibleLead}</text>
      </svg>
    </figure>
  );
}
