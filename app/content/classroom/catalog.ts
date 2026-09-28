export type ClassroomEntry = {
  slug: string;
  title: string;
  summary: string;
  group: number;
  advanced?: boolean;
  slides: number[];
};

export const classroomGroups = [
  { title: '読みはじめる', description: '紙の目盛りから、電気と誘導へ。' },
  { title: '波形をひとつずつ', description: '測る場所を決めて、形を見比べる。' },
  { title: 'リズムをつかむ', description: '早さ・間隔・起源をつなげる。' },
  { title: '伝わり方と病態', description: '伝導の途切れと、波形の変化を読む。' },
  { title: 'デバイスと総合練習', description: '刺激の役割を知り、一枚を順番に読む。' },
  { title: 'もう一歩先へ', description: '発展：年齢や背景によって変わる所見を学ぶ。' },
] as const;

export const classrooms: ClassroomEntry[] = [
  { slug: 'reading-paper', title: '記録紙と12誘導の読みはじめ', summary: '1マスの意味を知り、波形を測る準備をする。', group: 0, slides: [4, 8, 33, 110] },
  { slug: 'electrical-activity', title: '心臓の電気とP・QRS・T', summary: '心房・心室の電気活動を波形とつなぐ。', group: 0, slides: [9, 10, 15, 27] },
  { slug: 'leads', title: '12誘導と電極位置', summary: '10個の電極から、12方向を眺める。', group: 0, slides: [5, 6, 7] },
  { slug: 'rate-rhythm', title: '心拍数・洞調律・規則性', summary: 'RRだけでなく、P波との関係も見る。', group: 0, slides: [11, 16, 33, 36, 39] },
  { slug: 'p-pr', title: 'P波とPR間隔', summary: '心房の波と心室へ伝わる時間を分ける。', group: 1, slides: [10, 11, 12, 13, 14] },
  { slug: 'qrs', title: 'QRSの幅・電位・移行帯', summary: '横幅、縦の大きさ、胸部誘導の並びを観察する。', group: 1, slides: [15, 17, 19, 20, 21] },
  { slug: 'axis', title: '電気軸', summary: '誘導の正負から、平均の電気の向きを考える。', group: 1, slides: [18] },
  { slug: 'st-t', title: 'STとT波の観察', summary: '基線・J点・ST・Tを順に見分ける。', group: 1, slides: [24, 25, 26, 27] },
  { slug: 'qt-u', title: 'QT・QTcとU波', summary: 'T波の終わりと、心拍数による変化を知る。', group: 1, slides: [28, 29, 30] },
  { slug: 'pac', title: '心房期外収縮と非伝導性PAC', summary: '予定より早いP波を探す。', group: 2, slides: [64, 67, 68, 71] },
  { slug: 'pvc', title: '心室期外収縮と変行伝導', summary: '幅の広い一拍を、前後の波と見比べる。', group: 2, slides: [64, 71, 73] },
  { slug: 'atrial-fibrillation', title: '心房細動', summary: '不規則なRRと心房活動の両方を観察する。', group: 2, slides: [35, 65] },
  { slug: 'atrial-flutter', title: '心房粗動', summary: '心房の回旋と、心室へ伝わる割合を分ける。', group: 2, slides: [35, 66] },
  { slug: 'svt', title: '上室頻拍：AVNRT・AVRT・AT', summary: '頻拍の回路とP′の位置を比べる。', group: 2, slides: [69, 70, 82, 83] },
  { slug: 'wpw', title: '早期興奮とWPW', summary: '副伝導路から早く届く興奮を見る。', group: 2, slides: [14, 22, 76, 77, 78, 79, 80, 81] },
  { slug: 'ventricular-rhythms', title: 'VT・VF・AIVR', summary: '心室からの連続した興奮を比べる。', group: 2, slides: [35, 72, 74, 75] },
  { slug: 'sinus-node', title: '洞停止・洞房ブロック・洞機能不全', summary: 'P波が途切れる前後の時間関係を見る。', group: 3, slides: [48, 49, 101] },
  { slug: 'av-block', title: '房室ブロックと房室解離', summary: 'P波とQRSをそれぞれ数える。', group: 3, slides: [50, 51, 52, 53, 54, 55, 56, 57] },
  { slug: 'bundle-block', title: '脚・分枝ブロック', summary: '左右の心室へ届く順序と波形をつなぐ。', group: 3, slides: [40, 41, 42, 43, 44, 45, 46, 47] },
  { slug: 'ischemia', title: '虚血を疑うST・T・Q', summary: '誘導のまとまりと時間変化を観察する。', group: 3, slides: [88, 89, 90, 91, 92] },
  { slug: 'electrolytes-drugs', title: '電解質・薬剤による変化', summary: '波形の変化と、その原因を区別する。', group: 3, slides: [29, 84, 85, 86, 87, 106] },
  { slug: 'pacing', title: 'ペースメーカーの刺激・捕捉・感知', summary: '刺激線のあとと、刺激するタイミングを見る。', group: 4, slides: [58, 59, 60, 61, 62] },
  { slug: 'icd-crt', title: 'ICD・ATP・CRTの入口', summary: '頻拍を止めることと、同期を整えることを分ける。', group: 4, slides: [58, 63] },
  { slug: 'practice', title: '一枚を順番に読む練習', summary: '記録条件から所見まで、一段ずつ言葉にする。', group: 4, slides: [8, 109, 110] },
  { slug: 'j-wave-brugada', title: 'J波・早期再分極・Brugada', summary: '波形パターンと症候群を分ける。', group: 5, advanced: true, slides: [37, 87, 99] },
  { slug: 'cardiomyopathy', title: '心肥大・HCM・DCM', summary: '心臓の形と電位が、一対一で決まらないことを知る。', group: 5, advanced: true, slides: [12, 93, 94, 95, 100] },
  { slug: 'takotsubo', title: 'たこつぼ症候群', summary: '時間とともに変わるST・T・QTを考える。', group: 5, advanced: true, slides: [93, 96] },
  { slug: 'arvc', title: 'ARVC・ACMとε波', summary: '伝導の遅れを、複数の検査所見と合わせる。', group: 5, advanced: true, slides: [23, 97] },
  { slug: 'amyloidosis', title: '心アミロイドーシス', summary: '壁の厚さと電位の組み合わせを考える。', group: 5, advanced: true, slides: [105] },
  { slug: 'right-heart', title: '右心負荷・肺疾患でみる所見', summary: '右心の負荷を示す手掛かりと限界を知る。', group: 5, advanced: true, slides: [38, 100, 102] },
  { slug: 'pericardium', title: '心膜炎・心嚢液・タンポナーデ', summary: '心膜・心嚢液・循環への影響を分ける。', group: 5, advanced: true, slides: [88, 103, 104] },
  { slug: 'position', title: '右胸心・体格・電極誤装着', summary: '心臓の位置と、電極の位置を見直す。', group: 5, advanced: true, slides: [107, 108] },
  { slug: 'pediatric', title: '小児心電図', summary: '年齢によって変わる正常を学ぶ。', group: 5, advanced: true, slides: [32] },
];

export const availableClassrooms = new Set(classrooms.map(room => room.slug));

export function classroomBySlug(slug: string) {
  const entry = classrooms.find((room) => room.slug === slug);
  if (!entry) throw new Error(`Unknown classroom: ${slug}`);
  return entry;
}
