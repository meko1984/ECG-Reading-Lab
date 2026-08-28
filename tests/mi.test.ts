import assert from 'node:assert/strict';
import test from 'node:test';
import { MI_TERRITORIES, STANDARD_LEADS, miLeadChange, miLeadLabel, miTerritory } from '../app/domain/mi.ts';

test('MI lab provides twelve standard leads in the ECG display order', () => {
  assert.equal(STANDARD_LEADS.length, 12);
  assert.deepEqual(new Set(STANDARD_LEADS).size, 12);
  assert.deepEqual(STANDARD_LEADS.slice(0, 4), ['I', 'aVR', 'V1', 'V4']);
});

test('all six teaching territories are available', () => {
  assert.deepEqual(MI_TERRITORIES.map((territory) => territory.id), ['septal', 'anterior', 'lateral', 'inferior', 'posterior', 'right-ventricle']);
});

test('inferior territory highlights contiguous inferior leads and reciprocal leads', () => {
  const inferior = miTerritory('inferior');
  assert.deepEqual(inferior.standardElevation, ['II', 'III', 'aVF']);
  assert.equal(miLeadChange(inferior, 'II'), 'elevation');
  assert.equal(miLeadChange(inferior, 'aVL'), 'depression');
  assert.equal(miLeadChange(inferior, 'V4'), 'neutral');
});

test('posterior territory uses a mirror pattern and posterior confirmation leads', () => {
  const posterior = miTerritory('posterior');
  assert.equal(posterior.standardElevation.length, 0);
  assert.deepEqual(posterior.reciprocalDepression, ['V1', 'V2', 'V3']);
  assert.deepEqual(posterior.supplementalElevation, ['V7', 'V8', 'V9']);
  assert.equal(miLeadChange(posterior, 'V2'), 'depression');
  assert.equal(miLeadChange(posterior, 'V8'), 'elevation');
});

test('right ventricular territory requires right-sided supplemental leads', () => {
  const right = miTerritory('right-ventricle');
  assert.deepEqual(right.supplementalElevation, ['V3R', 'V4R']);
  assert.match(right.artery, /右冠動脈/);
});

test('Roman lead labels are localized without changing augmented labels', () => {
  assert.equal(miLeadLabel('II'), 'Ⅱ');
  assert.equal(miLeadLabel('aVF'), 'aVF');
});
