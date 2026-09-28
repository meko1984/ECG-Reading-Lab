import type { Lesson } from './types';
import { references as r } from './references';
export const lesson: Lesson = {
  slug:'arvc',visual:'epsilon',lead:'QRSが終わった後の小さな電位を見ます。ただし、小さな揺れを見つけることだけが診断ではありません。',
  points:[{title:'ε波の位置',body:'右前胸部誘導のQRS終末からT波の始まりまでに見られる、再現性のある小さな電位です。心室内の遅れた興奮を示す手掛かりになります。'},{title:'他の心電図所見',body:'右前胸部の陰性Tや心室性不整脈なども観察します。年齢や右脚ブロックの有無によって、所見の意味は変わります。'},{title:'複数の情報を組み合わせる',body:'ARVCは不整脈原性右室心筋症。より広いACMの概念では左室も関わり得ます。画像、家族歴、心電図、不整脈などを合わせて評価します。'}],
  pitfalls:['ε波に似た所見は他の疾患やノイズでも問題になります。ε波だけでARVCを確定せず、見えないだけでも除外しません。','図では場所を学ぶために小電位を強調しています。実波形の診断基準や、心筋の障害部位を再現する図ではありません。'],
  question:{prompt:'ε波の確認で大切なのは？',answers:['一回だけの小さな揺れで確定する','QRS後の位置と再現性を見て、他の検査所見も合わせる','P波の前にあることを確かめる'],correct:1,explanation:'ε波はP波の前ではなく、QRSの終末からT波までの区間を観察します。'},sources:[r.jcs],labs:[{slug:'pvc',title:'PVCラボで心室の興奮を復習'}],
};
