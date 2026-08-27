export const PAC_LEADS = ['I', 'II', 'III', 'aVL', 'aVF', 'V1'] as const;

export type PACLead = (typeof PAC_LEADS)[number];
export type PACOriginId = 'crista-terminalis' | 'cs-ostium' | 'left-superior-pv';
export type PWavePolarity = 'positive' | 'negative' | 'positive-negative' | 'negative-positive';
export type PWaveMorphology = 'smooth' | 'notched' | 'broad';

export type PACOrigin = {
  id: PACOriginId;
  shortName: string;
  siteName: string;
  chamber: string;
  location: string;
  mainClue: string;
  why: string;
  limit: string;
  color: string;
  polarities: Record<PACLead, PWavePolarity>;
};

export const PAC_ORIGINS: PACOrigin[] = [
  {
    id: 'crista-terminalis',
    shortName: '上位右房',
    siteName: '上位分界稜付近',
    chamber: '右房・上方',
    location: '右房外側を上下に走る分界稜の上部を、代表起源として置いています。',
    mainClue: 'Ⅱ・Ⅲ・aVFが陽性。V1は陽性／陰性の二相性が代表的。',
    why: '上方から下方へ広がる興奮が下壁誘導へ向かうため、下壁誘導のP′波は上向きになります。',
    limit: '分界稜内でも高さにより波形が変わります。ここではaVL陰性を示しやすい上位起源の一例を表示しています。',
    color: '#146ed6',
    polarities: {
      I: 'positive',
      II: 'positive',
      III: 'positive',
      aVL: 'negative',
      aVF: 'positive',
      V1: 'positive-negative',
    },
  },
  {
    id: 'cs-ostium',
    shortName: '下位右房',
    siteName: '冠静脈洞入口部',
    chamber: '右房・下後方',
    location: '右房下部、心房中隔寄りにある冠静脈洞入口部を代表起源にしています。',
    mainClue: 'Ⅱ・Ⅲ・aVFが深い陰性。aVLは陽性、V1は陰性または平坦から陽性が代表的。',
    why: '下方から上方へ広がる興奮が下壁誘導から離れるため、下壁誘導のP′波は下向きになります。',
    limit: 'I誘導の向きにはばらつきがあります。低位分界稜や下部三尖弁輪など、近接する右房下部起源でも似ます。',
    color: '#d67700',
    polarities: {
      I: 'positive',
      II: 'negative',
      III: 'negative',
      aVL: 'positive',
      aVF: 'negative',
      V1: 'negative-positive',
    },
  },
  {
    id: 'left-superior-pv',
    shortName: '左房',
    siteName: '左上肺静脈付近',
    chamber: '左房・上後方',
    location: '左房へ入る左上肺静脈の入口付近を、左房起源の代表例にしています。',
    mainClue: 'V1が幅広い陽性。Iは陰性または二相性、aVLは陰性、Ⅱ・Ⅲは陽性が代表的。',
    why: '左房後方から右前方へ進む成分をV1が正面から捉え、陽性P′波が目立ちます。',
    limit: '肺静脈ごとの形には重なりがあり、右肺静脈や左房の別部位をV1だけで確定できません。',
    color: '#a23db8',
    polarities: {
      I: 'positive-negative',
      II: 'positive',
      III: 'positive',
      aVL: 'negative',
      aVF: 'positive',
      V1: 'positive',
    },
  },
];

export const PAC_WAVEFORM_SCALE = {
  paperSpeedMmPerSec: 25,
  gainMmPerMv: 10,
  prematureCouplingMs: 520,
  normalCycleMs: 800,
  qrsDurationMs: 80,
} as const;

export function pacOrigin(originId: PACOriginId): PACOrigin {
  const origin = PAC_ORIGINS.find((candidate) => candidate.id === originId);
  if (!origin) throw new Error(`Unknown PAC origin: ${originId}`);
  return origin;
}

export function polarityLabel(polarity: PWavePolarity): string {
  if (polarity === 'positive') return '陽性';
  if (polarity === 'negative') return '陰性';
  if (polarity === 'positive-negative') return '陽性／陰性';
  return '陰性／陽性';
}

export function polarityPath(
  polarity: PWavePolarity,
  centerX: number,
  baseline: number,
  scale = 1,
  morphology: PWaveMorphology = 'smooth',
): string {
  const width = 22 * scale * (morphology === 'broad' ? 1.45 : 1);
  const height = 12 * scale;
  const left = centerX - width / 2;
  const right = centerX + width / 2;

  if (polarity === 'positive') {
    if (morphology === 'notched') {
      return `M${left} ${baseline} C${left + width * 0.16} ${baseline} ${left + width * 0.18} ${baseline - height * 0.72} ${left + width * 0.36} ${baseline - height * 0.72} C${left + width * 0.48} ${baseline - height * 0.72} ${centerX - width * 0.05} ${baseline - height * 0.42} ${centerX} ${baseline - height * 0.42} C${centerX + width * 0.08} ${baseline - height * 0.42} ${centerX + width * 0.08} ${baseline - height} ${centerX + width * 0.28} ${baseline - height} C${right - width * 0.16} ${baseline - height} ${right - width * 0.18} ${baseline} ${right} ${baseline}`;
    }
    return `M${left} ${baseline} C${left + width * 0.28} ${baseline} ${centerX - width * 0.16} ${baseline - height} ${centerX} ${baseline - height} C${centerX + width * 0.18} ${baseline - height} ${right - width * 0.22} ${baseline} ${right} ${baseline}`;
  }
  if (polarity === 'negative') {
    return `M${left} ${baseline} C${left + width * 0.28} ${baseline} ${centerX - width * 0.16} ${baseline + height} ${centerX} ${baseline + height} C${centerX + width * 0.18} ${baseline + height} ${right - width * 0.22} ${baseline} ${right} ${baseline}`;
  }
  if (polarity === 'positive-negative') {
    return `M${left} ${baseline} C${left + 4 * scale} ${baseline} ${centerX - 7 * scale} ${baseline - height} ${centerX - 4 * scale} ${baseline - height} C${centerX - 1 * scale} ${baseline - height} ${centerX} ${baseline} ${centerX + 1 * scale} ${baseline} C${centerX + 3 * scale} ${baseline} ${centerX + 4 * scale} ${baseline + height * 0.72} ${centerX + 7 * scale} ${baseline + height * 0.72} C${centerX + 10 * scale} ${baseline + height * 0.72} ${right - 2 * scale} ${baseline} ${right} ${baseline}`;
  }
  return `M${left} ${baseline} C${left + 4 * scale} ${baseline} ${centerX - 7 * scale} ${baseline + height * 0.72} ${centerX - 4 * scale} ${baseline + height * 0.72} C${centerX - 1 * scale} ${baseline + height * 0.72} ${centerX} ${baseline} ${centerX + 1 * scale} ${baseline} C${centerX + 3 * scale} ${baseline} ${centerX + 4 * scale} ${baseline - height} ${centerX + 7 * scale} ${baseline - height} C${centerX + 10 * scale} ${baseline - height} ${right - 2 * scale} ${baseline} ${right} ${baseline}`;
}
