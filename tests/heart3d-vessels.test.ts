import test from 'node:test';
import assert from 'node:assert/strict';
import { GREAT_VESSELS, CORONARY_VESSELS } from '../app/domain/heart3d-vessels.ts';
import { chamberDistance, HEART_PARTS } from '../app/domain/heart3d.ts';
const vessel=(name:string)=>[...GREAT_VESSELS,...CORONARY_VESSELS].find(v=>v.name===name)!;

test('pulmonary trunk is left/anterior to ascending aorta; RPA crosses behind aorta and SVC',()=>{
  const trunk=vessel('肺動脈幹'),aorta=vessel('大動脈'),right=vessel('右肺動脈');
  assert.ok(trunk.points[2][0]>aorta.points[1][0]);
  assert.ok(Math.hypot(trunk.points[2][0]-aorta.points[1][0],trunk.points[2][2]-aorta.points[1][2])>trunk.radius+aorta.radius);
  assert.ok(trunk.points[2][2]>aorta.points[1][2]);
  assert.deepEqual(right.points[0],trunk.points.at(-1));
  assert.deepEqual(vessel('左肺動脈').points[0],trunk.points.at(-1));
  assert.ok(right.points.some(p=>p[0]>0)&&right.points.some(p=>p[0]<0));
  assert.ok(right.points.slice(1).every(p=>p[2]<-.4));
  assert.ok(vessel('左肺動脈').points.every(p=>p[0]>0));
  assert.ok(right.points.some(p=>p.every((n,i)=>n===vessel('右上肺動脈').points[0][i])));
});

test('four separate veins connect to LA and have superior forward/up vs inferior back/down courses',()=>{
  const entries=[];
  for(const side of ['右','左'])for(const level of ['上','下']){
    const points=vessel(`${side}${level}肺静脈`).points,start=points[0],end=points.at(-1)!;
    assert.ok(chamberDistance(start,HEART_PARTS[2])<0,'PV begins within left atrial envelope');
    entries.push(start.join(','));
    assert.ok(side==='右'?end[0]<0:end[0]>0);
    assert.ok(level==='上'?end[1]>start[1]:end[1]<start[1]);
    assert.ok(level==='上'?end[2]>start[2]:end[2]<start[2]);
  }
  assert.equal(new Set(entries).size,4);
});

test('coronary branches share actual junctions and CS terminates inside right atrium',()=>{
  const lm=vessel('左冠動脈主幹部').points,lad=vessel('左前下行枝').points,lcx=vessel('左回旋枝').points;
  assert.deepEqual(lm.at(-1),lad[0]);assert.ok(lm.includes(lcx[0]));
  assert.ok(lad.at(-1)![1]<-1.2);
  assert.ok(lcx.at(-1)![2]<0);
  assert.deepEqual(vessel('後下行枝').points[0],vessel('右冠動脈').points.at(-1));
  assert.ok(chamberDistance(vessel('冠静脈洞').points.at(-1)!,HEART_PARTS[3])<0);
});
