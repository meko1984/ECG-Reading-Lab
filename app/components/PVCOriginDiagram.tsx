import { PVC_ORIGINS, type PVCOriginId } from '@/app/domain/pvc';

type PVCOriginDiagramProps = {
  activeOriginId: PVCOriginId;
  onSelect: (originId: PVCOriginId) => void;
};

export function PVCOriginDiagram({ activeOriginId, onSelect }: PVCOriginDiagramProps) {
  return (
    <div className="pvc-heart-map">
      <svg className="pvc-heart-anatomy" viewBox="0 0 640 540" role="img" aria-labelledby="pvc-heart-title pvc-heart-desc">
        <title id="pvc-heart-title">心臓全体とPVC起源候補の関係を示す独自模式図</title>
        <desc id="pvc-heart-desc">患者の右を画面左に置き、前面から右室と左室の内側を開いた学習用展開模式図。薄い色の心臓全体に、右房、右室、左室、大動脈、右室流出路、左室流出路、三尖弁、僧帽弁、調節帯、心尖部を重ねています。</desc>
        <path className="pvc-whole-heart" d="M314 72 C217 28 128 95 109 199 C91 299 146 427 279 493 C307 507 330 512 344 512 C372 504 487 447 532 338 C573 238 544 134 462 95 C409 70 359 80 314 72 Z" />
        <path className="pvc-aorta" d="M352 195 C356 139 352 87 382 54 C417 15 492 29 509 80 C520 114 497 139 470 147" />
        <path className="pvc-pulmonary-trunk" d="M278 190 C269 136 281 83 326 55 C351 39 379 46 397 66" />
        <path className="pvc-vena-cava" d="M166 58 L166 216 M156 316 L156 493" />
        <path className="pvc-right-atrium" d="M126 148 C84 177 88 291 132 324 C166 348 214 322 222 273 C229 226 214 166 173 145 C156 136 139 138 126 148 Z" />
        <path className="pvc-left-ventricle" d="M324 252 C354 205 414 209 454 248 C515 307 487 423 379 492 C362 503 348 508 338 511 C321 446 301 323 324 252 Z" />
        <path className="pvc-right-ventricle" d="M214 248 C166 271 166 380 227 441 C262 476 307 489 343 474 C356 411 350 318 314 260 C286 216 245 231 214 248 Z" />
        <path className="pvc-lv-outflow" d="M330 259 C337 220 348 190 373 167 C392 150 414 146 436 155" />
        <path className="pvc-rv-outflow" d="M258 257 C258 221 266 186 292 158 C311 137 331 128 352 126" />
        <path className="pvc-septum-line" d="M318 260 C300 326 315 425 338 511" />

        <g className="pvc-tricuspid-valve" aria-hidden="true"><path d="M204 256 Q222 274 240 256" /><path d="M240 256 Q258 274 276 256" /><path d="M276 256 Q290 270 304 258" /></g>
        <g className="pvc-mitral-valve" aria-hidden="true"><path d="M326 240 Q347 261 368 239" /><path d="M368 239 Q392 259 414 234" /></g>
        <path className="pvc-moderator-band" d="M232 371 C263 355 292 356 317 376" />

        <g className="pvc-anatomy-labels" aria-hidden="true">
          <text x="455" y="66">大動脈</text><text x="205" y="192">右房</text><text x="259" y="342">右室</text><text x="405" y="340">左室</text>
          <text x="285" y="112">右室流出路</text><text x="405" y="193">左室流出路</text><text x="228" y="294">三尖弁</text><text x="387" y="273">僧帽弁</text>
          <text x="240" y="401">調節帯</text><text x="362" y="514">心尖部</text>
        </g>
      </svg>

      <span className="pvc-view-badge">前面から心腔を開いた展開図</span>
      <span className="pvc-side-guide"><b>患者の右</b><i aria-hidden="true">←　→</i><b>患者の左</b></span>
      <span className="pvc-whole-heart-note">薄い青白＝心臓全体</span>

      {PVC_ORIGINS.map((origin) => (
        <button type="button" key={origin.id} className={`pvc-origin-marker pvc-marker-${origin.id} ${activeOriginId === origin.id ? 'is-active' : ''}`} aria-pressed={activeOriginId === origin.id} aria-label={`${origin.siteName}を選ぶ`} style={{ '--origin-color': origin.color } as React.CSSProperties} onClick={() => onSelect(origin.id)}>
          <span aria-hidden="true">{origin.markerNumber}</span><small>{origin.shortName}</small>
        </button>
      ))}
    </div>
  );
}
