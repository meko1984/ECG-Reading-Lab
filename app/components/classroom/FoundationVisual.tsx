'use client';

import { useState } from 'react';
import type { FoundationKind } from '@/app/content/classroom/types';
import { axisProjections, schematicBeat, teachingQTc, teachingRate } from '@/app/domain/classroom-models';
import { CORRECT_PLACEMENT } from '@/app/domain/electrodes';
import { ElectrodeBodyMap } from '@/app/components/ElectrodeBodyMap';
import styles from './Classroom.module.css';

function Beat({ title, range, rangeLabel, qrsWidth = 44, amplitude = 1, st = 0, tSign = 1, u = false }: { title: string; range?: [number, number]; rangeLabel?: string; qrsWidth?: number; amplitude?: number; st?: number; tSign?: number; u?: boolean }) {
  return <svg className={styles.diagram} viewBox="0 0 600 265" role="img" aria-label={title}>
    <line x1="25" y1="160" x2="575" y2="160" stroke="#758499" strokeDasharray="5 5" />
    {range && <rect x={range[0]} y="35" width={range[1] - range[0]} height="165" fill="#f6b83e" opacity=".22" />}
    <path d={schematicBeat({ qrsWidth, amplitude, st, tSign })} fill="none" stroke="#0a1f57" strokeWidth="3" strokeLinejoin="round" />
    {u && <path d="M445 160q20 -25 40 0" fill="none" stroke="#146ed6" strokeWidth="3" />}
    <text x="103" y="128" fontSize="22" textAnchor="middle">P</text><text x={180 + qrsWidth * .4} y="28" fontSize="22" textAnchor="middle">QRS</text><text x={180 + qrsWidth + 94} y={105 - st} fontSize="22" textAnchor="middle">T</text>
    {u && <text x="465" y="131" fontSize="22" textAnchor="middle">U</text>}
    {range && <><path d={`M${range[0]} 213v12H${range[1]}v-12`} stroke="#146ed6" strokeWidth="3" fill="none" /><text x={(range[0] + range[1]) / 2} y="255" fontSize="21" textAnchor="middle">{rangeLabel}</text></>}
  </svg>;
}

function Cycle() {
  const [phase, setPhase] = useState(0);
  const phases = [
    { label: 'P波', place: '心房が脱分極', detail: '洞結節を起点に心房へ興奮が広がります。', range: [80, 130] as [number,number] },
    { label: 'QRS', place: '心室が脱分極', detail: '房室結節からHis束・脚・Purkinje線維を経て、心室に広がります。', range: [180, 224] as [number,number] },
    { label: 'T波', place: '心室が再分極', detail: '心室の細胞が電気的に回復する過程です。', range: [268, 374] as [number,number] },
  ];
  return <><div className={styles.controls} role="group" aria-label="電気活動の段階">{phases.map((p,i) => <button key={p.label} type="button" aria-pressed={phase === i} onClick={() => setPhase(i)}>{p.label}</button>)}</div>
    <div className={styles.twoColumns}><svg className={styles.diagram} viewBox="0 0 380 315" role="img" aria-label={`電気活動の概念図。${phases[phase].place}。解剖学的な形状の図ではありません。`}>
      <rect x="28" y="25" width="145" height="92" rx="28" fill="var(--anatomy-right-fill)" opacity={phase === 0 ? 1 : .3} /><rect x="200" y="25" width="145" height="92" rx="28" fill="var(--anatomy-left-fill)" opacity={phase === 0 ? 1 : .3} />
      <rect x="28" y="160" width="145" height="135" rx="32" fill="var(--anatomy-right-fill)" opacity={phase > 0 ? 1 : .3} /><rect x="200" y="160" width="145" height="135" rx="32" fill="var(--anatomy-left-fill)" opacity={phase > 0 ? 1 : .3} />
      <text x="100" y="84" textAnchor="middle" fontSize="23">右房</text><text x="271" y="84" textAnchor="middle" fontSize="23">左房</text><text x="100" y="245" textAnchor="middle" fontSize="23">右室</text><text x="271" y="245" textAnchor="middle" fontSize="23">左室</text>
      <circle cx="55" cy="43" r="9" fill="#146ed6" /><text x="72" y="45" fontSize="17">洞結節</text><path d="M62 50L186 133V174M186 174L112 194M186 174L263 194" stroke="#0a1f57" strokeWidth="3" fill="none" strokeDasharray={phase === 2 ? '5 5' : undefined} /><circle cx="186" cy="133" r="8" fill="#f6b83e" /><text x="206" y="140" fontSize="17">房室結節</text>
    </svg><div><Beat title={`${phases[phase].label}を強調した模式波形`} range={phases[phase].range} rangeLabel={phases[phase].label} /><p className={styles.lede}>{phases[phase].place}</p><p>{phases[phase].detail}</p></div></div></>;
}

function LeadView() {
  const [side,setSide] = useState<'frontal'|'horizontal'>('frontal');
  const leadAngles = [{name:'Ⅰ',a:0},{name:'Ⅱ',a:60},{name:'Ⅲ',a:120},{name:'aVF',a:90},{name:'aVL',a:-30},{name:'aVR',a:-150}];
  return <><div className={styles.controls} role="group" aria-label="誘導が見る面"><button type="button" aria-pressed={side==='frontal'} onClick={()=>setSide('frontal')}>四肢誘導：前額面</button><button type="button" aria-pressed={side==='horizontal'} onClick={()=>setSide('horizontal')}>胸部誘導：水平面</button></div>
    {side==='horizontal' ? <div className={styles.twoColumns}><div style={{maxWidth:320,margin:'0 auto',width:'100%'}}><ElectrodeBodyMap placement={CORRECT_PLACEMENT} selected={null} view="standard" onPlace={()=>{}}/></div><div><h3>胸部は正確な位置に</h3><ol className={styles.stepList}><li>V1・V2：第4肋間の胸骨右縁・左縁</li><li>V4：第5肋間・左鎖骨中線。V3はV2とV4の間</li><li>V5・V6：V4と同じ高さの前腋窩線・中腋窩線</li></ol><p className={styles.note}>図の左右は患者の左右です。胸部誘導は主に水平面の情報を表します。</p></div></div> : <svg className={styles.diagram} viewBox="0 0 520 360" role="img" aria-label="四肢誘導の基準軸。Ⅰ0度、Ⅱ60度、Ⅲ120度、aVF90度、aVLマイナス30度、aVRマイナス150度。">
      <circle cx="260" cy="170" r="115" fill="#f1f8ff" stroke="#b8d6ee" /><ellipse cx="260" cy="170" rx="32" ry="42" fill="var(--anatomy-left-fill)" /><text x="260" y="177" textAnchor="middle" fontSize="17">心臓</text>
      {leadAngles.map(({name,a})=>{const rad=a*Math.PI/180; const x=260+Math.cos(rad)*144,y=170+Math.sin(rad)*144;return <g key={name}><line x1={260+Math.cos(rad)*42} y1={170+Math.sin(rad)*42} x2={x} y2={y} stroke="#146ed6" strokeWidth="2" /><circle cx={x} cy={y} r="20" fill="white" stroke="#146ed6" /><text x={x} y={y+6} textAnchor="middle" fontSize="18">{name}</text></g>;})}
      <text x="260" y="355" textAnchor="middle" fontSize="18">前額面：患者の左が図の右</text>
    </svg>}<p className={styles.note}>脱分極の平均ベクトルが誘導のプラス側へ向かうと、陽性成分が大きくなるのが基本です。胸部電極の正確な装着位置は電極装着ラボで確かめられます。</p></>;
}

function Rate() {
  const [rr,setRr] = useState(.8);
  return <><div className={styles.controls}><label>RR間隔 <input type="range" min=".4" max="1.5" step=".1" value={rr} onChange={e=>setRr(Number(e.target.value))}/></label><output>{rr.toFixed(1)}秒</output></div>
    <svg className={styles.diagram} viewBox="0 0 600 210" role="img" aria-label={`規則的なQRSの概念図。RR${rr.toFixed(1)}秒、心拍数約${Math.round(teachingRate(rr))}毎分。`}>
      <line x1="25" y1="130" x2="575" y2="130" stroke="#9cb7cc" />
      {Array.from({length:Math.floor(3/rr)+1},(_,i)=>i*rr).filter(t=>t<=3).map(t=><path key={t} d={`M${40+t*170-8} 130l4 8 4 -70 5 92 6 -30`} fill="none" stroke="#0a1f57" strokeWidth="3" />)}
      <path d={`M40 155v15h${rr*170}v-15`} fill="none" stroke="#146ed6" strokeWidth="3" /><text x={40+rr*85} y="200" textAnchor="middle" fontSize="23">RR {rr.toFixed(1)}秒</text>
    </svg><div className={styles.measureReadout}><span>60 ÷ {rr.toFixed(1)} = 約{Math.round(teachingRate(rr))}/分</span><span>大マス {Number((rr/.2).toFixed(1))}個相当</span></div><p className={styles.note}>等間隔のQRSだけを描いた計算練習です。洞調律を判定する波形ではありません。</p></>;
}

function Interval({kind}:{kind:'pr'|'qrs'|'st'|'qt'}) {
  const [selection,setSelection]=useState(0);
  const [rr,setRr]=useState(1);
  const [qt,setQt]=useState(400);
  const settings = {
    pr:[{name:'P波の幅',range:[80,130] as [number,number],detail:'Pの始まりから終わりまで。心房の脱分極の時間です。'},{name:'PR間隔',range:[80,180] as [number,number],detail:'Pの始まりからQRSの始まりまで。P波の幅も含みます。'}],
    qrs:[{name:'幅を見る',range:[180,224] as [number,number],detail:'最初の振れから最後の振れまでを見ます。'},{name:'幅が広い例',range:[180,268] as [number,number],detail:'幅だけで原因を決めず、形やP波との関係を確認します。'},{name:'振幅が小さい例',range:[180,224] as [number,number],detail:'同じ感度・同じ誘導で比較します。低電位の診断例ではありません。'}],
    st:[{name:'基線・J点',range:[222,226] as [number,number],detail:'QRSの終わりがJ点です。破線は比較する基線を示します。'},{name:'ST上昇の模式',range:[224,268] as [number,number],detail:'基線より高いSTを示します。病因を特定するモデルではありません。'},{name:'ST低下の模式',range:[224,268] as [number,number],detail:'基線より低いSTを示します。波形の分布と背景も必要です。'},{name:'陰性Tの模式',range:[268,374] as [number,number],detail:'T波が基線より下向きです。誘導による正常な違いも考えます。'}],
    qt:[{name:'QT',range:[180,374] as [number,number],detail:'QRSの始まりからTの終わりまでです。'},{name:'U波を分ける',range:[445,485] as [number,number],detail:'Tの後ろのU波。通常、QTへは含めません。'}],
  };
  const current=settings[kind][selection];
  const corrected=teachingQTc(qt,rr);
  return <><div className={styles.controls} role="group" aria-label="波形の観察点">{settings[kind].map((s,i)=><button type="button" key={s.name} aria-pressed={selection===i} onClick={()=>setSelection(i)}>{s.name}</button>)}</div>
    <Beat title={current.name+'を強調した模式波形'} range={current.range} rangeLabel={current.name} qrsWidth={kind==='qrs'&&selection===1?88:44} amplitude={kind==='qrs'&&selection===2?.35:1} st={kind==='st'?(selection===1?25:selection===2?-20:0):0} tSign={kind==='st'&&selection===3?-1:1} u={kind==='qt'}/>
    <p>{current.detail}</p>
    {kind==='qt'&&<><h3>補正式を比べる練習</h3><div className={styles.controls}><label>QT <select value={qt} onChange={e=>setQt(Number(e.target.value))}>{[320,360,400,440,480].map(v=><option key={v} value={v}>{v} ms</option>)}</select></label><label>RR <select value={rr} onChange={e=>setRr(Number(e.target.value))}>{[.6,.8,1,1.2].map(v=><option key={v} value={v}>{v}秒</option>)}</select></label></div><div className={styles.measureReadout}><span>Bazett：約{Math.round(corrected.bazett)} ms</span><span>Fridericia：約{Math.round(corrected.fridericia)} ms</span></div><p className={styles.note}>上の模式波形とは独立した式の練習です。患者の値を入力する診断ツールではなく、正常／異常の判定は行いません。</p></>}
  </>;
}

function Axis() {
  const [angle,setAngle]=useState(60);
  const values=axisProjections(angle);
  const labels=[{name:'Ⅰ',a:0,value:values.leadI},{name:'aVF',a:90,value:values.avf},{name:'Ⅱ',a:60,value:values.leadII}];
  return <><div className={styles.controls}><label>平均ベクトルの向き <input type="range" min="-180" max="180" step="10" value={angle} onChange={e=>setAngle(Number(e.target.value))}/></label><output>{angle>0?'+':''}{angle}°</output></div>
    <svg className={styles.diagram} viewBox="0 0 480 360" role="img" aria-label={`電気軸${angle}度の投影。Ⅰ${values.leadI.toFixed(2)}、aVF${values.avf.toFixed(2)}、Ⅱ${values.leadII.toFixed(2)}。相対値。`}>
      <circle cx="240" cy="170" r="126" fill="#f0f7ff" stroke="#b8d6ee" />
      {labels.map(({name,a})=><g key={name}><line x1={240-Math.cos(a*Math.PI/180)*130} y1={170-Math.sin(a*Math.PI/180)*130} x2={240+Math.cos(a*Math.PI/180)*130} y2={170+Math.sin(a*Math.PI/180)*130} stroke="#8cadc9" /><text x={240+Math.cos(a*Math.PI/180)*152} y={176+Math.sin(a*Math.PI/180)*152} fontSize="22" textAnchor="middle">{name}</text></g>)}
      <line x1="240" y1="170" x2={240+values.leadI*112} y2={170+values.avf*112} stroke="#146ed6" strokeWidth="6" /><circle cx={240+values.leadI*112} cy={170+values.avf*112} r="9" fill="#146ed6" /><circle cx="240" cy="170" r="5" fill="#0a1f57" />
    </svg><div className={styles.measureReadout}>{labels.map(({name,value})=><span key={name}>{name}：{Math.abs(value)<.001?'等電位':value>0?'陽性（＋）':'陰性（−）'}</span>)}</div><p className={styles.note}>平均ベクトルを各軸へ投影した原理図です。実心電図の自動判定ではありません。−20°と−40°を比べると、Ⅱの役割が分かります。</p></>;
}

export function FoundationVisual({kind}:{kind:FoundationKind}) {
  return <section className={styles.section}><h2>図で確かめる</h2>
    {kind==='cycle'?<Cycle/>:kind==='leads'?<LeadView/>:kind==='rate'?<Rate/>:kind==='axis'?<Axis/>:kind==='pr'||kind==='qrs'||kind==='st'||kind==='qt'?<Interval kind={kind}/>:null}
    <p className={styles.note}>ECG lab独自の模式図。波形の振幅・時間・心臓の形は、説明のために簡略化しています。</p>
  </section>;
}
