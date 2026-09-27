export type PacingMode = 'A' | 'V' | 'AV';
export type PacingFault = 'normal' | 'capture' | 'undersense' | 'oversense' | 'output';
export type PacingSettings = { mode: PacingMode; fault: PacingFault; offset: number; avDelay: number };
export type PaceEvent = { time: number; kind: 'P' | 'QRS' | 'pacedQRS' | 'AP' | 'VP' | 'AS' | 'VS' | 'noise'; label: string };
export const PACING_FAULTS: { id: PacingFault; label: string }[] = [
  { id: 'normal', label: '正常な応答' }, { id: 'capture', label: '捕捉不全' },
  { id: 'undersense', label: 'アンダーセンシング' }, { id: 'oversense', label: 'オーバーセンシング' }, { id: 'output', label: '出力不全' },
];
export function pacingModel(settings: PacingSettings) {
  const { mode, fault, offset, avDelay } = settings;
  const events: PaceEvent[] = [];
  const add = (time: number, kind: PaceEvent['kind'], label: string) => events.push({ time, kind, label });
  const pacedChamber = mode === 'A' ? '心房' : '心室';
  for (let beat = 0; beat < 4; beat++) {
    const base = .4 + beat * 1.25;
    const spike = base + offset / 1000;
    if (fault === 'undersense') {
      // Native event remains fixed; inappropriate output moves relative to it.
      if (mode === 'A') {
        add(base, 'P', '自己P'); add(base + .16, 'QRS', '自己QRS');
        add(spike, 'AP', '見逃した後のAP');
        if (offset >= 300) { add(spike + .035, 'P', '捕捉P'); add(spike + .195, 'QRS', '伝導QRS'); }
      } else {
        add(base - .16, 'P', '自己P'); add(base, 'QRS', '自己QRS');
        add(spike, 'VP', '見逃した後のVP');
        if (offset >= 300) add(spike + .035, 'pacedQRS', '捕捉QRS');
      }
      continue;
    }
    const affected = beat === 1 || beat === 3;
    if (mode !== 'V') {
      if (!(mode === 'A' && affected && (fault === 'output' || fault === 'oversense'))) {
        add(spike, 'AP', 'AP');
        if (!(mode === 'A' && affected && fault === 'capture')) add(spike + .035, 'P', '捕捉P');
      }
    }
    if (mode === 'A') {
      if (!(affected && fault !== 'normal')) add(spike + .195, 'QRS', '自己伝導QRS');
      if (affected && fault === 'oversense') add(spike - .08, 'noise', '雑音をASと誤認');
    } else {
      const v = spike + (mode === 'AV' ? avDelay / 1000 : 0);
      if (!(affected && (fault === 'output' || fault === 'oversense'))) {
        add(v, 'VP', 'VP');
        if (!(affected && fault === 'capture')) add(v + .035, 'pacedQRS', '捕捉QRS');
      }
      if (affected && fault === 'oversense') add(v - .08, 'noise', '雑音をVSと誤認');
    }
  }
  if (mode === 'V' && fault !== 'undersense') {
    for (let time = .24; time < 5.1; time += .86) add(time, 'P', '自己P（心室と独立）');
  }
  const chamber = mode === 'A' ? '心房ペーシング' : mode === 'V' ? '心室ペーシング' : '心房・心室順次ペーシング';
  const diagnosis = fault === 'normal' ? chamber : fault === 'capture' ? `${pacedChamber}の捕捉不全` : fault === 'output' ? `${pacedChamber}の出力不全の例` : fault === 'undersense' ? `${pacedChamber}のアンダーセンシング` : `${pacedChamber}のオーバーセンシングの例`;
  const evidence = fault === 'normal' ? (mode === 'A' ? 'APの後にPが続き、房室伝導を経て狭いQRSが出る。' : mode === 'V' ? 'VPの後に幅広いQRSが続く。心房の自己波は別の周期で進む。' : 'APの後にP、VPの後に幅広いQRS。刺激と応答の対応を追う。')
    : fault === 'capture' ? '2・4回目：スパイクはあるのに、直後のP／QRSが続かない。'
    : fault === 'undersense' ? '自己波を見逃し、待つべき時間に刺激が出る。自己波を固定して、刺激位置を動かして比べる。'
    : fault === 'oversense' ? '2・4回目：雑音を自己波と誤認して刺激を抑制。下段の検出マーカーも確認。'
    : '2・4回目：必要な時刻にスパイクが出ない。表面心電図だけでは過剰感知による抑制と区別できない。';
  return { events: events.sort((a, b) => a.time - b.time), diagnosis, evidence };
}
export function pacingSample(t: number, events: PaceEvent[]) {
  const g = (center: number, width: number) => Math.exp(-.5 * ((t - center) / width) ** 2);
  let value = 0;
  for (const e of events) {
    if (e.kind === 'P') value += .18 * g(e.time, .022);
    if (e.kind === 'QRS') value += -.12 * g(e.time - .02, .007) + g(e.time, .010) - .25 * g(e.time + .022, .009) + .23 * g(e.time + .24, .048);
    if (e.kind === 'pacedQRS') value += -.22 * g(e.time - .015, .018) + .9 * g(e.time + .026, .023) - .6 * g(e.time + .075, .025) - .22 * g(e.time + .29, .05);
  }
  return value;
}
