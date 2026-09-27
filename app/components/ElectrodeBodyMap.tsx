'use client';

import type { BodySiteId, ElectrodeId, ElectrodePlacement } from '@/app/domain/electrodes';

export type ElectrodeMapView = 'standard' | 'right' | 'back';

type Props = {
  placement: ElectrodePlacement;
  selected: ElectrodeId | null;
  view: ElectrodeMapView;
  onPlace: (site: BodySiteId) => void;
};

type Site = { id: BodySiteId; label: string; marker: string; className: string };

const limbSites: Site[] = [
  { id: 'RA', label: '右上肢', marker: 'RA', className: 'electrode-site-ra' },
  { id: 'LA', label: '左上肢', marker: 'LA', className: 'electrode-site-la' },
  { id: 'RL', label: '右下肢', marker: 'RL', className: 'electrode-site-rl' },
  { id: 'LL', label: '左下肢', marker: 'LL', className: 'electrode-site-ll' },
];

const standardSites: Site[] = [
  { id: 'V1', label: 'V1・第4肋間胸骨右縁', marker: 'V1', className: 'electrode-site-v1' },
  { id: 'V2', label: 'V2・第4肋間胸骨左縁', marker: 'V2', className: 'electrode-site-v2' },
  { id: 'V3', label: 'V3・V2とV4の中間', marker: 'V3', className: 'electrode-site-v3' },
  { id: 'V4', label: 'V4・第5肋間左鎖骨中線', marker: 'V4', className: 'electrode-site-v4' },
  { id: 'V5', label: 'V5・V4水平面の左前腋窩線', marker: 'V5', className: 'electrode-site-v5' },
  { id: 'V6', label: 'V6・V4水平面の左中腋窩線', marker: 'V6', className: 'electrode-site-v6' },
  { id: 'V1_HIGH', label: 'V1・1肋間高位', marker: '↑V1', className: 'electrode-site-v1-high' },
  { id: 'V2_HIGH', label: 'V2・1肋間高位', marker: '↑V2', className: 'electrode-site-v2-high' },
];

const rightSites: Site[] = [
  { id: 'V1R', label: 'V1R・第4肋間胸骨左縁', marker: 'V1R', className: 'electrode-site-v1r' },
  { id: 'V2R', label: 'V2R・第4肋間胸骨右縁', marker: 'V2R', className: 'electrode-site-v2r' },
  { id: 'V3R', label: 'V3R・V2RとV4Rの中間', marker: 'V3R', className: 'electrode-site-v3r' },
  { id: 'V4R', label: 'V4R・第5肋間右鎖骨中線', marker: 'V4R', className: 'electrode-site-v4r' },
  { id: 'V5R', label: 'V5R・V4R水平面の右前腋窩線', marker: 'V5R', className: 'electrode-site-v5r' },
  { id: 'V6R', label: 'V6R・V4R水平面の右中腋窩線', marker: 'V6R', className: 'electrode-site-v6r' },
];

const posteriorSites: Site[] = [
  { id: 'V7', label: 'V7・左後腋窩線', marker: 'V7', className: 'electrode-site-v7' },
  { id: 'V8', label: 'V8・左肩甲骨中線', marker: 'V8', className: 'electrode-site-v8' },
  { id: 'V9', label: 'V9・左脊柱傍', marker: 'V9', className: 'electrode-site-v9' },
];

function FrontAnatomy({ rightSided }: { rightSided: boolean }) {
  return <>
    <path className="electrode-body-chest-field" d="M105 119 C120 103 139 100 160 108 C181 100 200 103 215 119 L219 226 C201 247 184 256 160 258 C136 256 119 247 101 226Z" />
    <path className="electrode-body-sternum" d="M160 125 L160 231" />
    <path className="electrode-body-clavicle" d="M157 130 C143 116 124 114 105 124 M163 130 C177 116 196 114 215 124" />
    {[145, 163, 181, 199, 217, 235].map((y, index) => <g key={y}>
      <path className="electrode-body-rib" d={`M156 ${y} C140 ${y - 10} 117 ${y - 7} 103 ${y + 5}`} />
      <path className="electrode-body-rib" d={`M164 ${y} C180 ${y - 10} 203 ${y - 7} 217 ${y + 5}`} />
      {index < 5 ? <text className="electrode-rib-number" x="160" y={y - 4}>{index + 1}</text> : null}
    </g>)}
    <path className="electrode-intercostal-space is-fourth" d="M104 190 C128 180 146 183 157 190 M163 190 C177 181 201 182 216 191" />
    <path className="electrode-intercostal-space is-fifth" d="M102 216 C128 206 146 209 157 216 M163 216 C180 207 203 208 219 217" />
    <text className="electrode-space-label" x={rightSided ? 239 : 81} y="191">第4肋間</text>
    <text className="electrode-space-label" x={rightSided ? 239 : 81} y="217">第5肋間</text>
    <g className={`electrode-reference-lines ${rightSided ? 'is-right-sided' : ''}`}>
      <path d={rightSided ? 'M128 136V232' : 'M192 136V232'} />
      <path d={rightSided ? 'M103 149V232' : 'M217 149V232'} />
      <path d={rightSided ? 'M82 162V232' : 'M238 162V232'} />
    </g>
  </>;
}

function BackAnatomy() {
  return <>
    <path className="electrode-body-chest-field" d="M105 119 C120 103 139 100 160 108 C181 100 200 103 215 119 L219 226 C201 247 184 256 160 258 C136 256 119 247 101 226Z" />
    <path className="electrode-body-spine" d="M160 108 C156 151 164 190 160 242 C157 268 160 289 160 307" />
    <path className="electrode-body-scapula" d="M144 139 C124 137 108 154 108 183 C111 209 125 226 145 230 L152 188Z M176 139 C196 137 212 154 212 183 C209 209 195 226 175 230 L168 188Z" />
    {[151, 168, 185, 202, 219, 236].map(y => <path key={y} className="electrode-body-rib" d={`M156 ${y} C137 ${y - 8} 114 ${y - 4} 103 ${y + 8} M164 ${y} C183 ${y - 8} 206 ${y - 4} 217 ${y + 8}`} />)}
    <path className="electrode-posterior-plane" d="M73 215 H160" />
    <text className="electrode-space-label" x="103" y="200">V6と同じ水平面</text>
    <g className="electrode-reference-lines is-back-lines"><path d="M85 150V232"/><path d="M115 146V232"/><path d="M145 139V232"/></g>
  </>;
}

export function ElectrodeBodyMap({ placement, selected, view, onPlace }: Props) {
  const sites = [...limbSites, ...(view === 'standard' ? standardSites : view === 'right' ? rightSites : posteriorSites)];
  const back = view === 'back';
  return (
    <div className={`electrode-body-map is-${view}`}>
      <svg className="electrode-body" viewBox="0 0 320 500" role="img" aria-label={back ? '背面から見た全身とV7からV9の電極装着位置' : `正面から見た全身と${view === 'right' ? '右胸部' : '標準胸部'}電極装着位置`}>
        <ellipse className="electrode-body-head" cx="160" cy="45" rx="29" ry="34" />
        <circle className="electrode-body-ear" cx="129" cy="48" r="5" />
        <circle className="electrode-body-ear" cx="191" cy="48" r="5" />
        <path className="electrode-body-neck-fill" d="M145 75 L144 96 C135 100 127 104 119 110 L201 110 C193 104 185 100 176 96 L175 75Z" />
        <path className="electrode-body-arm" d="M123 98 C108 100 95 104 81 106 L34 105 L34 134 L88 132 C104 131 117 125 128 117Z" />
        <path className="electrode-body-arm" d="M197 98 C212 100 225 104 239 106 L286 105 L286 134 L232 132 C216 131 203 125 192 117Z" />
        <path className="electrode-body-hand" d="M35 102 C22 98 11 102 6 112 C1 123 11 137 26 139 C35 140 42 136 47 130 L47 108Z" />
        <path className="electrode-body-hand" d="M285 102 C298 98 309 102 314 112 C319 123 309 137 294 139 C285 140 278 136 273 130 L273 108Z" />
        <path className="electrode-body-torso" d="M122 98 C109 109 102 128 102 153 L105 233 C107 256 116 274 130 286 C140 295 180 295 190 286 C204 274 213 256 215 233 L218 153 C218 128 211 109 198 98 C180 106 140 106 122 98Z" />
        <path className="electrode-body-pelvis" d="M122 276 C116 291 114 307 117 321 C128 331 144 337 160 337 C176 337 192 331 203 321 C206 307 204 291 198 276Z" />
        <path className="electrode-body-leg" d="M118 313 C109 350 108 395 108 449 L99 481 C97 491 105 497 119 495 C132 493 138 486 140 475 L154 334Z" />
        <path className="electrode-body-leg" d="M202 313 C211 350 212 395 212 449 L221 481 C223 491 215 497 201 495 C188 493 182 486 180 475 L166 334Z" />
        <path className="electrode-body-foot" d="M100 470 C88 476 82 486 87 494 C92 501 122 502 133 494 L138 481Z" />
        <path className="electrode-body-foot" d="M220 470 C232 476 238 486 233 494 C228 501 198 502 187 494 L182 481Z" />
        <path className="electrode-body-midline" d="M160 259 V318" />
        {back ? <BackAnatomy /> : <FrontAnatomy rightSided={view === 'right'} />}
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
            <span>{site.marker}</span><small>{electrode && electrode !== site.marker ? `${site.label} ← ${electrode}` : site.label}</small>
          </button>
        );
      })}
    </div>
  );
}
