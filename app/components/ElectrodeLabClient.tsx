'use client';

import { useMemo, useState } from 'react';
import { ElectrodeBodyMap, type ElectrodeMapView } from '@/app/components/ElectrodeBodyMap';
import { ElectrodeWaveform } from '@/app/components/ElectrodeWaveform';
import { LabDisclaimer } from '@/app/components/LabDisclaimer';
import {
  analyzePlacement,
  CORRECT_PLACEMENT,
  ECG_LEADS,
  ELECTRODES,
  POSTERIOR_LEADS,
  RIGHT_CHEST_LEADS,
  placeElectrode,
  placementForScenario,
  SCENARIOS,
  waveformForScenario,
  type ElectrodeId,
  type ElectrodePlacement,
  type ECGLead,
  type PlacementScenarioId,
} from '@/app/domain/electrodes';

const practiceScenarios = ['correct', 'ra-la', 'ra-ll', 'la-ll', 'v1-v2', 'v1-v2-high'] as const;
type PresetScenarioId = (typeof practiceScenarios)[number] | 'right-sided' | 'posterior';

export function ElectrodeLabClient() {
  const [placement, setPlacement] = useState<ElectrodePlacement>({ ...CORRECT_PLACEMENT });
  const [selected, setSelected] = useState<ElectrodeId | null>(null);
  const [mapView, setMapView] = useState<ElectrodeMapView>('standard');
  const scenario = useMemo(() => analyzePlacement(placement), [placement]);
  const placedElectrodes = new Set(Object.values(placement));

  const applyScenario = (id: PresetScenarioId) => {
    setPlacement(placementForScenario(id));
    setSelected(null);
    setMapView(id === 'right-sided' ? 'right' : id === 'posterior' ? 'back' : 'standard');
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
  const displayedLeads: ECGLead[] = scenario.id === 'right-sided'
    ? ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', ...RIGHT_CHEST_LEADS]
    : scenario.id === 'posterior'
      ? ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', ...POSTERIOR_LEADS]
      : [...ECG_LEADS];

  return (
    <div className="electrode-lab">
      <p className="page-lead">電極を選ぶ → 人体に置く → 波形を比べる。</p>

      <section className="pac-reading-order" aria-label="電極装着ミスを理解する3つの順番">
        <span><b>1</b>電極を選ぶ</span><span><b>2</b>人体へ装着</span><span><b>3</b>12誘導を比較</span>
      </section>

      <section className="content-card electrode-placement-card" aria-labelledby="electrode-placement-heading">
        <div className="section-heading"><div><p className="eyebrow">10 electrodes → 12 leads</p><h2 id="electrode-placement-heading">電極を人体へつける</h2></div><span className="unit-badge">装着 {placedElectrodes.size}/10</span></div>
        <p className="electrode-interaction-hint">電極 → 人体の丸。重ねると入れ替え。</p>
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
        <div className="electrode-map-tabs" role="group" aria-label="人体図の向きを選ぶ">
          <button type="button" aria-pressed={mapView === 'standard'} onClick={() => setMapView('standard')}>標準・正面</button>
          <button type="button" aria-pressed={mapView === 'right'} onClick={() => setMapView('right')}>右胸部</button>
          <button type="button" aria-pressed={mapView === 'back'} onClick={() => setMapView('back')}>背面 V7〜V9</button>
        </div>
        <ElectrodeBodyMap placement={placement} selected={selected} view={mapView} onPlace={onPlace} />
        <details className="electrode-placement-guide" open>
          <summary>正しい装着位置を確認</summary>
          <dl>
            <div><dt>RA・LA・RL・LL</dt><dd>肩や腰の体幹ではなく、左右の上肢・下肢。図では前腕側と下腿側に置いています。</dd></div>
            <div><dt>V1・V2</dt><dd>第4肋間の胸骨右縁・左縁。</dd></div>
            <div><dt>V4</dt><dd>第5肋間・左鎖骨中線。V3はV2とV4の中間。</dd></div>
            <div><dt>V5・V6</dt><dd>V4と同じ高さで、左前腋窩線・左中腋窩線。</dd></div>
            <div><dt>V1R〜V6R</dt><dd>標準胸部誘導の鏡像配置。V3R・V4Rが右室評価で特に使われます。</dd></div>
            <div><dt>V7〜V9</dt><dd>V6と同じ水平面の左後腋窩線・左肩甲骨中線・左脊柱傍。</dd></div>
          </dl>
        </details>
        <div className="electrode-actions">
          <button type="button" onClick={() => applyScenario('correct')}>正しく装着</button>
          <button type="button" onClick={() => applyScenario('right-sided')}>右胸部へ配置</button>
          <button type="button" onClick={() => applyScenario('posterior')}>V7〜V9へ配置</button>
          <button type="button" className="is-secondary" onClick={clearAll}>全部外して練習</button>
        </div>
      </section>

      <section className={`electrode-result ${scenario.id === 'correct' || scenario.id === 'right-sided' || scenario.id === 'posterior' ? 'is-correct' : 'is-error'}`} aria-live="polite">
        <p>{scenario.shortLabel}</p><h2>{scenario.title}</h2><details className="learning-details"><summary>変化の見方</summary><p>{scenario.summary}</p><p>{scenario.clue}</p></details>
      </section>

      <section className="content-card electrode-wave-card" aria-labelledby="electrode-wave-heading">
        <div className="section-heading"><div><p className="eyebrow">同じ心臓、違う配線</p><h2 id="electrode-wave-heading">12誘導はどう変わる？</h2></div></div>
        <div className="electrode-wave-legend"><span><i />現在の波形</span><span><i className="is-normal" />正しい装着時</span></div>
        <div className="electrode-wave-grid-layout">
          {displayedLeads.map((lead) => {
            const changed = scenario.affectedLeads.includes(lead) && scenario.id !== 'incomplete' && scenario.id !== 'custom';
            const placementOnly = RIGHT_CHEST_LEADS.includes(lead as (typeof RIGHT_CHEST_LEADS)[number]) || POSTERIOR_LEADS.includes(lead as (typeof POSTERIOR_LEADS)[number]);
            const unavailableReason = scenario.id === 'incomplete' ? 'disconnected' : scenario.id === 'custom' ? 'unsupported' : placementOnly ? 'placement-only' : undefined;
            const pWaveShape = scenario.id === 'v1-v2-high' && lead === 'V1' ? 'biphasic' : 'single';
            return <ElectrodeWaveform key={lead} lead={lead} normal={waveformForScenario(lead, 'correct')} current={waveformForScenario(lead, waveformScenario)} changed={changed} unavailableReason={unavailableReason} pWaveShape={pWaveShape} />;
          })}
        </div>
        <p className="electrode-wave-note">10電極で測定。点線＝正しい装着／実線＝現在／色枠＝変化。</p>
      </section>

      <section className="content-card electrode-presets" aria-labelledby="electrode-presets-heading">
        <div className="section-heading"><div><p className="eyebrow">すぐ比較する</p><h2 id="electrode-presets-heading">よくある間違いを体験</h2></div></div>
        <div>
          {practiceScenarios.map((id) => (
            <button type="button" key={id} className={scenario.id === id ? 'is-active' : ''} onClick={() => applyScenario(id)}>{SCENARIOS[id].shortLabel}</button>
          ))}
        </div>
      </section>

      <details className="pvc-sources"><summary>参考文献</summary><ul><li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10685096/" target="_blank" rel="noreferrer">四肢電極交換の誘導対応と胸部電極位置異常のレビュー</a></li><li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6932211/" target="_blank" rel="noreferrer">心電図記録時の技術的ミス</a></li><li><a href="https://www.ahajournals.org/doi/10.1161/CIRCULATIONAHA.106.180200" target="_blank" rel="noreferrer">AHA/ACCF/HRS 12誘導心電図標準化勧告</a></li><li><a href="https://academic.oup.com/eurheartj/article/44/38/3720/7243210" target="_blank" rel="noreferrer">2023 ESC急性冠症候群ガイドライン：右胸部・背部追加誘導</a></li></ul></details>
      <LabDisclaimer />
    </div>
  );
}
