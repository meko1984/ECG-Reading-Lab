import type { Lesson } from './types';
import { references as r } from './references';
export const lesson: Lesson = {
  slug:'right-heart',visual:'right-heart',lead:'肺循環の変化は右室の負荷と結びつきます。心電図では、負荷を考える手掛かりを整理します。',
  points:[{title:'右心と肺循環',body:'右室は血液を肺へ送り出します。肺血管側の抵抗が増すと右室への圧負荷が増え、興奮や再分極の見え方も変わり得ます。'},{title:'複数の誘導を合わせる',body:'右軸偏位、右脚ブロック、右前胸部の陰性Tなどを、記録条件・以前の心電図と比較します。慢性の肺疾患と急性の変化を同一視しません。'},{title:'SⅠQⅢTⅢを分解',body:'ⅠのS波、ⅢのQ波、Ⅲの陰性Tの組み合わせです。急性肺塞栓症で見られることがありますが、すべての症例にそろうものではありません。'}],
  pitfalls:['SⅠQⅢTⅢだけで肺塞栓症を確定したり、その所見がないことで除外したりしません。症状、循環・呼吸の状態、画像や検査を合わせます。','Ⅰ・Ⅱ・ⅢにS波があるSⅠSⅡSⅢとは別の表現です。波形だけで「放置してよい」と決める所見ではありません。'],
  question:{prompt:'SⅠQⅢTⅢの「TⅢ」は何を指す？',answers:['Ⅲ誘導の陰性T波','Ⅲ誘導の大きなS波','V3誘導の陽性T波'],correct:0,explanation:'誘導を示すローマ数字と、QRS・Tの名前を分けて読みます。'},sources:[r.pulmonaryEcg,r.intraventricular],labs:[{slug:'axis',title:'電気軸ラボ'},{slug:'lead-views',title:'誘導の見え方ラボ'}],
};
