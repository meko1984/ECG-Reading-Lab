import type { Lesson } from './types';
import { references as r } from './references';
export const lesson: Lesson = {
  slug:'axis',visual:'axis',lead:'電気軸は、心室の脱分極を平均した向きです。ⅠとaVFで大きな方向を見て、必要に応じてⅡを確かめます。',
  points:[{title:'まず正味のQRS',body:'上向きが優勢なら陽性、下向きが優勢なら陰性。Rの頂点だけでなくQやSも見ます。ほぼ等電位の誘導では正負の判定が不安定です。'},{title:'ⅠとaVFで4方向',body:'Ⅰが陽性なら左側、aVFが陽性なら下側への成分があります。Ⅰ陽性・aVF陰性ではⅡも見て、−30°付近を区別します。'},{title:'Ⅱを使う理由',body:'Ⅱの軸は+60°で、その直角方向は−30°です。Ⅰ陽性・aVF陰性でもⅡが陽性なら、通常は−30°〜0°側になります。'}],
  pitfalls:['Ⅰ・Ⅱの符号を、そのまま直交する4象限の表にしません。Ⅱは下向き90°ではなく60°です。','軸偏位だけで原因を決めません。年齢・体格、電極交換、心室肥大、伝導障害などを合わせます。'],
  question:{prompt:'Ⅰ陽性・aVF陰性。左軸偏位かを考えるため、次に見る誘導は？',answers:['Ⅱ','aVRだけ','V6だけ'],correct:0,explanation:'Ⅱの正負が−30°付近の目安になります。境界では数値や他の誘導も合わせて確認します。'},sources:[r.intraventricular],labs:[{slug:'axis',title:'平均電気軸ラボ'}],
};
