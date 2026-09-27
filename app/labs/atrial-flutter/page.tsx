import { AppShell } from '@/app/components/AppShell';
import { TachycardiaLabClient } from '@/app/components/TachycardiaLabClient';
export const dynamic = 'force-static';
export default function FlutterLabPage() {
  return <AppShell title="心房粗動・回旋ラボ" backHref="/labs"><TachycardiaLabClient flutter /></AppShell>;
}
