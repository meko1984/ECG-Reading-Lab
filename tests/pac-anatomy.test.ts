import assert from 'node:assert/strict';
import test from 'node:test';
import { PAC_ORIGINS } from '../app/domain/pac.ts';
import { PAC_ANATOMY, PAC_ANATOMY_SITES } from '../app/domain/pac-anatomy.ts';

type Point = { x: number; y: number };

// Test-only flattening of the absolute M/L/C/Q/Z geometry used in this diagram.
// This checks drawing regressions, not the clinical validity of the anatomy.
function polygon(path: string): Point[] {
  const tokens = path.match(/[A-Za-z]|-?\d+(?:\.\d+)?/g)!;
  const points: Point[] = [];
  let i = 0;
  let p: Point = { x: 0, y: 0 };
  const next = (): Point => ({ x: Number(tokens[i++]), y: Number(tokens[i++]) });
  while (i < tokens.length) {
    const command = tokens[i++];
    if (command === 'Z') break;
    if (command === 'M' || command === 'L') {
      p = next();
      points.push(p);
    } else if (command === 'Q' || command === 'C') {
      const start = p;
      const a = next();
      const b = next();
      const end = command === 'C' ? next() : b;
      for (let step = 1; step <= 40; step++) {
        const t = step / 40;
        const u = 1 - t;
        p = command === 'C'
          ? { x: u ** 3 * start.x + 3 * u ** 2 * t * a.x + 3 * u * t ** 2 * b.x + t ** 3 * end.x,
              y: u ** 3 * start.y + 3 * u ** 2 * t * a.y + 3 * u * t ** 2 * b.y + t ** 3 * end.y }
          : { x: u ** 2 * start.x + 2 * u * t * a.x + t ** 2 * end.x,
              y: u ** 2 * start.y + 2 * u * t * a.y + t ** 2 * end.y };
        points.push(p);
      }
    } else {
      throw new Error(`Unsupported SVG command: ${command}`);
    }
  }
  return points;
}

function inside(path: string, p: Point): boolean {
  const vertices = polygon(path);
  let result = false;
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const a = vertices[i];
    const b = vertices[j];
    if ((a.y > p.y) !== (b.y > p.y) && p.x < (b.x - a.x) * (p.y - a.y) / (b.y - a.y) + a.x) result = !result;
  }
  return result;
}

test('PAC diagram maps all nine origins to their named anatomical structures', () => {
  assert.deepEqual(Object.keys(PAC_ANATOMY_SITES).sort(), PAC_ORIGINS.map(o => o.id).sort());
  for (const origin of PAC_ORIGINS) {
    const site = PAC_ANATOMY_SITES[origin.id];
    if (origin.id === 'cs-ostium') {
      assert.deepEqual(polygon(PAC_ANATOMY.coronarySinus)[0], { x: site.x, y: site.y });
      assert.ok(inside(PAC_ANATOMY.rightAtrium, site), 'CS opens within RA');
    } else {
      assert.ok(inside(PAC_ANATOMY[site.structure], site), `${origin.id} marker must lie on ${site.structure}`);
    }
  }
});

test('the four pulmonary vein paths join LA, while caval paths join RA', () => {
  for (const [structure, point] of [
    ['rightSuperiorPv', { x: 513, y: 285 }], ['rightInferiorPv', { x: 503, y: 373 }],
    ['leftSuperiorPv', { x: 681, y: 280 }], ['leftInferiorPv', { x: 680, y: 365 }],
  ] as const) {
    assert.ok(inside(PAC_ANATOMY[structure], point), `${structure} reaches its LA junction`);
    assert.ok(inside(PAC_ANATOMY.leftAtrium, point), `${structure} junction lies in LA`);
  }
  for (const [structure, point] of [['svc', { x: 371, y: 178 }], ['ivc', { x: 365, y: 475 }]] as const) {
    assert.ok(inside(PAC_ANATOMY[structure], point));
    assert.ok(inside(PAC_ANATOMY.rightAtrium, point));
  }
});

test('each appendage has a root in its own atrium and an upper projecting tip', () => {
  for (const [appendage, chamber, root, tip] of [
    ['rightAppendage', 'rightAtrium', { x: 419, y: 228 }, { x: 465, y: 169 }],
    ['leftAppendage', 'leftAtrium', { x: 662, y: 241 }, { x: 684, y: 193 }],
  ] as const) {
    assert.ok(inside(PAC_ANATOMY[appendage], root));
    assert.ok(inside(PAC_ANATOMY[chamber], root));
    assert.ok(inside(PAC_ANATOMY[appendage], tip));
    assert.ok(!inside(PAC_ANATOMY[chamber], tip));
  }
});

test('diagram label rows do not overlap at the minimum supported width', () => {
  for (const side of ['left', 'right']) {
    const rows = Object.values(PAC_ANATOMY_SITES).filter(s => s.side === side).map(s => s.row).sort((a, b) => a - b);
    for (let i = 1; i < rows.length; i++) assert.ok((rows[i] - rows[i - 1]) * 420 / 1000 >= 44);
  }
});
