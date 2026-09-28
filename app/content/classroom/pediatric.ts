import type { Lesson } from './types';
import { references as r } from './references';
export const lesson: Lesson = {
  slug:'pediatric',visual:'pediatric',lead:'小児の正常は年齢とともに変わります。心拍数・間隔・軸・T波に、成人のものさしをそのまま当てはめません。',
  points:[{title:'まず日齢・年齢',body:'新生児期は右室優位で、成人より右向きの軸やV1の大きなRが見られます。成長とともに変化するため、年齢別の基準で比較します。'},{title:'T波の向きも変わる',body:'出生直後と、その後の乳幼児期では右前胸部T波の見方が違います。小児のV1〜V3の陰性Tが生理的な場合もあります。'},{title:'数値と臨床背景',body:'心拍数やPR・QRSも年齢で正常範囲が異なります。症状・家族歴・診察、正しい電極位置を合わせて評価します。'}],
  pitfalls:['小児の右軸偏位や陰性Tを、成人の基準だけで異常と決めません。逆に「小児だから正常」と一括りにもできません。','この図の年代分けは変化の方向を学ぶためのものです。個人の正常範囲や、学校検診の判定表ではありません。'],
  question:{prompt:'小児の心電図を読む前に、最初に確かめたい情報は？',answers:['成人と同じ数値の基準','日齢・年齢と症状などの背景','V1のT波が陰性なら全例異常という前提'],correct:1,explanation:'正常の範囲も成長とともに変わります。特に新生児では日齢も大切です。'},sources:[r.pediatric,r.intraventricular],labs:[{slug:'electrodes',title:'電極位置の基本を復習'}],
};
