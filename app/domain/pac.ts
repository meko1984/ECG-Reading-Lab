import { ANATOMY_COLORS } from './visual-language.ts';

export const PAC_LEADS = ['I', 'II', 'III', 'aVL', 'aVF', 'V1'] as const;

export type PACLead = (typeof PAC_LEADS)[number];
export type PACOriginId =
  | 'sinus-node'
  | 'right-atrial-appendage'
  | 'left-atrial-appendage'
  | 'left-superior-pv'
  | 'left-inferior-pv'
  | 'right-superior-pv'
  | 'right-inferior-pv'
  | 'cs-ostium'
  | 'svc';
export type PWavePolarity = 'positive' | 'negative' | 'positive-negative' | 'negative-positive' | 'isoelectric';
export type PWaveMorphology = 'smooth' | 'notched' | 'broad';
export type PACWaveformGroupId =
  | 'sinus-node'
  | 'right-atrial-appendage'
  | 'left-superior'
  | 'left-inferior-pv'
  | 'right-superior-pv'
  | 'right-inferior-pv'
  | 'cs-ostium'
  | 'svc';

export type PACOrigin = {
  id: PACOriginId;
  waveformGroup: PACWaveformGroupId;
  markerNumber: number;
  shortName: string;
  siteName: string;
  chamber: string;
  location: string;
  mainClue: string;
  why: string;
  limit: string;
  color: string;
  polarities: Record<PACLead, PWavePolarity>;
  morphologies?: Partial<Record<PACLead, PWaveMorphology>>;
  pWaveScales?: Partial<Record<PACLead, number>>;
};

export const PAC_ORIGINS: PACOrigin[] = [
  {
    id: 'sinus-node',
    waveformGroup: 'sinus-node',
    markerNumber: 1,
    shortName: '洞結節',
    siteName: '洞結節付近',
    chamber: '右房・上外側',
    location: '上大静脈と右房のつなぎ目にある洞結節付近を示します。',
    mainClue: 'Ⅰ・Ⅱ・Ⅲ・aVL・aVFが陽性で、V1は陽性／陰性。洞性P波に最も近い並びです。',
    why: '通常の洞興奮と近い場所から右房、左房の順に広がるため、P′波の向きも洞性P波に似ます。',
    limit: '洞結節そのものと近傍右房は体表心電図だけでは分けにくく、早い出現時刻がPACを見つける手がかりです。',
    color: ANATOMY_COLORS.rightAccent,
    polarities: {
      I: 'positive',
      II: 'positive',
      III: 'positive',
      aVL: 'positive',
      aVF: 'positive',
      V1: 'positive-negative',
    },
    pWaveScales: { aVL: 0.7, V1: 0.8 },
  },
  {
    id: 'right-atrial-appendage',
    waveformGroup: 'right-atrial-appendage',
    markerNumber: 2,
    shortName: '右心耳',
    siteName: '右心耳',
    chamber: '右房・前上方',
    location: '模式図では右房の左上縁に投影した右心耳を示します。',
    mainClue: 'Ⅰ・Ⅱ・Ⅲ・aVL・aVFは陽性ですが、V1に深く幅広い陰性P′波が出るのが代表的です。',
    why: '右心耳から後方の心房へ向かう初期ベクトルを、右前胸部のV1が離れていく向きとして捉えます。',
    limit: '右心耳起源の報告数は多くなく、V1の陰性P′波だけで確定はできません。',
    color: ANATOMY_COLORS.rightAccent,
    polarities: {
      I: 'positive',
      II: 'positive',
      III: 'positive',
      aVL: 'positive',
      aVF: 'positive',
      V1: 'negative',
    },
    morphologies: { V1: 'notched' },
    pWaveScales: { V1: 1.25 },
  },
  {
    id: 'left-atrial-appendage',
    waveformGroup: 'left-superior',
    markerNumber: 3,
    shortName: '左心耳',
    siteName: '左心耳',
    chamber: '左房・前外側',
    location: '左房から前方へ張り出す左心耳を、模式図の右上縁に投影しています。',
    mainClue: 'Ⅰは深い陰性、aVLも陰性。下壁誘導は陽性で、ⅡのP′波には浅い切れ込みを伴うことがあります。V1は幅広い陽性が代表的です。',
    why: '左外側から右方へ進む興奮がⅠ・aVLから離れ、V1へ向かうためです。',
    limit: '左上肺静脈起源と非常によく似ます。Ⅰのより深い陰性が左心耳を考える手がかりですが、重なりがあります。',
    color: ANATOMY_COLORS.leftAccent,
    polarities: {
      I: 'negative',
      II: 'positive',
      III: 'positive',
      aVL: 'negative',
      aVF: 'positive',
      V1: 'positive',
    },
    morphologies: { II: 'notched', V1: 'broad' },
    pWaveScales: { I: 1.15, V1: 1.05 },
  },
  {
    id: 'left-superior-pv',
    waveformGroup: 'left-superior',
    markerNumber: 4,
    shortName: '左上肺静脈',
    siteName: '左上肺静脈',
    chamber: '左房・上後方',
    location: '左房へ入る左上肺静脈の入口付近。患者の左なので、図では画面右上にあります。',
    mainClue: 'Ⅰ・aVLは陰性。Ⅱ・Ⅲ・aVFは陽性で、ⅡのP′波には浅い切れ込みを伴うことがあります。V1は幅広い陽性が代表的です。',
    why: '左後上方から右前下方へ向かう成分をV1が陽性に捉え、左向き誘導のⅠ・aVLは小さくなるか陰性になります。',
    limit: '左心耳や左下肺静脈と重なります。肺静脈4本を体表P′波だけで常に分離できるわけではありません。',
    color: ANATOMY_COLORS.leftAccent,
    polarities: {
      I: 'negative',
      II: 'positive',
      III: 'positive',
      aVL: 'negative',
      aVF: 'positive',
      V1: 'positive',
    },
    morphologies: { II: 'notched', V1: 'broad' },
    pWaveScales: { I: 1.15, V1: 1.05 },
  },
  {
    id: 'left-inferior-pv',
    waveformGroup: 'left-inferior-pv',
    markerNumber: 5,
    shortName: '左下肺静脈',
    siteName: '左下肺静脈',
    chamber: '左房・下後方',
    location: '左房へ入る左下肺静脈の入口付近。図では画面右下にあります。',
    mainClue: 'Ⅰ・aVLは陰性。Ⅱ・Ⅲ・aVFも小さな陰性になりやすく、V1は幅広い陽性が代表的です。',
    why: '下方の起源では上向き成分が増え、下壁誘導から離れるため、上肺静脈より下壁誘導が低振幅または陰性になります。',
    limit: '下壁誘導は低振幅陽性になる例もあります。ここでは上下差を学ぶため、代表的な小さい陰性を表示します。',
    color: ANATOMY_COLORS.leftAccent,
    polarities: {
      I: 'negative',
      II: 'negative',
      III: 'negative',
      aVL: 'negative',
      aVF: 'negative',
      V1: 'positive',
    },
    morphologies: { V1: 'broad' },
    pWaveScales: { II: 0.5, III: 0.5, aVF: 0.5, V1: 1.0 },
  },
  {
    id: 'right-superior-pv',
    waveformGroup: 'right-superior-pv',
    markerNumber: 6,
    shortName: '右上肺静脈',
    siteName: '右上肺静脈',
    chamber: '左房・右上後方',
    location: '患者の右上肺静脈。患者の右を画面左に置くため、図では画面左上にあります。',
    mainClue: 'Ⅰ・Ⅱ・Ⅲ・aVL・aVFとV1が陽性。V1は左肺静脈ほど二峰性にならない代表形です。',
    why: '右上後方から左前下方へ進む興奮がⅠと下壁誘導へ向かい、V1も陽性に捉えます。',
    limit: '洞結節付近や上大静脈起源と似ます。V1が陽性でも右肺静脈だけに決まりません。',
    color: ANATOMY_COLORS.leftAccent,
    polarities: {
      I: 'positive',
      II: 'positive',
      III: 'positive',
      aVL: 'positive',
      aVF: 'positive',
      V1: 'positive',
    },
    morphologies: { V1: 'smooth' },
  },
  {
    id: 'right-inferior-pv',
    waveformGroup: 'right-inferior-pv',
    markerNumber: 7,
    shortName: '右下肺静脈',
    siteName: '右下肺静脈',
    chamber: '左房・右下後方',
    location: '患者の右下肺静脈。図では画面左下にあります。',
    mainClue: 'ⅠとV1は陽性。Ⅱ・Ⅲ・aVFは上肺静脈より小さく、ここでは代表的な小さい陰性を示します。',
    why: '右側起源なのでⅠは陽性を保ちやすい一方、下方起源の上向きベクトルで下壁誘導が小さくなります。',
    limit: '下壁誘導が低振幅陽性の例もあり、右上肺静脈との境界は重なります。',
    color: ANATOMY_COLORS.leftAccent,
    polarities: {
      I: 'positive',
      II: 'negative',
      III: 'negative',
      aVL: 'positive',
      aVF: 'negative',
      V1: 'positive',
    },
    pWaveScales: { II: 0.5, III: 0.5, aVF: 0.5 },
  },
  {
    id: 'cs-ostium',
    waveformGroup: 'cs-ostium',
    markerNumber: 8,
    shortName: '冠静脈洞入口部',
    siteName: '冠静脈洞入口部',
    chamber: '右房・下後方',
    location: '右房下部の心房中隔寄りで、冠静脈洞が開く入口部です。',
    mainClue: 'Ⅱ・Ⅲ・aVFが深い陰性。aVLは陽性、V1は陰性／陽性が代表的です。',
    why: '下方から上方へ広がる興奮が下壁誘導から離れるため、下壁誘導のP′波は下向きになります。',
    limit: '低位右房や下部三尖弁輪など近接起源でも似るため、入口部の確定には心腔内マッピングが必要です。',
    color: ANATOMY_COLORS.rightAccent,
    polarities: {
      I: 'positive',
      II: 'negative',
      III: 'negative',
      aVL: 'positive',
      aVF: 'negative',
      V1: 'negative-positive',
    },
    pWaveScales: { II: 1.1, III: 1.1, aVF: 1.1 },
  },
  {
    id: 'svc',
    waveformGroup: 'svc',
    markerNumber: 9,
    shortName: '上大静脈',
    siteName: '上大静脈',
    chamber: '右房・頭側',
    location: '右房へ入る直前の上大静脈内を代表位置として示します。',
    mainClue: 'Ⅰ・Ⅱ・Ⅲ・aVFは大きな陽性、aVLはほぼ平坦。V1は陽性／陰性が代表的です。',
    why: '頭側から下方へ向かう興奮が下壁誘導に強く近づき、aVLとはほぼ直交します。',
    limit: '洞結節付近や高位右房起源と似ます。aVLが平坦でも上大静脈に確定はできません。',
    color: ANATOMY_COLORS.rightAccent,
    polarities: {
      I: 'positive',
      II: 'positive',
      III: 'positive',
      aVL: 'isoelectric',
      aVF: 'positive',
      V1: 'positive-negative',
    },
    pWaveScales: { I: 1.05, II: 1.15, III: 1.0, aVL: 0.4, aVF: 1.15 },
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
  if (polarity === 'negative-positive') return '陰性／陽性';
  return 'ほぼ平坦';
}

export function continueSvgPath(path: string): string {
  if (!path.startsWith('M')) throw new Error('SVG path segment must start with M');
  return `L${path.slice(1)}`;
}

export function pWaveHalfWidth(scale = 1, morphology: PWaveMorphology = 'smooth'): number {
  return 11 * scale * (morphology === 'broad' ? 1.45 : 1);
}

export function polarityPath(
  polarity: PWavePolarity,
  centerX: number,
  baseline: number,
  scale = 1,
  morphology: PWaveMorphology = 'smooth',
): string {
  const width = pWaveHalfWidth(scale, morphology) * 2;
  const height = 12 * scale;
  const left = centerX - width / 2;
  const right = centerX + width / 2;

  if (polarity === 'isoelectric') {
    return `M${left} ${baseline} C${centerX - width * 0.18} ${baseline} ${centerX - width * 0.12} ${baseline - height * 0.12} ${centerX} ${baseline - height * 0.12} C${centerX + width * 0.14} ${baseline - height * 0.12} ${right - width * 0.18} ${baseline} ${right} ${baseline}`;
  }

  if (polarity === 'positive') {
    if (morphology === 'notched') {
      return `M${left} ${baseline} C${left + width * 0.16} ${baseline} ${left + width * 0.18} ${baseline - height * 0.82} ${left + width * 0.36} ${baseline - height * 0.82} C${left + width * 0.48} ${baseline - height * 0.82} ${centerX - width * 0.05} ${baseline - height * 0.7} ${centerX} ${baseline - height * 0.7} C${centerX + width * 0.08} ${baseline - height * 0.7} ${centerX + width * 0.08} ${baseline - height} ${centerX + width * 0.28} ${baseline - height} C${right - width * 0.16} ${baseline - height} ${right - width * 0.18} ${baseline} ${right} ${baseline}`;
    }
    return `M${left} ${baseline} C${left + width * 0.28} ${baseline} ${centerX - width * 0.16} ${baseline - height} ${centerX} ${baseline - height} C${centerX + width * 0.18} ${baseline - height} ${right - width * 0.22} ${baseline} ${right} ${baseline}`;
  }
  if (polarity === 'negative') {
    if (morphology === 'notched') {
      return `M${left} ${baseline} C${left + width * 0.16} ${baseline} ${left + width * 0.18} ${baseline + height * 0.72} ${left + width * 0.36} ${baseline + height * 0.72} C${left + width * 0.48} ${baseline + height * 0.72} ${centerX - width * 0.05} ${baseline + height * 0.42} ${centerX} ${baseline + height * 0.42} C${centerX + width * 0.08} ${baseline + height * 0.42} ${centerX + width * 0.08} ${baseline + height} ${centerX + width * 0.28} ${baseline + height} C${right - width * 0.16} ${baseline + height} ${right - width * 0.18} ${baseline} ${right} ${baseline}`;
    }
    return `M${left} ${baseline} C${left + width * 0.28} ${baseline} ${centerX - width * 0.16} ${baseline + height} ${centerX} ${baseline + height} C${centerX + width * 0.18} ${baseline + height} ${right - width * 0.22} ${baseline} ${right} ${baseline}`;
  }
  if (polarity === 'positive-negative') {
    return `M${left} ${baseline} C${left + 4 * scale} ${baseline} ${centerX - 7 * scale} ${baseline - height} ${centerX - 4 * scale} ${baseline - height} C${centerX - 1 * scale} ${baseline - height} ${centerX} ${baseline} ${centerX + 1 * scale} ${baseline} C${centerX + 3 * scale} ${baseline} ${centerX + 4 * scale} ${baseline + height * 0.72} ${centerX + 7 * scale} ${baseline + height * 0.72} C${centerX + 10 * scale} ${baseline + height * 0.72} ${right - 2 * scale} ${baseline} ${right} ${baseline}`;
  }
  return `M${left} ${baseline} C${left + 4 * scale} ${baseline} ${centerX - 7 * scale} ${baseline + height * 0.72} ${centerX - 4 * scale} ${baseline + height * 0.72} C${centerX - 1 * scale} ${baseline + height * 0.72} ${centerX} ${baseline} ${centerX + 1 * scale} ${baseline} C${centerX + 3 * scale} ${baseline} ${centerX + 4 * scale} ${baseline - height} ${centerX + 7 * scale} ${baseline - height} C${centerX + 10 * scale} ${baseline - height} ${right - 2 * scale} ${baseline} ${right} ${baseline}`;
}
