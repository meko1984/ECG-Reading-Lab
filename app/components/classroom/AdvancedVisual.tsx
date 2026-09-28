'use client';

import type { AdvancedKind } from '@/app/content/classroom/types';
import styles from './Classroom.module.css';

function Choices({ names, value, onChange, label }: { names: string[]; value: number; onChange: (value: number) => void; label: string }) {
  return <div className={styles.controls} role="group" aria-label={label}>{names.map((name, index) => <button key={name} type="button" aria-pressed={value === index} onClick={() => onChange(index)}>{name}</button>)}</div>;
}

function RepresentativeTrace({ kind, label }: { kind: 'normal'|'hcm'|'dcm'|'pericarditis'|'low'|'alternans'|'newborn'|'child'|'older'; label: string }) {
  const paths = {
    normal: 'M20 110H70q14 -22 28 0H155l8 8 10 -76 13 96 12 -28H270q35 -49 70 0H500',
    hcm: 'M20 110H70q14 -22 28 0H145l8 20 12 -104 15 132 14 -48H270q35 52 70 0H500',
    dcm: 'M20 110H70q14 -18 28 0H145q14 -58 35 -13t38 23H282q34 42 68 0H500',
    pericarditis: 'M20 110H70q14 -20 28 0H142l12 8 10 -75 13 95 12 -27Q245 72 310 78Q352 81 380 110H500',
    low: 'M20 110H62l5 4 7 -27 8 35 8 -12H145l5 4 7 -25 8 33 8 -12H228l5 4 7 -23 8 31 8 -12H500',
    alternans: 'M20 110H58l6 7 9 -72 12 91 11 -26H156l5 5 7 -42 10 56 9 -19H246l6 7 9 -72 12 91 11 -26H346l5 5 7 -42 10 56 9 -19H500',
    newborn: 'M20 110H70q14 -19 28 0H150l8 8 10 -66 13 86 12 -28H270q34 -41 68 0H500',
    child: 'M20 110H70q14 -19 28 0H150l8 8 10 -58 13 78 12 -28H270q34 42 68 0H500',
    older: 'M20 110H70q14 -19 28 0H150l8 8 10 -70 13 90 12 -28H270q34 -35 68 0H500',
  };
  return <svg className={styles.diagram} viewBox="0 0 520 165" role="img" aria-label={label}><path d="M20 110H500" stroke="#9db4c7" strokeDasharray="5 5"/><path d={paths[kind]} fill="none" stroke="#0a1f57" strokeWidth="3" strokeLinejoin="round"/><text x="260" y="155" textAnchor="middle" fontSize="19">{label}</text></svg>;
}

function JWave({ mode, onChange }: { mode: number; onChange: (value: number) => void }) {
  const names = ['J波のノッチ', 'コブド型', 'サドルバック型'];
  const paths = [
    'M20 180H112l12 12 14 -135 26 85 9 -14 12 28Q220 157 256 150Q282 104 306 143T360 180H490',
    'M20 180H110l12 -32 12 72 18 -105Q175 73 206 103Q253 140 281 188Q312 248 348 195Q361 180 385 180H490',
    'M20 180H110l12 -32 12 72 18 -105Q175 73 206 108Q243 169 276 145Q313 94 348 148Q368 180 395 180H490',
  ];
  const notes = ['QRS末端の下降脚にある小さな切れ込み。下壁・側壁の誘導と、続くSTの向きも見ます。', '右前胸部の、弓状に下がるSTから陰性Tへ続く形。タイプ1の形態を学ぶ模式例です。', '右前胸部の、いったん下がって再び上がるST・Tの形。サドルバック型だけで症候群を確定しません。'];
  return <><Choices names={names} value={mode} onChange={onChange} label="J点付近の形を選ぶ"/><svg className={styles.diagram} viewBox="0 0 520 285" role="img" aria-label={names[mode]+'の模式図。'+notes[mode]}><path d="M20 180H490" stroke="#9db4c7" strokeDasharray="5 5"/><path d={paths[mode]} fill="none" stroke="#0a1f57" strokeWidth="4" strokeLinejoin="round"/>{mode === 0 ? <><circle cx="175" cy="139" r="22" stroke="#ab6f00" strokeWidth="3" fill="none"/><path d="M205 81l-20 35" stroke="#ab6f00" strokeWidth="2"/><text x="217" y="75" fontSize="23">ノッチ</text></> : <><text x="218" y="64" fontSize="23">STの形</text><text x="338" y={mode === 1 ? 264 : 105} fontSize="23">T</text></>}<text x="260" y="30" textAnchor="middle" fontSize="22">{mode === 0 ? 'QRS末端を見る' : 'V1・V2で形と背景を見る'}</text></svg><p>{notes[mode]}</p></>;
}

function Structure({ amyloid = false, mode, onChange }: { amyloid?: boolean; mode: number; onChange: (value: number) => void }) {
  const names = amyloid ? ['壁厚と電位を比べる', '電位が保たれる例も'] : ['比較用の左室', '壁が厚い：HCM', '内腔が広い：DCM'];
  const thick = amyloid || mode === 1;
  const dilated = !amyloid && mode === 2;
  const outer = dilated ? 133 : 108;
  const inner = thick ? 55 : dilated ? 110 : 83;
  return <><Choices names={names} value={mode} onChange={onChange} label={amyloid ? '壁厚と電位の関係' : '心室の構造を比べる'}/><div className={styles.twoColumns}><svg className={styles.diagram} viewBox="0 0 360 340" role="img" aria-label={`左室の断面の概念。${thick ? '厚い壁' : dilated ? '広い内腔' : '比較用の壁と内腔'}。解剖学的縮尺ではありません。`}><circle cx="180" cy="163" r={outer} fill={amyloid ? '#d9c5ef' : '#f3cfda'} stroke="#8f4964" strokeWidth="3"/><circle cx="180" cy="163" r={inner} fill="#fff" stroke="#8f4964" strokeWidth="2"/><text x="180" y="171" textAnchor="middle" fontSize="25">内腔</text><path d={`M${180+inner+4} 163H335`} stroke="#465e7b" strokeWidth="2"/><text x="300" y="145" fontSize="24">壁</text><text x="180" y="320" textAnchor="middle" fontSize="22">左室の断面・概念図</text></svg><div className={styles.point}><h3>{amyloid ? '画像と心電図を見合わせる' : mode === 1 ? '壁の肥厚に注目' : mode === 2 ? '拡大と収縮機能に注目' : '別々に観察する'}</h3>{amyloid ? <><RepresentativeTrace kind={mode===0?'low':'normal'} label={mode===0?'低電位の模式例':'低電位でない例もある'}/><p>{mode === 0 ? 'この不釣り合いは心アミロイドーシスを考える手掛かりのひとつです。' : '低電位は必須ではありません。心電図だけで除外しません。'}</p></> : <><RepresentativeTrace kind={mode===1?'hcm':mode===2?'dcm':'normal'} label={mode===1?'HCMで見られ得る高電位・再分極変化の一例':mode===2?'DCMで見られ得る幅広いQRS・ST–T変化の一例':'比較用の模式波形'}/><p>{mode === 1 ? 'HCMでは肥厚の場所や程度に違いがあり、波形も一様ではありません。高電位や異常Q波、ST–T変化などを組み合わせて見ます。' : mode === 2 ? 'DCMの心電図所見は多様です。伝導障害、QRS幅、ST–Tなどを観察し、画像で構造と機能を確認します。' : '画像の厚さ・内腔、心電図の電位・形、機能を別の情報として組み合わせます。'}</p></>}</div></div></>;
}

function Takotsubo({ mode, onChange }: { mode: number; onChange: (value: number) => void }) {
  const names = ['初期の一例', 'その後の一例', '経過を追う'];
  const notes = ['ST上昇を示す場合があります。初期から陰性Tなど、別の形もあり得ます。', 'STが戻る一方、陰性TやQT延長が目立つ場合があります。', '心電図と壁運動の回復は同じ時期とは限りません。過去・現在・その後を並べて見ます。'];
  const tail = mode === 0 ? 'Q220 116 260 112Q295 63 320 109Q340 150 375 150H500' : mode === 1 ? 'H300Q335 150 355 211T420 150H500' : 'H245Q285 113 320 150H500';
  return <><Choices names={names} value={mode} onChange={onChange} label="たこつぼの経時変化を考える"/><svg className={styles.diagram} viewBox="0 0 520 290" role="img" aria-label={names[mode]+'。'+notes[mode]}><path d="M20 150H500" stroke="#9db4c7" strokeDasharray="5 5"/><path d={'M20 150H58q17 -28 34 0H135l9 11 9 -96 12 116 12 -31'+tail} fill="none" stroke="#0a1f57" strokeWidth="3"/><path d={`M135 235v12H${mode === 1 ? 420 : mode === 0 ? 375 : 320}v-12`} stroke="#146ed6" strokeWidth="3" fill="none"/><text x="277" y="279" textAnchor="middle" fontSize="22">QTとして見る区間</text></svg><p>{notes[mode]}</p><div className={styles.point}><h3>心電図の変化 ＋ 画像でみる壁運動</h3><p>波形は心室の形の絵ではありません。心エコーなどで局所の動きを別に確認します。</p></div></>;
}

function Epsilon({ show, onChange }: { show: number; onChange: (value: number) => void }) {
  return <><Choices names={['観察する区間', '小電位の模式例']} value={show} onChange={onChange} label="QRS後の区間を見る"/><svg className={styles.diagram} viewBox="0 0 520 260" role="img" aria-label={show ? 'QRSの終末からT波の前までに小さなε波を強調した模式図' : 'QRSの終末からT波の始まりまでを示す図'}><rect x="215" y="65" width="97" height="123" rx="7" fill="#fff0c6"/><path d="M20 155H500" stroke="#9db4c7" strokeDasharray="5 5"/><path d={'M20 155H70q15 -24 30 0H149l10 -43 15 75 15 -41 17 9H231'+(show ? 'l7 -13 7 25 8 -12' : 'H253')+'H312Q337 111 365 148Q374 155 395 155H500'} fill="none" stroke="#0a1f57" strokeWidth="3"/><path d="M215 194v12H312v-12" fill="none" stroke="#9f7300" strokeWidth="2"/><text x="263" y="239" textAnchor="middle" fontSize="22">QRS後 → T波の前</text>{show === 1 && <><path d="M257 95l-13 41" stroke="#9f7300" strokeWidth="2"/><text x="269" y="93" fontSize="27">ε</text></>}<text x="380" y="113" fontSize="24">T</text></svg><p>{show ? '小電位の位置を強調しました。実記録では再現性を確かめ、ノイズや他の原因も区別します。' : 'まずQRSの終わりとT波の始まりを決め、その間を観察します。'}</p></>;
}

function RightHeart({ mode, onChange }: { mode: number; onChange: (value: number) => void }) {
  return <><Choices names={['右室から肺へ', 'SⅠQⅢTⅢを分解']} value={mode} onChange={onChange} label="右心負荷の観察"/>{mode === 0 ? <svg className={styles.diagram} viewBox="0 0 520 275" role="img" aria-label="右室から肺血管へ血液が流れる概念図。肺血管の抵抗増大は右室への圧負荷を増す。"><rect x="32" y="76" width="170" height="138" rx="35" fill="var(--anatomy-right-fill)"/><text x="117" y="151" textAnchor="middle" fontSize="30">右室</text><rect x="320" y="76" width="170" height="138" rx="35" fill="#e6effa"/><text x="405" y="151" textAnchor="middle" fontSize="27">肺血管</text><path d="M216 145H302l-17 -12m17 12l-17 12" stroke="#146ed6" strokeWidth="5" fill="none"/><text x="260" y="252" textAnchor="middle" fontSize="22">送り出す先の抵抗にも注目</text></svg> : <svg className={styles.diagram} viewBox="0 0 520 340" role="img" aria-label="SⅠQⅢTⅢの模式図。Ⅰ誘導にS波、Ⅲ誘導にQ波と陰性T波。"><text x="24" y="68" fontSize="26">Ⅰ</text><text x="24" y="221" fontSize="26">Ⅲ</text>{[100,253].map(y=><path key={y} d={`M20 ${y}H500`} stroke="#9db4c7" strokeDasharray="5 5"/>)}<path d="M25 100H112l13 -62 14 114 13 -52H285q38 -65 76 0H500M25 253H110l10 24 12 -72 14 63 10 -15H285q38 65 76 0H500" stroke="#0a1f57" strokeWidth="3" fill="none"/><text x="156" y="159" fontSize="24">S</text><text x="87" y="307" fontSize="24">Q</text><text x="351" y="319" fontSize="24">陰性T</text></svg>}<p>{mode === 0 ? '右心の構造や圧は心電図だけでは測れません。新しい変化と、以前からの所見も分けて考えます。' : '数字は誘導名です。「SⅠSⅡSⅢ」とは別の組み合わせ。所見だけで肺塞栓症を確定・除外しません。'}</p></>;
}

function Pericardium({ mode, onChange }: { mode: number; onChange: (value: number) => void }) {
  const names = ['心膜炎', '心嚢液貯留', '心タンポナーデ'];
  const notes = ['心膜炎では心臓を包む心膜に炎症が起こります。広い誘導のST上昇やPR低下が手掛かりになることがあります。', '心嚢液貯留では心膜の内側に液が貯まります。液の量と、循環への影響は別に評価します。', '心タンポナーデでは貯留した液などの圧で心臓の拡張が妨げられ、血液を受け入れにくくなります。'];
  return <><Choices names={names} value={mode} onChange={onChange} label="心膜・液・循環を分ける"/><div className={styles.twoColumns}><RepresentativeTrace kind={mode===0?'pericarditis':mode===1?'low':'alternans'} label={mode===0?'広い誘導のST上昇・PR低下の一例':mode===1?'低電位の一例':'電気的交互脈の一例'}/><svg className={styles.diagram} viewBox="0 0 520 325" role="img" aria-label={names[mode]+'の概念図。'+notes[mode]}><ellipse cx="260" cy="164" rx="166" ry="129" fill={mode > 0 ? '#e1f2ff' : '#fff8f4'} stroke={mode === 0 ? '#b34a55' : '#607891'} strokeWidth={mode === 0 ? 8 : 4}/><ellipse cx="260" cy="175" rx={mode === 2 ? 66 : 115} ry="89" fill="#f2c9d8" stroke="#8f4964" strokeWidth="3"/><text x="260" y="185" textAnchor="middle" fontSize="28">心臓</text><text x="416" y="37" fontSize="24">心膜</text><path d="M421 44l-27 38" stroke="#607891" strokeWidth="2"/>{mode > 0 && <text x="119" y="179" fontSize="24">液</text>}{mode === 2 && <><path d="M156 220h27l-10 -9m10 9l-10 9M364 220h-27l10 -9m-10 9l10 9" stroke="#b34a55" strokeWidth="4" fill="none"/><text x="260" y="313" textAnchor="middle" fontSize="22">血液を受け入れにくい</text></>}</svg></div><p>{notes[mode]}</p><p className={styles.note}>波形は見られ得る一例です。3つの概念がこの順序で必ず進むという意味ではありません。</p></>;
}

function Position({ mode, onChange }: { mode: number; onChange: (value: number) => void }) {
  const names = ['通常の接続', '右腕・左腕を交換', '鏡像右胸心の例'];
  const inverted = mode > 0;
  const heights = mode === 2 ? [70,55,38,26,15,9] : [13,25,40,57,70,64];
  return <><Choices names={names} value={mode} onChange={onChange} label="位置と接続を比較"/><svg className={styles.diagram} viewBox="0 0 520 370" role="img" aria-label={names[mode]+(mode === 1 ? '。Ⅰ誘導は反転するが胸部のR波の並びは変わらない。' : mode === 2 ? '。通常の左胸部誘導でR波が減高する模式例。' : '。Ⅰと胸部R波を比較する模式例。')}><text x="25" y="38" fontSize="24">Ⅰ誘導の向き</text><path d="M25 115H495" stroke="#9db4c7" strokeDasharray="5 5"/><g transform={inverted ? 'translate(0 230) scale(1 -1)' : undefined}><path d="M25 115H78q15 -24 30 0H174l9 7 10 -70 12 90 10 -27H295q32 -50 64 0H495" stroke="#0a1f57" strokeWidth="3" fill="none"/></g><text x="25" y="234" fontSize="23">胸部のR波の高さを並べる</text><path d="M30 328H495" stroke="#9db4c7"/>{heights.map((height, i)=><g key={i}><rect x={48+i*76} y={328-height} width="30" height={height} rx="3" fill="#146ed6"/><text x={63+i*76} y="359" textAnchor="middle" fontSize="21">V{i+1}</text></g>)}</svg><p>{mode === 1 ? '腕の左右交換だけなら、胸部のR波の並びはそのままです。aVFも変わりません。' : mode === 2 ? 'この例では、通常の左胸部記録でR波がV1からV6へ小さくなります。Ⅰだけでなく胸部誘導と身体の位置情報も見ます。' : 'まず四肢と胸部をセットで見ます。下の棒はR波の高さだけを抜き出した概念です。'}</p></>;
}

function Pediatric({ mode, onChange }: { mode: number; onChange: (value: number) => void }) {
  const names = ['出生直後', '乳幼児・小児', '成長とともに'];
  const notes = ['右室優位で軸も右向きです。出生直後のT波は、その後の乳幼児期と分けて見ます。', '右前胸部の陰性Tが生理的なことがあります。心拍数・PR・QRSも年齢別に評価します。', '右室優位から成人に近い関係へ変化します。T波が陽性になる時期には個人差があり、V1の陰性Tが残る例もあります。'];
  const rotation = [110,80,55][mode];
  const endX = 163+80*Math.cos(rotation*Math.PI/180);
  const endY = 141+80*Math.sin(rotation*Math.PI/180);
  return <><Choices names={names} value={mode} onChange={onChange} label="年齢と心電図の変化"/><div className={styles.twoColumns}><svg className={styles.diagram} viewBox="0 0 330 315" role="img" aria-label="成長につれて右室優位から変わる電気軸の概念。角度は正常値ではありません。"><circle cx="163" cy="141" r="103" stroke="#bed4e8" strokeWidth="2" fill="#f3f9ff"/><path d="M39 141H286M163 20V267" stroke="#9db4c7"/><path d={`M163 141L${endX} ${endY}`} stroke="#146ed6" strokeWidth="6"/><circle cx={endX} cy={endY} r="8" fill="#146ed6"/><text x="20" y="128" fontSize="21">−Ⅰ</text><text x="277" y="128" fontSize="21">＋Ⅰ</text><text x="176" y="266" fontSize="21">＋aVF</text><text x="163" y="308" textAnchor="middle" fontSize="21">変化の方向・正常範囲ではない</text></svg><div className={styles.point}><h3>{names[mode]}のV1模式例</h3><RepresentativeTrace kind={mode===0?'newborn':mode===1?'child':'older'} label={mode===0?'出生直後：右室優位とT波の一例':mode===1?'小児：V1陰性Tの一例':'成長後：成人に近づく一例'}/><p>{notes[mode]}</p><p>日齢・年齢 → 記録条件 → 年齢別の基準 → 症状・家族歴</p></div></div></>;
}

export function AdvancedVisual({ kind, variant, onVariantChange }: { kind: AdvancedKind; variant: number; onVariantChange: (value: number) => void }) {
  const mode = variant;
  const visuals = {
    'j-wave': <JWave mode={Math.min(mode, 2)} onChange={onVariantChange}/>, structure: <Structure mode={Math.min(mode, 2)} onChange={onVariantChange}/>, takotsubo: <Takotsubo mode={Math.min(mode, 2)} onChange={onVariantChange}/>, epsilon: <Epsilon show={Math.min(mode, 1)} onChange={onVariantChange}/>, amyloid: <Structure amyloid mode={Math.min(mode, 1)} onChange={onVariantChange}/>,
    'right-heart': <RightHeart mode={Math.min(mode, 1)} onChange={onVariantChange}/>, pericardium: <Pericardium mode={Math.min(mode, 2)} onChange={onVariantChange}/>, position: <Position mode={Math.min(mode, 2)} onChange={onVariantChange}/>, pediatric: <Pediatric mode={Math.min(mode, 2)} onChange={onVariantChange}/>,
  };
  return <section className={styles.section}><h2>代表的な波形</h2>{visuals[kind]}<p className={styles.note}>独自に作成した学習用の模式図です。寸法・振幅・角度は概念の比較用で、実記録や診断の基準値ではありません。</p></section>;
}
