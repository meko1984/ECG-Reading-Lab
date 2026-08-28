import { AppShell } from '@/app/components/AppShell';
import { PVCLabClient } from '@/app/components/PVCLabClient';

export const dynamic = 'force-static';

export default function PVCLabPage() {
  return (
    <AppShell title="心室性期外収縮・起源ラボ" backHref="/labs">
      <PVCLabClient />
    </AppShell>
  );
}
