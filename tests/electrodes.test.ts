import assert from 'node:assert/strict';
import test from 'node:test';
import {
  analyzePlacement,
  ECG_LEADS,
  placeElectrode,
  placementForScenario,
  waveformForScenario,
} from '../app/domain/electrodes.ts';

test('ten electrodes produce twelve displayed leads', () => {
  assert.equal(Object.values(placementForScenario('correct')).length, 10);
  assert.equal(ECG_LEADS.length, 12);
});

test('the five teaching errors are recognized from physical placement', () => {
  for (const id of ['ra-la', 'ra-ll', 'la-ll', 'v1-v2', 'v1-v2-high'] as const) {
    assert.equal(analyzePlacement(placementForScenario(id)).id, id);
  }
});

test('right-sided placement moves all six chest electrodes to V1R through V6R', () => {
  const placement = placementForScenario('right-sided');
  assert.equal(analyzePlacement(placement).id, 'right-sided');
  assert.equal(Object.values(placement).length, 10);
  assert.equal(placement.V1R, 'V1');
  assert.equal(placement.V4R, 'V4');
  assert.equal(placement.V6R, 'V6');
  assert.equal(placement.V1, undefined);
  assert.equal(placement.V6, undefined);
});

test('posterior placement keeps V1 to V3 anterior and relabels V4 to V6 as V7 to V9', () => {
  const placement = placementForScenario('posterior');
  assert.equal(analyzePlacement(placement).id, 'posterior');
  assert.equal(Object.values(placement).length, 10);
  assert.equal(placement.V1, 'V1');
  assert.equal(placement.V3, 'V3');
  assert.equal(placement.V7, 'V4');
  assert.equal(placement.V8, 'V5');
  assert.equal(placement.V9, 'V6');
  assert.equal(placement.V4, undefined);
});

test('RA-LA reversal inverts I and swaps II with III', () => {
  const normalI = waveformForScenario('I', 'correct');
  const reversedI = waveformForScenario('I', 'ra-la');
  assert.equal(reversedI.rWaveAmplitude, -normalI.rWaveAmplitude);
  assert.equal(reversedI.pWaveAmplitude, -normalI.pWaveAmplitude);
  assert.deepEqual(waveformForScenario('II', 'ra-la'), waveformForScenario('III', 'correct'));
  assert.deepEqual(waveformForScenario('III', 'ra-la'), waveformForScenario('II', 'correct'));
  assert.deepEqual(waveformForScenario('aVF', 'ra-la'), waveformForScenario('aVF', 'correct'));
});

test('RA-LL reversal inverts II and swaps aVR with aVF', () => {
  assert.equal(waveformForScenario('II', 'ra-ll').rWaveAmplitude, -waveformForScenario('II', 'correct').rWaveAmplitude);
  assert.deepEqual(waveformForScenario('aVR', 'ra-ll'), waveformForScenario('aVF', 'correct'));
});

test('LA-LL reversal swaps I with II, inverts III, and keeps aVR', () => {
  assert.deepEqual(waveformForScenario('I', 'la-ll'), waveformForScenario('II', 'correct'));
  assert.deepEqual(waveformForScenario('II', 'la-ll'), waveformForScenario('I', 'correct'));
  assert.equal(waveformForScenario('III', 'la-ll').rWaveAmplitude, -waveformForScenario('III', 'correct').rWaveAmplitude);
  assert.deepEqual(waveformForScenario('aVR', 'la-ll'), waveformForScenario('aVR', 'correct'));
});

test('V1-V2 cable reversal swaps only those two recorded waveforms', () => {
  assert.deepEqual(waveformForScenario('V1', 'v1-v2'), waveformForScenario('V2', 'correct'));
  assert.deepEqual(waveformForScenario('V2', 'v1-v2'), waveformForScenario('V1', 'correct'));
  assert.deepEqual(waveformForScenario('V3', 'v1-v2'), waveformForScenario('V3', 'correct'));
});

test('placing an electrode on an occupied site swaps the two electrodes', () => {
  const correct = placementForScenario('correct');
  const result = placeElectrode(correct, 'RA', 'LA');
  assert.equal(result.RA, 'LA');
  assert.equal(result.LA, 'RA');
  assert.equal(analyzePlacement(result).id, 'ra-la');
});

test('high V1 and V2 model reduces R amplitude and changes P polarity', () => {
  const normalV1 = waveformForScenario('V1', 'correct');
  const highV1 = waveformForScenario('V1', 'v1-v2-high');
  assert.ok(Math.abs(highV1.rWaveAmplitude - (normalV1.rWaveAmplitude - 0.1)) < 1e-9);
  assert.ok(highV1.pWaveAmplitude < 0);
  assert.equal(highV1.tWaveAmplitude, normalV1.tWaveAmplitude);
  assert.ok(waveformForScenario('V2', 'v1-v2-high').pWaveAmplitude <= 0);
});

test('removing every electrode is detected as an incomplete recording', () => {
  const result = analyzePlacement({});
  assert.equal(result.id, 'incomplete');
  assert.equal(result.affectedLeads.length, 12);
});
