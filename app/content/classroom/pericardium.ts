import type { Lesson } from './types';
import { references as r } from './references';
export const lesson: Lesson = {
  slug:'pericardium',visual:'pericardium',lead:'心膜の炎症、液の貯留、血液が心臓に入りにくくなる状態。この3つを分けて考えます。',
  points:[{title:'心膜炎：炎症',body:'広い誘導のST上昇やPR部分の低下が手掛かりです。全例に典型所見があるわけではなく、STの形だけで梗塞と区別しません。'},{title:'心嚢液：心臓の周囲の液',body:'貯留に伴って低電位や電気的交互脈が見られることがあります。心電図だけで液の量は測れません。'},{title:'タンポナーデ：充満の障害',body:'心臓が拡張して血液を受け入れることが妨げられ、心拍出が低下する状態です。液量だけでなく溜まる速さなども影響し、循環状態と心エコーを合わせて評価します。'}],
  pitfalls:['心嚢液があることと、タンポナーデになっていることは同じではありません。低電位・電気的交互脈の有無だけでは決まりません。','電気的交互脈は心電図の振幅などが一拍ごとに変わる所見です。脈の強さが交互に変わる交互脈や、呼吸に伴う奇脈とは分けます。'],
  question:{prompt:'タンポナーデの中心となる問題は？',answers:['心嚢液が少しでも存在すること','心臓の充満が妨げられ、循環に影響すること','必ずSTが上昇すること'],correct:1,explanation:'液の有無と、血液を受け入れられない循環への影響を区別します。'},sources:[r.pericardium,r.pericarditisEcg],labs:[{slug:'mi',title:'心筋梗塞ラボで誘導の分布を見る'}],
};
