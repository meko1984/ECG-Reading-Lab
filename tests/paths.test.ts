import test from 'node:test';
import assert from 'node:assert/strict';
import { createAppPath } from '../app/domain/paths.ts';

test('local routes remain normal app paths', () => {
  assert.equal(createAppPath('/'), '/');
  assert.equal(createAppPath('/labs'), '/labs');
  assert.equal(createAppPath('/labs/axis'), '/labs/axis');
});

test('custom-domain static export uses HTML URLs from the domain root', () => {
  assert.equal(createAppPath('/', '', true), '/');
  assert.equal(createAppPath('/labs', '', true), '/labs.html');
  assert.equal(createAppPath('/labs/axis', '', true), '/labs/axis.html');
});

test('repository subpath remains supported for non-custom-domain previews', () => {
  assert.equal(createAppPath('/', '/ECG-Reading-Lab', true), '/ECG-Reading-Lab/');
  assert.equal(createAppPath('/labs', '/ECG-Reading-Lab', true), '/ECG-Reading-Lab/labs.html');
});
