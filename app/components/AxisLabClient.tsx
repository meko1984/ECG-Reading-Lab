'use client';

import { useMemo, useState } from 'react';
import { calculateAxis, classificationReason, INITIAL_LEAD_I, INITIAL_LEAD_II, netQRS, signed, type LeadQRS } from '@/app/domain/axis';
import { presetForLead, replaceQRS } from '@/app/domain/waveform';
import { ECGWaveform } from '@/app/components/ECGWaveform';
import { HexaxialDiagram } from '@/app/components/HexaxialDiagram';
import { InfoCard } from '@/app/components/InfoCard';

type ActiveLead = 'Ⅰ' | 'Ⅱ';
type WaveKey = keyof LeadQRS;

const waveNames: Record<WaveKey, string> = { q: 'Q波', r: 'R波', s: 'S波' };
const clamp = (value: number) => Math.min(20, Math.max(-20, Math.round(value * 10) / 10));

export function AxisLabClient() {
  const [leadI, setLeadI] = useState<LeadQRS>(INITIAL_LEAD_I);
  const [leadII, setLeadII] = useState<LeadQRS>(INITIAL_LEAD_II);
  const [activeLead, setActiveLead] = useState<ActiveLead>('Ⅰ');
  const activeValues = activeLead === 'Ⅰ' ? leadI : leadII;
  const result = useMemo(() => calculateAxis(netQRS(leadI), netQRS(leadII)), [leadI, leadII]);
  const activePreset = presetForLead(activeLead);
  const previewParameters = replaceQRS(activePreset.parameters, activeValues.q, activeValues.r, activeValues.s);

  const setValue = (key: WaveKey, value: number) => {
    const update = (previous: LeadQRS) => ({ ...previous, [key]: clamp(value) });
    if (activeLead === 'Ⅰ') setLeadI(update);
    else setLeadII(update);
  };

  const chooseWithKeyboard = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    setActiveLead(activeLead === 'Ⅰ' ? 'Ⅱ' : 'Ⅰ');
  };

  return (
    <>
      <p className="page-lead">Ⅰ誘導とⅡ誘導のQRSを動かし、平均電気軸がどのように変化するかをご確認いただけます。</p>

      <section className="axis-result-card" aria-labelledby="axis-result-heading">
        <div>
          <p className="eyebrow">平均電気軸</p>
          <h1 id="axis-result-heading">{signed(result.angleDegrees)}°</h1>
          <p className="classification-badge">{result.classification}</p>
        </div>
        <p>{classificationReason(result.classification)}</p>
      </section>

      <section className="content-card diagram-card" aria-labelledby="diagram-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">六軸基準座標</p>
            <h2 id="diagram-heading">ベクトルを目で追う</h2>
          </div>
          <span className="live-badge">LIVE</span>
        </div>
        <HexaxialDiagram result={result} />
        <div className="diagram-legend" aria-label="領域の凡例">
          <span><i className="legend-normal" />正常</span>
          <span><i className="legend-left" />左軸</span>
          <span><i className="legend-right" />右軸</span>
          <span><i className="legend-extreme" />不定軸</span>
        </div>
      </section>

      <section className="content-card controls-card" aria-labelledby="controls-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">波形を調整</p>
            <h2 id="controls-heading">Q・R・Sの振幅</h2>
          </div>
          <span className="unit-badge">mm</span>
        </div>

        <div className="lead-tabs" role="tablist" aria-label="調整する誘導">
          {(['Ⅰ', 'Ⅱ'] as ActiveLead[]).map((lead) => (
            <button
              key={lead}
              type="button"
              role="tab"
              aria-selected={activeLead === lead}
              tabIndex={activeLead === lead ? 0 : -1}
              onClick={() => setActiveLead(lead)}
              onKeyDown={chooseWithKeyboard}
            >
              {lead}誘導
            </button>
          ))}
        </div>

        <ECGWaveform
          key={activeLead}
          parameters={previewParameters}
          label={`${activeLead}誘導の調整中の波形`}
          height={160}
        />

        <div className="slider-list">
          {(Object.keys(waveNames) as WaveKey[]).map((key) => (
            <div className="slider-row" key={key}>
              <div className="slider-label-row">
                <label htmlFor={`${activeLead}-${key}`}>{waveNames[key]}</label>
                <output htmlFor={`${activeLead}-${key}`}>{signed(activeValues[key])} mm</output>
              </div>
              <div className="slider-control-row">
                <button type="button" onClick={() => setValue(key, activeValues[key] - 0.1)} aria-label={`${waveNames[key]}を0.1ミリ下げる`}>−</button>
                <input
                  id={`${activeLead}-${key}`}
                  type="range"
                  min="-20"
                  max="20"
                  step="0.1"
                  value={activeValues[key]}
                  onChange={(event) => setValue(key, Number(event.target.value))}
                />
                <button type="button" onClick={() => setValue(key, activeValues[key] + 0.1)} aria-label={`${waveNames[key]}を0.1ミリ上げる`}>＋</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="content-card calculation-card" aria-labelledby="calculation-heading">
        <p className="eyebrow">計算の中身</p>
        <h2 id="calculation-heading">正味QRSから角度へ</h2>
        <dl>
          <div><dt>Ⅰ誘導</dt><dd>Q + R + S = <strong>{signed(result.leadI)} mm</strong></dd></div>
          <div><dt>Ⅱ誘導</dt><dd>Q + R + S = <strong>{signed(result.leadII)} mm</strong></dd></div>
          <div><dt>座標</dt><dd>x = {signed(result.x, 2)} / y = {signed(result.y, 2)}</dd></div>
        </dl>
      </section>

      <InfoCard title="学習用の簡易モデル">
        <p>波形の見え方と電気軸の関係を学ぶための補助ツールです。実際の判読・診断には使用しないでください。</p>
      </InfoCard>
    </>
  );
}
