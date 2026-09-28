'use client';

import { useState } from 'react';
import styles from './Classroom.module.css';

export function PaperLesson() {
  const [axis, setAxis] = useState<'time' | 'voltage'>('time');
  const [squares, setSquares] = useState(5);
  const gridId = 'classroom-paper-grid';
  const time = (squares * .04).toFixed(2);
  const voltage = (squares * .1).toFixed(1);
  return <section className={styles.section} aria-labelledby="paper-heading">
    <h2 id="paper-heading">横は時間。縦は電位。</h2>
    <div className={styles.twoColumns}><div>
      <svg className={styles.diagram} viewBox="0 0 500 340" role="img" aria-label={`25 mm毎秒、10 mm毎ミリボルト相当の目盛り。${squares}小マスは${axis === 'time' ? `${time}秒` : `${voltage}ミリボルト`}。`}>
        <defs><pattern id={`${gridId}-small`} width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#eed4de" strokeWidth="1" /></pattern><pattern id={`${gridId}-big`} width="100" height="100" patternUnits="userSpaceOnUse"><rect width="100" height="100" fill={`url(#${gridId}-small)`} /><path d="M100 0H0V100" fill="none" stroke="#ce9aae" strokeWidth="1.4" /></pattern></defs>
        <rect x="40" y="20" width="420" height="260" fill={`url(#${gridId}-big)`} rx="3" />
        <path d="M60 240h30V40h100v200h30" fill="none" stroke="#0a1f57" strokeWidth="3" />
        <text x="238" y="53" fontSize="16">校正：1 mV</text><text x="238" y="77" fontSize="15">縦10小マス</text>
        {axis === 'time' ? <><rect x="100" y="260" width={squares * 20} height="20" fill="#f6b83e" opacity=".65" /><path d={`M100 287v13h${squares * 20}v-13`} stroke="#146ed6" fill="none" strokeWidth="3" /><text x="100" y="328" fontSize="18">{squares}小マス = {time}秒</text></> : <><rect x="420" y={260 - squares * 20} width="20" height={squares * 20} fill="#f6b83e" opacity=".65" /><path d={`M446 260h15v-${squares * 20}h-15`} stroke="#146ed6" fill="none" strokeWidth="3" /><text x="190" y="320" fontSize="18">{squares}小マス = {voltage} mV</text></>}
      </svg>
      <div className={styles.controls} role="group" aria-label="測る方向"><button type="button" aria-pressed={axis === 'time'} onClick={() => setAxis('time')}>横：時間</button><button type="button" aria-pressed={axis === 'voltage'} onClick={() => setAxis('voltage')}>縦：電位</button></div>
      <div className={styles.controls}><label>小マスの数 <input type="range" min="1" max="10" value={squares} onChange={(event) => setSquares(Number(event.target.value))} /></label><output>{squares}マス</output></div>
    </div><div>
      <div className={styles.measureReadout}><span>25 mm/s</span><span>10 mm/mV</span></div>
      <ol className={styles.stepList}><li><div><strong>小マスは1 mm</strong><br />横1マスは0.04秒、縦1マスは0.1 mVに相当します。</div></li><li><div><strong>大マスは小マス5つ</strong><br />横0.20秒、縦0.5 mVです。横と縦では単位が違います。</div></li><li><div><strong>はじめに記録条件を確認</strong><br />速度や感度が変わると、同じ波形でも見た目の幅・高さが変わります。</div></li></ol>
      <p className={styles.caution}>この画面の「mm」は紙記録に換算した目盛りです。端末の大きさや拡大率によって、画面上の実寸は変わります。</p>
    </div></div>
  </section>;
}
