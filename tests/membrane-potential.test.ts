import test from 'node:test';
import assert from 'node:assert/strict';
import {
  actionPotentialAt,
  createMembraneModel,
  ecgLeadIIAt,
  NORMAL_ELECTROLYTES,
  phaseAt,
  type ElectrolyteSettings,
} from '../app/domain/membrane-potential.ts';

const settings = (change: Partial<ElectrolyteSettings>): ElectrolyteSettings => ({ ...NORMAL_ELECTROLYTES, ...change });

test('normal model starts at a physiologic representative resting potential', () => {
  const model = createMembraneModel(NORMAL_ELECTROLYTES);
  assert.equal(model.restingPotential, -90);
  assert.equal(actionPotentialAt(0, model), -90);
  assert.equal(phaseAt(0, model), 4);
});

test('higher extracellular potassium depolarizes the resting membrane', () => {
  const low = createMembraneModel(settings({ k: -1 }));
  const high = createMembraneModel(settings({ k: 1 }));
  assert.ok(high.restingPotential > low.restingPotential);
});

test('potassium and calcium move representative repolarization in expected directions', () => {
  const lowK = createMembraneModel(settings({ k: -1 }));
  const highK = createMembraneModel(settings({ k: 1 }));
  const lowCa = createMembraneModel(settings({ ca: -1 }));
  const highCa = createMembraneModel(settings({ ca: 1 }));
  assert.ok(lowK.qtEnd > highK.qtEnd);
  assert.ok(lowCa.qtEnd > highCa.qtEnd);
  assert.ok(highK.tAmplitude > lowK.tAmplitude);
});

test('lower sodium slows the representative upstroke and broadens QRS', () => {
  const low = createMembraneModel(settings({ na: -1 }));
  const normal = createMembraneModel(NORMAL_ELECTROLYTES);
  assert.ok(low.upstrokeEnd - low.depolarizationStart > normal.upstrokeEnd - normal.depolarizationStart);
  assert.ok(low.qrsWidth > normal.qrsWidth);
});

test('magnesium extremes change repolarization conservatively in both directions', () => {
  const low = createMembraneModel(settings({ mg: -1 }));
  const normal = createMembraneModel(NORMAL_ELECTROLYTES);
  const high = createMembraneModel(settings({ mg: 1 }));
  assert.ok(low.qtEnd > normal.qtEnd);
  assert.ok(high.qtEnd > normal.qtEnd);
  assert.ok(low.qtEnd - normal.qtEnd > high.qtEnd - normal.qtEnd);
});

test('all three views share the same selected instant without invalid values', () => {
  const mixed = settings({ k: 0.5, ca: -0.5, mg: -0.5, cl: 0.5, na: -0.5 });
  const model = createMembraneModel(mixed);
  for (const time of [0, 190, 240, 400, 600, 900]) {
    assert.ok(Number.isFinite(actionPotentialAt(time, model)));
    assert.ok(Number.isFinite(ecgLeadIIAt(time, mixed, model)));
  }
});

test('low potassium adds a later U-wave component', () => {
  const lowKSettings = settings({ k: -1 });
  const lowKModel = createMembraneModel(lowKSettings);
  const normalModel = createMembraneModel(NORMAL_ELECTROLYTES);
  const uTime = Math.min(700, lowKModel.qtEnd + 85);
  assert.ok(ecgLeadIIAt(uTime, lowKSettings, lowKModel) > ecgLeadIIAt(uTime, NORMAL_ELECTROLYTES, normalModel));
});
