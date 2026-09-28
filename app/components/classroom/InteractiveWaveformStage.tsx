'use client';

import { useState } from 'react';
import type { VisualKind } from '@/app/content/classroom/types';
import { FoundationVisual } from './FoundationVisual';
import { RhythmVisual } from './RhythmVisual';
import { ConditionVisual } from './ConditionVisual';
import { DeviceVisual } from './DeviceVisual';
import { PracticeVisual } from './PracticeVisual';
import { AdvancedVisual } from './AdvancedVisual';
import { TwelveLeadSchematic } from './TwelveLeadSchematic';
import styles from './Classroom.module.css';

function LessonVisual({ kind, variant, onVariantChange }: { kind: VisualKind; variant: number; onVariantChange: (value: number) => void }) {
  switch (kind) {
    case 'cycle': case 'leads': case 'rate': case 'pr': case 'qrs': case 'axis': case 'st': case 'qt':
      return <FoundationVisual kind={kind} variant={variant} onVariantChange={onVariantChange}/>;
    case 'pac': case 'pvc': case 'af': case 'flutter': case 'svt': case 'wpw': case 'ventricular': case 'sinus': case 'av':
      return <RhythmVisual kind={kind} variant={variant} onVariantChange={onVariantChange}/>;
    case 'bundle': case 'ischemia': case 'electrolytes':
      return <ConditionVisual kind={kind} variant={variant} onVariantChange={onVariantChange}/>;
    case 'pacing': case 'devices':
      return <DeviceVisual kind={kind} variant={variant} onVariantChange={onVariantChange}/>;
    case 'practice': return <PracticeVisual/>;
    case 'j-wave': case 'structure': case 'takotsubo': case 'epsilon': case 'amyloid': case 'right-heart': case 'pericardium': case 'position': case 'pediatric':
      return <AdvancedVisual kind={kind} variant={variant} onVariantChange={onVariantChange}/>;
    default: {
      const unhandled: never = kind;
      throw new Error(`Unknown classroom visual: ${unhandled}`);
    }
  }
}

export function InteractiveWaveformStage({ kind }: { kind: VisualKind }) {
  const [variant, setVariant] = useState(kind === 'right-heart' ? 1 : 0);
  return <div className={styles.waveformStage} data-classroom-kind={kind} data-waveform-variant={variant}>
    <LessonVisual kind={kind} variant={variant} onVariantChange={setVariant}/>
    <TwelveLeadSchematic kind={kind} variant={variant}/>
  </div>;
}
