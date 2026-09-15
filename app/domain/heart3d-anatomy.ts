import { add, createHeartMeshes, normalize, rotate, sub, tube, type Camera, type Mesh, type Vec3 } from './heart3d.ts';
import { CORONARY_VESSELS, GREAT_VESSELS, vesselAnchor } from './heart3d-vessels.ts';

// Patient coordinates: left +X, superior +Y, anterior +Z. Schematic, not CT-derived.
// Increase the anteroposterior volume and carry the ventricular apex left/anterior.
export const anatomyPoint = (p: Vec3): Vec3 => [p[0]+Math.max(0,-p[1]-.35)*.18,p[1],p[2]*1.32+Math.max(0,-p[1]-.35)*.24];
/** Hide far-side labels even when transparent tissue reveals their meshes. */
export function isNearSide(point:Vec3,camera:Camera):boolean {
  const relative=sub(anatomyPoint(point),anatomyPoint([0,.3,-.15]));
  return rotate(relative,camera.yaw,camera.pitch)[2]>.025;
}
export type AnatomyItem = { name:string; point:Vec3; group:'表面'|'血管'|'内部'; side: 'left'|'right' };
export const ANATOMY_ITEMS: AnatomyItem[] = [
  {name:'左回旋枝',point:vesselAnchor('左回旋枝',8),group:'血管',side:'right'},
  {name:'右冠動脈',point:vesselAnchor('右冠動脈',5),group:'血管',side:'left'},
  {name:'左前下行枝',point:vesselAnchor('左前下行枝',7),group:'血管',side:'right'},
  {name:'左心耳',point:[.73,.99,.35],group:'表面',side:'right'},
  {name:'右心耳',point:[-.51,1.03,.48],group:'表面',side:'left'},
  {name:'心尖部',point:[.72,-1.29,.05],group:'表面',side:'right'},
  {name:'僧帽弁',point:[.3,.4,-.35],group:'内部',side:'right'},
  {name:'三尖弁',point:[-.48,.26,.2],group:'内部',side:'left'},
  {name:'右室流出路',point:vesselAnchor('肺動脈幹',1),group:'内部',side:'left'},
  {name:'左室流出路',point:[.04,.57,.04],group:'内部',side:'right'},
  {name:'上大静脈',point:[-.95,1.48,-.03],group:'血管',side:'left'},
  {name:'右上肺動脈',point:vesselAnchor('右上肺動脈',1),group:'血管',side:'left'},
  {name:'右上肺静脈',point:vesselAnchor('右上肺静脈',2),group:'血管',side:'left'},
  {name:'右下肺静脈',point:vesselAnchor('右下肺静脈',2),group:'血管',side:'left'},
  {name:'左上肺静脈',point:vesselAnchor('左上肺静脈',2),group:'血管',side:'right'},
  {name:'左下肺静脈',point:vesselAnchor('左下肺静脈',2),group:'血管',side:'right'},
  {name:'冠静脈洞',point:vesselAnchor('冠静脈洞',5),group:'血管',side:'left'},
];

function valve(center:Vec3, rx:number, rz:number, cusps:number):Float32Array {
  const out:number[]=[];
  // Annular rim plus scalloped leaflet surfaces; opening is schematic.
  const ring=Array.from({length:49},(_,i)=>add(center,[Math.cos(i*Math.PI/24)*rx,0,Math.sin(i*Math.PI/24)*rz]));
  for(const value of tube(ring,.026)) out.push(value);
  for(let i=0;i<96;i++) {
    const at=(a:number,r:number):Vec3=>add(center,[Math.cos(a)*rx*r,-.12*(1-r)+.035*Math.cos(a*cusps)*(1-r),Math.sin(a)*rz*r]);
    const a=i*Math.PI/48,b=(i+1)*Math.PI/48;
    for(const p of [at(a,1),at(b,1),at(b,.18),at(a,1),at(b,.18),at(a,.18)])out.push(...p,0,1,0);
  }
  return new Float32Array(out);
}

export function createDetailedHeartMeshes(right:Vec3,left:Vec3,coronary:Vec3):Mesh[] {
  const original=createHeartMeshes(right,left,coronary);
  // Keep only the shared heart shell and venae cavae; all other vessel paths
  // come from the named anatomical definitions also used by label anchors/tests.
  const meshes=original.filter((_,i)=>i===0||i===3||i===4);
  const vessel=(points:Vec3[],radius:number,color:Vec3)=>meshes.push({vertices:tube(points,radius),color,anatomical:false});
  for(const path of [...GREAT_VESSELS,...CORONARY_VESSELS])meshes.push({vertices:tube(path.points,path.radius),color:path.kind==='coronary'?coronary:path.kind==='sinus'?[.4,.52,.92]:path.kind==='venous'?right:left,anatomical:false,arteryName:path.kind==='coronary'?path.name:undefined});
  // Appendages arise from their respective atria and project around the great-vessel roots.
  vessel([[.51,.87,-.38],[.75,1.01,-.03],[.73,.99,.35],[.54,.86,.52]],.14,left);
  vessel([[-.85,.87,.13],[-.67,1.02,.39],[-.51,1.03,.48],[-.29,.91,.46]],.17,right);
  vessel([[.27,.05,-.13],[.13,.32,-.02],[.04,.57,.04],[0,.79,.13]],.135,[.97,.66,.46]);
  meshes.push({vertices:valve([.3,.4,-.35],.3,.25,2),color:[.99,.91,.64],anatomical:false});
  meshes.push({vertices:valve([-.48,.26,.2],.32,.27,3),color:[.65,.94,.9],anatomical:false});
  return meshes.map(mesh=>{
    const vertices=mesh.vertices.slice();
    for(let i=0;i<vertices.length;i+=6){
      const p:Vec3=[vertices[i],vertices[i+1],vertices[i+2]];
      const n:Vec3=[vertices[i+3],vertices[i+4],vertices[i+5]];
      const lower=p[1]<-.35;
      const normal=normalize([n[0],n[1]+(lower?.18*n[0]+.24*n[2]/1.32:0),n[2]/1.32]);
      vertices.set(anatomyPoint(p),i);vertices.set(normal,i+3);
    }
    return {...mesh,vertices};
  });
}
