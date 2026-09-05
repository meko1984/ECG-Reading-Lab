'use client';

import { useMemo, useState } from 'react';
import { InfoCard } from '@/app/components/InfoCard';
import { MIHeartDiagram } from '@/app/components/MIHeartDiagram';
import { MILeadStrip } from '@/app/components/MILeadStrip';
import { MI_TERRITORIES, STANDARD_LEADS, miLeadChange, miLeadLabel, miTerritory, type MITerritoryId } from '@/app/domain/mi';

export function MILabClient() {
  const [activeId, setActiveId] = useState<MITerritoryId>('inferior');
  const territory = useMemo(() => miTerritory(activeId), [activeId]);
  const extraLeads = [...territory.supplementalElevation];

  return (
    <div className="mi-lab">
      <p className="page-lead">ST変化が見える誘導と心臓の壁をつなぎ、次に追加する誘導まで一続きで確認します。</p>

      <section className="pac-reading-order" aria-label="梗塞領域を考える3つの順番">
        <span><b>1</b>領域を選ぶ</span><span><b>2</b>連続誘導を探す</span><span><b>3</b>鏡像・追加誘導を見る</span>
      </section>

      <section className="content-card mi-selector-card" aria-labelledby="mi-selector-heading">
        <div className="section-heading"><div><p className="eyebrow">壁から誘導へ</p><h2 id="mi-selector-heading">見たい領域を選ぶ</h2></div><span className="unit-badge">6領域</span></div>
        <div className="mi-territory-tabs" role="group" aria-label="心筋梗塞の代表領域">
          {MI_TERRITORIES.map((item) => <button type="button" key={item.id} className={item.id === activeId ? 'is-active' : ''} aria-pressed={item.id === activeId} style={{ '--mi-color': item.color } as React.CSSProperties} onClick={() => setActiveId(item.id)}>{item.shortLabel}</button>)}
        </div>

        <div className="mi-map-layout">
          <MIHeartDiagram activeId={activeId} color={territory.color} />
          <div className="mi-territory-result" aria-live="polite" style={{ '--mi-color': territory.color } as React.CSSProperties}>
            <p>{territory.wall}</p><h3>{territory.title}</h3><span>{territory.reading}</span>
            <dl><div><dt>ST上昇を見る誘導</dt><dd>{territory.standardElevation.length ? territory.standardElevation.map(miLeadLabel).join('・') : '標準12誘導では直接見えにくい'}</dd></div><div><dt>代表的な責任冠動脈候補</dt><dd>{territory.artery}</dd></div></dl>
          </div>
        </div>
        <p className="mi-diagram-note">冠動脈の走行には個人差があります。図の血管と心筋領域は、基本的な位置関係を学ぶための模式表示です。</p>
      </section>

      <section className="content-card mi-leads-card" aria-labelledby="mi-leads-heading">
        <div className="section-heading"><div><p className="eyebrow">誘導から壁へ</p><h2 id="mi-leads-heading">12誘導を同じ配置で比べる</h2></div></div>
        <p className="mi-lead-intro"><b style={{ color: territory.color }}>色付き</b>は注目するST変化。薄い波形は、この代表モデルで大きな変化を置いていない誘導です。</p>
        <div className="mi-lead-grid" aria-label={`${territory.title}の12誘導模式波形`}>
          {STANDARD_LEADS.map((lead) => <MILeadStrip key={lead} lead={lead} change={miLeadChange(territory, lead)} color={territory.color} />)}
        </div>

        {extraLeads.length > 0 && <div className="mi-extra-leads"><div><p className="eyebrow">追加誘導</p><h3>{activeId === 'posterior' ? '背中側のV7〜V9で確かめる' : '右胸側のV3R・V4Rで確かめる'}</h3></div><div className="mi-extra-grid">{extraLeads.map((lead) => <MILeadStrip key={lead} lead={lead} change="elevation" color={territory.color} supplemental />)}</div></div>}

        <div className="mi-reasoning">
          <p><strong>直接変化：</strong>{territory.standardElevation.length ? `${territory.standardElevation.map(miLeadLabel).join('・')}のST上昇をひとまとまりで見ます。` : '標準12誘導だけでは後壁を正面から見ていません。'}</p>
          <p><strong>鏡像変化：</strong>{territory.reciprocalDepression.length ? `${territory.reciprocalDepression.map(miLeadLabel).join('・')}のST低下を、反対側から見た手がかりとして扱います。` : 'この基本モデルでは特定の鏡像誘導を強調していません。'}</p>
          <p><strong>次の一手：</strong>{territory.nextCheck}</p>
          <p><strong>冠動脈：</strong>{territory.arteryNote}</p>
        </div>
      </section>

      <InfoCard title="ST変化だけで『心筋梗塞が確定』するわけではありません">
        <p>この研究室は、急性冠閉塞を疑う典型的なST変化と心筋領域を結ぶ学習用モデルです。実際は症状、発症時刻、連続する2誘導以上のJ点変化、過去心電図、経時変化、トロポニン、心エコー、冠動脈評価を合わせます。左脚ブロック、ペーシング、左室肥大、早期再分極、心膜炎などでは単純な対応が使えません。胸痛・冷汗・呼吸困難などがある実患者では、この画面で判定せず緊急評価につなげます。</p>
      </InfoCard>

      <details className="pvc-sources"><summary>正確さの範囲と参考文献</summary><p>波形と心臓図はECGlab用の独自模式図で、患者の実記録ではありません。「前壁」「後壁」などは心電図上の学習用領域名で、画像診断上の解剖学的区分や責任冠動脈と完全な一対一ではありません。</p><ul><li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4919754/" target="_blank" rel="noreferrer">冠動脈の正常走行と灌流領域</a></li><li><a href="https://www.ahajournals.org/doi/pdf/10.1161/CIR.0000000000001309" target="_blank" rel="noreferrer">2025 ACC/AHA 急性冠症候群ガイドライン</a></li><li><a href="https://academic.oup.com/eurheartj/article/39/2/119/4095042" target="_blank" rel="noreferrer">2017 ESC STEMIガイドライン</a></li><li><a href="https://www.ahajournals.org/doi/pdf/10.1161/CIR.0000000000000617" target="_blank" rel="noreferrer">Fourth Universal Definition of Myocardial Infarction</a></li></ul></details>
    </div>
  );
}
