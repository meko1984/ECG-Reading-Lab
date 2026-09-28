import type { Lesson } from './types';
import { references as r } from './references';
export const lesson: Lesson = {
  slug:'bundle-block',visual:'bundle',lead:'片側へ届く時間が変わると、QRSの終わり方も変わります。経路・幅・誘導ごとの形をつなげましょう。',
  points:[{title:'右脚ブロックの観察',body:'V1・V2の終末陽性成分（R′など）と、Ⅰ・V6の幅広い終末S波が手掛かりです。成人の完全脚ブロックではQRS 120 ms以上に加え、形態の条件を確認します。'},{title:'左脚ブロックの観察',body:'Ⅰ・aVL・V5・V6の幅広いR波、V1の主に陰性のQRSなどを観察します。興奮の順序が変わるため、ST・Tにも二次的な変化が生じます。'},{title:'分枝と電気軸',body:'左脚前枝では左軸、後枝では右軸への偏りが手掛かりです。ただし軸の向きだけでは診断できません。四肢誘導のQRS形態や他の原因を合わせて評価します。'}],
  pitfalls:['幅が120 ms以上ならすべて脚ブロック、とは限りません。心室性興奮や早期興奮などでも広がります。小児には成人の幅の基準を当てはめません。','右脚ブロックと分枝ブロックの組合せにPR延長があっても、残る枝の障害まで証明したことにはなりません。PRには房室結節の伝導も含まれます。'],
  question:{prompt:'右脚ブロックと左脚前枝ブロックにPR延長があれば、三枝すべての障害を証明できる？',answers:['証明できる','PR延長の部位はそれだけでは分からない'],correct:1,explanation:'PR延長は房室結節などでも起こります。表面の時間間隔と解剖学的な障害部位を一対一に結びつけません。'},sources:[r.intraventricular,r.jcs,r.conductionDisorders],labs:[{slug:'axis',title:'電気軸ラボで方向を確認'}],
};
