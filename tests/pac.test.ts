import assert from 'node:assert/strict';
import test from 'node:test';
import {
  PAC_LEADS,
  PAC_ORIGINS,
  PAC_WAVEFORM_SCALE,
  pacOrigin,
  polarityLabel,
  polarityPath,
} from '../app/domain/pac.ts';

test('PAC teaching model contains the three representative origin sites', () => {
  assert.deepEqual(PAC_ORIGINS.map((origin) => origin.id), [
    'crista-terminalis',
    'cs-ostium',
    'left-superior-pv',
  ]);
  assert.equal(PAC_ORIGINS.length, 3);
});

test('each origin includes all six teaching leads', () => {
  for (const origin of PAC_ORIGINS) {
    assert.deepEqual(Object.keys(origin.polarities), [...PAC_LEADS]);
  }
});

test('representative polarity clues match each location', () => {
  const crista = pacOrigin('crista-terminalis');
  assert.equal(crista.polarities.II, 'positive');
  assert.equal(crista.polarities.aVF, 'positive');
  assert.equal(crista.polarities.V1, 'positive-negative');

  const csOstium = pacOrigin('cs-ostium');
  assert.equal(csOstium.polarities.II, 'negative');
  assert.equal(csOstium.polarities.aVL, 'positive');
  assert.equal(csOstium.polarities.V1, 'negative-positive');

  const leftPv = pacOrigin('left-superior-pv');
  assert.equal(leftPv.polarities.I, 'negative');
  assert.equal(leftPv.polarities.V1, 'positive');
});

test('polarity labels and SVG paths cover all waveform directions', () => {
  assert.equal(polarityLabel('positive'), '陽性');
  assert.equal(polarityLabel('negative'), '陰性');
  assert.equal(polarityLabel('positive-negative'), '陽性／陰性');
  assert.equal(polarityLabel('negative-positive'), '陰性／陽性');

  const paths = [
    polarityPath('positive', 30, 20),
    polarityPath('negative', 30, 20),
    polarityPath('positive-negative', 30, 20),
    polarityPath('negative-positive', 30, 20),
  ];
  assert.equal(new Set(paths).size, 4);
  paths.forEach((path) => assert.match(path, /^M/));
});

test('PAC waveform scale represents a premature narrow-complex beat', () => {
  assert.equal(PAC_WAVEFORM_SCALE.paperSpeedMmPerSec, 25);
  assert.equal(PAC_WAVEFORM_SCALE.gainMmPerMv, 10);
  assert.ok(PAC_WAVEFORM_SCALE.prematureCouplingMs < PAC_WAVEFORM_SCALE.normalCycleMs);
  assert.ok(PAC_WAVEFORM_SCALE.qrsDurationMs < 120);
});
