import type { Lesson } from './types';
import { references as r } from './references';
export const lesson: Lesson = {
  slug:'pac',visual:'pac',lead:'早いQRSより先に、早いP′を探します。心房から始まった一拍が心室まで届くとは限りません。',
  points:[{title:'予定より早いP′',body:'前のP–P間隔を手掛かりに、早く現れた心房の波を探します。P′の形は、いつもの洞性P波と違うことがあります。'},{title:'QRSが続くか',body:'伝導すればQRSが続きます。心室内の伝導条件によっては幅広くなることもあります。'},{title:'T波の形も比べる',body:'非伝導性PACではQRSが続きません。早いP′が前のT波に埋まり、T波の小さな変形として見えることもあります。'}],
  pitfalls:['休止だけを見て洞停止と決めず、前のT波に隠れたP′を探します。','PACとPVCをQRS幅ひとつで二分しません。連結期、P′、前後の調律を合わせます。'],
  question:{prompt:'早いP′のあとにQRSが続かない例は？',answers:['非伝導性PAC','必ず完全房室ブロック','必ず洞停止'],correct:0,explanation:'心房の早い興奮が伝わらない例です。単に「拍が抜けた」で止めず、P′の時刻を見ます。'},sources:[r.arrhythmiaTypes,r.blockedPac,r.jcs],labs:[{slug:'pac',title:'PACラボで連結期を動かす'}],
};
