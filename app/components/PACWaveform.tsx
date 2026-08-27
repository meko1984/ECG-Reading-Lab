import {
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
    <svg className="pac-mini-wave" viewBox="0 0 112 50" aria-hidden="true">
      <path d="M5 25H107" className="pac-mini-baseline" />
      <path d={polarityPath(polarity, 56, 25, 1.35)} className="pac-mini-trace" />
    </svg>
  );
}

export function PACWaveform({ lead, polarity, color }: PACWaveformProps) {
  const normalBefore = normalBeat(40);
  const pacStart = 160;
  const pac = prematureBeat(pacStart, polarity);
  const normalAfter = normalBeat(345);
  const pCenter = pacStart + 17;
  const summary = `${lead}誘導の連続模式心電図。洞調律、${polarityLabel(polarity)}のPダッシュ波を伴う心房期外収縮、洞調律の順に3拍を示します。`;

  return (
    <figure className="pac-waveform-figure">
      <svg viewBox="0 0 480 124" role="img" aria-label={summary}>
        <defs>
          <pattern id={`pac-small-grid-${lead}`} width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M8 0L0 0 0 8" className="pac-grid-small" />
          </pattern>
          <pattern id={`pac-grid-${lead}`} width="40" height="40" patternUnits="userSpaceOnUse">
            <rect width="40" height="40" fill={`url(#pac-small-grid-${lead})`} />
            <path d="M40 0L0 0 0 40" className="pac-grid-large" />
          </pattern>
        </defs>
        <rect width="480" height="124" className="pac-paper" />
        <rect width="480" height="124" fill={`url(#pac-grid-${lead})`} />
        <rect x={pacStart - 7} y="5" width="118" height="114" className="pac-beat-window" />
        <path d={`M7 ${baseline} ${normalBefore} L160 ${baseline} ${pac} L345 ${baseline} ${normalAfter} L473 ${baseline}`} className="pac-trace" />
        <path d={polarityPath(polarity, pCenter, baseline, 0.88)} className="pac-p-prime" style={{ stroke: color }} />
        <text x="93" y="18" className="pac-beat-label">洞調律</text>
        <text x="216" y="18" className="pac-beat-label pac-beat-label-accent" style={{ fill: color }}>PAC</text>
        <text x="399" y="18" className="pac-beat-label">洞調律</text>
        <text x="14" y="42" className="lead-label">{lead}</text>
      </svg>
      <figcaption>
        <strong>{lead}：P′は{polarityLabel(polarity)}</strong>
        <span>洞調律 → PAC → 洞調律</span>
      </figcaption>
    </figure>
  );
}
