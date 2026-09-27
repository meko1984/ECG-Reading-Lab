import test from 'node:test';
import assert from 'node:assert/strict';
import { RHYTHM_LEADS, TACHY_CASES, FLUTTER_CASES, atrialAmplitude, rhythmTiming, rhythmSample } from '../app/domain/tachycardia.ts';
import { PACING_FAULTS, pacingModel, pacingSample, type PacingMode } from '../app/domain/pacing.ts';

test('every circuit produces finite, distinct traces in all twelve leads over control extremes', () => {
  for (const edge of [0, 1]) for (const conduction of [2, 3, 4]) {
    const traces = [...TACHY_CASES, ...FLUTTER_CASES].map(c => RHYTHM_LEADS.map(lead => Array.from({ length: 501 }, (_, i) => {
      const rate = 'common reverse atypical'.includes(c.id) ? [240, 340][edge] : [140, 220][edge];
      const sample = rhythmSample(i / 250, c.id, lead, rate, conduction);
      assert.ok(Number.isFinite(sample));
      return sample.toFixed(4);
    }).join(',')).join('|'));
    assert.equal(new Set(traces).size, 7);
  }
});
test('all limb waveforms obey Einthoven and Goldberger identities', () => {
  for (const c of [...TACHY_CASES, ...FLUTTER_CASES]) for (let i = 0; i < 1000; i++) {
    const s = (lead: typeof RHYTHM_LEADS[number]) => rhythmSample(i / 500, c.id, lead, 180, 2);
    assert.ok(Math.abs(s('II') - s('I') - s('III')) < 1e-10);
    assert.ok(Math.abs(s('aVR') + (s('I') + s('II')) / 2) < 1e-10);
    assert.ok(Math.abs(s('aVL') - s('I') + s('II') / 2) < 1e-10);
    assert.ok(Math.abs(s('aVF') - s('II') + s('I') / 2) < 1e-10);
  }
});
test('flutter AV conduction changes ventricles without changing atrial rhythm', () => {
  assert.equal(rhythmTiming('common', 300, 2).ventricularRate, 150);
  assert.equal(rhythmTiming('common', 300, 3).ventricularRate, 100);
  assert.equal(rhythmTiming('common', 300, 4).ventricularRate, 75);
  for (let i = 0; i < 1000; i++) assert.equal(rhythmSample(i / 500, 'common', 'II', 300, 2, true), rhythmSample(i / 500, 'common', 'II', 300, 4, true));
  for (const lead of ['II', 'III', 'aVF'] as const) {
    assert.ok(atrialAmplitude('common', lead) < 0);
    assert.ok(atrialAmplitude('reverse', lead) > 0);
  }
  assert.ok(atrialAmplitude('common', 'V1') > 0);
  assert.ok(atrialAmplitude('reverse', 'V1') < 0);
});
test('illustrative SVT timing preserves P to next QRS relationship at slider extremes', () => {
  for (const rate of [140, 180, 220]) {
    const n = rhythmTiming('avnrt', rate, 2);
    const r = rhythmTiming('avrt', rate, 2);
    const a = rhythmTiming('at-high', rate, 2);
    assert.ok(n.rp < r.rp && r.rp < a.rp);
    assert.ok(Math.abs(a.rr - a.rp - .14) < 1e-9);
  }
});
test('capture failure retains stimuli while losing corresponding responses', () => {
  for (const mode of ['A', 'V', 'AV'] as PacingMode[]) {
    const normal = pacingModel({ mode, fault: 'normal', offset: 120, avDelay: 180 });
    const capture = pacingModel({ mode, fault: 'capture', offset: 120, avDelay: 180 });
    const stimulus = mode === 'A' ? 'AP' : 'VP';
    const response = mode === 'A' ? 'P' : 'pacedQRS';
    assert.equal(capture.events.filter(e => e.kind === stimulus).length, 4);
    assert.equal(capture.events.filter(e => e.kind === response).length, 2);
    assert.equal(normal.events.filter(e => e.kind === response).length, 4);
  }
});
test('absent output and oversensing share surface pauses but differ in detection markers', () => {
  for (const mode of ['A', 'V', 'AV'] as PacingMode[]) {
    const output = pacingModel({ mode, fault: 'output', offset: 120, avDelay: 180 });
    const over = pacingModel({ mode, fault: 'oversense', offset: 120, avDelay: 180 });
    assert.deepEqual(output.events, over.events.filter(e => e.kind !== 'noise'));
    assert.equal(over.events.filter(e => e.kind === 'noise').length, 2);
    assert.equal(output.events.filter(e => e.kind === (mode === 'A' ? 'AP' : 'VP')).length, 2);
  }
});
test('undersensing slider holds native events fixed and changes inappropriate spike timing', () => {
  for (const mode of ['A', 'V', 'AV'] as PacingMode[]) {
    const early = pacingModel({ mode, fault: 'undersense', offset: 40, avDelay: 180 });
    const late = pacingModel({ mode, fault: 'undersense', offset: 400, avDelay: 180 });
    assert.deepEqual(early.events.filter(e => e.label.startsWith('自己')), late.events.filter(e => e.label.startsWith('自己')));
    assert.equal(early.events.filter(e => e.label.startsWith('捕捉')).length, 0);
    assert.equal(late.events.filter(e => e.label.startsWith('捕捉')).length, 4);
    assert.match(early.diagnosis, /アンダーセンシング/);
    assert.match(late.diagnosis, /アンダーセンシング/);
  }
});
test('all pacing controls stay within displayed strip and produce finite samples', () => {
  for (const mode of ['A', 'V', 'AV'] as PacingMode[]) for (const fault of PACING_FAULTS) for (const offset of [40, 400]) for (const avDelay of [100, 260]) {
    const { events } = pacingModel({ mode, fault: fault.id, offset, avDelay });
    assert.ok(events.every(e => e.time >= 0 && e.time < 5.2));
    for (let i = 0; i < 2600; i += 13) assert.ok(Number.isFinite(pacingSample(i / 500, events)));
    if (mode === 'AV' && fault.id === 'normal') {
      const a = events.filter(e => e.kind === 'AP');
      const v = events.filter(e => e.kind === 'VP');
      a.forEach((e, i) => assert.ok(Math.abs(v[i].time - e.time - avDelay / 1000) < 1e-9));
    }
  }
});
