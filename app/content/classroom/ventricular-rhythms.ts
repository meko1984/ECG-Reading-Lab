import type { Lesson } from './types';
import { references as r } from './references';
export const lesson: Lesson = {
  slug:'ventricular-rhythms',visual:'ventricular',lead:'心室から続く興奮を、速さ・形の揃い方・まとまったQRSの有無で観察します。',
  points:[{title:'VT：形と連続性',body:'心室由来の頻拍です。形がほぼ揃う単形性と、拍ごとに変化する多形性を分けます。心室性の連続波形を「多形性PVC」と呼ぶだけでは不十分です。'},{title:'TdPとVF',body:'TdPはQT延長を背景とする多形性VTです。VFはまとまったQRSを認めない無秩序な心室活動で、同じものではありません。'},{title:'AIVR：速さにも文脈',body:'促進心室固有調律は比較的遅い心室性リズムです。引用した2025年の研究では50/分超・100/分未満を対象にしています。文献による範囲差があり、一律の境界で診断しません。'}],
  pitfalls:['すべての多形性VTをTdPと呼びません。先行するQTや発症の状況を確認します。','VF様の線でもノイズの可能性があります。実際には患者の反応・呼吸・循環を直ちに確認する場面であり、教材の見比べに時間を費やす場面ではありません。'],
  question:{prompt:'TdPについて正しい関係は？',answers:['多形性VTはすべてTdP','QT延長を背景とする特徴的な多形性VT','PVCが1拍あるだけでTdP'],correct:1,explanation:'TdPは多形性VTのひとつです。QTの背景と波形の連続性を合わせて考えます。'},sources:[r.jcs,r.inherited,r.aivr,r.arrhythmiaTypes],labs:[{slug:'pvc',title:'PVCラボで心室由来の興奮を見る'}],
};
