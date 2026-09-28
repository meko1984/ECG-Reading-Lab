import type { Lesson, VisualKind } from '@/app/content/classroom/types';
import { ClassroomLayout } from './ClassroomLayout';
import { FoundationVisual } from './FoundationVisual';
import { RhythmVisual } from './RhythmVisual';
import { ConditionVisual } from './ConditionVisual';
import { DeviceVisual } from './DeviceVisual';
import { PracticeVisual } from './PracticeVisual';
import { AdvancedVisual } from './AdvancedVisual';
import { RecordedECGViewer } from './RecordedECGViewer';
import styles from './Classroom.module.css';

function LessonVisual({kind}:{kind:VisualKind}) {
  switch (kind) {
    case 'cycle': case 'leads': case 'rate': case 'pr': case 'qrs': case 'axis': case 'st': case 'qt':
      return <FoundationVisual key={kind} kind={kind}/>;
    case 'pac': case 'pvc': case 'af': case 'flutter': case 'svt': case 'wpw': case 'ventricular': case 'sinus': case 'av':
      return <RhythmVisual key={kind} kind={kind}/>;
    case 'bundle': case 'ischemia': case 'electrolytes':
      return <ConditionVisual key={kind} kind={kind}/>;
    case 'pacing': case 'devices':
      return <DeviceVisual key={kind} kind={kind}/>;
    case 'practice': return <PracticeVisual/>;
    case 'j-wave': case 'structure': case 'takotsubo': case 'epsilon': case 'amyloid': case 'right-heart': case 'pericardium': case 'position': case 'pediatric':
      return <AdvancedVisual key={kind} kind={kind}/>;
    default: {
      const unhandled: never = kind;
      throw new Error(`Unknown classroom visual: ${unhandled}`);
    }
  }
}

export function LessonPage({lesson}:{lesson:Lesson}) {
  return <ClassroomLayout slug={lesson.slug} references={lesson.sources} labs={lesson.labs}>
    <LessonVisual kind={lesson.visual}/>
    {lesson.recordId&&<RecordedECGViewer key={lesson.recordId} recordId={lesson.recordId}/>}
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
