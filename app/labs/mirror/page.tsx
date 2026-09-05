import { AppShell } from '@/app/components/AppShell';
import { MirrorLabClient } from '@/app/components/MirrorLabClient';

export const dynamic = 'force-static';

export default function MirrorLabPage() {
  return <AppShell title="ミラーイメージ・ST変化ラボ" backHref="/labs"><MirrorLabClient /></AppShell>;
}
