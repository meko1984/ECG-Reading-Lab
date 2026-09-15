import { HEART_PARTS, chamberDistance, heartDistance, type Vec3 } from './heart3d.ts';

export type VesselPath = { name:string; points:Vec3[]; radius:number; kind:'artery'|'venous'|'coronary'|'sinus' };
// Unscaled patient coordinates (+X left, +Y superior, +Z anterior).
// Sources: UMN cardiac atlas (pulmonary artery); NBK534804 (PV directions);
// PMC8200569 (coronary courses); PMC4195839 (posterior AV groove/CS).
const bifurcation:Vec3=[.48,1.4,-.32];
const upperRightBranch:Vec3=[-1.18,1.35,-.48];
export const GREAT_VESSELS:VesselPath[]=[
  {name:'大動脈',kind:'artery',radius:.18,points:[[0,.48,.08],[0,.83,.12],[0,1.3,.1],[.12,1.75,.02],[.43,1.98,-.22],[.77,1.89,-.57],[.86,1.57,-.85],[.87,1.05,-1.05]]},
  {name:'肺動脈幹',kind:'venous',radius:.17,points:[[-.35,.26,.48],[-.16,.62,.63],[.22,.98,.52],[.45,1.24,.17],bifurcation]},
  {name:'右肺動脈',kind:'venous',radius:.12,points:[bifurcation,[.17,1.4,-.46],[-.25,1.38,-.5],[-.7,1.36,-.5],upperRightBranch,[-1.52,1.22,-.51]]},
  {name:'右上肺動脈',kind:'venous',radius:.075,points:[upperRightBranch,[-1.39,1.53,-.36],[-1.58,1.7,-.21]]},
  {name:'左肺動脈',kind:'venous',radius:.12,points:[bifurcation,[.81,1.39,-.4],[1.13,1.36,-.42],[1.52,1.3,-.45]]},
  // Separate posterior LA entries; superior veins turn forward/up, inferior backward/down.
  {name:'右上肺静脈',kind:'artery',radius:.105,points:[[.02,.91,-.69],[-.42,1,-.82],[-.94,1.07,-.72],[-1.4,1.18,-.57]]},
  {name:'右下肺静脈',kind:'artery',radius:.105,points:[[.03,.56,-.75],[-.39,.47,-.88],[-.94,.34,-1.04],[-1.4,.2,-1.16]]},
  {name:'左上肺静脈',kind:'artery',radius:.105,points:[[.52,.92,-.69],[.83,1,-.77],[1.14,1.09,-.64],[1.47,1.18,-.53]]},
  {name:'左下肺静脈',kind:'artery',radius:.105,points:[[.55,.55,-.72],[.88,.44,-.84],[1.17,.31,-.99],[1.48,.18,-1.13]]},
];

// Locate the outer surface, then locate the chamber boundary ON that surface.
// This aligns the coronary guide to the schematic chamber junction rather than
// projecting an arbitrary path radially onto whichever chamber is outermost.
function exterior(y:number,angle:number):Vec3 {
  const centerX=y<-.5?.35-(y+.3)*Math.tan(.34):0;
  const at=(r:number):Vec3=>[centerX+r*Math.cos(angle),y,-.1+r*Math.sin(angle)];
  let last=0;
  for(let r=.02;r<1.65;r+=.025)if(heartDistance(at(r))<=0)last=r;
  let lo=last,hi=last+.025;
  for(let i=0;i<10;i++){const mid=(lo+hi)/2;if(heartDistance(at(mid))<=0)lo=mid;else hi=mid;}
  return at(hi+.018);
}
export function avJunction(angle:number):Vec3 {
  let best:Vec3=[0,0,0],score=Infinity;
  const expected=.34+.14*Math.sin(angle);
  for(let y=.15;y<=.6;y+=.01){
    const p=exterior(y,angle);
    const ventricle=Math.min(chamberDistance(p,HEART_PARTS[0]),chamberDistance(p,HEART_PARTS[1]));
    const atrium=Math.min(chamberDistance(p,HEART_PARTS[2]),chamberDistance(p,HEART_PARTS[3]));
    const candidateScore=Math.abs(ventricle-atrium)+.35*Math.abs(y-expected);
    if(candidateScore<score){score=candidateScore;best=p;}
  }
  return best;
}
function interventricular(y:number,posterior=false):Vec3 {
  let best:Vec3=[0,0,0],score=Infinity;
  for(let i=0;i<=90;i++){
    const angle=(posterior?-1:1)*(.05+i*(Math.PI-.1)/90),p=exterior(y,angle);
    const difference=Math.abs(chamberDistance(p,HEART_PARTS[0])-chamberDistance(p,HEART_PARTS[1]));
    if(difference<score){score=difference;best=p;}
  }
  return best;
}
const lad=[...Array.from({length:11},(_,i)=>interventricular(.48-i*.12)),exterior(-.9,1.1),exterior(-1.08,1.15),exterior(-1.24,1.15)];
const lcx=Array.from({length:15},(_,i)=>avJunction(.65-i*.17));
const rca=Array.from({length:15},(_,i)=>avJunction(2.4+i*.17));
const pda=[...Array.from({length:9},(_,i)=>exterior(.15-i*.14,-1.55)),lad[lad.length-1]];
const sinus=Array.from({length:9},(_,i)=>{
  const p=avJunction(-.5-i*.2);return [p[0],p[1]+.075,p[2]-.045] as Vec3;
});
export const CORONARY_VESSELS:VesselPath[]=[
  {name:'左冠動脈主幹部',kind:'coronary',radius:.05,points:[[.13,.79,.06],[.29,.69,.04],lcx[0],lad[0]]},
  {name:'左前下行枝',kind:'coronary',radius:.043,points:lad},
  {name:'左回旋枝',kind:'coronary',radius:.04,points:lcx},
  {name:'右冠動脈',kind:'coronary',radius:.043,points:[[-.13,.79,.17],[-.3,.63,.44],...rca]},
  {name:'後下行枝',kind:'coronary',radius:.029,points:[rca[rca.length-1],...pda]},
  {name:'対角枝',kind:'coronary',radius:.025,points:[lad[4],exterior(-.2,.73),exterior(-.47,.56),exterior(-.72,.46)]},
  {name:'鈍縁枝',kind:'coronary',radius:.025,points:[lcx[5],exterior(.02,-.2),exterior(-.35,-.23),exterior(-.73,-.3)]},
  {name:'右縁枝',kind:'coronary',radius:.025,points:[rca[3],exterior(-.16,2.7),exterior(-.43,2.55),exterior(-.68,2.2)]},
  {name:'冠静脈洞',kind:'sinus',radius:.067,points:[...sinus,[-.68,.3,-.47],[-.76,.36,-.23]]},
];

export function vesselAnchor(name:string,index:number):Vec3 {
  const path=[...GREAT_VESSELS,...CORONARY_VESSELS].find(v=>v.name===name);
  if(!path||!path.points[index])throw new Error(`Missing vessel anchor: ${name}/${index}`);
  return path.points[index];
}
