import type { CSSProperties } from 'react';
import { PAC_ORIGINS, type PACOriginId } from '@/app/domain/pac';
import { PAC_ANATOMY as anatomy, PAC_ANATOMY_SITES as sites } from '@/app/domain/pac-anatomy';

type Props = { activeOriginId: PACOriginId; onSelect: (id: PACOriginId) => void };

export function PACOriginDiagram({ activeOriginId, onSelect }: Props) {
  return <div className="pac-diagram">
    <div className="pac-diagram-orientation"><span>患者の右</span><span>心房の展開模式図</span><span>患者の左</span></div>
    <div className="pac-diagram-viewport" role="region" aria-label="心房図（狭い画面では左右にスクロールできます）" tabIndex={0}>
      <div className="pac-diagram-map">
        <svg className="pac-diagram-image" viewBox="0 0 1000 640" role="img" aria-labelledby="pac-anatomy-title pac-anatomy-desc">
          <title id="pac-anatomy-title">心房の起源と心臓全体の位置関係</title>
          <desc id="pac-anatomy-desc">前方の右房を開き、後方の左房と肺静脈を透視・展開して示す学習図です。一方向の実際の断面ではありません。上下大静脈と冠静脈洞は右房へ、左右4本の肺静脈は左房へ続きます。右肺静脈の右房に隠れる区間は破線です。左右の心耳はそれぞれの心房から前方へ突出し、洞結節付近は上大静脈と右房の接合部外側です。冠静脈洞入口部は右房の下後方・中隔寄り。心臓全体と弁などは淡く示し、点は大まかな起源位置で臨床的な一点を特定しません。</desc>
          <defs>
            <clipPath id="pac-ra-clip"><path d={anatomy.rightAtrium} /></clipPath>
          </defs>

          {/* Context is deliberately subordinate to the atrial origin structures. */}
          <g className="pac-anatomy-context" aria-hidden="true">
            <path d="M356 201 C319 234 298 306 319 402 C346 495 476 572 617 590 C681 562 728 490 738 401 C750 291 685 229 625 201 C530 166 424 168 356 201Z" />
            <path d="M509 208 C500 173 479 118 502 84 C527 48 591 51 616 81 C642 108 635 150 650 184 L617 193 C604 156 617 119 594 103 C575 88 547 84 533 105 C520 129 539 174 544 202Z" />
            <path d="M528 71 L521 40 L537 38 L548 66 M557 62 L559 30 L576 30 L577 66 M590 68 L608 41 L622 51 L608 79" />
            <path d="M356 444 Q451 502 530 520 Q574 547 617 590 M548 453 Q584 469 635 462" />
          </g>

          {/* All four pulmonary veins terminate in the posterior left atrium. */}
          <g className="pac-anatomy-left">
            <path data-anatomy="rightSuperiorPv" d={anatomy.rightSuperiorPv} />
            <path data-anatomy="rightInferiorPv" d={anatomy.rightInferiorPv} />
            <path data-anatomy="leftSuperiorPv" d={anatomy.leftSuperiorPv} />
            <path data-anatomy="leftInferiorPv" d={anatomy.leftInferiorPv} />
            <path data-anatomy="leftAtrium" d={anatomy.leftAtrium} />
            {/* Open junctions: no septal line at the venous mouths. */}
            <path className="pac-open-junction" d="M506 272 L524 289 M497 363 L514 380 M677 271 L680 285 M681 354 L677 374" />
          </g>

          <g className="pac-anatomy-right">
            <path data-anatomy="svc" d={anatomy.svc} />
            <path data-anatomy="rightAtrium" d={anatomy.rightAtrium} />
            <path data-anatomy="ivc" d={anatomy.ivc} className="pac-unoutlined-tissue" />
            <path className="pac-open-junction" d="M354 171 H388" />
          </g>

          {/* A transparent projection of the hidden right PVs, not RA openings. */}
          <g className="pac-hidden-pv" clipPath="url(#pac-ra-clip)" aria-hidden="true">
            <path d={anatomy.rightSuperiorPv} /><path d={anatomy.rightInferiorPv} />
          </g>

          {/* Anterior appendages attach to their own atrium, not to a vein. */}
          <g className="pac-anatomy-right">
            <path data-anatomy="rightAppendage" d={anatomy.rightAppendage} />
            <path className="pac-appendage-fold" d="M417 210 L451 174 M427 222 L467 195 M439 235 L465 215" />
          </g>
          <g className="pac-anatomy-left">
            <path data-anatomy="leftAppendage" d={anatomy.leftAppendage} />
            <path className="pac-appendage-fold" d="M658 238 L683 195 M673 244 L695 221" />
          </g>
          <path className="pac-sinus-node" data-anatomy="sinusNode" d={anatomy.sinusNode} />

          {/* CS follows the posterior AV groove and opens into low septal RA. */}
          <path className="pac-coronary-tributary" d="M666 446 C685 478 676 515 647 545 M526 457 Q527 500 559 534" aria-hidden="true" />
          <path className="pac-coronary-outline" d={anatomy.coronarySinus} />
          <path className="pac-coronary-sinus" data-anatomy="coronarySinus" d={anatomy.coronarySinus} />
          <ellipse className="pac-coronary-ostium" cx="417" cy="408" rx="12" ry="17" transform="rotate(-28 417 408)" />
          <g className="pac-anatomy-landmarks" aria-hidden="true">
            <ellipse cx="442" cy="436" rx="24" ry="13" transform="rotate(25 442 436)" />
            <path d="M539 416 Q587 391 621 421 Q590 449 539 416Z" />
          </g>
          <g className="pac-diagram-context-labels" aria-hidden="true">
            <text x="386" y="325">右房</text><text x="579" y="327">左房</text>
            <text x="363" y="542">下大静脈</text><text x="614" y="559">心臓全体</text>
            <text x="451" y="489">三尖弁</text><text x="586" y="397">僧帽弁</text>
          </g>
          <g className="pac-diagram-leaders" aria-hidden="true">
            {PAC_ORIGINS.map(origin => {
              const site = sites[origin.id];
              const { x, y } = site;
              const left = site.side === 'left';
              return <g key={origin.id} className={activeOriginId === origin.id ? 'is-active' : ''} style={{ '--origin-color': origin.color } as CSSProperties}>
                <path d={`M${left ? 250 : 750} ${site.row} H${left ? 270 : 730} L${x} ${y}`} />
                <circle data-origin={origin.id} data-structure={site.structure} cx={x} cy={y} r={activeOriginId === origin.id ? 10 : 6} />
              </g>;
            })}
          </g>
        </svg>
        {PAC_ORIGINS.map(origin => {
          const site = sites[origin.id];
          return <button key={origin.id} type="button" className={`pac-origin-marker pac-origin-callout on-${site.side} ${activeOriginId === origin.id ? 'is-active' : ''}`} style={{ top: `${site.row / 640 * 100}%`, '--origin-color': origin.color } as CSSProperties} onClick={() => onSelect(origin.id)} aria-label={`${origin.siteName}を選ぶ`} aria-pressed={activeOriginId === origin.id}>
            <span aria-hidden="true">{origin.markerNumber}</span><strong>{origin.siteName}</strong>
          </button>;
        })}
      </div>
    </div>
  </div>;
}
