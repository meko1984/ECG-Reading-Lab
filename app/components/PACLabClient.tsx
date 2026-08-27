'use client';

import { useMemo, useState } from 'react';
import { InfoCard } from '@/app/components/InfoCard';
import { PACMiniWave, PACWaveform } from '@/app/components/PACWaveform';
import {
  PAC_LEADS,
  PAC_ORIGINS,
  pacOrigin,
  polarityLabel,
  type PACLead,
  type PACOriginId,
} from '@/app/domain/pac';

const markerLabels: Record<PACOriginId, string> = {
  'crista-terminalis': '分界稜付近',
  'cs-ostium': '冠静脈洞入口部',
  'left-superior-pv': '左上肺静脈付近',
};

export function PACLabClient() {
  const [activeOriginId, setActiveOriginId] = useState<PACOriginId>('crista-terminalis');
  const [activeLead, setActiveLead] = useState<PACLead>('V1');
  const activeOrigin = useMemo(() => pacOrigin(activeOriginId), [activeOriginId]);

  return (
    <div className="pac-lab">
      <p className="page-lead">早く出たP′波の向きを手がかりに、心房内のどこから興奮が始まったかをたどります。</p>

      <section className="pac-reading-order" aria-label="起源を考える3つの順番">
        <span><b>1</b>早い拍を見つける</span>
        <span><b>2</b>P′波を比べる</span>
        <span><b>3</b>起源候補を絞る</span>
      </section>

      <section className="content-card pac-origin-card" aria-labelledby="pac-origin-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">場所からP′波へ</p>
            <h2 id="pac-origin-heading">心房の起源をタップ</h2>
          </div>
          <span className="unit-badge">代表3部位</span>
        </div>

        <p className="pac-interaction-hint">色のついた点を選ぶと、6誘導のP′波とリズム波形が連動します。</p>

        <div className="pac-atria-map" role="img" aria-label="右房と左房を正面から見た模式図。3つの代表起源を選べます。">
          <div className="pac-vessel pac-svc" aria-hidden="true" />
          <div className="pac-vessel pac-ivc" aria-hidden="true" />
          <div className="pac-vessel pac-pv-left" aria-hidden="true" />
          <div className="pac-vessel pac-pv-right" aria-hidden="true" />
          <div className="pac-atrium pac-right-atrium" aria-hidden="true"><span>右房</span></div>
          <div className="pac-atrium pac-left-atrium" aria-hidden="true"><span>左房</span></div>
          <div className="pac-septum" aria-hidden="true" />

          {PAC_ORIGINS.map((origin) => (
            <button
              type="button"
              key={origin.id}
              className={`pac-origin-marker pac-marker-${origin.id} ${activeOriginId === origin.id ? 'is-active' : ''}`}
              aria-pressed={activeOriginId === origin.id}
              aria-label={`${markerLabels[origin.id]}を選ぶ`}
              style={{ '--origin-color': origin.color } as React.CSSProperties}
              onClick={() => setActiveOriginId(origin.id)}
            >
              <span aria-hidden="true" />
              <small>{origin.shortName}</small>
            </button>
          ))}
        </div>

        <div className="pac-selected-origin" aria-live="polite">
          <p>{activeOrigin.chamber}</p>
          <h3>{activeOrigin.siteName}</h3>
          <span>{activeOrigin.location}</span>
        </div>
      </section>

      <section className="content-card pac-clue-card" aria-labelledby="pac-clue-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">P′波から場所へ</p>
            <h2 id="pac-clue-heading">6誘導を見比べる</h2>
          </div>
        </div>

        <div className="pac-lead-grid" aria-label={`${activeOrigin.siteName}のPダッシュ波極性`}>
          {PAC_LEADS.map((lead) => {
            const polarity = activeOrigin.polarities[lead];
            return (
              <button
                type="button"
                key={lead}
                aria-pressed={activeLead === lead}
                onClick={() => setActiveLead(lead)}
              >
                <strong>{lead}</strong>
                <PACMiniWave polarity={polarity} />
                <span>{polarityLabel(polarity)}</span>
              </button>
            );
          })}
        </div>

        <div className="pac-wave-detail" aria-live="polite">
          <PACWaveform
            lead={activeLead}
            polarity={activeOrigin.polarities[activeLead]}
            color={activeOrigin.color}
          />
        </div>

        <div className="pac-reasoning">
          <p><strong>いちばんの手がかり：</strong>{activeOrigin.mainClue}</p>
          <p><strong>ベクトルで考える：</strong>{activeOrigin.why}</p>
          <p><strong>似る場所：</strong>{activeOrigin.limit}</p>
        </div>
      </section>

      <InfoCard title="P′波は地図のヒント。確定診断ではありません">
        <p>このラボは、P′波が確認できる心房起源の上室期外収縮（PAC）を扱う入門用モデルです。P′波がT波に埋もれる例、非伝導性PAC、心房接合部起源、変行伝導、心房手術・アブレーション後は対象外です。</p>
      </InfoCard>

      <details className="pac-sources">
        <summary>正確さの範囲と参考文献</summary>
        <p>表示したP′波は患者の実記録ではなく、各部位で報告された代表的な極性を単純化した模式波形です。起源推定アルゴリズムは主に焦点性心房頻拍で検証されたもので、単発PACへの適用は同じ心房興奮の方向を手がかりにする学習上の外挿です。</p>
        <ul>
          <li><a href="https://onlinelibrary.wiley.com/doi/10.1002/joa3.13052" target="_blank" rel="noreferrer">JCS/JHRS 2022 不整脈診断・リスク評価ガイドライン</a></li>
          <li><a href="https://www.jacc.org/doi/10.1016/j.jacep.2021.05.005" target="_blank" rel="noreferrer">Kistlerら：P波形による焦点性心房頻拍起源の更新アルゴリズム</a></li>
          <li><a href="https://www.jacc.org/doi/10.1016/j.jacep.2019.01.014" target="_blank" rel="noreferrer">分界稜起源のP波形と電気生理学的特徴</a></li>
          <li><a href="https://pubmed.ncbi.nlm.nih.gov/15862424/" target="_blank" rel="noreferrer">冠静脈洞入口部起源のP波形とアブレーション所見</a></li>
          <li><a href="https://www.jacc.org/doi/10.1016/j.jacc.2006.03.058" target="_blank" rel="noreferrer">Kistlerら：解剖学的起源を予測するP波形アルゴリズム</a></li>
        </ul>
      </details>
    </div>
  );
}
