export type ECGWaveformParameters = {
  paperSpeedMmPerSec: number;
  gainMmPerMv: number;
  heartRate: number;
  rrInterval: number;
  pWaveDuration: number;
  pWaveAmplitude: number;
  prInterval: number;
  qrsDuration: number;
  qWaveAmplitude: number;
  rWaveAmplitude: number;
  sWaveAmplitude: number;
  stLevel: number;
  tWaveDuration: number;
  tWaveAmplitude: number;
  qtInterval: number;
  pWaveOnset: number;
};

export type LeadWaveformPreset = {
  leadName: string;
  parameters: ECGWaveformParameters;
  showsLabels: boolean;
};

export const STANDARD_LEAD_II: ECGWaveformParameters = {
  paperSpeedMmPerSec: 25,
  gainMmPerMv: 10,
  heartRate: 75,
  rrInterval: 0.8,
  pWaveDuration: 0.08,
  pWaveAmplitude: 0.15,
  prInterval: 0.16,
  qrsDuration: 0.08,
  qWaveAmplitude: -0.1,
  rWaveAmplitude: 1,
  sWaveAmplitude: -0.2,
  stLevel: 0,
  tWaveDuration: 0.16,
  tWaveAmplitude: 0.3,
  qtInterval: 0.36,
  pWaveOnset: 0.1,
};

const replacing = (
  changes: Partial<Pick<ECGWaveformParameters,
    'pWaveAmplitude' | 'qWaveAmplitude' | 'rWaveAmplitude' |
    'sWaveAmplitude' | 'stLevel' | 'tWaveAmplitude'>>,
): ECGWaveformParameters => ({ ...STANDARD_LEAD_II, ...changes });

export const LEAD_PRESETS: LeadWaveformPreset[] = [
  { leadName: 'Ⅰ', parameters: replacing({ pWaveAmplitude: 0.12, qWaveAmplitude: -0.06, rWaveAmplitude: 0.75, sWaveAmplitude: -0.12, tWaveAmplitude: 0.22 }), showsLabels: false },
  { leadName: 'Ⅱ', parameters: STANDARD_LEAD_II, showsLabels: true },
  { leadName: 'Ⅲ', parameters: replacing({ pWaveAmplitude: 0.10, qWaveAmplitude: -0.05, rWaveAmplitude: 0.58, sWaveAmplitude: -0.16, tWaveAmplitude: 0.18 }), showsLabels: false },
  { leadName: 'aVR', parameters: replacing({ pWaveAmplitude: -0.08, qWaveAmplitude: 0.06, rWaveAmplitude: -0.18, sWaveAmplitude: -0.75, tWaveAmplitude: -0.18 }), showsLabels: false },
  { leadName: 'aVL', parameters: replacing({ pWaveAmplitude: 0.06, qWaveAmplitude: -0.03, rWaveAmplitude: 0.36, sWaveAmplitude: -0.08, tWaveAmplitude: 0.12 }), showsLabels: false },
  { leadName: 'aVF', parameters: replacing({ pWaveAmplitude: 0.13, qWaveAmplitude: -0.08, rWaveAmplitude: 0.88, sWaveAmplitude: -0.18, tWaveAmplitude: 0.26 }), showsLabels: false },
  { leadName: 'V1', parameters: replacing({ pWaveAmplitude: 0.05, qWaveAmplitude: -0.02, rWaveAmplitude: 0.18, sWaveAmplitude: -0.78, tWaveAmplitude: -0.08 }), showsLabels: false },
  { leadName: 'V2', parameters: replacing({ pWaveAmplitude: 0.07, qWaveAmplitude: -0.03, rWaveAmplitude: 0.35, sWaveAmplitude: -0.68, tWaveAmplitude: 0.10 }), showsLabels: false },
  { leadName: 'V3', parameters: replacing({ pWaveAmplitude: 0.08, qWaveAmplitude: -0.04, rWaveAmplitude: 0.58, sWaveAmplitude: -0.52, tWaveAmplitude: 0.18 }), showsLabels: false },
  { leadName: 'V4', parameters: replacing({ pWaveAmplitude: 0.10, qWaveAmplitude: -0.05, rWaveAmplitude: 0.92, sWaveAmplitude: -0.28, tWaveAmplitude: 0.28 }), showsLabels: false },
  { leadName: 'V5', parameters: replacing({ pWaveAmplitude: 0.11, qWaveAmplitude: -0.05, rWaveAmplitude: 1, sWaveAmplitude: -0.16, tWaveAmplitude: 0.30 }), showsLabels: false },
  { leadName: 'V6', parameters: replacing({ pWaveAmplitude: 0.10, qWaveAmplitude: -0.04, rWaveAmplitude: 0.86, sWaveAmplitude: -0.10, tWaveAmplitude: 0.25 }), showsLabels: false },
];

export function presetForLead(leadName: string): LeadWaveformPreset {
  const preset = LEAD_PRESETS.find((item) => item.leadName === leadName);
  if (!preset) throw new Error(`Unknown ECG lead: ${leadName}`);
  return preset;
}

export function replaceQRS(
  parameters: ECGWaveformParameters,
  q: number,
  r: number,
  s: number,
): ECGWaveformParameters {
  return {
    ...parameters,
    qWaveAmplitude: q / 10,
    rWaveAmplitude: r / 10,
    sWaveAmplitude: s / 10,
  };
}
