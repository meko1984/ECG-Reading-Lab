import test from 'node:test';
import assert from 'node:assert/strict';
import { rhythmExamples } from '../app/domain/classroom-rhythms.ts';

test('AV diagrams distinguish changing PR, non-conduction and independent ventricular rhythm',()=>{
  const [first,wenckebach,mobitz,two,high,complete]=rhythmExamples.av;
  const pr=(e:typeof first)=>e.connections.map(([a,v])=>Number((e.ventricles[v].time-e.atria[a].time).toFixed(2)));
  assert.deepEqual(pr(first),Array(7).fill(.28));
  assert.deepEqual(pr(wenckebach),[.16,.24,.32,.16,.24,.32]);
  assert.equal(wenckebach.connections.some(([a])=>a===3),false);
  assert.deepEqual(pr(mobitz),Array(5).fill(.16));
  assert.deepEqual(two.connections.map(([a])=>a),[0,2,4,6]);
  assert.deepEqual(high.connections.map(([a])=>a),[0,3,6]);
  assert.equal(complete.connections.length,0);
  assert.equal(complete.ventricles[1].time-complete.ventricles[0].time,1.5);
});

test('non-conducted PAC preserves early atrial event while dropping only its ventricular response',()=>{
  const [conducted,blocked]=rhythmExamples.pac;
  assert.deepEqual(blocked.atria,conducted.atria);
  assert.equal(blocked.atria[2].ectopic,true);
  assert.ok(blocked.atria[2].time-blocked.atria[1].time < blocked.atria[1].time-blocked.atria[0].time);
  assert.equal(blocked.ventricles.length,conducted.ventricles.length-1);
  assert.equal(blocked.connections.some(([a])=>a===2),false);
});

test('flutter comparison changes ventricular rate without changing atrial timing',()=>{
  const examples=rhythmExamples.flutter;
  for (const [index,example] of examples.entries()) {
    assert.deepEqual(example.atria,examples[0].atria);
    const rr=example.ventricles[1].time-example.ventricles[0].time;
    assert.ok(Math.abs(rr-.2*(index+2))<1e-10);
  }
});
