'use client';

import { useState } from 'react';
import styles from './Classroom.module.css';

function Bundle() {
  const [mode,setMode]=useState(0);
  const names=['左右に伝わる','右脚ブロック','左脚ブロック','左脚前枝ブロック','左脚後枝ブロック'];
  const detail=['His束から右脚と左脚へ興奮が伝わります。左脚は説明のため前枝・後枝に簡略化しています。','右室へ直接向かう経路が遅れ、左室側から心筋を介して右室へ興奮が広がります。','左室へ直接向かう経路が遅れ、右室側から心筋を介して左室へ興奮が広がります。','左室の前上方へ向かう伝導が変化し、左軸偏位などの手掛かりが現れます。','左室の後下方へ向かう伝導が変化し、右軸偏位などの手掛かりが現れます。右心負荷など他の原因も除外して考えます。'];
  const blocked=[false,mode===1,mode===2,mode===2||mode===3,mode===2||mode===4];
  const segments=['M260 44v55','M260 99L130 170v80','M260 99L355 150','M355 150L390 212','M355 150L310 254'];
  const widths=[42,82,94,50,50];
  const qrsStart=170;
  const qrsEnd=qrsStart+widths[mode];
  return <><div className={styles.controls} role="group" aria-label="脚の伝導を選ぶ">{names.map((n,i)=><button key={n} type="button" aria-pressed={mode===i} onClick={()=>setMode(i)}>{n}</button>)}</div><div className={styles.twoColumns}><svg className={styles.diagram} viewBox="0 0 520 220" role="img" aria-label={names[mode]+'で見られるQRSの模式例'}><path d="M20 130H500" stroke="#9db4c7" strokeDasharray="5 5"/><path d={`M20 130H75q14 -22 28 0H${qrsStart}l8 10 ${Math.max(12,widths[mode]*.25)} -88 ${Math.max(13,widths[mode]*.3)} 108 ${Math.max(9,widths[mode]*.2)} -30H320q35 ${mode===2?48:-48} 70 0H500`} fill="none" stroke="#0a1f57" strokeWidth="3"/><path d={`M${qrsStart} 185v10H${qrsEnd}v-10`} fill="none" stroke="#146ed6" strokeWidth="2"/><text x={(qrsStart+qrsEnd)/2} y="215" textAnchor="middle" fontSize="18">QRS幅を見る</text></svg><svg className={styles.diagram} viewBox="0 0 520 340" role="img" aria-label={names[mode]+'の経路図。'+detail[mode]}>
    <rect x="45" y="138" width="160" height="178" rx="35" fill="var(--anatomy-right-fill)"/><rect x="243" y="138" width="231" height="178" rx="35" fill="var(--anatomy-left-fill)"/>
    <text x="125" y="298" textAnchor="middle" fontSize="23">右室</text><text x="361" y="298" textAnchor="middle" fontSize="23">左室</text><text x="260" y="30" textAnchor="middle" fontSize="22">His束</text>
    {segments.map((d,i)=><path key={d} d={d} stroke={blocked[i]?'#8c6100':'#146ed6'} strokeWidth="6" strokeDasharray={blocked[i]?'7 6':undefined} fill="none"/>)}
    <text x="96" y="125" fontSize="19">右脚</text><text x="350" y="120" fontSize="19">左脚</text><text x="408" y="210" fontSize="19">前枝</text><text x="258" y="265" fontSize="19">後枝</text>
    {mode===1||mode===2?<><path d={mode===1?'M284 225Q240 180 177 224':'M177 224Q235 180 284 225'} stroke="#a34768" strokeWidth="3" fill="none"/><text x="231" y="235" textAnchor="middle" fontSize="26">{mode===1?'←':'→'}</text></>:null}
  </svg></div><p>{detail[mode]}</p><p className={styles.note}>波形は幅と向きを比べる模式例です。破線＝障害される経路、曲線矢印＝心筋を介して届く興奮の概念。右室・左室の形や前後の位置は解剖学的な縮尺ではありません。</p></>;
}

function Territory() {
  const [group,setGroup]=useState(0);
  const groups=[{title:'下壁の方向',leads:['II','III','aVF'],note:'Ⅱ・Ⅲ・aVFをひとまとまりで見ます。Ⅰ・aVLなど反対側の変化も観察します。'},{title:'前胸部の方向',leads:['V1','V2','V3','V4'],note:'V1からV4への連続した変化を観察します。胸部誘導の変化と冠動脈の位置は、一対一に固定されません。'},{title:'側壁の方向',leads:['I','aVL','V5','V6'],note:'Ⅰ・aVL・V5・V6を比較します。異常の分布、以前の記録、時間変化を合わせます。'}];
  return <><div className={styles.controls} role="group" aria-label="誘導のまとまり">{groups.map((g,i)=><button key={g.title} type="button" aria-pressed={group===i} onClick={()=>setGroup(i)}>{g.title}</button>)}</div><svg className={styles.diagram} viewBox="0 0 560 205" role="img" aria-label={groups[group].title+'で比較するST上昇と鏡像変化の模式例'}><text x="18" y="66" fontSize="20">対象誘導</text><text x="18" y="151" fontSize="20">反対側</text><path d="M110 70H165l7 8 9 -62 12 80 12 -26Q255 35 315 43Q350 46 380 70H530M110 155H165l7 8 9 -62 12 80 12 -26Q255 185 315 181Q350 178 380 155H530" fill="none" stroke="#0a1f57" strokeWidth="3"/><text x="319" y="28" textAnchor="middle" fontSize="18">ST上昇の一例</text><text x="319" y="202" textAnchor="middle" fontSize="18">鏡像変化の一例</text></svg><div className={styles.leadGrid}>{['I','aVR','V1','V4','II','aVL','V2','V5','III','aVF','V3','V6'].map(name=><div key={name} className={groups[group].leads.includes(name)?styles.leadActive:styles.leadTile}><strong>{name}</strong><span>{groups[group].leads.includes(name)?'観察する方向':'比較する誘導'}</span></div>)}</div><p>{groups[group].note}</p><p className={styles.note}>波形は分布を学ぶ模式例です。色のついた誘導が必ず異常という意味ではなく、冠動脈の確定図でもありません。</p></>;
}

function Electrolytes() {
  const [mode,setMode]=useState(0);
  const choices=[{name:'比較用',text:'同じ模式波形を基準に、どの部分の変化を見るか比べます。'},{name:'高Kの手掛かり',text:'尖って高いT波の例。Pの低下、PR延長、QRS拡大などもあり得ます。順番どおりに変化するとは限りません。'},{name:'低Kの手掛かり',text:'小さいT波と目立つU波の例。TとUが重なると、QTの終わりを決めにくくなります。'},{name:'低Caの手掛かり',text:'ST部分が長くなり、QTが延びる方向の例です。'},{name:'高Caの手掛かり',text:'ST部分が短くなり、QTが短くなる方向の例です。'},{name:'ジゴキシンの作用',text:'下向きにくぼむSTの例。これは「盆状T波」ではありません。治療量でのST変化だけで中毒とは判断しません。'}];
  const startT=mode===3?335:mode===4?235:280;
  const h=mode===1?85:mode===2?12:35;
  const qrs='M25 150H65q15 -28 30 0H145l8 10 8 -100 11 125 11 -35';
  const st=mode===5?`Q220 190 ${startT} 155`:`H${startT}`;
  const t=`C${startT+18} 150 ${startT+24} ${150-h} ${startT+38} ${150-h}S${startT+55} 150 ${startT+80} 150`;
  return <><div className={styles.controls} role="group" aria-label="電解質と薬剤の変化">{choices.map((c,i)=><button key={c.name} type="button" aria-pressed={mode===i} onClick={()=>setMode(i)}>{c.name}</button>)}</div><svg className={styles.diagram} viewBox="0 0 550 225" role="img" aria-label={choices[mode].name+'の模式波形。'+choices[mode].text}><path d="M20 150H530" stroke="#9db4c7" strokeDasharray="5 5"/><path d={qrs+st+t+(mode===2?'h12q24 -48 48 0':'')+'H530'} fill="none" stroke="#0a1f57" strokeWidth="3"/><text x="80" y="116" textAnchor="middle" fontSize="21">P</text><text x="161" y="40" textAnchor="middle" fontSize="21">QRS</text><text x={startT+38} y={140-h} textAnchor="middle" fontSize="21">T</text>{mode===2&&<text x={startT+116} y="115" textAnchor="middle" fontSize="21">U</text>}<text x="270" y="215" textAnchor="middle" fontSize="18">形の比較用・測定には使いません</text></svg><p>{choices[mode].text}</p></>;
}

export function ConditionVisual({kind}:{kind:'bundle'|'ischemia'|'electrolytes'}) {
  return <section className={styles.section}><h2>代表的な波形</h2>{kind==='bundle'?<Bundle/>:kind==='ischemia'?<Territory/>:<Electrolytes/>}</section>;
}
