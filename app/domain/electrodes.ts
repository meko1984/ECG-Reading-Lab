import type { ECGWaveformParameters } from './waveform.ts';
import { presetForLead } from './waveform.ts';

export const ELECTRODES = ['RA', 'LA', 'RL', 'LL', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'] as const;
export type ElectrodeId = (typeof ELECTRODES)[number];

export const BODY_SITES = ['RA', 'LA', 'RL', 'LL', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V1_HIGH', 'V2_HIGH'] as const;
export type BodySiteId = (typeof BODY_SITES)[number];
export type ElectrodePlacement = Partial<Record<BodySiteId, ElectrodeId>>;

export const ECG_LEADS = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'] as const;
export type ECGLead = (typeof ECG_LEADS)[number];

export type PlacementScenarioId = 'correct' | 'ra-la' | 'ra-ll' | 'la-ll' | 'v1-v2' | 'v1-v2-high' | 'incomplete' | 'custom';

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
  (['correct', 'ra-la', 'ra-ll', 'la-ll', 'v1-v2', 'v1-v2-high'] as const)
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
  return presetForLead(leadName(lead)).parameters;
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
