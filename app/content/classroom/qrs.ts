import type { Lesson } from './types';
import { references as r } from './references';
export const lesson: Lesson = {
  slug:'qrs',visual:'qrs',lead:'QRSは「幅」と「高さ」を別に見ます。さらにV1からV6までのRとSの変化を追いましょう。',
  points:[{title:'幅：心室内に広がる時間',body:'QRSの最初の振れから最後の振れまでを測ります。成人では120 ms以上を幅広いQRSの目安にし、脚ブロック・心室起源・早期興奮・ペーシングなどを考えます。'},{title:'電位：感度と誘導群を確認',body:'低電位の目安として四肢の全誘導で振幅0.5 mV以下、または胸部の全誘導で1.0 mV以下という定義があります。振幅は各誘導の最大陽性から最大陰性までで、全誘導を足しません。境界値の扱いは出典により異なります。'},{title:'移行帯：RとSの関係',body:'胸部誘導でRとSが同じ程度になるあたりを探します。位置には個人差があり、電極位置や心臓の位置も影響します。'}],
  pitfalls:['幅が広いだけで脚ブロックと決めません。形、起源、Pとの関係も必要です。','QSやQ波だけで過去の梗塞を確定しません。誘導・幅・深さと他の原因を確認します。','移行帯の位置を、そのまま解剖学的な心臓の回転の証明とは扱いません。'],
  question:{prompt:'QRSの振幅を比べる前に、必ずそろえたいものは？',answers:['波形の色','感度と誘導','表示する病名'],correct:1,explanation:'感度が5 mm/mVなら、10 mm/mVの半分の高さになります。誘導もそろえて比較します。'},sources:[r.intraventricular,r.amyloid,r.mi,r.recording],labs:[{slug:'electrodes',title:'電極装着ラボ'}],recordId:'00293',
};
