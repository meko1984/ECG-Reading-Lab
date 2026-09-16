import { AppShell } from '@/app/components/AppShell';
import { MembranePotentialLabClient } from '@/app/components/MembranePotentialLabClient';

export const dynamic = 'force-static';

export default function MembranePotentialLabPage() {
  return (
    <AppShell title="膜電位・電解質ラボ" backHref="/labs" contentClassName="membrane-potential-page">
      <MembranePotentialLabClient />
    </AppShell>
  );
}
