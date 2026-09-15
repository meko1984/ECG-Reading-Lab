import { AppShell } from '@/app/components/AppShell';

export const dynamic = 'force-static';

export default function ContactPage() {
  return (
    <AppShell title="お問い合わせ">
      <header className="page-header">
        <p className="eyebrow">意見を送る</p>
        <h1>意見・要望を送る</h1>
      </header>

      <section className="content-card contact-card">
        <div className="contact-mark" aria-hidden="true">X</div>
        <h2>XのDMで受け付けています</h2>
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

      <p className="model-note">患者情報・個人を特定できる情報は送らないでください。</p>
    </AppShell>
  );
}
