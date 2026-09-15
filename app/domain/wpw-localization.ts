import type { WPWTypeId } from '@/app/domain/wpw';

export type DeltaPolarity = 'positive' | 'isoelectric' | 'negative';
export type AnnularDirection = 'anterior' | 'lateral' | 'posterior';

export type LocalizationInput = {
  v1Type: WPWTypeId;
  leadII: DeltaPolarity;
  leadIII: DeltaPolarity;
  leadAVF: DeltaPolarity;
};

export type PathwayLocationId =
  | 'left-anterior'
  | 'left-lateral'
  | 'left-posterior'
  | 'anteroseptal'
  | 'midseptal'
  | 'posteroseptal'
  | 'right-anterior'
  | 'right-lateral'
  | 'right-posterior';

export type PathwayLocation = {
  id: PathwayLocationId;
  abbreviation: string;
  name: string;
  coarseType: WPWTypeId;
  direction: AnnularDirection;
  area: 'left' | 'septal' | 'right';
  anatomy: string;
  resolutionNote: string;
  representativeInput: LocalizationInput;
};

export type LocalizationDecision = {
  location: PathwayLocation;
  direction: AnnularDirection;
  steps: string[];
};

const inferiorPresets: Record<AnnularDirection, Pick<LocalizationInput, 'leadII' | 'leadIII' | 'leadAVF'>> = {
  anterior: { leadII: 'positive', leadIII: 'positive', leadAVF: 'positive' },
  lateral: { leadII: 'isoelectric', leadIII: 'isoelectric', leadAVF: 'isoelectric' },
  posterior: { leadII: 'negative', leadIII: 'negative', leadAVF: 'negative' },
};

export const PATHWAY_LOCATIONS: PathwayLocation[] = [
  {
    id: 'left-anterior',
    abbreviation: 'LAL',
    name: '左前壁〜左前側壁',
    coarseType: 'type-a',
    direction: 'anterior',
    area: 'left',
    anatomy: '僧帽弁輪の前方から前側壁寄りにある副伝導路の代表位置です。',
    resolutionNote: 'V1のタイプA相当と、下壁誘導の陽性優位を組み合わせた学習上の候補です。',
    representativeInput: { v1Type: 'type-a', ...inferiorPresets.anterior },
  },
  {
    id: 'left-lateral',
    abbreviation: 'LL',
    name: '左側壁',
    coarseType: 'type-a',
    direction: 'lateral',
    area: 'left',
    anatomy: '僧帽弁輪の左側壁中央付近にある副伝導路の代表位置です。',
    resolutionNote: '下壁誘導の向きがそろわない、または等電位が多いときの中間候補です。',
    representativeInput: { v1Type: 'type-a', ...inferiorPresets.lateral },
  },
  {
    id: 'left-posterior',
    abbreviation: 'LPL',
    name: '左後壁〜左後側壁',
    coarseType: 'type-a',
    direction: 'posterior',
    area: 'left',
    anatomy: '僧帽弁輪の後方から後側壁寄りにある副伝導路の代表位置です。',
    resolutionNote: 'V1のタイプA相当と、下壁誘導の陰性優位を組み合わせた学習上の候補です。',
    representativeInput: { v1Type: 'type-a', ...inferiorPresets.posterior },
  },
  {
    id: 'anteroseptal',
    abbreviation: 'AS',
    name: '前中隔',
    coarseType: 'type-c',
    direction: 'anterior',
    area: 'septal',
    anatomy: '三尖弁輪の前中隔部で、ヒス束に近い領域の代表位置です。',
    resolutionNote: '正常刺激伝導系に近く、実際の位置は心内マッピングで慎重に確認します。',
    representativeInput: { v1Type: 'type-c', ...inferiorPresets.anterior },
  },
  {
    id: 'midseptal',
    abbreviation: 'MS',
    name: '中中隔',
    coarseType: 'type-c',
    direction: 'lateral',
    area: 'septal',
    anatomy: '三尖弁輪中隔部の中央付近にある副伝導路の代表位置です。',
    resolutionNote: '前中隔と後中隔の間を示す学習上の中間候補です。',
    representativeInput: { v1Type: 'type-c', ...inferiorPresets.lateral },
  },
  {
    id: 'posteroseptal',
    abbreviation: 'PS',
    name: '後中隔',
    coarseType: 'type-c',
    direction: 'posterior',
    area: 'septal',
    anatomy: '三尖弁輪後中隔部から冠静脈洞入口部周辺の代表位置です。',
    resolutionNote: '心内膜側と冠静脈系を、この4誘導モデルだけで分離することはできません。',
    representativeInput: { v1Type: 'type-c', ...inferiorPresets.posterior },
  },
  {
    id: 'right-anterior',
    abbreviation: 'RAL',
    name: '右前壁〜右前側壁',
    coarseType: 'type-b',
    direction: 'anterior',
    area: 'right',
    anatomy: '三尖弁輪の前方から前側壁寄りにある副伝導路の代表位置です。',
    resolutionNote: 'V1のタイプB相当と、下壁誘導の陽性優位を組み合わせた学習上の候補です。',
    representativeInput: { v1Type: 'type-b', ...inferiorPresets.anterior },
  },
  {
    id: 'right-lateral',
    abbreviation: 'RL',
    name: '右側壁',
    coarseType: 'type-b',
    direction: 'lateral',
    area: 'right',
    anatomy: '三尖弁輪の右側壁中央付近にある副伝導路の代表位置です。',
    resolutionNote: '下壁誘導の向きがそろわない、または等電位が多いときの中間候補です。',
    representativeInput: { v1Type: 'type-b', ...inferiorPresets.lateral },
  },
  {
    id: 'right-posterior',
    abbreviation: 'RPL',
    name: '右後壁〜右後側壁',
    coarseType: 'type-b',
    direction: 'posterior',
    area: 'right',
    anatomy: '三尖弁輪の後方から後側壁寄りにある副伝導路の代表位置です。',
    resolutionNote: 'V1のタイプB相当と、下壁誘導の陰性優位を組み合わせた学習上の候補です。',
    representativeInput: { v1Type: 'type-b', ...inferiorPresets.posterior },
  },
];

export function pathwayLocation(locationId: PathwayLocationId): PathwayLocation {
  const location = PATHWAY_LOCATIONS.find((candidate) => candidate.id === locationId);
  if (!location) throw new Error(`Unknown pathway location: ${locationId}`);
  return location;
}

export function inferiorDirection(input: LocalizationInput): AnnularDirection {
  const values = [input.leadII, input.leadIII, input.leadAVF];
  const score = values.reduce((total, polarity) => {
    if (polarity === 'positive') return total + 1;
    if (polarity === 'negative') return total - 1;
    return total;
  }, 0);

  if (score >= 2) return 'anterior';
  if (score <= -2) return 'posterior';
  return 'lateral';
}

const locationByTypeAndDirection: Record<WPWTypeId, Record<AnnularDirection, PathwayLocationId>> = {
  'type-a': { anterior: 'left-anterior', lateral: 'left-lateral', posterior: 'left-posterior' },
  'type-c': { anterior: 'anteroseptal', lateral: 'midseptal', posterior: 'posteroseptal' },
  'type-b': { anterior: 'right-anterior', lateral: 'right-lateral', posterior: 'right-posterior' },
};

export function localizeAccessoryPathway(input: LocalizationInput): LocalizationDecision {
  const direction = inferiorDirection(input);
  const typeStep: Record<WPWTypeId, string> = {
    'type-a': 'V1がR優位のタイプA相当 → 僧帽弁輪側',
    'type-c': 'V1がQS型のタイプC相当 → 中隔側',
    'type-b': 'V1がrS型のタイプB相当 → 三尖弁輪側',
  };
  const directionStep: Record<AnnularDirection, string> = {
    anterior: 'II・III・aVFのデルタ波が陽性優位 → 前方寄り',
    lateral: 'II・III・aVFの向きが中間 → 側壁または中中隔寄り',
    posterior: 'II・III・aVFのデルタ波が陰性優位 → 後方寄り',
  };

  return {
    location: pathwayLocation(locationByTypeAndDirection[input.v1Type][direction]),
    direction,
    steps: [typeStep[input.v1Type], directionStep[direction]],
  };
}

export function deltaPolarityLabel(polarity: DeltaPolarity): string {
  if (polarity === 'positive') return '陽性';
  if (polarity === 'negative') return '陰性';
  return '等電位';
}

export function directionLabel(direction: AnnularDirection): string {
  if (direction === 'anterior') return '前方優位';
  if (direction === 'posterior') return '後方優位';
  return '中間';
}
