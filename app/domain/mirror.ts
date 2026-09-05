export type MirrorScenarioId = 'inferior' | 'posterior';
export type MirrorWaveformKind = 'inferior-elevation' | 'avl-depression' | 'posterior-elevation' | 'anterior-depression';

export type MirrorSide = {
  title: string;
  leads: string[];
  change: 'ST上昇' | 'ST低下';
  waveform: MirrorWaveformKind;
  description: string;
};

export type MirrorScenario = {
  id: MirrorScenarioId;
  shortLabel: string;
  title: string;
  color: string;
  territory: string;
  direct: MirrorSide;
  opposite: MirrorSide;
  observation: string;
  caution: string;
};

export const MIRROR_SCENARIOS: MirrorScenario[] = [
  {
    id: 'inferior', shortLabel: '下壁', title: '下壁と反対側の誘導', color: '#2c9b78', territory: '左室下壁側',
    direct: { title: '下壁側から見る', leads: ['Ⅱ', 'Ⅲ', 'aVF'], change: 'ST上昇', waveform: 'inferior-elevation', description: '下壁側を向く連続誘導に、ST上昇を置いた代表モデルです。' },
    opposite: { title: '反対側から見る', leads: ['Ⅰ', 'aVL'], change: 'ST低下', waveform: 'avl-depression', description: 'とくにaVLのST低下は、下壁側の変化を反対方向から見る手がかりになります。' },
    observation: 'ⅢとaVLのように向きがほぼ反対の誘導では、ST変化が逆方向に見えることがあります。',
    caution: 'Ⅰ・aVLのST低下が必ず現れるわけではなく、上下の偏位量も同じとは限りません。',
  },
  {
    id: 'posterior', shortLabel: '後壁', title: '後壁と前胸部誘導', color: '#3d78cf', territory: '左室後壁側',
    direct: { title: '後壁側から見る', leads: ['V7', 'V8', 'V9'], change: 'ST上昇', waveform: 'posterior-elevation', description: '背中側に追加した誘導で、後壁側のST上昇を捉える代表モデルです。' },
    opposite: { title: '前から見る', leads: ['V1', 'V2', 'V3'], change: 'ST低下', waveform: 'anterior-depression', description: '標準12誘導では、前胸部のST低下として後壁側の変化が見えることがあります。' },
    observation: '前胸部で見えたST低下を、後壁側の追加誘導へ視点を移して見比べます。',
    caution: 'V1〜V3のST低下は非特異的です。この所見だけで後壁梗塞とは決められません。',
  },
];

export function mirrorScenario(id: MirrorScenarioId): MirrorScenario {
  const scenario = MIRROR_SCENARIOS.find((candidate) => candidate.id === id);
  if (!scenario) throw new Error(`Unknown mirror scenario: ${id}`);
  return scenario;
}

export function mirrorViewLabel(view: number): string {
  if (view <= 5) return '直接側の誘導';
  if (view >= 95) return '反対側の誘導';
  if (view < 45) return '直接側に近い仮想視点';
  if (view > 55) return '反対側に近い仮想視点';
  return '真横から見る仮想視点';
}

export function mirrorProjection(view: number): number {
  const clampedView = Math.min(100, Math.max(0, view));
  return Math.cos((clampedView / 100) * Math.PI);
}

export function mirrorChangeLabel(view: number): 'ST上昇' | '基線付近' | 'ST低下' {
  const projection = mirrorProjection(view);
  if (projection > 0.12) return 'ST上昇';
  if (projection < -0.12) return 'ST低下';
  return '基線付近';
}
