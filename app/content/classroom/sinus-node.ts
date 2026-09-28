import type { Lesson } from './types';
import { references as r } from './references';
export const lesson: Lesson = {
  slug:'sinus-node',visual:'sinus',lead:'休止を見つけたら、P波も途切れたのか、P波は続いているのかを先に確かめます。',
  points:[{title:'Pを時刻順に追う',body:'休止の前後でP波の形とP–P間隔を確認します。洞停止では洞からの興奮が出ず、洞房ブロックでは心房に伝わりませんが、体表から洞結節の活動を直接は見られません。'},{title:'休止中の波を探す',body:'T波に隠れた非伝導性PACや、Pが続く房室ブロックなども考えます。補充収縮が現れていないかも確認します。'},{title:'症状・背景とつなぐ',body:'徐脈、休止、頻脈後の休止などを観察します。薬剤・自律神経・睡眠などの影響もあり、短い記録や心拍数だけで洞機能不全の臨床診断を決めません。'}],
  pitfalls:['休止が基本P–P間隔の整数倍なら洞房ブロックを考える手掛かりになりますが、不整や他の機序があると単純には使えません。','徐脈だけでペースメーカーの適応を決めません。症状との時間的な対応などが必要です。'],
  question:{prompt:'QRSが途切れていても、同じ間隔のP波が続いていたら？',answers:['洞停止と即断する','房室伝導の問題も考える','P波は無視する'],correct:1,explanation:'心房活動が続いているかどうかが、休止の場所を考える出発点です。'},sources:[r.jcs],labs:[{slug:'pac',title:'PACラボで非伝導性PACを見る'},{slug:'pacemaker',title:'ペースメーカーラボ'}],
};
