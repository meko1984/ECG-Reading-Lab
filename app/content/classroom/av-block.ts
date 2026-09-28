import type { Lesson } from './types';
import { references as r } from './references';
export const lesson: Lesson = {
  slug:'av-block',visual:'av',lead:'PとQRSを別々に数えて、1本ずつつなぎます。「遅い」「ときどき途切れる」「独立している」の違いを見ましょう。',
  points:[{title:'PRが長い・変わる',body:'1度は全Pが伝わり、成人でPRが200 msを超える所見です。Wenckebach型はPRが延びて伝導が途切れ、その後短いPRへ戻る周期を観察します。'},{title:'伝わらないPがある',body:'MobitzⅡ型では伝導拍のPRが延びずにQRSが脱落します。2：1では連続伝導拍がなく、Ⅰ型・Ⅱ型を即断できません。高度は3：1以上の伝導比など、連続してPが伝わらない状態です。'},{title:'PとQRSが独立',body:'完全房室ブロックでは房室伝導がなく、心房と心室が独立します。房室解離はこの関係を表す言葉で、VTや干渉性解離などでも起こります。'}],
  pitfalls:['「Pが見えない」ことは完全房室ブロックの定義ではありません。Pの周期とQRSの周期を別々に追います。','非伝導性PACの早いP′を、規則的なPが脱落する房室ブロックと混同しません。脚ブロックとPR延長だけで三枝すべての障害を証明したことにもなりません。'],
  question:{prompt:'2：1房室ブロックの短い記録だけで、MobitzⅠ型・Ⅱ型を必ず分類できる？',answers:['できる','できない'],correct:1,explanation:'連続した伝導拍のPRの変化が評価しにくいためです。追加の記録や臨床評価が必要になります。'},sources:[r.jcs],labs:[{slug:'pacemaker',title:'ペースメーカーラボで房室の関係を見る'}],
};
