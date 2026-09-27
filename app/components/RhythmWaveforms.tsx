import { useId } from 'react';
import { RHYTHM_LEADS, rhythmSample, type RhythmId, type RhythmLead } from '@/app/domain/tachycardia';
import styles from './RhythmLabs.module.css';

function trace(id: RhythmId, lead: RhythmLead, rate: number, conduction: number, atrial: boolean, duration: number, width: number, baseline: number, scale: number) {
  return Array.from({ length: Math.round(duration * 500) + 1 }, (_, i) => {
    const t = i / 500;
    return `${i === 0 ? 'M' : 'L'}${(t / duration * width).toFixed(2)},${(baseline - rhythmSample(t, id, lead, rate, conduction, atrial) * scale).toFixed(2)}`;
  }).join(' ');
}
export function RhythmWaveforms({ id, rate, conduction, overlay }: { id: RhythmId; rate: number; conduction: number; overlay: boolean }) {
  const uid = useId().replaceAll(':', '');
  return <>
    <div className={styles.legend}><span className={styles.ventricular}>実線：合成心電図</span><span className={styles.atrial}>破線：心房成分（学習用分離）</span></div>
    <div className={styles.leads} aria-label="同時刻の12誘導・左列から読む">
      {RHYTHM_LEADS.map(lead => <figure key={lead} className={styles.wave}><figcaption><strong>{lead}</strong><span>2秒</span></figcaption><svg viewBox="0 0 250 82" role="img" aria-label={`${lead}誘導・${id}・心房レート${rate}`}>
        <defs><pattern id={`${uid}-${lead}`} width="25" height="22" patternUnits="userSpaceOnUse"><path d="M25 0H0V22" fill="none" stroke="#e2eaf1" strokeWidth=".7" /></pattern></defs>
        <rect width="250" height="82" fill={`url(#${uid}-${lead})`} /><path d={trace(id, lead, rate, conduction, false, 2, 250, 45, 26)} className={styles.trace} />
        {overlay && <path d={trace(id, lead, rate, conduction, true, 2, 250, 45, 26)} className={styles.atrialTrace} />}
      </svg></figure>)}
    </div>
    <div className={styles.zoom}><h3>Ⅱ誘導・心房成分を拡大</h3><svg viewBox="0 0 600 100" role="img" aria-label="Ⅱ誘導の合成波形と心房成分の拡大図"><path d="M0 52H600" stroke="#d5e1eb" /><path d={trace(id, 'II', rate, conduction, false, 2, 600, 52, 36)} className={styles.trace} />{overlay && <path d={trace(id, 'II', rate, conduction, true, 2, 600, 52, 36)} className={styles.atrialTrace} />}</svg></div>
    <p className={`${styles.small} ${styles.waveScaleNote}`}>全誘導は同じ2秒間。縦・横は画面に合わせた模式スケール（紙記録の25 mm/s・10 mm/mVとは異なる）。</p>
  </>;
}
