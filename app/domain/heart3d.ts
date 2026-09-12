/** Patient coordinates: +X left, +Y superior, +Z anterior. Lengths are schematic. */
export type Vec3 = [number, number, number];
export type LeadView = { id: string; label: string; position: Vec3; target: Vec3; region: string; description: string; radius: number; angle?: number };
const limb = (id: string, label: string, angle: number, target: Vec3, region: string, description: string): LeadView => ({
  id, label, angle, position: [2.65 * Math.cos(angle * Math.PI / 180), -2.65 * Math.sin(angle * Math.PI / 180), 0], target, region, description, radius: .85,
});
export const LEAD_VIEWS: LeadView[] = [
  limb('I', 'Ⅰ', 0, [.83, .18, .08], '側壁', '患者の左側から見る方向。aVL・V5・V6と合わせて側壁の電気活動を考える。'),
  limb('II', 'Ⅱ', 60, [.25, -1.04, -.05], '下壁', '左下方から見る方向。Ⅲ・aVFとともに下壁に関連づけて学ぶ。'),
  limb('III', 'Ⅲ', 120, [-.2, -.95, -.18], '下壁', '右下方から見る方向。同じ下壁に関連するⅡとは観察軸が異なる。'),
  limb('aVR', 'aVR', -150, [-.3, .63, .1], '右上方からの視点', '患者の右肩側から心臓全体を見込む。特定の心筋壁を一対一に割り当てない。'),
  limb('aVL', 'aVL', -30, [.74, .48, -.1], '高位側壁', '患者の左上方から見る方向。Ⅰと合わせて高位側壁に関連づけて学ぶ。'),
  limb('aVF', 'aVF', 90, [.18, -1.12, -.22], '下壁', '足側から上へ心臓を見込む方向。Ⅱ・Ⅲとともに下壁に関連づけて学ぶ。'),
  { id: 'V1', label: 'V1', position: [-1.08, .27, 2.3], target: [-.26, -.03, .73], region: '中隔方向', description: '胸骨の右側から見る方向。V2とともに中隔に関連づける。光は内部の中隔へ向かう方向を表し、表面の右室だけを測る意味ではない。', radius: .62 },
  { id: 'V2', label: 'V2', position: [-.23, .27, 2.55], target: [-.03, -.08, .72], region: '中隔方向', description: '胸骨の左側から見る方向。中隔は左右の心室の間にある内部構造。照らした表面の奥にある方向として読む。', radius: .62 },
  { id: 'V3', label: 'V3', position: [.66, -.19, 2.48], target: [.34, -.47, .73], region: '前壁', description: 'V2とV4の間から見る方向。V4とともに前壁に関連づけて学ぶ。', radius: .73 },
  { id: 'V4', label: 'V4', position: [1.49, -.63, 2.12], target: [.62, -.77, .6], region: '前壁〜心尖部方向', description: '左前胸部から心尖部方向を見込む。心尖部だけを測定する誘導ではない。', radius: .76 },
  { id: 'V5', label: 'V5', position: [2.25, -.63, 1.36], target: [.97, -.39, .25], region: '側壁', description: '左前側胸部から見る方向。V4・V6と同じ高さに並び、左側壁に関連づけて学ぶ。', radius: .8 },
  { id: 'V6', label: 'V6', position: [2.67, -.63, .36], target: [1.02, -.3, -.12], region: '側壁', description: '左側胸部から見る方向。V5とともに左側壁に関連づけて学ぶ。', radius: .8 },
];
export const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const mul = (a: Vec3, s: number): Vec3 => [a[0] * s, a[1] * s, a[2] * s];
export const cross = (a: Vec3, b: Vec3): Vec3 => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
export const normalize = (a: Vec3): Vec3 => mul(a, 1 / (Math.hypot(...a) || 1));
export function rotate(p: Vec3, yaw: number, pitch: number): Vec3 {
  const x = p[0]*Math.cos(yaw) + p[2]*Math.sin(yaw);
  const z = -p[0]*Math.sin(yaw) + p[2]*Math.cos(yaw);
  return [x, p[1]*Math.cos(pitch)-z*Math.sin(pitch), p[1]*Math.sin(pitch)+z*Math.cos(pitch)];
}
export type Camera = { yaw: number; pitch: number; zoom: number };
export const INITIAL_CAMERA: Camera = { yaw: -.48, pitch: .32, zoom: 1 };
export function project(p: Vec3, camera: Camera, width: number, height: number) {
  const v = rotate(p, camera.yaw, camera.pitch);
  const scale = Math.min(width, height) * .15 * camera.zoom;
  const perspective = 8 / (8 - v[2]);
  return { x: width/2 + v[0]*scale*perspective, y: height/2 - v[1]*scale*perspective, depth: v[2] };
}

export function layoutLeadLabels(camera: Camera,width:number,height:number) {
  const placed: {x:number;y:number}[]=[];
  // Protect the projected silhouette, including when the model is enlarged or tilted.
  const silhouette=HEART_PARTS.flatMap(part=>Array.from({length:128},(_,i)=>{
    const phi=(i%16)*Math.PI/8,theta=Math.floor(i/16)*Math.PI/7,cy=Math.cos(theta);
    const taper=part.name.includes('室')?.88+.16*cy:1;
    const x=(part.radii[0]+.035)*Math.sin(theta)*Math.cos(phi)*taper,y=(part.radii[1]+.035)*cy;
    return project(add(part.center,[x*Math.cos(part.tilt)-y*Math.sin(part.tilt),x*Math.sin(part.tilt)+y*Math.cos(part.tilt),(part.radii[2]+.035)*Math.sin(theta)*Math.sin(phi)*taper]),camera,width,height);
  }));
  // Include the great vessels above the chambers in the label exclusion area.
  for(const x of [-1.14,.83])for(const y of [.65,1.73])for(const z of [-.91,.62])silhouette.push(project([x,y,z],camera,width,height));
  const left=Math.max(51,Math.min(...silhouette.map(p=>p.x))-22),right=Math.min(width-51,Math.max(...silhouette.map(p=>p.x))+22);
  const top=Math.min(...silhouette.map(p=>p.y))-22,bottom=Math.max(...silhouette.map(p=>p.y))+22;
  return LEAD_VIEWS.map(lead=>{
    const anchor=project(lead.position,camera,width,height);
    const start={x:Math.max(26,Math.min(width-26,anchor.x)),y:Math.max(25,Math.min(height-45,anchor.y))};
    const free=(x:number,y:number)=>x>=25&&x<=width-25&&y>=25&&y<=height-45&&placed.every(p=>Math.abs(p.x-x)>=49||Math.abs(p.y-y)>=47);
    const outsideHeart=(x:number,y:number)=>x<left||x>right||y<top||y>bottom;
    let chosen:{x:number;y:number}|undefined;
    // Nearest free screen position; the stem always ends at the true rotated 3D anchor.
    for(let r=0;r<Math.max(width,height)&&!chosen;r+=7)for(let i=0;i<32;i++){
      const angle=i*Math.PI/16,x=start.x+Math.cos(angle)*r,y=start.y+Math.sin(angle)*r;
      if(free(x,y)&&outsideHeart(x,y)){chosen={x,y};break;}
    }
    if(!chosen)for(let y=25;y<=height-45&&!chosen;y+=47)for(let x=25;x<=width-25;x+=49)if(free(x,y)){chosen={x,y};break;}
    const position=chosen||start;placed.push(position);
    return {lead,...position,anchorX:anchor.x,anchorY:anchor.y,depth:anchor.depth};
  });
}

export type HeartPart = { name: string; center: Vec3; radii: Vec3; tilt: number; kind: 'right' | 'left' | 'vessel'; anchor: Vec3 };
export const HEART_PARTS: HeartPart[] = [
  { name: '左室', center: [.35,-.3,-.1], radii: [.69,1.05,.64], tilt: .34, kind: 'left', anchor: [.82,-.57,.5] },
  { name: '右室', center: [-.32,-.12,.3], radii: [.71,.81,.54], tilt: .42, kind: 'right', anchor: [-.52,-.24,.82] },
  { name: '左房', center: [.27,.78,-.47], radii: [.59,.46,.49], tilt: -.1, kind: 'left', anchor: [.6,.93,-.7] },
  { name: '右房', center: [-.83,.6,.08], radii: [.46,.63,.48], tilt: .05, kind: 'right', anchor: [-1.06,.71,.4] },
];

// Original parametric meshes; no third-party model or texture assets.
export type Mesh = { vertices: Float32Array; color: Vec3; anatomical: boolean; rightWeights?: Float32Array };
function surface(fn: (u: number,v: number) => Vec3, nu: number, nv: number): Float32Array {
  const out: number[] = [];
  const vertex = (u: number, v: number) => {
    const p = fn(u,v), d = .0001;
    const n = normalize(cross(sub(fn(u+d,v), fn(u-d,v)), sub(fn(u,v+d),fn(u,v-d))));
    out.push(...p,...n);
  };
  for(let i=0;i<nu;i++) for(let j=0;j<nv;j++) {
    const u=i/nu,v=j/nv,a=(i+1)/nu,b=(j+1)/nv;
    vertex(u,v);vertex(a,v);vertex(a,b);vertex(u,v);vertex(a,b);vertex(u,b);
  }
  return new Float32Array(out);
}
function chamberDistance(p: Vec3, part: HeartPart): number {
  const d=sub(p,part.center),c=Math.cos(part.tilt),s=Math.sin(part.tilt);
  const x=d[0]*c+d[1]*s,y=-d[0]*s+d[1]*c;
  const taper=part.name.includes('室')?Math.max(.55,.88+.16*y/part.radii[1]):1;
  return (Math.hypot(x/(part.radii[0]*taper),y/part.radii[1],d[2]/(part.radii[2]*taper))-1)*Math.min(...part.radii);
}
export function heartDistance(p: Vec3): number {
  // Smooth union preserves each chamber's volume while rounding their shared surface.
  return HEART_PARTS.map(part=>chamberDistance(p,part)).reduce((a,b)=>{
    const k=.24,h=Math.max(0,Math.min(1,.5+.5*(b-a)/k));
    return b*(1-h)+a*h-k*h*(1-h);
  });
}
function continuousHeart(): {vertices: Float32Array;rightWeights:Float32Array} {
  const values:number[]=[],weights:number[]=[];
  const step=.047,origin:Vec3=[-1.55,-1.6,-1.12],nx=62,ny=64,nz=49;
  const index=(x:number,y:number,z:number)=>(x*(ny+1)+y)*(nz+1)+z;
  const grid=new Float32Array((nx+1)*(ny+1)*(nz+1));
  const point=(x:number,y:number,z:number):Vec3=>[origin[0]+x*step,origin[1]+y*step,origin[2]+z*step];
  for(let x=0;x<=nx;x++)for(let y=0;y<=ny;y++)for(let z=0;z<=nz;z++)grid[index(x,y,z)]=heartDistance(point(x,y,z));
  const corners:Vec3[]=[[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]];
  const tetrahedra=[[0,1,2,6],[0,2,3,6],[0,3,7,6],[0,7,4,6],[0,4,5,6],[0,5,1,6]];
  const cache=new Map<string,{p:Vec3;n:Vec3;w:number}>();
  const vertex=(p:Vec3)=>{
    const key=p.map(v=>v.toFixed(7)).join(',');let entry=cache.get(key);
    if(!entry){
      const e=.0015,n=normalize([heartDistance(add(p,[e,0,0]))-heartDistance(add(p,[-e,0,0])),heartDistance(add(p,[0,e,0]))-heartDistance(add(p,[0,-e,0])),heartDistance(add(p,[0,0,e]))-heartDistance(add(p,[0,0,-e]))]);
      const influences=HEART_PARTS.map(part=>Math.exp(-chamberDistance(p,part)/.075));
      const w=(influences[1]+influences[3])/influences.reduce((a,b)=>a+b,0);
      entry={p,n,w};cache.set(key,entry);
    }
    values.push(...entry.p,...entry.n);weights.push(entry.w);
  };
  for(let x=0;x<nx;x++)for(let y=0;y<ny;y++)for(let z=0;z<nz;z++){
    const ds=corners.map(c=>grid[index(x+c[0],y+c[1],z+c[2])]);
    if(ds.every(d=>d>=0)||ds.every(d=>d<0))continue;
    const ps=corners.map(c=>point(x+c[0],y+c[1],z+c[2]));
    const edge=(a:number,b:number)=>add(ps[a],mul(sub(ps[b],ps[a]),ds[a]/(ds[a]-ds[b])));
    for(const ids of tetrahedra){
      const inside=ids.filter(i=>ds[i]<0),outside=ids.filter(i=>ds[i]>=0);
      if(inside.length===1||outside.length===1){
        const one=inside.length===1?inside[0]:outside[0],others=inside.length===1?outside:inside;
        others.map(i=>edge(one,i)).forEach(vertex);
      }else if(inside.length===2){
        const a=edge(inside[0],outside[0]),b=edge(inside[0],outside[1]),c=edge(inside[1],outside[0]),d=edge(inside[1],outside[1]);
        [a,b,c,b,d,c].forEach(vertex);
      }
    }
  }
  return {vertices:new Float32Array(values),rightWeights:new Float32Array(weights)};
}
export type Artery = { name: string; points: Vec3[]; radius: number };
export const ARTERIES: Artery[] = [
  { name:'左冠動脈主幹部',radius:.052,points:[[.02,.95,.14],[.24,.82,.31],[.42,.64,.44]] },
  { name:'左前下行枝（LAD）',radius:.045,points:[[.42,.64,.44],[.2,.37,.76],[.12,.04,.85],[.22,-.37,.77],[.4,-.73,.61],[.65,-1.17,.21]] },
  { name:'対角枝',radius:.028,points:[[.16,.13,.83],[.51,-.04,.62],[.79,-.33,.46],[.92,-.58,.18]] },
  { name:'対角枝',radius:.023,points:[[.28,-.48,.74],[.58,-.64,.6],[.78,-.87,.34]] },
  { name:'左回旋枝（LCx）',radius:.042,points:[[.42,.64,.44],[.75,.51,.29],[.92,.42,-.08],[.81,.46,-.51],[.41,.48,-.76],[-.04,.4,-.76]] },
  { name:'鈍縁枝',radius:.027,points:[[.91,.43,-.12],[1,.08,-.21],[.99,-.35,-.29],[.84,-.79,-.27]] },
  { name:'右冠動脈（RCA）',radius:.046,points:[[-.07,.93,.2],[-.36,.72,.48],[-.71,.45,.67],[-1,.26,.53],[-1.03,.18,.1],[-.85,.12,-.39],[-.4,.1,-.72],[.05,.16,-.75]] },
  { name:'右縁枝',radius:.027,points:[[-1,.26,.53],[-.86,-.09,.7],[-.58,-.46,.72],[-.17,-.76,.58]] },
  { name:'後下行枝（PDA）',radius:.032,points:[[.05,.16,-.75],[.12,-.21,-.78],[.3,-.6,-.66],[.56,-.99,-.37],[.65,-1.17,.21]] },
];
function ventricularSurface(p: Vec3, clearance: number): Vec3 {
  // Fit a coronary centerline to the exterior of the ventricular surfaces.
  // At the base, preserve the coronary origins and atrioventricular course.
  if(p[1]>.55)return p;
  const origin:Vec3=[0,p[1],-.1], direction=normalize(sub(p,origin));
  const inside=(distance:number)=>{
    const q=add(origin,mul(direction,distance));
    return heartDistance(q)<=0;
  };
  let last=-1;
  for(let d=0;d<1.8;d+=.025)if(inside(d))last=d;
  if(last<0)return p;
  let lo=last,hi=last+.025;
  for(let i=0;i<10;i++){const m=(lo+hi)/2;if(inside(m))lo=m;else hi=m;}
  const fitted=add(origin,mul(direction,hi+clearance*.55));
  const blend=Math.min(1,(.55-p[1])/.18);
  return add(mul(p,1-blend),mul(fitted,blend));
}
export function tube(points: Vec3[], radius: number, coronary=false): Float32Array {
  const cache=new Map<number,Vec3>();
  const at = (t: number): Vec3 => {
    const key=Math.round(t*1e6),cached=cache.get(key);if(cached)return cached;
    const f=Math.max(0,Math.min(.999999,t))*(points.length-1), i=Math.floor(f), s=f-i;
    const p0=points[Math.max(0,i-1)],p1=points[i],p2=points[i+1],p3=points[Math.min(points.length-1,i+2)];
    const raw=[0,1,2].map(k => .5*((2*p1[k])+(-p0[k]+p2[k])*s+(2*p0[k]-5*p1[k]+4*p2[k]-p3[k])*s*s+(-p0[k]+3*p1[k]-3*p2[k]+p3[k])*s*s*s)) as Vec3;
    const result=coronary?ventricularSurface(raw,radius):raw;cache.set(key,result);return result;
  };
  const axes:Vec3[]=[[1,0,0],[0,1,0],[0,0,1]];
  const score=(axis:Vec3)=>Math.min(...Array.from({length:41},(_,i)=>Math.hypot(...cross(normalize(sub(at(i/40+.001),at(i/40-.001))),axis))));
  const reference=axes.reduce((best,axis)=>score(axis)>score(best)?axis:best);
  return surface((u,v) => {
    const p=at(u), tangent=normalize(sub(at(u+.001),at(u-.001)));
    const axis=normalize(cross(tangent,reference));
    const other=cross(tangent,axis), a=-v*Math.PI*2;
    return add(p,add(mul(axis,radius*Math.cos(a)),mul(other,radius*Math.sin(a))));
  },points.length*10,12);
}
export function createHeartMeshes(right: Vec3, left: Vec3, coronary: Vec3): Mesh[] {
  const meshes: Mesh[] = [{...continuousHeart(),color:left,anatomical:true}];
  // Great vessels provide orientation and connect the coronary origins to the aortic root.
  meshes.push({vertices:tube([[0,.53,.1],[0,1.1,.15],[.12,1.48,.02],[.4,1.55,-.19],[.59,1.25,-.4]],.18),color:left,anatomical:false});
  meshes.push({vertices:tube([[-.4,.42,.44],[-.29,.95,.47],[-.38,1.36,.2],[-.67,1.37,-.15]],.16),color:right,anatomical:false});
  meshes.push({vertices:tube([[-.9,.69,.01],[-.95,1.25,-.04],[-.95,1.55,-.03]],.17),color:right,anatomical:false});
  meshes.push({vertices:tube([[-.91,.41,-.01],[-.97,-.06,-.13],[-.95,-.36,-.16]],.15),color:right,anatomical:false});
  for(const side of [-1,1]) for(const dy of [0,.25]) meshes.push({vertices:tube([[.25,.69+dy,-.59],[.55*side,.7+dy,-.85],[.86*side,.74+dy,-.93]],.09),color:left,anatomical:false});
  ARTERIES.forEach(a=>meshes.push({vertices:tube(a.points,a.radius,true),color:coronary,anatomical:false}));
  return meshes;
}
