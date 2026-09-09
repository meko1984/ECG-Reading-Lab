'use client';

import { useState } from 'react';
import { InfoCard } from '@/app/components/InfoCard';
import { PVCOriginDiagram } from '@/app/components/PVCOriginDiagram';
import { PVCQuickWaveform, PVCWaveform } from '@/app/components/PVCWaveform';
import { pvcOrigin, pvcPolarityLabel, pvcRegionLocation, type PVCOriginId } from '@/app/domain/pvc';
import { PVC_CORE_LEADS, RVOT_CHEST_LEADS, pvcQrsDuration } from '@/app/domain/pvc-waveform';

export function PVCLabClient() {
  const [activeOriginId, setActiveOriginId] = useState<PVCOriginId>('right-upper-outer');
  const activeOrigin = pvcOrigin(activeOriginId);
  const isRvot = activeOriginId === 'right-upper-outer';
  const selection = activeOrigin.selections;
  const isLeft = activeOrigin.ventricle === 'left';
  return (
    <div className="pvc-lab">
      <section className="content-card pvc-origin-card" aria-labelledby="pvc-origin-heading">
        <div className="section-heading"><div><p className="eyebrow">場所からQRSへ</p><h2 id="pvc-origin-heading">心室の起源を選ぶ</h2></div><span className="unit-badge">8つの領域</span></div>
        <PVCOriginDiagram activeOriginId={activeOriginId} onSelect={setActiveOriginId} />
        <p className="pvc-selection-status" aria-live="polite">{activeOrigin.markerNumber}番、{activeOrigin.siteName}を選択中</p>
        <div className="pvc-quick-grid" aria-label={`${activeOrigin.siteName}の8誘導早見波形`}>
          {PVC_CORE_LEADS.map(lead => <PVCQuickWaveform key={lead} originId={activeOriginId} lead={lead} color={activeOrigin.color} />)}
        </div>
      </section>

      <section className="content-card pvc-wave-card" aria-labelledby="pvc-wave-heading">
        <div className="section-heading"><div><p className="eyebrow">QRSから場所へ</p><h2 id="pvc-wave-heading">V1から、4つの手がかりへ</h2></div></div>
        <p className="pvc-wave-overview-intro">{isRvot ? '右室流出路PVCの参考例。' : '参考書の極性モデル。'} V1だけで起源は確定できません。</p>
        <details className="pvc-transition"><summary>V1の見方・注意点</summary><div className="pvc-v1-guide">
          <strong>V1は、PVCのQRSの向きを見る</strong>
          <p>{isLeft ? 'この表示はqR型・陽性優位 → 右脚ブロック様。左室側を考える手がかりです。' : 'この表示はrS型・陰性優位 → 左脚ブロック様。右室側を考える手がかりです。'}</p>
          <p>「様」はPVCの形の呼び方で、脚そのもののブロックを診断しているわけではありません。左室流出路・大動脈洞起源でも左脚ブロック様になるため、V1だけで左右を確定できません。</p>
        </div></details>
        <div className="pvc-reasoning">
          <p><strong>① V1：</strong>{isLeft ? 'qR型・陽性優位 → 右脚ブロック様' : 'rS型・陰性優位 → 左脚ブロック様'}</p>
          <p><strong>② Ⅱ・Ⅲ・aVF：</strong>{pvcPolarityLabel(selection.inferiorPolarity)} → {selection.inferiorPolarity === 'positive' ? '上方の起源を考える' : '下方の起源を考える'}</p>
          <p><strong>③ Ⅰ・aVL：</strong>{isRvot ? 'この例はⅠが低振幅rS、aVLがQS' : `${pvcPolarityLabel(selection.lateralPolarity)} → 左右方向の手がかり`}</p>
          <p><strong>④ V5・V6：</strong>{isRvot ? 'R優位。移行帯も確認' : `${pvcPolarityLabel(selection.leftPrecordialPolarity)} → このモデルでは${selection.leftPrecordialPolarity === 'positive' ? '心基部・弁輪側' : '心尖部側'}`}</p>
        </div>
        {isRvot ? <details className="pvc-transition">
          <summary>V1〜V6で移行帯を見比べる</summary>
          <p>参考画像に合わせ、V1〜V3はS優位、V4からR優位になる例を表示。RとSの優位が切り替わるところが移行帯です。V4以降の遅い移行は右室流出路を支持しますが、個人差と左室流出路との重なりがあります。</p>
          <div className="pvc-chest-grid">{RVOT_CHEST_LEADS.map(lead => <PVCQuickWaveform key={lead} lead={lead} originId={activeOriginId} color={activeOrigin.color} />)}</div>
        </details> : null}
        <h3 className="pvc-strip-heading">8誘導の連続波形</h3>
        <p className="pvc-wave-overview-intro">色つき部分＝PVCのQRSとST-T。小マス＝40 ms・0.1 mV。</p>
        <div className="pvc-lead-stack" aria-label={`${activeOrigin.siteName}の8誘導連続模式波形`}>
          {PVC_CORE_LEADS.map(lead => <PVCWaveform key={lead} originId={activeOriginId} lead={lead} color={activeOrigin.color} />)}
        </div>
        <details className="pvc-transition"><summary>波形の設定・休止の見方</summary>
          <p>早見波形は時間軸を拡大しています。連続波形は25 mm/s・10 mm/mV相当の縮尺表示で、洞性QRSは80 ms、PVCは{pvcQrsDuration(activeOriginId)} msの設定です。</p>
          <p>2拍の洞性拍の後、予定より早いPVCが出現します。前後の洞性R波間が通常のRR間隔の2倍になる、完全代償性休止の例です。定時のP波がPVCのQRS／ST-Tに重なることも表現しています。PVC後のT波は主QRSと反対向きの代表例で、幅や休止には例外もあります。</p>
        </details>
      </section>

      <section className="content-card pvc-guide-card" aria-labelledby="pvc-guide-heading">
        <div className="section-heading"><div><p className="eyebrow">図と波形をつなぐ</p><h2 id="pvc-guide-heading">選んだ領域の位置</h2></div></div>
        <div className="pvc-selected-origin"><p>{isLeft ? '左室側' : '右室側'}</p><h3 style={{ color: activeOrigin.color }}>{activeOrigin.siteName}</h3><span>{pvcRegionLocation(activeOrigin.region)}</span></div>
        <div className="pvc-anatomy-key">
          <p>濃い部分＝学習の主役。薄い部分＝位置関係の補助。</p>
          <details className="pvc-transition"><summary>図の詳しい見方</summary>
          <p>白＝開いた心腔。破線の3・7は奥側の後壁・下壁を示します。</p>
          <p>番号と部位名をまとめたラベルを押すと、線の先にある領域の波形に切り替わります。1番は右室流出路の参考例、5番は左室流出路・弁輪前壁の領域モデルです。三尖弁輪自由壁の注記は解剖学的な位置を示し、3番の後壁・下壁と同じ範囲ではありません。</p>
          <p>心室・流出路・弁輪を通常の濃さで、位置関係を補う心房・大血管などを薄く表示しています。薄さはこの図での学習上の優先度を表し、起源の有無を判定するものではありません。狭い画面では図の内部を左右にスクロールできます。</p>
          <p><strong>図の見方：</strong>患者の右が画面左。前壁を開き、心腔と流出路が見えるようにした展開模式図です。実際の一枚の断面ではありません。2・6は開いた前壁側を切り口付近で、破線の3・7は奥側の後壁・下壁を示します。番号は領域の目印で、正確な一点の起源を示すものではありません。</p>
          <p><strong>位置関係：</strong>右室は左室の前方を包み、心臓全体の先端は左室がつくります。右室流出路は大動脈基部の前方を通って肺動脈弁へ、左室流出路は僧帽弁と心室中隔の間から大動脈弁へ続きます。</p>
          </details>
          <div><span><i className="pvc-key-right" />右心系</span><span><i className="pvc-key-left" />左心系</span><span><i className="pvc-key-whole" />心臓全体の輪郭</span></div>
        </div>
      </section>
      <InfoCard title="大まかな領域を学ぶためのモデル">
        <p>学習用の代表波形です。同じ部位でも波形は変わり、起源を確定する診断には使えません。</p>
      </InfoCard>
      <details className="pvc-sources"><summary>図・波形の根拠と表現の範囲</summary>
        <p>1番の参考例ではⅠが低振幅rS、aVLがQSで、参考書の一括した「陽性」の組合せには当てはまりません。</p>
        <p>8領域は参考書の簡略化した対応です。同じ領域でも波形は変わり、弁輪と流出路も同一部位ではありません。1番は右室流出路の参考例、ほかは極性を学ぶための代表モデルです。QSの深さだけから起源までの距離を決めることはできません。</p>
        <p>実際の起源推定には12誘導全体、移行帯、電極位置や心臓の向き、基礎心疾患などを合わせて評価します。このページは起源を確定する診断ツールではありません。</p>
        <p>参考：提供された参考書の「PVC起源推定の4ステップ」「PVC起源の考え方」と、問題054の右室流出路PVC。書名・版は未確認。波形はその特徴をもとに再構成したもので、写真のデジタルトレースや患者データではありません。振幅・時間の数値も実測値ではありません。</p>
        <p>解剖図の白い部分は開いた心腔です。心筋の厚さの違い、弁の付着、血管との連続を表現しています。後壁を破線で投影し、弁尖・腱索・肉柱と血管の枝は一部を省略しています。陰影による立体表現は使っていません。</p>
        <ul>
          <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4668306/" target="_blank" rel="noreferrer">心室・弁・流出路の解剖学的位置関係（2015）</a></li>
          <li><a href="https://www.ahajournals.org/doi/pdf/10.1161/01.cir.46.1.138" target="_blank" rel="noreferrer">乳頭筋と僧帽弁腱索の解剖（原著・PDF）</a></li>
          <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9527274/" target="_blank" rel="noreferrer">RVOT／LVOTのV1形態と胸部誘導移行の比較研究（2022）</a></li>
          <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7667178/" target="_blank" rel="noreferrer">V1の陰性・陽性優位と起源推定（2020）</a></li>
          <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11317726/" target="_blank" rel="noreferrer">JCS/JHRS不整脈の診断とリスク評価：PVCと代償性休止</a></li>
        </ul>
      </details>
    </div>
  );
}
