'use client';

import { useMemo, useState } from 'react';
import { ElectrodeBodyMap } from '@/app/components/ElectrodeBodyMap';
import { ElectrodeWaveform } from '@/app/components/ElectrodeWaveform';
import { InfoCard } from '@/app/components/InfoCard';
import {
  analyzePlacement,
  CORRECT_PLACEMENT,
  ECG_LEADS,
  ELECTRODES,
  placeElectrode,
  placementForScenario,
  SCENARIOS,
  waveformForScenario,
  type ElectrodeId,
  type ElectrodePlacement,
  type PlacementScenarioId,
} from '@/app/domain/electrodes';

const practiceScenarios = ['correct', 'ra-la', 'ra-ll', 'la-ll', 'v1-v2', 'v1-v2-high'] as const;

export function ElectrodeLabClient() {
  const [placement, setPlacement] = useState<ElectrodePlacement>({ ...CORRECT_PLACEMENT });
  const [selected, setSelected] = useState<ElectrodeId | null>(null);
  const scenario = useMemo(() => analyzePlacement(placement), [placement]);
  const placedElectrodes = new Set(Object.values(placement));

  const applyScenario = (id: (typeof practiceScenarios)[number]) => {
    setPlacement(placementForScenario(id));
    setSelected(null);
  };

  const clearAll = () => {
    setPlacement({});
    setSelected(null);
  };

  const onPlace = (site: Parameters<typeof placeElectrode>[2]) => {
    if (!selected) return;
    setPlacement((current) => placeElectrode(current, selected, site));
    setSelected(null);
  };

  const waveformScenario: PlacementScenarioId = scenario.id === 'incomplete' || scenario.id === 'custom' ? 'correct' : scenario.id;

  return (
    <div className="electrode-lab">
      <p className="page-lead">電極を選んで人体へ装着し、位置やケーブルを間違えたときの12誘導波形をその場で比べます。</p>

      <section className="pac-reading-order" aria-label="電極装着ミスを理解する3つの順番">
        <span><b>1</b>電極を選ぶ</span><span><b>2</b>人体へ装着</span><span><b>3</b>12誘導を比較</span>
      </section>

      <section className="content-card electrode-placement-card" aria-labelledby="electrode-placement-heading">
        <div className="section-heading"><div><p className="eyebrow">10 electrodes → 12 leads</p><h2 id="electrode-placement-heading">電極を人体へつける</h2></div><span className="unit-badge">装着 {placedElectrodes.size}/10</span></div>
        <p className="electrode-interaction-hint">下の電極を1つ選び、人体上の丸を押します。すでに電極がある場所へ置くと、2つが入れ替わります。</p>
        <div className="electrode-tray" aria-label="装着する電極を選ぶ">
          {ELECTRODES.map((electrode) => (
            <button
              type="button"
              key={electrode}
              className={`${selected === electrode ? 'is-selected' : ''} ${placedElectrodes.has(electrode) ? 'is-placed' : ''}`}
              onClick={() => setSelected(electrode)}
              aria-pressed={selected === electrode}
            >
              <strong>{electrode}</strong><span>{placedElectrodes.has(electrode) ? '装着中' : '未装着'}</span>
            </button>
          ))}
        </div>
        <ElectrodeBodyMap placement={placement} selected={selected} onPlace={onPlace} />
        <details className="electrode-placement-guide" open>
          <summary>正しい装着位置を確認</summary>
          <dl>
            <div><dt>RA・LA・RL・LL</dt><dd>肩や腰の体幹ではなく、左右の上肢・下肢。図では前腕側と下腿側に置いています。</dd></div>
            <div><dt>V1・V2</dt><dd>第4肋間の胸骨右縁・左縁。</dd></div>
            <div><dt>V4</dt><dd>第5肋間・左鎖骨中線。V3はV2とV4の中間。</dd></div>
            <div><dt>V5・V6</dt><dd>V4と同じ高さで、左前腋窩線・左中腋窩線。</dd></div>
          </dl>
        </details>
        <div className="electrode-actions">
          <button type="button" onClick={() => applyScenario('correct')}>正しく装着</button>
          <button type="button" className="is-secondary" onClick={clearAll}>全部外して練習</button>
        </div>
      </section>

      <section className={`electrode-result ${scenario.id === 'correct' ? 'is-correct' : 'is-error'}`} aria-live="polite">
        <p>{scenario.shortLabel}</p><h2>{scenario.title}</h2><span>{scenario.summary}</span><small>{scenario.clue}</small>
      </section>

      <section className="content-card electrode-wave-card" aria-labelledby="electrode-wave-heading">
        <div className="section-heading"><div><p className="eyebrow">同じ心臓、違う配線</p><h2 id="electrode-wave-heading">12誘導はどう変わる？</h2></div></div>
        <div className="electrode-wave-legend"><span><i />現在の波形</span><span><i className="is-normal" />正しい装着時</span></div>
        <div className="electrode-wave-grid-layout">
          {ECG_LEADS.map((lead) => {
            const changed = scenario.affectedLeads.includes(lead) && scenario.id !== 'incomplete' && scenario.id !== 'custom';
            const unavailableReason = scenario.id === 'incomplete' ? 'disconnected' : scenario.id === 'custom' ? 'unsupported' : undefined;
            const pWaveShape = scenario.id === 'v1-v2-high' && lead === 'V1' ? 'biphasic' : 'single';
            return <ElectrodeWaveform key={lead} lead={lead} normal={waveformForScenario(lead, 'correct')} current={waveformForScenario(lead, waveformScenario)} changed={changed} unavailableReason={unavailableReason} pWaveShape={pWaveShape} />;
          })}
        </div>
        <p className="electrode-wave-note">10電極がそろうと測定できます。色のついた枠が変化した誘導で、細い点線は正しい装着時、濃い線は現在の配置です。</p>
      </section>

      <section className="content-card electrode-presets" aria-labelledby="electrode-presets-heading">
        <div className="section-heading"><div><p className="eyebrow">すぐ比較する</p><h2 id="electrode-presets-heading">よくある間違いを体験</h2></div></div>
        <div>
          {practiceScenarios.map((id) => (
            <button type="button" key={id} className={scenario.id === id ? 'is-active' : ''} onClick={() => applyScenario(id)}>{SCENARIOS[id].shortLabel}</button>
          ))}
        </div>
      </section>

      <InfoCard title="この波形は患者の実記録ではありません">
        <p>四肢電極の交換は誘導の電位関係に沿って組み替えています。V1・V2高位装着は代表的な変化を強調した学習モデルで、体格や心臓の向きによる個人差までは再現しません。実際に不自然な波形を見たときは、診断を決める前に電極位置とケーブルを確認し、必要なら正しく付け直して再記録します。</p>
      </InfoCard>

      <details className="pvc-sources"><summary>正確さの範囲と参考文献</summary><p>右足（RL）の交換、接触不良、筋電図・交流障害、複数の同時ミスは簡易モデル外です。胸部電極は正面の位置関係を理解するために模式化しています。</p><ul><li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10685096/" target="_blank" rel="noreferrer">四肢電極交換の誘導対応と胸部電極位置異常のレビュー</a></li><li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6932211/" target="_blank" rel="noreferrer">心電図記録時の技術的ミス</a></li><li><a href="https://www.ahajournals.org/doi/10.1161/CIRCULATIONAHA.106.180200" target="_blank" rel="noreferrer">AHA/ACCF/HRS 12誘導心電図標準化勧告</a></li></ul></details>
    </div>
  );
}
