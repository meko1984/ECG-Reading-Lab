/** Illustrative surface ECGs, not an electrophysiology or diagnostic solver. */
export const RHYTHM_LEADS = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'] as const;
export type RhythmLead = typeof RHYTHM_LEADS[number];
export type TachyId = 'avnrt' | 'avrt' | 'at-high' | 'at-low';
export type FlutterId = 'common' | 'reverse' | 'atypical';
export type RhythmId = TachyId | FlutterId;
export const TACHY_CASES: { id: TachyId; label: string; name: string; route: string; clue: string; limit: string }[] = [
  { id: 'avnrt', label: 'AV結節周辺', name: 'AVNRT・通常型', route: '遅伝導路を下る → 速伝導路を戻る', clue: 'P′がQRSに埋もれる／終末に重なる。V1の偽r′、下壁誘導の偽Sが手掛かり。', limit: '図はslow–fast型。非通常型AVNRTでは長いRPもあり、短いRPだけでは確定しない。' },
  { id: 'avrt', label: '副伝導路', name: 'AVRT・正方向性', route: 'AV結節 → 心室 → 副伝導路 → 心房', clue: 'QRSの後に逆行性P′。通常型AVNRTより離れて見える代表例。', limit: '副伝導路の部位・伝導時間でP′は変わる。潜在性副伝導路では洞調律時のデルタ波がない。' },
  { id: 'at-high', label: '高位右房の焦点', name: 'AT・高位右房の例', route: '心房の焦点 → 周囲へ拡がる → AV結節 → 心室', clue: '独立したP′と等電位線。P′が先行し、ここでは下壁誘導で陽性。', limit: 'ATは自動能・撃発活動・微小リエントリーなど。すべてが大きな回路を回るわけではない。' },
  { id: 'at-low', label: '低位右房の焦点', name: 'AT・低位右房の例', route: '低い心房焦点 → 上へ拡がる → AV結節 → 心室', clue: '焦点を移すとP′の向きが変わる。この代表例では下壁誘導で陰性。', limit: 'P′の極性だけで起源を断定しない。非通常型AVNRTやAVRTとも重なり、確定に電気生理検査が必要な場合がある。' },
];
export const FLUTTER_CASES: { id: FlutterId; label: string; name: string; route: string; clue: string; limit: string }[] = [
  { id: 'common', label: '右房・反時計回り', name: 'Common・通常型', route: '三尖弁輪を反時計回り → CTIを通る', clue: 'Ⅱ・Ⅲ・aVFで陰性の鋸歯状F波、V1で陽性が典型。', limit: '回転方向は心尖側から三尖弁輪を見た表現。術後・焼灼後などでは典型波形にならないことがある。' },
  { id: 'reverse', label: '右房・時計回り', name: 'Reverse common・逆通常型', route: '同じ三尖弁輪を時計回り → CTIを通る', clue: '下壁誘導で幅広い陽性F波、V1で陰性が代表的。', limit: 'Commonと同じCTI依存性。単なる波形の完全な上下反転ではなく、形にも幅がある。' },
  { id: 'atypical', label: '左房・僧帽弁輪の例', name: 'Atypical・非通常型の一例', route: '左房の僧帽弁輪周囲を回る例（CTI非依存）', clue: 'F波は回路により多様。右房瘢痕周囲・左房天蓋・僧帽弁輪周囲など。', limit: 'この図と波形は一例で、非通常型全体の形ではない。表面心電図だけで回路・CTI依存性は確定できない。' },
];

const gaussian = (t: number, center: number, width: number) => Math.exp(-0.5 * ((t - center) / width) ** 2);
const qrsScale: Record<RhythmLead, number> = { I: .7, II: 1, III: .3, aVR: -.85, aVL: .2, aVF: .65, V1: -.65, V2: -.45, V3: .55, V4: 1.1, V5: 1, V6: .85 };
export const isFlutter = (id: RhythmId): id is FlutterId => ['common', 'reverse', 'atypical'].includes(id);
export function atrialAmplitude(id: RhythmId, lead: RhythmLead): number {
  const one = id === 'common' ? .03 : id === 'reverse' ? -.03 : id === 'atypical' ? -.19 : id === 'at-high' ? .10 : -.07;
  const two = id === 'common' ? -.27 : id === 'reverse' ? .27 : id === 'atypical' || id === 'at-high' ? .18 : -.18;
  const limb = { I: one, II: two, III: two - one, aVR: -(one + two) / 2, aVL: one - two / 2, aVF: two - one / 2 };
  if (lead in limb) return limb[lead as keyof typeof limb];
  if (isFlutter(id)) {
    const common = lead === 'V1' ? .25 : -.08;
    return id === 'common' ? common : id === 'reverse' ? -common : ({ I: -.19, II: .18, III: .12, aVR: .04, aVL: -.16, aVF: .15, V1: .22, V2: .19, V3: .12, V4: .09, V5: .08, V6: .06 }[lead]);
  }
  if (id === 'at-high') return lead === 'V1' ? -.07 : .10;
  return lead === 'V1' ? .16 : -.07;
}
export function rhythmTiming(id: RhythmId, rate: number, conduction: number) {
  const aa = 60 / rate;
  const rr = aa * (isFlutter(id) ? conduction : 1);
  const rp = id === 'avnrt' ? .025 : id === 'avrt' ? .11 : aa - .14;
  return { aa, rr, rp, ventricularRate: rate / (isFlutter(id) ? conduction : 1) };
}
export function rhythmSample(t: number, id: RhythmId, lead: RhythmLead, rate: number, conduction = 2, atrialOnly = false): number {
  const { aa, rr, rp } = rhythmTiming(id, rate, conduction);
  let atrial = 0;
  if (isFlutter(id)) {
    const phase = ((t - .20) / aa % 1 + 1) % 1;
    const shape = id === 'common' ? (phase < .8 ? phase / .8 : (1 - phase) / .2) - .5
      : id === 'reverse' ? (1 - Math.cos(2 * Math.PI * phase)) / 2 - .5
      : .5 * Math.sin(2 * Math.PI * phase) + .15 * Math.sin(4 * Math.PI * phase);
    atrial = atrialAmplitude(id, lead) * shape * 2;
  } else {
    for (let n = -1; n < 20; n++) atrial += atrialAmplitude(id, lead) * gaussian(t, .20 + n * aa + rp, .016);
  }
  if (atrialOnly) return atrial;
  let ventricular = 0;
  for (let n = -1; n < 20; n++) {
    const r = .20 + n * rr;
    ventricular += qrsScale[lead] * (-.13 * gaussian(t, r - .018, .006) + gaussian(t, r, .009) - .25 * gaussian(t, r + .023, .008) + .23 * gaussian(t, r + Math.min(.20, rr * .53), .035));
  }
  return atrial + ventricular;
}
