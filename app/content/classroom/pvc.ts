import type { Lesson } from './types';
import { references as r } from './references';
export const lesson: Lesson = {
  recordId:'00665',
  slug:'pvc',visual:'pvc',lead:'予定より早い、形の違うQRS。その一拍だけでなく、前後のP波と休止も見比べます。',
  points:[{title:'いつ現れたか',body:'基本調律から予想した次の拍より早いかを確認します。遅れて現れる補充収縮とは、時間の関係が違います。'},{title:'どこから始まったか',body:'PVCは心室由来の早い興奮です。通常は幅広いQRSで、前のP波から一定のPRで伝わった形になりません。'},{title:'広いPACとも比較',body:'上室から伝わっても、心室内の伝導が通常と違うとQRSは広がります。P′との関係や他の誘導を一緒に観察します。'}],
  pitfalls:['P波が見えたことだけでPVCを否定しません。洞性P波が偶然近くにある場合や、逆行性P波もあります。','完全代償性休止は手掛かりのひとつです。すべてのPVCに必ずある条件ではありません。連発・形の多様性・背景も評価されます。'],
  question:{prompt:'幅の広い早期のQRSを見たら、次に何を見る？',answers:['幅だけでPVCに決める','前後のP波とQRSの時間関係','P波が1つあればPVCを否定'],correct:1,explanation:'起源と伝わり方を考えるために、P′や前後の基本調律とのつながりを確認します。'},sources:[r.arrhythmiaTypes,r.jcs],labs:[{slug:'pvc',title:'PVCラボで発生を比べる'},{slug:'pac',title:'PACラボで変行伝導を見る'}],
};
