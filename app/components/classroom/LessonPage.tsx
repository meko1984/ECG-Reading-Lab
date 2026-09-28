import type { Lesson, VisualKind } from '@/app/content/classroom/types';
import { ClassroomLayout } from './ClassroomLayout';
import { FoundationVisual } from './FoundationVisual';
import { RhythmVisual } from './RhythmVisual';
import { ConditionVisual } from './ConditionVisual';
import { DeviceVisual } from './DeviceVisual';
import { PracticeVisual } from './PracticeVisual';
import { AdvancedVisual } from './AdvancedVisual';
import { KnowledgeCheck } from './KnowledgeCheck';
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
    <p className={styles.lede}>{lesson.lead}</p>
    <LessonVisual kind={lesson.visual}/>
    <section className={styles.section}><h2>観察の順番</h2><div className={styles.threeColumns}>{lesson.points.map(point=><div className={styles.point} key={point.title}><h3>{point.title}</h3><p>{point.body}</p></div>)}</div></section>
    {lesson.recordId&&<RecordedECGViewer key={lesson.recordId} recordId={lesson.recordId}/>}
    <section className={styles.section}><h2>ここは取り違えない</h2><ol className={styles.stepList}>{lesson.pitfalls.map(pitfall=><li key={pitfall}>{pitfall}</li>)}</ol></section>
    <KnowledgeCheck question={lesson.question.prompt} answers={lesson.question.answers} correctIndex={lesson.question.correct} explanation={lesson.question.explanation}/>
  </ClassroomLayout>;
}
