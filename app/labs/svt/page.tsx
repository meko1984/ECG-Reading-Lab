import { AppShell } from '@/app/components/AppShell';
import { TachycardiaLabClient } from '@/app/components/TachycardiaLabClient';
export const dynamic = 'force-static';
export default function SVTLabPage() {
  return <AppShell title="上室頻拍・回路ラボ" backHref="/labs"><TachycardiaLabClient /></AppShell>;
}
