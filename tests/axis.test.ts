import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculateAxis,
  classifyAxis,
  INITIAL_LEAD_I,
  INITIAL_LEAD_II,
  netQRS,
  signed,
} from '../app/domain/axis.ts';

test('初期値はiOS版と同じ正味QRSと平均電気軸になる', () => {
  const result = calculateAxis(netQRS(INITIAL_LEAD_I), netQRS(INITIAL_LEAD_II));

  assert.equal(result.leadI, 5.7);
  assert.equal(result.leadII, 7);
  assert.ok(Math.abs(result.angleDegrees - 40.06) < 0.01);
  assert.equal(result.classification, '正常範囲');
});

test('判定境界は-30度と+90度を正常範囲に含む', () => {
  assert.equal(classifyAxis(-30), '正常範囲');
  assert.equal(classifyAxis(90), '正常範囲');
  assert.equal(classifyAxis(-30.01), '左軸偏位');
  assert.equal(classifyAxis(90.01), '右軸偏位');
});

test('右軸・左軸・不定軸の領域を分類できる', () => {
  assert.equal(classifyAxis(120), '右軸偏位');
  assert.equal(classifyAxis(-45), '左軸偏位');
  assert.equal(classifyAxis(-120), '不定軸 / 極度軸偏位');
  assert.equal(classifyAxis(180), '右軸偏位');
  assert.equal(classifyAxis(-180), '不定軸 / 極度軸偏位');
});

test('両誘導が0でもNaNにならず、atan2の結果を保つ', () => {
  const result = calculateAxis(0, 0);
  assert.equal(result.angleDegrees, 0);
  assert.equal(result.classification, '正常範囲');
});

test('符号付き表示では負の0を+0として扱う', () => {
  assert.equal(signed(-0), '+0.0');
  assert.equal(signed(4.25, 2), '+4.25');
  assert.equal(signed(-4.25, 2), '-4.25');
});
