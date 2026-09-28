import type { Lesson } from './types';
import { references as r } from './references';
export const lesson: Lesson = {
  slug:'qt-u',visual:'qt',lead:'QTはQRSの始まりからT波の終わりまで。QTcは心拍数で補正した値で、紙のマス数そのものではありません。',
  points:[{title:'Tの終わりを決める',body:'終末が明瞭な誘導を選び、Tが基線へ戻る位置を確認します。接線法ではTの下降脚に引いた接線と基線の交点を使います。U波は通常QTに含めません。'},{title:'補正式も記録する',body:'BazettはQT÷√RR、FridericiaはQT÷∛RR（QT・RRは秒）。心拍数によって式の偏りが変わるので、違う式の値を無条件に比較しません。'},{title:'背景を合わせる',body:'QT延長の所見だけで先天性QT延長症候群とは決まりません。薬剤・電解質・QRS幅・症状・家族歴なども評価します。'}],
  pitfalls:['TとUが重なると終末が曖昧になります。QUをQTとして測らず、他の誘導や別の拍を確認します。','QRSが広い場合はQTも延び得ます。表示したQTcひとつで再分極の異常や危険度を判定しません。'],
  question:{prompt:'QTcを紙の小マス数として直接数えてよい？',answers:['よい。QTと同じだから','よくない。QTを測りRRで補正する','U波まで足せばよい'],correct:1,explanation:'紙から測るのはQTとRRです。QTcは補正式で計算した指標なので、式と単位も確認します。'},sources:[r.repolarization,r.inherited],labs:[{slug:'membrane-potential',title:'膜電位・電解質ラボ'}],
};
