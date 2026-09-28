import type { Lesson } from '@/app/content/classroom/types';
import { ClassroomLayout } from './ClassroomLayout';
import { PracticeVisual } from './PracticeVisual';
import { RecordedECGViewer } from './RecordedECGViewer';
import { InteractiveWaveformStage } from './InteractiveWaveformStage';
import styles from './Classroom.module.css';

export function LessonPage({lesson}:{lesson:Lesson}) {
  return <ClassroomLayout slug={lesson.slug} references={lesson.sources} labs={lesson.labs}>
    {lesson.visual === 'practice' ? <PracticeVisual/> : <InteractiveWaveformStage kind={lesson.visual}/>}
    {lesson.recordId ? <RecordedECGViewer key={lesson.recordId} recordId={lesson.recordId}/> : null}
    <section className={styles.section}>
      <h2>波形の特徴と見方</h2>
      <p className={styles.lede}>{lesson.lead}</p>
      <ul className={styles.explanationList}>
        {lesson.points.map(point=><li key={point.title}><strong>{point.title}</strong><span>{point.body}</span></li>)}
        {lesson.pitfalls.map(pitfall=><li className={styles.cautionItem} key={pitfall}><strong>注意</strong><span>{pitfall}</span></li>)}
      </ul>
    </section>
  </ClassroomLayout>;
}
