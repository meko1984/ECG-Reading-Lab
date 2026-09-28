'use client';

import { useState } from 'react';
import styles from './Classroom.module.css';

function Pacing({ variant, onVariantChange }: { variant: number; onVariantChange: (value: number) => void }) {
  const capture = variant === 0;
  const [mode,setPacingMode]=useState(0);
  const modes=[{name:'AAI',stim:'心房',sense:'心房',response:'感知したら心房刺激を抑制'},{name:'VVI',stim:'心室',sense:'心室',response:'感知したら心室刺激を抑制'},{name:'DDD',stim:'心房・心室',sense:'心房・心室',response:'抑制と同期。条件内の心房感知を心室刺激へ追跡できる'},{name:'DDI',stim:'心房・心室',sense:'心房・心室',response:'抑制。感知した心房の活動は心室刺激へ追跡しない'}];
  return <><div className={styles.controls} role="group" aria-label="捕捉を比較"><button type="button" aria-pressed={capture} onClick={()=>onVariantChange(0)}>刺激後にQRSが続く</button><button type="button" aria-pressed={!capture} onClick={()=>onVariantChange(1)}>2回目にQRSが続かない</button></div><svg className={styles.diagram} viewBox="0 0 600 230" role="img" aria-label={capture?'3回の心室刺激のあとにQRSが続く概念図':'2回目の心室刺激のあとにQRSが続かない捕捉不全の概念図'}><line x1="20" y1="140" x2="580" y2="140" stroke="#9db4c7"/>{[90,265,440].map((x,i)=><g key={x}><path d={`M${x} 140v-100v100`} fill="none" stroke="#a34768" strokeWidth="2"/><text x={x} y="27" textAnchor="middle" fontSize="18">刺激 {i+1}</text>{(capture||i!==1)&&<path d={`M${x+8} 140q10 -65 20 -30t25 30q15 -25 32 0`} fill="none" stroke="#0a1f57" strokeWidth="3"/>}</g>)}<text x="300" y="213" textAnchor="middle" fontSize="19">刺激線の有無と、その後の興奮を分けて観察</text></svg><p className={styles.note}>心室刺激の原理図。見える刺激線の大きさは、機種・双極／単極・記録フィルターなどで異なります。</p><h3>モードの最初の3文字</h3><div className={styles.controls} role="group" aria-label="ペーシングモード">{modes.map((m,i)=><button type="button" key={m.name} aria-pressed={mode===i} onClick={()=>setPacingMode(i)}>{m.name}</button>)}</div><div className={styles.threeColumns}><div className={styles.point}><h3>① 刺激する場所</h3><p>{modes[mode].stim}</p></div><div className={styles.point}><h3>② 感知する場所</h3><p>{modes[mode].sense}</p></div><div className={styles.point}><h3>③ 感知への応答</h3><p>{modes[mode].response}</p></div></div><p className={styles.note}>上の波形とは独立した用語の比較です。Rなど後続文字や機種固有の機能は省略。DDDとDDIは同じ応答ではありません。</p></>;
}

function Devices({ mode, onChange }: { mode: number; onChange: (value: number) => void }) {
  const items=[{name:'ATP',purpose:'頻拍の回路へ短い間隔の刺激を入れる',target:'主に対応可能な心室頻拍',text:'抗頻拍ペーシングの略です。頻拍回路へ刺激を届けて停止を試みます。すべてのVTを止められるわけではありません。'},{name:'ショック',purpose:'電気ショックで頻拍を停止させる',target:'検出条件を満たすVT・VFなど',text:'ICDは心室性不整脈を検出して治療します。ATPや徐脈ペーシングの有無は装置によって異なります。'},{name:'CRT',purpose:'左右心室の興奮・収縮のずれを整える',target:'適応を満たす心不全など',text:'心臓再同期療法です。徐脈を補うことに加え、心室間・心室内の同期を改善することを目指します。'}];
  const waveform = mode===0
    ? 'M20 115H60q8 -62 22 -25t18 25H135q8 -62 22 -25t18 25H205v-55v55h12v-55v55h12v-55v55H280q8 -62 22 -25t18 25H500'
    : mode===1
      ? 'M20 115Q35 65 50 120T80 105T110 125T140 90T175 115H225M270 115H320l6 7 8 -70 11 90 10 -27H410q28 -40 56 0H500'
      : 'M20 115H72v-65v65h12q10 -58 26 -24t25 24H220H270v-65v65h12q10 -58 26 -24t25 24H500';
  return <><div className={styles.controls} role="group" aria-label="デバイスの役割">{items.map((item,i)=><button type="button" key={item.name} aria-pressed={mode===i} onClick={()=>onChange(i)}>{item.name}</button>)}</div><div className={styles.twoColumns}><svg className={styles.diagram} viewBox="0 0 520 175" role="img" aria-label={items[mode].name+'の作動を表す模式波形'}><path d="M20 115H500" stroke="#9db4c7" strokeDasharray="5 5"/><path d={waveform} fill="none" stroke="#0a1f57" strokeWidth="3"/>{mode===1&&<><path d="M245 35l-13 31h18l-12 31 36 -42h-19l11 -20" fill="#b77700"/><text x="250" y="165" textAnchor="middle" fontSize="18">頻拍 → ショック → 洞調律の概念</text></>}{mode===0&&<text x="250" y="165" textAnchor="middle" fontSize="18">頻拍中の短い刺激列の概念</text>}{mode===2&&<text x="250" y="165" textAnchor="middle" fontSize="18">両心室刺激のタイミングを示す概念</text>}</svg><svg className={styles.diagram} viewBox="0 0 540 245" role="img" aria-label={items[mode].name+'。'+items[mode].purpose}>
    <rect x="190" y="10" width="160" height="65" rx="18" fill="#e3f2ff" stroke="#146ed6"/><text x="270" y="52" textAnchor="middle" fontSize="29">{items[mode].name}</text><path d={mode===2?"M270 75v43M270 118L146 147M270 118L394 147":"M270 75v28L146 147"} fill="none" stroke="#146ed6" strokeWidth="3"/>
    <rect x="67" y="147" width="159" height="82" rx="25" fill="var(--anatomy-right-fill)"/><rect x="314" y="147" width="159" height="82" rx="25" fill="var(--anatomy-left-fill)"/><text x="147" y="195" textAnchor="middle" fontSize="24">右室</text><text x="394" y="195" textAnchor="middle" fontSize="24">左室</text>
    {mode===0?<path d="M67 115h10v-25h5v25h14v-25h5v25h14v-25h5v25h14v-25h5v25h14v-25h5v25h25" fill="none" stroke="#a34768" strokeWidth="3"/>:mode===1?<path d="M91 78l-13 31h18l-12 31 36-42h-19l11-20" fill="#b77700"/>:<><text x="145" y="132" textAnchor="middle" fontSize="20">刺激↓</text><text x="396" y="132" textAnchor="middle" fontSize="20">刺激↓</text></>}
  </svg></div><h3>{items[mode].purpose}</h3><p>{items[mode].text}</p><p className={styles.note}>対象：{items[mode].target}。波形と装置図は役割を示す模式図で、リード位置・刺激の設定・治療成否を再現するものではありません。</p><div className={styles.measureReadout}><span>CRT-P：再同期ペーシング</span><span>CRT-D：再同期＋除細動機能</span></div></>;
}

export function DeviceVisual({kind, variant, onVariantChange}:{kind:'pacing'|'devices'; variant: number; onVariantChange: (value: number) => void}) {
  return <section className={styles.section}><h2>代表的な波形</h2>{kind==='pacing'?<Pacing variant={Math.min(variant, 1)} onVariantChange={onVariantChange}/>:<Devices mode={Math.min(variant, 2)} onChange={onVariantChange}/>}</section>;
}
