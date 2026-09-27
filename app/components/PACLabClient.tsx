'use client';

import { useMemo, useState } from 'react';
import { LabDisclaimer } from '@/app/components/LabDisclaimer';
import { PACOriginDiagram } from '@/app/components/PACOriginDiagram';
import { PACQuickWaveform, PACWaveform } from '@/app/components/PACWaveform';
import {
  PAC_LEADS,
  pacOrigin,
  type PACOriginId,
} from '@/app/domain/pac';

const PAC_QUICK_LEADS = ['I', 'II', 'III', 'aVL', 'aVF', 'V1'] as const;

export function PACLabClient() {
  const [activeOriginId, setActiveOriginId] = useState<PACOriginId>('sinus-node');
  const activeOrigin = useMemo(() => pacOrigin(activeOriginId), [activeOriginId]);

  return (
    <div className="pac-lab">
      <section className="content-card pac-origin-card" aria-labelledby="pac-origin-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">場所からP′波へ</p>
            <h2 id="pac-origin-heading">心房の起源を選ぶ</h2>
          </div>
          <span className="unit-badge">候補9部位</span>
        </div>

        <PACOriginDiagram activeOriginId={activeOriginId} onSelect={setActiveOriginId} />
        <p className="pac-diagram-note">心耳は手前（前方）、肺静脈は奥（後方）。<br />破線＝右房の奥を通る肺静脈。4本とも左房へ。</p>

        <p className="pac-selection-status" aria-live="polite">
          {activeOrigin.markerNumber}番、{activeOrigin.siteName}を選択中
        </p>

        <div className="pac-quick-grid" aria-label={`${activeOrigin.siteName}の6誘導早見波形`}>
          {PAC_QUICK_LEADS.map((lead) => {
            const polarity = activeOrigin.polarities[lead];
            return (
              <PACQuickWaveform
                key={lead}
                lead={lead}
                polarity={polarity}
                color={activeOrigin.color}
                morphology={activeOrigin.morphologies?.[lead]}
                pWaveScale={activeOrigin.pWaveScales?.[lead]}
              />
            );
          })}
        </div>
      </section>

      <section className="content-card pac-clue-card" aria-labelledby="pac-clue-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">P′波から場所へ</p>
            <h2 id="pac-clue-heading">6誘導を見比べる</h2>
          </div>
        </div>

        <div className="pac-lead-stack" aria-label={`${activeOrigin.siteName}の6誘導連続波形`}>
          {PAC_LEADS.map((lead) => {
            const polarity = activeOrigin.polarities[lead];
            return (
              <PACWaveform
                key={lead}
                lead={lead}
                polarity={polarity}
                color={activeOrigin.color}
                morphology={activeOrigin.morphologies?.[lead]}
                pWaveScale={activeOrigin.pWaveScales?.[lead]}
              />
            );
          })}
        </div>

        <p className="pac-wave-overview-intro">洞調律 → PAC → 洞調律</p>

        <details className="pac-reasoning learning-details"><summary>P′波の手がかり</summary>
          <p><strong>いちばんの手がかり：</strong>{activeOrigin.mainClue}</p>
          <details className="pac-detail">
            <summary>理由と似る起源</summary>
            <p><strong>興奮の向き：</strong>{activeOrigin.why}</p>
            <p><strong>似る場所：</strong>{activeOrigin.limit}</p>
            <p>6誘導は同じ時間軸。横1小マス＝40 ms。</p>
          </details>
        </details>
      </section>

      <section className="content-card pac-guide-card" aria-labelledby="pac-guide-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">波形を見たあとに</p>
            <h2 id="pac-guide-heading">選んだ起源</h2>
          </div>
        </div>

        <div className="pac-selected-origin pac-selected-origin-detail">
          <p>{activeOrigin.chamber}</p>
          <h3 style={{ color: activeOrigin.color }}>{activeOrigin.siteName}</h3>
          <span>{activeOrigin.location}</span>
        </div>

        <div className="pac-anatomy-key" aria-label="心臓図の色分け">
          <div>
            <span><i className="pac-key-left-atrium" />左房・肺静脈</span>
            <span><i className="pac-key-right-atrium" />右房・上下大静脈</span>
            <span><i className="pac-key-coronary-sinus" />冠静脈洞</span>
            <span><i className="pac-key-four-chambers" />淡い背景＝心臓全体</span>
          </div>
        </div>
      </section>

      <details className="pac-sources">
        <summary>正確さの範囲と参考文献</summary>
        <ul>
          <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4668306/" target="_blank" rel="noreferrer">心房・洞結節・心耳の解剖学的関係</a></li>
          <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5705746/" target="_blank" rel="noreferrer">左心房・肺静脈・左心耳の解剖</a></li>
          <li><a href="https://pubmed.ncbi.nlm.nih.gov/37523771/" target="_blank" rel="noreferrer">右心耳の幅広い付け根と大動脈・右室流出路との位置関係</a></li>
          <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12441441/" target="_blank" rel="noreferrer">解剖標本で見る左心耳・肺動脈幹・左上肺静脈の位置関係</a></li>
          <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8576278/" target="_blank" rel="noreferrer">冠静脈洞と右房開口部の解剖研究</a></li>
          <li><a href="https://onlinelibrary.wiley.com/doi/10.1002/joa3.13052" target="_blank" rel="noreferrer">JCS/JHRS 2022 不整脈診断・リスク評価ガイドライン</a></li>
          <li><a href="https://www.jacc.org/doi/10.1016/j.jacep.2021.05.005" target="_blank" rel="noreferrer">Kistlerら：P波形による焦点性心房頻拍起源の更新アルゴリズム</a></li>
          <li><a href="https://www.jacc.org/doi/10.1016/j.jacep.2019.01.014" target="_blank" rel="noreferrer">分界稜起源のP波形と電気生理学的特徴</a></li>
          <li><a href="https://pubmed.ncbi.nlm.nih.gov/15862424/" target="_blank" rel="noreferrer">冠静脈洞入口部起源のP波形とアブレーション所見</a></li>
          <li><a href="https://www.jacc.org/doi/10.1016/j.jacc.2006.03.058" target="_blank" rel="noreferrer">Kistlerら：解剖学的起源を予測するP波形アルゴリズム</a></li>
          <li><a href="https://pubmed.ncbi.nlm.nih.gov/11342753/" target="_blank" rel="noreferrer">肺静脈ペーシング時のP波形：左右・上下の判別</a></li>
          <li><a href="https://pubmed.ncbi.nlm.nih.gov/18975065/" target="_blank" rel="noreferrer">上大静脈起源のP波形</a></li>
          <li><a href="https://pubmed.ncbi.nlm.nih.gov/33076624/" target="_blank" rel="noreferrer">右心耳起源のP波形</a></li>
        </ul>
      </details>
      <LabDisclaimer />
    </div>
  );
}
