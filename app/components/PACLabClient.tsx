'use client';

import { useMemo, useState } from 'react';
import { InfoCard } from '@/app/components/InfoCard';
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
        <p className="pac-diagram-note">破線＝右房の奥を通る肺静脈。4本とも左房へ。</p>

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

        <p className="pac-wave-overview-intro">洞調律 → PAC → 洞調律。中央の早いP′波を比べよう。</p>

        <div className="pac-reasoning">
          <p><strong>いちばんの手がかり：</strong>{activeOrigin.mainClue}</p>
          <details className="pac-detail">
            <summary>理由と似る起源</summary>
            <p><strong>興奮の向き：</strong>{activeOrigin.why}</p>
            <p><strong>似る場所：</strong>{activeOrigin.limit}</p>
            <p>6誘導は同じ時間軸。横1小マス＝40 ms。</p>
          </details>
        </div>
      </section>

      <section className="content-card pac-guide-card" aria-labelledby="pac-guide-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">波形を見たあとに</p>
            <h2 id="pac-guide-heading">図の見方と考える順番</h2>
          </div>
        </div>

        <section className="pac-reading-order" aria-label="起源を考える3つの順番">
          <span><b>1</b>早い拍を見つける</span>
          <span><b>2</b>P′波を比べる</span>
          <span><b>3</b>起源候補を絞る</span>
        </section>

        <div className="pac-selected-origin pac-selected-origin-detail">
          <p>{activeOrigin.chamber}</p>
          <h3 style={{ color: activeOrigin.color }}>{activeOrigin.siteName}</h3>
          <span>{activeOrigin.location}</span>
        </div>

        <details className="pac-detail">
          <summary>図の向きと色分け</summary>
          <div className="pac-anatomy-key" aria-label="心臓図の色分けと向き">
          <p><strong>向き：</strong>患者の右が画面左。前方の右房を開き、後方の左房・肺静脈も透視・展開した模式図です。心耳は前方への突出を示し、単一の断面や正確な寸法は表しません。</p>
          <p><strong>接続：</strong>上下大静脈と冠静脈洞は右房へ、左右4本の肺静脈は左房へ。右肺静脈の破線部分は右房の奥で、右房への開口ではありません。冠静脈洞は心臓後面の房室溝を通ります。</p>
          <div>
            <span><i className="pac-key-left-atrium" />左房・肺静脈</span>
            <span><i className="pac-key-right-atrium" />右房・上下大静脈</span>
            <span><i className="pac-key-coronary-sinus" />冠静脈洞</span>
            <span><i className="pac-key-four-chambers" />淡い背景＝心臓全体</span>
          </div>
          </div>
        </details>
      </section>

      <InfoCard title="P′波は地図のヒント。確定診断ではありません">
        <p>波形は学習用の代表例。P′波だけで起源は確定できません。</p>
      </InfoCard>

      <details className="pac-sources">
        <summary>正確さの範囲と参考文献</summary>
        <p>P′波がT波に埋もれる例、非伝導性PAC、心房接合部起源、変行伝導、心房手術・アブレーション後は対象外です。</p>
        <p>表示した波形は患者の実記録ではなく、正常電気軸を想定した洞性P・QRS・Tと、各部位で報告された代表的なP′波を組み合わせた模式図です。個人差、電気軸偏位、胸部誘導の移行帯などは再現していません。起源推定アルゴリズムは主に焦点性心房頻拍で検証されたもので、単発PACへの適用は同じ心房興奮の方向を手がかりにする学習上の外挿です。</p>
        <ul>
          <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4668306/" target="_blank" rel="noreferrer">心房・洞結節・心耳の解剖学的関係</a></li>
          <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC5705746/" target="_blank" rel="noreferrer">左心房・肺静脈・左心耳の解剖</a></li>
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
    </div>
  );
}
