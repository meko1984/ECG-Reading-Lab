import type { CSSProperties } from 'react';
import type { MirrorScenario } from '@/app/domain/mirror';

type MirrorPerspectiveDiagramProps = { scenario: MirrorScenario; view: number };

function InferiorView({ view }: MirrorPerspectiveDiagramProps) {
  const directFocus = 0.55 + (1 - view / 100) * 0.45;
  const oppositeFocus = 0.55 + (view / 100) * 0.45;
  return (
    <svg viewBox="0 0 640 500" role="img" aria-labelledby="mirror-diagram-title mirror-diagram-desc">
      <title id="mirror-diagram-title">下壁と反対側の誘導を示す心臓前面図</title>
      <desc id="mirror-diagram-desc">前面から見た簡略心臓図で、右房、右室、左室、心尖、下壁を示し、下壁側のⅡ、Ⅲ、aVFと反対側のⅠ、aVLを配置しています。</desc>
      <defs><marker id="mirror-arrow-inferior" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" className="mirror-arrow-head" /></marker></defs>
      <g className="mirror-orientation" aria-hidden="true"><text x="31" y="472">患者の右</text><text x="609" y="472">患者の左</text><path d="M88 466 H142 M552 466 H498" /></g>

      <g className="mirror-anatomical-heart">
        <path className="mirror-aorta" d="M344 151 C339 102 356 60 398 48 C438 37 466 65 459 106" />
        <path className="mirror-aorta-branch" d="M381 57 L375 25 M412 48 L415 17 M441 58 L455 32" />
        <path className="mirror-svc" d="M245 48 L248 166" />
        <path className="mirror-pulmonary" d="M309 167 C295 124 307 89 343 70 M316 117 C269 104 220 108 178 124 M319 119 C367 108 418 111 469 130" />
        <path className="mirror-heart-outline" d="M323 139 C281 105 225 124 198 174 C169 228 184 316 241 399 C274 446 313 470 339 481 C374 458 430 409 456 341 C486 263 466 191 426 158 C395 132 357 124 323 139 Z" />
        <path className="mirror-right-atrium" d="M207 153 C176 169 170 221 188 251 C205 279 243 273 263 247 C280 225 271 183 248 162 C236 151 219 147 207 153 Z" />
        <path className="mirror-left-atrium" d="M360 139 C391 118 429 132 438 162 C447 189 428 211 399 211 C373 211 352 190 349 164 C347 152 351 145 360 139 Z" />
        <path className="mirror-right-ventricle" d="M246 230 C280 194 330 193 364 224 C398 256 395 349 339 454 C292 429 247 387 220 329 C202 289 211 250 246 230 Z" />
        <path className="mirror-left-ventricle" d="M355 213 C397 190 438 220 450 275 C466 344 415 425 339 470 C359 400 370 332 365 275 C362 245 358 224 355 213 Z" />
        <path className="mirror-septum" d="M349 217 C359 274 357 362 339 456" />
        <path className="mirror-active-region" d="M233 372 C267 418 305 449 339 467 C380 443 413 407 437 367 C425 416 383 458 339 481 C295 463 257 422 233 372 Z" />
      </g>

      <g className="mirror-anatomy-labels" aria-hidden="true">
        <g><path d="M219 205 L109 191" /><text x="101" y="194">右房</text></g>
        <g><path d="M286 306 L115 303" /><text x="107" y="307">右室</text></g>
        <g><path d="M406 305 L520 289" /><text x="530" y="293">左室</text></g>
        <g><path d="M339 465 L501 420" /><text x="512" y="423">心尖</text></g>
        <g className="is-active"><path d="M337 430 L510 380" /><text x="522" y="383">下壁</text></g>
      </g>

      <g className="mirror-lead-group mirror-lead-opposite" style={{ opacity: oppositeFocus }}>
        <rect x="463" y="76" width="151" height="92" rx="20" /><text x="538" y="105">左上方から見る</text><text x="538" y="137" className="mirror-lead-names">Ⅰ・aVL</text><path d="M462 150 L404 205" markerEnd="url(#mirror-arrow-inferior)" />
      </g>
      <g className="mirror-lead-group mirror-lead-direct" style={{ opacity: directFocus }}>
        <rect x="24" y="366" width="170" height="92" rx="20" /><text x="109" y="395">下方から見る</text><text x="109" y="427" className="mirror-lead-names">Ⅱ・Ⅲ・aVF</text><path d="M194 386 L266 351" markerEnd="url(#mirror-arrow-inferior)" />
      </g>
    </svg>
  );
}

function PosteriorView({ view }: MirrorPerspectiveDiagramProps) {
  const directFocus = 0.55 + (1 - view / 100) * 0.45;
  const oppositeFocus = 0.55 + (view / 100) * 0.45;
  return (
    <svg viewBox="0 0 640 500" role="img" aria-labelledby="mirror-diagram-title mirror-diagram-desc">
      <title id="mirror-diagram-title">胸を上から見た後壁と前胸部誘導の位置関係</title>
      <desc id="mirror-diagram-desc">胸部の簡略横断図で、胸骨、脊椎、両肺、右室、左室、後壁を示し、胸の前のV1からV3と背中側のV7からV9を配置しています。</desc>
      <defs><marker id="mirror-arrow-posterior" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" className="mirror-arrow-head" /></marker></defs>
      <g className="mirror-section-orientation" aria-hidden="true"><text x="320" y="26">胸の前</text><path d="M320 34 V61" /><text x="320" y="484">背中</text><path d="M320 467 V440" /><text x="38" y="252">患者の右</text><text x="602" y="252">患者の左</text></g>
      <path className="mirror-torso-section" d="M320 57 C178 57 71 132 61 244 C51 359 164 438 320 442 C476 438 589 359 579 244 C569 132 462 57 320 57 Z" />
      <path className="mirror-right-lung" d="M112 211 C123 126 220 93 276 139 C307 165 293 219 267 264 C235 320 168 359 125 325 C96 301 105 258 112 211 Z" />
      <path className="mirror-left-lung" d="M528 211 C517 126 420 93 364 139 C333 165 347 219 373 264 C405 320 472 359 515 325 C544 301 535 258 528 211 Z" />
      <g className="mirror-thorax-bones" aria-hidden="true"><path className="mirror-sternum" d="M296 73 L320 62 L344 73 L340 108 L300 108 Z" /><circle className="mirror-spine" cx="320" cy="405" r="29" /><circle className="mirror-spine-center" cx="320" cy="405" r="10" /></g>
      <g className="mirror-heart-section">
        <path className="mirror-pericardium" d="M288 164 C344 135 412 176 421 245 C430 315 374 365 310 356 C253 348 216 296 228 236 C235 200 255 178 288 164 Z" />
        <path className="mirror-lv-ring" d="M326 202 C369 182 405 216 400 263 C396 307 354 332 317 310 C281 288 285 222 326 202 Z" />
        <path className="mirror-lv-cavity" d="M333 224 C358 212 379 231 376 260 C373 286 350 299 329 285 C308 271 309 235 333 224 Z" />
        <path className="mirror-rv-crescent" d="M276 185 C318 163 347 174 364 197 C327 187 293 216 289 258 C286 285 300 306 320 319 C278 318 249 288 250 245 C251 217 259 196 276 185 Z" />
        <path className="mirror-active-region" d="M304 304 C329 326 369 320 391 291 C383 326 353 348 319 344 C293 341 276 329 265 311 C279 318 293 316 304 304 Z" />
      </g>
      <g className="mirror-section-labels" aria-hidden="true">
        <text x="179" y="223">右肺</text><text x="461" y="223">左肺</text>
        <g><path d="M329 254 L465 252" /><text x="476" y="256">左室</text></g>
        <g><path d="M282 225 L171 279" /><text x="160" y="284">右室</text></g>
        <g className="is-active"><path d="M344 327 L462 343" /><text x="474" y="348">後壁</text></g>
        <g><path d="M337 89 L402 108" /><text x="413" y="113">胸骨</text></g><text x="320" y="410">脊椎</text>
      </g>

      <g className="mirror-electrodes mirror-electrodes-front" style={{ opacity: oppositeFocus }}>
        <path d="M279 92 C288 120 296 145 302 175" markerEnd="url(#mirror-arrow-posterior)" />
        <circle cx="248" cy="83" r="13" /><circle cx="281" cy="74" r="13" /><circle cx="314" cy="72" r="13" />
        <text x="275" y="43">V1・V2・V3</text><text x="221" y="116">前胸部誘導</text>
      </g>
      <g className="mirror-electrodes mirror-electrodes-back" style={{ opacity: directFocus }}>
        <path d="M389 411 C371 382 361 353 359 330" markerEnd="url(#mirror-arrow-posterior)" />
        <circle cx="390" cy="420" r="13" /><circle cx="424" cy="409" r="13" /><circle cx="456" cy="393" r="13" />
        <text x="485" y="447">V7・V8・V9</text><text x="510" y="381">後壁誘導</text>
      </g>
    </svg>
  );
}

export function MirrorPerspectiveDiagram({ scenario, view }: MirrorPerspectiveDiagramProps) {
  const style = { '--mirror-color': scenario.color } as CSSProperties;
  return (
    <figure className={`mirror-perspective is-${scenario.id}`} style={style}>
      {scenario.id === 'posterior' ? <PosteriorView scenario={scenario} view={view} /> : <InferiorView scenario={scenario} view={view} />}
      <figcaption>{scenario.id === 'posterior' ? '胸を頭側から見下ろした簡略横断図' : '心臓を前から見た簡略解剖図'}</figcaption>
    </figure>
  );
}
