import { AppShell } from '@/app/components/AppShell';
import { Heart3DLabClient } from '@/app/components/Heart3DLabClient';

export const dynamic = 'force-static';
export const metadata = { title: '心臓３Dモデル | ECG Reading Lab', description: '心臓と12誘導を立体的に回し、誘導の観察方向と代表領域を光で確かめる学習ページ。' };
export default function Heart3DPage() {
  return <AppShell title="心臓３Dモデル" backHref="/labs"><Heart3DLabClient /></AppShell>;
}
