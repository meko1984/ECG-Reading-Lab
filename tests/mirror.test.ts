import assert from 'node:assert/strict';
import test from 'node:test';
import { MIRROR_SCENARIOS, MIRROR_LEADS, mirrorSelection, mirrorScenario } from '../app/domain/mirror.ts';

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

test('selection highlights reciprocal groups in both directions, without inventing unsupported pairs', () => {
  for (const lead of MIRROR_LEADS) {
    const result = mirrorSelection(lead);
    assert.ok(!result.reciprocal.includes(lead));
    if (['aVR', 'V4', 'V5', 'V6'].includes(lead)) {
      assert.equal(result.scenario, undefined);
      assert.deepEqual(result.reciprocal, []);
    } else {
      assert.ok(result.scenario);
      for (const opposite of result.reciprocal) {
        assert.ok(mirrorSelection(opposite as typeof lead).reciprocal.includes(lead));
      }
    }
  }
  assert.equal(mirrorSelection('V2').scenario?.id, 'posterior');
  assert.equal(mirrorSelection('aVL').scenario?.id, 'inferior');
});
