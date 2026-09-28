'use client';

import { useEffect, useMemo, useState } from 'react';
import { decodeRecord, displayLead, parseRecordHeader, recordPath, type RecordedECG } from '@/app/domain/recorded-ecg';
import { teachingRecords } from '@/app/content/classroom/records';
import { appPath } from '@/app/domain/paths';
import { ScrollableWaveform } from './ScrollableWaveform';
import styles from './Classroom.module.css';

const assetBase = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const overviewOrder = ['I', 'AVR', 'V1', 'V4', 'II', 'AVL', 'V2', 'V5', 'III', 'AVF', 'V3', 'V6'];

function ECGGrid({ id }: { id: string }) {
  return <defs><pattern id={`${id}-small`} width="4" height="4" patternUnits="userSpaceOnUse"><path d="M4 0H0V4" fill="none" stroke="#edcfdc" strokeWidth=".35" /></pattern><pattern id={`${id}-large`} width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill={`url(#${id}-small)`} /><path d="M20 0H0V20" fill="none" stroke="#ce9aae" strokeWidth=".6" /></pattern></defs>;
}

function Calibration({ x, y }: { x: number; y: number }) {
  return <path d={`M${x} ${y}h4v-40h20v40h4`} fill="none" stroke="#0a1f57" strokeWidth="1.5" />;
}

export function RecordedECGViewer({ recordId = '00293', instanceId = 'record' }: { recordId?: string; instanceId?: string }) {
  const record = teachingRecords[recordId];
  const [data, setData] = useState<RecordedECG | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [lead, setLead] = useState('II');
  const [zoom, setZoom] = useState(1);
  const [annotated, setAnnotated] = useState(true);
  const uid = `ecg-${instanceId}-${recordId}`;
  const base = `${assetBase}/data/ptb-xl/${record.stem}`;

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const [headerResponse, dataResponse] = await Promise.all([fetch(`${base}.hea`, { signal: controller.signal }), fetch(`${base}.dat`, { signal: controller.signal })]);
        if (!headerResponse.ok || !dataResponse.ok) throw new Error('Record request failed');
        const [headerText, bytes] = await Promise.all([headerResponse.text(), dataResponse.arrayBuffer()]);
        const decoded = decodeRecord(parseRecordHeader(headerText), bytes);
        if (!controller.signal.aborted) setData(decoded);
      } catch {
        if (!controller.signal.aborted) setError(true);
      }
    }
    void load();
    return () => controller.abort();
  }, [base, attempt]);

  const drawing = useMemo(() => {
    if (!data) return null;
    // A common vertical extent for every lead. Expand the panel, never shrink only the voltage axis.
    const maxAbs = data.millivolts.reduce((max, samples) => samples.reduce((m, v) => Math.max(m, Math.abs(v)), max), 1.5);
    const halfHeight = Math.ceil(maxAbs * 40 / 20) * 20 + 40;
    const height = halfHeight * 2;
    const channels = overviewOrder.map((name) => {
      const index = data.signals.findIndex((s) => s.name.toUpperCase() === name);
      return { name, path: recordPath(data.millivolts[index], data.sampleRate, 0, 2.5) };
    });
    const index = data.signals.findIndex((s) => s.name.toUpperCase() === lead);
    return { channels, height, halfHeight, strip: recordPath(data.millivolts[index], data.sampleRate, 0, data.sampleCount / data.sampleRate), duration: data.sampleCount / data.sampleRate };
  }, [data, lead]);

  return <section className={styles.section} aria-labelledby={`${uid}-heading`}>
    <h2 id={`${uid}-heading`}>代表的な波形</h2><h3>{record.title}</h3><p>{record.purpose}</p>
    {!data && !error && <p role="status">実記録を読み込んでいます…</p>}
    {error && <div className={styles.error} role="alert"><p>実記録を読み込めませんでした。記録の説明と出典は下で確認できます。</p><button type="button" className={styles.reveal} onClick={() => { setError(false); setAttempt((value) => value + 1); }}>読み込み直す</button></div>}
    {drawing && data && <>
      <p className={styles.caption}>実記録・12誘導 ／ 25 mm/s・10 mm/mV相当 ／ 各誘導の最初の2.5秒を同じ時刻で比較</p>
      <ScrollableWaveform className={styles.paperScroll} ariaLabel="12誘導の全体像。横にスクロールできます">
        <svg className={styles.overview} viewBox={`0 0 1320 ${drawing.height * 3}`} role="img" aria-label="12誘導の同時刻の波形。行はⅠ・aVR・V1・V4、Ⅱ・aVL・V2・V5、Ⅲ・aVF・V3・V6。すべて同じ時間・電位の倍率です。">
          <ECGGrid id={`${uid}-overview`} /><rect width="1320" height={drawing.height * 3} fill={`url(#${uid}-overview-large)`} />
          {drawing.channels.map((channel, index) => <g key={channel.name} transform={`translate(${(index % 4) * 330} ${Math.floor(index / 4) * drawing.height})`}>
            <text x="12" y="25" className={styles.waveText}>{displayLead(channel.name)}</text><text x="245" y="25" className={styles.waveText}>0–2.5 s</text>
            <Calibration x={10} y={drawing.halfHeight} /><path d={channel.path} transform={`translate(65 ${drawing.halfHeight})`} fill="none" stroke="#0a1f57" strokeWidth="1.25" />
            <path d={`M330 0V${drawing.height}M0 ${drawing.height}H330`} stroke="#b8a0ab" fill="none" strokeWidth=".7" />
          </g>)}
        </svg>
      </ScrollableWaveform>
      <div className={styles.controls}><label htmlFor={`${uid}-lead`}>拡大する誘導 <select id={`${uid}-lead`} value={lead} onChange={(event) => setLead(event.target.value)}>{data.signals.map((signal) => <option key={signal.name} value={signal.name.toUpperCase()}>{displayLead(signal.name)}</option>)}</select></label><label htmlFor={`${uid}-zoom`}>拡大率 <select id={`${uid}-zoom`} value={zoom} onChange={(event) => setZoom(Number(event.target.value))}><option value={1}>1倍</option><option value={1.5}>1.5倍</option><option value={2}>2倍</option></select></label><label><input type="checkbox" checked={annotated} onChange={(event) => setAnnotated(event.target.checked)} />目盛り・観察の注釈</label></div>
      <p className={styles.caption}>{displayLead(lead)}誘導・全{drawing.duration}秒。波形の枠を横に動かして観察できます。拡大しても縦横の比率は変わりません。</p>
      <ScrollableWaveform className={styles.paperScroll} ariaLabel={`${displayLead(lead)}誘導の全記録。横スクロールで時間を移動`}>
        <svg className={styles.strip} data-zoom={zoom} width={(drawing.duration * 100 + 100) * zoom} height={(drawing.height + 50) * zoom} viewBox={`0 0 ${drawing.duration * 100 + 100} ${drawing.height + 50}`} role="img" aria-label={`${displayLead(lead)}誘導、${drawing.duration}秒、校正1ミリボルト。小マスは0.04秒と0.1ミリボルト相当。`}>
          <ECGGrid id={`${uid}-strip`} /><rect width={drawing.duration * 100 + 100} height={drawing.height} fill={`url(#${uid}-strip-large)`} />
          <text x="12" y="24" className={styles.waveText}>{displayLead(lead)}</text><Calibration x={12} y={drawing.halfHeight} />
          <path d={drawing.strip} transform={`translate(70 ${drawing.halfHeight})`} fill="none" stroke="#0a1f57" strokeWidth="1.3" />
          {Array.from({ length: Math.floor(drawing.duration) + 1 }, (_, second) => <text key={second} x={70 + second * 100} y={drawing.height + 25} textAnchor="middle" className={styles.waveText}>{second} s</text>)}
          {annotated && <g><path d="M170 37v13h100V37" fill="none" stroke="#146ed6" strokeWidth="2" /><text x="174" y="28" className={styles.waveText}>1秒 = 大マス5つ</text><text x="350" y="28" className={styles.waveText}>校正の高さ：1 mV = 小マス10個</text>
            {record.annotations?.filter(a=>a.lead===lead).map(a=><g key={a.seconds}><line x1={70+a.seconds*100} y1="68" x2={70+a.seconds*100} y2={drawing.height-16} stroke="#8c5a00" strokeDasharray="4 4"/><text x={78+a.seconds*100} y="66" className={styles.waveText}>{a.label}</text></g>)}
          </g>}
        </svg>
      </ScrollableWaveform>
    </>}
    <ol className={styles.stepList} style={{ marginTop: 20 }}>{record.observations.map((observation) => <li key={observation}>{observation}</li>)}</ol>
    <details className={styles.source}><summary>この記録の所見と限界</summary><p>{record.limits}</p><a href={`${base}.json`}>選定時のメタデータ・原ファイルの照合情報</a></details>
    <p className={styles.source}>出典：<a href="https://physionet.org/content/ptb-xl/1.0.3/">PTB-XL v1.0.3（PhysioNet）</a>、記録ID {record.id}。<a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>。数値データから再描画し、配置・拡大・注釈を変更。信号のフィルター処理・振幅の正規化は行っていません。<br /><a href={appPath('/classroom/sources')}>著者・引用・ライセンスの詳細</a> ／ <a href={`https://physionet.org/files/ptb-xl/1.0.3/${record.sourcePath}.hea`}>元レコードのヘッダー</a></p>
  </section>;
}
