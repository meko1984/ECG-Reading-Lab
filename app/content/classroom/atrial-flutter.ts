import type { Lesson } from './types';
import { references as r } from './references';
export const lesson: Lesson = {
  recordId:'00023',
  slug:'atrial-flutter',visual:'flutter',lead:'心房のリズムと、心室へ伝わる割合を分けて見ます。2：1・3：1・4：1を切り替えてみましょう。',
  points:[{title:'心房の反復',body:'F波が繰り返す様子を、下壁誘導やV1を含めて探します。QRSやT波に重なって、すべて見えるとは限りません。'},{title:'伝導比を数える',body:'F波2回にQRS1回なら2：1です。房室伝導比が一定ならRRは規則的、変動すれば不規則になり得ます。'},{title:'回路による分類',body:'通常型は三尖弁輪を回る、下大静脈–三尖弁輪峡部に依存する回路が代表です。非通常型との違いは回路であり、RRの規則性ではありません。'}],
  pitfalls:['約150/分の規則的な頻拍に見えても、2：1伝導のAFLが隠れることがあります。ただし150/分だけで決まりません。','図の心房300/分は計算用の設定です。実際の心房レートは一定値に固定されません。'],
  question:{prompt:'通常型と非通常型のAFLを分ける本質は？',answers:['RRが規則的か','QRSが必ず狭いか','心房内の回路'],correct:2,explanation:'回路の違いで分類します。同じ回路でも房室伝導比が変わると心室の間隔は変化します。'},sources:[r.jcs],labs:[{slug:'atrial-flutter',title:'心房粗動ラボで回路を見る'}],
};
