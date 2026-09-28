import type { Lesson } from './types';
import { references as r } from './references';
export const lesson: Lesson = {
  slug:'position',visual:'position',lead:'いつもと違う波形なら、心臓の向きと電極の位置を確かめます。Ⅰ誘導の上下だけで結論を出さないようにしましょう。',
  points:[{title:'左右の腕の取り違え',body:'右腕と左腕の接続を交換するとⅠは反転し、ⅡとⅢ、aVRとaVLが入れ替わります。この交換だけなら胸部誘導は変わりません。'},{title:'鏡像右胸心との違い',body:'通常の左胸部に電極を置いた鏡像右胸心では、四肢誘導だけでなく胸部誘導のR波の並びも手掛かりになります。身体所見や画像で位置を確認します。'},{title:'位置・体格・記録条件',body:'胸部電極の高低や左右、体位などでも波形は変わります。変更した位置は記録し、比較するときは条件をそろえます。'}],
  pitfalls:['Ⅰが陰性だから右胸心、とは決まりません。電極の取り違えや別の原因も考えます。','胸部のR波増高が乏しいことも、右胸心だけに特異的ではありません。図は左右交換の原理で、実際の電極装着手順は関連ラボで確認します。'],
  question:{prompt:'右腕と左腕の接続だけを交換した場合、変わらないのは？',answers:['Ⅰ誘導の向き','ⅡとⅢの対応','胸部誘導の波形'],correct:2,explanation:'腕の左右交換では中心電極の平均は変わらないため、その交換だけなら胸部誘導は保たれます。'},sources:[r.leadReversal,r.recording],labs:[{slug:'electrodes',title:'電極装着ラボで位置を確認'},{slug:'axis',title:'電気軸ラボ'}],
};
