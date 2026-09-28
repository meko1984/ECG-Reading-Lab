import type { Lesson } from './types';
import { references as r } from './references';
export const lesson: Lesson = {
  recordId:'02145',
  slug:'wpw',visual:'wpw',lead:'房室結節を通る興奮と、副伝導路を通る興奮。早く届いた部分が、QRSの始まりを変えます。',
  points:[{title:'短いPRとデルタ波',body:'顕性の早期興奮では、短いPR、QRS初期のなだらかな立ち上がり、QRSの拡大などを合わせて観察します。短いPRだけでは決まりません。'},{title:'初期部分とQRS全体',body:'デルタ波の極性と、QRS全体の主な向きは同じとは限りません。副伝導路の位置を考える際には、複数誘導の初期成分を確認します。'},{title:'波形と頻拍を分ける',body:'早期興奮パターンの有無と、頻拍の既往・機序は分けて評価します。逆行伝導だけの副伝導路では、洞調律時のデルタ波が見られません。'}],
  pitfalls:['A型・B型などの古典的な型だけで副伝導路の場所を確定しません。V1のQRSの形とデルタ波の向きを混同しないことが大切です。','副伝導路を伴うAFは、通常の狭いQRS頻拍と同じ扱いにはできません。この教室は薬剤や処置を選ぶ教材ではありません。'],
  question:{prompt:'デルタ波として観察するのは？',answers:['QRSの終末だけ','QRSの始まりのなだらかな成分','T波の後ろの波'],correct:1,explanation:'心室の一部が副伝導路から早く興奮することによる初期成分です。'},sources:[r.jcs],labs:[{slug:'wpw',title:'WPWラボで融合を比べる'},{slug:'svt',title:'上室頻拍ラボでAVRTを見る'}],
};
