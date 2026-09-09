import type { PACOriginId } from './pac.ts';

// Opened/projection teaching geometry, not a scaled section or a clinical map.
// Separate vessels and appendages make marker-to-structure checks possible.
export const PAC_ANATOMY = {
  rightAtrium: 'M350 170 L392 170 C398 204 437 211 456 247 C476 286 474 369 461 416 C449 449 411 466 388 458 L388 508 Q365 516 344 506 L344 446 C319 415 319 378 322 337 L327 249 Q326 201 350 170Z',
  svc: 'M350 95 Q371 88 392 95 L392 185 L350 185Z',
  ivc: 'M344 449 L388 449 L388 508 Q365 516 344 506Z',
  rightAppendage: 'M391 205 C412 185 432 169 471 153 Q482 172 471 188 Q491 194 470 211 Q480 226 457 235 L443 252 Q414 253 397 236Z',
  leftAtrium: 'M502 216 C541 191 612 196 652 224 C678 243 690 283 687 325 C693 367 678 401 648 420 C603 447 537 442 502 413 C480 391 475 350 480 310 C474 270 483 238 502 216Z',
  leftAppendage: 'M635 236 C651 222 655 202 670 185 Q684 170 697 183 Q707 197 692 207 Q718 211 702 228 Q711 241 691 247 L667 267Z',
  rightSuperiorPv: 'M287 259 C369 253 449 256 514 268 L526 298 C440 285 366 282 287 289Z',
  rightInferiorPv: 'M287 349 C363 347 434 348 500 358 L519 389 C435 378 363 378 287 379Z',
  leftSuperiorPv: 'M669 260 Q704 246 735 249 L735 278 Q704 277 678 292Z',
  leftInferiorPv: 'M679 348 Q707 355 735 351 L735 380 Q706 386 672 377Z',
  coronarySinus: 'M417 408 C471 470 600 482 666 446',
  sinusNode: 'M346 174 Q348 163 355 164 Q365 171 359 183 L350 194 Q342 192 346 174Z',
} as const;

type Site = { x: number; y: number; row: number; side: 'left' | 'right'; structure: keyof typeof PAC_ANATOMY };
export const PAC_ANATOMY_SITES: Record<PACOriginId, Site> = {
  'sinus-node': { x: 352, y: 178, row: 200, side: 'left', structure: 'sinusNode' },
  'right-atrial-appendage': { x: 452, y: 197, row: 310, side: 'left', structure: 'rightAppendage' },
  'left-atrial-appendage': { x: 684, y: 218, row: 130, side: 'right', structure: 'leftAppendage' },
  'left-superior-pv': { x: 705, y: 269, row: 280, side: 'right', structure: 'leftSuperiorPv' },
  'left-inferior-pv': { x: 705, y: 366, row: 430, side: 'right', structure: 'leftInferiorPv' },
  'right-superior-pv': { x: 309, y: 273, row: 420, side: 'left', structure: 'rightSuperiorPv' },
  'right-inferior-pv': { x: 309, y: 364, row: 530, side: 'left', structure: 'rightInferiorPv' },
  'cs-ostium': { x: 417, y: 408, row: 580, side: 'right', structure: 'coronarySinus' },
  svc: { x: 371, y: 131, row: 90, side: 'left', structure: 'svc' },
};
