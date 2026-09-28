import test from 'node:test';
import assert from 'node:assert/strict';
import { axisProjections, teachingQTc, teachingRate } from '../app/domain/classroom-models.ts';

test('teaching heart-rate examples preserve seconds and beats/minute', () => {
  assert.equal(teachingRate(1), 60);
  assert.equal(teachingRate(.8), 75);
  assert.equal(teachingRate(.4), 150);
  assert.throws(() => teachingRate(0));
});

test('QT formulas use milliseconds for QT and seconds for RR consistently', () => {
  assert.deepEqual(teachingQTc(400, 1), { bazett: 400, fridericia: 400 });
  assert.equal(teachingQTc(400, .64).bazett, 500);
  assert.equal(teachingQTc(400, .125).fridericia, 800);
  assert.throws(() => teachingQTc(400, 0));
});

test('lead II distinguishes negative-aVF angles around -30 degrees', () => {
  assert.ok(axisProjections(-20).avf < 0 && axisProjections(-20).leadII > 0);
  assert.ok(axisProjections(-40).avf < 0 && axisProjections(-40).leadII < 0);
  // I and II are not an orthogonal pair: both negative need not mean an extreme axis.
  assert.ok(axisProjections(160).leadI < 0 && axisProjections(160).leadII < 0 && axisProjections(160).avf > 0);
});
