import type { ReactNode } from 'react';

type InfoCardProps = {
  title: string;
  children: ReactNode;
};

export function InfoCard({ title, children }: InfoCardProps) {
  return (
    <aside className="info-card page-info-card">
      <span className="info-icon" aria-hidden="true">i</span>
      <div>
        <h2>{title}</h2>
        <details className="info-message"><summary>補足</summary>{children}</details>
      </div>
    </aside>
  );
}
