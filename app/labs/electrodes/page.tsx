import { AppShell } from '@/app/components/AppShell';
import { ElectrodeLabClient } from '@/app/components/ElectrodeLabClient';

export const dynamic = 'force-static';

export default function ElectrodeLabPage() {
  return (
    <AppShell title="電極装着ラボ" backHref="/labs">
      <ElectrodeLabClient />
    </AppShell>
  );
}
