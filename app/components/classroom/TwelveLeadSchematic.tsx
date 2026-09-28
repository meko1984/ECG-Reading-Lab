import type { VisualKind } from '@/app/content/classroom/types';
import { ScrollableWaveform } from './ScrollableWaveform';
import styles from './Classroom.module.css';

const leads = ['I', 'aVR', 'V1', 'V4', 'II', 'aVL', 'V2', 'V5', 'III', 'aVF', 'V3', 'V6'] as const;
type Lead = typeof leads[number];

const baseAmplitude: Record<Lead, number> = {
  I: .78, II: 1, III: .58, aVR: -.68, aVL: .43, aVF: .76,
  V1: -.62, V2: -.38, V3: .22, V4: .82, V5: 1, V6: .82,
};

const descriptions: Record<VisualKind, { title: string; focus: string }> = {
  cycle: { title: '標準的なP・QRS・Tの並び', focus: '同じ一拍でも、誘導によって波の向きと高さが変わります。' },
  leads: { title: '同じ心拍を12方向から見た模式例', focus: '四肢誘導と胸部誘導を、同じ時刻で横に見比べます。' },
  rate: { title: '洞調律の速さと規則性', focus: 'まずRR間隔、次に各QRSの前に続くP波を確認します。' },
  pr: { title: 'P波からQRSまでのつながり', focus: 'P波の始まりとQRSの始まりを、複数の誘導で確認します。' },
  qrs: { title: 'QRSの幅・電位・胸部誘導の移行', focus: 'V1からV6へ、R波とS波の比が変わる様子を追います。' },
  axis: { title: '正常軸の一例', focus: 'ⅠとaVFのQRSがともに上向きになる組み合わせを示しています。' },
  st: { title: 'J点・ST・Tを分けて見る模式例', focus: '基線、QRSの終わり、ST、T波を順にたどります。' },
  qt: { title: 'QRS開始からT波終末まで', focus: 'T波の終わりを、見やすい誘導を使って確認します。' },
  pac: { title: '早いP′波を伴う一拍の模式例', focus: '早く出る心房波と、その後のQRSの関係を各誘導で比べます。' },
  pvc: { title: '早く幅広いQRSが現れる模式例', focus: '期外収縮の前後を含め、形と休止を12誘導で比較します。' },
  af: { title: '不規則なRRと揃ったP波を認めにくい模式例', focus: 'RRの不規則性と心房活動を別々に観察します。' },
  flutter: { title: '反復する心房活動の模式例', focus: '下壁誘導とV1を中心に、QRS間の活動を追います。' },
  svt: { title: '規則的な狭いQRS頻拍の模式例', focus: '頻拍中のQRS幅と、P′波が見える位置を観察します。' },
  wpw: { title: '短いPRとQRS初期のなだらかな立ち上がり', focus: 'Ⅰ・aVL・胸部誘導などでQRSの始まりを比べます。' },
  ventricular: { title: '幅広いQRSが連続する心室調律の模式例', focus: '速さ、QRSのまとまり、拍ごとの形を観察します。' },
  sinus: { title: 'P波を含む休止の模式例', focus: '休止中にP波も途切れているかを複数誘導で確認します。' },
  av: { title: 'P波とQRSの対応が変化する模式例', focus: 'P波とQRSを別々に数え、前後関係を線ではなく時刻で追います。' },
  bundle: { title: '幅広いQRSと胸部誘導の形の違い', focus: 'V1とV6を中心に、QRSの始まりから終わりまでを比べます。' },
  ischemia: { title: '誘導のまとまりに現れるST変化の模式例', focus: '隣り合う誘導の変化と、反対側の変化を一緒に観察します。' },
  electrolytes: { title: 'T波が高くなる変化の模式例', focus: 'T波だけでなく、P波・PR・QRS・QTも順に観察します。' },
  pacing: { title: '刺激線と心筋の応答の模式例', focus: '刺激線の直後にP波またはQRSが続くかを確認します。' },
  devices: { title: '心室刺激を含むデバイス波形の模式例', focus: '装置の刺激と、それに続く心室応答を分けて見ます。' },
  practice: { title: '12誘導を同じ順序で読む練習記録', focus: '記録条件、心拍数、リズム、波形、分布の順に見ます。' },
  'j-wave': { title: 'QRS終末からSTにかけての変化', focus: 'V1〜V3と側壁誘導で、J点付近の形を見比べます。' },
  structure: { title: '高電位と再分極変化を含む模式例', focus: '電位の高さだけで形態や病態を決めず、画像所見と分けて扱います。' },
  takotsubo: { title: '広い誘導で見られる陰性T波の模式例', focus: 'ST・T・QTが時間とともに変わることを前提に観察します。' },
  epsilon: { title: '右前胸部誘導のQRS終末電位の模式例', focus: 'V1〜V3のQRS終末を、ノイズや不完全右脚ブロックと区別して見ます。' },
  amyloid: { title: '四肢誘導の低電位を示す模式例', focus: '画像上の壁厚と心電図電位を別の情報として組み合わせます。' },
  'right-heart': { title: '右心負荷を考える模式例', focus: '右軸偏位、右前胸部誘導、SⅠQⅢTⅢなどを単独で確定所見にしません。' },
  pericardium: { title: '広い誘導に及ぶST・PR変化の模式例', focus: '局在性、鏡像変化、電位、拍ごとの振幅も合わせて見ます。' },
  position: { title: '右胸心や電極位置を考える模式例', focus: 'Ⅰ誘導と胸部誘導のR波進行を、電極装着と一緒に確認します。' },
  pediatric: { title: '小児でみられる右室優位の模式例', focus: '年齢ごとの基準を使い、V1のR波やT波を成人と同じ基準で決めません。' },
};

function isLead(lead: Lead, names: Lead[]) { return names.includes(lead); }

function morphology(kind: VisualKind, lead: Lead) {
  let amp = baseAmplitude[lead];
  let p = .18 * Math.sign(amp || 1);
  let t = .34 * Math.sign(amp || 1);
  let st = 0;
  let width = 1;
  let rhythm: 'regular' | 'pac' | 'pvc' | 'af' | 'flutter' | 'svt' | 'pause' | 'av' = 'regular';
  let spike = false;
  let delta = false;
  let terminal = false;

  if (kind === 'pac') rhythm = 'pac';
  if (kind === 'pvc') rhythm = 'pvc';
  if (kind === 'af') rhythm = 'af';
  if (kind === 'flutter') rhythm = 'flutter';
  if (kind === 'svt') rhythm = 'svt';
  if (kind === 'sinus') rhythm = 'pause';
  if (kind === 'av') rhythm = 'av';
  if (kind === 'ventricular') { rhythm = 'svt'; width = 2.4; p = 0; t *= -.9; }
  if (kind === 'wpw') { delta = true; width = 1.45; }
  if (kind === 'bundle') { width = 1.8; if (isLead(lead, ['V1', 'V2'])) amp *= -1.15; }
  if (kind === 'ischemia') {
    if (isLead(lead, ['II', 'III', 'aVF'])) st = .42;
    if (isLead(lead, ['I', 'aVL'])) st = -.18;
  }
  if (kind === 'st') st = .12;
  if (kind === 'electrolytes') t *= 2.15;
  if (kind === 'pacing' || kind === 'devices') { spike = true; width = 1.75; p = kind === 'pacing' ? p : 0; }
  if (kind === 'j-wave') terminal = true;
  if (kind === 'structure') { if (isLead(lead, ['I', 'aVL', 'V4', 'V5', 'V6'])) amp *= 1.5; t *= -.75; }
  if (kind === 'takotsubo') { if (isLead(lead, ['I', 'II', 'aVL', 'V2', 'V3', 'V4', 'V5', 'V6'])) t = -.62; }
  if (kind === 'epsilon') terminal = isLead(lead, ['V1', 'V2', 'V3']);
  if (kind === 'amyloid') { amp *= .36; p *= .65; t *= .55; }
  if (kind === 'right-heart') {
    if (lead === 'I') amp *= .35;
    if (lead === 'III' || lead === 'aVF') amp *= 1.35;
    if (isLead(lead, ['V1', 'V2'])) { amp = Math.abs(amp) * 1.35; t = -.35; }
  }
  if (kind === 'pericardium') { st = .34; if (lead === 'aVR') st = -.24; }
  if (kind === 'position') {
    if (lead === 'I') amp = -.78;
    if (lead === 'aVR') amp = .72;
    if (isLead(lead, ['V1', 'V2', 'V3', 'V4', 'V5', 'V6'])) amp = -.45 + (Number(lead.slice(1)) - 1) * .05;
  }
  if (kind === 'pediatric' && isLead(lead, ['V1', 'V2'])) { amp = .85; t = lead === 'V1' ? -.32 : .2; }
  if (kind === 'qt') t *= 1.08;
  return { amp, p, t, st, width, rhythm, spike, delta, terminal };
}

function regularBeat(x: number, y: number, m: ReturnType<typeof morphology>, scale = 1, prematureP = false) {
  const a = m.amp * 34 * scale;
  const p = m.p * 28 * scale;
  const t = m.t * 30 * scale;
  const st = m.st * 24;
  const qrs = 7 * m.width;
  const pStart = x + (m.delta ? 8 : 5);
  const qrsX = x + (m.delta ? 25 : 31);
  const pShape = m.p === 0 ? `M${x} ${y}H${qrsX - 3}` : `M${x} ${y}H${pStart}q5 ${-p} 10 0H${qrsX - 3}`;
  const delta = m.delta ? `q7 ${-a * .22} ${qrs * .68} ${-a * .55}` : `l${qrs * .25} ${a * .18}`;
  const spike = m.spike ? `M${qrsX - 5} ${y}v-39v39` : '';
  const terminal = m.terminal ? `l4 ${-Math.sign(a || 1) * 7}l4 ${Math.sign(a || 1) * 7}` : '';
  const pAccent = prematureP ? `M${pStart - 3} ${y}q5 ${-p * 1.65} 10 0` : '';
  return `${spike}${pShape}${pAccent}${delta}l${qrs * .26} ${-a}l${qrs * .27} ${a * 1.55}l${qrs * .28} ${-a * .73}${terminal}L${qrsX + qrs + 12} ${y - st}H${qrsX + qrs + 23}q10 ${-t} 21 0q10 ${t} 21 0H${x + 86}`;
}

function leadPath(kind: VisualKind, lead: Lead, y: number) {
  const m = morphology(kind, lead);
  if (m.rhythm === 'af') {
    const xs = [2, 74, 157, 232];
    return `M2 ${y}${Array.from({length: 32}, (_, i) => `l4 ${i % 2 ? 2 : -2}`).join('')}${xs.map((x, i) => regularBeat(x, y, {...m, p: 0}, .72 + (i % 2) * .12)).join('')}`;
  }
  if (m.rhythm === 'flutter') {
    const teeth = Array.from({length: 22}, (_, i) => `l6 ${i % 2 ? 7 : -7}`).join('');
    return `M2 ${y}${teeth}${[18, 108, 198].map(x => regularBeat(x, y, {...m, p: 0}, .82)).join('')}`;
  }
  if (m.rhythm === 'svt') return [2, 67, 132, 197].map(x => regularBeat(x, y, {...m, p: m.p * .25}, .82)).join('');
  if (m.rhythm === 'pause') return [2, 184].map(x => regularBeat(x, y, m, .92)).join('');
  if (m.rhythm === 'av') {
    const qs = [12, 132, 222].map(x => regularBeat(x, y, {...m, p: 0}, .88)).join('');
    const ps = [4, 66, 128, 190, 252].map(x => `M${x} ${y}q5 ${-m.p * 28} 10 0`).join('');
    return qs + ps;
  }
  if (m.rhythm === 'pac') return regularBeat(2, y, m, .9) + regularBeat(72, y, m, .9, true) + regularBeat(184, y, m, .9);
  if (m.rhythm === 'pvc') {
    const ectopic = {...m, amp: m.amp === 0 ? -1 : -Math.sign(m.amp) * Math.max(.75, Math.abs(m.amp)), p: 0, width: 2.5, t: -m.t};
    return regularBeat(2, y, m, .85) + regularBeat(83, y, ectopic, .95) + regularBeat(194, y, m, .85);
  }
  return [2, 98, 194].map(x => regularBeat(x, y, m, .88)).join('');
}

export function TwelveLeadSchematic({ kind }: { kind: VisualKind }) {
  const description = descriptions[kind];
  const gridId = `schematic-${kind.replaceAll('-', '')}`;
  return <section className={styles.section} aria-labelledby={`${gridId}-heading`}>
    <h2 id={`${gridId}-heading`}>12誘導での見え方</h2>
    <h3>{description.title}</h3>
    <p>{description.focus}</p>
    <p className={styles.caption}>学習用の模式12誘導 ／ 標準配置：Ⅰ・aVR・V1・V4 ／ Ⅱ・aVL・V2・V5 ／ Ⅲ・aVF・V3・V6</p>
    <ScrollableWaveform className={styles.paperScroll} ariaLabel={`${description.title}を示す模式12誘導。横にスクロールできます`}>
      <svg className={`${styles.overview} ${styles.schematicOverview}`} viewBox="0 0 1320 414" role="img" aria-label={`${description.title}。${description.focus}`}>
        <defs><pattern id={`${gridId}-small`} width="4" height="4" patternUnits="userSpaceOnUse"><path d="M4 0H0V4" fill="none" stroke="#edcfdc" strokeWidth=".35" /></pattern><pattern id={`${gridId}-large`} width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill={`url(#${gridId}-small)`} /><path d="M20 0H0V20" fill="none" stroke="#ce9aae" strokeWidth=".6" /></pattern></defs>
        <rect width="1320" height="414" fill={`url(#${gridId}-large)`} />
        {leads.map((lead, index) => <g key={lead} transform={`translate(${(index % 4) * 330} ${Math.floor(index / 4) * 138})`}>
          <text x="12" y="24" className={styles.waveText}>{lead}</text>
          <path d="M12 84h4v-40h20v40h4" fill="none" stroke="#0a1f57" strokeWidth="1.5" />
          <path d={leadPath(kind, lead, 84)} transform="translate(50 0)" fill="none" stroke="#0a1f57" strokeWidth="1.65" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M330 0V138M0 138H330" fill="none" stroke="#b8a0ab" strokeWidth=".7" />
        </g>)}
      </svg>
    </ScrollableWaveform>
    <p className={styles.note}>この図は「どの誘導を一緒に見るか」を学ぶための代表的な模式例です。実記録ではなく、波形だけで診断・重症度・治療を決める基準には使えません。</p>
  </section>;
}
