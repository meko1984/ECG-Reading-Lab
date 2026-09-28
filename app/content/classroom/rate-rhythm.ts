import type { Lesson } from './types';
import { references as r } from './references';
export const lesson: Lesson = {
  slug:'rate-rhythm',visual:'rate',lead:'まずQRSの間隔を数え、次にP波との関係を見ます。速さと、どこから始まる調律かは別の観察です。',
  points:[{title:'規則的ならRRから',body:'心拍数は60÷RR（秒）。25 mm/sなら300÷RR間の大マス数でも求められます。大マス4つなら約75/分です。'},{title:'不規則なら長めに数える',body:'ひとつのRRで全体を代表させません。10秒間のQRS数×6は平均心室拍数の概算です。短い記録では境界の一拍による誤差があります。'},{title:'洞調律はPも見る',body:'同じ誘導内でP波の形がそろい、通常Ⅰ・Ⅱで陽性、aVRで陰性となることや、PとQRSの対応を確認します。呼吸で間隔が変わる洞性不整脈もあります。'}],
  pitfalls:['RRが不規則という理由だけで心房細動と決めません。期外収縮、洞性不整脈、伝導の変化でも不規則になります。','成人安静時の60〜100/分は一般的な目安です。運動・睡眠・年齢・症状を切り離して病気の有無を判断しません。'],
  question:{prompt:'25 mm/sでRRが大マス5つ、規則的。心拍数の概算は？',answers:['30/分','60/分','100/分'],correct:1,explanation:'RRは1秒。60÷1、または300÷5で60/分です。'},sources:[r.conduction,r.jcs],labs:[{slug:'svt',title:'上室頻拍・回路ラボ'}],
};
