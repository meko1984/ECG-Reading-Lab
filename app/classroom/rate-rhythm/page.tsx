import { LessonPage } from '@/app/components/classroom/LessonPage';
import { lesson } from '@/app/content/classroom/rate-rhythm';
import { classroomBySlug } from '@/app/content/classroom/catalog';
export const dynamic = 'force-static';
export const metadata = { title: classroomBySlug(lesson.slug).title + ' | ECG lab 教室' };
export default function Page() { return <LessonPage lesson={lesson} />; }
