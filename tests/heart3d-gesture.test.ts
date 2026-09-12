import test from 'node:test';
import assert from 'node:assert/strict';
import { createHeartGesture } from '../app/domain/heart3d-gesture.ts';
import { INITIAL_CAMERA } from '../app/domain/heart3d.ts';

test('single pointer rotates both axes, and dragging does not select a lead',()=>{
  const gesture=createHeartGesture();gesture.down(1,{x:100,y:100});
  const update=gesture.move(1,{x:140,y:120})!;const c=update(INITIAL_CAMERA);
  assert.equal(c.yaw,INITIAL_CAMERA.yaw+.36);assert.equal(c.pitch,INITIAL_CAMERA.pitch+.18);
  assert.equal(c.zoom,1);assert.equal(gesture.up(1),false);
  gesture.down(2,{x:100,y:100});assert.equal(gesture.move(2,{x:103,y:102}),null);assert.equal(gesture.up(2),true);
});
test('two touch pointers pinch within bounds without rotation or accidental tap',()=>{
  const gesture=createHeartGesture();gesture.down(1,{x:100,y:100});gesture.down(2,{x:200,y:100});
  const c=gesture.move(2,{x:250,y:100})!(INITIAL_CAMERA);
  assert.equal(c.zoom,1.5);assert.equal(c.yaw,INITIAL_CAMERA.yaw);assert.equal(c.pitch,INITIAL_CAMERA.pitch);
  assert.equal(gesture.move(2,{x:500,y:100})!(c).zoom,1.65);
  assert.equal(gesture.move(2,{x:106,y:100})!(c).zoom,.7);
  assert.equal(gesture.up(1),false);assert.equal(gesture.up(2),false);
});
test('cancelled touch capture cannot select a marker and a new gesture recovers',()=>{
  const gesture=createHeartGesture();gesture.down(1,{x:0,y:0});gesture.cancel(1);
  assert.equal(gesture.up(1),false);assert.equal(gesture.move(1,{x:10,y:10}),null);
  gesture.down(2,{x:20,y:20});assert.equal(gesture.up(2),true);
});
