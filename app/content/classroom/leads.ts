import type { Lesson } from './types';
import { references as r } from './references';
export const lesson: Lesson = {
  slug: 'leads', visual: 'leads', lead: '電極は測るための接点。誘導は電位差を見る組み合わせです。10個の電極から12誘導を記録します。',
  points: [
    {title:'四肢の6誘導',body:'Ⅰ・Ⅱ・Ⅲ・aVR・aVL・aVFは、主に前額面の異なる方向を見ます。右脚電極は記録の安定化に使われ、独立した「右脚誘導」にはなりません。'},
    {title:'胸部の6誘導',body:'V1〜V6は主に水平面を見ます。V1・V2は第4肋間、V4は第5肋間左鎖骨中線、V3はV2とV4の間。V5・V6はV4と同じ高さです。'},
    {title:'まず装着を確認',body:'電極位置や配線が変わると、心臓が同じでも波形は変わります。標準12誘導と、体幹に置くモニター誘導は条件が異なります。'},
  ],
  pitfalls:['CM5やMCL1を、標準V5・V1と完全に同じ誘導として扱わないでください。','電極の色は規格で異なります。色だけで覚えず、RA・LAなどの表示と位置を確認します。'],
  question:{prompt:'V5・V6の高さは、何を基準にしますか？',answers:['肋間を一つずつ下へずらす','V4と同じ水平面','波形が最大になる高さ'],correct:1,explanation:'V5・V6はV4と同じ高さです。肋骨に沿って斜め下へ置かないようにします。'},
  sources:[r.recording],labs:[{slug:'electrodes',title:'電極装着ラボ'},{slug:'lead-views',title:'心臓3Dモデル'}],recordId:'00293',
};
