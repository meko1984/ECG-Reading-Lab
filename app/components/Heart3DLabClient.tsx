'use client';

import { useEffect, useRef, useState } from 'react';
import { ARTERIES, HEART_PARTS, INITIAL_CAMERA, LEAD_VIEWS, layoutLeadLabels, project, type Camera, type Vec3 } from '@/app/domain/heart3d';
import { createHeartRenderer } from './heart3d-renderer';
import { clampZoom, createHeartGesture } from '@/app/domain/heart3d-gesture';
import styles from './Heart3DLabClient.module.css';

const VIEWS = [
  {name:'正面',yaw:0,pitch:0},{name:'左側',yaw:-Math.PI/2,pitch:0},{name:'右側',yaw:Math.PI/2,pitch:0},
  {name:'背面',yaw:Math.PI,pitch:0},{name:'上から',yaw:0,pitch:Math.PI/2},{name:'下から',yaw:0,pitch:-Math.PI/2},
];
function colorValue(element: HTMLElement,name:string): Vec3 {
  const hex=getComputedStyle(element).getPropertyValue(name).trim();
  return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255) as Vec3;
}
export function Heart3DLabClient() {
  const [selected,setSelected]=useState<string|null>(null);
  const [camera,setCamera]=useState<Camera>(INITIAL_CAMERA);
  const [size,setSize]=useState({width:400,height:450});
  const [anatomy,setAnatomy]=useState(true);
  const [error,setError]=useState('');
  const [ready,setReady]=useState(false);
  const [contextVersion,setContextVersion]=useState(0);
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const stageRef=useRef<HTMLDivElement>(null);
  const rendererRef=useRef<ReturnType<typeof createHeartRenderer>|null>(null);
  const gesture=useRef(createHeartGesture());
  const lead=LEAD_VIEWS.find(l=>l.id===selected);
  useEffect(()=>{
    const canvas=canvasRef.current!,stage=stageRef.current!;
    let renderer: ReturnType<typeof createHeartRenderer>|null=null;
    try { renderer=createHeartRenderer(canvas,{right:colorValue(stage,'--anatomy-right-fill'),left:colorValue(stage,'--anatomy-left-fill'),coronary:colorValue(stage,'--heart-coronary')});rendererRef.current=renderer; }
    catch(e){queueMicrotask(()=>setError(e instanceof Error?e.message:'3D表示を開始できなかったよ。'));}
    const observer=new ResizeObserver(()=>setSize({width:stage.clientWidth,height:stage.clientHeight}));observer.observe(stage);
    const wheel=(event:WheelEvent)=>{event.preventDefault();setCamera(c=>({...c,zoom:clampZoom(c.zoom*Math.exp(-event.deltaY*.001))}));};
    const lost=(event:Event)=>{event.preventDefault();setReady(false);setError('3D表示が中断されたよ。復旧を待つか、このページを開き直してね。');};
    const restored=()=>{setError('');setContextVersion(v=>v+1);};
    canvas.addEventListener('webglcontextlost',lost);canvas.addEventListener('webglcontextrestored',restored);stage.addEventListener('wheel',wheel,{passive:false});
    return()=>{observer.disconnect();stage.removeEventListener('wheel',wheel);canvas.removeEventListener('webglcontextlost',lost);canvas.removeEventListener('webglcontextrestored',restored);renderer?.dispose();rendererRef.current=null;};
  },[contextVersion]);
  useEffect(()=>{
    const frame=requestAnimationFrame(()=>{if(rendererRef.current){rendererRef.current.render(camera,lead);setReady(true);}});
    return()=>cancelAnimationFrame(frame);
  },[camera,lead,size,contextVersion]);
  const choose=(id:string)=>setSelected(previous=>previous===id?null:id);
  const reset=()=>{setSelected(null);setCamera({...INITIAL_CAMERA});};
  const labels=layoutLeadLabels(camera,size.width,size.height);
  return <div className={styles.lab}>
    <header className={styles.header}><p className="eyebrow">回して、誘導の視点をたどる</p><h1>心臓３Dモデル</h1><p>心臓を動かして、誘導のマークを選ぼう。光が観察方向の目安を示すよ。</p></header>
    <section className={styles.viewer} aria-label="心臓と12誘導の立体模型">
      <div className={styles.stage} ref={stageRef} data-ready={ready} data-selected={selected||'none'} data-yaw={camera.yaw.toFixed(3)} data-pitch={camera.pitch.toFixed(3)} data-zoom={camera.zoom.toFixed(3)}
        onPointerDown={event=>{
          gesture.current.down(event.pointerId,{x:event.clientX,y:event.clientY});
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={event=>{
          const update=gesture.current.move(event.pointerId,{x:event.clientX,y:event.clientY});if(update)setCamera(update);
        }}
        onPointerUp={event=>{
          if(gesture.current.up(event.pointerId)){
            const element=document.elementFromPoint(event.clientX,event.clientY)?.closest<HTMLButtonElement>('[data-lead]');
            if(element?.dataset.lead)choose(element.dataset.lead);
          }
        }}
        onPointerCancel={event=>gesture.current.cancel(event.pointerId)}
        onLostPointerCapture={event=>gesture.current.cancel(event.pointerId)}>
        <canvas ref={canvasRef} className={styles.canvas} role="img" aria-label="左右の心房・心室、冠動脈と12誘導。ドラッグで一緒に回転。下のボタンでも方向と誘導を選べる。" />
        <svg className={styles.stems} width={size.width} height={size.height} aria-hidden="true">
          {ready&&labels.map(p=><g key={p.lead.id} opacity={p.lead.id===selected?.65:p.depth<-.3?.13:.25}><line x1={p.anchorX} y1={p.anchorY} x2={p.x} y2={p.y}/><circle cx={p.anchorX} cy={p.anchorY} r={p.lead.id===selected?2:1.4}/></g>)}
        </svg>
        {ready&&!error&&labels.map(p=><button key={p.lead.id} data-lead={p.lead.id} className={`${styles.marker} ${p.lead.id===selected?styles.active:''} ${p.depth<-.3?styles.rear:''}`} style={{left:p.x,top:p.y,zIndex:Math.round(p.depth*10)+50}} aria-label={`${p.lead.label}誘導の観察方向`} aria-pressed={p.lead.id===selected} onClick={event=>{if(event.detail===0)choose(p.lead.id);}}><span>{p.lead.label}</span></button>)}
        {ready&&anatomy&&!error&&HEART_PARTS.map(part=>{const p=project(part.anchor,camera,size.width,size.height);return <span key={part.name} className={styles.anatomyLabel} style={{left:p.x,top:p.y,opacity:p.depth<-.3?.55:1}}>{part.name}</span>;})}
        {error&&<div className={styles.error} role="alert">{error}</div>}
        {!ready&&!error&&<div className={styles.loading}>3D模型を準備中…</div>}
        <span className={styles.stageCaption}>指1本で回転 · 2本で拡大</span>
      </div>
      <p className={styles.viewHint}>視点を変える · 左右は患者基準</p>
      <div className={styles.controls} aria-label="模型の視点">
        {VIEWS.map(v=><button key={v.name} type="button" onClick={()=>setCamera(c=>({...c,yaw:v.yaw,pitch:v.pitch}))}>{v.name}</button>)}
        <button type="button" aria-label="縮小" onClick={()=>setCamera(c=>({...c,zoom:Math.max(.7,c.zoom-.15)}))}>−</button>
        <button type="button" aria-label="拡大" onClick={()=>setCamera(c=>({...c,zoom:Math.min(1.65,c.zoom+.15)}))}>＋</button>
        <button type="button" onClick={reset}>全体に戻す</button>
      </div>
      <div className={styles.legend}><span><i className={styles.rightKey}/>右心系</span><span><i className={styles.leftKey}/>左心系</span><span><i className={styles.arteryKey}/>冠動脈</span><label><input type="checkbox" checked={anatomy} onChange={e=>setAnatomy(e.target.checked)}/>部屋の名前</label></div>
    </section>
    <section className={styles.selection} aria-label="誘導を選ぶ">
      {['四肢誘導','胸部誘導'].map((group,index)=><div key={group}><h2>{group}<span>{index===0?'前額面の6方向':'前胸部から左側へ'}</span></h2><div className={styles.leads}>{LEAD_VIEWS.slice(index*6,index*6+6).map(l=><button type="button" key={l.id} className={selected===l.id?styles.chosen:''} aria-pressed={selected===l.id} onClick={()=>choose(l.id)}>{l.label}</button>)}</div></div>)}
    </section>
    <section className={styles.description} aria-live="polite" aria-atomic="true">
      <p className={styles.kicker}>{lead?`${lead.label} 誘導 · 観察方向`:'LIGHT ON · 誘導を選ぼう'}</p>
      <h2>{lead?.region||'どの方向から心臓を見る？'}</h2>
      <p>{lead?.description||'12個のマークのどれかを選ぶと、観察方向と代表領域が光るよ。選んだまま回すと、心臓と誘導の位置関係を別の角度から確かめられる。'}</p>
      {lead&&<button type="button" onClick={()=>setSelected(null)}>光を消す</button>}
    </section>
    <p className={styles.note}>光は電気活動を見る方向と、関連づけて学ぶ代表領域の目安。電極から光や電気を送る仕組みではなく、その場所だけを記録するわけでもない。四肢誘導のマークは電極を貼る位置ではなく、誘導の軸の向きを示しているよ。</p>
    <details className={styles.details}><summary>模型の見方・冠動脈について</summary>
      <p>右房・右室を青、左房・左室をピンク、冠動脈を金色で示した立体模式図。左房は後方にあるので、背面へ回して見てみよう。部屋の名前は位置の目安として重ねて表示しているよ。</p>
      <p>冠動脈は大動脈の根元から分かれ、心臓の表面を走る。前面の左前下行枝、左側から後面へ回る左回旋枝、右側を回る右冠動脈と後下行枝を示している。後下行枝が右冠動脈から分かれる代表例で、実際の走行には個人差がある。</p>
      <p>表示する主な枝：{[...new Set(ARTERIES.map(a=>a.name))].join('・')}。</p>
      <p>模型を回しても、心臓に対する各誘導の向きは変わらない。光と領域の対応は学習用の簡略化で、冠動脈の支配域や病変部位を判定するものではない。1つの誘導だけで部位や病気を決めず、実際の判読では12誘導全体と臨床情報を合わせて考える。</p>
      <p>参考：<a href="https://www.ncbi.nlm.nih.gov/books/NBK594493/" target="_blank" rel="noreferrer">Open RN：心電図の誘導</a>／<a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8200569/" target="_blank" rel="noreferrer">冠動脈の解剖</a></p>
    </details>
    <p className={styles.note}>学習用・非診断用。心臓の形、大きさ、配置は方向関係を理解するために簡略化しているよ。</p>
  </div>;
}
