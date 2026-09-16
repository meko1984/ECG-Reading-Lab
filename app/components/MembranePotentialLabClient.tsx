'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  actionPotentialAt,
  chlorideTransportAt,
  CYCLE_MS,
  createMembraneModel,
  ecgLeadIIAt,
  ELECTROLYTE_META,
  ELECTROLYTES,
  levelLabel,
  NORMAL_ELECTROLYTES,
  PHASE_INFO,
  phaseAt,
  sampleSeries,
  type ActionPhase,
  type ElectrolyteId,
  type ElectrolyteSettings,
  type MembraneModel,
} from '@/app/domain/membrane-potential';
import styles from './MembranePotentialLab.module.css';

const CHART = { left: 52, right: 748, top: 18, bottom: 202 };
const xForTime = (time: number) => CHART.left + (time / CYCLE_MS) * (CHART.right - CHART.left);
const pathFromSeries = (points: Array<{ time: number; value: number }>, yForValue: (value: number) => number) =>
  points.map((point, index) => `${index === 0 ? 'M' : 'L'}${xForTime(point.time).toFixed(1)} ${yForValue(point.value).toFixed(1)}`).join(' ');

function SyncedChart({ kind, time, settings, model }: { kind: 'ap' | 'ecg'; time: number; settings: ElectrolyteSettings; model: MembraneModel }) {
  const isAp = kind === 'ap';
  const yForValue = isAp
    ? (value: number) => CHART.bottom - ((value + 110) / 155) * (CHART.bottom - CHART.top)
    : (value: number) => 118 - value * 70;
  const points = useMemo(
    () => sampleSeries(isAp ? (t) => actionPotentialAt(t, model) : (t) => ecgLeadIIAt(t, settings, model)),
    [isAp, model, settings],
  );
  const value = isAp ? actionPotentialAt(time, model) : ecgLeadIIAt(time, settings, model);
  const cursorX = xForTime(time);
  const cursorY = yForValue(value);
  const phaseBoundaries = [model.depolarizationStart, model.upstrokeEnd, model.notchEnd, model.plateauEnd, model.repolarizationEnd];
  return (
    <svg className={styles.chart} viewBox="0 0 780 230" role="img" aria-label={isAp ? `心室筋細胞の活動電位。現在${Math.round(value)}ミリボルト` : '現在の電解質条件によるⅡ誘導の模式心電図'}>
      <rect x="52" y="18" width="696" height="184" rx="7" className={styles.chartFrame} />
      {[0, 225, 450, 675, 900].map((tick) => <line key={tick} x1={xForTime(tick)} x2={xForTime(tick)} y1="18" y2="202" className={styles.gridLine} />)}
      {isAp ? [-100, -50, 0].map((tick) => <g key={tick}><line x1="52" x2="748" y1={yForValue(tick)} y2={yForValue(tick)} className={styles.gridLine} /><text x="46" y={yForValue(tick) + 4} textAnchor="end" className={styles.axisLabel}>{tick}</text></g>) : <line x1="52" x2="748" y1={yForValue(0)} y2={yForValue(0)} className={styles.baseline} />}
      {isAp && phaseBoundaries.slice(0, -1).map((boundary, index) => <text key={boundary} x={xForTime(boundary) + 5} y="34" className={styles.phaseLabel}>{index}</text>)}
      <path d={pathFromSeries(points, yForValue)} className={isAp ? styles.apTrace : styles.ecgTrace} />
      <line x1={cursorX} x2={cursorX} y1="18" y2="202" className={styles.cursor} />
      <circle cx={cursorX} cy={cursorY} r="5.5" className={styles.cursorDot} />
      {[0, 225, 450, 675, 900].map((tick) => <text key={tick} x={xForTime(tick)} y="221" textAnchor="middle" className={styles.axisLabel}>{tick}</text>)}
      <text x="16" y="112" transform="rotate(-90 16 112)" textAnchor="middle" className={styles.axisLabel}>{isAp ? '膜電位 (mV)' : '電位 (模式)'}</text>
      <text x="400" y="228" textAnchor="middle" className={styles.axisLabel}>時間 (ms)</text>
    </svg>
  );
}

const outsidePositions: Record<ElectrolyteId, Array<[number, number]>> = {
  na: [[78, 62], [132, 94], [205, 58], [262, 96], [346, 62], [408, 92], [520, 62]],
  k: [[102, 110], [185, 140], [274, 116], [372, 140], [480, 119], [586, 138], [550, 150]],
  cl: [[455, 76], [565, 94], [652, 62], [710, 100], [394, 54], [600, 48], [494, 105]],
  ca: [[305, 70], [370, 102], [430, 70], [510, 105], [583, 72], [750, 50], [338, 50]],
  mg: [[690, 66], [720, 92], [740, 150], [628, 82], [704, 44], [622, 48], [742, 68]],
};

const insidePositions: Record<ElectrolyteId, Array<[number, number]>> = {
  na: [[152, 298], [236, 340], [535, 304], [622, 342], [334, 374], [450, 310], [700, 370]],
  k: [[78, 300], [135, 352], [205, 350], [310, 350], [415, 292], [526, 354], [735, 295]],
  cl: [[250, 380], [570, 386], [745, 360], [95, 385], [390, 340], [480, 390], [610, 310]],
  ca: [[405, 330], [585, 320], [700, 350], [175, 380], [440, 370], [282, 285], [500, 330]],
  mg: [[112, 314], [292, 380], [478, 285], [612, 375], [728, 322], [380, 310], [205, 320]],
};

function IonDot({ ion, x, y }: { ion: ElectrolyteId; x: number; y: number }) {
  const meta = ELECTROLYTE_META[ion];
  return <g><circle cx={x} cy={y} r="14" className={styles.ion} fill={meta.color} /><text x={x} y={y + 1} className={styles.ionText}>{meta.symbol.replace(/[⁺⁻²]/g, '')}</text></g>;
}

// Position is derived only from the shared time, so scrubbing backwards retraces
// the same representative trajectory. No independent animation clock is used.
function TravelingIons({ ion, time, start, end, x, inward }: { ion: ElectrolyteId; time: number; start: number; end: number; x: number; inward: boolean }) {
  if (time < start || time >= end) return null;
  const progress = (time - start) / (end - start);
  return <g data-transport={ion}>{[-0.12, 0, 0.12].map((offset, index) => {
    const position = Math.min(1, Math.max(0, progress * 1.24 - offset - 0.12));
    const y = inward ? 132 + position * 160 : 292 - position * 160;
    return <g key={index} data-particle={index}><IonDot ion={ion} x={x + (index - 1) * 15} y={y} /></g>;
  })}</g>;
}

function CellMembrane({ phase, settings, time, model }: { phase: ActionPhase; settings: ElectrolyteSettings; time: number; model: MembraneModel }) {
  const flows = PHASE_INFO[phase].flows;
  const chloride = chlorideTransportAt(time, settings, model);
  const countFor = (id: ElectrolyteId) => Math.round(5 + settings[id] * 2);
  return (
    <svg className={styles.cellSvg} viewBox="0 0 780 430" role="img" aria-label={`${PHASE_INFO[phase].title}。${PHASE_INFO[phase].short}`}>
      <defs><marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0 0 L0 6 L7 3 Z" fill="context-stroke" /></marker></defs>
      <rect width="780" height="180" className={styles.outside} /><rect y="240" width="780" height="190" className={styles.inside} />
      <text x="18" y="28" className={styles.zoneLabel}>細胞外</text><text x="18" y="270" className={styles.zoneLabel}>細胞内</text>
      <rect y="180" width="780" height="60" className={styles.membrane} />
      {ELECTROLYTES.flatMap((ion) => outsidePositions[ion].slice(0, countFor(ion)).map(([x, y], index) => <IonDot key={`o-${ion}-${index}`} ion={ion} x={x} y={y} />))}
      {ELECTROLYTES.flatMap((ion) => insidePositions[ion].slice(0, ion === 'k' ? 7 : 3).map(([x, y], index) => <IonDot key={`i-${ion}-${index}`} ion={ion} x={x} y={y} />))}
      {([['na', 180], ['ca', 355], ['k', 530], ['cl', 665]] as Array<[ElectrolyteId, number]>).map(([ion, x]) => <g key={ion} style={{ color: ELECTROLYTE_META[ion].color }}><rect x={x - 25} y="168" width="50" height="84" rx="20" className={styles.channel} /><line x1={x - 12} x2={x + 12} y1="210" y2={phase === 4 && ion !== 'cl' ? '210' : '199'} className={styles.channelGate} /><text x={x} y="221" textAnchor="middle" className={styles.channelLabel}>{ELECTROLYTE_META[ion].symbol}</text></g>)}
      <g><rect x="63" y="176" width="72" height="70" rx="25" className={styles.pump} /><text x="99" y="205" className={styles.pumpText}>Na/K</text><text x="99" y="220" className={styles.pumpText}>ポンプ</text></g>
      {flows.includes('na-in') && <path d="M180 125 V290" className={styles.flow} stroke={ELECTROLYTE_META.na.color} />}
      {flows.includes('ca-in') && <path d="M355 125 V290" className={styles.flow} stroke={ELECTROLYTE_META.ca.color} />}
      {flows.includes('k-out') && <path d="M530 292 V124" className={styles.flow} stroke={ELECTROLYTE_META.k.color} />}
      {flows.includes('pump') && <><path d="M85 285 V135" className={styles.flow} stroke={ELECTROLYTE_META.na.color} /><path d="M116 135 V285" className={styles.flow} stroke={ELECTROLYTE_META.k.color} /></>}
      <TravelingIons ion="na" time={time} start={model.depolarizationStart} end={model.upstrokeEnd} x={180} inward />
      <TravelingIons ion="ca" time={time} start={model.notchEnd} end={model.plateauEnd} x={355} inward />
      <TravelingIons ion="k" time={time} start={model.upstrokeEnd} end={model.repolarizationEnd} x={530} inward={false} />
      <path d={chloride.inward ? 'M665 125 V290' : 'M665 292 V124'} className={styles.flow} stroke={ELECTROLYTE_META.cl.color} />
      <TravelingIons ion="cl" time={time} start={chloride.start} end={chloride.end} x={665} inward={chloride.inward} />
      <text x="665" y="419" textAnchor="middle" className={styles.roleLabel}>Cl：{chloride.inward ? '流入' : '流出'}（開いた場合）</text>
      <g className={styles.mgRelation}>
        <path d="M250 282 L99 252 M300 282 L355 252" />
        <rect x="232" y="258" width="88" height="66" rx="12" className={styles.mgBadge} />
        <circle cx="275" cy="282" r="18" fill={ELECTROLYTE_META.mg.color} />
        <text x="275" y="283" className={styles.ionText}>Mg</text>
        <text x="275" y="314" textAnchor="middle" className={styles.roleLabel}>調節・Mg–ATP</text>
        <text x="99" y="278" textAnchor="middle" className={styles.roleLabel}>ポンプを支える</text>
        <text x="415" y="270" textAnchor="middle" className={styles.roleLabel}>Ca電流を調節</text>
      </g>
    </svg>
  );
}

export function MembranePotentialLabClient() {
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [settings, setSettings] = useState<ElectrolyteSettings>({ ...NORMAL_ELECTROLYTES });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const model = useMemo(() => createMembraneModel(settings), [settings]);
  const phase = phaseAt(time, model);
  const phaseInfo = PHASE_INFO[phase];
  const membraneValue = actionPotentialAt(time, model);
  const phaseSegments = [
    { label: '静止', start: 0, end: model.depolarizationStart },
    { label: '0', start: model.depolarizationStart, end: model.upstrokeEnd },
    { label: '1', start: model.upstrokeEnd, end: model.notchEnd },
    { label: '2', start: model.notchEnd, end: model.plateauEnd },
    { label: '3', start: model.plateauEnd, end: model.repolarizationEnd },
    { label: '静止', start: model.repolarizationEnd, end: CYCLE_MS + 1 },
  ];

  useEffect(() => {
    if (!playing) return;
    intervalRef.current = setInterval(() => setTime((current) => current >= CYCLE_MS ? 0 : current + 6), 30);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing]);

  const updateSetting = (ion: ElectrolyteId, value: number) => setSettings((current) => ({ ...current, [ion]: value }));

  return (
    <div className={styles.lab}>
      <p className={styles.intro}>時間を動かす → 膜・活動電位・Ⅱ誘導が同じ瞬間へ。</p>
      <section className={styles.timelineCard} aria-label="1拍の時間操作">
        <div className={styles.timelineTop}>
          <button type="button" className={styles.play} onClick={() => setPlaying((value) => !value)} aria-label={playing ? '停止' : '再生'}>{playing ? 'Ⅱ' : '▶'}</button>
          <div className={styles.timelineLabels} aria-live="polite"><strong>{phaseInfo.title}</strong><span>{Math.round(time)} ms・{Math.round(membraneValue)} mV</span></div>
        </div>
        <input className={styles.timeRange} type="range" min="0" max={CYCLE_MS} step="2" value={time} onChange={(event) => { setPlaying(false); setTime(Number(event.target.value)); }} aria-label="1拍の時刻" />
        <div className={styles.phaseTrack} aria-hidden="true">{phaseSegments.map((segment) => <span key={`${segment.label}-${segment.start}`} style={{ flex: Math.max(1, segment.end - segment.start) }} className={time >= segment.start && time < segment.end ? styles.active : ''}>{segment.label}</span>)}</div>
      </section>

      <section className={styles.electrolyteCard} aria-labelledby="electrolyte-heading">
        <div className={styles.cardHeading}><div><h2 id="electrolyte-heading">細胞外の電解質</h2><p>低 ↔ 高（相対的な学習設定）</p></div><button type="button" className={styles.reset} onClick={() => setSettings({ ...NORMAL_ELECTROLYTES })}>基準へ戻す</button></div>
        <div className={styles.electrolytes}>
          {ELECTROLYTES.map((ion) => { const meta = ELECTROLYTE_META[ion]; return (
            <label key={ion} className={styles.electrolyte} style={{ '--ion': meta.color } as React.CSSProperties}>
              <span className={styles.ionTitle}><strong>{meta.symbol}</strong><output>{levelLabel(settings[ion])}</output></span>
              <input type="range" min="-1" max="1" step="0.5" value={settings[ion]} onChange={(event) => updateSetting(ion, Number(event.target.value))} aria-label={`${meta.name}濃度`} />
              <span className={styles.rangeEnds}><span>低</span><span>基準</span><span>高</span></span>
            </label>
          ); })}
        </div>
      </section>

      <div className={styles.visualGrid}>
        <section className={`${styles.panel} ${styles.cellPanel}`} aria-labelledby="cell-heading">
          <div className={styles.panelHeader}><h2 id="cell-heading">細胞膜</h2><span>{phaseInfo.short}</span></div>
          <CellMembrane phase={phase} settings={settings} time={time} model={model} />
          <div className={styles.legend}>{ELECTROLYTES.map((ion) => <span key={ion} style={{ '--ion': ELECTROLYTE_META[ion].color } as React.CSSProperties}><i />{ELECTROLYTE_META[ion].symbol}</span>)}</div>
          <p className={styles.particleNote}>粒の移動は代表例。Clは開いた場合の方向、Mgは調節を表示。</p>
        </section>
        <section className={styles.panel} aria-labelledby="ap-heading">
          <div className={styles.panelHeader}><h2 id="ap-heading">心室筋の膜電位</h2><span>静止 {Math.round(model.restingPotential)} mV</span></div>
          <SyncedChart kind="ap" time={time} settings={settings} model={model} />
        </section>
        <section className={styles.panel} aria-labelledby="ecg-heading">
          <div className={styles.panelHeader}><h2 id="ecg-heading">心電図・Ⅱ誘導</h2><span>代表波形</span></div>
          <SyncedChart kind="ecg" time={time} settings={settings} model={model} />
        </section>
      </div>
      <p className={styles.linkedMessage}><i />赤いカーソルが3つの図の同じ時刻。電解質を動かすと、膜電位とⅡ誘導も同時に変わる。</p>

      <details className={styles.limits}>
        <summary>モデルの範囲・参考文献</summary>
        <p>心室筋細胞1個の代表的な活動電位と体表Ⅱ誘導を対応させた模式図。体表心電図は多数の細胞と伝導系の合成なので、細胞1個の電位と同じ波形ではない。K⁺とCa²⁺の典型的な方向を強調し、Na⁺・Cl⁻・Mg²⁺は根拠の不確実さに合わせて変化を小さくしている。濃度値、重症度、疾患、治療判断には使えない。</p>
        <p>粒子の移動速度・個数は実測値ではなく、膜を通る向きを見るための模式表現。濃度操作は細胞外の条件を変え、細胞内の粒数が即座に逆向きに変わる表現はしない。ポンプは活動電位の各相を通じて働くが、図の矢印は静止期に代表表示している。Clはチャネルが開いていると仮定した方向の模式表示。細胞内Clを固定し、基準のCl平衡電位を−50 mV、細胞外Cl操作を基準の±25％と仮定している。膜電位がCl平衡電位より高いと流入、低いと流出を示す。実際の開閉や流量は再現していない。MgはCa電流の調節とMg–ATPの関与を点線で示す（移動経路や結合の再現ではない）。Mgの濃度による波形変化には仮の設定を含み、実際の変化量を予測するものではない。</p>
        <ul>
          <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7935690/" target="_blank" rel="noreferrer">心室筋活動電位の相と主要イオン電流</a></li>
          <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5399982/" target="_blank" rel="noreferrer">低K・高Kの電気生理</a></li>
          <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6931435/" target="_blank" rel="noreferrer">Ca異常とQT/ST変化</a></li>
          <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7873644/" target="_blank" rel="noreferrer">単独低Mgと再分極指標</a></li>
          <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC1664853/" target="_blank" rel="noreferrer">細胞内MgによるL型Ca電流の調節</a></li>
          <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC2216356/" target="_blank" rel="noreferrer">Cl濃度差と膜電位による電流の変化</a></li>
          <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC3110595/" target="_blank" rel="noreferrer">心室筋モデルとCl電流の限界</a></li>
        </ul>
      </details>
    </div>
  );
}
