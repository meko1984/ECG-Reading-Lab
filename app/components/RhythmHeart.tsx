import { useId } from 'react';
import type { RhythmId } from '@/app/domain/tachycardia';
import styles from './RhythmLabs.module.css';

type Site = { id: RhythmId; x: number; y: number; label: string };
const tachySites: Site[] = [{ id: 'avnrt', x: 205, y: 187, label: 'AV結節' }, { id: 'avrt', x: 352, y: 202, label: '副伝導路' }, { id: 'at-high', x: 91, y: 66, label: '高位焦点' }, { id: 'at-low', x: 85, y: 207, label: '低位焦点' }];
const flutterSites: Site[] = [{ id: 'common', x: 61, y: 100, label: '反時計回り' }, { id: 'reverse', x: 62, y: 208, label: '時計回り' }, { id: 'atypical', x: 326, y: 106, label: '左房回路' }];
export function RhythmHeart({ id, flutter, onSelect }: { id: RhythmId; flutter: boolean; onSelect: (id: RhythmId) => void }) {
  const marker = useId().replaceAll(':', '');
  const sites = flutter ? flutterSites : tachySites;
  return <svg viewBox="0 0 420 370" className={styles.heart} role="group" aria-label={flutter ? '心房粗動の回路選択図' : '頻拍の回路と焦点の選択図'}>
    <defs><marker id={marker} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 Z" fill="#bd6517" /></marker></defs>
    <path className={styles.chamber} d="M 190 41 C 84 5 30 53 39 142 C 45 198 139 234 191 194 Z" />
    <path className={styles.chamber} d="M 224 41 C 330 5 386 57 375 142 C 367 198 279 234 224 194 Z" />
    <path className={styles.chamber} d="M 188 218 C 139 205 74 230 99 291 Q 131 343 201 352 L 202 232 Z" />
    <path className={styles.chamber} d="M 223 219 C 283 204 345 227 320 291 Q 286 339 214 352 L 214 233 Z" />
    <text x="134" y="49">右房</text><text x="250" y="49">左房</text><text x="128" y="304">右室</text><text x="248" y="304">左室</text>
    {!flutter && <>
      <path d="M 205 208 L 205 254 M 205 245 L 156 279 M 205 245 L 262 279" fill="none" stroke="#85a8c4" strokeWidth="5" />
      {id === 'avnrt' && <><path className={styles.route} d="M 187 141 Q 161 181 190 211" markerEnd={`url(#${marker})`} /><path className={styles.route} d="M 219 204 Q 243 166 213 142" markerEnd={`url(#${marker})`} /><text x="137" y="164">遅</text><text x="245" y="164">速</text></>}
      {id === 'avrt' && <><path className={styles.route} d="M 209 151 L 209 251" markerEnd={`url(#${marker})`} /><path className={styles.route} d="M 234 266 Q 354 281 354 161" markerEnd={`url(#${marker})`} /><path className={styles.route} d="M 335 134 Q 265 90 211 130" markerEnd={`url(#${marker})`} /></>}
      {(id === 'at-high' || id === 'at-low') && <>{[24, 42, 59].map(r => <circle key={r} cx={id === 'at-high' ? 91 : 85} cy={id === 'at-high' ? 66 : 207} r={r} fill="none" stroke="#bd6517" opacity={.9 - r / 100} strokeDasharray="5 4" />)}<path className={styles.route} d={id === 'at-high' ? 'M 107 91 Q 163 125 198 174' : 'M 102 194 Q 145 155 191 177'} markerEnd={`url(#${marker})`} /><path d="M 206 215 L 206 251" className={styles.route} markerEnd={`url(#${marker})`} /></>}
      <text x="145" y="331" style={{ fontSize: 11 }}>配置・回路を強調した模式図</text>
    </>}
    {flutter && <>
      <ellipse cx="143" cy="139" rx="39" ry="53" fill="white" stroke="#acbfce" strokeWidth="2" /><text x="119" y="132" style={{ fontSize: 12 }}>三尖</text><text x="119" y="149" style={{ fontSize: 12 }}>弁輪</text>
      <path d="M 111 207 L 174 207" stroke="#2675b8" strokeWidth="7" /><text x="140" y="237">CTI</text><text x="48" y="266" style={{ fontSize: 11 }}>CTI＝下大静脈−三尖弁峡部</text>
      <ellipse cx="287" cy="144" rx="32" ry="47" fill="white" stroke="#acbfce" strokeWidth="2" /><text x="265" y="141" style={{ fontSize: 12 }}>僧帽</text><text x="265" y="158" style={{ fontSize: 12 }}>弁輪</text>
      {id === 'common' && <><path className={styles.route} d="M 188 112 C 174 58 104 54 85 125" markerEnd={`url(#${marker})`} /><path className={styles.route} d="M 86 151 C 105 222 184 214 195 148" markerEnd={`url(#${marker})`} /></>}
      {id === 'reverse' && <><path className={styles.route} d="M 89 114 C 109 53 180 59 194 127" markerEnd={`url(#${marker})`} /><path className={styles.route} d="M 192 154 C 175 224 97 211 85 146" markerEnd={`url(#${marker})`} /></>}
      {id === 'atypical' && <><path className={styles.route} d="M 329 157 C 339 72 253 64 244 133" markerEnd={`url(#${marker})`} /><path className={styles.route} d="M 244 153 C 251 219 318 221 333 179" markerEnd={`url(#${marker})`} /></>}
      <text x="49" y="331" style={{ fontSize: 11 }}>心尖側から弁輪を見る方向を模式化</text>
    </>}
    {sites.map(site => <g key={site.id} role="button" tabIndex={0} aria-label={site.label} aria-pressed={id === site.id} onClick={() => onSelect(site.id)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(site.id); } }}>
      <rect x={site.x - 40} y={site.y - 23} width="80" height="46" rx="15" className={styles.site} /><text x={site.x} y={site.y + 4} textAnchor="middle" className={styles.siteText}>{site.label}</text>
    </g>)}
  </svg>;
}
