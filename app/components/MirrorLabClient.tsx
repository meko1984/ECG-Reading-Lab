'use client';

import { useState } from 'react';
import { InfoCard } from '@/app/components/InfoCard';
import { MirrorPerspectiveDiagram } from '@/app/components/MirrorPerspectiveDiagram';
import { MirrorWaveform } from '@/app/components/MirrorWaveform';
import { MIRROR_SCENARIOS, mirrorScenario, mirrorViewLabel, type MirrorScenarioId } from '@/app/domain/mirror';

export function MirrorLabClient() {
  const [scenarioId, setScenarioId] = useState<MirrorScenarioId>('inferior');
  const [view, setView] = useState(0);
  const scenario = mirrorScenario(scenarioId);
  function selectScenario(id: MirrorScenarioId) { setScenarioId(id); setView(0); }
  function resetSimulator() { setScenarioId('inferior'); setView(0); }
  return (
    <div className="mirror-lab">
      <p className="page-lead">心臓を挟んだ両側の誘導を行き来して、ひとつのST変化が反対方向からどう見えるかを観察します。</p>
      <section className="content-card mirror-simulator" aria-labelledby="mirror-simulator-heading">
        <div className="section-heading"><div><p className="eyebrow">視点を動かす</p><h2 id="mirror-simulator-heading">見る領域を選ぶ</h2></div><span className="unit-badge">2場面</span></div>
        <div className="mirror-scenario-tabs" role="group" aria-label="観察する心筋領域">
          {MIRROR_SCENARIOS.map((item) => <button type="button" key={item.id} aria-pressed={item.id === scenarioId} onClick={() => selectScenario(item.id)}><strong>{item.shortLabel}</strong><span>{item.title}</span></button>)}
        </div>
        <MirrorPerspectiveDiagram scenario={scenario} view={view} />
        <div className="mirror-view-control">
          <div className="mirror-view-status" aria-live="polite"><span>現在の視点</span><strong>{mirrorViewLabel(view)}</strong></div>
          <label htmlFor="mirror-view">見る方向を動かすと、下の波形も変わる</label>
          <input id="mirror-view" type="range" min="0" max="100" step="1" value={view} onChange={(event) => setView(Number(event.target.value))} aria-valuetext={mirrorViewLabel(view)} />
          <div className="mirror-view-ends" aria-hidden="true"><span>{scenario.direct.title}</span><span>{scenario.opposite.title}</span></div>
        </div>
        <MirrorWaveform scenario={scenario} view={view} />
        <div className="mirror-observation" aria-live="polite"><p><strong>観察していること：</strong>{scenario.observation}</p><p><strong>大切な境界：</strong>{scenario.caution}</p></div>
      </section>
      <section className="content-card mirror-explanation-card" aria-labelledby="mirror-boundary-heading">
        <div className="section-heading"><div><p className="eyebrow">モデルの読み方</p><h2 id="mirror-boundary-heading">両端が実際の誘導</h2></div></div>
        <div className="mirror-endpoints"><div><span>直接側</span><strong>{scenario.direct.leads.join('・')}</strong><b>{scenario.direct.change}</b><p>{scenario.direct.description}</p></div><div><span>反対側</span><strong>{scenario.opposite.leads.join('・')}</strong><b>{scenario.opposite.change}</b><p>{scenario.opposite.description}</p></div></div>
        <p className="mirror-not-literal">スライダー中央は、極性が切り替わる様子を見るための仮想視点です。実際の誘導を連続移動させる機能ではありません。また、ミラーイメージは波形画像の完全な上下反転ではなく、ST偏位の大きさや形は一致しないことがあります。</p>
        <button type="button" className="mirror-reset" onClick={resetSimulator}>初期状態に戻す</button>
      </section>
      <InfoCard title="この画面だけで心筋梗塞を判定しません"><p>これは鏡像変化の位置関係を理解するための代表モデルです。ST低下には鏡像変化以外の原因もあります。実際は症状、連続・追加誘導、過去心電図、経時変化、血液検査、画像検査などを合わせて評価します。胸痛、冷汗、呼吸困難などがある実患者では、この画面で判断せず緊急評価につなげます。</p></InfoCard>
      <details className="pvc-sources mirror-sources"><summary>正確さの範囲と参考文献</summary><p>心臓図と波形はECGlab用の独自模式図で、患者の実記録ではありません。代表的な方向関係を強調しており、すべての個人差や併存する心電図変化は再現していません。</p><ul><li><a href="https://www.ahajournals.org/doi/pdf/10.1161/CIRCULATIONAHA.108.191098" target="_blank" rel="noreferrer">AHA/ACCF/HRS 心電図標準化・解釈勧告</a></li><li><a href="https://www.ahajournals.org/doi/pdf/10.1161/CIR.0000000000001309" target="_blank" rel="noreferrer">2025 ACC/AHA 急性冠症候群ガイドライン</a></li><li><a href="https://academic.oup.com/eurheartj/advance-article/doi/10.1093/eurheartj/ehag101/8766309" target="_blank" rel="noreferrer">Fifth Universal Definition of Myocardial Infarction（2026）</a></li></ul></details>
    </div>
  );
}
