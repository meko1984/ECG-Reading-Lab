'use client';
import { useState } from 'react';
import { MirrorHeart3D } from './MirrorHeart3D';
import { MIRROR_LEADS, mirrorSelection, type MirrorLead } from '@/app/domain/mirror';
import styles from './MirrorLabClient.module.css';
import { LabDisclaimer } from './LabDisclaimer';
export function MirrorLabClient() {
  const [lead, setLead] = useState<MirrorLead>('Ⅲ');
  const selection = mirrorSelection(lead), scenario = selection.scenario;
  return <div className={styles.lab}>
    <section className="content-card" aria-label="ミラーイメージの観察">
      <div className={styles.key}><span data-kind="selected">青：選択中</span><span data-kind="mirror">橙：鏡像側</span></div>
      <div className={styles.leads} role="group" aria-label="誘導を選択">
        {MIRROR_LEADS.map(item => <button key={item} type="button" aria-label={item} aria-pressed={item === lead} data-reciprocal={selection.reciprocal.includes(item)} onClick={() => setLead(item)}>
          <strong>{item}</strong>{item === lead ? <small>選択中</small> : selection.reciprocal.includes(item) ? <small>鏡像側</small> : null}
        </button>)}
      </div>
      <MirrorHeart3D key={scenario?.id || 'none'} selection={selection} />
      <p className={styles.brief} aria-live="polite">{scenario ? '色＝観察方向の目安。' : '固定の鏡像ペアなし。'}</p>
    </section>
    <details className="pvc-sources"><summary>補足・参考資料</summary>
      <ul>
        <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8200569/" target="_blank" rel="noreferrer">冠動脈の正常解剖と優位性</a></li>
        <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC1291319/" target="_blank" rel="noreferrer">誘導の直接変化と鏡像変化の関係</a></li>
        <li><a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC8762803/" target="_blank" rel="noreferrer">後壁のST上昇と前胸部の鏡像変化</a></li>
      </ul>
    </details>
    <LabDisclaimer />
  </div>;
}
