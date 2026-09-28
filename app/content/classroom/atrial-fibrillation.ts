import type { Lesson } from './types';
import { references as r } from './references';
export const lesson: Lesson = {
  recordId:'04117',
  slug:'atrial-fibrillation',visual:'af',lead:'「RRが不規則」と「揃ったP波が見えない」を、別々に確認してからつなげます。',
  points:[{title:'RRの並び',body:'一定の繰り返しがない不規則性を観察します。数拍だけの印象ではなく、記録全体を見ます。'},{title:'心房活動',body:'同じ形で繰り返すP波が見られないかを複数誘導で確認します。細かなf波は目立たない場合もあります。'},{title:'ノイズ・他の調律',body:'筋電図や基線の揺れ、期外収縮が多い調律でも紛らわしく見えます。実記録と記録条件の確認が必要です。'}],
  pitfalls:['不規則なRRだけでAFと決めません。逆に、完全房室ブロックやペーシングが合併すると、AFでも心室の間隔が規則的になる場合があります。','この教材の短い図から発作の持続時間や治療方針を判定しません。脳梗塞リスクなどの評価は波形の形だけでは行えません。'],
  question:{prompt:'AFの観察として適切なのは？',answers:['RRの不規則性だけを見る','RRと心房活動を複数誘導で確認する','基線の揺れをすべてf波と呼ぶ'],correct:1,explanation:'時間の並びと心房の活動を合わせ、ノイズや別の不整脈も考えます。'},sources:[r.jcs,r.arrhythmiaTypes],labs:[],
};
