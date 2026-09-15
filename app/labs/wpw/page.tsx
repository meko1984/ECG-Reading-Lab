import { AppShell } from '@/app/components/AppShell';
import { WPWLabClient } from '@/app/components/WPWLabClient';

export const dynamic = 'force-static';

export default function WPWLabPage() {
  return (
    <AppShell title="WPW・ケント束局在ラボ" backHref="/labs" contentClassName="wpw-page-content">
      <WPWLabClient />
    </AppShell>
  );
}
