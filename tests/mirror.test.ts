import assert from 'node:assert/strict';
import test from 'node:test';
import { MIRROR_SCENARIOS, mirrorChangeLabel, mirrorProjection, mirrorScenario, mirrorViewLabel } from '../app/domain/mirror.ts';

test('mirror lab starts with only the two approved simulator scenes', () => {
  assert.deepEqual(MIRROR_SCENARIOS.map((scenario) => scenario.id), ['inferior', 'posterior']);
});

test('inferior scene keeps direct and reciprocal leads visible as separate sides', () => {
  const inferior = mirrorScenario('inferior');
  assert.deepEqual(inferior.direct.leads, ['Ⅱ', 'Ⅲ', 'aVF']);
  assert.equal(inferior.direct.change, 'ST上昇');
  assert.deepEqual(inferior.opposite.leads, ['Ⅰ', 'aVL']);
  assert.equal(inferior.opposite.change, 'ST低下');
});

test('posterior scene pairs posterior leads with anterior reciprocal leads', () => {
  const posterior = mirrorScenario('posterior');
  assert.deepEqual(posterior.direct.leads, ['V7', 'V8', 'V9']);
  assert.equal(posterior.direct.change, 'ST上昇');
  assert.deepEqual(posterior.opposite.leads, ['V1', 'V2', 'V3']);
  assert.equal(posterior.opposite.change, 'ST低下');
  assert.match(posterior.caution, /非特異的/);
});

test('view slider continuously changes the projected ST direction', () => {
  assert.equal(mirrorViewLabel(0), '直接側の誘導');
  assert.equal(mirrorViewLabel(50), '真横から見る仮想視点');
  assert.equal(mirrorViewLabel(100), '反対側の誘導');
  assert.equal(mirrorProjection(0), 1);
  assert.ok(Math.abs(mirrorProjection(50)) < Number.EPSILON);
  assert.equal(mirrorProjection(100), -1);
  assert.equal(mirrorChangeLabel(0), 'ST上昇');
  assert.equal(mirrorChangeLabel(50), '基線付近');
  assert.equal(mirrorChangeLabel(100), 'ST低下');
});
