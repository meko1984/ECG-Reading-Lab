import assert from 'node:assert/strict';
import test from 'node:test';
import { deltaLabel, WPW_TYPES, WPW_WAVEFORM_SCALE, wpwType } from '../app/domain/wpw.ts';

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
