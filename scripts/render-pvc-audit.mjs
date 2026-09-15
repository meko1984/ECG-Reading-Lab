// Render the served SVGs without a browser. This checks vector geometry, not
// browser layout or interaction. Generated evidence belongs in ignored outputs/.
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { PVC_ORIGINS } from '../app/domain/pvc.ts';
import { PVC_CORE_LEADS, pvcBeatVoltage, pvcQrsDuration, pvcSvgPath } from '../app/domain/pvc-waveform.ts';

const sharpPath = process.env.PVC_SHARP_PATH;
if (!sharpPath) throw new Error('Set PVC_SHARP_PATH to the available sharp module entrypoint.');
const { default: sharp } = await import(pathToFileURL(sharpPath).href);
const destination = path.resolve('outputs/pvc-audit-2026-09-08');
await fs.mkdir(destination, { recursive: true });
const response = await fetch('http://localhost:3000/labs/pvc');
if (!response.ok) throw new Error(`PVC route returned ${response.status}`);
const html = await response.text();
const css = await fs.readFile('app/globals.css', 'utf8');
const variables = Object.fromEntries([...css.matchAll(/(--[\w-]+)\s*:\s*([^;}]+);/g)].map(m => [m[1], m[2]]));
const resolveVars = text => text.replace(/var\((--[\w-]+)\)/g, (_, key) => variables[key] ?? 'black');
const pvcCss = resolveVars(css.slice(css.indexOf('.pvc-origin-card,'), css.indexOf('/* Electrode placement error lab */')));
const style = `<style>text{font-family:"Yu Gothic",Meiryo,sans-serif}${pvcCss}</style>`;
const svgStart = html.indexOf('<svg class="pvc-heart-anatomy"');
const heartSvg = html.slice(svgStart, html.indexOf('</svg>', svgStart) + 6);
if (!heartSvg) throw new Error('Missing served heart SVG');
const markers = [...html.matchAll(/<button[^>]*class="pvc-origin-marker[^"]*"[^>]*style="left:([\d.]+)%;top:([\d.]+)%;--origin-color:([^"]+)"[^>]*><span>(\d)<\/span>/g)];
if (markers.length !== 8) throw new Error(`Expected 8 served markers, got ${markers.length}`);
const markerSvg = markers.map(m => `<g><circle cx="${+m[1] * 6.8}" cy="${+m[2] * 6.4}" r="13.5" fill="${resolveVars(m[3])}" stroke="white" stroke-width="2"/><text x="${+m[1] * 6.8}" y="${+m[2] * 6.4 + 4}" fill="white" text-anchor="middle" font-size="13" font-weight="bold">${m[4]}</text></g>`).join('');
const render = async (name, svg, width) => {
  const source = resolveVars(svg).replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
  await sharp(Buffer.from(source), { density: 144 }).resize({ width }).flatten({ background: '#fff' }).png().toFile(path.join(destination, name));
};
await render('heart-vector.png', heartSvg.replace(/<svg([^>]*)>/, `<svg$1>${style}`).replace('</svg>', `${markerSvg}</svg>`), 1020);

const quick = [...html.matchAll(/<figure class="pvc-quick-waveform"[^>]*>[\s\S]*?(<svg[\s\S]*?<\/svg>)<\/figure>/g)].slice(0, 8);
if (quick.length !== 8) throw new Error('Missing served quick waveforms');
const actual = `<svg viewBox="0 0 460 630">${style}${quick.map((m, n) => `<svg x="${Math.floor(n / 4) * 230}" y="${n % 4 * 157}" width="216" height="146" viewBox="0 0 216 146">${m[1].replace(/^<svg[^>]*>|<\/svg>$/g, '')}</svg>`).join('')}</svg>`;
await render('rvot-served-waveforms.png', actual, 920);
const strips = [...html.matchAll(/<figure class="pvc-waveform-figure"[^>]*>([\s\S]*?)<\/figure>/g)];
if (strips.length !== 8) throw new Error('Missing served rhythm strips');
const stripSheet = strips.map((m, n) => {
  const svg = m[1].match(/<svg[\s\S]*?<\/svg>/)[0];
  const height = Number(svg.match(/viewBox="0 0 400 (\d+)"/)[1]);
  const fragment = svg.replace(/^<svg[^>]*>|<\/svg>$/g, '');
  return `<svg x="${Math.floor(n / 4) * 410}" y="${n % 4 * 260 + 22}" width="400" height="${height}" viewBox="0 0 400 ${height}">${fragment}</svg><text x="${Math.floor(n / 4) * 410 + 6}" y="${n % 4 * 260 + 18}" font-size="15">${PVC_CORE_LEADS[n]}</text>`;
}).join('');
await render('rvot-served-strips.png', `<svg viewBox="0 0 820 1040">${style}${stripSheet}</svg>`, 1230);

// All region data at the same scale as the shared quick-waveform renderer.
let content = style;
for (let row = 0; row < PVC_ORIGINS.length; row++) {
  const origin = PVC_ORIGINS[row];
  content += `<text x="8" y="${row * 170 + 18}" fill="#0a1f57" font-size="16">${origin.markerNumber} ${origin.siteName}</text>`;
  for (let col = 0; col < PVC_CORE_LEADS.length; col++) {
    const lead = PVC_CORE_LEADS[col];
    const end = pvcQrsDuration(origin.id);
    const sample = ms => pvcBeatVoltage(origin.id, lead, ms);
    const trace = (from, to) => pvcSvgPath(sample, from, to, 0.3, 80, 40, (from + 100) * 0.3);
    const stroke = resolveVars(origin.color);
    content += `<svg x="${col * 170}" y="${row * 170 + 26}" width="166" height="120" viewBox="0 0 216 146"><rect width="216" height="146" fill="#f5fcff"/><path d="M8 80H208" class="pvc-quick-baseline"/><text x="10" y="20" font-size="16">${lead}</text><path d="${trace(-100, end)}" fill="none" stroke="${stroke}" stroke-width="2.2"/><path d="${trace(end, 620)}" fill="none" stroke="${stroke}" stroke-width="1.8"/></svg>`;
  }
}
await render('all-eight-waveform-models.png', `<svg viewBox="0 0 1360 1360">${content}</svg>`, 1360);
console.log(JSON.stringify({ http: response.status, markers: markers.length, servedQuickLeads: quick.length, servedStrips: strips.length, rendered: ['heart-vector.png', 'rvot-served-waveforms.png', 'rvot-served-strips.png', 'all-eight-waveform-models.png'], destination }, null, 2));
