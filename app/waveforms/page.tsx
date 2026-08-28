import { AppShell } from '@/app/components/AppShell';
import { ECGWaveform } from '@/app/components/ECGWaveform';
import { InfoCard } from '@/app/components/InfoCard';
import { LEAD_PRESETS } from '@/app/domain/waveform';

export const dynamic = 'force-static';

export default function WaveformsPage() {
  return (
    <AppShell title="基本波形">
      <header className="page-header">
        <p className="eyebrow">12誘導を見比べる</p>
        <h1>基本波形を見る</h1>
        <p className="page-lead">同じ心臓の電気を12方向から見たときの、代表的な波形を見比べられます。</p>
      </header>

      <div className="waveform-list">
        {LEAD_PRESETS.map((preset) => (
          <article className="content-card waveform-card" key={preset.leadName}>
            <div className="waveform-card-heading">
              <h2>{preset.leadName}</h2>
              <span>{preset.leadName.startsWith('V') ? '胸部誘導' : '四肢誘導'}</span>
            </div>
            <ECGWaveform
              parameters={preset.parameters}
              showsLabels={preset.showsLabels}
              label={`${preset.leadName}誘導の基本波形`}
            />
          </article>
        ))}
      </div>

      <InfoCard title="形はあくまで代表例">
        <p>個人差や記録条件によって波形は変化します。誘導ごとの向きの違いに注目して見比べてください。</p>
      </InfoCard>
    </AppShell>
  );
}
