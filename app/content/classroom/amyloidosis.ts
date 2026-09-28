import type { Lesson } from './types';
import { references as r } from './references';
export const lesson: Lesson = {
  slug:'amyloidosis',visual:'amyloid',lead:'画像では壁が厚いのに、心電図の電位は小さい。この組み合わせが手掛かりになることがあります。',
  points:[{title:'厚さと電位のつり合い',body:'アミロイドの沈着により壁が厚く見える場合があります。画像の壁厚に比べて心電図の電位が小さいことは、検討する所見のひとつです。'},{title:'QRS以外も観察',body:'偽梗塞様のQ波、房室・心室内の伝導障害、心房細動なども見られます。ひとつの典型波形に限られません。'},{title:'型の診断は別の検査',body:'心電図だけで原因蛋白の型は分かりません。心エコー・MRI、血液や尿の検査、核医学検査などを適切に組み合わせます。'}],
  pitfalls:['低電位がない心アミロイドーシスもあります。電位が保たれているだけで除外しません。','低電位そのものにも他の原因があります。図の壁厚と電位は、診断の閾値や全患者に共通する比例関係を示していません。'],
  question:{prompt:'心電図の電位が低くなければ、心アミロイドーシスを否定できる？',answers:['できる','できない'],correct:1,explanation:'低電位は手掛かりのひとつで、必須所見ではありません。画像や臨床背景と合わせます。'},sources:[r.amyloid],labs:[{slug:'lead-views',title:'誘導の見え方ラボ'}],
};
