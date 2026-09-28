import type { Lesson } from './types';
import { references as r } from './references';
export const lesson: Lesson = {
  slug:'svt',visual:'svt',lead:'同じような速いリズムでも、興奮が回る道は違います。まずAVNRT・AVRT・ATの位置関係をつかみます。',
  points:[{title:'AVNRT：結節周辺の回路',body:'代表的なslow–fast型では、心房と心室が近い時刻に興奮します。P′はQRSに重なったり、その末尾に見えたりします。'},{title:'AVRT：副伝導路を含む回路',body:'順行性AVRTでは通常の房室伝導路を下り、副伝導路を心房へ戻ります。安静時にデルタ波がない副伝導路もあります。'},{title:'AT：心房内の起源',body:'洞性とは違うP′の形や、P′とQRSの関係を観察します。QRSが狭い規則的頻拍というだけでは、これらを確定できません。'}],
  pitfalls:['AVNRTのP′が常にQRSの直前に見える、という覚え方はしません。亜型では位置関係も変わります。','上室性頻拍でも脚ブロックや変行伝導でQRSが広がる場合があります。幅広い頻拍をこの図から診断しません。'],
  question:{prompt:'安静時にデルタ波がなければ、副伝導路を含むAVRTは否定できる？',answers:['否定できる','逆行伝導だけの副伝導路などがあり、否定できない'],correct:1,explanation:'安静時の早期興奮と、頻拍時の回路は別に考えます。'},sources:[r.jcs],labs:[{slug:'svt',title:'上室頻拍ラボで回路を動かす'},{slug:'wpw',title:'WPWラボで副伝導路を見る'}],
};
