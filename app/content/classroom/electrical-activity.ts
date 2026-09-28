import type { Lesson } from './types';
import { references as r } from './references';
export const lesson: Lesson = {
  slug: 'electrical-activity', visual: 'cycle', lead: '波形は、心臓の電気活動を体表から見たものです。P・QRS・Tを選んで、対応する場所を確かめましょう。',
  points: [
    { title: 'P：心房の脱分極', body: '洞結節から始まった興奮が心房へ広がります。P波は洞結節そのものの電位ではありません。' },
    { title: 'QRS：心室の脱分極', body: '房室結節を経て、His束・脚・Purkinje線維から心室へ興奮が広がります。心房の再分極は通常QRSに重なって目立ちません。' },
    { title: 'T：心室の再分極', body: '興奮した心室が電気的に回復する過程です。心室の機械的な収縮や弛緩そのものを描いた線ではありません。' },
  ],
  pitfalls: ['波形の上下は「収縮する／しない」ではなく、誘導から見た電位差の向きです。', '再分極は脱分極をそのまま逆再生した線ではありません。T波とQRSの向きの関係は誘導や状態で変わります。'],
  question: { prompt: '通常のP波が主に表すのは？', answers: ['洞結節だけの電位', '心房の脱分極', '心室の収縮力'], correct: 1, explanation: '洞結節は起点ですが、体表でP波として見ているのは心房に広がる脱分極です。' },
  sources: [r.conduction, r.repolarization], labs: [{slug:'lead-views',title:'心臓3Dモデル'},{slug:'membrane-potential',title:'膜電位・電解質ラボ'}],
};
