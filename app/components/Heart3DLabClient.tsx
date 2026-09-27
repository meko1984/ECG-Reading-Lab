'use client';

import { useEffect, useRef, useState } from 'react';
import { HEART_PARTS, INITIAL_CAMERA, LEAD_VIEWS, project, type Camera, type Vec3 } from '@/app/domain/heart3d';
import { ANATOMY_ITEMS, anatomyPoint, isNearSide } from '@/app/domain/heart3d-anatomy';
import { createHeartRenderer } from './heart3d-renderer';
import { clampZoom, createHeartGesture } from '@/app/domain/heart3d-gesture';
import styles from './Heart3DLabClient.module.css';
import { LabDisclaimer } from './LabDisclaimer';

function colorValue(element: HTMLElement,name:string): Vec3 {
  const hex=getComputedStyle(element).getPropertyValue(name).trim();
  return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255) as Vec3;
}
export function Heart3DLabClient() {
  const [selected,setSelected]=useState<string|null>(null);
  const [camera,setCamera]=useState<Camera>({...INITIAL_CAMERA,zoom:1.24});
  const [size,setSize]=useState({width:400,height:450});
  const [anatomy,setAnatomy]=useState(true);
  const [opacity,setOpacity]=useState(.3);
  const [labelGroup,setLabelGroup]=useState('表面');
  const [labelLanguage,setLabelLanguage]=useState<'ja'|'en'>('ja');
  const [error,setError]=useState('');
  const [ready,setReady]=useState(false);
  const [contextVersion,setContextVersion]=useState(0);
  const canvasRef=useRef<HTMLCanvasElement>(null);
  const stageRef=useRef<HTMLDivElement>(null);
  const rendererRef=useRef<ReturnType<typeof createHeartRenderer>|null>(null);
  const gesture=useRef(createHeartGesture(3));
  const lead=LEAD_VIEWS.find(l=>l.id===selected);
  useEffect(()=>{
    const canvas=canvasRef.current!,stage=stageRef.current!;
    let renderer: ReturnType<typeof createHeartRenderer>|null=null;
    try { renderer=createHeartRenderer(canvas,{right:colorValue(stage,'--anatomy-right-fill'),left:colorValue(stage,'--anatomy-left-fill'),coronary:colorValue(stage,'--heart-coronary')},true);rendererRef.current=renderer; }
    catch(e){queueMicrotask(()=>setError(e instanceof Error?e.message:'3D表示を開始できなかったよ。'));}
    const observer=new ResizeObserver(()=>setSize({width:stage.clientWidth,height:stage.clientHeight}));observer.observe(stage);
    const wheel=(event:WheelEvent)=>{event.preventDefault();setCamera(c=>({...c,zoom:clampZoom(c.zoom*Math.exp(-event.deltaY*.001),3)}));};
    const lost=(event:Event)=>{event.preventDefault();setReady(false);setError('3D表示が中断されたよ。復旧を待つか、このページを開き直してね。');};
    const restored=()=>{setError('');setContextVersion(v=>v+1);};
    canvas.addEventListener('webglcontextlost',lost);canvas.addEventListener('webglcontextrestored',restored);stage.addEventListener('wheel',wheel,{passive:false});
    return()=>{observer.disconnect();stage.removeEventListener('wheel',wheel);canvas.removeEventListener('webglcontextlost',lost);canvas.removeEventListener('webglcontextrestored',restored);renderer?.dispose();rendererRef.current=null;};
  },[contextVersion]);
  useEffect(()=>{
    const frame=requestAnimationFrame(()=>{if(rendererRef.current){rendererRef.current.render(camera,lead?{...lead,target:anatomyPoint(lead.target)}:undefined,undefined,undefined,opacity);setReady(true);}});
    return()=>cancelAnimationFrame(frame);
  },[camera,lead,size,contextVersion,opacity]);
  const choose=(id:string)=>setSelected(previous=>previous===id?null:id);
  const reset=()=>{setSelected(null);setCamera({...INITIAL_CAMERA,zoom:1.24});};
  const labels=LEAD_VIEWS.map(lead=>({...project(lead.position,camera,size.width,size.height),lead}));
  const visibleParts=HEART_PARTS.filter(part=>isNearSide(part.anchor,camera));
  const occupied:Array<{x:number;y:number;depth:number;width:number;height:number}>=labels.map(label=>({...label,width:size.width<480?20:25,height:size.width<480?20:25}));
  const visiblePartLabels=visibleParts.map(part=>{
    const anchor=project(anatomyPoint(part.anchor),camera,size.width,size.height);
    const english:Record<string,string>={'右房':'Right atrium','左房':'Left atrium','右室':'Right ventricle','左室':'Left ventricle'};
    const label=labelLanguage==='ja'?part.name:english[part.name]||part.name;
    const width=label.length*(size.width<480?7:8)+8,height=20;
    const offsets=[[0,0],[0,-24],[0,24],[-28,0],[28,0],[-24,-20],[24,-20],[-24,20],[24,20]];
    const candidates=offsets.map(([dx,dy])=>{
      const x=anchor.x+dx,y=anchor.y+dy;
      const overlap=occupied.reduce((total,p)=>total+Math.max(0,(width+p.width)/2+3-Math.abs(x-p.x))*Math.max(0,(height+p.height)/2+3-Math.abs(y-p.y)),0);
      const outside=Math.max(0,width/2+4-x)+Math.max(0,x+width/2+4-size.width)+Math.max(0,height/2+4-y)+Math.max(0,y+height/2+4-size.height);
      return {x,y,cost:overlap*100+outside*200+Math.hypot(dx,dy)};
    });
    const position=candidates.reduce((best,p)=>p.cost<best.cost?p:best);
    occupied.push({...position,width,height,depth:anchor.depth});
    return {part,label,anchor,...position};
  });
  const anatomyLabels=ANATOMY_ITEMS.filter(item=>(labelGroup==='すべて'||item.group===labelGroup)&&isNearSide(item.point,camera)).map(item=>{
    const anchor=project(anatomyPoint(item.point),camera,size.width,size.height);
    const label=labelLanguage==='ja'?item.name:item.english;
    const width=label.length*(size.width<400?7:8)+8,height=18;
    // Stay attached to the anatomy. Only a small local offset is permitted;
    // never move a label to a screen-edge column to resolve overlap.
    const offsets=[[0,-10],[0,10],[0,0],...Array.from({length:32},(_,i)=>{
      const angle=(i%16)*Math.PI/8,radius=i<16?24:36;
      return [Math.cos(angle)*radius,Math.sin(angle)*radius];
    })];
    const candidates=offsets.map(([dx,dy])=>{
      const x=anchor.x+dx,y=anchor.y+dy;
      const overlap=occupied.reduce((total,p)=>total+Math.max(0,(width+p.width)/2+3-Math.abs(x-p.x))*Math.max(0,(height+p.height)/2+2-Math.abs(y-p.y)),0);
      return {x,y,cost:overlap*100+Math.hypot(dx,dy)*2};
    });
    const position=candidates.reduce((best,p)=>p.cost<best.cost?p:best);
    occupied.push({...position,width,height,depth:anchor.depth});
    return {...item,label,anchor,...position};
  });
  return <div className={styles.lab}>
    <header className={styles.header}><p className="eyebrow">回して、誘導の視点をたどる</p><h1>心臓３Dモデル</h1><p>ドラッグで回す → 誘導を選ぶ。</p></header>
    <section className={styles.viewer} aria-label="心臓と12誘導の立体模型">
      <div className={styles.stage} ref={stageRef} data-ready={ready} data-selected={selected||'none'} data-yaw={camera.yaw.toFixed(3)} data-pitch={camera.pitch.toFixed(3)} data-zoom={camera.zoom.toFixed(3)}
        tabIndex={0} aria-label="心臓模型の操作。矢印キーで回転、プラス・マイナスで拡大縮小、Homeで元に戻す"
        onKeyDown={event=>{
          if(event.target!==event.currentTarget)return;
          const key=event.key;
          if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-','Home'].includes(key)){
            event.preventDefault();
            if(key==='Home'){reset();return;}
            setCamera(c=>({...c,yaw:c.yaw+(key==='ArrowRight'?.15:key==='ArrowLeft'?-.15:0),pitch:c.pitch+(key==='ArrowDown'?.15:key==='ArrowUp'?-.15:0),zoom:clampZoom(c.zoom+(key==='+'||key==='='?.2:key==='-'?-.2:0),3)}));
          }
        }}
        onPointerDown={event=>{
          gesture.current.down(event.pointerId,{x:event.clientX,y:event.clientY});
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={event=>{
          const update=gesture.current.move(event.pointerId,{x:event.clientX,y:event.clientY});if(update)setCamera(update);
        }}
        onPointerUp={event=>{
          if(gesture.current.up(event.pointerId)){
            const rect=event.currentTarget.getBoundingClientRect();
            const nearest=labels.map(p=>({id:p.lead.id,distance:Math.hypot(p.x-(event.clientX-rect.left),p.y-(event.clientY-rect.top))})).sort((a,b)=>a.distance-b.distance)[0];
            if(nearest&&nearest.distance<=22)choose(nearest.id);
          }
        }}
        onPointerCancel={event=>gesture.current.cancel(event.pointerId)}
        onLostPointerCapture={event=>gesture.current.cancel(event.pointerId)}>
        <canvas ref={canvasRef} className={styles.canvas} role="img" aria-label="左右の心房・心室、冠動脈と12誘導。ドラッグで回転、ピンチやホイールで拡大、図の誘導マークを選択。" />
        <svg className={styles.stems} width={size.width} height={size.height} aria-hidden="true">
          {ready&&<polyline className={styles.chestRail} points={labels.slice(6).map(p=>`${p.x},${p.y}`).join(' ')} fill="none"/>}
          {ready&&anatomy&&anatomyLabels.map(p=><g key={p.name}><line x1={p.x} y1={p.y} x2={p.anchor.x} y2={p.anchor.y} opacity=".65"/><circle cx={p.anchor.x} cy={p.anchor.y} r="1.6"/></g>)}
        </svg>
        {ready&&!error&&labels.map(p=><button key={p.lead.id} data-lead={p.lead.id} className={`${styles.marker} ${p.lead.id===selected?styles.active:''} ${p.depth<-.3?styles.rear:''}`} style={{left:p.x,top:p.y,zIndex:Math.round(p.depth*10)+50}} aria-label={`${p.lead.label}誘導の観察方向`} aria-pressed={p.lead.id===selected} onClick={event=>{if(event.detail===0)choose(p.lead.id);}}><span>{p.lead.label}</span></button>)}
        {ready&&anatomy&&!error&&anatomyLabels.map(p=><span key={p.name} className={styles.callout} style={{left:p.x,top:p.y}}>{p.label}</span>)}
        {ready&&anatomy&&!error&&visiblePartLabels.map(({part,label,x,y})=><span key={part.name} className={styles.anatomyLabel} style={{left:x,top:y}}>{label}</span>)}
        {error&&<div className={styles.error} role="alert">{error}</div>}
        {!ready&&!error&&<div className={styles.loading}>3D模型を準備中…</div>}
        <span className={styles.stageCaption}>指1本で回転 · 2本／ホイールで拡大（最大3倍）</span>
      </div>
      <div className={styles.opacityControl}>
        <label>心筋の不透明度 <input aria-label="心筋の不透明度" type="range" min="0" max="1" step=".05" value={opacity} onChange={e=>setOpacity(Number(e.target.value))}/><output>{Math.round(opacity*100)}%</output></label>
      </div>
      <div className={styles.legend}><span><i className={styles.rightKey}/>右心系</span><span><i className={styles.leftKey}/>左心系</span><span><i className={styles.arteryKey}/>冠動脈</span><label><input type="checkbox" checked={anatomy} onChange={e=>setAnatomy(e.target.checked)}/>名称を表示</label></div>
      <div className={styles.displayControls}>
        <label>名称の種類 <select value={labelGroup} onChange={e=>setLabelGroup(e.target.value)}>{['すべて','表面','血管','内部'].map(group=><option key={group}>{group}</option>)}</select></label>
        <label>ラベル <select aria-label="ラベルの言語" value={labelLanguage} onChange={e=>setLabelLanguage(e.target.value as 'ja'|'en')}><option value="ja">日本語</option><option value="en">English</option></select></label>
      </div>
      <p className={styles.viewHint}>名称は手前側の部位だけ表示。裏側の構造は透過した模型で見られる。誘導は図のマークをタップ。左右は患者基準。</p>
    </section>
    {lead&&<section className={styles.description} aria-live="polite" aria-atomic="true"><h2>{lead.region}</h2><button type="button" onClick={()=>setSelected(null)}>光を消す</button></section>}
    <details className={styles.details}><summary>参考文献</summary><ul><li><a href="https://www.ncbi.nlm.nih.gov/books/NBK594493/" target="_blank" rel="noreferrer">Open RN：心電図の誘導</a></li><li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8200569/" target="_blank" rel="noreferrer">冠動脈の解剖</a></li><li><a href="https://www.ncbi.nlm.nih.gov/books/NBK470256/" target="_blank" rel="noreferrer">心臓・弁・流出路の解剖</a></li></ul></details>
    <LabDisclaimer />
  </div>;
}
