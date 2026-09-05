import assert from 'node:assert/strict';
import test from 'node:test';
import { PVC_ORIGINS, pvcLeadMorphology, pvcOrigin, pvcOriginEstimate, pvcPolarityLabel, pvcVentricle } from '../app/domain/pvc.ts';

test('PVC map exposes eight numbered right and left ventricular regions', () => {
  assert.equal(PVC_ORIGINS.length, 8);
  assert.deepEqual(PVC_ORIGINS.map((origin) => origin.markerNumber), [1, 2, 3, 4, 5, 6, 7, 8]);
  assert.equal(PVC_ORIGINS.filter((origin) => origin.ventricle === 'right').length, 4);
  assert.equal(PVC_ORIGINS.filter((origin) => origin.ventricle === 'left').length, 4);
  assert.equal(pvcOrigin('right-apex').siteName, '右室心尖部');
  assert.equal(pvcOrigin('left-upper-outer').siteName, '左室弁輪前壁・流出路');
});

test('all eight origin patterns stay aligned with the four-step reference table', () => {
  const expectedPatterns = {
    'right-upper-outer': ['lbbb-like', 'positive', 'positive', 'positive'],
    'right-upper-inner': ['lbbb-like', 'positive', 'negative', 'negative'],
    'right-lower-outer': ['lbbb-like', 'negative', 'positive', 'positive'],
    'right-apex': ['lbbb-like', 'negative', 'negative', 'negative'],
    'left-upper-outer': ['rbbb-like', 'positive', 'positive', 'positive'],
    'left-upper-inner': ['rbbb-like', 'positive', 'negative', 'negative'],
    'left-lower-outer': ['rbbb-like', 'negative', 'positive', 'positive'],
    'left-apex': ['rbbb-like', 'negative', 'negative', 'negative'],
  } as const;

  for (const origin of PVC_ORIGINS) {
    assert.deepEqual(
      [
        origin.selections.bundlePattern,
        origin.selections.inferiorPolarity,
        origin.selections.lateralPolarity,
        origin.selections.leftPrecordialPolarity,
      ],
      expectedPatterns[origin.id],
    );
  }
});

test('RVOT example keeps lead-specific morphology beyond the simple polarity table', () => {
  assert.equal(pvcLeadMorphology('right-upper-outer', 'I'), 'rvot-low-rs');
  assert.equal(pvcLeadMorphology('right-upper-outer', 'II'), 'rvot-inferior-rs');
  assert.equal(pvcLeadMorphology('right-upper-outer', 'aVL'), 'rvot-avl-qs');
  assert.equal(pvcLeadMorphology('right-upper-outer', 'V1'), 'rvot-v1-qs');
  assert.equal(pvcLeadMorphology('right-upper-outer', 'V6'), 'rvot-lateral-rs');
  assert.equal(pvcLeadMorphology('right-apex', 'V1'), undefined);
});

test('V1 bundle-branch pattern selects the opposite ventricular side', () => {
  assert.equal(pvcVentricle('rbbb-like'), 'left');
  assert.equal(pvcVentricle('lbbb-like'), 'right');
});

test('the four concordant polarity combinations map to four broad regions', () => {
  const regions = [
    ['positive', 'positive', 'upper-outer'],
    ['positive', 'negative', 'upper-inner'],
    ['negative', 'positive', 'lower-outer'],
    ['negative', 'negative', 'apex'],
  ] as const;

  for (const [inferiorPolarity, sidePolarity, expectedRegion] of regions) {
    const estimate = pvcOriginEstimate({
      bundlePattern: 'lbbb-like',
      inferiorPolarity,
      lateralPolarity: sidePolarity,
      leftPrecordialPolarity: sidePolarity,
    });
    assert.equal(estimate.ventricle, 'right');
    assert.equal(estimate.region, expectedRegion);
    assert.equal(estimate.isWithinSimpleModel, true);
  }
});

test('the same four regions can be applied to the left ventricular side', () => {
  const estimate = pvcOriginEstimate({
    bundlePattern: 'rbbb-like',
    inferiorPolarity: 'negative',
    lateralPolarity: 'negative',
    leftPrecordialPolarity: 'negative',
  });
  assert.equal(estimate.ventricle, 'left');
  assert.equal(estimate.region, 'apex');
  assert.match(estimate.title, /左室/);
});

test('discordant lateral groups stop instead of inventing an origin', () => {
  const estimate = pvcOriginEstimate({
    bundlePattern: 'rbbb-like',
    inferiorPolarity: 'positive',
    lateralPolarity: 'positive',
    leftPrecordialPolarity: 'negative',
  });
  assert.equal(estimate.region, null);
  assert.equal(estimate.isWithinSimpleModel, false);
  assert.match(estimate.location, /単純モデルでは/);
});

test('polarity labels explain the screen direction', () => {
  assert.equal(pvcPolarityLabel('positive'), '陽性（上向き）');
  assert.equal(pvcPolarityLabel('negative'), '陰性（下向き）');
});
