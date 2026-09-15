import { AppShell } from '@/app/components/AppShell';
import { appPath } from '@/app/domain/paths';

export const dynamic = 'force-static';

export default function LabsPage() {
  return (
    <AppShell title="研究室">
      <header className="page-header">
        <p className="eyebrow">動かして考える</p>
        <h1>心電図の研究室</h1>
      </header>

      <div className="lab-list">
        <a className="lab-card lab-card-active" href={appPath('/labs/lead-views')}>
          <div className="lab-icon" aria-hidden="true">◎</div>
          <div>
            <h2>心臓３Dモデル</h2>
            <p>回す → 誘導を選ぶ → 光を見る</p>
          </div>
          <span className="lab-arrow" aria-hidden="true">›</span>
        </a>
        <a className="lab-card lab-card-active" href={appPath('/labs/electrodes')}>
          <div className="lab-icon" aria-hidden="true">●</div>
          <div>
            <h2>電極装着ラボ</h2>
            <p>電極を置く → 波形を比べる</p>
          </div>
          <span className="lab-arrow" aria-hidden="true">›</span>
        </a>

        <a className="lab-card lab-card-active" href={appPath('/labs/axis')}>
          <div className="lab-icon" aria-hidden="true">↗</div>
          <div>
            <h2>平均電気軸ラボ</h2>
            <p>QRSを動かす → 軸を見る</p>
          </div>
          <span className="lab-arrow" aria-hidden="true">›</span>
        </a>

        <a className="lab-card lab-card-active" href={appPath('/labs/wpw')}>
          <div className="lab-icon" aria-hidden="true">⌁</div>
          <div>
            <h2>WPW・ケント束ラボ</h2>
            <p>ケント束 ↔ V1波形</p>
          </div>
          <span className="lab-arrow" aria-hidden="true">›</span>
        </a>

        <a className="lab-card lab-card-active" href={appPath('/labs/pac')}>
          <div className="lab-icon" aria-hidden="true">P′</div>
          <div>
            <h2>心房期外収縮・起源ラボ</h2>
            <p>心房の起源 ↔ P′波</p>
          </div>
          <span className="lab-arrow" aria-hidden="true">›</span>
        </a>

        <a className="lab-card lab-card-active" href={appPath('/labs/pvc')}>
          <div className="lab-icon" aria-hidden="true">V</div>
          <div>
            <h2>心室性期外収縮・起源ラボ</h2>
            <p>心室の起源 ↔ QRS</p>
          </div>
          <span className="lab-arrow" aria-hidden="true">›</span>
        </a>

        <a className="lab-card lab-card-active" href={appPath('/labs/mi')}>
          <div className="lab-icon" aria-hidden="true">ST</div>
          <div>
            <h2>心筋梗塞・部位判定ラボ</h2>
            <p>心筋の領域 ↔ ST変化</p>
          </div>
          <span className="lab-arrow" aria-hidden="true">›</span>
        </a>

        <a className="lab-card lab-card-active" href={appPath('/labs/mirror')}>
          <div className="lab-icon" aria-hidden="true">⇅</div>
          <div>
            <h2>ミラーイメージ・ST変化ラボ</h2>
            <p>誘導を選ぶ → 両側のSTを比べる</p>
          </div>
          <span className="lab-arrow" aria-hidden="true">›</span>
        </a>
      </div>
    </AppShell>
  );
}
