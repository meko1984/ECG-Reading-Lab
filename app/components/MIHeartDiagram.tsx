import type { MITerritoryId } from '@/app/domain/mi';

type MIHeartDiagramProps = { activeId: MITerritoryId; color: string };

export function MIHeartDiagram({ activeId, color }: MIHeartDiagramProps) {
  return (
    <figure className="mi-heart-figure">
      <svg viewBox="0 0 460 390" role="img" aria-labelledby="mi-heart-title mi-heart-desc">
        <title id="mi-heart-title">心筋梗塞の領域を示す心臓断面の独自模式図</title>
        <desc id="mi-heart-desc">前面から見た心臓の簡易図に、中隔、前壁、側壁、下壁、後壁、右室の選択領域を色で示します。</desc>
        <path className="mi-heart-shadow" d="M230 64 C157 16 65 65 59 163 C53 258 131 343 226 371 C296 350 395 278 401 172 C406 79 326 29 230 64 Z" />
        <path className="mi-heart-rv" style={activeId === 'right-ventricle' ? { fill: color } : undefined} d="M211 134 C151 105 91 145 101 220 C110 285 165 332 226 351 C237 298 240 221 211 134 Z" />
        <path className="mi-heart-lv" d="M224 132 C281 91 354 127 362 203 C370 277 306 337 226 366 C210 286 205 203 224 132 Z" />
        <path className={`mi-territory mi-territory-septal ${activeId === 'septal' ? 'is-active' : ''}`} style={activeId === 'septal' ? { fill: color } : undefined} d="M211 134 C226 168 236 228 226 351 L258 337 C249 269 248 196 262 122 C246 119 232 123 224 132 Z" />
        <path className={`mi-territory mi-territory-anterior ${activeId === 'anterior' ? 'is-active' : ''}`} style={activeId === 'anterior' ? { fill: color } : undefined} d="M262 122 C302 111 338 139 352 176 C337 189 321 207 309 229 C288 269 278 313 274 330 L258 337 C249 269 248 196 262 122 Z" />
        <path className={`mi-territory mi-territory-lateral ${activeId === 'lateral' ? 'is-active' : ''}`} style={activeId === 'lateral' ? { fill: color } : undefined} d="M352 176 C376 239 336 302 274 330 C278 313 288 269 309 229 C321 207 337 189 352 176 Z" />
        <path className={`mi-territory mi-territory-inferior ${activeId === 'inferior' ? 'is-active' : ''}`} style={activeId === 'inferior' ? { fill: color } : undefined} d="M226 351 C257 341 284 327 307 310 C299 337 272 355 226 371 C184 358 153 341 129 318 C156 335 189 347 226 351 Z" />
        <path className={`mi-territory mi-territory-posterior ${activeId === 'posterior' ? 'is-active' : ''}`} style={activeId === 'posterior' ? { fill: color } : undefined} d="M224 132 C259 107 311 106 339 141 C322 137 300 141 284 157 C264 177 258 207 257 238 C251 194 251 154 262 122 C246 119 232 123 224 132 Z" />
        <path className="mi-septum-line" d="M211 134 C230 190 239 277 226 351" />
        <path className="mi-vessel mi-aorta" d="M260 126 C257 84 276 47 318 40 C354 34 379 58 377 88" />
        <path className="mi-vessel mi-pulmonary" d="M203 133 C195 89 211 55 247 42" />
        <g className="mi-heart-labels" aria-hidden="true"><text x="155" y="211">右室</text><text x="292" y="236">左室</text><text x="229" y="254">中隔</text></g>
        {activeId === 'posterior' && <g className="mi-posterior-note"><path d="M300 132 L346 104" /><text x="351" y="100">後面側</text></g>}
      </svg>
      <figcaption><span className="mi-map-dot" style={{ background: color }} />色の部分が、選択中の代表領域</figcaption>
    </figure>
  );
}
