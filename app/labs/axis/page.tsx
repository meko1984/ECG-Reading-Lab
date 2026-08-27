import { AppShell } from '@/app/components/AppShell';
import { AxisLabClient } from '@/app/components/AxisLabClient';

export const dynamic = 'force-static';

export default function AxisLabPage() {
  return (
    <AppShell title="平均電気軸ラボ" backHref="/labs">
      <AxisLabClient />
    </AppShell>
  );
}
