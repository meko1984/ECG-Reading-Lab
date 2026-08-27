import assert from 'node:assert/strict';
import test from 'node:test';
import {
  PAC_LEADS,
  PAC_ORIGINS,
  PAC_WAVEFORM_SCALE,
  continueSvgPath,
  pacOrigin,
  polarityLabel,
  polarityPath,
} from '../app/domain/pac.ts';

test('PAC teaching model contains all nine answer-candidate origin sites', () => {
  assert.deepEqual(PAC_ORIGINS.map((origin) => origin.id), [
    'sinus-node',
    'right-atrial-appendage',
    'left-atrial-appendage',
    'left-superior-pv',
    'left-inferior-pv',
    'right-superior-pv',
    'right-inferior-pv',
    'cs-ostium',
    'svc',
  ]);
  assert.equal(PAC_ORIGINS.length, 9);
  assert.deepEqual(PAC_ORIGINS.map((origin) => origin.markerNumber), [1, 2, 3, 4, 5, 6, 7, 8, 9]);
});

test('each origin includes all six teaching leads', () => {
  for (const origin of PAC_ORIGINS) {
    assert.deepEqual(Object.keys(origin.polarities), [...PAC_LEADS]);
  }
});

test('origins that share a waveform group also share waveform data and color', () => {
  const normalize = (origin: (typeof PAC_ORIGINS)[number]) => ({
    polarities: origin.polarities,
    morphologies: origin.morphologies ?? {},
    pWaveScales: origin.pWaveScales ?? {},
  });

  const groups = Map.groupBy(PAC_ORIGINS, (origin) => origin.waveformGroup);
  for (const origins of groups.values()) {
    const [representative, ...sameGroup] = origins;
    for (const origin of sameGroup) {
      assert.equal(origin.color, representative.color);
      assert.deepEqual(normalize(origin), normalize(representative));
    }
  }

  const leftAppendage = pacOrigin('left-atrial-appendage');
  const leftSuperiorPv = pacOrigin('left-superior-pv');
  assert.equal(leftAppendage.waveformGroup, leftSuperiorPv.waveformGroup);
  assert.equal(leftAppendage.color, leftSuperiorPv.color);
});

test('representative polarity clues match each location', () => {
  const sinusNode = pacOrigin('sinus-node');
  assert.equal(sinusNode.polarities.II, 'positive');
  assert.equal(sinusNode.polarities.aVL, 'positive');
  assert.equal(sinusNode.polarities.V1, 'positive-negative');

  const rightAppendage = pacOrigin('right-atrial-appendage');
  assert.equal(rightAppendage.polarities.V1, 'negative');
  assert.equal(rightAppendage.morphologies?.V1, 'notched');

  const leftAppendage = pacOrigin('left-atrial-appendage');
  assert.equal(leftAppendage.polarities.I, 'negative');
  assert.equal(leftAppendage.polarities.V1, 'positive');

  const csOstium = pacOrigin('cs-ostium');
  assert.equal(csOstium.polarities.II, 'negative');
  assert.equal(csOstium.polarities.aVL, 'positive');
  assert.equal(csOstium.polarities.V1, 'negative-positive');

  const leftSuperiorPv = pacOrigin('left-superior-pv');
  assert.equal(leftSuperiorPv.polarities.I, 'negative');
  assert.equal(leftSuperiorPv.polarities.V1, 'positive');

  const leftInferiorPv = pacOrigin('left-inferior-pv');
  assert.equal(leftInferiorPv.polarities.I, 'negative');
  assert.equal(leftInferiorPv.polarities.aVF, 'negative');

  const rightSuperiorPv = pacOrigin('right-superior-pv');
  assert.equal(rightSuperiorPv.polarities.I, 'positive');
  assert.equal(rightSuperiorPv.polarities.aVF, 'positive');

  const rightInferiorPv = pacOrigin('right-inferior-pv');
  assert.equal(rightInferiorPv.polarities.I, 'positive');
  assert.equal(rightInferiorPv.polarities.aVF, 'negative');

  const svc = pacOrigin('svc');
  assert.equal(svc.polarities.aVL, 'isoelectric');
  assert.equal(svc.polarities.V1, 'positive-negative');
});

test('polarity labels and SVG paths cover all waveform directions', () => {
  assert.equal(polarityLabel('positive'), '陽性');
  assert.equal(polarityLabel('negative'), '陰性');
  assert.equal(polarityLabel('positive-negative'), '陽性／陰性');
  assert.equal(polarityLabel('negative-positive'), '陰性／陽性');
  assert.equal(polarityLabel('isoelectric'), 'ほぼ平坦');

  const paths = [
    polarityPath('positive', 30, 20),
    polarityPath('negative', 30, 20),
    polarityPath('positive-negative', 30, 20),
    polarityPath('negative-positive', 30, 20),
    polarityPath('isoelectric', 30, 20),
  ];
  assert.equal(new Set(paths).size, 5);
  paths.forEach((path) => assert.match(path, /^M/));

  assert.notEqual(
    polarityPath('positive', 30, 20, 1, 'notched'),
    polarityPath('positive', 30, 20, 1, 'smooth'),
  );
  assert.notEqual(
    polarityPath('positive', 30, 20, 1, 'broad'),
    polarityPath('positive', 30, 20, 1, 'smooth'),
  );
  assert.notEqual(
    polarityPath('negative', 30, 20, 1, 'notched'),
    polarityPath('negative', 30, 20, 1, 'smooth'),
  );
});

test('separate ECG SVG segments can be joined into one continuous path', () => {
  assert.equal(continueSvgPath('M12 30 H40'), 'L12 30 H40');
  assert.throws(() => continueSvgPath('L12 30 H40'), /must start with M/);
});

test('PAC waveform scale represents a premature narrow-complex beat', () => {
  assert.equal(PAC_WAVEFORM_SCALE.paperSpeedMmPerSec, 25);
  assert.equal(PAC_WAVEFORM_SCALE.gainMmPerMv, 10);
  assert.ok(PAC_WAVEFORM_SCALE.prematureCouplingMs < PAC_WAVEFORM_SCALE.normalCycleMs);
  assert.ok(PAC_WAVEFORM_SCALE.qrsDurationMs < 120);
});
