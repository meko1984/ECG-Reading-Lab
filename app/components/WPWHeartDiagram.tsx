import type { WPWTypeId } from '@/app/domain/wpw';

type WPWHeartDiagramProps = {
  activeType: WPWTypeId;
  onSelect: (typeId: WPWTypeId) => void;
};

const markerPositions: Record<WPWTypeId, { x: number; y: number; angle: number; label: string; name: string }> = {
  'type-a': { x: 254, y: 133, angle: -18, label: 'A', name: 'タイプAの代表位置、僧帽弁輪側' },
  'type-c': { x: 177, y: 145, angle: 2, label: 'C', name: 'タイプCの代表位置、中隔' },
  'type-b': { x: 84, y: 153, angle: 19, label: 'B', name: 'タイプBの代表位置、三尖弁輪側' },
};

export function WPWHeartDiagram({ activeType, onSelect }: WPWHeartDiagramProps) {
  const activateFromKeyboard = (event: React.KeyboardEvent<SVGGElement>, typeId: WPWTypeId) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    onSelect(typeId);
  };

  return (
    <svg
      className="wpw-heart-diagram"
      viewBox="0 0 360 310"
      role="img"
      aria-labelledby="wpw-heart-title wpw-heart-desc"
    >
      <title id="wpw-heart-title">選択したケント束の付着部位</title>
      <desc id="wpw-heart-desc">心臓を正面から見た四腔断面の模式図。左右非対称の心臓内に右房、左房、右室、左室を描き、右室と左室の間に厚みのある心室中隔を示しています。選択したケント束は青く表示しています。</desc>

      <defs>
        <marker id="v1-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 Z" />
        </marker>
      </defs>

      <path
        className="anatomical-heart-wall"
        d="M78 50L78 18L103 18L103 49C126 39 151 38 174 49C202 39 238 42 267 58C305 79 324 120 319 164C314 214 286 258 242 282C201 304 151 300 113 280C79 262 59 232 57 199C55 172 48 151 40 130C29 102 34 73 52 56C60 49 70 45 78 50Z"
      />

      <path className="atrium atrium-right" d="M81 57C58 61 45 79 45 103C45 131 60 151 83 158C103 164 124 154 135 136C145 119 142 92 131 74C119 56 101 51 81 57Z" />
      <path className="atrium atrium-left" d="M151 61C169 48 201 46 231 56C257 65 274 82 275 103C276 124 261 142 238 146C214 150 196 140 181 126C166 112 149 94 145 78C143 71 145 65 151 61Z" />

      <path className="ventricle ventricle-right" d="M79 165C98 151 126 150 151 160C169 168 184 182 194 201C203 218 203 238 193 250C181 264 155 264 131 254C103 243 82 224 73 202C66 185 68 173 79 165Z" />
      <path className="ventricle ventricle-left" d="M204 153C222 142 248 144 267 159C285 174 290 199 281 225C272 251 251 273 226 282C209 288 198 279 194 260C188 234 186 207 188 181C190 166 195 158 204 153Z" />

      <path
        className="heart-septum"
        d="M172 132C170 158 175 190 185 220C193 245 202 267 215 283L226 278C214 258 206 239 199 216C189 185 185 156 187 137Z"
      />
      <path className="valve-ring tricuspid-ring" d="M82 157C101 143 127 144 151 158" />
      <path className="valve-ring mitral-ring" d="M185 143C205 127 232 126 256 139" />

      {(Object.keys(markerPositions) as WPWTypeId[]).map((typeId) => {
        const marker = markerPositions[typeId];
        const active = activeType === typeId;
        return (
          <g
            className={`kent-choice ${active ? 'is-active' : ''}`}
            key={typeId}
            transform={`translate(${marker.x} ${marker.y}) rotate(${marker.angle})`}
            role="button"
            tabIndex={0}
            aria-label={marker.name}
            aria-pressed={active}
            onClick={() => onSelect(typeId)}
            onKeyDown={(event) => activateFromKeyboard(event, typeId)}
          >
            <circle className="kent-hit-target" cx="0" cy="0" r="30" />
            <path className="kent-bundle" d="M-9 -17C-2 -11 2 11 9 17" />
            <circle className="kent-end" cx="-9" cy="-17" r="4" />
            <circle className="kent-end" cx="9" cy="17" r="4" />
            <text className="kent-label" x="0" y="-25" transform={`rotate(${-marker.angle})`}>{marker.label}</text>
          </g>
        );
      })}

      <g className="diagram-labels" aria-hidden="true">
        <text x="91" y="108">右房</text>
        <text x="220" y="93">左房</text>
        <text x="135" y="215">右室</text>
        <text x="236" y="218">左室</text>
        <path className="septum-callout" d="M157 276L194 241" />
        <text className="septum-label" x="153" y="285">心室中隔</text>
      </g>

      <g className="v1-viewpoint" aria-hidden="true">
        <path className="v1-eye" d="M11 250C20 238 35 238 44 250C35 262 20 262 11 250Z" />
        <circle cx="28" cy="250" r="5" />
        <path className="v1-sightline" d="M39 268L79 226" markerEnd="url(#v1-arrow)" />
        <text x="9" y="291">V1から見る</text>
      </g>
    </svg>
  );
}
