/** WFDB format 16 only. Fail closed for other encodings instead of silently drawing incorrect voltages. */
export type SignalHeader = { name: string; gain: number; baseline: number; checksum: number; initial: number };
export type RecordHeader = { recordName: string; fileName: string; sampleRate: number; sampleCount: number; signals: SignalHeader[] };
export type RecordedECG = RecordHeader & { millivolts: number[][] };

export function parseRecordHeader(text: string): RecordHeader {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith('#'));
  const [recordName, countString, rateString, samplesString] = (lines[0] ?? '').split(/\s+/);
  const signalCount = Number(countString);
  const sampleRate = Number(rateString);
  const sampleCount = Number(samplesString);
  if (!recordName || signalCount !== 12 || !Number.isFinite(sampleRate) || sampleRate <= 0 || !Number.isInteger(sampleCount) || sampleCount <= 0 || lines.length !== signalCount + 1) {
    throw new Error('Unsupported or incomplete ECG header');
  }
  let fileName = '';
  const signals = lines.slice(1).map((line): SignalHeader => {
    const fields = line.split(/\s+/);
    const calibration = fields[2]?.match(/^([\d.]+)\((-?\d+)\)\/mV$/);
    if (fields.length !== 9 || fields[1] !== '16' || fields[3] !== '16' || !calibration || (fileName && fileName !== fields[0])) throw new Error('Unsupported ECG signal format');
    fileName = fields[0];
    const gain = Number(calibration[1]);
    const baseline = Number(calibration[2]);
    const initial = Number(fields[5]);
    const checksum = Number(fields[6]);
    if (!Number.isFinite(gain) || gain <= 0 || !Number.isInteger(baseline) || !Number.isInteger(initial) || !Number.isInteger(checksum)) throw new Error('Invalid ECG calibration');
    return { name: fields[8], gain, baseline, initial, checksum };
  });
  const expected = ['I', 'II', 'III', 'AVR', 'AVL', 'AVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'];
  if (new Set(signals.map((s) => s.name)).size !== 12 || expected.some((lead) => !signals.some((s) => s.name.toUpperCase() === lead))) throw new Error('Invalid twelve-lead set');
  return { recordName, fileName, sampleRate, sampleCount, signals };
}

export function decodeRecord(header: RecordHeader, bytes: ArrayBuffer): RecordedECG {
  const count = header.signals.length;
  if (bytes.byteLength !== header.sampleCount * count * 2) throw new Error('ECG sample count mismatch');
  const view = new DataView(bytes);
  const millivolts = header.signals.map((signal, channel) => {
    let checksum = 0;
    const values = Array.from({ length: header.sampleCount }, (_, sample) => {
      const adc = view.getInt16((sample * count + channel) * 2, true);
      if (adc === -32768) throw new Error('Missing ECG samples are not supported');
      if (sample === 0 && adc !== signal.initial) throw new Error('ECG initial sample mismatch');
      checksum = (checksum + adc) & 0xffff;
      return (adc - signal.baseline) / signal.gain;
    });
    if (checksum !== (signal.checksum & 0xffff)) throw new Error('ECG checksum mismatch');
    return values;
  });
  return { ...header, millivolts };
}

export function paperPoint(seconds: number, millivolts: number, pixelsPerMm = 4) {
  if (![seconds, millivolts, pixelsPerMm].every(Number.isFinite) || pixelsPerMm <= 0) throw new Error('Invalid paper scale');
  return { x: seconds * 25 * pixelsPerMm, y: -millivolts * 10 * pixelsPerMm };
}

export function recordPath(samples: readonly number[], sampleRate: number, startSeconds = 0, durationSeconds = 10, pixelsPerMm = 4): string {
  if (!Number.isFinite(sampleRate) || sampleRate <= 0 || startSeconds < 0 || durationSeconds <= 0 || !Number.isFinite(startSeconds + durationSeconds)) throw new Error('Invalid ECG window');
  const first = Math.ceil(startSeconds * sampleRate);
  const last = Math.min(samples.length, Math.ceil((startSeconds + durationSeconds) * sampleRate));
  if (first >= last) throw new Error('Empty ECG window');
  // Preserve every sample; do not smooth, resample, or normalize individual leads.
  return samples.slice(first, last).map((mv, i) => {
    const point = paperPoint((first + i) / sampleRate - startSeconds, mv, pixelsPerMm);
    return `${i === 0 ? 'M' : 'L'}${point.x.toFixed(2)},${point.y.toFixed(2)}`;
  }).join(' ');
}

export function displayLead(name: string) {
  return ({ I: 'Ⅰ', II: 'Ⅱ', III: 'Ⅲ', AVR: 'aVR', AVL: 'aVL', AVF: 'aVF' } as Record<string, string>)[name.toUpperCase()] ?? name;
}
