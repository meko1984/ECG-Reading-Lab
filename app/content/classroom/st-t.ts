import type { Lesson } from './types';
import { references as r } from './references';
export const lesson: Lesson = {
  slug:'st-t',visual:'st',lead:'基線からの高さを見る前に、QRSが終わるJ点と、その後のST・Tを分けます。',
  points:[{title:'基線とJ点',body:'TP部分などの基準となる線を確認し、QRS終末のJ点を見つけます。基線の揺れやPRの変化で、見かけのSTの高さも変わります。'},{title:'ST：高さと形と分布',body:'上昇・低下だけでなく、隣接する誘導にどう分布するか、反対側でどんな変化があるかを見ます。ST上昇の判断基準は誘導・年齢・性別で異なります。'},{title:'T：向きと輪郭',body:'陰性、平低、高い、二相性などを観察します。二相性は基線の上下に成分を持つ形、二峰性は頂点が二つある形で、同じ意味ではありません。'}],
  pitfalls:['ST上昇＝心筋梗塞とは限りません。早期再分極、心膜炎、伝導障害などでも変わります。逆にST上昇がないことだけで虚血を除外できません。','「すべての胸部誘導で2 mm」といった一律の閾値を使いません。V2・V3の基準は特に条件が異なります。'],
  question:{prompt:'STを比べるとき、最初にそろえるものは？',answers:['基線・誘導・記録条件','最も高いT波だけ','QRSの色'],correct:0,explanation:'基準線と記録条件を確認してから、誘導群や経時変化へ進みます。'},sources:[r.repolarization,r.mi],labs:[{slug:'mirror',title:'ミラーイメージ・ST変化ラボ'}],
};
