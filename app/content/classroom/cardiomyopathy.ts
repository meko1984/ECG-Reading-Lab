import type { Lesson } from './types';
import { references as r } from './references';
export const lesson: Lesson = {
  slug:'cardiomyopathy',visual:'structure',lead:'壁の厚さ、内腔の広さ、電気の波の高さ。似た言葉を、別々の観察として整理します。',
  points:[{title:'高電位と肥大を分ける',body:'心電図の電位は体格・電極位置・伝導などにも左右されます。大きなR波だけで壁の厚さは決まりません。'},{title:'HCMとDCMの違い',body:'肥大型心筋症（HCM）では心筋の肥厚、拡張型心筋症（DCM）では心室の拡大と収縮機能の低下が中心です。壁の厚さと内腔を分けて見ます。'},{title:'心電図から次の検査へ',body:'電位、Q波、ST・T、QRSの幅や不整脈を手掛かりにします。心エコー・MRIや家族歴などと合わせて構造と原因を評価します。'}],
  pitfalls:['巨大な陰性T波は心尖部肥大型心筋症を考える手掛かりのひとつですが、その形だけに特異的ではありません。','左室肥大を示唆する心電図所見は、HCMという病名と同義ではありません。DCMを心室壁の肥厚の説明で置き換えないようにします。'],
  question:{prompt:'大きなR波から直接言い切れるのは？',answers:['必ずHCMである','心室壁の厚さが確定する','その誘導で記録された電位が大きい'],correct:2,explanation:'測定できる電位と、画像で評価する構造を分けましょう。'},sources:[r.cardiomyopathy,r.jcs,r.recording],labs:[{slug:'axis',title:'電気軸ラボ'},{slug:'lead-views',title:'誘導の見え方ラボ'}],
};
