import type { ReactNode } from 'react';
import { appPath } from '@/app/domain/paths';

type AppShellProps = {
  title: string;
  children: ReactNode;
  backHref?: string;
  contentClassName?: string;
};

export function AppShell({ title, children, backHref = '/', contentClassName }: AppShellProps) {
  return (
    <main className="app-page">
      <header className="app-nav">
        <a className="back-link" href={appPath(backHref)} aria-label="前の画面へ戻る">
          <span aria-hidden="true">‹</span>
        </a>
        <p>{title}</p>
        <span className="nav-spacer" aria-hidden="true" />
      </header>
      <div className={`page-content ${contentClassName ?? ''}`.trim()}>{children}</div>
    </main>
  );
}
