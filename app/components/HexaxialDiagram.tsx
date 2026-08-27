import type { AxisResult } from '@/app/domain/axis';

type HexaxialDiagramProps = {
  result: AxisResult;
};

const CENTER = 180;
const RADIUS = 133;
const coordinate = (value: number) => Math.round(value * 1_000_000) / 1_000_000;

const polar = (angle: number, radius = RADIUS): [number, number] => {
  const radians = angle * Math.PI / 180;
  return [
    coordinate(CENTER + Math.cos(radians) * radius),
    coordinate(CENTER + Math.sin(radians) * radius),
  ];
};

const sectorPath = (start: number, end: number) => {
  const [startX, startY] = polar(start);
  const [endX, endY] = polar(end);
  const largeArc = end - start > 180 ? 1 : 0;
  return `M ${CENTER} ${CENTER} L ${startX} ${startY} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${endX} ${endY} Z`;
};

const axisLines = [
  { angle: 0, label: 'Ⅰ', labelAngle: 0 },
  { angle: 60, label: 'Ⅱ', labelAngle: 60 },
  { angle: 120, label: 'Ⅲ', labelAngle: 120 },
  { angle: 90, label: 'aVF', labelAngle: 90 },
  { angle: -30, label: 'aVL', labelAngle: -30 },
  { angle: -150, label: 'aVR', labelAngle: -150 },
];

export function HexaxialDiagram({ result }: HexaxialDiagramProps) {
  const magnitude = Math.hypot(result.x, result.y);
  const scale = magnitude <= 0.05 ? 0 : Math.min(RADIUS * 0.78 / magnitude, RADIUS * 0.7 / 12);
  const vectorEnd: [number, number] = [
    coordinate(CENTER + result.x * scale),
    coordinate(CENTER + result.y * scale),
  ];
  const leadIPoint: [number, number] = [coordinate(CENTER + result.leadI * scale), CENTER];
  const leadIIAngle = Math.PI / 3;
  const leadIIPoint: [number, number] = [
    coordinate(CENTER + Math.cos(leadIIAngle) * result.leadII * scale),
    coordinate(CENTER + Math.sin(leadIIAngle) * result.leadII * scale),
  ];

  return (
    <svg
      className="axis-diagram"
      viewBox="0 0 360 360"
      role="img"
      aria-label={`六軸基準座標。計算された電気軸は${result.angleDegrees.toFixed(1)}度です`}
    >
      <defs>
        <marker id="axis-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M 0 0 L 8 4 L 0 8 Z" fill="#0a1f57" />
        </marker>
      </defs>

      <path className="sector sector-normal" d={sectorPath(-30, 90)} />
      <path className="sector sector-right" d={sectorPath(90, 180)} />
      <path className="sector sector-extreme" d={sectorPath(180, 270)} />
      <path className="sector sector-left" d={sectorPath(270, 330)} />
      <circle className="axis-ring" cx={CENTER} cy={CENTER} r={RADIUS} />

      {axisLines.map(({ angle, label, labelAngle }) => {
        const [x1, y1] = polar(angle, RADIUS + 4);
        const [x2, y2] = polar(angle + 180, RADIUS + 4);
        const [labelX, labelY] = polar(labelAngle, RADIUS + 25);
        return (
          <g key={label}>
            <line className="axis-line" x1={x1} y1={y1} x2={x2} y2={y2} />
            <text className="axis-label" x={labelX} y={labelY}>{label}</text>
          </g>
        );
      })}

      <line className="projection-line" x1={leadIPoint[0]} y1={leadIPoint[1]} x2={vectorEnd[0]} y2={vectorEnd[1]} />
      <line className="projection-line" x1={leadIIPoint[0]} y1={leadIIPoint[1]} x2={vectorEnd[0]} y2={vectorEnd[1]} />
      <circle className="projection-point" cx={leadIPoint[0]} cy={leadIPoint[1]} r="4" />
      <circle className="projection-point" cx={leadIIPoint[0]} cy={leadIIPoint[1]} r="4" />
      {magnitude > 0.05 && (
        <line
          className="result-vector"
          x1={CENTER}
          y1={CENTER}
          x2={vectorEnd[0]}
          y2={vectorEnd[1]}
          markerEnd="url(#axis-arrow)"
        />
      )}
      <circle className="axis-origin" cx={CENTER} cy={CENTER} r="5" />
      {magnitude <= 0.05 && (
        <text className="zero-vector-label" x={CENTER} y={CENTER - 14}>正味QRSが0</text>
      )}
    </svg>
  );
}
