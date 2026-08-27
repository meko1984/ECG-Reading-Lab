export type LeadQRS = {
  q: number;
  r: number;
  s: number;
};

export type AxisClassification =
  | '正常範囲'
  | '右軸偏位'
  | '左軸偏位'
  | '不定軸 / 極度軸偏位';

export type AxisResult = {
  leadI: number;
  leadII: number;
  x: number;
  y: number;
  angleDegrees: number;
  classification: AxisClassification;
};

export const INITIAL_LEAD_I: LeadQRS = { q: -0.6, r: 7.5, s: -1.2 };
export const INITIAL_LEAD_II: LeadQRS = { q: -1, r: 10, s: -2 };

export function netQRS(values: LeadQRS): number {
  return values.q + values.r + values.s;
}

export function classifyAxis(angleDegrees: number): AxisClassification {
  if (angleDegrees >= -30 && angleDegrees <= 90) return '正常範囲';
  if (angleDegrees > 90 && angleDegrees <= 180) return '右軸偏位';
  if (angleDegrees < -30 && angleDegrees >= -90) return '左軸偏位';
  return '不定軸 / 極度軸偏位';
}

export function calculateAxis(leadI: number, leadII: number): AxisResult {
  const x = leadI;
  const y = (leadII - 0.5 * leadI) / 0.8660254038;
  const angleDegrees = Math.atan2(y, x) * 180 / Math.PI;

  return {
    leadI,
    leadII,
    x,
    y,
    angleDegrees,
    classification: classifyAxis(angleDegrees),
  };
}

export function classificationReason(classification: AxisClassification): string {
  switch (classification) {
    case '正常範囲':
      return 'Ⅰ誘導とⅡ誘導の正味QRSから、電気軸は正常範囲にあります。';
    case '右軸偏位':
      return '電気軸が+90°を超えており、右軸偏位の範囲にあります。';
    case '左軸偏位':
      return '電気軸が-30°未満で、左軸偏位の範囲にあります。';
    default:
      return '電気軸が-90°未満の範囲にあり、不定軸または極度軸偏位として扱います。';
  }
}

export function signed(value: number, fractionDigits = 1): string {
  const normalized = Object.is(value, -0) ? 0 : value;
  const sign = normalized >= 0 ? '+' : '-';
  return `${sign}${Math.abs(normalized).toFixed(fractionDigits)}`;
}
