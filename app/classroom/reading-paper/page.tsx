import { ClassroomLayout } from '@/app/components/classroom/ClassroomLayout';
import { PaperLesson } from '@/app/components/classroom/PaperLesson';
import { RecordedECGViewer } from '@/app/components/classroom/RecordedECGViewer';
import styles from '@/app/components/classroom/Classroom.module.css';
import { references } from '@/app/content/classroom/references';

export const dynamic = 'force-static';
export const metadata = { title: '記録紙と12誘導の読みはじめ | ECG lab 教室' };

export default function ReadingPaperPage() {
  return <ClassroomLayout slug="reading-paper" labs={[{ slug: 'electrodes', title: '電極装着ラボ' }]} references={[
    references.recording,
    { title: 'PTB-XL v1.0.3：公式データ説明', url: 'https://physionet.org/content/ptb-xl/1.0.3/', detail: '12誘導、標本化周波数、電位単位、所見・品質情報。' },
  ]}>
    <RecordedECGViewer />
    <PaperLesson />
    <section className={styles.section}><h2>病名を考える前に、3つを確認</h2><div className={styles.threeColumns}>
      <div className={styles.point}><h3>① 記録の条件</h3><p>速度、感度、誘導名を確認します。細かな揺れや基線のずれにも目を向けます。</p></div>
      <div className={styles.point}><h3>② 時間の並び</h3><p>QRSの間隔と、P波・QRSの関係を見ます。最初からひとつの誘導だけで結論を出しません。</p></div>
      <div className={styles.point}><h3>③ 誘導による違い</h3><p>同じ心拍を違う方向から見ると、波形の向きや大きさが変わります。</p></div>
    </div></section>
  </ClassroomLayout>;
}
