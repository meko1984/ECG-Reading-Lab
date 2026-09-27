import type { ECGWaveformParameters } from './waveform.ts';
import { presetForLead } from './waveform.ts';

export const ELECTRODES = ['RA', 'LA', 'RL', 'LL', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'] as const;
export type ElectrodeId = (typeof ELECTRODES)[number];

export const RIGHT_CHEST_SITES = ['V1R', 'V2R', 'V3R', 'V4R', 'V5R', 'V6R'] as const;
export const POSTERIOR_SITES = ['V7', 'V8', 'V9'] as const;
export const BODY_SITES = ['RA', 'LA', 'RL', 'LL', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V1_HIGH', 'V2_HIGH', ...RIGHT_CHEST_SITES, ...POSTERIOR_SITES] as const;
export type BodySiteId = (typeof BODY_SITES)[number];
export type ElectrodePlacement = Partial<Record<BodySiteId, ElectrodeId>>;

export const ECG_LEADS = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'] as const;
export const RIGHT_CHEST_LEADS = [...RIGHT_CHEST_SITES] as const;
export const POSTERIOR_LEADS = [...POSTERIOR_SITES] as const;
export type StandardECGLead = (typeof ECG_LEADS)[number];
export type SupplementalECGLead = (typeof RIGHT_CHEST_LEADS)[number] | (typeof POSTERIOR_LEADS)[number];
export type ECGLead = StandardECGLead | SupplementalECGLead;

export type PlacementScenarioId = 'correct' | 'right-sided' | 'posterior' | 'ra-la' | 'ra-ll' | 'la-ll' | 'v1-v2' | 'v1-v2-high' | 'incomplete' | 'custom';

export type PlacementScenario = {
  id: PlacementScenarioId;
  shortLabel: string;
  title: string;
  summary: string;
  clue: string;
  affectedLeads: ECGLead[];
};

export const SCENARIOS: Record<PlacementScenarioId, PlacementScenario> = {
  correct: {
    id: 'correct', shortLabel: '正しい装着', title: '10個の電極が正しい位置です',
    summary: '四肢誘導と胸部誘導は、基準となる代表波形のままです。',
    clue: 'まずこのR波の進み方と、I・II誘導の上向き成分を基準にします。', affectedLeads: [],
  },
  'right-sided': {
    id: 'right-sided', shortLabel: '右胸部誘導', title: 'V1R〜V6Rの右胸部配置です',
    summary: 'V1R〜V6Rは標準胸部誘導を患者の右胸へ鏡像配置した追加誘導です。臨床ではV3R・V4Rが特に用いられます。',
    clue: 'V1Rは第4肋間・胸骨左縁、V2Rは第4肋間・胸骨右縁、V4Rは第5肋間・右鎖骨中線です。', affectedLeads: [...RIGHT_CHEST_LEADS],
  },
  posterior: {
    id: 'posterior', shortLabel: '背部誘導', title: 'V7〜V9の背部配置です',
    summary: 'V4〜V6の電極を背面へ移し、V7〜V9として記録する配置を示しています。',
    clue: 'V7・V8・V9はV6と同じ水平面で、左後腋窩線・左肩甲骨中線・左脊柱傍に置きます。', affectedLeads: [...POSTERIOR_LEADS],
  },
  'ra-la': {
    id: 'ra-la', shortLabel: '右腕↔左腕', title: '右腕（RA）と左腕（LA）が逆です',
    summary: 'I誘導が上下反転し、IIとIII、aVRとaVLが入れ替わります。aVFと胸部誘導は変わりません。',
    clue: 'I誘導のP・QRS・Tがまとめて陰性なのに、胸部誘導のR波進行が保たれることが手がかりです。', affectedLeads: ['I', 'II', 'III', 'aVR', 'aVL'],
  },
  'ra-ll': {
    id: 'ra-ll', shortLabel: '右腕↔左脚', title: '右腕（RA）と左脚（LL）が逆です',
    summary: 'II誘導が上下反転し、IとIIIは互いに入れ替わって反転します。aVRとaVFも入れ替わります。',
    clue: 'I・II・IIIでP波まで陰性になり、aVRが陽性に見える組み合わせが重要です。', affectedLeads: ['I', 'II', 'III', 'aVR', 'aVF'],
  },
  'la-ll': {
    id: 'la-ll', shortLabel: '左腕↔左脚', title: '左腕（LA）と左脚（LL）が逆です',
    summary: 'IとIIが入れ替わり、IIIは上下反転します。aVLとaVFも入れ替わります。',
    clue: '胸部誘導は正常なまま、III誘導だけが反転する並びに注目します。', affectedLeads: ['I', 'II', 'III', 'aVL', 'aVF'],
  },
  'v1-v2': {
    id: 'v1-v2', shortLabel: 'V1↔V2', title: 'V1とV2のケーブルが逆です',
    summary: '記録されたV1とV2の波形が、そのまま互いに入れ替わります。',
    clue: '胸部誘導をV1からV6へ並べたとき、自然なR波の増え方がV1・V2で崩れます。', affectedLeads: ['V1', 'V2'],
  },
  'v1-v2-high': {
    id: 'v1-v2-high', shortLabel: 'V1・V2が高い', title: 'V1とV2が1肋間高い代表モデルです',
    summary: 'V1・V2のR波が小さくなり、V1は陰性成分優位の二相性P波、V2は陽性P波が消えたように見える代表変化を示します。',
    clue: 'ケーブルの入れ替えではなく、胸骨縁で置く高さの間違いです。実際の変化量には個人差があります。', affectedLeads: ['V1', 'V2'],
  },
  incomplete: {
    id: 'incomplete', shortLabel: '装着途中', title: 'まだ10個すべてを装着していません',
    summary: '電極を選び、人体の丸い装着位置を押してください。',
    clue: '「正しく装着」で基準へ戻せます。', affectedLeads: ECG_LEADS.slice(),
  },
  custom: {
    id: 'custom', shortLabel: 'その他の配置', title: 'この組み合わせは簡易モデルの対象外です',
    summary: '右足電極を含む交換や複数の同時ミスでは、機器や接触状態によって複雑な変化が起こります。',
    clue: 'ここでは、再現性の高い代表的な2電極交換とV1・V2の高位装着に範囲を限定しています。', affectedLeads: ECG_LEADS.slice(),
  },
};

export const CORRECT_PLACEMENT: ElectrodePlacement = Object.fromEntries(
  ELECTRODES.map((electrode) => [electrode, electrode]),
) as ElectrodePlacement;

function swapped(a: BodySiteId, b: BodySiteId): ElectrodePlacement {
  return { ...CORRECT_PLACEMENT, [a]: CORRECT_PLACEMENT[b], [b]: CORRECT_PLACEMENT[a] };
}

export function placementForScenario(id: Exclude<PlacementScenarioId, 'incomplete' | 'custom'>): ElectrodePlacement {
  if (id === 'right-sided') {
    const placement = { ...CORRECT_PLACEMENT };
    for (const electrode of ['V1', 'V2', 'V3', 'V4', 'V5', 'V6'] as const) delete placement[electrode];
    RIGHT_CHEST_SITES.forEach((site, index) => { placement[site] = ELECTRODES[index + 4]; });
    return placement;
  }
  if (id === 'posterior') {
    const placement = { ...CORRECT_PLACEMENT };
    delete placement.V4;
    delete placement.V5;
    delete placement.V6;
    placement.V7 = 'V4';
    placement.V8 = 'V5';
    placement.V9 = 'V6';
    return placement;
  }
  if (id === 'ra-la') return swapped('RA', 'LA');
  if (id === 'ra-ll') return swapped('RA', 'LL');
  if (id === 'la-ll') return swapped('LA', 'LL');
  if (id === 'v1-v2') return swapped('V1', 'V2');
  if (id === 'v1-v2-high') {
    const placement = { ...CORRECT_PLACEMENT };
    delete placement.V1;
    delete placement.V2;
    placement.V1_HIGH = 'V1';
    placement.V2_HIGH = 'V2';
    return placement;
  }
  return { ...CORRECT_PLACEMENT };
}

function signature(placement: ElectrodePlacement): string {
  return BODY_SITES.map((site) => `${site}:${placement[site] ?? '-'}`).join('|');
}

const scenarioSignatures = new Map<PlacementScenarioId, string>(
  (['correct', 'right-sided', 'posterior', 'ra-la', 'ra-ll', 'la-ll', 'v1-v2', 'v1-v2-high'] as const)
    .map((id) => [id, signature(placementForScenario(id))]),
);

export function analyzePlacement(placement: ElectrodePlacement): PlacementScenario {
  if (new Set(Object.values(placement)).size < ELECTRODES.length) return SCENARIOS.incomplete;
  for (const [id, value] of scenarioSignatures) {
    if (signature(placement) === value) return SCENARIOS[id];
  }
  return SCENARIOS.custom;
}

const leadName = (lead: ECGLead) => lead === 'I' ? 'Ⅰ' : lead === 'II' ? 'Ⅱ' : lead === 'III' ? 'Ⅲ' : lead;
export const displayLeadName = leadName;

function preset(lead: ECGLead): ECGWaveformParameters {
  const supplementalSource: Partial<Record<SupplementalECGLead, StandardECGLead>> = {
    V1R: 'V1', V2R: 'V2', V3R: 'V3', V4R: 'V4', V5R: 'V5', V6R: 'V6',
    V7: 'V6', V8: 'V6', V9: 'V6',
  };
  return presetForLead(leadName(supplementalSource[lead as SupplementalECGLead] ?? lead)).parameters;
}

function inverted(parameters: ECGWaveformParameters): ECGWaveformParameters {
  return {
    ...parameters,
    pWaveAmplitude: -parameters.pWaveAmplitude,
    qWaveAmplitude: -parameters.qWaveAmplitude,
    rWaveAmplitude: -parameters.rWaveAmplitude,
    sWaveAmplitude: -parameters.sWaveAmplitude,
    stLevel: -parameters.stLevel,
    tWaveAmplitude: -parameters.tWaveAmplitude,
  };
}

const limbTransforms: Partial<Record<PlacementScenarioId, Partial<Record<ECGLead, { source: ECGLead; invert?: boolean }>>>> = {
  'ra-la': { I: { source: 'I', invert: true }, II: { source: 'III' }, III: { source: 'II' }, aVR: { source: 'aVL' }, aVL: { source: 'aVR' } },
  'ra-ll': { I: { source: 'III', invert: true }, II: { source: 'II', invert: true }, III: { source: 'I', invert: true }, aVR: { source: 'aVF' }, aVF: { source: 'aVR' } },
  'la-ll': { I: { source: 'II' }, II: { source: 'I' }, III: { source: 'III', invert: true }, aVL: { source: 'aVF' }, aVF: { source: 'aVL' } },
};

export function waveformForScenario(lead: ECGLead, scenarioId: PlacementScenarioId): ECGWaveformParameters {
  const transform = limbTransforms[scenarioId]?.[lead];
  if (transform) {
    const source = preset(transform.source);
    return transform.invert ? inverted(source) : source;
  }
  if (scenarioId === 'v1-v2' && lead === 'V1') return preset('V2');
  if (scenarioId === 'v1-v2' && lead === 'V2') return preset('V1');
  if (scenarioId === 'v1-v2-high' && (lead === 'V1' || lead === 'V2')) {
    const source = preset(lead);
    return {
      ...source,
      pWaveAmplitude: lead === 'V1' ? -0.09 : -0.03,
      rWaveAmplitude: Math.max(0.04, source.rWaveAmplitude - 0.1),
    };
  }
  return preset(lead);
}

export function placeElectrode(
  placement: ElectrodePlacement,
  electrode: ElectrodeId,
  destination: BodySiteId,
): ElectrodePlacement {
  const next = { ...placement };
  const source = BODY_SITES.find((site) => next[site] === electrode);
  const displaced = next[destination];
  if (source) delete next[source];
  next[destination] = electrode;
  if (source && displaced && displaced !== electrode) next[source] = displaced;
  return next;
}
