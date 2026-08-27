import { appPath } from '@/app/domain/paths';

export const dynamic = 'force-static';

const actions = [
  { href: '/waveforms', icon: '⌁', label: '基本波形をみる' },
  { href: '/labs', icon: '▣', label: '研究室' },
  { href: '/contact', icon: '✉', label: 'お問い合わせ' },
];

export default function Home() {
  return (
    <main className="home-page">
      <div className="home-decoration" aria-hidden="true">
        <span className="decor-circle decor-circle-large" />
        <span className="decor-circle decor-circle-small" />
        <span className="decor-dots" />
        <span className="decor-rings" />
        <span className="decor-hexagon decor-hexagon-one" />
        <span className="decor-hexagon decor-hexagon-two" />
        <span className="decor-ecg-line">⌁⌁⌁</span>
      </div>

      <div className="home-content">
        <header className="hero">
          <h1>心電図よみときラボ</h1>
          <div className="hero-subtitle" aria-label="ECG Reading Lab">
            <span aria-hidden="true" />
            <strong>ECG Reading Lab</strong>
            <span aria-hidden="true" />
          </div>
          <p>
            心電図を読む前の考え方を、
            <br />
            図と波形で見える化する学習ラボです。
          </p>
        </header>

        <nav className="home-actions" aria-label="メインメニュー">
          {actions.map((action) => (
            <a className="home-action" href={appPath(action.href)} key={action.href}>
              <span className="home-action-icon" aria-hidden="true">
                {action.icon}
              </span>
              <span>{action.label}</span>
            </a>
          ))}
        </nav>

        <aside className="info-card" aria-label="利用上の注意">
          <span className="info-icon" aria-hidden="true">
            i
          </span>
          <div>
            <h2>学習用の簡易モデルです</h2>
            <p>
              このアプリは心電図判読や診断を代行するものではありません。
              <br />
              心電図の考え方を学ぶための補助ツールです。
            </p>
          </div>
        </aside>

        <footer className="home-footer">
          <p>version 0.1.5</p>
          <p>Created by mekomikudo</p>
        </footer>
      </div>
    </main>
  );
}
