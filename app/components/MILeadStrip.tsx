import { miLeadLabel, type MILead, type MILeadChange } from '@/app/domain/mi';

type MILeadStripProps = { lead: MILead; change: MILeadChange; color: string; supplemental?: boolean };

const pathForChange: Record<MILeadChange, string> = {
  neutral: 'M0 54 H26 C32 54 35 47 40 47 C45 47 49 54 56 54 H75 L81 59 L87 27 L94 69 L102 54 H122 C133 54 140 43 151 43 C162 43 169 54 180 54 H220',
  elevation: 'M0 54 H26 C32 54 35 47 40 47 C45 47 49 54 56 54 H75 L81 59 L87 27 L94 69 L102 43 H145 C153 43 159 49 166 52 C174 55 183 54 192 54 H220',
  depression: 'M0 54 H26 C32 54 35 47 40 47 C45 47 49 54 56 54 H75 L81 59 L87 27 L94 69 L102 65 H145 C153 65 159 59 166 56 C174 53 183 54 192 54 H220',
};

const changeLabel: Record<MILeadChange, string> = { elevation: 'ST上昇', depression: 'ST低下（鏡像）', neutral: '基準' };

export function MILeadStrip({ lead, change, color, supplemental = false }: MILeadStripProps) {
  const patternId = `mi-grid-${lead}`;
  return (
    <figure className={`mi-lead-strip is-${change} ${supplemental ? 'is-supplemental' : ''}`}>
      <figcaption><strong>{miLeadLabel(lead)}</strong><span>{changeLabel[change]}</span></figcaption>
      <svg viewBox="0 0 220 84" role="img" aria-label={`${miLeadLabel(lead)}誘導の模式波形、${changeLabel[change]}`}>
        <defs><pattern id={patternId} width="10" height="10" patternUnits="userSpaceOnUse"><path d="M10 0H0V10" className="mi-grid-line" /></pattern></defs>
        <rect width="220" height="84" className="mi-paper" /><rect width="220" height="84" fill={`url(#${patternId})`} />
        <path d={pathForChange[change]} className="mi-trace" style={change === 'neutral' ? undefined : { stroke: color }} />
        {change !== 'neutral' && <path d={change === 'elevation' ? 'M103 43 H145' : 'M103 65 H145'} className="mi-st-mark" style={{ stroke: color }} />}
      </svg>
    </figure>
  );
}
