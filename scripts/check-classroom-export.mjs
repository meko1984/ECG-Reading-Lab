import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { classrooms } from '../app/content/classroom/catalog.ts';

const root = path.resolve(process.argv[2] ?? 'dist/client');
const files = fs.readdirSync(root, { recursive: true }).filter(name => name.endsWith('.html'));
const failures = [];
const external = new Set();
let links = 0;
for (const file of files) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  if (new Set(ids).size !== ids.length) failures.push(`${file}: duplicate element ID`);
  for (const match of html.matchAll(/\b(?:href|src)="([^"<>]+)"/g)) {
    const href = match[1].replaceAll('&amp;', '&');
    if (/^https?:\/\//.test(href)) { external.add(href); continue; }
    if (/^(data:|mailto:|tel:)/.test(href)) continue;
    const url = new URL(href, `https://export.test/${file}`);
    if (url.origin !== 'https://export.test') continue;
    const rel = decodeURIComponent(url.pathname).slice(1) || 'index.html';
    const target = path.resolve(root, rel);
    if (!target.startsWith(root + path.sep)) { failures.push(`${file}: outside export: ${href}`); continue; }
    if (!fs.existsSync(target) || !fs.statSync(target).isFile()) failures.push(`${file}: missing file: ${href}`);
    else if (url.hash && target.endsWith('.html')) {
      const targetHtml = fs.readFileSync(target, 'utf8');
      if (!targetHtml.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`)) failures.push(`${file}: missing anchor: ${href}`);
    }
    links++;
  }
}
const index = fs.readFileSync(path.join(root, 'classroom.html'), 'utf8');
for (const [number, room] of classrooms.entries()) {
  const filename = `classroom/${room.slug}.html`;
  assert.ok(index.includes(`href="/${filename}"`), `Index link missing: ${room.slug}`);
  const html = fs.readFileSync(path.join(root, filename), 'utf8');
  assert.ok(html.includes(`<h1>${room.title}</h1>`), `Wrong heading: ${room.slug}`);
  assert.ok(html.includes('ひとつ確かめる'), `Question missing: ${room.slug}`);
  assert.ok(html.includes('参考資料'), `References missing: ${room.slug}`);
  assert.ok(html.includes('href="/classroom.html"'), `Return link missing: ${room.slug}`);
  assert.ok(html.includes('aria-label="教室を移動"'), `Navigation missing: ${room.slug}`);
  if (number > 0) assert.ok(html.includes(`/classroom/${classrooms[number-1].slug}.html`), `Previous room missing: ${room.slug}`);
  if (number < classrooms.length-1) assert.ok(html.includes(`/classroom/${classrooms[number+1].slug}.html`), `Next room missing: ${room.slug}`);
  if (room.advanced) assert.ok(html.includes('>発展</span>'), `Advanced badge missing: ${room.slug}`);
}
assert.equal(classrooms.length, 33);
assert.equal(classrooms.filter(room => room.advanced).length, 9);
assert.deepEqual(failures, [], 'Broken export links or duplicate IDs');
console.log(JSON.stringify({ htmlFiles: files.length, classrooms: classrooms.length, advanced: 9, internalLinksAndAssets: links, externalUrls: external.size, failures }, null, 2));
