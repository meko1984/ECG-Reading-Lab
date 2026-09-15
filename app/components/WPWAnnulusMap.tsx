import { PATHWAY_LOCATIONS, type PathwayLocationId } from '@/app/domain/wpw-localization';

type WPWAnnulusMapProps = {
  activeLocationId: PathwayLocationId;
  onSelect: (locationId: PathwayLocationId) => void;
};

const segmentPaths: Record<PathwayLocationId, string> = {
  'right-anterior': 'M69 76C92 54 124 46 156 55',
  anteroseptal: 'M156 55C190 62 212 84 220 111',
  midseptal: 'M220 111C226 129 226 150 221 168',
  posteroseptal: 'M221 168C215 190 199 209 177 220',
  'right-posterior': 'M49 193C72 220 109 231 145 226',
  'right-lateral': 'M38 116C31 143 34 171 49 193',
  'left-anterior': 'M278 76C309 58 350 68 371 100',
  'left-lateral': 'M371 100C389 135 379 178 350 199',
  'left-posterior': 'M350 199C326 218 286 215 260 190',
};

const labelPositions: Record<PathwayLocationId, { x: number; y: number }> = {
  'right-anterior': { x: 105, y: 34 },
  anteroseptal: { x: 199, y: 58 },
  midseptal: { x: 245, y: 139 },
  posteroseptal: { x: 210, y: 208 },
  'right-posterior': { x: 96, y: 250 },
  'right-lateral': { x: 28, y: 158 },
  'left-anterior': { x: 337, y: 48 },
  'left-lateral': { x: 392, y: 151 },
  'left-posterior': { x: 312, y: 237 },
};

export function WPWAnnulusMap({ activeLocationId, onSelect }: WPWAnnulusMapProps) {
  const activateFromKeyboard = (event: React.KeyboardEvent<SVGGElement>, locationId: PathwayLocationId) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onSelect(locationId);
  };

  return (
    <svg className="wpw-annulus-map" viewBox="0 0 420 285" role="group" aria-labelledby="wpw-map-title wpw-map-desc">
      <title id="wpw-map-title">房室弁輪上の副伝導路候補</title>
      <desc id="wpw-map-desc">心室側から弁輪を見上げた模式図です。画面上が前壁、下が後壁で、三尖弁輪と僧帽弁輪の周囲に9つの代表位置を表示します。</desc>

      <text className="wpw-orientation-label" x="210" y="17">前壁</text>
      <text className="wpw-orientation-label" x="387" y="278">後壁</text>
      <text className="wpw-side-label" x="85" y="112">三尖弁輪</text>
      <text className="wpw-side-label" x="319" y="116">僧帽弁輪</text>

      <ellipse className="wpw-annulus-ring wpw-annulus-ring-right" cx="130" cy="140" rx="94" ry="85" />
      <ellipse className="wpw-annulus-ring wpw-annulus-ring-left" cx="310" cy="137" rx="72" ry="67" />
      <path className="wpw-coronary-sinus" d="M177 220C207 244 268 247 327 216" />
      <circle className="wpw-his-node" cx="211" cy="83" r="7" />
      <text className="wpw-his-label" x="229" y="87">His束</text>

      {PATHWAY_LOCATIONS.map((location) => {
        const active = location.id === activeLocationId;
        const label = labelPositions[location.id];
        return (
          <g
            key={location.id}
            className={`wpw-map-choice wpw-map-${location.area} ${active ? 'is-active' : ''}`}
            role="button"
            tabIndex={0}
            aria-pressed={active}
            aria-label={`${location.name}、${location.abbreviation}`}
            onClick={() => onSelect(location.id)}
            onKeyDown={(event) => activateFromKeyboard(event, location.id)}
          >
            <path className="wpw-map-hit" d={segmentPaths[location.id]} />
            <path className="wpw-map-segment" d={segmentPaths[location.id]} />
            <text className="wpw-map-label" x={label.x} y={label.y}>{location.abbreviation}</text>
          </g>
        );
      })}

      <g className="wpw-map-axis" aria-hidden="true">
        <path d="M14 54V92" />
        <path d="M9 61L14 54L19 61" />
        <text x="14" y="105">前</text>
      </g>
    </svg>
  );
}
