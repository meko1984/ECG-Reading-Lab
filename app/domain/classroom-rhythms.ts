/** Timing illustrations, not measured clinical ECGs. Seconds refer to the diagram only. */
export type RhythmEvent = { time: number; wide?: boolean; ectopic?: boolean };
export type RhythmExample = {
  label: string;
  description: string;
  atria: RhythmEvent[];
  ventricles: RhythmEvent[];
  connections: [number, number][];
  fibrillation?: boolean;
  flutter?: boolean;
};
const events = (times: number[]): RhythmEvent[] => times.map(time => ({ time }));
const conducted = (label: string, description: string, times: number[], delays: (number | null)[]): RhythmExample => {
  const ventricles: RhythmEvent[] = [];
  const connections: [number, number][] = [];
  times.forEach((time, i) => { if (delays[i] !== null) { connections.push([i, ventricles.length]); ventricles.push({ time: time + delays[i]! }); } });
  return { label, description, atria: events(times), ventricles, connections };
};
const regular = [.3, 1.1, 1.9, 2.7, 3.5, 4.3, 5.1];
export const sinusExample = conducted('洞調律の比較図', 'Pが等間隔に並び、それぞれのあとにQRSが続く設定です。', regular, regular.map(() => .16));
export const rhythmExamples: Record<string, RhythmExample[]> = {
  pac: [
    { ...conducted('伝導するPAC', '3つ目のP′が予定より早く現れ、そのあとにQRSが続きます。', [.3,1.1,1.65,2.45,3.25,4.05,4.85], Array(7).fill(.16)), atria: events([.3,1.1,1.65,2.45,3.25,4.05,4.85]).map((e,i)=>({...e,ectopic:i===2})) },
    { ...conducted('非伝導性PAC', '同じ早いP′のあとにQRSがありません。実記録ではP′がT波に重なることもあります。', [.3,1.1,1.65,2.45,3.25,4.05,4.85], [.16,.16,null,.16,.16,.16,.16]), atria: events([.3,1.1,1.65,2.45,3.25,4.05,4.85]).map((e,i)=>({...e,ectopic:i===2})) },
  ],
  pvc: [
    {label:'心室から早い一拍',description:'★の幅広いQRSは、P波からの接続がない設定です。前後のP波は独立して続きます。',atria:events(regular),ventricles:events([.46,1.26,1.8,2.86,3.66,4.46,5.26]).map((e,i)=>({...e,wide:i===2,ectopic:i===2})),connections:[[0,0],[1,1],[3,3],[4,4],[5,5],[6,6]]},
    {...conducted('変行伝導したPAC', '早いP′が伝わり、心室内の伝導の違いでQRSが広がった設定です。Pの有無だけでは実際の鑑別は完結しません。', [.3,1.1,1.65,2.45,3.25,4.05,4.85],Array(7).fill(.16)),atria:events([.3,1.1,1.65,2.45,3.25,4.05,4.85]).map((e,i)=>({...e,ectopic:i===2})),ventricles:events([.46,1.26,1.81,2.61,3.41,4.21,5.01]).map((e,i)=>({...e,wide:i===2,ectopic:i===2}))},
  ],
  af: [sinusExample,{label:'AFの時間関係',description:'同じ形で繰り返すP波を置かず、QRSの間隔も不規則にした原理図です。基線の揺れは実記録の再現ではありません。',atria:[],ventricles:events([.38,.98,1.83,2.36,3.28,3.96,4.43,5.3]),connections:[],fibrillation:true}],
  flutter: [2,3,4].map(ratio=>{
    const times=Array.from({length:27},(_,i)=>.15+i*.2);
    return {...conducted(`${ratio}：1伝導`, `心房300/分の計算例。${ratio}回に1回が心室へ伝わると、心室は${300/ratio}/分です。回路の種類を示す分類ではありません。`,times,times.map((_,i)=>i%ratio===0?.12:null)),flutter:true};
  }),
  sinus: [sinusExample,conducted('P波が途切れる', '2拍分のPとQRSを省いた模式図。休止の長さだけで洞停止・洞房ブロックを確定しません。',regular.filter((_,i)=>i!==3&&i!==4),Array(5).fill(.16)),conducted('QRSだけが途切れる', 'Pは続いています。洞の問題だけでなく、房室伝導を調べる観察点です。',regular,[.16,.16,.16,null,null,.16,.16])],
  av: [
    conducted('1度', 'すべて伝導し、PRを0.28秒に延ばした図です。',regular,Array(7).fill(.28)),
    conducted('Wenckebach型', 'PRが0.16→0.24→0.32秒と延び、次のPは伝導せず、PRが短く戻る設定です。',regular,[.16,.24,.32,null,.16,.24,.32]),
    conducted('MobitzⅡ型', '伝導する拍のPRは一定で、突然QRSが脱落する設定です。',regular,[.16,.16,null,.16,.16,null,.16]),
    conducted('2：1', 'P2回につきQRS1回。連続した伝導拍のPR変化が見えず、この図だけではⅠ型・Ⅱ型に分けません。',regular,[.16,null,.16,null,.16,null,.16]),
    conducted('高度：3：1の例', '連続する2つのPが伝わらず、P3回につきQRS1回になる設定です。',regular,[.16,null,null,.16,null,null,.16]),
    {label:'完全房室ブロックの概念',description:'心房と心室が別々の周期で動き、伝導の接続がありません。完全房室ブロックは房室解離を起こす原因のひとつです。',atria:events(regular),ventricles:events([.65,2.15,3.65,5.15]),connections:[]},
  ],
};
