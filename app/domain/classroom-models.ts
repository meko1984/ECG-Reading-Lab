/** Teaching schematics only, not an ECG signal simulator or a diagnostic calculator. */
export function teachingQTc(qtMs: number, rrSeconds: number) {
  if (!Number.isFinite(qtMs) || qtMs <= 0 || !Number.isFinite(rrSeconds) || rrSeconds <= 0) throw new Error('Invalid teaching interval');
  return { bazett: qtMs / Math.sqrt(rrSeconds), fridericia: qtMs / Math.cbrt(rrSeconds) };
}

export function teachingRate(rrSeconds: number) {
  if (!Number.isFinite(rrSeconds) || rrSeconds <= 0) throw new Error('Invalid RR');
  return 60 / rrSeconds;
}

export function schematicBeat({ qrsWidth = 44, amplitude = 1, st = 0, tSign = 1 }: { qrsWidth?: number; amplitude?: number; st?: number; tSign?: number } = {}) {
  // SVG coordinate model: P onset=80, QRS onset=180. Not paper-calibrated.
  const end = 180 + qrsWidth;
  return `M25 160H80 C87 160 90 143 103 143S119 160 130 160H180 L${180 + qrsWidth * .18} ${160 + 12 * amplitude} L${180 + qrsWidth * .4} ${160 - 110 * amplitude} L${180 + qrsWidth * .67} ${160 + 33 * amplitude} L${end} ${160 - st} H${end + 44} C${end + 62} ${160 - st} ${end + 75} ${160 - 43 * tSign - st} ${end + 94} ${160 - 43 * tSign - st} C${end + 115} ${160 - 43 * tSign - st} ${end + 125} 160 ${end + 150} 160H565`;
}

export function axisProjections(degrees: number) {
  const angle = degrees * Math.PI / 180;
  return { leadI: Math.cos(angle), leadII: Math.cos(angle - Math.PI / 3), avf: Math.sin(angle) };
}
