import type { CSSProperties } from 'react';
import { PVC_ORIGINS, type PVCOriginId } from '@/app/domain/pvc';

type Props = { activeOriginId: PVCOriginId; onSelect: (id: PVCOriginId) => void };
const MARKERS: Record<PVCOriginId, readonly [number, number]> = {
  'right-upper-outer': [342, 247], 'right-upper-inner': [216, 500],
  'right-lower-outer': [151, 383], 'right-apex': [352, 564],
  'left-upper-outer': [378, 325], 'left-upper-inner': [558, 437],
  'left-lower-outer': [553, 353], 'left-apex': [467, 587],
};
const LABELS: Record<PVCOriginId, { y: number; lines: readonly string[] }> = {
  'right-upper-outer': { y: 285, lines: ['右室流出路'] },
  'right-lower-outer': { y: 445, lines: ['右室弁輪', '後壁・下壁'] },
  'right-upper-inner': { y: 555, lines: ['右室前壁', '心尖部寄り'] },
  'right-apex': { y: 675, lines: ['右室心尖部'] },
  'left-upper-outer': { y: 290, lines: ['左室流出路', '・弁輪前壁'] },
  'left-lower-outer': { y: 435, lines: ['僧帽弁輪後壁', '・下壁'] },
  'left-upper-inner': { y: 545, lines: ['左室前壁', '心尖部寄り'] },
  'left-apex': { y: 705, lines: ['左室心尖部'] },
};

export function PVCOriginDiagram({ activeOriginId, onSelect }: Props) {
  return (
    <div className="pvc-diagram">
      <div className="pvc-orientation"><span>患者の右</span><span>前壁を開いた展開模式図</span><span>患者の左</span></div>
      <div className="pvc-heart-viewport" role="region" aria-label="心臓図（狭い画面では左右にスクロールできます）" tabIndex={0}>
      <div className="pvc-heart-map">
        <svg className="pvc-heart-anatomy" viewBox="0 0 1000 800" role="img" aria-labelledby="pvc-heart-title pvc-heart-desc">
          <title id="pvc-heart-title">心腔・弁・流出路が連続する心臓の展開模式図</title>
          <g transform="translate(160 70)">
          <desc id="pvc-heart-desc">患者の右が画面左。右房から三尖弁を通じて右室、右室流出路から肺動脈弁と肺動脈へ続きます。左房から僧帽弁を通じて左室、僧帽弁と心室中隔の間の左室流出路から大動脈弁へ続きます。右室は前方、左室は後方と左縁に位置し、厚い左室壁が心臓の先端をつくります。調節帯は右室の中隔から前乳頭筋へ渡ります。破線の3と7は後壁・下壁の投影位置です。前壁を開き、奥の構造も見せた模式図で、一枚の断面ではありません。</desc>
          <path className="pvc-whole-heart" d="M294 159 C209 137 117 196 99 280 C76 389 153 502 289 559 C354 589 433 614 471 604 C553 567 609 472 611 370 C618 245 546 183 460 166 C404 143 347 154 294 159Z" />

          {/* Posterior vessels and left atrium, behind the outflow tracts. */}
          <g className="pvc-context-anatomy">
          <path className="pvc-tissue-right" d="M451 109 C394 94 318 95 247 111 L251 139 C321 123 390 123 446 138Z" />
          <path className="pvc-tissue-left" d="M529 243 L590 224 L598 247 L539 267 M537 279 L599 270 L602 294 L545 306" />
          <path className="pvc-tissue-left" d="M349 244 L404 257 L399 280 L345 267 M346 283 L401 295 L398 317 L342 306" />
          <path className="pvc-tissue-left" d="M404 231 C446 204 520 215 546 258 C563 288 548 324 520 346 L402 346 C382 314 382 257 404 231Z" />
          <path className="pvc-cavity" d="M413 246 C452 223 514 232 530 263 C544 291 525 315 508 328 L413 329 C399 303 398 266 413 246Z" />

          {/* Aortic root and arch are behind the pulmonary outflow. */}
          <path className="pvc-tissue-left" d="M312 322 C294 270 285 217 285 168 C282 108 307 68 346 63 C383 50 438 65 460 100 C476 125 479 162 484 199 L451 204 C447 168 446 139 433 119 C419 94 380 83 353 94 C324 99 321 132 322 168 C322 219 339 268 352 308Z" />
          <path className="pvc-tissue-left" d="M333 69 L326 38 L341 34 L351 65 M370 62 L371 29 L386 30 L387 65 M407 72 L420 42 L434 49 L423 81" />

          {/* Right atrium, SVC and IVC form one continuous cavity. */}
          <path className="pvc-tissue-right" d="M144 148 L184 148 L184 218 C211 222 239 242 251 270 C266 301 247 334 218 353 C189 370 173 376 158 380 L158 426 L126 426 L126 364 C103 339 103 300 112 267 C116 244 128 227 144 220Z" />
          <path className="pvc-cavity" d="M154 150 L174 150 L174 228 C205 230 229 250 241 274 C253 301 231 326 208 342 C182 359 165 364 148 368 L148 424 L136 424 L136 359 C112 333 114 299 122 271 C128 248 138 235 154 229Z" />

          {/* Thick LV wall; inlet and subaortic outlet share the same cavity. */}
          </g>
          <path className="pvc-tissue-left" d="M328 291 C392 299 425 315 481 313 C528 311 564 337 580 385 C615 483 528 585 467 604 C367 584 321 532 310 471 C285 401 294 329 328 291Z" />
          {/* One continuous cavity: the LVOT is not a blind-ended tube. */}
          <path className="pvc-cavity" d="M300 226 L322 224 C337 266 349 305 373 330 C387 344 399 347 415 345 C438 338 462 335 482 337 C518 337 537 358 548 392 C573 469 511 550 466 572 C435 553 398 511 379 456 C357 397 351 350 333 303 C318 267 307 243 300 226Z" />
          <g className="pvc-valve"><path d="M299 223 Q307 239 312 229 Q317 239 324 221" /></g>

          {/* The anterior RV wraps towards the LV, then rises into the RVOT. */}
          <path className="pvc-tissue-right" d="M215 333 C174 333 141 359 145 399 C151 463 235 537 340 566 C363 573 384 577 401 577 C368 542 344 502 327 455 C306 393 304 346 311 313 C320 271 356 227 395 194 L373 169 C328 202 291 248 278 284 C264 316 248 328 215 333Z" />
          <path className="pvc-cavity" d="M216 345 C183 346 154 365 158 396 C164 454 246 521 341 552 C350 555 357 557 366 558 C338 523 323 489 312 453 C291 391 290 345 298 310 C308 266 345 219 382 187 L382 184 C338 219 308 259 291 295 C277 329 251 342 216 345Z" />
          <g className="pvc-context-anatomy">
          <path className="pvc-tissue-right" d="M373 170 C395 153 408 130 420 113 C440 91 476 100 504 112 L534 124 L523 151 L492 138 C468 128 451 122 443 130 C429 148 415 174 395 194Z" />
          <path className="pvc-cavity" d="M382 176 C407 155 417 138 428 120 C444 104 476 112 498 121 L530 132 L527 141 L496 128 C469 116 447 111 435 126 C422 146 410 167 389 185Z" />
          </g>
          <g className="pvc-valve"><path d="M378 177 Q383 194 389 183 Q395 198 400 183" /></g>

          {/* Open AV junctions, with leaflets below: no solid wall across inflow. */}
          <path fill="white" d="M199 317 Q229 319 246 303 L281 332 L282 348 L194 349 L183 329Z" />
          <path fill="white" d="M413 306 L507 306 L508 346 L410 347Z" />
          {/* AV valves: tricuspid attachment is more apical than mitral. */}
          <g className="pvc-valve">
            <path d="M194 346 Q207 367 220 375 L231 353 M231 353 L249 377 Q267 368 282 345" />
            <path d="M410 339 Q421 363 432 376 L449 343 M449 343 L470 375 Q489 360 507 337" />
          </g>
          <g className="pvc-context-detail">
          <g className="pvc-chordae">
            <path d="M208 365 L225 430 L220 375 M249 377 L280 416 L269 361 M422 361 L432 458 L432 376 M470 375 L490 449 L492 354" />
            {/* Each mitral papillary muscle supports both leaflets. */}
            <path d="M432 376 L490 449 M470 375 L432 458" />
          </g>
          <path className="pvc-tissue-right" d="M226 497 L219 428 Q224 412 232 435 L263 517Z M300 484 L277 416 Q282 402 289 426 L317 499Z" />
          <path className="pvc-tissue-left" d="M400 516 C409 506 421 480 425 459 Q431 440 439 458 L441 530 Q428 549 423 548Z M549 481 L497 450 Q489 430 483 449 L501 550 L524 529Z" />
          <path className="pvc-moderator" d="M309 453 Q274 440 228 444" />
          <g className="pvc-trabeculae"><path d="M179 431 L204 453 M204 463 L233 482 M246 501 L265 504 M279 518 L298 521 M516 493 L528 479 M504 521 L515 506" /></g>
          </g>
          <path className="pvc-posterior-region" d="M160 361 Q154 398 200 421 M545 329 Q573 353 573 389" />

          <g className="pvc-anatomy-labels pvc-context-labels" aria-hidden="true">
            <text x="251" y="55">大動脈</text><path d="M277 59L309 87" />
            <text x="558" y="91">肺動脈</text><path d="M548 99L511 123" />
            <text x="101" y="150">上大静脈</text><path d="M112 156L144 170" />
            <text x="166" y="252">右房</text>
            <text x="464" y="286">左房</text>
            <text x="475" y="211">肺動脈弁</text><path d="M447 207L398 189" />
            <text x="249" y="207">大動脈弁</text><path d="M270 211L301 226" />
            <text x="96" y="435">下大静脈</text><path d="M115 426L131 407" />
            <text x="285" y="484">調節帯</text><path d="M281 468L272 447" />
            <text x="377" y="487">心室中隔</text><path d="M369 474L348 449" />
          </g>
          <g className="pvc-anatomy-labels" aria-hidden="true"><text x="205" y="402">右室</text><text x="464" y="420">左室</text></g>
          <g className="pvc-annulus-note" aria-hidden="true">
            <path d="M194 346 Q189 333 203 324" />
            <text x="182" y="290">三尖弁輪</text><text x="182" y="312">自由壁</text>
          </g>
          </g>
          {/* Labels and numbers share one control; small dots locate the broad regions. */}
          <g className="pvc-site-leaders" aria-hidden="true">
            {PVC_ORIGINS.map(origin => {
              const [x, y] = MARKERS[origin.id];
              const isRight = origin.ventricle === 'right';
              const start = isRight ? 250 : 750;
              return <g key={origin.id} className={activeOriginId === origin.id ? 'is-active' : ''} style={{ '--origin-color': origin.color } as CSSProperties}>
                <path d={`M${start} ${LABELS[origin.id].y} H${isRight ? 270 : 730} L${x + 160} ${y + 70}`} />
                <circle cx={x + 160} cy={y + 70} r={activeOriginId === origin.id ? 10 : 6} />
              </g>;
            })}
          </g>
        </svg>
        {PVC_ORIGINS.map(origin => {
          return <button key={origin.id} type="button" className={`pvc-origin-marker pvc-origin-callout ${origin.ventricle === 'right' ? 'on-left' : 'on-right'} ${origin.region === 'lower-outer' ? 'is-posterior' : ''} ${activeOriginId === origin.id ? 'is-active' : ''}`} style={{ top: `${LABELS[origin.id].y / 800 * 100}%`, '--origin-color': origin.color } as CSSProperties} onClick={() => onSelect(origin.id)} aria-pressed={activeOriginId === origin.id} aria-label={`${origin.markerNumber}：${origin.siteName}を選ぶ`}><span>{origin.markerNumber}</span><strong>{LABELS[origin.id].lines.map(line => <span key={line}>{line}</span>)}</strong></button>;
        })}
      </div>
      </div>
    </div>
  );
}
