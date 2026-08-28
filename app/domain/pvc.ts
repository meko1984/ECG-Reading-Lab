import { ANATOMY_COLORS } from './visual-language.ts';

export type PVCBundlePattern = 'rbbb-like' | 'lbbb-like';
export type PVCPolarity = 'positive' | 'negative';
export type PVCVentricle = 'left' | 'right';
export type PVCRegion = 'upper-outer' | 'upper-inner' | 'lower-outer' | 'apex';
export type PVCOriginId =
  | 'right-upper-outer'
  | 'right-upper-inner'
  | 'right-lower-outer'
  | 'right-apex'
  | 'left-upper-outer'
  | 'left-upper-inner'
  | 'left-lower-outer'
  | 'left-apex';

export type PVCSelections = {
  bundlePattern: PVCBundlePattern;
  inferiorPolarity: PVCPolarity;
  lateralPolarity: PVCPolarity;
  leftPrecordialPolarity: PVCPolarity;
};

export type PVCOriginEstimate = {
  ventricle: PVCVentricle;
  ventricleLabel: string;
  region: PVCRegion | null;
  title: string;
  location: string;
  reason: string;
  isWithinSimpleModel: boolean;
};

export type PVCOrigin = {
  id: PVCOriginId;
  markerNumber: number;
  shortName: string;
  siteName: string;
  ventricle: PVCVentricle;
  region: PVCRegion;
  color: string;
  selections: PVCSelections;
};

export const PVC_ORIGINS: PVCOrigin[] = [
  { id: 'right-upper-outer', markerNumber: 1, shortName: '右流出路', siteName: '右室弁輪前壁・流出路', ventricle: 'right', region: 'upper-outer', color: ANATOMY_COLORS.rightAccent, selections: { bundlePattern: 'lbbb-like', inferiorPolarity: 'positive', lateralPolarity: 'positive', leftPrecordialPolarity: 'positive' } },
  { id: 'right-upper-inner', markerNumber: 2, shortName: '右前壁', siteName: '右室前壁・心尖部寄り', ventricle: 'right', region: 'upper-inner', color: ANATOMY_COLORS.rightAccent, selections: { bundlePattern: 'lbbb-like', inferiorPolarity: 'positive', lateralPolarity: 'negative', leftPrecordialPolarity: 'negative' } },
  { id: 'right-lower-outer', markerNumber: 3, shortName: '右下壁', siteName: '右室弁輪後壁・下壁', ventricle: 'right', region: 'lower-outer', color: ANATOMY_COLORS.rightAccent, selections: { bundlePattern: 'lbbb-like', inferiorPolarity: 'negative', lateralPolarity: 'positive', leftPrecordialPolarity: 'positive' } },
  { id: 'right-apex', markerNumber: 4, shortName: '右心尖', siteName: '右室心尖部', ventricle: 'right', region: 'apex', color: ANATOMY_COLORS.rightAccent, selections: { bundlePattern: 'lbbb-like', inferiorPolarity: 'negative', lateralPolarity: 'negative', leftPrecordialPolarity: 'negative' } },
  { id: 'left-upper-outer', markerNumber: 5, shortName: '左流出路', siteName: '左室弁輪前壁・流出路', ventricle: 'left', region: 'upper-outer', color: ANATOMY_COLORS.leftAccent, selections: { bundlePattern: 'rbbb-like', inferiorPolarity: 'positive', lateralPolarity: 'positive', leftPrecordialPolarity: 'positive' } },
  { id: 'left-upper-inner', markerNumber: 6, shortName: '左前壁', siteName: '左室前壁・心尖部寄り', ventricle: 'left', region: 'upper-inner', color: ANATOMY_COLORS.leftAccent, selections: { bundlePattern: 'rbbb-like', inferiorPolarity: 'positive', lateralPolarity: 'negative', leftPrecordialPolarity: 'negative' } },
  { id: 'left-lower-outer', markerNumber: 7, shortName: '左下壁', siteName: '左室弁輪後壁・下壁', ventricle: 'left', region: 'lower-outer', color: ANATOMY_COLORS.leftAccent, selections: { bundlePattern: 'rbbb-like', inferiorPolarity: 'negative', lateralPolarity: 'positive', leftPrecordialPolarity: 'positive' } },
  { id: 'left-apex', markerNumber: 8, shortName: '左心尖', siteName: '左室心尖部', ventricle: 'left', region: 'apex', color: ANATOMY_COLORS.leftAccent, selections: { bundlePattern: 'rbbb-like', inferiorPolarity: 'negative', lateralPolarity: 'negative', leftPrecordialPolarity: 'negative' } },
];

const ventricleLabels: Record<PVCVentricle, string> = {
  left: '左室起源を示唆',
  right: '右室または中隔起源を示唆',
};

const regionText: Record<PVCRegion, { short: string; location: string }> = {
  'upper-outer': {
    short: '弁輪前方・流出路側',
    location: '心臓の上方にあり、弁輪前方から流出路に近い領域',
  },
  'upper-inner': {
    short: '前壁・心尖部寄り',
    location: '前壁側で、心基部より心尖部へ近づく領域',
  },
  'lower-outer': {
    short: '弁輪後方・下壁側',
    location: '弁輪後方から下壁に近い領域',
  },
  apex: {
    short: '心尖部',
    location: '心室の先端に近い領域',
  },
};

export function pvcVentricle(pattern: PVCBundlePattern): PVCVentricle {
  return pattern === 'rbbb-like' ? 'left' : 'right';
}

export function pvcOriginEstimate(selections: PVCSelections): PVCOriginEstimate {
  const ventricle = pvcVentricle(selections.bundlePattern);
  const ventricleName = ventricle === 'left' ? '左室' : '右室';

  if (selections.lateralPolarity !== selections.leftPrecordialPolarity) {
    return {
      ventricle,
      ventricleLabel: ventricleLabels[ventricle],
      region: null,
      title: `${ventricleName}側までは絞れます`,
      location: 'Ⅰ・aVLとV5・V6の向きが一致しないため、この4ステップの単純モデルでは細かな領域を決めません。',
      reason: 'この単純モデルで扱う代表パターンから外れます。移行帯、QRSの細部、12誘導全体を加えて評価する必要があります。',
      isWithinSimpleModel: false,
    };
  }

  let region: PVCRegion;
  if (selections.inferiorPolarity === 'positive') {
    region = selections.lateralPolarity === 'positive' ? 'upper-outer' : 'upper-inner';
  } else {
    region = selections.lateralPolarity === 'positive' ? 'lower-outer' : 'apex';
  }

  const regionCopy = regionText[region];
  const verticalReason = selections.inferiorPolarity === 'positive'
    ? 'Ⅱ・Ⅲ・aVFが陽性なので、興奮は下方へ向かい、起源は相対的に上方と考えます。'
    : 'Ⅱ・Ⅲ・aVFが陰性なので、興奮は上方へ向かい、起源は相対的に下方と考えます。';
  const depthReason = selections.lateralPolarity === 'positive'
    ? 'Ⅰ・aVLとV5・V6が陽性なので、心基部・弁輪側の候補へ寄せます。'
    : 'Ⅰ・aVLとV5・V6が陰性なので、心尖部側の候補へ寄せます。';

  return {
    ventricle,
    ventricleLabel: ventricleLabels[ventricle],
    region,
    title: `${ventricleName}${regionCopy.short}`,
    location: regionCopy.location,
    reason: `${verticalReason}${depthReason}`,
    isWithinSimpleModel: true,
  };
}

export function pvcPolarityLabel(polarity: PVCPolarity): string {
  return polarity === 'positive' ? '陽性（上向き）' : '陰性（下向き）';
}

export function pvcOrigin(originId: PVCOriginId): PVCOrigin {
  const origin = PVC_ORIGINS.find((candidate) => candidate.id === originId);
  if (!origin) throw new Error(`Unknown PVC origin: ${originId}`);
  return origin;
}
