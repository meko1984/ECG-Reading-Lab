'use client';

import { useId, useState } from 'react';
import { PACING_FAULTS, pacingModel, pacingSample, type PacingFault, type PacingMode } from '@/app/domain/pacing';
import { LabDisclaimer } from './LabDisclaimer';
import styles from './RhythmLabs.module.css';

export function PacemakerLabClient() {
  const [mode, setMode] = useState<PacingMode>('AV');
  const [fault, setFault] = useState<PacingFault>('normal');
  const [offset, setOffset] = useState(120);
  const [avDelay, setAvDelay] = useState(180);
  const [cursor, setCursor] = useState(1.8);
  const grid = useId().replaceAll(':', '');
  const model = pacingModel({ mode, fault, offset, avDelay });
  const path = Array.from({ length: 2601 }, (_, i) => `${i ? 'L' : 'M'}${(i / 2600 * 780 + 40).toFixed(2)},${(93 - pacingSample(i / 500, model.events) * 43).toFixed(2)}`).join(' ');
  const nearby = model.events.filter(e => Math.abs(e.time - cursor) <= .12);
  const modeName = mode === 'A' ? '心房' : mode === 'V' ? '心室' : '心房＋心室';
  return <div className={styles.lab}>
    <header className={styles.compactHeader}><p className="eyebrow">Pacing / sensing / capture</p><h1>ペースメーカー・刺激と応答ラボ</h1><p className={styles.lead}>刺激する場所と条件を選ぶ → 波形と心臓の応答を比べる。</p></header>
    <div className={`${styles.workspace} ${styles.pacemakerWorkspace}`}>
      <section className={`${styles.panel} ${styles.pacemakerControls}`}><h2>刺激・検出の図</h2>
        <svg viewBox="0 0 420 290" className={`${styles.heart} ${styles.pacemakerHeart}`} role="img" aria-label={`${modeName}の電極と刺激・検出の模式図`}>
          <rect x="20" y="20" width="98" height="62" rx="14" fill="#dce9f5" stroke="#7393ad" /><text x="69" y="46" textAnchor="middle">本体</text><text x="69" y="66" textAnchor="middle" style={{ fontSize: 11 }}>検出 ← → 刺激</text>
          <path d="M213 59C119 7 92 124 160 176L220 256C335 195 369 51 297 41Q248 29 213 59Z" className={styles.chamber} />
          <path d="M211 66L218 230 M139 149Q215 180 309 132" stroke="#b0c6d8" fill="none" strokeWidth="2" />
          <text x="150" y="111">右房 A</text><text x="169" y="209">右室 V</text><text x="260" y="96">左房</text><text x="252" y="192">左室</text>
          {mode !== 'V' && <><path d="M116 41Q177 9 175 130" stroke="#bd6517" strokeWidth="4" fill="none" /><circle cx="175" cy="130" r="8" fill="#bd6517" /><text x="123" y="156">AP → P</text></>}
          {mode !== 'A' && <><path d="M116 60Q156 22 148 96Q129 162 202 223" stroke="#1567ad" strokeWidth="4" fill="none" /><circle cx="202" cy="223" r="8" fill="#1567ad" /><text x="230" y="240">VP → QRS</text></>}
          <text x="19" y="276" style={{ fontSize: 11 }}>従来型経静脈ペーシングの模式図（縮尺なし）</text>
        </svg>
        <div className={styles.pacemakerButtonGroups}>
          <div><h3>刺激する場所</h3><div className={styles.choices}>{([['A', '心房 A'], ['V', '心室 V'], ['AV', '心房＋心室 AV']] as const).map(([value, label]) => <button key={value} aria-pressed={mode === value} onClick={() => setMode(value)}>{label}</button>)}</div></div>
          <div><h3>観察する状態</h3><div className={styles.choices}>{PACING_FAULTS.map(f => <button key={f.id} aria-pressed={fault === f.id} onClick={() => setFault(f.id)}>{f.label}</button>)}</div></div>
        </div>
        <div className={styles.controls}>
          <label className={styles.control}><span>刺激の位置{fault === 'undersense' ? '（自己波の後）' : '（基準から）'}<strong>＋{offset} ms</strong></span><input type="range" min="40" max="400" step="20" value={offset} onChange={e => setOffset(Number(e.target.value))} /></label>
          {mode === 'AV' && fault !== 'undersense' && <label className={styles.control}><span>A→V刺激間隔<strong>{avDelay} ms</strong></span><input type="range" min="100" max="260" step="20" value={avDelay} onChange={e => setAvDelay(Number(e.target.value))} /></label>}
          <button className={styles.resetButton} onClick={() => { setMode('AV'); setFault('normal'); setOffset(120); setAvDelay(180); setCursor(1.8); }}>初期状態へ戻す</button>
        </div>
      </section>
      <section className={`${styles.panel} ${styles.pacemakerOutput}`}><h2>波形と応答</h2>
            <div className={styles.pacingView}><p className={styles.small}>AP／VPのスパイクと、その直後のP・QRSを追う。</p>
      <div className={styles.pacingStrip}><svg viewBox="0 0 850 218" role="img" aria-label={`${model.diagnosis}の波形と刺激・検出マーカー`}>
        <defs><pattern id={grid} width="30" height="20" patternUnits="userSpaceOnUse"><path d="M30 0H0V20" fill="none" stroke="#e2eaf1" strokeWidth=".8" /></pattern></defs><rect x="40" y="18" width="780" height="125" fill={`url(#${grid})`} /><path d={path} className={styles.trace} />
        {model.events.map((e, i) => { const x = 40 + e.time / 5.2 * 780; return <g key={i}>{(e.kind === 'AP' || e.kind === 'VP') && <><path d={`M${x} 93v-64`} stroke={e.kind === 'AP' ? '#bd6517' : '#1567ad'} strokeWidth="1.7" /><text x={x} y={e.kind === 'AP' ? 166 : 188} textAnchor="middle" fill={e.kind === 'AP' ? '#9e5310' : '#1567ad'} fontSize="11">{e.kind}</text></>}{e.kind === 'noise' && <><path d={`M${x - 6} 91l3 -5 3 10 3 -10 3 5`} stroke="#9d4b86" fill="none" /><text x={x} y="188" textAnchor="middle" fill="#9d4b86" fontSize="10">誤検出</text></>}</g>; })}
        <path d={`M${40 + cursor / 5.2 * 780} 16v181`} stroke="#8b3984" strokeDasharray="4 3" strokeWidth="2" /><text x="7" y="166" fontSize="11">A</text><text x="7" y="188" fontSize="11">V</text><text x="40" y="211" fontSize="11">0秒</text><text x="780" y="211" fontSize="11">5.2秒</text>
      </svg></div>
      <label className={styles.control}><span>観察線<strong>{cursor.toFixed(2)} 秒</strong></span><input type="range" min="0" max="5.2" step="0.02" value={cursor} onChange={e => setCursor(Number(e.target.value))} /></label><p aria-live="polite" className={styles.small}>観察線の前後120 ms：{nearby.length ? nearby.map(e => e.label).join(' → ') : 'P・QRS・刺激マーカーなし'}</p>
    </div>
<div className={styles.finding} aria-live="polite"><p className={styles.small}>この図の判定</p><p className={styles.result}>{model.diagnosis}</p><p>{model.evidence}</p></div>
        {fault === 'undersense' && <p className={styles.routeCaption}>{offset < 300 ? '自己波に近い刺激：この例では不応期のため追加の応答なし。これだけで出力不足とは決めない。' : '自己波から離れた刺激：この例では心筋が再び応答。捕捉できても、自己波の見逃しは残る。'}</p>}
      </section>
    </div>
    <details className={`${styles.panel} ${styles.sources}`}><summary>モード・感度・出力の早見</summary><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>項目</th><th>読むポイント</th></tr></thead><tbody><tr><th>AAI / VVI</th><td>刺激部位／検出部位はA＝心房、V＝心室。I＝検出で刺激を抑制。</td></tr><tr><th>DDD</th><td>心房・心室を刺激／検出し、検出に応じて抑制・同期する。AV刺激が毎回出るとは限らない。</td></tr><tr><th>感度（mV）</th><td>設定値を小さくすると小さな信号も検出。小さすぎると雑音の過剰感知、大きすぎると自己波の見逃しにつながりうる。</td></tr><tr><th>出力と捕捉</th><td>出力の振幅・幅と捕捉閾値の関係で心筋の応答が変わる。ここでは機器設定を再現せず、波形の関係を示す。</td></tr><tr><th>「ペーシング不全」</th><td>言葉だけで一括せず「スパイクが出ない出力不全」と「刺激後に応答しない捕捉不全」を分けて観察。</td></tr></tbody></table></div><p className={styles.small}>A・V・AVのボタンは刺激部位を選ぶもの。モード全体の制御、レート応答、融合波、ヒステリシス、CRT、伝導系ペーシング、リードレス機器は再現していない。</p></details>
    <details className={`${styles.panel} ${styles.sources}`}><summary>参考資料とモデルの範囲</summary><p><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5067035/">Pacemaker Troubleshooting: Common Clinical Scenarios</a></p><p><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7192127/">Causes of Failure to Capture in Pacemakers and Implantable Cardioverter-defibrillators</a></p><p className={styles.small}>参照確認：2026-09-27。自動診断器ではなく、選択条件から生成する教材。300 msの応答切替は説明用の仮定で、患者の不応期・捕捉閾値を表さない。実際の判断は機器の設定、心内電位、デバイスチェックと合わせる。</p></details>
    <LabDisclaimer />
  </div>;
}
