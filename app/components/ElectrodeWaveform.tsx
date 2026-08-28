import type { ECGLead } from '@/app/domain/electrodes';
import { displayLeadName } from '@/app/domain/electrodes';
import type { ECGWaveformParameters } from '@/app/domain/waveform';

type Props = {
  lead: ECGLead;
  normal: ECGWaveformParameters;
  current: ECGWaveformParameters;
  changed: boolean;
  unavailableReason?: 'disconnected' | 'unsupported';
  pWaveShape?: 'single' | 'biphasic';
};

function trace(parameters: ECGWaveformParameters, pWaveShape: 'single' | 'biphasic' = 'single'): string {
  const y = (amplitude: number) => 34 - amplitude * 22;
  const p = parameters.pWaveAmplitude;
  const q = parameters.qWaveAmplitude;
  const r = parameters.rWaveAmplitude;
  const s = parameters.sWaveAmplitude;
  const st = parameters.stLevel;
  const t = st + parameters.tWaveAmplitude;
  const pWave = pWaveShape === 'biphasic'
    ? `C 22 34,23 ${y(0.05)},25 ${y(0.05)} C 27 ${y(0.05)},28 34,29 34 C 31 34,32 ${y(p)},34 ${y(p)} C 36 ${y(p)},38 34,39 34`
    : `C 23 34,25 ${y(p)},29 ${y(p)} C 33 ${y(p)},35 34,39 34`;
  return `M 4 34 L 20 34 ${pWave} L 51 34 L 55 ${y(q)} L 60 ${y(r)} L 66 ${y(s)} L 71 ${y(st)} L 96 ${y(st)} C 103 ${y(st)},107 ${y(t)},115 ${y(t)} C 123 ${y(t)},128 34,136 34 L 176 34`;
}

export function ElectrodeWaveform({ lead, normal, current, changed, unavailableReason, pWaveShape = 'single' }: Props) {
  const unavailable = unavailableReason !== undefined;
  const stateLabel = unavailableReason === 'disconnected' ? '未接続' : unavailableReason === 'unsupported' ? 'モデル外' : changed ? '変化' : '基準';
  const accessibleDescription = unavailableReason === 'disconnected'
    ? '電極未接続のため波形なし'
    : unavailableReason === 'unsupported'
      ? '簡易モデル対象外のため波形なし'
      : changed ? '装着ミス時と基準の比較' : '基準波形';
  return (
    <figure className={`electrode-waveform ${changed ? 'is-changed' : ''} ${unavailable ? 'is-unavailable' : ''}`}>
      <figcaption><strong>{displayLeadName(lead)}</strong><span>{stateLabel}</span></figcaption>
      <svg viewBox="0 0 180 68" role="img" aria-label={`${displayLeadName(lead)}誘導、${accessibleDescription}`}>
        <defs><pattern id={`electrode-grid-${lead}`} width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(20,110,214,.11)" strokeWidth=".6" /></pattern></defs>
        <rect width="180" height="68" />
        <rect className="electrode-wave-grid" width="180" height="68" fill={`url(#electrode-grid-${lead})`} />
        {!unavailable && changed && <path className="electrode-wave-normal" d={trace(normal)} />}
        {!unavailable && <path className="electrode-wave-current" d={trace(current, pWaveShape)} />}
        {unavailable && <text className="electrode-wave-unavailable" x="90" y="38">{unavailableReason === 'disconnected' ? '電極未接続' : 'モデル外'}</text>}
      </svg>
    </figure>
  );
}
