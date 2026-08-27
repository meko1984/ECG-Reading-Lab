'use client';

import { useMemo, useState } from 'react';
import { InfoCard } from '@/app/components/InfoCard';
import { PACWaveform } from '@/app/components/PACWaveform';
import {
  PAC_LEADS,
  PAC_ORIGINS,
  pacOrigin,
  type PACOriginId,
} from '@/app/domain/pac';

const markerLabels: Record<PACOriginId, string> = {
  'crista-terminalis': '上位分界稜付近',
  'cs-ostium': '冠静脈洞入口部',
  'left-superior-pv': '左上肺静脈付近',
};

const pacHeartImage = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/pac-posterior-heart-v5.png`;

const anatomyLabels = [
  { id: 'svc', text: '上大静脈' },
  { id: 'ivc', text: '下大静脈' },
  { id: 'rupv', text: '右上肺静脈' },
  { id: 'rlpv', text: '右下肺静脈' },
  { id: 'lupv', text: '左上肺静脈' },
  { id: 'llpv', text: '左下肺静脈' },
  { id: 'laa', text: '左心耳' },
  { id: 'cs', text: '冠静脈洞' },
  { id: 'sa-node', text: '洞結節' },
  { id: 'his', text: 'ヒス束近辺（投影）' },
] as const;

export function PACLabClient() {
  const [activeOriginId, setActiveOriginId] = useState<PACOriginId>('crista-terminalis');
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

        <div className="pac-atria-map">
          <img
            className="pac-heart-anatomy"
            src={pacHeartImage}
            alt="患者の背中側から見た心臓の模式図。画面左が患者の左、画面右が患者の右。中央の左房に4本の肺静脈が入り、右側の右房に上下大静脈が入ります。"
          />
          <span className="pac-view-badge">後面から見る</span>
          <span className="pac-side-guide"><b>患者の左</b><i aria-hidden="true">←　→</i><b>患者の右</b></span>
          <span className="pac-whole-heart-note">細い輪郭＝心臓全体</span>

          <span className="pac-hidden-pv pac-hidden-pv-superior" aria-hidden="true" />
          <span className="pac-hidden-pv pac-hidden-pv-inferior" aria-hidden="true" />

          {anatomyLabels.map((label) => (
            <span className={`pac-anatomy-label pac-label-${label.id}`} key={label.id}>
              {label.text}
            </span>
          ))}

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

        <div className="pac-anatomy-key" aria-label="心臓図の色分けと向き">
          <p><strong>向き：</strong>患者の背中側から同じ方向を向いて見るため、画面左が患者の左です。</p>
          <div>
            <span><i className="pac-key-left-atrium" />左房・肺静脈</span>
            <span><i className="pac-key-right-atrium" />右房・上下大静脈</span>
            <span><i className="pac-key-coronary-sinus" />冠静脈洞</span>
            <span><i className="pac-key-hidden" />右房の後ろを通る部分</span>
          </div>
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

        <p className="pac-wave-overview-intro">各誘導を「洞調律 → PAC → 洞調律」の同じ時間軸で表示。洞性P波とQRS・Tも誘導ごとの代表形にし、中央の早いP′波を縦方向に揃えています（横1小マス＝40 ms）。</p>

        <div className="pac-lead-stack" aria-label={`${activeOrigin.siteName}の6誘導連続波形`}>
          {PAC_LEADS.map((lead) => {
            const polarity = activeOrigin.polarities[lead];
            return (
              <PACWaveform
                key={lead}
                lead={lead}
                polarity={polarity}
                color={activeOrigin.color}
              />
            );
          })}
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
        <p>表示した波形は患者の実記録ではなく、正常電気軸を想定した洞性P・QRS・Tと、各部位で報告された代表的なP′波を組み合わせた模式図です。個人差、電気軸偏位、胸部誘導の移行帯などは再現していません。起源推定アルゴリズムは主に焦点性心房頻拍で検証されたもので、単発PACへの適用は同じ心房興奮の方向を手がかりにする学習上の外挿です。</p>
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
