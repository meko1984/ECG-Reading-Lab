'use client';

import { useEffect, useRef, useState } from 'react';
import { project, ventricularSurface, type Camera, type Vec3 } from '@/app/domain/heart3d';
import { clampZoom, createHeartGesture } from '@/app/domain/heart3d-gesture';
import { CORONARY_LABELS, MI_3D } from '@/app/domain/mi3d';
import { miTerritory, type MITerritoryId } from '@/app/domain/mi';
import { createHeartRenderer } from './heart3d-renderer';
import { MIHeartDiagram } from './MIHeartDiagram';
import styles from './MIHeart3D.module.css';

const views = [
  {name:'正面',yaw:0,pitch:0}, {name:'患者の左側',yaw:-Math.PI/2,pitch:0},
  {name:'背面',yaw:Math.PI,pitch:0}, {name:'下から',yaw:0,pitch:-Math.PI/2},
];

export function MIHeart3D({activeId}:{activeId:MITerritoryId}) {
  const region=MI_3D[activeId], territory=miTerritory(activeId);
  const [camera,setCamera]=useState<Camera>(region.camera);
  const [size,setSize]=useState({width:600,height:480});
  const [ready,setReady]=useState(false),[error,setError]=useState('');
  const [version,setVersion]=useState(0),[labels,setLabels]=useState(true);
  const canvas=useRef<HTMLCanvasElement>(null),stage=useRef<HTMLDivElement>(null);
  const renderer=useRef<ReturnType<typeof createHeartRenderer>|null>(null);
  const gesture=useRef(createHeartGesture());
  useEffect(()=>{
    const element=canvas.current!,host=stage.current!;
    let instance:ReturnType<typeof createHeartRenderer>|null=null;
    try { instance=createHeartRenderer(element,{right:[.48,.73,.82],left:[.87,.59,.62],coronary:[.8,.38,.24]});renderer.current=instance; }
    catch { queueMicrotask(()=>setError('この環境では3Dを表示できないため、下に模式図を表示しているよ。')); }
    const resize=new ResizeObserver(()=>setSize({width:host.clientWidth,height:host.clientHeight}));resize.observe(host);
    const lost=(event:Event)=>{event.preventDefault();setReady(false);setError('3D表示が中断されたため、模式図を表示しているよ。');};
    const restored=()=>{setError('');setVersion(v=>v+1);};
    element.addEventListener('webglcontextlost',lost);element.addEventListener('webglcontextrestored',restored);
    return()=>{resize.disconnect();element.removeEventListener('webglcontextlost',lost);element.removeEventListener('webglcontextrestored',restored);instance?.dispose();renderer.current=null;};
  },[version]);
  useEffect(()=>{
    const frame=requestAnimationFrame(()=>{
      if(!renderer.current)return;
      const color=[1,3,5].map(i=>parseInt(territory.color.slice(i,i+2),16)/255) as Vec3;
      renderer.current.render(camera,undefined,{...region,color,cutaway:activeId==='septal'});setReady(true);
    });
    return()=>cancelAnimationFrame(frame);
  },[camera,size,region,activeId,territory.color,version]);
  const markers=CORONARY_LABELS.map((label,index)=>{
    const anchor=ventricularSurface(label.anchor,.04);
    const point=project(anchor,camera,size.width,size.height);
    return {...label,anchor,point,x:label.short==='LAD'||label.short==='LCx'?size.width-45:45,y:65+Math.floor(index/2)*105};
  }).filter(label=>activeId!=='septal'||label.anchor[0]>=.12);
  return <div className={styles.viewer}>
    <div className={styles.topline}><strong>回して分かる心臓3D</strong><span>{activeId==='septal'?'中隔の模式断面':'冠動脈と心筋領域'}</span></div>
    <div ref={stage} className={styles.stage} data-ready={ready} data-territory={activeId} data-yaw={camera.yaw.toFixed(3)} data-pitch={camera.pitch.toFixed(3)} data-zoom={camera.zoom.toFixed(2)}
      onPointerDown={e=>{gesture.current.down(e.pointerId,{x:e.clientX,y:e.clientY});e.currentTarget.setPointerCapture(e.pointerId);}}
      onPointerMove={e=>{const update=gesture.current.move(e.pointerId,{x:e.clientX,y:e.clientY});if(update)setCamera(update);}}
      onPointerUp={e=>gesture.current.up(e.pointerId)} onPointerCancel={e=>gesture.current.cancel(e.pointerId)} onLostPointerCapture={e=>gesture.current.cancel(e.pointerId)}>
      <canvas ref={canvas} role="img" aria-label={`${territory.title}の3D心臓。ドラッグで回転。視点ボタンでも操作できる。`} />
      {ready&&!error&&labels&&<svg className={styles.annotations} width={size.width} height={size.height} aria-hidden="true">
        {markers.map(m=><g key={m.short} opacity={m.point.depth<-.25?.45:1}>
          <line x1={m.point.x} y1={m.point.y} x2={m.x} y2={m.y} stroke={region.arteries.includes(m.name)?'#d94726':'#6e7e90'} strokeDasharray={m.point.depth<-.25?'4 4':undefined}/>
          <circle cx={m.point.x} cy={m.point.y} r="3" fill="#d94726"/>
          <rect x={m.x-27} y={m.y-14} width="54" height="28" rx="8" fill="white" stroke="#d4dee7"/>
          <text x={m.x} y={m.y+5} textAnchor="middle" fill="#23354b" fontSize="14" fontWeight="700">{m.short}</text>
        </g>)}
      </svg>}
      {!ready&&!error&&<p className={styles.loading}>心臓の立体模型を準備中…</p>}
      {error&&<p className={styles.loading} role="status">{error}</p>}
      <span className={styles.caption}>ドラッグで回転 · 2本指で拡大縮小</span>
    </div>
    <div className={styles.controls} aria-label="心筋梗塞3Dの視点">
      <button type="button" onClick={()=>setCamera({...region.camera})}>選択部位を見る</button>
      {views.map(v=><button type="button" key={v.name} onClick={()=>setCamera(c=>({...c,yaw:v.yaw,pitch:v.pitch}))}>{v.name}</button>)}
      <button type="button" aria-label="3Dを縮小" onClick={()=>setCamera(c=>({...c,zoom:clampZoom(c.zoom-.15)}))}>−</button>
      <button type="button" aria-label="3Dを拡大" onClick={()=>setCamera(c=>({...c,zoom:clampZoom(c.zoom+.15)}))}>＋</button>
      <label><input type="checkbox" checked={labels} onChange={e=>setLabels(e.target.checked)}/>血管名</label>
    </div>
    <p className={styles.hint}>{region.hint}</p>
    <div className={styles.legend}><span><i style={{background:territory.color}}/>選択領域</span><span><i style={{background:'#f34e29'}}/>責任血管の代表例</span><span>淡い青＝右心系 · 淡い桃＝左心系</span></div>
    <div className={styles.vessels}>{CORONARY_LABELS.map(m=><span key={m.short} data-active={region.arteries.includes(m.name)}><b>{m.short}</b>{m.name.replace(/（.*）/,'')}</span>)}</div>
    <p className={styles.note}>左右は患者基準。薄いラベルと破線は奥側の血管。色の境界は学習用の目安で、正確な灌流域を表すものではない。</p>
    <details open={error?true:undefined}><summary>参考画像に合わせた2D模式図を見る</summary><MIHeartDiagram activeId={activeId} color={territory.color}/></details>
  </div>;
}
