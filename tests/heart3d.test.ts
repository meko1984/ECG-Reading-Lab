import test from 'node:test';
import assert from 'node:assert/strict';
import { HEART_PARTS, LEAD_VIEWS, createHeartMeshes, layoutLeadLabels, project, rotate, sub, type Vec3 } from '../app/domain/heart3d.ts';

test('limb lead axes retain the six standard frontal-plane angles',()=>{
  const expected=[0,60,120,-150,-30,90];
  LEAD_VIEWS.slice(0,6).forEach((lead,i)=>{
    const [x,y,z]=lead.position;
    assert.equal(z,0);
    assert.ok(Math.abs(Math.atan2(-y,x)*180/Math.PI-expected[i])<1e-8);
  });
  const chest=LEAD_VIEWS.slice(6);
  assert.equal(new Set(LEAD_VIEWS.map(l=>l.id)).size,12);
  assert.ok(chest.every(l=>l.position[2]>0),'no anterior chest electrode moves behind the heart');
  assert.ok(chest.every((l,i)=>i===0||l.position[0]>chest[i-1].position[0]));
  assert.equal(chest[3].position[1],chest[4].position[1]);
  assert.equal(chest[4].position[1],chest[5].position[1]);
});

test('camera rotation preserves lead-to-heart distances and patient left/right',()=>{
  for(const yaw of [0,.7,Math.PI/2,Math.PI])for(const pitch of [0,1,-1])for(const lead of LEAD_VIEWS){
    const distance=Math.hypot(...sub(lead.position,lead.target));
    assert.ok(Math.abs(Math.hypot(...sub(rotate(lead.position,yaw,pitch),rotate(lead.target,yaw,pitch)))-distance)<1e-10);
  }
  const p:Vec3=[1,0,0];
  assert.ok(project(p,{yaw:0,pitch:0,zoom:1},390,440).x>195);
  assert.ok(project(p,{yaw:Math.PI,pitch:0,zoom:1},390,440).x<195);
});

test('four chambers and coronary/great-vessel meshes have finite three-dimensional geometry',()=>{
  assert.deepEqual(HEART_PARTS.map(p=>p.name).sort(),['右室','右房','左室','左房']);
  const meshes=createHeartMeshes([.5,.7,.9],[.9,.6,.7],[.9,.7,.3]);
  assert.equal(meshes.filter(m=>m.anatomical).length,1);
  const shell=meshes.find(m=>m.anatomical)!;
  assert.equal(shell.rightWeights?.length,shell.vertices.length/6);
  assert.ok(shell.rightWeights!.some(w=>w>.15&&w<.85),'left/right colors blend at the shared surface');
  const parents:number[]=[],ids=new Map<string,number>();
  const root=(id:number):number=>parents[id]===id?id:(parents[id]=root(parents[id]));
  for(let i=0;i<shell.vertices.length;i+=18){
    const triangle=[0,6,12].map(offset=>{
      const key=Array.from(shell.vertices.slice(i+offset,i+offset+3)).map(v=>v.toFixed(5)).join(',');
      let id=ids.get(key);if(id===undefined){id=parents.length;ids.set(key,id);parents.push(id);}return id;
    });
    parents[root(triangle[1])]=root(triangle[0]);parents[root(triangle[2])]=root(triangle[0]);
  }
  assert.equal(new Set(parents.map((_,i)=>root(i))).size,1,'all four chamber surfaces form a single connected shell');
  assert.ok(meshes.length>=17);
  for(const mesh of meshes){
    assert.equal(mesh.vertices.length%18,0);
    assert.ok(mesh.vertices.every(Number.isFinite));
    let minDepth=Infinity,maxDepth=-Infinity;
    for(let i=2;i<mesh.vertices.length;i+=6){minDepth=Math.min(minDepth,mesh.vertices[i]);maxDepth=Math.max(maxDepth,mesh.vertices[i]);}
    assert.ok(maxDepth-minDepth>.01);
  }
});

test('touch labels remain separated and within the smallest stage across rotation and zoom',()=>{
  for(const yaw of [0,.4,1.1,Math.PI/2,Math.PI,4.8])for(const pitch of [-Math.PI/2,-.7,0,.6,Math.PI/2])for(const zoom of [.7,1,1.65]){
    const labels=layoutLeadLabels({yaw,pitch,zoom},276,370);
    for(const a of labels){assert.ok(a.x>=25&&a.x<=251&&a.y>=25&&a.y<=345);}
    for(let i=0;i<labels.length;i++)for(let j=i+1;j<labels.length;j++){
      assert.ok(Math.abs(labels[i].x-labels[j].x)>=48.9||Math.abs(labels[i].y-labels[j].y)>=46.9,`${yaw}/${pitch}/${zoom}: ${labels[i].lead.id}/${labels[j].lead.id}`);
    }
  }
});
