'use client';

import { useState } from 'react';
import { TACHY_CASES, FLUTTER_CASES, rhythmTiming, type RhythmId } from '@/app/domain/tachycardia';
import { RhythmHeart } from './RhythmHeart';
import { RhythmWaveforms } from './RhythmWaveforms';
import { LabDisclaimer } from './LabDisclaimer';
import styles from './RhythmLabs.module.css';

export function TachycardiaLabClient({ flutter = false }: { flutter?: boolean }) {
  const [id, setId] = useState<RhythmId>(flutter ? 'common' : 'avnrt');
  const [rate, setRate] = useState(flutter ? 300 : 180);
  const [conduction, setConduction] = useState(2);
  const [overlay, setOverlay] = useState(true);
  const cases = flutter ? FLUTTER_CASES : TACHY_CASES;
  const current = cases.find(c => c.id === id)!;
  const timing = rhythmTiming(id, rate, conduction);
  const reset = () => { setId(flutter ? 'common' : 'avnrt'); setRate(flutter ? 300 : 180); setConduction(2); setOverlay(true); };
  const tips = flutter ? [
    ['① 下壁誘導＋V1', 'F波の極性・連続性を比較。通常型は下壁陰性、V1陽性が典型。'],
    ['② 心房数と心室数', '伝導比を変えて隠れたF波を追う。心室レートだけで診断しない。'],
    ['③ 波形から回路へ', '手術・アブレーション歴を確認。非典型波形＝必ずCTI非依存、ではない。'],
  ] : [
    ['① P′を探す', 'Ⅱ・Ⅲ・aVFとV1に注目。QRSに重なるか、後ろか、次のQRSの前か。'],
    ['② RPとPRを比べる', '短いRPは通常型AVNRTや正方向性AVRTの手掛かり。長いRPではAT、非通常型AVNRT、遅伝導性副伝導路も考える。'],
    ['③ 心房と心室の独立性', '房室ブロック中も心房頻拍が続けばAT・AFLを支持。AVNRTの例外もあり、1所見だけで決めない。'],
  ];
  return <div className={`${styles.lab} ${styles.rhythmLab}`}>
    <header className={styles.compactHeader}><p className="eyebrow">{flutter ? 'Atrial flutter / circuit & conduction' : 'SVT / circuit & P′ wave'}</p><h1>{flutter ? '心房粗動・回旋ラボ' : '上室頻拍・回路ラボ'}</h1><p className={styles.lead}>部位を選ぶ → 興奮の道筋 → 12誘導を比べる。</p></header>
    <div className={`${styles.workspace} ${styles.rhythmWorkspace}`}>
      <section className={`${styles.panel} ${styles.rhythmControls}`} aria-label="回路と操作">
        <h2>{flutter ? '回る場所・方向' : '回路・焦点'}</h2>
        <RhythmHeart id={id} flutter={flutter} onSelect={setId} />
        <div className={`${styles.choices} ${styles.rhythmChoices}`}>{cases.map(c => <button key={c.id} aria-pressed={id === c.id} onClick={() => setId(c.id)}>{c.name}</button>)}</div>
        <p className={styles.routeCaption}>{current.route}</p>
        <div className={`${styles.controls} ${styles.rhythmSettings}`}>
          <label className={styles.control}><span>{flutter ? '心房レート' : '頻拍レート'}<strong>{rate} /分</strong></span><input type="range" min={flutter ? 240 : 140} max={flutter ? 340 : 220} step="10" value={rate} onChange={e => setRate(Number(e.target.value))} /></label>
          {flutter && <div className={styles.conductionControl}><span>房室伝導比</span><div className={styles.choices}>{[2, 3, 4].map(n => <button key={n} aria-pressed={conduction === n} onClick={() => setConduction(n)}>{n}：1</button>)}</div></div>}
          <div className={styles.utilityRow}><label><input type="checkbox" checked={overlay} onChange={e => setOverlay(e.target.checked)} /> 心房成分</label><button onClick={reset}>初期状態へ戻す</button></div>
        </div>
        <div className={styles.finding} aria-live="polite"><div className={styles.findingTitle}><h3>{current.name}</h3><span className={styles.badge}>心室 {Math.round(timing.ventricularRate)} /分</span></div><p>{current.clue}</p></div>
      </section>
      <section className={`${styles.panel} ${styles.rhythmOutput}`}><h2>12誘導：{flutter ? 'F波とQRS' : 'P′とQRS'}</h2><RhythmWaveforms id={id} rate={rate} conduction={conduction} overlay={overlay} /></section>
    </div>
    <details className={`${styles.panel} ${styles.sources} ${styles.supportDetails}`}><summary>鑑別の見方とタイミング図</summary>
      <div className={styles.supportGrid}><div>{flutter ? <FlutterTiming conduction={conduction} /> : <SVTTiming id={id} rr={timing.rr} rp={timing.rp} />}<p className={styles.small}>{flutter ? '2：1ではF波の一部がQRSやT波に隠れる。心室150/分の規則正しい頻拍でも粗動を考える。' : 'QRS開始から次のP′までをRP、P′から次のQRSまでをPRとして模式表示。典型例の位置関係であり、固定の診断閾値ではない。'}</p></div><div className={styles.cards}>{tips.map(([title, detail]) => <article key={title} className={styles.mini}><b>{title}</b><p>{detail}</p></article>)}</div></div>
      <p className={styles.small}>{current.limit}</p>
    </details>
    <details className={`${styles.panel} ${styles.sources}`}><summary>比較表・用語・鑑別の限界</summary>
      <div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>比較</th><th>機序・回路</th><th>波形の手掛かり</th></tr></thead><tbody>
        {flutter ? <><tr><th>Common</th><td>CTI依存・反時計回り</td><td>下壁陰性の鋸歯状F波</td></tr><tr><th>Reverse common</th><td>CTI依存・時計回り</td><td>下壁陽性、V1陰性の代表例</td></tr><tr><th>Atypical</th><td>CTI非依存の大きなリエントリーなど</td><td>形は多様。マッピングで回路確認</td></tr></> : <><tr><th>AVNRT</th><td>房室結節近傍の二重伝導路</td><td>通常型ではP′がQRSに近い</td></tr><tr><th>AVRT</th><td>房室結節＋副伝導路。図は正方向性</td><td>QRS後の逆行性P′。デルタ波がない例も</td></tr><tr><th>Focal AT</th><td>心房内の焦点が頻拍を駆動</td><td>P′の形・等電位線・房室関係</td></tr></>}
      </tbody></table></div>
      <p>{flutter ? '「anti common」はこのページでは分類名に使わず、通常型・逆通常型・非通常型に整理した。非通常型は左房だけとは限らない。' : 'AVNRT＝房室結節リエントリー性頻拍、AVRT＝房室回帰性頻拍、AT＝心房頻拍。P′は洞性P波とは異なる心房波。逆方向性AVRT、脚ブロックを伴う幅広いQRS、心房細動はこのモデルの対象外。'}</p>
      <p>薬剤への反応だけで確定しない。確定診断には12誘導の実記録、発症・停止時の所見、必要に応じて電気生理検査を合わせる。</p>
    </details>
    <details className={`${styles.panel} ${styles.sources}`}><summary>参考資料とモデルの範囲</summary><p><a href="https://academic.oup.com/eurheartj/article/41/5/655/5556821">2019 ESC Guidelines: supraventricular tachycardia</a> — 鑑別・AVNRT・AVRT・focal AT・心房粗動の節。</p>{flutter && <p><a href="https://academic.oup.com/europace/article/10/7/786/397570">Prediction of the atrial flutter circuit location from the surface electrocardiogram</a> — F波と回路推定の限界。</p>}<p className={styles.small}>参照確認：2026-09-27。図と波形は独自に描いた代表モデル。心房起源や副伝導路位置の精密な逆推定・個別患者の診断は行わない。</p></details>
    <LabDisclaimer />
  </div>;
}

function SVTTiming({ id, rr, rp }: { id: RhythmId; rr: number; rp: number }) {
  const x = 80 + rp / rr * 430;
  return <svg viewBox="0 0 600 165" className={styles.timeline} role="img" aria-label={`QRS後${Math.round(rp * 1000)}ミリ秒にP′がある代表例`}>
    <text x="12" y="42">心房</text><text x="12" y="100">心室</text><path d="M70 40H550 M70 98H550" stroke="#c5d5e3" />
    <circle cx={x} cy="40" r="9" fill="#bd6517" /><text x={x} y="23" textAnchor="middle">P′</text>
    {[80, 510].map(q => <g key={q}><rect x={q - 6} y="86" width="12" height="24" rx="3" fill="#1567ad" /><text x={q} y="129" textAnchor="middle">QRS</text></g>)}
    <path d={`M80 64H${x}`} stroke="#bd6517" strokeWidth="3" /><path d={`M${x} 72H510`} stroke="#1567ad" strokeWidth="3" />
    <text x="160" y="154">RP ≈ {Math.round(rp * 1000)} ms</text><text x="345" y="154">PR ≈ {Math.round((rr - rp) * 1000)} ms</text>
    <text x="580" y="23" textAnchor="end">{id === 'avnrt' ? 'QRSに重なる' : id === 'avrt' ? '心室から戻る' : '焦点から心房が先行'}</text>
  </svg>;
}
function FlutterTiming({ conduction }: { conduction: number }) {
  return <svg viewBox="0 0 600 150" className={styles.timeline} role="img" aria-label={`心房${conduction}回につき心室1回の伝導`}><text x="12" y="43">心房</text><text x="12" y="105">心室</text><path d="M70 40H560 M70 100H560" stroke="#c5d5e3" />{Array.from({ length: 8 }, (_, i) => <g key={i}><circle cx={85 + i * 64} cy="40" r="7" fill="#bd6517" /><text x={85 + i * 64} y="22" textAnchor="middle">F</text>{i % conduction === 0 ? <><path d={`M${85 + i * 64} 49v38`} stroke="#1567ad" strokeWidth="2" /><rect x={79 + i * 64} y="90" width="12" height="20" fill="#1567ad" /></> : <text x={85 + i * 64} y="77" textAnchor="middle">×</text>}</g>)}<text x="80" y="138">×：この興奮は心室へ伝わらない（房室結節での伝導を簡略化）</text></svg>;
}
