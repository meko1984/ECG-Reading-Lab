import type { Lesson } from './types';
import { references as r } from './references';
export const lesson: Lesson = {
  slug:'practice',visual:'practice',lead:'ここまでの観察を、一枚の記録につなげます。最初から病名を選ばず、見えたことを順番に言葉にしてみましょう。',
  points:[{title:'まず事実を記述',body:'「Ⅱ誘導のRRが一定でない」「ⅠとaVLのQRS初期がなだらか」のように、場所と観察を組にします。'},{title:'説明できない所を残す',body:'ノイズで見えない始点、比較できない過去の記録、分からない症状や薬剤歴を区別します。見えない情報を補って診断しません。'},{title:'次の観察を選ぶ',body:'Pを探すなら別の誘導へ、間隔なら長い記録へ、STなら隣接誘導へ。疑問に応じて見る場所を選び直します。'}],
  pitfalls:['「幅広いQRS」だけでは起源は確定しません。P波との関係、早さ、前後の拍も確認します。','この練習の記録にはノイズや併存所見があります。付けられたラベルと、自分が波形から観察できた事実も分けましょう。'],
  question:{prompt:'最初の所見として、より具体的なのは？',answers:['たぶん危険な心臓病','Ⅱ誘導でQRS間隔が一定ではない','ラベルがあるので他は見なくてよい'],correct:1,explanation:'観察した誘導と変化を具体化すると、次に何を確認するか考えやすくなります。'},sources:[r.recording,r.jcs,{title:'PTB-XL v1.0.3：データと注釈の説明',url:'https://physionet.org/content/ptb-xl/1.0.3/'}],labs:[{slug:'electrodes',title:'電極装着ラボ'},{slug:'axis',title:'電気軸ラボ'}],
};
