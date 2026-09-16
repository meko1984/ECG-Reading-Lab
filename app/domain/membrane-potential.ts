export const ELECTROLYTES = ['na', 'k', 'cl', 'ca', 'mg'] as const;

export type ElectrolyteId = (typeof ELECTROLYTES)[number];
export type ElectrolyteSettings = Record<ElectrolyteId, number>;
export type ActionPhase = 0 | 1 | 2 | 3 | 4;

export const NORMAL_ELECTROLYTES: ElectrolyteSettings = {
  na: 0,
  k: 0,
  cl: 0,
  ca: 0,
  mg: 0,
};

export const ELECTROLYTE_META: Record<ElectrolyteId, { symbol: string; name: string; color: string }> = {
  na: { symbol: 'Na⁺', name: 'ナトリウム', color: '#1976d2' },
  k: { symbol: 'K⁺', name: 'カリウム', color: '#7b4fb3' },
  cl: { symbol: 'Cl⁻', name: 'クロール', color: '#24846b' },
  ca: { symbol: 'Ca²⁺', name: 'カルシウム', color: '#d26a24' },
  mg: { symbol: 'Mg²⁺', name: 'マグネシウム', color: '#a24e6c' },
};

export const CYCLE_MS = 900;

export type MembraneModel = {
  restingPotential: number;
  peakPotential: number;
  plateauPotential: number;
  depolarizationStart: number;
  upstrokeEnd: number;
  notchEnd: number;
  plateauEnd: number;
  repolarizationEnd: number;
  qtEnd: number;
  qrsWidth: number;
  tAmplitude: number;
  pAmplitude: number;
  uAmplitude: number;
  stOffset: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const gaussian = (time: number, center: number, width: number, amplitude: number) =>
  amplitude * Math.exp(-0.5 * ((time - center) / width) ** 2);

export function createMembraneModel(settings: ElectrolyteSettings): MembraneModel {
  const lowK = Math.max(0, -settings.k);
  const highK = Math.max(0, settings.k);
  const lowNa = Math.max(0, -settings.na);
  const highMg = Math.max(0, settings.mg);
  const lowMg = Math.max(0, -settings.mg);

  const qtShift =
    lowK * 76 - highK * 52 - settings.ca * 82 - settings.cl * 14 + lowMg * 24 + highMg * 12;
  const depolarizationStart = 188;
  const qrsWidth = 74 + lowNa * 22 + highK * 38 + highMg * 13;
  const upstrokeDuration = 8 + lowNa * 9 + highK * 10;
  const upstrokeEnd = depolarizationStart + upstrokeDuration;
  const notchEnd = upstrokeEnd + 19;
  const plateauEnd = clamp(363 + qtShift * 0.68, 292, 458);
  const repolarizationEnd = clamp(478 + qtShift, 350, 620);

  return {
    restingPotential: clamp(-90 + settings.k * 14 + settings.cl * 2 - settings.mg * 2, -104, -70),
    peakPotential: clamp(30 + settings.na * 8 - highK * 18, 3, 38),
    plateauPotential: clamp(5 + settings.ca * 7 - highK * 4, -7, 14),
    depolarizationStart,
    upstrokeEnd,
    notchEnd,
    plateauEnd,
    repolarizationEnd,
    qtEnd: repolarizationEnd,
    qrsWidth,
    tAmplitude: clamp(0.34 + highK * 0.38 - lowK * 0.22 - lowMg * 0.04, 0.08, 0.74),
    pAmplitude: clamp(0.16 - highK * 0.11 - highMg * 0.02, 0.035, 0.18),
    uAmplitude: lowK * 0.17 + lowMg * 0.05,
    stOffset: -lowK * 0.075,
  };
}

export function phaseAt(time: number, model: MembraneModel): ActionPhase {
  if (time < model.depolarizationStart || time >= model.repolarizationEnd) return 4;
  if (time < model.upstrokeEnd) return 0;
  if (time < model.notchEnd) return 1;
  if (time < model.plateauEnd) return 2;
  return 3;
}

export function actionPotentialAt(time: number, model: MembraneModel): number {
  const phase = phaseAt(time, model);
  if (phase === 4) return model.restingPotential;
  if (phase === 0) {
    const progress = (time - model.depolarizationStart) / (model.upstrokeEnd - model.depolarizationStart);
    return model.restingPotential + (model.peakPotential - model.restingPotential) * progress;
  }
  if (phase === 1) {
    const progress = (time - model.upstrokeEnd) / (model.notchEnd - model.upstrokeEnd);
    return model.peakPotential + (model.plateauPotential - model.peakPotential) * progress;
  }
  if (phase === 2) {
    const progress = (time - model.notchEnd) / (model.plateauEnd - model.notchEnd);
    return model.plateauPotential - 7 * progress;
  }
  const progress = (time - model.plateauEnd) / (model.repolarizationEnd - model.plateauEnd);
  const eased = progress * progress * (3 - 2 * progress);
  return model.plateauPotential - 7 + (model.restingPotential - (model.plateauPotential - 7)) * eased;
}

// Illustrative open Cl conductance: intracellular Cl is held fixed and the
// relative extracellular control represents a +/-25% concentration change.
// This Nernst shift is an assumption for showing direction, not serum values.
export function chlorideTransportAt(time: number, settings: ElectrolyteSettings, model: MembraneModel) {
  const equilibrium = -50 - 26.7 * Math.log(1 + settings.cl * 0.25);
  const risingCrossing = model.depolarizationStart +
    (equilibrium - model.restingPotential) / (model.peakPotential - model.restingPotential) *
    (model.upstrokeEnd - model.depolarizationStart);
  let left = model.plateauEnd;
  let right = model.repolarizationEnd;
  for (let i = 0; i < 24; i++) {
    const middle = (left + right) / 2;
    if (actionPotentialAt(middle, model) > equilibrium) left = middle;
    else right = middle;
  }
  const fallingCrossing = (left + right) / 2;
  if (time < risingCrossing) return { start: 0, end: risingCrossing, inward: false, equilibrium };
  if (time < fallingCrossing) return { start: risingCrossing, end: fallingCrossing, inward: true, equilibrium };
  return { start: fallingCrossing, end: CYCLE_MS + 1, inward: false, equilibrium };
}

export function ecgLeadIIAt(time: number, settings: ElectrolyteSettings, model = createMembraneModel(settings)): number {
  const lowNa = Math.max(0, -settings.na);
  const highNa = Math.max(0, settings.na);
  const highK = Math.max(0, settings.k);
  const lowK = Math.max(0, -settings.k);
  const highMg = Math.max(0, settings.mg);
  const qrsScale = clamp(1 - lowNa * 0.18 - highK * 0.24 + highNa * 0.04, 0.52, 1.08);
  const qrsStretch = model.qrsWidth / 74;
  const qrsCenter = 214;
  const q = gaussian(time, qrsCenter - 20 * qrsStretch, 5 * qrsStretch, -0.19 * qrsScale);
  const r = gaussian(time, qrsCenter, 7.2 * qrsStretch, 1.06 * qrsScale);
  const s = gaussian(time, qrsCenter + 19 * qrsStretch, 7 * qrsStretch, -0.34 * qrsScale);
  const p = gaussian(time, 103, 23 + highMg * 5, model.pAmplitude);
  const tCenter = model.qtEnd - 62;
  const tWidth = 51 + lowK * 22 + Math.max(0, -settings.ca) * 10;
  const t = gaussian(time, tCenter, tWidth, model.tAmplitude);
  const u = gaussian(time, Math.min(700, model.qtEnd + 85), 28, model.uAmplitude);
  const stStart = qrsCenter + 30 * qrsStretch;
  const stEnd = tCenter - tWidth * 0.8;
  const st = time > stStart && time < stEnd ? model.stOffset : 0;
  return p + q + r + s + t + u + st;
}

export function sampleSeries(
  sampler: (time: number) => number,
  step = 4,
): Array<{ time: number; value: number }> {
  const points: Array<{ time: number; value: number }> = [];
  for (let time = 0; time <= CYCLE_MS; time += step) points.push({ time, value: sampler(time) });
  return points;
}

export const PHASE_INFO: Record<ActionPhase, { title: string; short: string; flows: string[] }> = {
  0: { title: '第0相｜脱分極', short: 'Na⁺が急速に流入', flows: ['na-in'] },
  1: { title: '第1相｜初期再分極', short: 'Na⁺流入が止まり、K⁺が流出', flows: ['k-out'] },
  2: { title: '第2相｜プラトー', short: 'Ca²⁺流入とK⁺流出が釣り合う', flows: ['ca-in', 'k-out'] },
  3: { title: '第3相｜再分極', short: 'K⁺流出で静止電位へ戻る', flows: ['k-out'] },
  4: { title: '第4相｜静止期', short: 'K⁺透過性とNa⁺/K⁺ポンプが勾配を保つ', flows: ['pump'] },
};

export function levelLabel(value: number): string {
  if (value <= -0.5) return '低';
  if (value >= 0.5) return '高';
  return '基準';
}
