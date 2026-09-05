import type { CSSProperties } from 'react';
import { mirrorChangeLabel, mirrorProjection, mirrorViewLabel, type MirrorScenario } from '@/app/domain/mirror';

type MirrorWaveformProps = { scenario: MirrorScenario; view: number };

function viewpointLead(scenario: MirrorScenario, view: number): string {
  if (view <= 5) return scenario.direct.leads.join('・');
  if (view >= 95) return scenario.opposite.leads.join('・');
  return '仮想視点（実在の誘導ではない）';
}

export function MirrorWaveform({ scenario, view }: MirrorWaveformProps) {
  const projection = mirrorProjection(view);
  const stY = 82 - projection * 20;
  const posteriorProgress = scenario.id === 'posterior' ? view / 100 : 0;
  const rTop = 34 - posteriorProgress * 10;
  const sBottom = 108 - posteriorProgress * 13;
  const tShoulder = stY + (82 - stY) * 0.42;
  const change = mirrorChangeLabel(view);
  const patternId = `mirror-dynamic-grid-${scenario.id}`;
  const style = { '--mirror-color': scenario.color } as CSSProperties;
  const trace = `M0 82 H45 C52 82 56 72 64 72 C72 72 76 82 84 82 H113 L122 90 L133 ${rTop.toFixed(1)} L145 ${sBottom.toFixed(1)} L158 ${stY.toFixed(1)} H246 C265 ${stY.toFixed(1)} 278 ${tShoulder.toFixed(1)} 291 77 C304 83 319 82 338 82 H420`;

  return (
    <figure className="mirror-dynamic-wave" style={style} aria-live="polite">
      <figcaption><div><span>現在の視点で見える模式波形</span><strong>{viewpointLead(scenario, view)}</strong></div><b>{change}</b></figcaption>
      <svg viewBox="0 0 420 142" role="img" aria-label={`${mirrorViewLabel(view)}で見える${change}の模式波形`}>
        <defs><pattern id={patternId} width="12" height="12" patternUnits="userSpaceOnUse"><path d="M12 0H0V12" className="mirror-grid-line" /></pattern></defs>
        <rect width="420" height="142" className="mirror-paper" /><rect width="420" height="142" fill={`url(#${patternId})`} />
        <path d="M0 82 H420" className="mirror-baseline" /><path d={trace} className="mirror-trace" /><path d={`M159 ${stY.toFixed(1)} H246`} className="mirror-st-mark" />
        <g className="mirror-st-measure" aria-hidden="true"><path d={`M230 82 V${stY.toFixed(1)}`} /><circle cx="230" cy="82" r="3" /><circle cx="230" cy={stY} r="3" /></g>
        <text x="202" y={projection >= 0 ? stY - 11 : stY + 19} className="mirror-st-label">{change}</text>
      </svg>
      <div className="mirror-wave-scale" aria-hidden="true"><span>{scenario.direct.leads.join('・')}側</span><i style={{ left: `${view}%` }} /><span>{scenario.opposite.leads.join('・')}側</span></div>
      <p>中央は理解のための仮想視点です。実際の心電図に、この途中の誘導があるわけではありません。</p>
    </figure>
  );
}
