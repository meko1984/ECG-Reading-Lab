import {
  PAC_WAVEFORM_SCALE,
  polarityLabel,
  polarityPath,
  type PACLead,
  type PWavePolarity,
} from '@/app/domain/pac';

type PACWaveformProps = {
  lead: PACLead;
  polarity: PWavePolarity;
  color: string;
};

type PACMiniWaveProps = {
  polarity: PWavePolarity;
};

const baseline = 76;

function normalBeat(startX: number): string {
  const p = polarityPath('positive', startX + 17, baseline, 0.72);
  return `${p} L${startX + 39} ${baseline} L${startX + 42} ${baseline + 3} L${startX + 45} ${baseline - 23} L${startX + 49} ${baseline + 30} L${startX + 54} ${baseline - 7} L${startX + 60} ${baseline} L${startX + 72} ${baseline} C${startX + 78} ${baseline} ${startX + 81} ${baseline - 10} ${startX + 88} ${baseline - 10} C${startX + 95} ${baseline - 10} ${startX + 99} ${baseline} ${startX + 106} ${baseline}`;
}

function prematureBeat(startX: number, polarity: PWavePolarity): string {
  const p = polarityPath(polarity, startX + 17, baseline, 0.88);
  return `${p} L${startX + 37} ${baseline} L${startX + 40} ${baseline + 3} L${startX + 43} ${baseline - 23} L${startX + 47} ${baseline + 30} L${startX + 52} ${baseline - 7} L${startX + 58} ${baseline} L${startX + 70} ${baseline} C${startX + 76} ${baseline} ${startX + 79} ${baseline - 10} ${startX + 86} ${baseline - 10} C${startX + 93} ${baseline - 10} ${startX + 97} ${baseline} ${startX + 104} ${baseline}`;
}

export function PACMiniWave({ polarity }: PACMiniWaveProps) {
  return (
    <svg className="pac-mini-wave" viewBox="0 0 64 36" aria-hidden="true">
      <path d="M4 18H60" className="pac-mini-baseline" />
      <path d={polarityPath(polarity, 32, 18, 0.9)} className="pac-mini-trace" />
    </svg>
  );
}

export function PACWaveform({ lead, polarity, color }: PACWaveformProps) {
  const normalOne = normalBeat(13);
  const normalTwo = normalBeat(126);
  const pacStart = 224;
  const pac = prematureBeat(pacStart, polarity);
  const nextBeat = normalBeat(349);
  const pCenter = pacStart + 17;
  const summary = `${lead}誘導の模式心電図。洞調律2拍のあと、早く現れる${polarityLabel(polarity)}のPダッシュ波と幅の狭いQRSを伴う心房期外収縮を示します。`;

  return (
    <figure className="pac-waveform-figure">
      <svg viewBox="0 0 480 154" role="img" aria-label={summary}>
        <defs>
          <pattern id={`pac-small-grid-${lead}`} width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M8 0L0 0 0 8" className="pac-grid-small" />
          </pattern>
          <pattern id={`pac-grid-${lead}`} width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill={`url(#pac-small-grid-${lead})`} />
            <path d="M40 0L0 0 0 40" className="pac-grid-large" />
          </pattern>
          <marker id={`pac-arrow-${lead}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0 0L10 5L0 10Z" fill={color} />
          </marker>
        </defs>
        <rect width="480" height="154" className="pac-paper" />
        <rect width="480" height="154" fill={`url(#pac-grid-${lead})`} />
        <rect x={pacStart - 2} y="9" width="109" height="135" className="pac-beat-window" />
        <path d={`M7 ${baseline} ${normalOne} L126 ${baseline} ${normalTwo} L224 ${baseline} ${pac} L349 ${baseline} ${nextBeat} L473 ${baseline}`} className="pac-trace" />
        <path d={polarityPath(polarity, pCenter, baseline, 0.88)} className="pac-p-prime" style={{ stroke: color }} />
        <path d={`M${pCenter} 31V${baseline - 18}`} className="pac-p-arrow" style={{ stroke: color }} markerEnd={`url(#pac-arrow-${lead})`} />
        <text x={pCenter} y="23" className="pac-p-label" style={{ fill: color }}>早いP′</text>
        <text x="14" y="22" className="lead-label">{lead}</text>
      </svg>
      <figcaption>
        <strong>{lead}：P′は{polarityLabel(polarity)}</strong>
        <span>{PAC_WAVEFORM_SCALE.paperSpeedMmPerSec} mm/s・{PAC_WAVEFORM_SCALE.gainMmPerMv} mm/mVの模式波形</span>
      </figcaption>
    </figure>
  );
}
