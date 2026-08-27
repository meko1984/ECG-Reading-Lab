import { AppShell } from '@/app/components/AppShell';
import { InfoCard } from '@/app/components/InfoCard';
import { appPath } from '@/app/domain/paths';

export const dynamic = 'force-static';

export default function LabsPage() {
  return (
    <AppShell title="研究室">
      <header className="page-header">
        <p className="eyebrow">触って考える</p>
        <h1>心電図の研究室</h1>
        <p className="page-lead">数字や波形を動かしながら、心電図を読むときの考え方を確認できます。</p>
      </header>

      <div className="lab-list">
        <a className="lab-card lab-card-active" href={appPath('/labs/axis')}>
          <div className="lab-icon" aria-hidden="true">↗</div>
          <div>
            <span className="lab-status">体験できる</span>
            <h2>平均電気軸ラボ</h2>
            <p>Ⅰ誘導とⅡ誘導のQRSを動かし、電気軸をベクトルで確認できます。</p>
          </div>
          <span className="lab-arrow" aria-hidden="true">›</span>
        </a>

        <article className="lab-card lab-card-pending" aria-label="準備中：次の研究室">
          <div className="lab-icon" aria-hidden="true">⌁</div>
          <div>
            <span className="lab-status">準備中</span>
            <h2>次の研究室</h2>
            <p>新しい学習テーマを追加する予定です。</p>
          </div>
        </article>
      </div>

      <InfoCard title="研究室は順次追加します">
        <p>現在は平均電気軸ラボをご利用いただけます。内容を確認しながら、ほかのテーマも追加していく予定です。</p>
      </InfoCard>
    </AppShell>
  );
}
