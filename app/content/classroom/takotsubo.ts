import type { Lesson } from './types';
import { references as r } from './references';
export const lesson: Lesson = {
  slug:'takotsubo',visual:'takotsubo',lead:'一枚の形より、経時変化と心室の動き。急性冠症候群に似た心電図を示すことがあります。',
  points:[{title:'ST・T・QTを続けて見る',body:'ST上昇が見られる場合があり、その後に陰性TやQT延長が目立つことがあります。最初の記録時点や経過によって形は異なります。'},{title:'壁運動は画像で確認',body:'一過性の局所的な心室機能低下を評価します。心尖部の風船状変化が有名ですが、それ以外の壁運動パターンもあります。'},{title:'誘因と診断は別',body:'精神的・身体的な負荷が先行することがありますが、明らかな誘因がなくても起こります。症状、心筋傷害マーカー、冠動脈や心筋の画像を合わせます。'}],
  pitfalls:['ST・Tの形だけで心筋梗塞との鑑別は完了しません。冠動脈疾患が併存することもあります。','回復することが多い病態でも、急性期の心不全や不整脈などを軽く扱いません。図の順序や回復時期を全例に当てはめないようにします。'],
  question:{prompt:'たこつぼ症候群を考える際、適切なのは？',answers:['精神的ストレスがなければ否定できる','STの形だけで梗塞と区別できる','経時変化と画像・臨床背景を合わせる'],correct:2,explanation:'心電図は手掛かりです。壁運動や鑑別も含めて評価する必要があります。'},sources:[r.takotsubo,r.takotsuboTime],labs:[{slug:'mi',title:'心筋梗塞ラボでSTの分布を比較'}],
};
