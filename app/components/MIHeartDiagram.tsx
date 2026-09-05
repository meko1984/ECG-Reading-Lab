import type { MITerritoryId } from '@/app/domain/mi';

type MIHeartDiagramProps = { activeId: MITerritoryId; color: string };
type CoronaryId = 'lmt' | 'lad' | 'lcx' | 'rca' | 'diagonal';

const activeCoronaries: Record<MITerritoryId, CoronaryId[]> = {
  septal: ['lad'],
  anterior: ['lad'],
  lateral: ['lcx', 'diagonal'],
  inferior: ['rca', 'lcx'],
  posterior: ['rca', 'lcx'],
  'right-ventricle': ['rca'],
};

function vesselClass(id: CoronaryId, activeId: MITerritoryId): string {
  return `mi-coronary mi-coronary-${id} ${activeCoronaries[activeId].includes(id) ? 'is-active' : ''}`;
}

export function MIHeartDiagram({ activeId, color }: MIHeartDiagramProps) {
  const vesselStyle = { '--mi-color': color } as React.CSSProperties;

  return (
    <figure className="mi-heart-figure" style={vesselStyle}>
      <svg viewBox="0 0 640 535" role="img" aria-labelledby="mi-heart-title mi-heart-desc">
        <title id="mi-heart-title">冠動脈の走行と心筋梗塞の代表領域を示す独自模式図</title>
        <desc id="mi-heart-desc">心臓を前面から見た図。左冠動脈主幹部から左前下行枝と左回旋枝が分かれ、右冠動脈が右房と右室の間を走ります。選択した心筋領域と代表的な責任冠動脈候補を色で強調します。</desc>

        <defs>
          <linearGradient id="mi-myocardium" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f7c2b6" /><stop offset="1" stopColor="#e98f8a" /></linearGradient>
          <linearGradient id="mi-rv-surface" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f3b5ab" /><stop offset="1" stopColor="#e59591" /></linearGradient>
          <linearGradient id="mi-atrium" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#efb4aa" /><stop offset="1" stopColor="#df8b86" /></linearGradient>
          <filter id="mi-active-glow" x="-40%" y="-40%" width="180%" height="180%"><feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={color} floodOpacity="0.65" /></filter>
        </defs>

        <g className="mi-great-vessels" aria-hidden="true">
          <path className="mi-aortic-arch" d="M338 141 C334 88 351 44 397 34 C446 23 479 56 474 101" />
          <path className="mi-aortic-branch" d="M382 43 L376 12 M415 35 L419 7 M448 43 L462 18" />
          <path className="mi-svc" d="M241 34 L244 161" />
          <path className="mi-pulmonary-trunk" d="M305 151 C292 105 304 68 344 50" />
          <path className="mi-pulmonary-left" d="M319 105 C363 92 421 91 488 101" />
          <path className="mi-pulmonary-right" d="M301 100 C255 86 206 88 167 99" />
        </g>

        <path className="mi-heart-silhouette" d="M315 123 C267 88 211 103 181 153 C148 209 161 310 222 404 C264 468 328 502 370 516 C412 489 474 431 493 351 C513 266 490 184 452 151 C416 119 365 106 315 123 Z" />
        <path className="mi-left-atrium-surface" d="M360 118 C397 91 445 105 459 139 C471 169 450 199 417 202 C389 205 361 183 352 154 C347 138 350 127 360 118 Z" />
        <path className="mi-right-atrium-surface" d="M185 137 C150 150 139 207 156 244 C172 278 216 278 241 251 C261 229 260 184 237 156 C223 139 201 131 185 137 Z" />
        <path className="mi-right-ventricle-surface" d="M235 221 C274 181 337 182 376 223 C414 263 409 366 370 491 C310 459 252 408 216 337 C196 298 190 257 207 236 C215 227 225 222 235 221 Z" />
        <path className="mi-left-ventricle-surface" d="M363 198 C409 178 462 209 481 272 C505 351 450 453 370 507 C390 433 401 348 390 276 C384 239 375 213 363 198 Z" />

        <g className="mi-territory-layer" aria-hidden="true">
          <path className={`mi-surface-territory ${activeId === 'septal' ? 'is-active' : ''}`} style={activeId === 'septal' ? { fill: color } : undefined} d="M331 197 C350 204 368 226 377 260 C386 306 381 386 369 476 C346 437 327 379 321 316 C317 264 320 222 331 197 Z" />
          <path className={`mi-surface-territory ${activeId === 'anterior' ? 'is-active' : ''}`} style={activeId === 'anterior' ? { fill: color } : undefined} d="M271 201 C294 187 318 189 331 197 C321 230 317 269 321 316 C327 379 346 437 369 476 C316 453 265 402 237 340 C215 291 224 235 271 201 Z" />
          <path className={`mi-surface-territory ${activeId === 'lateral' ? 'is-active' : ''}`} style={activeId === 'lateral' ? { fill: color } : undefined} d="M378 210 C419 182 465 215 480 272 C500 345 449 440 371 493 C391 423 405 350 395 281 C390 248 383 224 378 210 Z" />
          <path className={`mi-surface-territory ${activeId === 'inferior' ? 'is-active' : ''}`} style={activeId === 'inferior' ? { fill: color } : undefined} d="M244 392 C278 438 327 476 370 497 C409 469 442 432 465 390 C449 447 410 489 370 510 C322 491 275 448 244 392 Z" />
          <path className={`mi-surface-territory ${activeId === 'right-ventricle' ? 'is-active' : ''}`} style={activeId === 'right-ventricle' ? { fill: color } : undefined} d="M212 240 C242 207 286 195 319 214 C309 251 311 302 321 353 C329 401 347 449 368 482 C310 456 258 407 226 345 C204 303 196 261 212 240 Z" />
        </g>

        <g className="mi-chamber-labels" aria-hidden="true"><text x="191" y="207">右房</text><text x="279" y="321">右室</text><text x="430" y="309">左室</text><text x="407" y="161">左房</text></g>

        <g className={vesselClass('lmt', activeId)}><path d="M350 139 C337 149 329 158 325 170" /></g>
        <g className={vesselClass('lad', activeId)} filter={activeCoronaries[activeId].includes('lad') ? 'url(#mi-active-glow)' : undefined}>
          <path d="M325 170 C331 227 337 297 345 361 C351 416 361 462 370 501" />
          <path className="mi-coronary-branch" d="M332 231 C304 245 281 261 259 286 M338 279 C365 292 390 308 411 330 M344 344 C315 356 291 373 270 397" />
        </g>
        <g className={vesselClass('diagonal', activeId)} filter={activeCoronaries[activeId].includes('diagonal') ? 'url(#mi-active-glow)' : undefined}><path d="M331 226 C373 243 407 269 438 302 M339 293 C381 319 412 350 434 385" /></g>
        <g className={vesselClass('lcx', activeId)} filter={activeCoronaries[activeId].includes('lcx') ? 'url(#mi-active-glow)' : undefined}>
          <path d="M325 170 C358 171 394 178 426 197 C444 208 456 224 463 241" />
          <path className="mi-coronary-branch" d="M409 188 C427 234 438 276 438 319 M438 208 C461 244 470 282 469 319" />
        </g>
        <g className={vesselClass('rca', activeId)} filter={activeCoronaries[activeId].includes('rca') ? 'url(#mi-active-glow)' : undefined}>
          <path d="M309 151 C282 160 254 173 231 194 C209 215 193 246 190 279 C189 312 201 347 224 381 C250 418 285 447 329 466" />
          <path className="mi-coronary-branch" d="M223 203 C220 240 228 269 246 293 M194 267 C215 290 230 313 239 341 M207 350 C225 354 244 362 261 376" />
        </g>

        <g className="mi-vessel-callouts" aria-hidden="true">
          <g className="mi-callout mi-callout-lmt"><path d="M324 166 L143 126" /><rect x="8" y="92" width="146" height="58" rx="12" /><text x="20" y="115"><tspan>左冠動脈主幹部</tspan><tspan x="20" dy="22">LMT</tspan></text></g>
          <g className="mi-callout mi-callout-rca"><path d="M214 218 L139 226" /><rect x="8" y="198" width="142" height="58" rx="12" /><text x="20" y="221"><tspan>右冠動脈</tspan><tspan x="20" dy="22">RCA</tspan></text></g>
          <g className="mi-callout mi-callout-lcx"><path d="M390 182 L493 144" /><rect x="484" y="107" width="148" height="64" rx="12" /><text x="496" y="132"><tspan>左回旋枝</tspan><tspan x="496" dy="22">LCx</tspan></text></g>
          <g className="mi-callout mi-callout-lad"><path d="M342 286 L492 259" /><rect x="484" y="232" width="148" height="64" rx="12" /><text x="496" y="257"><tspan>左前下行枝</tspan><tspan x="496" dy="22">LAD</tspan></text></g>
        </g>

        <g className="mi-orientation" aria-hidden="true"><text x="12" y="510">患者の右</text><path d="M80 504 H132" /><path d="M80 504 l12 -7 M80 504 l12 7" /><text x="490" y="510">患者の左</text><path d="M472 504 H420" /><path d="M472 504 l-12 -7 M472 504 l-12 7" /></g>

        {activeId === 'posterior' && <g className="mi-posterior-inset" aria-hidden="true">
          <rect x="472" y="338" width="156" height="142" rx="16" /><text x="550" y="362">後面から見た補助図</text>
          <path className="mi-posterior-heart" d="M550 383 C519 361 489 390 494 422 C498 448 525 465 550 474 C577 464 605 444 606 414 C607 385 580 365 550 383 Z" />
          <path className="mi-posterior-highlight" style={{ fill: color }} d="M550 383 C579 365 606 385 606 414 C605 444 577 464 550 474 C559 439 560 408 550 383 Z" /><text x="550" y="427">後壁</text>
        </g>}
      </svg>
      <figcaption><span><i className="mi-map-dot" style={{ background: color }} />色の部分＝選択中の心筋領域</span><span><i className="mi-vessel-key" style={{ background: color }} />太い血管＝代表的な責任血管候補</span></figcaption>
      <div className="mi-vessel-list" aria-label="図に示した冠動脈">
        <span className="mi-vessel-lmt"><b>LMT</b>左冠動脈主幹部</span>
        <span className={`mi-vessel-lad ${activeCoronaries[activeId].includes('lad') ? 'is-active' : ''}`}><b>LAD</b>左前下行枝</span>
        <span className={`mi-vessel-lcx ${activeCoronaries[activeId].includes('lcx') ? 'is-active' : ''}`}><b>LCx</b>左回旋枝</span>
        <span className={`mi-vessel-rca ${activeCoronaries[activeId].includes('rca') ? 'is-active' : ''}`}><b>RCA</b>右冠動脈</span>
      </div>
    </figure>
  );
}
