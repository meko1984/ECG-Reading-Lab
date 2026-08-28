import { AppShell } from '@/app/components/AppShell';
import { MILabClient } from '@/app/components/MILabClient';

export const dynamic = 'force-static';

export default function MILabPage() {
  return <AppShell title="心筋梗塞・部位判定ラボ" backHref="/labs"><MILabClient /></AppShell>;
}
