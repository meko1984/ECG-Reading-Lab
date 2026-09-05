import { AppShell } from '@/app/components/AppShell';
import { InfoCard } from '@/app/components/InfoCard';
import { appPath } from '@/app/domain/paths';

export const dynamic = 'force-static';

export default function LabsPage() {
  return (
    <AppShell title="研究室">
      <header className="page-header">
        <p className="eyebrow">動かして考える</p>
        <h1>心電図の研究室</h1>
        <p className="page-lead">数字や波形を動かしながら、心電図を読むときの考え方を確認できます。</p>
      </header>

      <div className="lab-list">
        <a className="lab-card lab-card-active" href={appPath('/labs/electrodes')}>
          <div className="lab-icon" aria-hidden="true">●</div>
          <div>
            <span className="lab-status">体験できる</span>
            <h2>電極装着ラボ</h2>
            <p>10個の電極を人体へつけ、入れ替えや位置の間違いで12誘導がどう変わるか比べます。</p>
          </div>
          <span className="lab-arrow" aria-hidden="true">›</span>
        </a>

        <a className="lab-card lab-card-active" href={appPath('/labs/axis')}>
          <div className="lab-icon" aria-hidden="true">↗</div>
          <div>
            <span className="lab-status">体験できる</span>
            <h2>平均電気軸ラボ</h2>
            <p>Ⅰ誘導とⅡ誘導のQRSを動かし、電気軸をベクトルで確認できます。</p>
          </div>
          <span className="lab-arrow" aria-hidden="true">›</span>
        </a>

        <a className="lab-card lab-card-active" href={appPath('/labs/wpw')}>
          <div className="lab-icon" aria-hidden="true">⌁</div>
          <div>
            <span className="lab-status">体験できる</span>
            <h2>WPW・ケント束ラボ</h2>
            <p>タイプA・B・Cの付着部位と、V1誘導のQRS波形を模式断面で結びつけます。</p>
          </div>
          <span className="lab-arrow" aria-hidden="true">›</span>
        </a>

        <a className="lab-card lab-card-active" href={appPath('/labs/pac')}>
          <div className="lab-icon" aria-hidden="true">P′</div>
          <div>
            <span className="lab-status">体験できる</span>
            <h2>心房期外収縮・起源ラボ</h2>
            <p>早く出たP′波の向きから、心房内の代表的な起源候補をたどります。</p>
          </div>
          <span className="lab-arrow" aria-hidden="true">›</span>
        </a>

        <a className="lab-card lab-card-active" href={appPath('/labs/pvc')}>
          <div className="lab-icon" aria-hidden="true">V</div>
          <div>
            <span className="lab-status">体験できる</span>
            <h2>心室性期外収縮・起源ラボ</h2>
            <p>V1とQRSの向きを4段階で見て、心室内の大まかな起源候補をたどります。</p>
          </div>
          <span className="lab-arrow" aria-hidden="true">›</span>
        </a>

        <a className="lab-card lab-card-active" href={appPath('/labs/mi')}>
          <div className="lab-icon" aria-hidden="true">ST</div>
          <div>
            <span className="lab-status">体験できる</span>
            <h2>心筋梗塞・部位判定ラボ</h2>
            <p>ST変化が見える連続誘導から、心筋の代表領域と次に追加する誘導をたどります。</p>
          </div>
          <span className="lab-arrow" aria-hidden="true">›</span>
        </a>

        <a className="lab-card lab-card-active" href={appPath('/labs/mirror')}>
          <div className="lab-icon" aria-hidden="true">⇅</div>
          <div>
            <span className="lab-status">体験できる</span>
            <h2>ミラーイメージ・ST変化ラボ</h2>
            <p>心臓を挟んだ両側の誘導を行き来し、ST上昇と鏡像変化を同時に見比べます。</p>
          </div>
          <span className="lab-arrow" aria-hidden="true">›</span>
        </a>
      </div>

      <InfoCard title="研究室は順次追加します">
        <p>現在は電極装着ミス、平均電気軸、WPW・ケント束、心房期外収縮、心室性期外収縮、心筋梗塞部位判定、ミラーイメージの7つを体験できます。ほかのテーマも順次追加する予定です。</p>
      </InfoCard>
    </AppShell>
  );
}
