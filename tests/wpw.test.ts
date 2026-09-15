import assert from 'node:assert/strict';
import test from 'node:test';
import { deltaLabel, WPW_TYPES, WPW_WAVEFORM_SCALE, wpwType } from '../app/domain/wpw.ts';
import {
  inferiorDirection,
  localizeAccessoryPathway,
  PATHWAY_LOCATIONS,
  type LocalizationInput,
} from '../app/domain/wpw-localization.ts';

test('WPW teaching model has types A, C, and B in the reference order', () => {
  assert.deepEqual(WPW_TYPES.map((type) => type.id), ['type-a', 'type-c', 'type-b']);
  assert.deepEqual(WPW_TYPES.map((type) => type.attachment), ['僧帽弁輪', '中隔', '三尖弁輪']);
});

test('each type has the intended V1 morphology', () => {
  assert.equal(wpwType('type-a').v1Pattern, 'R ＞ S');
  assert.equal(wpwType('type-a').waveform.morphology, 'R-dominant');
  assert.ok(wpwType('type-a').waveform.r > Math.abs(wpwType('type-a').waveform.s));

  assert.equal(wpwType('type-c').v1Pattern, 'QS型');
  assert.equal(wpwType('type-c').waveform.morphology, 'QS');
  assert.equal(wpwType('type-c').waveform.r, 0);

  assert.equal(wpwType('type-b').v1Pattern, 'rS型');
  assert.equal(wpwType('type-b').waveform.morphology, 'rS');
  assert.ok(wpwType('type-b').waveform.r < Math.abs(wpwType('type-b').waveform.s));
});

test('delta polarity labels include an isoelectric band', () => {
  assert.equal(deltaLabel(0.2), '陽性（上向き）');
  assert.equal(deltaLabel(-0.2), '陰性（下向き）');
  assert.equal(deltaLabel(0.02), '等電位');
});

test('WPW waveform scale represents pre-excitation timing', () => {
  assert.equal(WPW_WAVEFORM_SCALE.paperSpeedMmPerSec, 25);
  assert.equal(WPW_WAVEFORM_SCALE.gainMmPerMv, 10);
  assert.ok(WPW_WAVEFORM_SCALE.prIntervalMs < 120);
  assert.ok(WPW_WAVEFORM_SCALE.qrsDurationMs > 120);
  assert.equal(WPW_WAVEFORM_SCALE.initialDeltaWindowMs, 20);
  assert.equal(WPW_WAVEFORM_SCALE.initialDeltaWindowMs / WPW_WAVEFORM_SCALE.smallBoxMs, 0.5);
});

test('four-lead WPW map exposes nine representative annular locations', () => {
  assert.equal(PATHWAY_LOCATIONS.length, 9);
  assert.deepEqual(
    new Set(PATHWAY_LOCATIONS.map((location) => location.area)),
    new Set(['left', 'septal', 'right']),
  );
  assert.deepEqual(
    new Set(PATHWAY_LOCATIONS.map((location) => location.direction)),
    new Set(['anterior', 'lateral', 'posterior']),
  );
});

test('each location preset returns to the same detailed location', () => {
  for (const location of PATHWAY_LOCATIONS) {
    assert.equal(
      localizeAccessoryPathway(location.representativeInput).location.id,
      location.id,
      `representative input for ${location.id}`,
    );
  }
});

test('inferior-lead polarity separates anterior, intermediate, and posterior directions', () => {
  const base: LocalizationInput = {
    v1Type: 'type-c',
    leadII: 'isoelectric',
    leadIII: 'isoelectric',
    leadAVF: 'isoelectric',
  };

  assert.equal(inferiorDirection({ ...base, leadII: 'positive', leadIII: 'positive' }), 'anterior');
  assert.equal(inferiorDirection({ ...base, leadII: 'negative', leadAVF: 'negative' }), 'posterior');
  assert.equal(inferiorDirection({ ...base, leadII: 'positive', leadIII: 'negative' }), 'lateral');
});

test('V1 type and inferior direction combine into the expected annular region', () => {
  const anterior = PATHWAY_LOCATIONS.find((location) => location.id === 'anteroseptal');
  const lateral = PATHWAY_LOCATIONS.find((location) => location.id === 'left-lateral');
  const posterior = PATHWAY_LOCATIONS.find((location) => location.id === 'right-posterior');
  assert.ok(anterior && lateral && posterior);
  assert.equal(localizeAccessoryPathway(anterior.representativeInput).location.id, 'anteroseptal');
  assert.equal(localizeAccessoryPathway(lateral.representativeInput).location.id, 'left-lateral');
  assert.equal(localizeAccessoryPathway(posterior.representativeInput).location.id, 'right-posterior');
});
