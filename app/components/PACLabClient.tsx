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

const markerLabels = Object.fromEntries(
  PAC_ORIGINS.map((origin) => [origin.id, origin.siteName]),
) as Record<PACOriginId, string>;

const pacHeartImage = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/pac-unfolded-heart-v9.png`;

const anatomyLabels = [
  { id: 'svc', text: '上大静脈' },
  { id: 'ivc', text: '下大静脈' },
  { id: 'rupv', text: '右上肺静脈' },
  { id: 'rlpv', text: '右下肺静脈' },
  { id: 'lupv', text: '左上肺静脈' },
  { id: 'llpv', text: '左下肺静脈' },
  { id: 'raa', text: '右心耳' },
  { id: 'laa', text: '左心耳' },
  { id: 'cs', text: '冠静脈洞' },
  { id: 'sa-node', text: '洞結節' },
  { id: 'his', text: 'ヒス束近辺（投影）' },
  { id: 'tricuspid', text: '三尖弁（投影）' },
] as const;

export function PACLabClient() {
  const [activeOriginId, setActiveOriginId] = useState<PACOriginId>('sinus-node');
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
          <span className="unit-badge">候補9部位</span>
        </div>

        <p className="pac-interaction-hint">図の番号か下の部位名を選ぶと、6誘導のP′波と連続波形が連動します。</p>

        <div className="pac-atria-map">
          <img
            className="pac-heart-anatomy"
            src={pacHeartImage}
            alt="患者の右を画面左、患者の左を画面右に置き、右房内面と左房後面を同じ平面へ展開した心房の模式図。右房に上下大静脈、左房に4本の肺静脈が入ります。"
          />
          <svg
            className="pac-four-chambers"
            viewBox="0 0 500 400"
            role="img"
            aria-label="薄く重ねた心臓の4部屋。画面左上が右心房、右上が左心房、左下が右心室、右下が左心室。"
          >
            <path className="pac-chamber pac-chamber-right" d="M145 125 C160 92 224 91 251 123 C266 145 265 218 239 247 C216 267 168 254 151 222 C138 197 135 148 145 125 Z" />
            <path className="pac-chamber pac-chamber-left" d="M251 123 C283 91 374 95 407 130 C428 155 420 220 392 247 C361 272 285 266 260 239 C244 216 241 148 251 123 Z" />
            <path className="pac-chamber pac-chamber-right" d="M171 248 C192 235 233 239 260 258 C278 278 277 335 255 365 C232 385 190 367 174 337 C160 312 155 271 171 248 Z" />
            <path className="pac-chamber pac-chamber-left" d="M260 258 C287 232 353 227 383 252 C411 278 405 337 369 373 C340 397 286 382 264 356 C248 331 244 281 260 258 Z" />
            <g className="pac-chamber-name" aria-hidden="true">
              <text x="196" y="190">右心房</text>
              <text x="330" y="190">左心房</text>
              <text x="211" y="317">右心室</text>
              <text x="326" y="324">左心室</text>
            </g>
          </svg>
          <span className="pac-view-badge">テキスト準拠の展開図</span>
          <span className="pac-side-guide"><b>患者の右</b><i aria-hidden="true">←　→</i><b>患者の左</b></span>
          <span className="pac-whole-heart-note">淡い青白＝心臓全体</span>

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
              <span aria-hidden="true">{origin.markerNumber}</span>
              <small>{origin.shortName}</small>
            </button>
          ))}
        </div>

        <div className="pac-anatomy-key" aria-label="心臓図の色分けと向き">
          <p><strong>向き：</strong>テキストと同じく患者の右を画面左に置き、右房内面と左房後面を一枚へ開いた学習用投影です。厳密な一方向の解剖図ではありません。</p>
          <p><strong>重なり：</strong>画面左の右上・右下肺静脈は右房へ入るのではなく、右房の後ろを通って左房へつながる部分を重ねて示しています。</p>
          <div>
            <span><i className="pac-key-left-atrium" />左房・肺静脈</span>
            <span><i className="pac-key-right-atrium" />右房・上下大静脈</span>
            <span><i className="pac-key-coronary-sinus" />冠静脈洞</span>
            <span><i className="pac-key-four-chambers" />薄い点線＝4部屋の大まかな位置</span>
          </div>
        </div>

        <div className="pac-origin-index" aria-label="起源候補9部位">
          {PAC_ORIGINS.map((origin) => (
            <button
              type="button"
              key={origin.id}
              className={activeOriginId === origin.id ? 'is-active' : ''}
              aria-pressed={activeOriginId === origin.id}
              style={{ '--origin-color': origin.color } as React.CSSProperties}
              onClick={() => setActiveOriginId(origin.id)}
            >
              <b>{origin.markerNumber}</b>
              <span>{origin.shortName}</span>
            </button>
          ))}
        </div>
        <p className="pac-waveform-color-note"><i aria-hidden="true" />同じ色の候補は、同じ代表P′波を表示します。</p>

        <div className="pac-selected-origin" aria-live="polite">
          <p>{activeOrigin.chamber}</p>
          <h3 style={{ color: activeOrigin.color }}>{activeOrigin.siteName}</h3>
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
                morphology={activeOrigin.morphologies?.[lead]}
                pWaveScale={activeOrigin.pWaveScales?.[lead]}
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
          <li><a href="https://pubmed.ncbi.nlm.nih.gov/11342753/" target="_blank" rel="noreferrer">肺静脈ペーシング時のP波形：左右・上下の判別</a></li>
          <li><a href="https://pubmed.ncbi.nlm.nih.gov/18975065/" target="_blank" rel="noreferrer">上大静脈起源のP波形</a></li>
          <li><a href="https://pubmed.ncbi.nlm.nih.gov/33076624/" target="_blank" rel="noreferrer">右心耳起源のP波形</a></li>
        </ul>
      </details>
    </div>
  );
}
