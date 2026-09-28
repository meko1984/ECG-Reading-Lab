import type { Lesson } from './types';
import { references as r } from './references';
export const lesson: Lesson = {
  slug:'icd-crt',visual:'devices',lead:'速い危険なリズムを止める役割と、心室の同期を整える役割。同じ装置に入ることがあっても、目的は別です。',
  points:[{title:'ICD：検出して治療',body:'植込み型除細動器です。設定された条件で心室性不整脈を検出し、装置に応じたATPやショックを行います。心電図上に「ICD固有の通常波形」があるわけではありません。'},{title:'ATP：短い間隔で刺激',body:'抗頻拍ペーシングです。対応可能な頻拍へ連続刺激を送り、停止を試みます。ATPは電気ショックの別名ではなく、薬剤のアデノシン三リン酸とも区別します。'},{title:'CRT：同期を整える',body:'心臓再同期療法です。左右の心室へ刺激を届け、興奮・収縮のずれを改善することを目指します。CRT-Pは再同期ペーシング、CRT-Dは除細動機能も備えます。'}],
  pitfalls:['すべてのICDが同じ徐脈ペーシング・ATP機能を備えるわけではありません。経静脈型と皮下型など、装置の違いを確認します。','QRSが広いという理由だけでCRTの適応を決めません。心機能・症状・QRS形態・治療経過などを合わせた評価が必要です。'],
  question:{prompt:'CRT-DのDが表す追加機能は？',answers:['除細動機能','心房だけの刺激','薬剤投与'],correct:0,explanation:'再同期療法に除細動機能を備えた装置です。再同期と頻拍停止の役割を分けて理解します。'},sources:[r.pacing,r.crt,r.atp,r.jcs],labs:[{slug:'pacemaker',title:'ペースメーカーラボで刺激の基本を確認'}],
};
