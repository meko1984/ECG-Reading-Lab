export type FoundationKind = 'cycle' | 'leads' | 'rate' | 'pr' | 'qrs' | 'axis' | 'st' | 'qt';
export type RhythmKind = 'pac' | 'pvc' | 'af' | 'flutter' | 'svt' | 'wpw' | 'ventricular' | 'sinus' | 'av';
export type AdvancedKind = 'j-wave' | 'structure' | 'takotsubo' | 'epsilon' | 'amyloid' | 'right-heart' | 'pericardium' | 'position' | 'pediatric';
export type VisualKind = FoundationKind | RhythmKind | AdvancedKind | 'bundle' | 'ischemia' | 'electrolytes' | 'pacing' | 'devices' | 'practice';

export type Lesson = {
  slug: string;
  visual: VisualKind;
  lead: string;
  points: { title: string; body: string }[];
  pitfalls: string[];
  question: { prompt: string; answers: string[]; correct: number; explanation: string };
  sources: { title: string; url: string; detail?: string }[];
  labs: { title: string; slug: string }[];
  recordId?: string;
};
