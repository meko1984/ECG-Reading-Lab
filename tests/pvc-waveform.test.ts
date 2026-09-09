import assert from 'node:assert/strict';
import test from 'node:test';
import { PVC_ORIGINS, type PVCLead, type PVCOriginId } from '../app/domain/pvc.ts';
import { PVC_CORE_LEADS, PVC_QUICK_LAYOUT, PVC_TIMING, RVOT_CHEST_LEADS, interpolatePVC, pvcBeatVoltage, pvcLeadDescription, pvcQrsDuration, pvcQrsPoints, pvcStripVoltage, pvcSvgPath, pvcTVoltage } from '../app/domain/pvc-waveform.ts';

const rvot: PVCOriginId = 'right-upper-outer';
test('compact quick cards preserve trace scale and leave headroom for every origin and chest lead', () => {
  const { baseline, height, pxPerMs, pxPerMv } = PVC_QUICK_LAYOUT;
  assert.equal(pxPerMs, 0.3);
  assert.equal(pxPerMv, 40);
  for (const origin of PVC_ORIGINS) {
    const leads = origin.id === rvot ? [...PVC_CORE_LEADS, ...RVOT_CHEST_LEADS] : PVC_CORE_LEADS;
    for (const lead of leads) {
      for (let ms = -100; ms <= 620; ms += 2) {
        const y = baseline - pxPerMv * pvcBeatVoltage(origin.id, lead, ms);
        assert.ok(y >= 4 && y <= height - 4, `${origin.id} ${lead} clips at ${ms} ms`);
      }
    }
  }
});
const close = (a: number, b: number) => assert.ok(Math.abs(a - b) < 1e-10, `${a} != ${b}`);
function extrema(id: PVCOriginId, lead: PVCLead) {
  const values = pvcQrsPoints(id, lead).map(point => point[1]);
  return { max: Math.max(...values), min: Math.min(...values) };
}
function sign(id: PVCOriginId, lead: PVCLead) {
  const { max, min } = extrema(id, lead);
  return max > -min ? 'positive' : 'negative';
}

test('all eight V1 drawings have the stated rS or qR sequence and dominant polarity', () => {
  for (const origin of PVC_ORIGINS) {
    const nonzero = pvcQrsPoints(origin.id, 'V1').map(p => p[1]).filter(Boolean);
    const { min, max } = extrema(origin.id, 'V1');
    if (origin.ventricle === 'right') {
      assert.ok(nonzero[0] > 0 && min < 0 && -min > max);
      assert.match(pvcLeadDescription(origin.id, 'V1'), /^rS型・陰性優位（左脚ブロック様）$/);
    } else {
      assert.ok(nonzero[0] < 0 && max > 0 && max > -min);
      assert.match(pvcLeadDescription(origin.id, 'V1'), /^qR型・陽性優位（右脚ブロック様）$/);
    }
  }
});

test('seven polarity models agree with each reference-book lead group', () => {
  for (const origin of PVC_ORIGINS.filter(o => o.id !== rvot)) {
    for (const lead of ['II', 'III', 'aVF'] as const) assert.equal(sign(origin.id, lead), origin.selections.inferiorPolarity);
    for (const lead of ['I', 'aVL'] as const) assert.equal(sign(origin.id, lead), origin.selections.lateralPolarity);
    for (const lead of ['V5', 'V6'] as const) assert.equal(sign(origin.id, lead), origin.selections.leftPrecordialPolarity);
  }
});

test('RVOT reference preserves negative I/aVL, inferior positivity and late V3-to-V4 transition', () => {
  assert.equal(sign(rvot, 'I'), 'negative');
  assert.equal(sign(rvot, 'aVL'), 'negative');
  assert.ok(extrema(rvot, 'I').max > 0);
  assert.equal(extrema(rvot, 'aVL').max, 0);
  for (const lead of ['II', 'III', 'aVF', 'V4', 'V5', 'V6'] as const) assert.equal(sign(rvot, lead), 'positive');
  for (const lead of ['V1', 'V2', 'V3'] as const) assert.equal(sign(rvot, lead), 'negative');
  assert.ok(Math.abs(extrema(rvot, 'I').min) < 0.2, 'lead I is low voltage in this example');
});

test('RVOT inferior negative recovery is T, not an extra deep S within QRS', () => {
  for (const lead of ['II', 'III', 'aVF'] as const) {
    assert.equal(extrema(rvot, lead).min, 0);
    assert.ok(pvcTVoltage(rvot, lead, pvcQrsDuration(rvot) + 140) < -0.4);
  }
});

test('Einthoven and Goldberger lead identities hold for whole strips at every sample', () => {
  for (const origin of PVC_ORIGINS) {
    for (let ms = 0; ms <= PVC_TIMING.stripEnd; ms += 2) {
      const v = (lead: PVCLead) => pvcStripVoltage(origin.id, lead, ms);
      close(v('I') + v('III'), v('II'));
      close(v('aVR'), -(v('I') + v('II')) / 2);
      close(v('aVL'), v('I') - v('II') / 2);
      close(v('aVF'), v('II') - v('I') / 2);
    }
  }
});

test('QRS endpoints, sharp vertices, broad T and viewbox bounds remain consistent', () => {
  for (const origin of PVC_ORIGINS) {
    const leads: readonly PVCLead[] = origin.id === rvot ? [...PVC_CORE_LEADS, ...RVOT_CHEST_LEADS, 'aVR'] : PVC_CORE_LEADS;
    for (const lead of leads) {
      const points = pvcQrsPoints(origin.id, lead);
      const end = pvcQrsDuration(origin.id);
      assert.equal(points[0][0], 0);
      close(points[0][1], 0);
      assert.equal(points.at(-1)![0], end);
      close(points.at(-1)![1], 0);
      assert.ok(end >= 120);
      for (let n = 1; n < points.length; n++) assert.ok(points[n][0] > points[n - 1][0]);
      const extreme = points.reduce((a, b) => Math.abs(a[1]) > Math.abs(b[1]) ? a : b);
      assert.ok(Math.abs(interpolatePVC(points, extreme[0] - 2)) < Math.abs(extreme[1]));
      assert.ok(Math.abs(interpolatePVC(points, extreme[0] + 2)) < Math.abs(extreme[1]));
      for (let ms = 0; ms <= end; ms += 2) close(pvcTVoltage(origin.id, lead, ms), 0);
      close(pvcBeatVoltage(origin.id, lead, end), 0);
      close(pvcBeatVoltage(origin.id, lead, end + 320), 0);
      for (let ms = 0; ms <= 3200; ms += 2) {
        const y = 96 - 50 * pvcStripVoltage(origin.id, lead, ms);
        assert.ok(Number.isFinite(y) && y > 7 && y < 179, `${origin.id} ${lead} clips at ${ms} ms`);
      }
    }
  }
});

test('sinus QRS differs by chest lead and displayed pause is exactly compensatory', () => {
  const qrs = PVC_TIMING.sinusQrs;
  assert.equal(qrs[1] - qrs[0], PVC_TIMING.sinusRR);
  assert.equal(qrs[2] - qrs[1], 2 * PVC_TIMING.sinusRR);
  assert.ok(PVC_TIMING.prematureQrs - qrs[1] < PVC_TIMING.sinusRR);
  assert.ok(pvcStripVoltage(rvot, 'V1', qrs[0] + 45) < -0.6);
  assert.ok(pvcStripVoltage(rvot, 'V5', qrs[0] + 28) > 1);
  assert.ok(PVC_TIMING.sinusP[2] > PVC_TIMING.prematureQrs, 'nonconducted sinus P is not a PVC trigger');
  for (const onset of qrs) {
    const peak = onset + PVC_TIMING.normalRPeakOffset;
    const voltage = pvcStripVoltage(rvot, 'II', peak);
    for (let ms = onset; ms <= onset + PVC_TIMING.normalQrsWidth; ms += 2) {
      assert.ok(pvcStripVoltage(rvot, 'II', ms) <= voltage, 'RR annotation anchors to the actual lead II R peak');
    }
  }
});

test('rendered SVG uses line segments, not curve smoothing over QRS peaks', () => {
  const path = pvcSvgPath(ms => pvcBeatVoltage(rvot, 'V1', ms), 0, 160, 0.3, 80, 40);
  assert.match(path, /^M/);
  assert.ok(path.includes('L16.80 124.000'), 'the exact S vertex is retained');
  assert.doesNotMatch(path, /[CQST]|NaN|undefined/);
});
