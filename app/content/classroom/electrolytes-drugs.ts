import type { Lesson } from './types';
import { references as r } from './references';
export const lesson: Lesson = {
  slug:'electrolytes-drugs',visual:'electrolytes',lead:'波形が変わる場所を先に見つけます。形を見て血液中の濃度や薬の中毒を言い当てる教材ではありません。',
  points:[{title:'K：T・P・伝導',body:'高Kでは尖ったT、Pの低下や消失、PR延長、QRS拡大などが手掛かりです。低KではTの平低化、ST低下、目立つUなどを観察します。変化の出方は一様ではありません。'},{title:'Ca：ST・QT',body:'低CaではQTが延び、高Caでは短くなる方向の変化が見られます。QTを測る前に、Tの終わりとU波を区別します。'},{title:'薬剤：作用と中毒を区別',body:'ジゴキシンでは治療量でもPR延長やST低下を起こし得ます。QTを延ばす薬剤もあり、服薬・電解質・症状などの背景と合わせて評価します。'}],
  pitfalls:['高Kでも典型的な心電図変化がないことがあります。見た目が正常だから安全とは判断できません。','ジギタリスの盆状変化は主にSTの表現です。T波やU波と区別して観察し、中毒の確定所見として扱いません。'],
  question:{prompt:'ジゴキシン使用中のST低下だけで、中毒と判断できる？',answers:['できる','治療量でも起こり得るため、それだけではできない'],correct:1,explanation:'薬の作用による心電図変化と、中毒の臨床評価は分けます。'},sources:[r.hyperkalemia,r.hypokalemia,r.pediatric,r.digoxin,r.inherited],labs:[{slug:'membrane-potential',title:'膜電位・電解質ラボ'}],
};
