import assert from 'node:assert/strict';
import test from 'node:test';
import { ARTERIES } from '../app/domain/heart3d.ts';
import { MI_3D } from '../app/domain/mi3d.ts';
import { MI_TERRITORIES } from '../app/domain/mi.ts';

test('all MI regions refer to existing coronary meshes and bounded camera views',()=>{
  for(const territory of MI_TERRITORIES){
    const region=MI_3D[territory.id];
    assert.ok(region.arteries.length);
    for(const name of region.arteries)assert.ok(ARTERIES.some(a=>a.name===name),name);
    assert.ok(region.extent.every(n=>Number.isFinite(n)&&n>0));
    assert.ok(region.camera.zoom>=.7&&region.camera.zoom<=1.65);
  }
});
test('posterior, inferior and septal teaching views distinguish depth and internal position',()=>{
  assert.ok(MI_3D.posterior.target[2]<-.4);
  assert.ok(MI_3D.anterior.target[2]>.4);
  assert.ok(MI_3D.inferior.target[1]<-.7);
  assert.ok(MI_3D['right-ventricle'].target[0]<0);
  assert.equal(MI_3D.septal.target[0],.12);
  assert.ok(MI_3D.septal.extent[0]<MI_3D.septal.extent[1]);
});
