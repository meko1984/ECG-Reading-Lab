import type { Lesson } from './types';
import { references as r } from './references';
export const lesson: Lesson = {
  slug:'j-wave-brugada',visual:'j-wave',lead:'QRSの終わりからST・Tへ。形だけでなく、どの誘導で、どのような状況で現れたかを見ます。',
  points:[{title:'J点の前後を見る',body:'QRS末端のノッチやスラー、続くSTの向きを観察します。J点はQRSとSTの境目です。'},{title:'誘導を分ける',body:'早期再分極では下壁・側壁の誘導が手掛かりです。Brugada型では右前胸部、特にV1・V2を見ます。同じST上昇としてまとめません。'},{title:'形と背景を合わせる',body:'タイプ1はコブド型ST上昇と陰性Tが特徴です。サドルバック型だけでBrugada症候群を確定しません。自然発生・薬剤誘発の区別、症状や家族歴も評価に関わります。'}],
  pitfalls:['早期再分極パターンと、心室細動などの臨床背景を伴う早期再分極症候群は別です。J波があるだけで症候群とは呼びません。','発熱や記録する肋間、フィルターでも見え方が変わります。この図は波形の概念で、診断基準の高さ・幅を測る図ではありません。'],
  question:{prompt:'サドルバック型の形を見つけたら？',answers:['形だけでBrugada症候群と確定する','誘導・記録条件・他の波形・臨床背景を確認する','早期再分極と同じものとして扱う'],correct:1,explanation:'形を記述する段階と、診断・リスクを評価する段階を分けます。'},sources:[r.inherited],labs:[{slug:'membrane-potential',title:'膜電位ラボで再分極を復習'}],
};
