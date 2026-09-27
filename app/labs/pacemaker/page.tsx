import { AppShell } from '@/app/components/AppShell';
import { PacemakerLabClient } from '@/app/components/PacemakerLabClient';
export const dynamic = 'force-static';
export default function PacemakerLabPage() {
  return <AppShell title="ペースメーカー・刺激と応答ラボ" backHref="/labs"><PacemakerLabClient /></AppShell>;
}
