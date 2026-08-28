export type MILead = 'I' | 'II' | 'III' | 'aVR' | 'aVL' | 'aVF' | 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V3R' | 'V4R' | 'V7' | 'V8' | 'V9';
export type MILeadChange = 'elevation' | 'depression' | 'neutral';
export type MITerritoryId = 'septal' | 'anterior' | 'lateral' | 'inferior' | 'posterior' | 'right-ventricle';

export type MITerritory = {
  id: MITerritoryId;
  shortLabel: string;
  title: string;
  wall: string;
  color: string;
  standardElevation: MILead[];
  reciprocalDepression: MILead[];
  supplementalElevation: MILead[];
  artery: string;
  arteryNote: string;
  reading: string;
  nextCheck: string;
};

export const STANDARD_LEADS: MILead[] = ['I', 'aVR', 'V1', 'V4', 'II', 'aVL', 'V2', 'V5', 'III', 'aVF', 'V3', 'V6'];

export const MI_TERRITORIES: MITerritory[] = [
  {
    id: 'septal', shortLabel: '中隔', title: '中隔領域', wall: '左室中隔側', color: '#7c5ce7',
    standardElevation: ['V1', 'V2'], reciprocalDepression: [], supplementalElevation: [],
    artery: '左前下行枝（LAD）', arteryNote: '代表的にはLADの中隔枝領域。V1・V2だけで閉塞部位までは断定しません。',
    reading: 'V1・V2の連続する胸部誘導でST上昇を見る代表パターンです。',
    nextCheck: 'V3・V4にも続けば、前壁中隔へ広がるパターンとして考えます。',
  },
  {
    id: 'anterior', shortLabel: '前壁', title: '前壁領域', wall: '左室前壁', color: '#ed657c',
    standardElevation: ['V3', 'V4'], reciprocalDepression: [], supplementalElevation: [],
    artery: '左前下行枝（LAD）', arteryNote: '代表的にはLAD領域。V1〜V4へ連続すれば前壁中隔の広がりを考えます。',
    reading: 'V3・V4でST上昇を見る代表パターンです。胸部誘導のどこまで続くかも見ます。',
    nextCheck: 'V1・V2、I・aVL、V5・V6へ広がっていないかを確認します。',
  },
  {
    id: 'lateral', shortLabel: '側壁', title: '側壁領域', wall: '左室側壁', color: '#df8b28',
    standardElevation: ['I', 'aVL', 'V5', 'V6'], reciprocalDepression: ['III', 'aVF'], supplementalElevation: [],
    artery: '左回旋枝（LCx）／LAD対角枝', arteryNote: '冠動脈の走行や優位性により候補が変わるため、一対一対応ではありません。',
    reading: 'I・aVLとV5・V6は、左室の側壁を異なる方向から見る連続領域です。',
    nextCheck: '下壁誘導の鏡像変化や、前壁誘導への広がりを合わせて見ます。',
  },
  {
    id: 'inferior', shortLabel: '下壁', title: '下壁領域', wall: '左室下壁', color: '#2c9b78',
    standardElevation: ['II', 'III', 'aVF'], reciprocalDepression: ['I', 'aVL'], supplementalElevation: [],
    artery: '右冠動脈（RCA）／左回旋枝（LCx）', arteryNote: '後下行枝をどちらが出すかで責任冠動脈が変わります。IIIとIIの差だけで確定はしません。',
    reading: 'II・III・aVFという連続する下壁誘導でST上昇を見る代表パターンです。',
    nextCheck: '右室合併を見逃さないため、右室タブで右側胸部誘導V3R・V4Rの見え方も確認します。',
  },
  {
    id: 'posterior', shortLabel: '後壁', title: '後壁領域', wall: '左室後壁側', color: '#3d78cf',
    standardElevation: [], reciprocalDepression: ['V1', 'V2', 'V3'], supplementalElevation: ['V7', 'V8', 'V9'],
    artery: '左回旋枝（LCx）／右冠動脈（RCA）', arteryNote: '冠動脈優位性と病変部位により、LCxまたはRCAが候補になります。',
    reading: '標準12誘導では、V1〜V3のST低下が後壁ST上昇の鏡像として現れることがあります。',
    nextCheck: 'V7〜V9を追加し、後壁側でST上昇があるか確認します。',
  },
  {
    id: 'right-ventricle', shortLabel: '右室', title: '右室領域', wall: '右室自由壁', color: '#25a0b6',
    standardElevation: ['II', 'III', 'aVF'], reciprocalDepression: ['I', 'aVL'], supplementalElevation: ['V3R', 'V4R'],
    artery: '近位右冠動脈（RCA）', arteryNote: '下壁梗塞に合併する代表パターンです。右室誘導を追加して評価します。',
    reading: '下壁ST上昇に右側胸部誘導V3R・V4RのST上昇を伴う代表パターンです。',
    nextCheck: '血圧、頸静脈、肺うっ血など臨床所見と合わせ、緊急評価につなげます。',
  },
];

export function miTerritory(id: MITerritoryId): MITerritory {
  const territory = MI_TERRITORIES.find((candidate) => candidate.id === id);
  if (!territory) throw new Error(`Unknown MI territory: ${id}`);
  return territory;
}

export function miLeadChange(territory: MITerritory, lead: MILead): MILeadChange {
  if (territory.standardElevation.includes(lead) || territory.supplementalElevation.includes(lead)) return 'elevation';
  if (territory.reciprocalDepression.includes(lead)) return 'depression';
  return 'neutral';
}

export function miLeadLabel(lead: MILead): string {
  return ({ I: 'Ⅰ', II: 'Ⅱ', III: 'Ⅲ' } as Partial<Record<MILead, string>>)[lead] ?? lead;
}
