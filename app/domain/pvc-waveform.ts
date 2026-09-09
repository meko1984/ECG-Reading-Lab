import { pvcOrigin, type PVCLead, type PVCOriginId, type PVCRegion } from './pvc.ts';

// Voltages are illustrative, not digitized patient measurements. Limb leads share
// the same I/II signals so Einthoven/Goldberger identities hold at every sample.
export type PVCPoint = readonly [ms: number, mv: number];
export const PVC_CORE_LEADS = ['I', 'II', 'III', 'aVL', 'aVF', 'V1', 'V5', 'V6'] as const;
export const RVOT_CHEST_LEADS = ['V1', 'V2', 'V3', 'V4', 'V5', 'V6'] as const;
// Crop vertical whitespace only; retain the quick trace's time/voltage scale.
export const PVC_QUICK_LAYOUT = { width: 216, height: 132, baseline: 68, pxPerMs: 0.3, pxPerMv: 40 } as const;
export const PVC_TIMING = {
  sinusRR: 800,
  sinusQrs: [240, 1040, 2640],
  sinusP: [80, 880, 1680, 2480],
  prematureQrs: 1440,
  normalQrsWidth: 80,
  normalRPeakOffset: 28,
  stripEnd: 3200,
} as const;

const FRONTAL: Record<PVCRegion, readonly [number, number]> = {
  'upper-outer': [0.85, 1.25],
  'upper-inner': [-0.6, 0.8],
  'lower-outer': [0.8, -0.65],
  apex: [-0.85, -1.3],
};

export function interpolatePVC(points: readonly PVCPoint[], ms: number): number {
  if (ms < points[0][0] || ms > points[points.length - 1][0]) return 0;
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    if (ms <= x1) return y0 + (y1 - y0) * (ms - x0) / (x1 - x0);
  }
  return 0;
}

function limbVoltage(lead: PVCLead, i: number, ii: number): number | undefined {
  if (lead === 'I') return i;
  if (lead === 'II') return ii;
  if (lead === 'III') return ii - i;
  if (lead === 'aVR') return -(i + ii) / 2;
  if (lead === 'aVL') return i - ii / 2;
  if (lead === 'aVF') return ii - i / 2;
  return undefined;
}

export function pvcQrsDuration(id: PVCOriginId): number {
  return id === 'right-upper-outer' ? 160 : 180;
}

function mainVoltage(id: PVCOriginId, lead: PVCLead): number {
  const origin = pvcOrigin(id);
  const [i, ii] = id === 'right-upper-outer' ? [-0.12, 1.45] : FRONTAL[origin.region];
  const limb = limbVoltage(lead, i, ii);
  if (limb !== undefined) return limb;
  if (id === 'right-upper-outer') {
    const chest: Partial<Record<PVCLead, number>> = { V1: -1.1, V2: -1.45, V3: -1.1, V4: 0.85, V5: 1.25, V6: 1.15 };
    return chest[lead]!;
  }
  if (lead === 'V1') return origin.ventricle === 'right' ? -1.05 : 1.1;
  if (lead !== 'V5' && lead !== 'V6') throw new Error('Only the RVOT reference includes the full precordial sequence');
  const apical = origin.region === 'apex' || origin.region === 'upper-inner';
  return (apical ? -1 : 1) * (origin.region === 'apex' ? 1.25 : 0.95) * (lead === 'V6' ? 0.86 : 1);
}

export function pvcQrsPoints(id: PVCOriginId, lead: PVCLead): readonly PVCPoint[] {
  const duration = pvcQrsDuration(id);
  const origin = pvcOrigin(id);
  const main = mainVoltage(id, lead);
  const rvot = id === 'right-upper-outer';
  // The reference's late broad negative deflection in the inferior leads is
  // ST-T. Do not manufacture a deep S followed by a second negative T wave.
  if (rvot) {
    const i = [0, 0.025, -0.12, -0.095, -0.025, 0];
    const ii = [0, 0.12, 1.45, 0.3, 0.005, 0];
    const times = [0, 24, 56, 78, 126, duration];
    if (limbVoltage(lead, 0, 0) !== undefined) return times.map((ms, n) => [ms, limbVoltage(lead, i[n], ii[n])!] as const);
    const chest: Partial<Record<PVCLead, readonly number[]>> = {
      V1: [0, 0.06, -1.1, -0.43, -0.07, 0],
      V2: [0, 0.12, -1.45, -0.52, -0.1, 0],
      V3: [0, 0.5, -1.1, -0.38, -0.04, 0],
      V4: [0, 0.18, 0.85, 0.23, -0.08, 0],
      V5: [0, 0.08, 1.25, 0.3, -0.04, 0],
      V6: [0, 0.06, 1.15, 0.27, -0.025, 0],
    };
    return times.map((ms, n) => [ms, chest[lead]![n]] as const);
  }
  const times = [0, 20, 48, 68, 110, 148, duration];
  const primary = [0, 0.1, 0.55, 1, 0.4, 0.06, 0];
  const [i, ii] = FRONTAL[origin.region];
  if (limbVoltage(lead, 0, 0) !== undefined) {
    return times.map((ms, n) => [ms, limbVoltage(lead, i * primary[n], ii * primary[n])!] as const);
  }
  if (lead === 'V1') {
    const values = origin.ventricle === 'right'
      ? [0, 0.07, -0.48, main, -0.46, -0.09, 0]
      : [0, -0.08, 0.58, main, 0.45, 0.07, 0];
    return times.map((ms, n) => [ms, values[n]] as const);
  }
  return times.map((ms, n) => [ms, main * primary[n]] as const);
}

function smoothPulse(ms: number, start: number, peak: number, end: number): number {
  if (ms <= start || ms >= end) return 0;
  const progress = ms < peak ? (ms - start) / (peak - start) : (end - ms) / (end - peak);
  return (1 - Math.cos(Math.PI * progress)) / 2;
}

export function pvcTVoltage(id: PVCOriginId, lead: PVCLead, ms: number): number {
  const qrsEnd = pvcQrsDuration(id);
  // Broad secondary T wave; small early ST deviation is part of its smooth onset.
  return -0.32 * mainVoltage(id, lead) * smoothPulse(ms, qrsEnd, qrsEnd + 140, qrsEnd + 320);
}

export function pvcBeatVoltage(id: PVCOriginId, lead: PVCLead, ms: number): number {
  return interpolatePVC(pvcQrsPoints(id, lead), ms) + pvcTVoltage(id, lead, ms);
}

function normalQrs(lead: PVCLead, ms: number): number {
  const times = [0, 12, PVC_TIMING.normalRPeakOffset, 45, 63, PVC_TIMING.normalQrsWidth];
  const i = [0, -0.08, 0.7, -0.14, 0, 0];
  const ii = [0, -0.045, 0.9, -0.1, 0.015, 0];
  if (limbVoltage(lead, 0, 0) !== undefined) return interpolatePVC(times.map((t, n) => [t, limbVoltage(lead, i[n], ii[n])!] as const), ms);
  const chest: Partial<Record<PVCLead, readonly number[]>> = {
    V1: [0, 0.1, 0.2, -0.65, -0.09, 0], V2: [0, 0.06, 0.35, -0.9, -0.06, 0],
    V3: [0, -0.01, 0.65, -0.6, -0.04, 0], V4: [0, -0.06, 1, -0.35, -0.02, 0],
    V5: [0, -0.08, 1.1, -0.2, 0, 0], V6: [0, -0.07, 0.9, -0.12, 0, 0],
  };
  return interpolatePVC(times.map((t, n) => [t, chest[lead]![n]] as const), ms);
}

function normalP(lead: PVCLead, ms: number): number {
  const pulse = smoothPulse(ms, 0, 42, 90);
  const limb = limbVoltage(lead, 0.1, 0.14);
  if (limb !== undefined) return limb * pulse;
  if (lead === 'V1') return 0.07 * smoothPulse(ms, 0, 24, 46) - 0.045 * smoothPulse(ms, 46, 68, 90);
  return 0.08 * pulse;
}

function normalT(lead: PVCLead, ms: number): number {
  const limb = limbVoltage(lead, 0.17, 0.22);
  return (limb ?? (lead === 'V1' ? -0.04 : 0.22)) * smoothPulse(ms, 100, 230, 350);
}

export function pvcStripVoltage(id: PVCOriginId, lead: PVCLead, ms: number): number {
  let mv = pvcBeatVoltage(id, lead, ms - PVC_TIMING.prematureQrs);
  for (const onset of PVC_TIMING.sinusQrs) mv += normalQrs(lead, ms - onset) + normalT(lead, ms - onset);
  // The on-time sinus P during the PVC/refractory period is not followed by a
  // conducted QRS. It is usually partly hidden in QRS/ST-T, not a PVC trigger.
  for (const onset of PVC_TIMING.sinusP) mv += normalP(lead, ms - onset);
  return mv;
}

export function pvcLeadDescription(id: PVCOriginId, lead: PVCLead): string {
  if (lead === 'V1') return pvcOrigin(id).ventricle === 'right'
    ? 'rS型・陰性優位（左脚ブロック様）'
    : 'qR型・陽性優位（右脚ブロック様）';
  if (id === 'right-upper-outer') {
    if (lead === 'I') return '低振幅rS型';
    if (lead === 'aVL' || lead === 'aVR') return 'QS型';
    if (lead === 'V2' || lead === 'V3') return 'rS型・陰性優位';
    return 'R優位';
  }
  return mainVoltage(id, lead) < 0 ? '陰性優位（QS型）' : '陽性優位';
}

export function pvcLeadLabel(lead: PVCLead): string {
  return ({ I: 'Ⅰ', II: 'Ⅱ', III: 'Ⅲ' } as Partial<Record<PVCLead, string>>)[lead] ?? lead;
}

export function pvcSvgPath(sample: (ms: number) => number, start: number, end: number, pxPerMs: number, baseline: number, pxPerMv: number, xOffset = 0): string {
  const values: string[] = [];
  for (let ms = start; ms <= end; ms += 2) values.push(`${ms === start ? 'M' : 'L'}${((ms - start) * pxPerMs + xOffset).toFixed(2)} ${(baseline - sample(ms) * pxPerMv).toFixed(3)}`);
  return values.join(' ');
}
