import type { Lesson } from './types';
import { references as r } from './references';
export const lesson: Lesson = {
  slug:'p-pr',visual:'pr',lead:'P波の幅と、Pの始まりからQRSまでの時間は別です。始点と終点を選んで測りましょう。',
  points:[{title:'P波：幅・高さ・向き',body:'心房の脱分極を見ます。幅と高さを同じ誘導・記録条件で比較し、他の誘導にも目を向けます。'},{title:'PR：Pの始まり→QRSの始まり',body:'P波の終わりから測るのではありません。心房内の伝導から心室が興奮し始めるまでを含み、房室結節だけの時間ではありません。'},{title:'短い／長いを観察',body:'成人で全P波が伝導しPRが200 msを超える場合は1度房室ブロックの所見です。短いPRではデルタ波の有無やP波の起源も観察します。'}],
  pitfalls:['短いPRだけでWPWと決めません。デルタ波や他の所見を合わせます。「LGL」は短いPRから直ちに付ける診断名ではありません。','P波の形から、心房の大きさや特定の弁膜症を確定することはできません。年齢による基準の違いもあります。'],
  question:{prompt:'PR間隔の始まりはどこ？',answers:['P波の始まり','P波の頂点','P波の終わり'],correct:0,explanation:'Pの始まりからQRSの始まりまでです。P波の幅もPR間隔に含まれます。'},sources:[r.jcs,r.pediatric],labs:[{slug:'pac',title:'心房期外収縮ラボ'},{slug:'wpw',title:'WPWラボ'}],
};
