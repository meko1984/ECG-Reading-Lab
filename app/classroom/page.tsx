import { AppShell } from '@/app/components/AppShell';
import { classrooms, classroomGroups, availableClassrooms } from '@/app/content/classroom/catalog';
import { appPath } from '@/app/domain/paths';
import styles from '@/app/components/classroom/Classroom.module.css';

export const dynamic = 'force-static';
export const metadata = { title: '教室 | 心電図よみときラボ' };

export default function ClassroomIndex() {
  return <AppShell title="教室" contentClassName={styles.shell}>
    <nav className={styles.crumbs} aria-label="パンくず"><a href={appPath('/')}>トップ</a><span aria-hidden="true">/</span><span aria-current="page">教室</span></nav>
    <header className={styles.hero}>
      <p className={styles.eyebrow}>観察から、理解へ</p>
      <h1>心電図の教室</h1>
      <p>ひと部屋ずつ、波形を読む目を育てる。<br />はじめてなら01から。知りたいテーマからでも。</p>
    </header>
    <nav className={styles.groupNav} aria-label="教室のテーマ">{classroomGroups.map((group, i) => <a href={`#group-${i}`} key={group.title}>{group.title}</a>)}</nav>
    {classroomGroups.map((group, index) => <section id={`group-${index}`} className={styles.group} key={group.title} aria-labelledby={`group-title-${index}`}>
      <h2 id={`group-title-${index}`}>{group.title}</h2><p>{group.description}</p>
      <ol className={styles.cards}>{classrooms.filter((room) => room.group === index).map((room) => {
        const number = classrooms.indexOf(room) + 1;
        const content = <><span className={styles.number}>{String(number).padStart(2, '0')}</span><div>{room.advanced && <span className={styles.badge}>発展</span>}<h3>{room.title}</h3><p>{room.summary}</p>{!availableClassrooms.has(room.slug) && <span className={styles.pending}>準備中</span>}</div><span aria-hidden="true">{availableClassrooms.has(room.slug) ? '›' : ''}</span></>;
        return <li key={room.slug} value={number}>{availableClassrooms.has(room.slug) ? <a className={styles.card} href={appPath(`/classroom/${room.slug}`)}>{content}</a> : <div className={styles.card}>{content}</div>}</li>;
      })}</ol>
    </section>)}
    <p className={styles.disclaimer}>学習用・非診断用。実記録と模式図を区別して表示します。</p>
  </AppShell>;
}
