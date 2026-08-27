import { WPW_WAVEFORM_SCALE, type WPWMorphology, type WPWWaveform } from '@/app/domain/wpw';

type WPWWaveformProps = {
  waveform: WPWWaveform;
  pattern: string;
};

type WPWMiniWaveformProps = {
  morphology: WPWMorphology;
};

const baseline = 84;
const smallBoxPx = 8;
const amplitudeScale = smallBoxPx * WPW_WAVEFORM_SCALE.gainMmPerMv;
const pxForMs = (milliseconds: number) => milliseconds / WPW_WAVEFORM_SCALE.smallBoxMs * smallBoxPx;
const pOnsetX = 28;
const qrsOnsetX = pOnsetX + pxForMs(WPW_WAVEFORM_SCALE.prIntervalMs);
const qrsEndX = qrsOnsetX + pxForMs(WPW_WAVEFORM_SCALE.qrsDurationMs);
const deltaWindowEndX = qrsOnsetX + pxForMs(WPW_WAVEFORM_SCALE.initialDeltaWindowMs);
const y = (amplitude: number) => baseline - amplitude * amplitudeScale;

function qrsPath(waveform: WPWWaveform): string {
  if (waveform.morphology === 'QS') {
    return [
      `C ${qrsOnsetX + 2} ${y(waveform.delta * 0.45)} ${deltaWindowEndX} ${y(waveform.delta)} ${qrsOnsetX + 6} ${y(-0.16)}`,
      `C 60 ${y(-0.42)} 64 ${y(waveform.s)} 68 ${y(waveform.s)}`,
      `C 74 ${y(waveform.s)} 79 ${y(-0.22)} ${qrsEndX} ${baseline}`,
    ].join(' ');
  }

  return [
    `C ${qrsOnsetX + 2} ${y(waveform.delta * 0.45)} ${deltaWindowEndX} ${y(waveform.delta)} ${qrsOnsetX + 6} ${y(waveform.delta)}`,
    `L 64 ${y(waveform.r)}`,
    `L 73 ${y(waveform.s)}`,
    `L ${qrsEndX} ${baseline}`,
  ].join(' ');
}

function miniPath(morphology: WPWMorphology): string {
  if (morphology === 'R-dominant') return 'M4 27L34 27L42 24L54 5L63 35L72 27L96 27';
  if (morphology === 'QS') return 'M4 27L35 27C42 27 43 43 52 43C62 43 65 31 70 27L96 27';
  return 'M4 27L34 27L44 18L53 43L63 27L96 27';
}

export function WPWMiniWaveform({ morphology }: WPWMiniWaveformProps) {
  return (
    <svg className="wpw-mini-waveform" viewBox="0 0 100 48" aria-hidden="true">
      <path d="M4 27H96" className="wpw-mini-baseline" />
      <path d={miniPath(morphology)} className="wpw-mini-trace" />
    </svg>
  );
}

export function WPWWaveform({ waveform, pattern }: WPWWaveformProps) {
  const path = [
    `M 8 ${baseline}`,
    `L ${pOnsetX} ${baseline}`,
    `C 31 ${baseline} 33 ${y(0.12)} 37 ${y(0.12)}`,
    `C 41 ${y(0.12)} 43 ${baseline} 46 ${baseline}`,
    `L ${qrsOnsetX} ${baseline}`,
    qrsPath(waveform),
    `L 94 ${baseline}`,
    `C 100 ${baseline} 106 ${y(waveform.t)} 112 ${y(waveform.t)}`,
    `C 119 ${y(waveform.t)} 125 ${baseline} 132 ${baseline}`,
    `L 342 ${baseline}`,
  ].join(' ');

  const summary = `V1誘導の代表模式波形。紙送り速度25ミリ毎秒、感度10ミリ毎ミリボルト。短いPR間隔と幅広いQRSを示す${pattern}。`;

  return (
    <figure className="wpw-waveform-figure">
      <svg viewBox="0 0 350 160" role="img" aria-label={summary}>
        <defs>
          <pattern id="wpw-small-grid-v1" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" className="wpw-grid-small" />
          </pattern>
          <pattern id="wpw-grid-v1" width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill="url(#wpw-small-grid-v1)" />
            <path d="M 40 0 L 0 0 0 40" className="wpw-grid-large" />
          </pattern>
        </defs>
        <rect width="350" height="160" className="wpw-paper" />
        <rect width="350" height="160" fill="url(#wpw-grid-v1)" />
        <rect x={qrsOnsetX} y="8" width={deltaWindowEndX - qrsOnsetX} height="144" className="delta-window" />
        <path d={path} className="wpw-trace" />
        <path d={`M ${qrsOnsetX} ${baseline} L ${deltaWindowEndX} ${y(waveform.delta)}`} className="delta-emphasis" />
        <path d={`M${qrsOnsetX} 24V31M${deltaWindowEndX} 24V31M${qrsOnsetX} 27.5H${deltaWindowEndX}`} className="delta-measure" />
        <text x="66" y="29" className="delta-window-label">初期20 ms</text>
        <text x="15" y="22" className="lead-label">V1</text>
      </svg>
      <figcaption>
        <strong>{pattern}</strong>
        <span>25 mm/s・10 mm/mVの模式波形</span>
      </figcaption>
    </figure>
  );
}
