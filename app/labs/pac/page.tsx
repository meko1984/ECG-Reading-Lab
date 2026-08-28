import { AppShell } from '@/app/components/AppShell';
import { PACLabClient } from '@/app/components/PACLabClient';

export const dynamic = 'force-static';

export default function PACLabPage() {
  return (
    <AppShell title="心房期外収縮・起源ラボ" backHref="/labs">
      <PACLabClient />
    </AppShell>
  );
}
