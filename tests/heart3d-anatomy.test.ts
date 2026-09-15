import test from 'node:test';
import assert from 'node:assert/strict';
import { ANATOMY_ITEMS, anatomyPoint, createDetailedHeartMeshes, isNearSide } from '../app/domain/heart3d-anatomy.ts';

test('far-side names disappear from the front and return when rotated to the back',()=>{
  const front={yaw:0,pitch:0,zoom:1},back={yaw:Math.PI,pitch:0,zoom:1};
  for(const name of ['冠静脈洞','左上肺静脈','右下肺静脈']) {
    const point=ANATOMY_ITEMS.find(item=>item.name===name)!.point;
    assert.equal(isNearSide(point,front),false,name);
    assert.equal(isNearSide(point,back),true,name);
  }
  const lad=ANATOMY_ITEMS.find(item=>item.name==='左前下行枝')!.point;
  assert.equal(isNearSide(lad,front),true);
  assert.equal(isNearSide(lad,back),false);
});

test('detailed anatomy builds finite meshes including internal valves without oversized argument lists',()=>{
  const meshes=createDetailedHeartMeshes([.5,.7,.9],[.9,.6,.7],[.9,.7,.3]);
  assert.ok(meshes.length>=25);
  for(const mesh of meshes) {
    assert.equal(mesh.vertices.length%18,0);
    assert.ok(mesh.vertices.every(Number.isFinite));
  }
  const shell=meshes.find(m=>m.anatomical)!;
  let min=Infinity,max=-Infinity;
  for(let i=2;i<shell.vertices.length;i+=6){min=Math.min(min,shell.vertices[i]);max=Math.max(max,shell.vertices[i]);}
  assert.ok(max-min>2,'the heart has substantial anteroposterior volume');
});

test('named posterior structures remain posterior and pulmonary veins retain patient side and level',()=>{
  const at=(name:string)=>anatomyPoint(ANATOMY_ITEMS.find(item=>item.name===name)!.point);
  assert.equal(new Set(ANATOMY_ITEMS.map(item=>item.name)).size,17);
  for(const side of ['右','左']) {
    const upper=at(`${side}上肺静脈`),lower=at(`${side}下肺静脈`);
    assert.ok(upper[1]>lower[1]);assert.ok(upper[2]<0&&lower[2]<0);
    assert.ok(side==='右'?upper[0]<0:upper[0]>0);
  }
  assert.ok(at('冠静脈洞')[2]<anatomyPoint([.27,.78,-.47])[2],'coronary sinus remains posterior to the LA center');
  assert.ok(at('右室流出路')[2]>at('左室流出路')[2]);
});
