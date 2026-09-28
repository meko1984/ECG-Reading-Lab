import type { VisualKind } from '@/app/content/classroom/types';
import { ScrollableWaveform } from './ScrollableWaveform';
import styles from './Classroom.module.css';

const leads = ['I', 'aVR', 'V1', 'V4', 'II', 'aVL', 'V2', 'V5', 'III', 'aVF', 'V3', 'V6'] as const;
type Lead = typeof leads[number];
type Rhythm = 'regular' | 'pac' | 'blocked-pac' | 'pvc' | 'af' | 'flutter' | 'svt' | 'pause' | 'av' | 'alternans' | 'polymorphic' | 'vf' | 'aivr' | 'capture-loss';

const baseAmplitude: Record<Lead, number> = { I:.78,II:1,III:.58,aVR:-.68,aVL:.43,aVF:.76,V1:-.62,V2:-.38,V3:.22,V4:.82,V5:1,V6:.82 };

const descriptions: Record<VisualKind, { title: string; focus: string }> = {
  cycle:{title:'標準的なP・QRS・Tの並び',focus:'同じ一拍でも、誘導によって波の向きと高さが変わります。'},
  leads:{title:'同じ心拍を12方向から見た模式例',focus:'四肢誘導と胸部誘導を、同じ時刻で横に見比べます。'},
  rate:{title:'洞調律の速さと規則性',focus:'まずRR間隔、次に各QRSの前に続くP波を確認します。'},
  pr:{title:'P波からQRSまでのつながり',focus:'P波の始まりとQRSの始まりを、複数の誘導で確認します。'},
  qrs:{title:'QRSの幅・電位・胸部誘導の移行',focus:'V1からV6へ、R波とS波の比が変わる様子を追います。'},
  axis:{title:'正常軸の一例',focus:'ⅠとaVFのQRSがともに上向きになる組み合わせを示しています。'},
  st:{title:'J点・ST・Tを分けて見る模式例',focus:'基線、QRSの終わり、ST、T波を順にたどります。'},
  qt:{title:'QRS開始からT波終末まで',focus:'T波の終わりを、見やすい誘導を使って確認します。'},
  pac:{title:'早いP′波を伴う一拍の模式例',focus:'早く出る心房波と、その後のQRSの関係を各誘導で比べます。'},
  pvc:{title:'早く幅広いQRSが現れる模式例',focus:'期外収縮の前後を含め、形と休止を12誘導で比較します。'},
  af:{title:'心房細動と洞調律の比較',focus:'RRの不規則性と心房活動を別々に観察します。'},
  flutter:{title:'反復する心房活動の模式例',focus:'下壁誘導とV1を中心に、QRS間の活動を追います。'},
  svt:{title:'規則的な狭いQRS頻拍の模式例',focus:'頻拍中のQRS幅と、P′波が見える位置を観察します。'},
  wpw:{title:'通常伝導と早期興奮の比較',focus:'短いPRとQRS初期のデルタ波を複数誘導で比べます。'},
  ventricular:{title:'心室性リズムの比較',focus:'速さ、QRSのまとまり、拍ごとの形を観察します。'},
  sinus:{title:'P波とQRSの休止を比べる模式例',focus:'休止中にP波も途切れているかを複数誘導で確認します。'},
  av:{title:'房室ブロックの伝導比を比べる模式例',focus:'P波とQRSを別々に数え、前後関係を時刻で追います。'},
  bundle:{title:'脚・枝ごとのQRS変化',focus:'V1とV6、電気軸を中心にQRSの始まりから終わりまでを比べます。'},
  ischemia:{title:'虚血領域ごとのST変化',focus:'選んだ領域に対応する隣接誘導と、反対側の変化を一緒に観察します。'},
  electrolytes:{title:'電解質・薬剤ごとの波形変化',focus:'P波・PR・QRS・ST・T・U・QTを順に観察します。'},
  pacing:{title:'刺激と捕捉の比較',focus:'刺激線の直後に心室応答が続くかを全誘導で確認します。'},
  devices:{title:'デバイス治療時の模式例',focus:'装置の刺激・治療と、それに続く心室応答を分けて見ます。'},
  practice:{title:'12誘導を同じ順序で読む練習記録',focus:'記録条件、心拍数、リズム、波形、分布の順に見ます。'},
  'j-wave':{title:'J波とBrugada型波形の比較',focus:'V1〜V3と側壁・下壁誘導でJ点付近の形を見比べます。'},
  structure:{title:'心筋症ごとの12誘導の違い',focus:'HCMとDCMで見られ得る電位・QRS幅・ST–Tの違いを比べます。'},
  takotsubo:{title:'たこつぼ症候群の経時変化',focus:'ST・T・QTが時間とともに変わることを前提に観察します。'},
  epsilon:{title:'右前胸部誘導のQRS終末電位',focus:'V1〜V3のQRS終末を、ノイズや不完全右脚ブロックと区別して見ます。'},
  amyloid:{title:'低電位の有無を比べる模式例',focus:'画像上の壁厚と心電図電位を別の情報として組み合わせます。'},
  'right-heart':{title:'右心負荷で見られ得る変化',focus:'右軸偏位、右前胸部誘導、SⅠQⅢTⅢを組み合わせて観察します。'},
  pericardium:{title:'心膜炎・心嚢液貯留・心タンポナーデの比較',focus:'選んだ病態に合わせて、ST・PR、電位、電気的交互脈の違いを見ます。'},
  position:{title:'接続・位置ごとの12誘導の違い',focus:'Ⅰ誘導と胸部誘導のR波進行を、電極装着と一緒に確認します。'},
  pediatric:{title:'年齢で変わる12誘導',focus:'右室優位、電気軸、V1のT波を年齢ごとに比べます。'},
};

const variantLabels: Partial<Record<VisualKind, string[]>> = {
  cycle:['P波','QRS','T波'],leads:['四肢誘導：前額面','胸部誘導：水平面'],pr:['P波の幅','PR間隔'],qrs:['幅を見る','幅が広い例','振幅が小さい例'],st:['基線・J点','ST上昇','ST低下','陰性T'],qt:['QT','U波を分ける'],
  pac:['伝導するPAC','非伝導性PAC'],pvc:['心室から早い一拍','変行伝導したPAC'],af:['洞調律の比較図','心房細動'],flutter:['2：1伝導','3：1伝導','4：1伝導'],svt:['AVNRT','AVRT','心房頻拍'],wpw:['通常の経路','早期興奮'],ventricular:['単形性VT','多形性VT / TdP','VF','AIVR'],sinus:['洞調律','P波が途切れる','QRSだけが途切れる'],av:['1度','Wenckebach型','MobitzⅡ型','2：1','高度：3：1','完全房室ブロック'],
  bundle:['正常伝導','右脚ブロック','左脚ブロック','左脚前枝ブロック','左脚後枝ブロック'],ischemia:['下壁','前壁・前胸部','側壁'],electrolytes:['比較用','高K','低K','低Ca','高Ca','ジゴキシン作用'],pacing:['捕捉あり','捕捉不全'],devices:['ATP','ショック','CRT'],
  'j-wave':['J波のノッチ','Brugadaコブド型','Brugadaサドルバック型'],structure:['比較用','肥大型心筋症','拡張型心筋症'],takotsubo:['初期','その後','回復を追う'],epsilon:['観察区間','ε波の模式例'],amyloid:['低電位','電位が保たれる例'],'right-heart':['右心負荷','SⅠQⅢTⅢ'],pericardium:['心膜炎','心嚢液貯留','心タンポナーデ'],position:['通常の接続','右腕・左腕を交換','鏡像右胸心'],pediatric:['出生直後','乳幼児・小児','成長後'],
};

function isLead(lead:Lead,names:Lead[]){return names.includes(lead);}

function morphology(kind:VisualKind,lead:Lead,variant:number){
  let amp=baseAmplitude[lead],p=.18*Math.sign(amp||1),t=.34*Math.sign(amp||1),st=0,width=1,pr=1,prSegment=0;
  let rhythm:Rhythm='regular'; let spike=false,delta=false,terminal=false,u=false;
  if(kind==='pr'&&variant===1)pr=1.7;
  if(kind==='qrs'&&variant===1)width=1.9;
  if(kind==='qrs'&&variant===2){amp*=.36;p*=.7;t*=.65;}
  if(kind==='st'){if(variant===1)st=.34;if(variant===2)st=-.28;if(variant===3)t*=-1.2;}
  if(kind==='qt'&&variant===1)u=true;
  if(kind==='pac')rhythm=variant===1?'blocked-pac':'pac';
  if(kind==='pvc')rhythm=variant===1?'pac':'pvc';
  if(kind==='af')rhythm=variant===1?'af':'regular';
  if(kind==='flutter')rhythm='flutter';
  if(kind==='svt'){rhythm='svt';p=variant===0?0:variant===1?-p*.55:p*1.1;}
  if(kind==='wpw'&&variant===1){delta=true;width=1.45;pr=.65;}
  if(kind==='ventricular'){p=0;width=2.2;t*=-.8;rhythm=variant===1?'polymorphic':variant===2?'vf':variant===3?'aivr':'svt';}
  if(kind==='sinus')rhythm=variant===1?'pause':variant===2?'av':'regular';
  if(kind==='av'){rhythm='av';pr=variant===0?1.7:1;}
  if(kind==='bundle'){
    if(variant===1){width=1.85;if(isLead(lead,['V1','V2']))amp=Math.abs(amp)*1.2;}
    if(variant===2){width=2;if(isLead(lead,['V1','V2']))amp=-Math.abs(amp)*1.25;if(isLead(lead,['I','aVL','V5','V6']))t*=-1;}
    if(variant===3){if(isLead(lead,['I','aVL']))amp=Math.abs(amp);if(isLead(lead,['II','III','aVF']))amp=-Math.abs(amp);}
    if(variant===4){if(isLead(lead,['I','aVL']))amp=-Math.abs(amp);if(isLead(lead,['III','aVF']))amp=Math.abs(amp)*1.25;}
  }
  if(kind==='ischemia'){
    const affected=(variant===0?['II','III','aVF']:variant===1?['V1','V2','V3','V4']:['I','aVL','V5','V6']) as Lead[];
    if(isLead(lead,affected))st=.42;
    if((variant===0&&isLead(lead,['I','aVL']))||(variant===2&&isLead(lead,['III','aVF'])))st=-.18;
  }
  if(kind==='electrolytes'){if(variant===1){t*=2.15;p*=.55;}if(variant===2){t*=.35;u=true;st=-.08;}if(variant===3)t*=1.35;if(variant===4)t*=.7;if(variant===5)st=-.24;}
  if(kind==='pacing'){spike=true;width=1.75;if(variant===1)rhythm='capture-loss';}
  if(kind==='devices'){spike=true;width=1.75;if(variant===0)rhythm='svt';if(variant===1)rhythm='vf';}
  if(kind==='j-wave'){if(variant===0)terminal=true;if(variant>0&&isLead(lead,['V1','V2','V3'])){st=variant===1?.48:.28;t=variant===1?-.42:.28;}}
  if(kind==='structure'){if(variant===1){if(isLead(lead,['I','aVL','V4','V5','V6']))amp*=1.55;t*=-.75;}if(variant===2){width=1.7;amp*=.72;t*=-.65;}}
  if(kind==='takotsubo'){if(variant===0&&isLead(lead,['I','II','aVL','V2','V3','V4','V5','V6']))st=.3;if(variant===1&&lead!=='aVR')t=-.62;if(variant===2&&lead!=='aVR')t=-.25;}
  if(kind==='epsilon')terminal=variant===1&&isLead(lead,['V1','V2','V3']);
  if(kind==='amyloid'&&variant===0){amp*=.34;p*=.62;t*=.52;}
  if(kind==='right-heart'){if(lead==='I')amp*=.35;if(lead==='III'||lead==='aVF')amp*=1.35;if(isLead(lead,['V1','V2'])){amp=Math.abs(amp)*1.35;t=-.35;}if(variant===1&&lead==='III'){amp=-Math.abs(amp);t=-.45;}}
  if(kind==='pericardium'){if(variant===0){st=lead==='aVR'||lead==='V1'?-.22:.34;prSegment=lead==='aVR'?-3.5:3.5;p*=lead==='aVR'?1.15:.72;}if(variant===1){amp*=.34;p*=.5;t*=.5;}if(variant===2){amp*=.45;p*=.55;t*=.55;rhythm='alternans';}}
  if(kind==='position'){if(variant===1&&isLead(lead,['I','aVR','aVL']))amp*=-1;if(variant===2){if(lead==='I')amp=-.78;if(lead==='aVR')amp=.72;if(lead.startsWith('V'))amp=-.48+(Number(lead.slice(1))-1)*.05;}}
  if(kind==='pediatric'){if(variant<2&&isLead(lead,['V1','V2'])){amp=variant===0?1.05:.82;t=variant===0&&lead==='V1'?.24:-.32;}if(variant===2&&lead==='V1')t=-.12;}
  return{amp,p,t,st,width,pr,prSegment,rhythm,spike,delta,terminal,u};
}
type Morphology=ReturnType<typeof morphology>;

function beat(x:number,y:number,period:number,m:Morphology,scale=1,prematureP=false){
  const a=m.amp*29*scale,p=m.p*25*scale,t=m.t*28*scale,st=m.st*22;
  const pStart=x+period*.06,qrsX=x+period*(.27+(m.pr-1)*.08),qrs=Math.min(period*.2,5.8*m.width);
  const tStart=Math.min(x+period*.66,qrsX+qrs+period*.12),tWidth=Math.max(10,period*.18);
  const prLine=m.prSegment?`L${pStart+period*.12} ${y+m.prSegment}H${qrsX-5}L${qrsX-3} ${y}`:`H${qrsX-3}`;
  const pShape=m.p===0?`M${x} ${y}H${qrsX-3}`:`M${x} ${y}H${pStart}q${period*.055} ${-p} ${period*.11} 0${prLine}`;
  const spike=m.spike?`M${qrsX-4} ${y}v-34v34`:'';
  const delta=m.delta?`q${qrs*.55} ${-a*.24} ${qrs*.8} ${-a*.58}`:`l${qrs*.22} ${a*.18}`;
  const terminal=m.terminal?`l3 ${-Math.sign(a||1)*6}l3 ${Math.sign(a||1)*6}`:'';
  const pAccent=prematureP?`M${pStart-2} ${y}q${period*.05} ${-p*1.6} ${period*.1} 0`:'';
  const u=m.u?`q${period*.05} ${-t*.35} ${period*.1} 0`:'';
  return`${spike}${pShape}${pAccent}${delta}l${qrs*.26} ${-a}l${qrs*.27} ${a*1.55}l${qrs*.28} ${-a*.73}${terminal}L${tStart} ${y-st}q${tWidth*.5} ${-t} ${tWidth} 0q${tWidth*.5} ${t} ${tWidth} 0${u}H${x+period}`;
}

function leadPath(kind:VisualKind,lead:Lead,y:number,variant:number){
  const m=morphology(kind,lead,variant);
  if(m.rhythm==='vf')return Array.from({length:141},(_,i)=>`${i?'L':'M'}${2+i*2} ${y+Math.sin(i*.46)*14+Math.sin(i*.19)*9+Math.cos(i*.73)*5}`).join(' ');
  if(m.rhythm==='af'){
    const baseline=Array.from({length:141},(_,i)=>`${i?'L':'M'}${2+i*2} ${y+Math.sin(i*.71)*2.4+Math.sin(i*.27)*1.8}`).join(' ');
    return baseline+[2,65,145,213].map((x,i)=>beat(x,y,[63,80,68,69][i],{...m,p:0},.72+(i%2)*.1)).join('');
  }
  if(m.rhythm==='flutter'){
    const baseline=`M2 ${y}`+Array.from({length:46},(_,i)=>`l6 ${i%2?6:-6}`).join('');
    const count=Math.ceil(8/(variant+2)),period=278/count;
    return baseline+Array.from({length:count},(_,i)=>beat(2+i*period,y,period,{...m,p:0},.78)).join('');
  }
  if(m.rhythm==='polymorphic')return Array.from({length:4},(_,i)=>beat(2+i*69.5,y,69.5,{...m,amp:m.amp*(i%2?-.75:1)*(1-i*.08)},.82)).join('');
  if(m.rhythm==='svt')return Array.from({length:4},(_,i)=>beat(2+i*69.5,y,69.5,m,.78)).join('');
  if(m.rhythm==='aivr')return Array.from({length:2},(_,i)=>beat(2+i*139,y,139,m,.9)).join('');
  if(m.rhythm==='pause')return beat(2,y,92,m,.9)+`M94 ${y}H188`+beat(188,y,92,m,.9);
  if(m.rhythm==='av'){
    if(kind==='av'&&variant===0)return[0,1,2].map(i=>beat(2+i*(278/3),y,278/3,m,.82)).join('');
    const starts=kind!=='av'?[2,141]:variant===1?[2,76,178]:variant===2?[2,96,206]:variant===3?[2,141]:variant===4?[2,187]:[38,190];
    const periods=starts.map((x,i)=>(starts[i+1]??280)-x);
    return starts.map((x,i)=>beat(x,y,periods[i],{...m,p:0},.8)).join('')+Array.from({length:5},(_,i)=>`M${8+i*55} ${y}q5 ${-m.p*25} 10 0`).join('');
  }
  if(m.rhythm==='pac'||m.rhythm==='blocked-pac'){
    const early=m.rhythm==='blocked-pac'?`M94 ${y}H112q5 ${-m.p*38} 10 0H174`:beat(94,y,80,m,.86,true);
    return beat(2,y,92,m,.86)+early+beat(174,y,106,m,.86);
  }
  if(m.rhythm==='pvc'){const ectopic={...m,amp:-Math.sign(m.amp||1)*Math.max(.7,Math.abs(m.amp)),p:0,width:2.3,t:-m.t};return beat(2,y,92,m,.82)+beat(94,y,80,ectopic,.9)+beat(174,y,106,m,.82);}
  if(m.rhythm==='alternans')return[0,1,2].map(i=>beat(2+i*(278/3),y,278/3,m,i%2?.48:.9)).join('');
  if(m.rhythm==='capture-loss')return beat(2,y,92,m,.84)+`M94 ${y}H186M126 ${y}v-34v34`+beat(186,y,94,m,.84);
  return[0,1,2].map(i=>beat(2+i*(278/3),y,278/3,m,.86)).join('');
}

export function TwelveLeadSchematic({kind,variant=0}:{kind:VisualKind;variant?:number}){
  const description=descriptions[kind],label=variantLabels[kind]?.[variant],title=label?`${label}：12誘導での見え方`:description.title;
  const gridId=`schematic-${kind.replaceAll('-','')}-${variant}`;
  return <section className={styles.section} aria-labelledby={`${gridId}-heading`} data-twelve-lead-variant={variant}>
    <h2 id={`${gridId}-heading`}>12誘導での見え方</h2><h3 aria-live="polite">{title}</h3><p>{description.focus}</p>
    <p className={styles.caption}>学習用の模式12誘導 ／ 標準配置：Ⅰ・aVR・V1・V4 ／ Ⅱ・aVL・V2・V5 ／ Ⅲ・aVF・V3・V6</p>
    <ScrollableWaveform className={styles.paperScroll} ariaLabel={`${title}を示す模式12誘導。横にスクロールできます`}>
      <svg className={`${styles.overview} ${styles.schematicOverview}`} data-kind={kind} data-variant={variant} viewBox="0 0 1320 414" role="img" aria-label={`${title}。${description.focus}`}>
        <defs><pattern id={`${gridId}-small`} width="4" height="4" patternUnits="userSpaceOnUse"><path d="M4 0H0V4" fill="none" stroke="#edcfdc" strokeWidth=".35"/></pattern><pattern id={`${gridId}-large`} width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill={`url(#${gridId}-small)`}/><path d="M20 0H0V20" fill="none" stroke="#ce9aae" strokeWidth=".6"/></pattern></defs>
        <rect width="1320" height="414" fill={`url(#${gridId}-large)`}/>
        {leads.map((lead,index)=><g key={lead} transform={`translate(${(index%4)*330} ${Math.floor(index/4)*138})`}><text x="12" y="24" className={styles.waveText}>{lead}</text><path d="M12 84h4v-40h20v40h4" fill="none" stroke="#0a1f57" strokeWidth="1.5"/><path d={leadPath(kind,lead,84,variant)} transform="translate(50 0)" fill="none" stroke="#0a1f57" strokeWidth="1.65" strokeLinejoin="round" strokeLinecap="round"/><path d="M330 0V138M0 138H330" fill="none" stroke="#b8a0ab" strokeWidth=".7"/></g>)}
      </svg>
    </ScrollableWaveform>
    <p className={styles.note}>選択した状態に合わせて12誘導全体が変わります。代表的な模式例であり、実記録ではなく、波形だけで診断・重症度・治療を決める基準には使えません。</p>
  </section>;
}
