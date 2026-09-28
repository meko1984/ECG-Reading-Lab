import type { ReactNode } from 'react';
import { AppShell } from '@/app/components/AppShell';
import { availableClassrooms, classroomBySlug, classrooms } from '@/app/content/classroom/catalog';
import { appPath } from '@/app/domain/paths';
import styles from './Classroom.module.css';

export type Reference = { title: string; url: string; detail?: string };
export type LabLink = { title: string; slug: string };

export function ClassroomLayout({ slug, children, references, labs = [] }: { slug: string; children: ReactNode; references: Reference[]; labs?: LabLink[] }) {
  const room = classroomBySlug(slug);
  const index = classrooms.indexOf(room);
  const previous = classrooms[index - 1];
  const next = classrooms[index + 1];
  return <AppShell title="教室" backHref="/classroom" contentClassName={styles.shell}>
    <nav className={styles.crumbs} aria-label="パンくず"><a href={appPath('/')}>トップ</a><span aria-hidden="true">/</span><a href={appPath('/classroom')}>教室</a><span aria-hidden="true">/</span><span aria-current="page">{String(index + 1).padStart(2, '0')}</span></nav>
    <header className={styles.hero}><p className={styles.eyebrow}>教室 {String(index + 1).padStart(2, '0')} {room.advanced && <span className={styles.badge}>発展</span>}</p><h1>{room.title}</h1><p>{room.summary}</p></header>
    {children}
    <section className={styles.section}><h2>関連項目・研究室</h2><div className={styles.related}>
      {previous && availableClassrooms.has(previous.slug) && <a href={appPath(`/classroom/${previous.slug}`)}><small>前の関連項目</small>{previous.title}</a>}
      {next && availableClassrooms.has(next.slug) && <a href={appPath(`/classroom/${next.slug}`)}><small>次の関連項目</small>{next.title}</a>}
      {labs.map((lab) => <a href={appPath(`/labs/${lab.slug}`)} key={lab.slug}><small>関連研究室</small>{lab.title}<span aria-hidden="true">　↗</span></a>)}
    </div></section>
    <section className={styles.section} aria-label="参考資料"><h2>参考資料</h2><ul className={styles.references}>{references.map((reference) => <li key={reference.url}><a href={reference.url}>{reference.title}</a>{reference.detail && <span> — {reference.detail}</span>}</li>)}</ul><p className={styles.note}>確認日：2026年9月28日。説明図はECG lab独自の模式図です。個々の病態や診断を確定するものではありません。</p></section>
    <nav className={styles.pagination} aria-label="教室を移動">
      {previous && availableClassrooms.has(previous.slug) && <a href={appPath(`/classroom/${previous.slug}`)}><small>← 前の教室</small>{previous.title}</a>}
      <a href={appPath('/classroom')}><small>学習の道順</small>教室一覧へ</a>
      {next && availableClassrooms.has(next.slug) && <a href={appPath(`/classroom/${next.slug}`)}><small>次の教室 →</small>{next.title}</a>}
    </nav>
    <p className={styles.disclaimer}>学習用・非診断用。心電図だけで個別の診断や治療を判断するための教材ではありません。</p>
  </AppShell>;
}
