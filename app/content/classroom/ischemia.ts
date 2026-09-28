import type { Lesson } from './types';
import { references as r } from './references';
export const lesson: Lesson = {
  slug:'ischemia',visual:'ischemia',lead:'ST・T・Qの形だけでなく、どの誘導にまとまるか、時間とともにどう変わるかを見ます。',
  points:[{title:'隣接する誘導を比べる',body:'下壁・前胸部・側壁などの方向で所見を整理します。反対側の誘導のST変化も観察します。ひとつの誘導や「何mm」だけで梗塞を確定しません。'},{title:'Q波・T波も文脈で',body:'Q波は幅・深さ・分布を合わせます。小さな中隔性Q波や、虚血以外の原因によるQ波もあります。陰性Tや二相性Tも形だけの確定診断ではありません。'},{title:'以前の記録と経過',body:'以前の心電図、症状の時刻、繰り返しの記録、心筋傷害マーカーなどが必要です。心筋梗塞の臨床診断は、心筋傷害に虚血の証拠を合わせて考えます。'}],
  pitfalls:['ST上昇の基準はV2・V3で年齢・性別の条件などが異なります。一律の高さだけを全誘導へ適用しません。ST上昇がなくても急性冠症候群を除外できません。','胸痛の経過を伴う前胸部の深い陰性T・二相性Tなど、Wellensパターンを考える所見を「Tだけだから軽い」と扱いません。心膜炎やたこつぼとの鑑別も、形ひとつでは完結しません。'],
  question:{prompt:'新しいST・T変化を見たとき、必要な見方は？',answers:['一番高いSTだけで結論を出す','誘導の分布・以前の記録・症状や検査を合わせる','Q波がなければ梗塞を否定する'],correct:1,explanation:'観察所見と臨床診断は別の段階です。波形の分布と時間変化をまず整理します。'},sources:[r.mi,r.acs,r.wellens,r.repolarization],labs:[{slug:'mi',title:'心筋梗塞ラボで誘導の方向を見る'},{slug:'mirror',title:'ミラーイメージラボ'}],
};
