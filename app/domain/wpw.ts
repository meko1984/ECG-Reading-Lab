export type WPWTypeId = 'type-a' | 'type-c' | 'type-b';

export type WPWMorphology = 'R-dominant' | 'QS' | 'rS';

export type WPWWaveform = {
  morphology: WPWMorphology;
  delta: number;
  r: number;
  s: number;
  t: number;
};

export type WPWType = {
  id: WPWTypeId;
  typeName: string;
  attachment: string;
  anatomy: string;
  v1Pattern: string;
  v1Clue: string;
  direction: string;
  clinicalLimit: string;
  waveform: WPWWaveform;
};

export const WPW_WAVEFORM_SCALE = {
  paperSpeedMmPerSec: 25,
  gainMmPerMv: 10,
  smallBoxMs: 40,
  prIntervalMs: 110,
  qrsDurationMs: 160,
  initialDeltaWindowMs: 20,
} as const;

export const WPW_TYPES: WPWType[] = [
  {
    id: 'type-a',
    typeName: 'タイプA',
    attachment: '僧帽弁輪',
    anatomy: '代表位置は、左房と左室の間にある僧帽弁輪側です。',
    v1Pattern: 'R ＞ S',
    v1Clue: 'V1でR波が優位なR／Rs型は、左側副伝導路を強く示唆します。',
    direction: '左室側から始まる早期興奮がV1へ向かう成分をつくり、R波が大きく見えます。',
    clinicalLimit: '僧帽弁輪の前後など、左側の細かな位置はV1だけでは決められません。',
    waveform: { morphology: 'R-dominant', delta: 0.08, r: 0.72, s: -0.18, t: 0.18 },
  },
  {
    id: 'type-c',
    typeName: 'タイプC',
    attachment: '中隔',
    anatomy: '代表位置は、右心系と左心系の境にある中隔付近です。',
    v1Pattern: 'QS型',
    v1Clue: 'V1で最初から陰性のQS型は、中隔または右側副伝導路でみられます。',
    direction: '中隔の早期興奮により、V1で見えるはずの最初の小さなr波が消えます。',
    clinicalLimit: 'QS型だけで中隔とは確定できません。右側副伝導路でもQS型になることがあります。',
    waveform: { morphology: 'QS', delta: -0.06, r: 0, s: -0.65, t: 0.10 },
  },
  {
    id: 'type-b',
    typeName: 'タイプB',
    attachment: '三尖弁輪',
    anatomy: '代表位置は、右房と右室の間にある三尖弁輪側です。',
    v1Pattern: 'rS型',
    v1Clue: 'V1の小さなr波に深いS波が続くrS型は、右側または中隔副伝導路でみられます。',
    direction: '右室側から始まる早期興奮の主成分がV1から離れるため、S波が大きく見えます。',
    clinicalLimit: 'rS型だけで三尖弁輪とは確定できません。中隔副伝導路でもrS型になることがあります。',
    waveform: { morphology: 'rS', delta: 0.04, r: 0.16, s: -0.60, t: -0.08 },
  },
];

export function wpwType(typeId: WPWTypeId): WPWType {
  const type = WPW_TYPES.find((candidate) => candidate.id === typeId);
  if (!type) throw new Error(`Unknown WPW type: ${typeId}`);
  return type;
}

export function deltaLabel(delta: number): string {
  if (delta > 0.04) return '陽性（上向き）';
  if (delta < -0.04) return '陰性（下向き）';
  return '等電位';
}
