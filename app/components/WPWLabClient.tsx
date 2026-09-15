'use client';

import { useMemo, useState } from 'react';
import { InfoCard } from '@/app/components/InfoCard';
import { WPWAnnulusMap } from '@/app/components/WPWAnnulusMap';
import { WPWLocalizationControls } from '@/app/components/WPWLocalizationControls';
import { wpwType } from '@/app/domain/wpw';
import {
  directionLabel,
  localizeAccessoryPathway,
  pathwayLocation,
  type PathwayLocationId,
} from '@/app/domain/wpw-localization';

export function WPWLabClient() {
  const initialLocation = pathwayLocation('left-lateral');
  const [input, setInput] = useState(initialLocation.representativeInput);
  const decision = useMemo(() => localizeAccessoryPathway(input), [input]);
  const activeLocation = decision.location;
  const coarseType = useMemo(() => wpwType(input.v1Type), [input.v1Type]);

  const selectLocation = (locationId: PathwayLocationId) => {
    setInput(pathwayLocation(locationId).representativeInput);
  };

  return (
    <div className="wpw-lab">
      <p className="page-lead">V1で弁輪の側を見て、II・III・aVFのデルタ波から前後方向を重ねる。</p>

      <section className="content-card wpw-workbench" aria-labelledby="wpw-workbench-heading">
        <div className="wpw-result-bar" aria-live="polite">
          <div>
            <span>現在の推定候補</span>
            <h2 id="wpw-workbench-heading">{activeLocation.name}</h2>
          </div>
          <div className="wpw-result-badges">
            <strong>{activeLocation.abbreviation}</strong>
            <span>{coarseType.typeName}相当</span>
            <span>{directionLabel(decision.direction)}</span>
          </div>
        </div>

        <div className="wpw-workbench-grid">
          <section className="wpw-map-panel" aria-labelledby="wpw-map-panel-heading">
            <div className="wpw-panel-heading">
              <div>
                <span>場所から波形へ</span>
                <h3 id="wpw-map-panel-heading">弁輪をタップ</h3>
              </div>
              <strong>9代表位置</strong>
            </div>
            <p className="wpw-compact-hint">色付き区間を選ぶと、その位置の代表波形へ切り替わります。</p>
            <WPWAnnulusMap activeLocationId={activeLocation.id} onSelect={selectLocation} />

            <div className="wpw-anatomy-key" aria-label="心臓図の色分け">
              <span><i className="wpw-key-right" />三尖弁輪側</span>
              <span><i className="wpw-key-left" />僧帽弁輪側</span>
              <span><i className="wpw-key-pathway" />選択中</span>
            </div>

            <div className="wpw-selected-region" aria-live="polite">
              <p>{activeLocation.anatomy}</p>
              <p className="wpw-resolution-note">{activeLocation.resolutionNote}</p>
            </div>
          </section>

          <section className="wpw-ecg-panel" aria-label="V1と下壁誘導の選択">
            <WPWLocalizationControls value={input} onChange={setInput} />
          </section>
        </div>

        <div className="wpw-decision-summary" aria-live="polite">
          <span>見方</span>
          <ol>
            {decision.steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </div>
      </section>

      <details className="learning-details wpw-reading-help">
        <summary>＋・±・−と9領域の読み方</summary>
        <p>デルタ波はQRS開始直後20 msの向きを見ます。基線から上なら＋、下なら−、ほぼ基線上なら±です。</p>
        <p>このページでは、II・III・aVFのうち2誘導以上が陽性なら前方、2誘導以上が陰性なら後方、それ以外を中間として表示します。これは弁輪上の方向を覚えるための代表モデルです。</p>
      </details>

      <InfoCard title="ここで出るのは確定部位ではなく学習上の候補">
        <p>V1のA・C・B分類と、下壁誘導のデルタ波方向を重ねた簡易モデルです。患者の実記録や、標準化された精密局在アルゴリズムではありません。最終部位は12誘導全体と電気生理学的マッピング、アブレーション成功部位で確認します。</p>
      </InfoCard>

      <details className="wpw-sources">
        <summary>正確さの範囲と参考文献</summary>
        <p>V1の代表波形から左側・中隔・右側を、II・III・aVFの初期デルタ波から前方・後方を考える参考テキスト型の学習モデルです。波形は患者の実記録ではありません。</p>
        <p>より詳細なArruda法では、I誘導のデルタ波極性やIII・V1のR/S比も使います。このページの4誘導表示は、同法の10領域判定を再現するものではありません。</p>
        <ul>
          <li><a href="https://pubmed.ncbi.nlm.nih.gov/9475572/" target="_blank" rel="noreferrer">Arrudaら：安静時12誘導による詳細局在アルゴリズム</a></li>
          <li><a href="https://www.j-circ.or.jp/cms/wp-content/uploads/2018/07/JCS2018_kurita_nogami.pdf" target="_blank" rel="noreferrer">日本循環器学会：不整脈非薬物治療ガイドライン</a></li>
          <li><a href="https://academic.oup.com/eurheartj/article/41/5/655/5556821" target="_blank" rel="noreferrer">2019 ESC上室性頻拍ガイドライン</a></li>
        </ul>
      </details>
    </div>
  );
}
