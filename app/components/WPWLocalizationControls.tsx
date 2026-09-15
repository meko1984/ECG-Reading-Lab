import { WPWMiniWaveform, WPWWaveform } from '@/app/components/WPWWaveform';
import { WPW_TYPES, wpwType, type WPWTypeId } from '@/app/domain/wpw';
import {
  deltaPolarityLabel,
  type DeltaPolarity,
  type LocalizationInput,
} from '@/app/domain/wpw-localization';

type WPWLocalizationControlsProps = {
  value: LocalizationInput;
  onChange: (value: LocalizationInput) => void;
};

const deltaOptions: { value: DeltaPolarity; symbol: string }[] = [
  { value: 'positive', symbol: '＋' },
  { value: 'isoelectric', symbol: '±' },
  { value: 'negative', symbol: '−' },
];

function inferiorLeadPath(delta: DeltaPolarity): { full: string; delta: string } {
  const baseline = 40;
  const deltaY = delta === 'positive' ? 29 : delta === 'negative' ? 51 : baseline;
  return {
    full: `M3 ${baseline}H20C24 ${baseline} 25 31 30 31C35 31 36 ${baseline} 41 ${baseline}H51L65 ${deltaY}L76 12L84 62L96 ${baseline}H147`,
    delta: `M51 ${baseline}L65 ${deltaY}`,
  };
}

function InferiorWaveform({ lead, delta }: { lead: string; delta: DeltaPolarity }) {
  const path = inferiorLeadPath(delta);
  return (
    <svg
      className="wpw-inferior-waveform"
      viewBox="0 0 150 76"
      role="img"
      aria-label={`${lead}誘導の模式波形。初期デルタ波は${deltaPolarityLabel(delta)}。`}
    >
      <path className="wpw-strip-baseline" d="M3 40H147" />
      <path className="wpw-strip-trace" d={path.full} />
      <path className="wpw-strip-delta" d={path.delta} />
      <text className="wpw-inferior-lead-label" x="7" y="17">{lead}</text>
      <text className="wpw-inferior-polarity-label" x="143" y="17">Δ {deltaPolarityLabel(delta)}</text>
    </svg>
  );
}

function TypeButton({ typeId, selected, onSelect }: {
  typeId: WPWTypeId;
  selected: boolean;
  onSelect: (typeId: WPWTypeId) => void;
}) {
  const type = wpwType(typeId);
  return (
    <button
      type="button"
      className="wpw-v1-type-button"
      aria-pressed={selected}
      onClick={() => onSelect(typeId)}
    >
      <WPWMiniWaveform morphology={type.waveform.morphology} />
      <span>{type.typeName}</span>
      <small>{type.v1Pattern}</small>
    </button>
  );
}

function InferiorLeadCard({ lead, field, value, input, onChange }: {
  lead: 'II' | 'III' | 'aVF';
  field: 'leadII' | 'leadIII' | 'leadAVF';
  value: DeltaPolarity;
  input: LocalizationInput;
  onChange: WPWLocalizationControlsProps['onChange'];
}) {
  return (
    <section className="wpw-inferior-card" aria-label={`${lead}誘導のデルタ波`}>
      <InferiorWaveform lead={lead} delta={value} />
      <div className="wpw-polarity-options" aria-label={`${lead}誘導の初期デルタ波`}>
        {deltaOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            aria-label={`${lead}誘導のデルタ波：${deltaPolarityLabel(option.value)}`}
            onClick={() => onChange({ ...input, [field]: option.value })}
          >
            {option.symbol}
          </button>
        ))}
      </div>
    </section>
  );
}

export function WPWLocalizationControls({ value, onChange }: WPWLocalizationControlsProps) {
  const selectedType = wpwType(value.v1Type);
  const selectType = (v1Type: WPWTypeId) => onChange({ ...value, v1Type });

  return (
    <div className="wpw-four-lead-controls">
      <section className="wpw-v1-panel" aria-labelledby="wpw-v1-heading">
        <div className="wpw-panel-heading">
          <div>
            <span>まずV1</span>
            <h3 id="wpw-v1-heading">A・C・Bの入口</h3>
          </div>
          <strong>{selectedType.typeName}</strong>
        </div>

        <div className="wpw-v1-layout">
          <WPWWaveform waveform={selectedType.waveform} pattern={selectedType.v1Pattern} />
          <div className="wpw-v1-type-options" aria-label="V1誘導の代表波形">
            {WPW_TYPES.map((type) => (
              <TypeButton
                key={type.id}
                typeId={type.id}
                selected={value.v1Type === type.id}
                onSelect={selectType}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="wpw-inferior-panel" aria-labelledby="wpw-inferior-heading">
        <div className="wpw-panel-heading">
          <div>
            <span>つぎに下壁誘導</span>
            <h3 id="wpw-inferior-heading">前方・中間・後方</h3>
          </div>
          <strong>初期20 ms</strong>
        </div>

        <div className="wpw-inferior-grid">
          <InferiorLeadCard lead="II" field="leadII" value={value.leadII} input={value} onChange={onChange} />
          <InferiorLeadCard lead="III" field="leadIII" value={value.leadIII} input={value} onChange={onChange} />
          <InferiorLeadCard lead="aVF" field="leadAVF" value={value.leadAVF} input={value} onChange={onChange} />
        </div>
      </section>
    </div>
  );
}
