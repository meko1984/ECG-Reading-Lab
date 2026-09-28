import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { decodeRecord, parseRecordHeader, paperPoint, recordPath } from '../app/domain/recorded-ecg.ts';
import { teachingRecords } from '../app/content/classroom/records.ts';

const headerText = readFileSync(new URL('../public/data/ptb-xl/00293_hr.hea', import.meta.url), 'utf8');
const binary = readFileSync(new URL('../public/data/ptb-xl/00293_hr.dat', import.meta.url));
const buffer = binary.buffer.slice(binary.byteOffset, binary.byteOffset + binary.byteLength);
const header = parseRecordHeader(headerText);

test('all adopted records match their source hashes and decode all twelve channels', () => {
  for (const record of Object.values(teachingRecords)) {
    const root = new URL(`../public/data/ptb-xl/${record.stem}`, import.meta.url);
    const hea=readFileSync(new URL(root.href+'.hea'));
    const dat=readFileSync(new URL(root.href+'.dat'));
    const meta=JSON.parse(readFileSync(new URL(root.href+'.json'),'utf8'));
    assert.equal(meta.ecg_id,Number(record.id));
    assert.equal(meta.sourcePath,record.sourcePath);
    assert.equal(createHash('sha256').update(hea).digest('hex'),meta.sha256.hea);
    assert.equal(createHash('sha256').update(dat).digest('hex'),meta.sha256.dat);
    const decoded=decodeRecord(parseRecordHeader(hea.toString('utf8')),dat.buffer.slice(dat.byteOffset,dat.byteOffset+dat.byteLength));
    assert.equal(decoded.millivolts.length,12);
    assert.ok(decoded.millivolts.every(channel=>channel.length===5000));
    for (const annotation of record.annotations??[]) {
      assert.ok(decoded.signals.some(signal=>signal.name.toUpperCase()===annotation.lead));
      assert.ok(annotation.seconds>=0 && annotation.seconds<10);
    }
  }
});

test('actual PTB record is intact, with the expected units, duration, lead order and checksums', () => {
  const metadata = JSON.parse(readFileSync(new URL('../public/data/ptb-xl/00293_hr.json', import.meta.url), 'utf8'));
  assert.equal(createHash('sha256').update(binary).digest('hex'), metadata.sha256.dat);
  assert.equal(createHash('sha256').update(headerText).digest('hex'), metadata.sha256.hea);
  const record = decodeRecord(header, buffer);
  assert.equal(record.sampleRate, 500);
  assert.equal(record.sampleCount, 5000);
  assert.equal(record.sampleCount / record.sampleRate, 10);
  assert.deepEqual(record.signals.map((s) => s.name), ['I', 'II', 'III', 'AVR', 'AVL', 'AVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6']);
  assert.equal(record.millivolts[0][0], .145);
  assert.equal(record.millivolts[1][0], .080);
  assert.equal(record.millivolts[2][0], -.065);
  assert.ok(record.millivolts.every((values) => values.length === 5000 && values.every(Number.isFinite)));
});

test('one small square corresponds to 40 ms and 0.1 mV; zoom preserves both axes', () => {
  assert.deepEqual(paperPoint(.04, .1), { x: 4, y: -4 });
  assert.deepEqual(paperPoint(.2, 1), { x: 20, y: -40 });
  assert.deepEqual(paperPoint(.2, 1, 8), { x: 40, y: -80 });
  assert.equal(paperPoint(1 / 500, 0).x, .2);
});

test('sample order, timestamp and sign are retained without smoothing', () => {
  assert.equal(recordPath([0, 1, -1], 500), 'M0.00,0.00 L0.20,-40.00 L0.40,40.00');
  assert.equal(recordPath([0, 1, -1, 2], 500, .002, .004), 'M0.00,-40.00 L0.20,40.00');
  assert.throws(() => recordPath([0], 0));
  assert.throws(() => recordPath([0], 500, 10));
  assert.throws(() => paperPoint(0, 0, 0));
});

test('non-zero baseline and variable gain are read from each signal, not hardcoded', () => {
  const modified = { ...header, signals: header.signals.map((signal) => ({ ...signal, gain: 500, baseline: 100 })) };
  const record = decodeRecord(modified, buffer);
  assert.equal(record.millivolts[0][0], .09);
  assert.equal(record.millivolts[1][0], -.04);
});

test('corrupt or unsupported files are rejected before drawing', () => {
  assert.throws(() => parseRecordHeader(headerText.replace(' 16 1000.0', ' 212 1000.0')));
  assert.throws(() => parseRecordHeader(headerText.replace('1000.0(0)/mV', '0(0)/mV')));
  assert.throws(() => parseRecordHeader(headerText.replace(' 500 5000', ' NaN 5000')));
  assert.throws(() => parseRecordHeader(headerText.replace(' V6', ' V5')));
  assert.throws(() => decodeRecord(header, buffer.slice(0, -2)));
  const bad = buffer.slice(0);
  new DataView(bad).setInt16(24, 12345, true);
  assert.throws(() => decodeRecord(header, bad), /checksum/);
  const missing = buffer.slice(0);
  new DataView(missing).setInt16(24, -32768, true);
  assert.throws(() => decodeRecord(header, missing), /Missing/);
});
