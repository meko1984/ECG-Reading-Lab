'use client';

import { useEffect, useRef, useState } from 'react';
import { ARTERIES, HEART_PARTS, INITIAL_CAMERA, LEAD_VIEWS, project, type Camera, type Vec3 } from '@/app/domain/heart3d';
import { ANATOMY_ITEMS, anatomyPoint, isNearSide } from '@/app/domain/heart3d-anatomy';
import { createHeartRenderer } from './heart3d-renderer';
import { clampZoom, createHeartGesture } from '@/app/domain/heart3d-gesture';
import styles from './Heart3DLabClient.module.css';

function colorValue(element: HTMLElement,name:string): Vec3 {
  const hex=getComputedStyle(element).getPropertyValue(name).trim();
  return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255) as Vec3;
}
export function Heart3DLabClient() {
  const [selected,setSelected]=useState<string|null>(null);
  const [camera,setCamera]=useState<Camera>(INITIAL_CAMERA);
  const [size,setSize]=useState({width:400,height:450});
  const [anatomy,setAnatomy]=useState(true);
  const [opacity,setOpacity]=useState(.3);
  const [labelGroup,setLabelGroup]=useState('すべて');
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
  const reset=()=>{setSelected(null);setCamera({...INITIAL_CAMERA});};
  // Labels stay at their projected 3D locations: no screen-space shuffling.
  const labels=LEAD_VIEWS.map(lead=>({...project(lead.position,camera,size.width,size.height),lead}));
  const visibleParts=HEART_PARTS.filter(part=>isNearSide(part.anchor,camera));
  const occupied=visibleParts.map(part=>({...project(anatomyPoint(part.anchor),camera,size.width,size.height),width:32,height:20}));
  const anatomyLabels=ANATOMY_ITEMS.filter(item=>(labelGroup==='すべて'||item.group===labelGroup)&&isNearSide(item.point,camera)).map(item=>{
    const anchor=project(anatomyPoint(item.point),camera,size.width,size.height);
    const width=item.name.length*(size.width<400?10:11)+8,height=18;
    // Stay attached to the anatomy. Only a small local offset is permitted;
    // never move a label to a screen-edge column to resolve overlap.
    const offsets=[[0,-10],[0,10],[0,0],...Array.from({length:32},(_,i)=>{
      const angle=(i%16)*Math.PI/8,radius=i<16?24:36;
      return [Math.cos(angle)*radius,Math.sin(angle)*radius];
    })];
    const candidates=offsets.map(([dx,dy])=>{
      const x=anchor.x+dx,y=anchor.y+dy;
      const overlap=occupied.reduce((total,p)=>total+Math.max(0,(width+p.width)/2+3-Math.abs(x-p.x))*Math.max(0,(height+p.height)/2+2-Math.abs(y-p.y)),0);
      return {x,y,cost:overlap+Math.hypot(dx,dy)*2};
    });
    const position=candidates.reduce((best,p)=>p.cost<best.cost?p:best);
    occupied.push({...position,width,height,depth:anchor.depth});
    return {...item,anchor,...position};
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
        {ready&&anatomy&&!error&&anatomyLabels.map(p=><span key={p.name} className={styles.callout} style={{left:p.x,top:p.y}}>{p.name}</span>)}
        {ready&&anatomy&&!error&&visibleParts.map(part=>{const p=project(anatomyPoint(part.anchor),camera,size.width,size.height);return <span key={part.name} className={styles.anatomyLabel} style={{left:p.x,top:p.y}}>{part.name}</span>;})}
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
      </div>
      <p className={styles.viewHint}>名称は手前側の部位だけ表示。裏側の構造は透過した模型で見られる。誘導は図のマークをタップ。左右は患者基準。</p>
    </section>
    <section className={styles.description} aria-live="polite" aria-atomic="true">
      <p className={styles.kicker}>{lead?`${lead.label} 誘導 · 観察方向`:'LIGHT ON · 誘導を選ぼう'}</p>
      <h2>{lead?.region||'どの方向から心臓を見る？'}</h2>
      {lead&&<details className={styles.details}><summary>誘導の補足</summary><p>{lead.description}</p></details>}
      {lead&&<button type="button" onClick={()=>setSelected(null)}>光を消す</button>}
    </section>
    <p className={styles.note}>胸部誘導は装着位置の方向を模式表示。V1・V2は第4肋間、V3はV2とV4の間、V4〜V6は同じ高さ。四肢誘導のマークは貼付位置ではなく電気軸の方向。回転しても心臓との位置関係は固定。</p>
    <details className={styles.details}><summary>模型の見方・冠動脈について</summary>
      <p>右室は前方、左房は後方、心尖部は左下前方に配置。前後の厚み、心耳、房室弁と流出路を示した模式模型。弁は弁輪と弁尖を簡略化して表示し、心筋の透過で内部を観察できる。実測画像から再構成した形状ではないよ。</p>
      <p>右上肺動脈は右肺上葉へ向かう枝（上葉枝）を表示。右上肺静脈とは別の血管で、右上・右下・左上・左下の4本の肺静脈は左房へ入る。冠静脈洞は後面の房室溝を通って右房へつながる。</p>
      <p>肺動脈幹は上行大動脈の左前方へ上がり、右肺動脈は大動脈の後ろを通って右肺へ向かう。左房から肺側へたどると、上肺静脈は前上方、下肺静脈は後下方へ向かう代表的な配置を示す。肺門や気管支、細かな分枝・個人差は省略しているよ。</p>
      <p>冠動脈は大動脈の根元から分かれ、心臓の表面を走る。前面の左前下行枝、左側から後面へ回る左回旋枝、右側を回る右冠動脈と後下行枝を示している。後下行枝が右冠動脈から分かれる代表例で、実際の走行には個人差がある。</p>
      <p>表示する主な枝：{[...new Set(ARTERIES.map(a=>a.name))].join('・')}。</p>
      <p>模型を回しても、心臓に対する各誘導の向きは変わらない。光と領域の対応は学習用の簡略化で、冠動脈の支配域や病変部位を判定するものではない。1つの誘導だけで部位や病気を決めず、実際の判読では12誘導全体と臨床情報を合わせて考える。</p>
      <p>参考：<a href="https://www.ncbi.nlm.nih.gov/books/NBK594493/" target="_blank" rel="noreferrer">Open RN：心電図の誘導</a>／<a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8200569/" target="_blank" rel="noreferrer">冠動脈の解剖</a></p>
      <p>形状・位置の照合：<a href="https://www.ncbi.nlm.nih.gov/books/NBK470256/" target="_blank" rel="noreferrer">心臓・弁・流出路</a>／<a href="https://www.ncbi.nlm.nih.gov/books/NBK557566/" target="_blank" rel="noreferrer">冠静脈洞</a>／<a href="https://www.kenhub.com/en/library/anatomy/pulmonary-arteries-and-veins" target="_blank" rel="noreferrer">肺動脈・肺静脈</a>／<a href="https://www.gehealthcare.co.uk/-/jssmedia/0ef8abc252094d10ab6c95f34abce977.pdf" target="_blank" rel="noreferrer">胸部誘導の配置</a></p>
      <p>大血管の位置関係：<a href="https://www.vhlab.umn.edu/atlas/pulmonary-artery/index.shtml" target="_blank" rel="noreferrer">ミネソタ大学：肺動脈</a>／<a href="https://www.ncbi.nlm.nih.gov/books/NBK534804/" target="_blank" rel="noreferrer">肺静脈の走行</a>／<a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4195839/" target="_blank" rel="noreferrer">冠静脈洞のCT・MRI解剖</a></p>
    </details>
    <p className={styles.note}>学習用の模式模型・非診断用。</p>
  </div>;
}
