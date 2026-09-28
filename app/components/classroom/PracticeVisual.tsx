'use client';

import { useState } from 'react';
import { RecordedECGViewer } from './RecordedECGViewer';
import styles from './Classroom.module.css';

export function PracticeVisual() {
  const [step,setStep]=useState(0);
  const [record,setRecord]=useState('00293');
  const steps=[{title:'記録条件',question:'時間と電位の縮尺、誘導名、ノイズは？',hint:'校正と表示条件を確認します。画面上の実寸と紙のmmは同一ではありません。'},{title:'リズム',question:'RRは規則的？ PとQRSはどう並ぶ？',hint:'最初の2.5秒だけでなく、ⅡやV1の全10秒へ切り替えてみましょう。'},{title:'間隔と幅',question:'PR・QRS・QTはどこからどこまで？',hint:'始点・終点が見やすい誘導を選び、他の誘導でも確認します。'},{title:'軸と形',question:'四肢の正負、胸部のR/Sは？',hint:'Ⅰ・aVFの向きを見てから、Ⅱも合わせます。胸部誘導はV1からV6へ順に追います。'},{title:'ST・T・Q',question:'変化はどの誘導にまとまっている？',hint:'基線の揺れと波形を区別し、所見の分布を記述します。'},{title:'言葉にする',question:'観察したことと、まだ分からないことは？',hint:'「ⅡでQRS間隔が一定でない」のように、誘導と具体的所見を分けて書きます。臨床背景がないのに病名を確定しません。'}];
  return <><section className={styles.section}><h2>代表的な波形</h2><div className={styles.controls}><label>練習する記録 <select value={record} onChange={e=>setRecord(e.target.value)}><option value="00293">A：誘導による違い</option><option value="04117">B：間隔の違い</option><option value="00665">C：一拍の違い</option></select></label></div><p className={styles.note}>まず記録全体を見て、下の道順で所見を言葉にしてみましょう。</p></section><RecordedECGViewer key={record} recordId={record} instanceId="practice"/><section className={styles.section}><h2>説明：観察の道順</h2><div className={styles.controls} role="group" aria-label="観察する段階">{steps.map((s,i)=><button type="button" key={s.title} aria-pressed={step===i} onClick={()=>setStep(i)}>{i+1} {s.title}</button>)}</div><div className={styles.point}><h3>{steps[step].question}</h3><p>{steps[step].hint}</p></div></section></>;
}
