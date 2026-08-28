'use client';

import type { BodySiteId, ElectrodeId, ElectrodePlacement } from '@/app/domain/electrodes';

type Props = {
  placement: ElectrodePlacement;
  selected: ElectrodeId | null;
  onPlace: (site: BodySiteId) => void;
};

const sites: { id: BodySiteId; label: string; className: string }[] = [
  { id: 'RA', label: '右上肢', className: 'electrode-site-ra' },
  { id: 'LA', label: '左上肢', className: 'electrode-site-la' },
  { id: 'RL', label: '右下肢', className: 'electrode-site-rl' },
  { id: 'LL', label: '左下肢', className: 'electrode-site-ll' },
  { id: 'V1', label: 'V1', className: 'electrode-site-v1' },
  { id: 'V2', label: 'V2', className: 'electrode-site-v2' },
  { id: 'V3', label: 'V3', className: 'electrode-site-v3' },
  { id: 'V4', label: 'V4', className: 'electrode-site-v4' },
  { id: 'V5', label: 'V5', className: 'electrode-site-v5' },
  { id: 'V6', label: 'V6', className: 'electrode-site-v6' },
  { id: 'V1_HIGH', label: 'V1 高位', className: 'electrode-site-v1-high' },
  { id: 'V2_HIGH', label: 'V2 高位', className: 'electrode-site-v2-high' },
];

export function ElectrodeBodyMap({ placement, selected, onPlace }: Props) {
  return (
    <div className="electrode-body-map">
      <svg className="electrode-body" viewBox="0 0 320 500" role="img" aria-label="正面から見た人体の電極装着位置">
        <circle cx="160" cy="55" r="38" />
        <path className="electrode-body-extremity" d="M116 119 C86 142 66 181 39 232 M204 119 C234 142 254 181 281 232" />
        <path className="electrode-body-torso" d="M119 94 C94 112 81 160 87 226 L106 337 L89 470 L137 470 L158 345 L182 470 L231 470 L214 337 L233 226 C239 160 226 112 201 94 C185 108 135 108 119 94 Z" />
        <path className="electrode-body-midline" d="M160 104 L160 337" />
        <path className="electrode-body-rib" d="M112 143 C138 125 182 125 208 143 M105 169 C137 149 183 149 215 169 M101 195 C137 174 183 174 219 195" />
        <text x="160" y="488">正面（画面左＝患者の右）</text>
      </svg>
      {sites.map((site) => {
        const electrode = placement[site.id];
        const isHigh = site.id.endsWith('_HIGH');
        return (
          <button
            type="button"
            key={site.id}
            className={`electrode-drop-site ${site.className} ${electrode ? 'is-filled' : ''} ${isHigh ? 'is-high-site' : ''}`}
            onClick={() => onPlace(site.id)}
            disabled={!selected}
            aria-label={`${site.label}の位置。${electrode ? `${electrode}電極を装着中` : '空き'}${selected ? `。${selected}をここへ装着` : ''}`}
          >
            <span>{electrode ?? '+'}</span><small>{site.label}</small>
          </button>
        );
      })}
    </div>
  );
}
