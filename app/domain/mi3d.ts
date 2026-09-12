import type { Camera, Vec3 } from './heart3d';
import type { MITerritoryId } from './mi';

// Patient coordinates: +X left, +Y cranial, +Z anterior.
// Ellipsoids mark teaching regions, not patient-specific perfusion boundaries.
export const MI_3D: Record<MITerritoryId, { target: Vec3; extent: Vec3; arteries: string[]; camera: Camera; hint: string }> = {
  septal: { target:[.12,-.25,.18],extent:[.24,.78,.46],arteries:['左前下行枝（LAD）'],camera:{yaw:1.1,pitch:.15,zoom:1.55},hint:'中隔は左右の心室の間。右側を切り開いた模式断面で内部の位置を示している。中隔枝の細かな走行と心室内腔は省略。' },
  anterior: { target:[.54,-.35,.49],extent:[.49,.85,.34],arteries:['左前下行枝（LAD）','対角枝'],camera:{yaw:-.35,pitch:.12,zoom:1.45},hint:'前壁は胸側にある左室の壁。前面を心尖へ下るLADと、左室前面へ分かれる対角枝をたどろう。' },
  lateral: { target:[.92,-.3,-.06],extent:[.36,.84,.65],arteries:['左回旋枝（LCx）','鈍縁枝','対角枝'],camera:{yaw:-1.25,pitch:.08,zoom:1.45},hint:'側壁は患者の左側。LCxと鈍縁枝、LADの対角枝が代表的な候補になる。' },
  inferior: { target:[.35,-.93,-.29],extent:[.69,.44,.64],arteries:['右冠動脈（RCA）','後下行枝（PDA）'],camera:{yaw:-.2,pitch:-1.18,zoom:1.45},hint:'下壁は横隔膜側。下から見ると位置が分かる。この模型はRCAからPDAが出る右優位型。左優位型ではLCxも候補になる。' },
  posterior: { target:[.35,-.29,-.65],extent:[.62,.74,.33],arteries:['右冠動脈（RCA）','後下行枝（PDA）','左回旋枝（LCx）'],camera:{yaw:Math.PI,pitch:0,zoom:1.45},hint:'後壁側は背中側。背面を走るPDAと、左から回り込むLCxを確認しよう。責任血管には優位性による違いがある。' },
  'right-ventricle': { target:[-.57,-.19,.61],extent:[.58,.66,.42],arteries:['右冠動脈（RCA）','右縁枝'],camera:{yaw:.55,pitch:.1,zoom:1.45},hint:'右室は前方・患者の右側にある。右室自由壁とRCA、右縁枝の位置を確認しよう。' },
};

export const CORONARY_LABELS: {name:string;short:string;anchor:Vec3}[] = [
  {name:'左冠動脈主幹部',short:'LMT',anchor:[.24,.82,.31]},
  {name:'左前下行枝（LAD）',short:'LAD',anchor:[.22,-.37,.77]},
  {name:'左回旋枝（LCx）',short:'LCx',anchor:[.92,.42,-.08]},
  {name:'右冠動脈（RCA）',short:'RCA',anchor:[-1,.26,.53]},
  {name:'後下行枝（PDA）',short:'PDA',anchor:[.3,-.6,-.66]},
];
