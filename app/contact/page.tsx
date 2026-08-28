import { AppShell } from '@/app/components/AppShell';
import { InfoCard } from '@/app/components/InfoCard';

export const dynamic = 'force-static';

export default function ContactPage() {
  return (
    <AppShell title="お問い合わせ">
      <header className="page-header">
        <p className="eyebrow">意見を送る</p>
        <h1>意見・要望を送る</h1>
        <p className="page-lead">分かりにくかった点や、追加してほしい研究室のテーマを受け付けています。</p>
      </header>

      <section className="content-card contact-card">
        <div className="contact-mark" aria-hidden="true">X</div>
        <h2>XのDMで受け付けています</h2>
        <p>意見・要望は、下のアカウントへDMで送れます。</p>
        <a
          className="contact-x-link"
          href="https://x.com/mekomikudoV"
          target="_blank"
          rel="noopener noreferrer"
          referrerPolicy="no-referrer"
        >
          @mekomikudoV
          <span aria-hidden="true">↗</span>
        </a>
      </section>

      <InfoCard title="お問い合わせ時のお願い">
        <p>このアプリ内には入力フォームがありません。XのDMをご利用いただく際は、患者情報や個人を特定できる情報を送信しないでください。</p>
      </InfoCard>
    </AppShell>
  );
}
