'use client';

import { useState } from 'react';
import type { RhythmKind } from '@/app/content/classroom/types';
import { rhythmExamples, type RhythmExample } from '@/app/domain/classroom-rhythms';
import { ScrollableWaveform } from './ScrollableWaveform';
import styles from './Classroom.module.css';

function Timing({example}:{example:RhythmExample}) {
  const x=(t:number)=>90+t*100;
  const atrialTrace=Array.from({length:561},(_,i)=>`${i?'L':'M'}${90+i} ${90+Math.sin(i*.32)*7+Math.sin(i*.79)*3+Math.sin(i*.11)*4}`).join(' ');
  return <ScrollableWaveform className={styles.diagramScroll} ariaLabel="心房と心室の時間関係。横にスクロールできます。"><svg viewBox="0 0 700 300" className={styles.timeline} role="img" aria-label={example.label+'。'+example.description}>
    <text x="10" y="87" fontSize="19">心房</text><text x="10" y="211" fontSize="19">心室</text>
    <line x1="85" y1="90" x2="655" y2="90" stroke="#9db4c7"/><line x1="85" y1="215" x2="655" y2="215" stroke="#9db4c7"/>
    {example.connections.map(([a,v])=><line key={`${a}-${v}`} x1={x(example.atria[a].time)} y1="105" x2={x(example.ventricles[v].time)} y2="178" stroke="#8dabc7" strokeWidth="2"/>)}
    {example.fibrillation&&<path d={atrialTrace} fill="none" stroke="#a34768" strokeWidth="2"/>}
    {example.atria.map((e,i)=><g key={i}><path d={example.flutter?`M${x(e.time)-9} 90l14 8 -5 -30v22`:`M${x(e.time)-9} 90q9 ${e.ectopic?29:-29} 18 0`} fill="none" stroke="#a34768" strokeWidth="2.5"/>{!example.flutter&&<text x={x(e.time)} y="51" textAnchor="middle" fontSize="17">{e.ectopic?'P′':'P'}</text>}</g>)}
    {example.ventricles.map((e,i)=><g key={i}><path d={e.wide?`M${x(e.time)-12} 215q8 -65 18 -30t15 30`:`M${x(e.time)-5} 215l3 7 3 -51 4 64 4 -20`} fill="none" stroke="#0a1f57" strokeWidth="2.5"/>{e.ectopic&&<text x={x(e.time)} y="154" textAnchor="middle" fontSize="18">★</text>}</g>)}
    {[0,1,2,3,4,5].map(t=><g key={t}><line x1={x(t)} y1="250" x2={x(t)} y2="258" stroke="#465e7b"/><text x={x(t)} y="282" textAnchor="middle" fontSize="17">{t}秒</text></g>)}
  </svg></ScrollableWaveform>;
}

function Circuit({wpw=false}:{wpw?:boolean}) {
  const [selected,setSelected]=useState(0);
  const labels=wpw?['通常の経路','早期興奮']:['AVNRT','AVRT','心房頻拍（AT）'];
  const descriptions=wpw?['房室結節を通り、His–Purkinje系から心室へ届きます。','副伝導路でも心室の一部へ先に届きます。通常経路の興奮と融合し、QRSの始まりにデルタ波が生じます。']:['房室結節周辺の速い・遅い経路が回路をつくる代表的なslow–fast型。P′はQRSの中や末尾に重なり得ます。','順行性AVRTの例。房室結節を下り、副伝導路を戻る回路に心房・心室が参加します。','心房内の起源から興奮が生じます。ATには異常自動能やリエントリーなど複数の機序があります。'];
  const waveform = wpw
    ? selected === 0 ? 'M20 110H70q14 -22 28 0H155l8 8 10 -76 13 96 12 -28H270q35 -49 70 0H500' : 'M20 110H70q14 -22 28 0H132q20 -2 31 -22q14 -32 28 -46l12 96 15 -28H285q35 -49 70 0H500'
    : selected === 2 ? 'M20 110H55q12 -24 24 0H105l6 6 8 -68 11 87 10 -25H165q12 -24 24 0H215l6 6 8 -68 11 87 10 -25H275q12 -24 24 0H325l6 6 8 -68 11 87 10 -25H500' : 'M20 110H60l6 6 8 -68 11 87 10 -25H150l6 6 8 -68 11 87 10 -25H240l6 6 8 -68 11 87 10 -25H330l6 6 8 -68 11 87 10 -25H500';
  return <><div className={styles.controls} role="group" aria-label="興奮経路を選ぶ">{labels.map((label,i)=><button type="button" aria-pressed={selected===i} key={label} onClick={()=>setSelected(i)}>{label}</button>)}</div>
    <div className={styles.twoColumns}><svg className={styles.diagram} viewBox="0 0 520 165" role="img" aria-label={labels[selected]+'で見られる代表的な模式波形'}><path d="M20 110H500" stroke="#9db4c7" strokeDasharray="5 5"/><path d={waveform} fill="none" stroke="#0a1f57" strokeWidth="3"/><text x="260" y="155" textAnchor="middle" fontSize="19">{wpw?(selected===0?'比較用の波形':'短いPR・デルタ波の一例'):'規則的な狭いQRS頻拍の一例'}</text></svg>
    <svg className={styles.diagram} viewBox="0 0 540 355" role="img" aria-label={labels[selected]+'の概念図。'+descriptions[selected]}>
      <rect x="150" y="15" width="240" height="58" rx="20" fill="#f8dce6"/><text x="270" y="52" textAnchor="middle" fontSize="25">心房</text>
      <rect x="177" y="129" width="185" height="84" rx="28" fill="#e1f0fd"/><text x="270" y="178" textAnchor="middle" fontSize="23">房室結節周辺</text>
      <rect x="150" y="280" width="240" height="58" rx="20" fill="#d4eafa"/><text x="270" y="317" textAnchor="middle" fontSize="25">心室</text>
      <path d="M270 75v52m0 87v63" fill="none" stroke="#146ed6" strokeWidth="4"/><text x="281" y="115" fontSize="22">↓</text><text x="281" y="260" fontSize="22">↓</text>
      {(wpw&&selected===1)||(!wpw&&selected===1)?<><path d="M390 45h72v266h-72" fill="none" stroke="#a34768" strokeWidth="5"/><text x="475" y="158" fontSize="25">{wpw?'↓':'↑'}</text><text x="418" y="215" fontSize="17">副伝導路</text></>:!wpw&&selected===0?<><ellipse cx="116" cy="170" rx="40" ry="53" fill="none" stroke="#a34768" strokeWidth="4"/><text x="58" y="177" fontSize="24">↓</text><text x="151" y="177" fontSize="24">↑</text><text x="114" y="250" textAnchor="middle" fontSize="17">遅い↓ / 速い↑</text><path d="M155 169h20" stroke="#a34768" strokeWidth="3"/></>:!wpw&&selected===2?<><circle cx="201" cy="45" r="20" fill="#fff0bc" stroke="#8c6100"/><text x="201" y="54" textAnchor="middle" fontSize="25">★</text><text x="92" y="50" textAnchor="middle" fontSize="19">心房内の起源</text></>:null}
    </svg></div><p className={styles.lede}>{descriptions[selected]}</p><p className={styles.note}>波形は代表例です。線は興奮経路の関係を示し、解剖学的位置や伝導時間の縮尺ではありません。</p>
  </>;
}

function Ventricular() {
  const [mode,setMode]=useState(0);
  const choices=[{name:'単形性VT',text:'心室由来の速い興奮が連続し、QRSの形がほぼ一定となる概念です。幅広い頻拍の原因は心電図全体で評価します。'},{name:'多形性VT / TdP',text:'拍ごとに形・軸が変化します。TdPはQT延長を背景とする特徴的な多形性VTで、すべての多形性VTと同義ではありません。'},{name:'VF',text:'まとまったQRSを認めない不規則な活動です。アーチファクトとの区別、患者の反応や呼吸・循環の確認が必要です。'},{name:'AIVR',text:'心室固有のリズムが促進された状態です。比較的遅い連続した幅広いQRSを見ます。速度の定義には文献差があり、速さだけでVTと二分しません。'}];
  const path=Array.from({length:641},(_,i)=>{const v=mode===2?Math.sin(i*.14)*25+Math.sin(i*.36)*12+Math.cos(i*.071)*17:0;return `${i?'L':'M'}${30+i} ${120+v}`;}).join(' ');
  return <><div className={styles.controls} role="group" aria-label="心室性リズムの比較">{choices.map((c,i)=><button type="button" key={c.name} aria-pressed={mode===i} onClick={()=>setMode(i)}>{c.name}</button>)}</div><ScrollableWaveform className={styles.diagramScroll} ariaLabel="心室性リズムの模式図。横にスクロールできます。"><svg className={styles.timeline} viewBox="0 0 700 200" role="img" aria-label={choices[mode].name+'の模式図'}><path d={path} fill="none" stroke={mode===2?'#0a1f57':'#9db4c7'} strokeWidth="2"/>{mode!==2&&Array.from({length:mode===3?5:10},(_,i)=>{const width=mode===3?128:64;const amplitude=mode===1?Math.cos(i*.65)*52:52;return <path key={i} d={`M${32+i*width} 120q${width*.18} ${-amplitude*2} ${width*.33} ${-amplitude*.7}t${width*.23} 0q${width*.14} ${amplitude*1.1} ${width*.4} ${amplitude*.7}`} fill="none" stroke="#0a1f57" strokeWidth="2.5"/>;})}</svg></ScrollableWaveform><p>{choices[mode].text}</p><p className={styles.note}>形と並びだけの独自模式図です。時間・電位の測定や診断分類には使いません。</p></>;
}

export function RhythmVisual({kind}:{kind:RhythmKind}) {
  const [selected,setSelected]=useState(0);
  const examples=rhythmExamples[kind];
  return <section className={styles.section}><h2>代表的な波形</h2>
    {kind==='svt'||kind==='wpw'?<Circuit wpw={kind==='wpw'}/>:kind==='ventricular'?<Ventricular/>:examples?<><div className={styles.controls} role="group" aria-label="時間関係の例を選ぶ">{examples.map((e,i)=><button type="button" key={e.label} aria-pressed={selected===i} onClick={()=>setSelected(i)}>{e.label}</button>)}</div><Timing example={examples[selected]}/><p className={styles.lede}>{examples[selected].description}</p><p className={styles.note}>心房と心室を上下に分けた時間関係の図です。細い接続線は伝導を示します。T波を省略し、P・QRSは記号化しています。実際の心電図ではありません。</p></>:null}
  </section>;
}
