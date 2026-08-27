'use client';

import { useMemo, useState } from 'react';
import { InfoCard } from '@/app/components/InfoCard';
import { WPWHeartDiagram } from '@/app/components/WPWHeartDiagram';
import { WPWMiniWaveform, WPWWaveform } from '@/app/components/WPWWaveform';
import { WPW_TYPES, wpwType, type WPWTypeId } from '@/app/domain/wpw';

export function WPWLabClient() {
  const [activeTypeId, setActiveTypeId] = useState<WPWTypeId>('type-a');
  const activeType = useMemo(() => wpwType(activeTypeId), [activeTypeId]);

  return (
    <div className="wpw-lab">
      <p className="page-lead">心臓上のケント束とV1誘導の波形は、どちらを触っても同じタイプへ連動します。</p>

      <section className="content-card wpw-explorer" aria-labelledby="wpw-explorer-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">場所から波形へ</p>
            <h2 id="wpw-explorer-heading">ケント束をタップ</h2>
          </div>
          <span className="unit-badge">代表位置</span>
        </div>

        <p className="wpw-interaction-hint">図のA・C・Bを選ぶと、下のV1波形も切り替わります。</p>
        <WPWHeartDiagram activeType={activeTypeId} onSelect={setActiveTypeId} />

        <div className="wpw-selected-region" aria-live="polite">
          <strong>{activeType.typeName}（{activeType.attachment}）</strong>
          <span>{activeType.anatomy}</span>
          <small>{activeType.clinicalLimit}</small>
        </div>
      </section>

      <section className="content-card wpw-wave-card" aria-labelledby="wpw-wave-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">波形から場所へ</p>
            <h2 id="wpw-wave-heading">V1波形をタップ</h2>
          </div>
        </div>

        <div className="wpw-wave-picker" aria-label="V1の代表波形">
          {WPW_TYPES.map((type) => (
            <button
              type="button"
              key={type.id}
              aria-pressed={activeTypeId === type.id}
              onClick={() => setActiveTypeId(type.id)}
            >
              <WPWMiniWaveform morphology={type.waveform.morphology} />
              <span>{type.typeName}</span>
              <strong>{type.v1Pattern}</strong>
            </button>
          ))}
        </div>

        <div className="wpw-wave-detail" aria-live="polite">
          <h3>{activeType.typeName}の代表波形「{activeType.v1Pattern}」</h3>
          <WPWWaveform waveform={activeType.waveform} pattern={activeType.v1Pattern} />

          <div className="wpw-clue">
            <p><strong>波形：</strong>{activeType.v1Clue}</p>
            <p><strong>見え方：</strong>{activeType.direction}</p>
          </div>
        </div>
      </section>

      <InfoCard title="V1だけでは場所を確定できません">
        <p>このA・C・Bは、提供されたテキストに沿った入門用の代表モデルです。実際はBとCが右側・中隔で重なり、前興奮の程度でも波形が変わります。12誘導全体による推定と、必要に応じた電気生理学的検査で確認します。</p>
      </InfoCard>

      <details className="wpw-sources">
        <summary>正確さの範囲と参考文献</summary>
        <p>顕性副伝導路が1本あり、洞調律で前興奮が見える代表例を扱います。波形は患者の実記録ではなく、25 mm/s・10 mm/mVの方眼上に短いPR間隔と幅広いQRSを置いた模式波形です。</p>
        <p>アブレーションで位置を確認した44例の研究では、V1による3タイプ分類の位置推定精度は79%で、特にB・Cと右側・中隔の対応に重なりがありました。</p>
        <ul>
          <li><a href="https://www.j-circ.or.jp/cms/wp-content/uploads/2022/03/JCS2022_Takase.pdf" target="_blank" rel="noreferrer">日本循環器学会／日本不整脈心電学会 2022年改訂版ガイドライン</a></li>
          <li><a href="https://academic.oup.com/eurheartj/article/41/5/655/5556821" target="_blank" rel="noreferrer">2019 ESC上室性頻拍ガイドライン</a></li>
          <li><a href="https://pubmed.ncbi.nlm.nih.gov/31728876/" target="_blank" rel="noreferrer">V1の3タイプ分類と副伝導路位置を検証した研究</a></li>
          <li><a href="https://onlinelibrary.wiley.com/doi/10.1111/j.1540-8167.1998.tb00861.x" target="_blank" rel="noreferrer">Arrudaらの12誘導位置推定アルゴリズム</a></li>
        </ul>
      </details>
    </div>
  );
}
