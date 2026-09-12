'use client';
import { useEffect, useRef, useState } from 'react';
import { HEART_PARTS, INITIAL_CAMERA, LEAD_VIEWS, project, ventricularSurface, type Camera, type Vec3 } from '@/app/domain/heart3d';
import { createHeartGesture, clampZoom } from '@/app/domain/heart3d-gesture';
import { CORONARY_LABELS, MI_3D } from '@/app/domain/mi3d';
import type { mirrorSelection } from '@/app/domain/mirror';
import { createHeartRenderer, type HeartRegion } from './heart3d-renderer';
import styles from './MIHeart3D.module.css';

const GREAT_VESSELS: {name:string;short:string;anchor:Vec3}[] = [
  {name:'大動脈',short:'大動脈',anchor:[.12,1.48,.02]},
  {name:'肺動脈幹',short:'肺動脈幹',anchor:[-.29,.95,.47]},
  {name:'上大静脈',short:'上大静脈',anchor:[-.95,1.25,-.04]},
  {name:'下大静脈',short:'下大静脈',anchor:[-.97,-.06,-.13]},
  {name:'肺静脈',short:'肺静脈',anchor:[.55,.95,-.85]},
];

const SELECTED_COLOR:Vec3=[.075,.46,.82];
const MIRROR_COLOR:Vec3=[1,.55,.08];
// These surface patches indicate viewing sides, not two infarct territories.
const OPPOSITE_SURFACES={
  inferior:{target:[.82,.15,-.02] as Vec3,extent:[.43,.55,.62] as Vec3,label:'側壁側'},
  posterior:{target:[-.02,-.24,.68] as Vec3,extent:[.8,.72,.46] as Vec3,label:'前胸部側'},
};

export function MirrorHeart3D({selection}:{selection:ReturnType<typeof mirrorSelection>}) {
  const region=selection.scenario ? MI_3D[selection.scenario.id] : undefined;
  const pairCamera:Camera=selection.scenario?.id==='inferior'?{yaw:-1.15,pitch:-1.05,zoom:1.4}:{yaw:-Math.PI/2,pitch:.05,zoom:1.4};
  const [camera,setCamera]=useState<Camera>(region?pairCamera:INITIAL_CAMERA);
  const [size,setSize]=useState({width:600,height:480});
  const [ready,setReady]=useState(false),[error,setError]=useState('');
  const [labels,setLabels]=useState<'chambers'|'arteries'|'vessels'>('arteries');
  const [version,setVersion]=useState(0);
  const canvas=useRef<HTMLCanvasElement>(null),stage=useRef<HTMLDivElement>(null);
  const renderer=useRef<ReturnType<typeof createHeartRenderer>|null>(null);
  const gesture=useRef(createHeartGesture());
  useEffect(()=>{
    const element=canvas.current!,host=stage.current!;
    let instance:ReturnType<typeof createHeartRenderer>|undefined;
    try {instance=createHeartRenderer(element,{right:[.72,.75,.78],left:[.8,.74,.73],coronary:[.83,.51,.20]});renderer.current=instance;}
    catch {queueMicrotask(()=>setError('3D描画を開始できなかった。WebGL対応のブラウザで開いてね。'));}
    const resize=new ResizeObserver(()=>setSize({width:host.clientWidth,height:host.clientHeight}));resize.observe(host);
    const lost=(event:Event)=>{event.preventDefault();setReady(false);setError('3D表示が中断された。復旧を待っているよ。');};
    const restored=()=>{setError('');setVersion(v=>v+1);};
    element.addEventListener('webglcontextlost',lost);element.addEventListener('webglcontextrestored',restored);
    return()=>{resize.disconnect();element.removeEventListener('webglcontextlost',lost);element.removeEventListener('webglcontextrestored',restored);instance?.dispose();renderer.current=null;};
  },[version]);
  useEffect(()=>{
    const frame=requestAnimationFrame(()=>{
      if(!renderer.current)return;
      if(region&&selection.scenario){
        const direct:HeartRegion={...region,extent:region.extent.map(v=>v*1.2) as Vec3,arteries:[],color:selection.side==='direct'?SELECTED_COLOR:MIRROR_COLOR};
        const opposite:HeartRegion={...OPPOSITE_SURFACES[selection.scenario.id],arteries:[],color:selection.side==='opposite'?SELECTED_COLOR:MIRROR_COLOR};
        renderer.current.render(camera,undefined,direct,opposite);
      }else{
        const lead=LEAD_VIEWS.find(l=>l.label===selection.lead);
        renderer.current.render(camera,undefined,lead?{target:lead.target,extent:[lead.radius,lead.radius,lead.radius],color:SELECTED_COLOR,arteries:[]}:undefined);
      }
      setReady(true);
    });
    return()=>cancelAnimationFrame(frame);
  },[camera,size,region,version,selection.lead,selection.side,selection.scenario]);
  const annotations=labels==='chambers'
    ? HEART_PARTS.map(part=>({name:part.name,short:part.name,anchor:part.anchor}))
    : labels==='vessels' ? GREAT_VESSELS : CORONARY_LABELS.map(part=>({...part,anchor:ventricularSurface(part.anchor,.04)}));
  const arteryNames:Record<string,string>={LMT:'左主幹部',LAD:'左前下行枝',LCx:'左回旋枝',RCA:'右冠動脈',PDA:'後下行枝'};
  const markers=annotations.map((part,index)=>({...part,point:project(part.anchor,camera,size.width,size.height),x:index%2===0?52:size.width-52,y:100+Math.floor(index/2)*105}));
  const territoryPoint=region?project(ventricularSurface(region.target,.045),camera,size.width,size.height):undefined;
  return <div className={styles.viewer}>
    <div className={styles.topline}><strong>{selection.scenario ? `${selection.scenario.shortLabel}側 ↔ ${OPPOSITE_SURFACES[selection.scenario.id].label}` : '選択した誘導側'}</strong></div>
    <div ref={stage} className={styles.stage} data-ready={ready} data-territory={selection.scenario?.id || 'none'} data-selected-surface={selection.side || selection.lead} data-yaw={camera.yaw.toFixed(3)} data-pitch={camera.pitch.toFixed(3)} data-zoom={camera.zoom.toFixed(2)}
      onPointerDown={e=>{gesture.current.down(e.pointerId,{x:e.clientX,y:e.clientY});e.currentTarget.setPointerCapture(e.pointerId);}}
      onPointerMove={e=>{const update=gesture.current.move(e.pointerId,{x:e.clientX,y:e.clientY});if(update)setCamera(update);}}
      onPointerUp={e=>gesture.current.up(e.pointerId)} onPointerCancel={e=>gesture.current.cancel(e.pointerId)} onLostPointerCapture={e=>gesture.current.cancel(e.pointerId)}>
      <canvas ref={canvas} role="img" aria-label={`3D心臓の表面。${selection.lead}側を青で表示。${selection.reciprocal.length?selection.reciprocal.join('・')+'側を橙で表示。':'鏡像側の割り当てなし。'}ドラッグで回転。`} />
      {ready&&!error&&<svg className={styles.annotations} width={size.width} height={size.height} aria-hidden="true">
        <g data-lead-highlight="selected"><rect x="10" y="12" width={(size.width-30)/2} height="46" rx="10" fill="#1375d1"/><text x={(size.width-30)/4+10} y="31" textAnchor="middle" fill="white" fontSize="12">選択中</text><text x={(size.width-30)/4+10} y="49" textAnchor="middle" fill="white" fontWeight="700" fontSize="17">{selection.lead}</text></g>
        <g data-lead-highlight="reciprocal"><rect x={(size.width+10)/2} y="12" width={(size.width-30)/2} height="46" rx="10" fill="#fff0d6" stroke="#ad6400" strokeWidth="2"/><text x={size.width*3/4-2.5} y="31" textAnchor="middle" fill="#774400" fontSize="12">鏡像側</text><text x={size.width*3/4-2.5} y="49" textAnchor="middle" fill="#774400" fontWeight="700" fontSize="17">{selection.reciprocal.join('・') || '―'}</text></g>
        {markers.map(m=><g key={m.name}><line x1={m.point.x} y1={m.point.y} x2={m.x} y2={m.y} stroke="#66778b" strokeDasharray={m.point.depth<-.25?'4 4':undefined}/><circle cx={m.point.x} cy={m.point.y} r="3" fill="#5b6573"/><rect x={m.x-46} y={m.y-23} width="92" height="46" rx="8" fill="white" stroke="#cad6df"/><text x={m.x} y={m.y+(labels==='arteries'?-4:5)} textAnchor="middle" fill="#23354b" fontSize="14" fontWeight="700">{labels==='arteries'?arteryNames[m.short]:m.short}</text>{labels==='arteries'&&<text x={m.x} y={m.y+14} textAnchor="middle" fill="#53687b" fontSize="12">{m.short}</text>}</g>)}
        {territoryPoint&&<g><line x1={territoryPoint.x} y1={territoryPoint.y} x2={size.width/2} y2={size.height-60} stroke={selection.side==='direct'?'#1375d1':'#a05a00'}/><rect x={size.width/2-45} y={size.height-76} width="90" height="30" rx="8" fill={selection.side==='direct'?'#dceeff':'#fff0cc'} stroke={selection.side==='direct'?'#1375d1':'#a05a00'}/><text x={size.width/2} y={size.height-56} textAnchor="middle" fill="#23354b" fontSize="14" fontWeight="700">左室{selection.scenario?.shortLabel}</text></g>}
      </svg>}
      {(!ready||error)&&<p className={styles.loading} role="status">{error||'心臓の立体模型を準備中…'}</p>}
      <span className={styles.caption}>ドラッグで回転 · 2本指で拡大縮小</span>
    </div>
    <div className={styles.controls} aria-label="心臓3Dの操作">
      <button type="button" onClick={()=>setCamera(region?pairCamera:INITIAL_CAMERA)}>両側を見る</button>
      {([{name:'正面',yaw:0,pitch:0},{name:'患者の左側',yaw:-Math.PI/2,pitch:0},{name:'背面',yaw:Math.PI,pitch:0},{name:'下から',yaw:0,pitch:-Math.PI/2}]).map(v=><button key={v.name} type="button" onClick={()=>setCamera(c=>({...c,yaw:v.yaw,pitch:v.pitch}))}>{v.name}</button>)}
      <button type="button" aria-label="3Dを縮小" onClick={()=>setCamera(c=>({...c,zoom:clampZoom(c.zoom-.15)}))}>−</button><button type="button" aria-label="3Dを拡大" onClick={()=>setCamera(c=>({...c,zoom:clampZoom(c.zoom+.15)}))}>＋</button>
      <button type="button" aria-pressed={labels==='chambers'} onClick={()=>setLabels('chambers')}>心房・心室名</button><button type="button" aria-pressed={labels==='arteries'} onClick={()=>setLabels('arteries')}>冠動脈名</button>
      <button type="button" aria-pressed={labels==='vessels'} onClick={()=>setLabels('vessels')}>大血管名</button>
    </div>
    <p className={styles.note}>破線＝奥側 · 金色の管＝冠動脈</p>
  </div>;
}
