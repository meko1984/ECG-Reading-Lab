'use client';

import { useMemo, useState } from 'react';
import { InfoCard } from '@/app/components/InfoCard';
import { PVCOriginDiagram } from '@/app/components/PVCOriginDiagram';
import { PVCWaveform } from '@/app/components/PVCWaveform';
import { pvcOrigin, pvcOriginEstimate, pvcPolarityLabel, type PVCOriginId } from '@/app/domain/pvc';

const inferiorLeads = ['II', 'III', 'aVF'] as const;
const lateralLeads = ['I', 'aVL'] as const;
const leftPrecordialLeads = ['V5', 'V6'] as const;

export function PVCLabClient() {
  const [activeOriginId, setActiveOriginId] = useState<PVCOriginId>('right-upper-outer');
  const activeOrigin = useMemo(() => pvcOrigin(activeOriginId), [activeOriginId]);
  const estimate = useMemo(() => pvcOriginEstimate(activeOrigin.selections), [activeOrigin]);

  return (
    <div className="pvc-lab">
      <p className="page-lead">心室の場所を選び、V1とQRSの向きがどう変わるかを連続波形で見比べます。</p>

      <section className="pac-reading-order" aria-label="PVC起源を考える3つの順番">
        <span><b>1</b>心室の場所を選ぶ</span><span><b>2</b>幅広QRSを比べる</span><span><b>3</b>4方向から考える</span>
      </section>

      <section className="content-card pvc-origin-card" aria-labelledby="pvc-origin-heading">
        <div className="section-heading"><div><p className="eyebrow">場所からQRSへ</p><h2 id="pvc-origin-heading">心室の起源を選ぶ</h2></div><span className="unit-badge">候補8領域</span></div>
        <p className="pvc-interaction-hint">心臓図の番号を選ぶと、下の8誘導のPVC波形と読み方が連動します。</p>
        <PVCOriginDiagram activeOriginId={activeOriginId} onSelect={setActiveOriginId} />
        <div className="pvc-anatomy-key">
          <p><strong>見え方：</strong>患者の右を画面左に置き、前面から右室・左室の内側を開いた学習用展開図です。右室は前面の大部分を占め、左室は左縁と心尖部を形づくります。</p>
          <p><strong>流出路：</strong>右室流出路は左室流出路の前方を左上へ交差する位置関係として描いています。</p>
          <div><span><i className="pvc-key-right" />右心系</span><span><i className="pvc-key-left" />左心系</span><span><i className="pvc-key-whole" />薄い青白＝心臓全体</span></div>
        </div>
        <div className="pvc-selected-origin" aria-live="polite">
          <p>{activeOrigin.ventricle === 'right' ? '右室側' : '左室側'}</p><h3 style={{ color: activeOrigin.color }}>{activeOrigin.siteName}</h3><span>{estimate.location}</span>
        </div>
      </section>

      <section className="content-card pvc-wave-card" aria-labelledby="pvc-wave-heading">
        <div className="section-heading"><div><p className="eyebrow">QRSから場所へ</p><h2 id="pvc-wave-heading">8誘導を見比べる</h2></div></div>
        <p className="pvc-wave-overview-intro">各誘導を「洞調律 → PVC → 洞調律」の同じ時間軸で表示します。中央の色付き波形が、選択した場所から出た幅広いQRSの代表モデルです。</p>
        <div className="pvc-lead-stack" aria-label={`${activeOrigin.siteName}の8誘導連続模式波形`}>
          <PVCWaveform lead="V1" color={activeOrigin.color} bundlePattern={activeOrigin.selections.bundlePattern} />
          {inferiorLeads.map((lead) => <PVCWaveform key={lead} lead={lead} color={activeOrigin.color} polarity={activeOrigin.selections.inferiorPolarity} />)}
          {lateralLeads.map((lead) => <PVCWaveform key={lead} lead={lead} color={activeOrigin.color} polarity={activeOrigin.selections.lateralPolarity} />)}
          {leftPrecordialLeads.map((lead) => <PVCWaveform key={lead} lead={lead} color={activeOrigin.color} polarity={activeOrigin.selections.leftPrecordialPolarity} />)}
        </div>
        <div className="pvc-reasoning">
          <p><strong>① V1：</strong>{activeOrigin.selections.bundlePattern === 'rbbb-like' ? '右脚ブロック様なので左室側を示唆します。' : '左脚ブロック様なので右室または中隔側を示唆します。'}</p>
          <p><strong>② Ⅱ・Ⅲ・aVF：</strong>{pvcPolarityLabel(activeOrigin.selections.inferiorPolarity)}。{activeOrigin.selections.inferiorPolarity === 'positive' ? '興奮が下方へ向かうため、起源は相対的に上方です。' : '興奮が上方へ向かうため、起源は相対的に下方です。'}</p>
          <p><strong>③ Ⅰ・aVL：</strong>{pvcPolarityLabel(activeOrigin.selections.lateralPolarity)}。体の左右方向を考える手がかりです。</p>
          <p><strong>④ V5・V6：</strong>{pvcPolarityLabel(activeOrigin.selections.leftPrecordialPolarity)}。{activeOrigin.selections.leftPrecordialPolarity === 'positive' ? '心基部・弁輪側の候補へ寄せます。' : '心尖部側の候補へ寄せます。'}</p>
        </div>
      </section>

      <InfoCard title="この図と波形は、起源の確定診断ではありません">
        <p>8つの候補は、代表的な極性パターンを学ぶための大まかな領域です。右室流出路と左室流出路のように波形が似る場所があり、実際の局在には12誘導全体、移行帯、患者ごとの心臓の向き、構造的心疾患の評価、必要に応じて電気生理学的マッピングを使います。</p>
      </InfoCard>

      <details className="pvc-sources"><summary>正確さの範囲と参考文献</summary><p>8領域と4方向の極性は、起源推定の基本的な対応関係を学べるように整理しています。心臓図と波形はECGlab用の独自模式図で、患者の実記録ではありません。</p><ul><li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC1860731/" target="_blank" rel="noreferrer">右室の形態と流出路の交差関係</a></li><li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4668306/" target="_blank" rel="noreferrer">心室流出路の解剖学的位置関係</a></li><li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8534438/" target="_blank" rel="noreferrer">特発性PVCの起源別診断・治療レビュー</a></li></ul></details>
    </div>
  );
}
