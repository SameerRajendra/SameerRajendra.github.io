import React, { useState } from 'react';
import './KvExplorer.css';

// ======================= KV CACHE & SERVING CAPACITY =======================
// Lazily mounted by App.tsx (see the DeferredDemo/LazyDemo wrapper there) —
// this file only ever renders the calculator itself; the section's <h2> and
// id live eagerly in App.tsx so the contents rail and Header's
// IntersectionObserver (which queries document.getElementById once on
// mount) always find the section, even before this chunk has loaded.
//
// Everything below is a first-principles PROJECTION from Llama-3.1-8B's
// published architecture constants — nothing here is looked up per control
// combination. A small, fixed set of real measurements taken on an H100 is
// shown alongside it, labelled separately, wherever one exists. The two are
// never reconciled: where they disagree, that gap is real (reserved
// activation/workspace memory the projection does not model) and is stated,
// not hidden.

type Precision = 'fp16' | 'fp8';

interface ContextOption {
    tokens: number;
    label: string;
}

interface PrecisionOption {
    id: Precision;
    label: string;
    bytes: number;
}

const CONTEXTS: ContextOption[] = [
    { tokens: 4096, label: '4K' },
    { tokens: 8192, label: '8K' },
    { tokens: 16384, label: '16K' },
    { tokens: 32768, label: '32K' },
    { tokens: 65536, label: '64K' },
];

const PRECISIONS: PrecisionOption[] = [
    { id: 'fp16', label: 'FP16', bytes: 2 },
    { id: 'fp8', label: 'FP8 (e4m3)', bytes: 1 },
];

// Llama-3.1-8B architecture constants.
const LAYERS = 32;
const KV_HEADS = 8; // grouped-query attention
const HEAD_DIM = 128;
const PARAMS = 8e9;
const HBM_BYTES = 80e9; // H100 80GB, fixed — no other hardware modelled

// Weights are always stored FP16 regardless of the KV cache precision chosen.
const WEIGHTS_BYTES = PARAMS * 2;
const AVAILABLE_BYTES = HBM_BYTES - WEIGHTS_BYTES;

const kvBytesPerToken = (dtypeBytes: number) => 2 * LAYERS * KV_HEADS * HEAD_DIM * dtypeBytes;
const kvBytesPerSeq = (contextTokens: number, dtypeBytes: number) => contextTokens * kvBytesPerToken(dtypeBytes);
const concurrentSeqs = (contextTokens: number, dtypeBytes: number) =>
    Math.floor(AVAILABLE_BYTES / kvBytesPerSeq(contextTokens, dtypeBytes));

// Real measurements taken on an H100, from the committed
// LLM_Inference_Optimization repo. Deliberately a short, fixed list — most
// context/precision combinations have no measurement, and the UI says so
// rather than inventing one.
interface MeasuredPoint {
    contextTokens: number;
    precision: Precision;
    value: number;
}

const MEASURED: MeasuredPoint[] = [
    { contextTokens: 65536, precision: 'fp16', value: 7 },
    { contextTokens: 65536, precision: 'fp8', value: 14 },
    { contextTokens: 4096, precision: 'fp16', value: 111 },
    { contextTokens: 4096, precision: 'fp8', value: 223 },
];

const findMeasured = (contextTokens: number, precision: Precision): number | null =>
    MEASURED.find((m) => m.contextTokens === contextTokens && m.precision === precision)?.value ?? null;

const fmtInt = (n: number) => Math.round(n).toLocaleString('en-US');
const fmtGB = (bytes: number, decimals = 2) => (bytes / 1e9).toFixed(decimals);
const fmtKiB = (bytes: number) => (bytes / 1024).toLocaleString('en-US');

const KvExplorer: React.FC = () => {
    const [contextTokens, setContextTokens] = useState<number>(65536);
    const [precisionId, setPrecisionId] = useState<Precision>('fp16');

    const contextOpt = CONTEXTS.find((c) => c.tokens === contextTokens) ?? CONTEXTS[4];
    const precision = PRECISIONS.find((p) => p.id === precisionId) ?? PRECISIONS[0];

    const perTokenBytes = kvBytesPerToken(precision.bytes);
    const perSeqBytes = kvBytesPerSeq(contextTokens, precision.bytes);
    const projected = concurrentSeqs(contextTokens, precision.bytes);
    const measured = findMeasured(contextTokens, precisionId);

    const weightsFrac = WEIGHTS_BYTES / HBM_BYTES;
    const kvSeqFrac = Math.min(1, perSeqBytes / HBM_BYTES);

    const comboKey = `${contextTokens}-${precisionId}`;

    return (
        <div className="kv-explorer">
            <div className="kv-controls">
                <div className="kv-field">
                    <span className="kv-field__label" id="kv-context-label">
                        Context length
                    </span>
                    <div className="kv-segmented" role="group" aria-labelledby="kv-context-label">
                        {CONTEXTS.map((c) => (
                            <button
                                key={c.tokens}
                                type="button"
                                className="kv-seg-btn"
                                aria-pressed={contextTokens === c.tokens}
                                onClick={() => setContextTokens(c.tokens)}
                            >
                                {c.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="kv-field">
                    <span className="kv-field__label" id="kv-precision-label">
                        KV cache precision
                    </span>
                    <div className="kv-segmented" role="group" aria-labelledby="kv-precision-label">
                        {PRECISIONS.map((p) => (
                            <button
                                key={p.id}
                                type="button"
                                className="kv-seg-btn"
                                aria-pressed={precisionId === p.id}
                                onClick={() => setPrecisionId(p.id)}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                <p className="kv-gpu">
                    <span className="kv-field__label">GPU</span>
                    <span className="kv-gpu__value">
                        H100 80GB <span className="kv-fixed-tag">fixed</span>
                    </span>
                </p>
            </div>

            <div className="kv-readout">
                <dl className="kv-stats">
                    <div className="kv-stat">
                        <dt>KV per token</dt>
                        <dd className="tabular-nums">{fmtKiB(perTokenBytes)} KiB</dd>
                    </div>
                    <div className="kv-stat">
                        <dt>KV per sequence</dt>
                        <dd className="tabular-nums">{fmtGB(perSeqBytes)} GB</dd>
                    </div>
                    <div className="kv-stat">
                        <dt>Weights (FP16)</dt>
                        <dd className="tabular-nums">{fmtGB(WEIGHTS_BYTES, 1)} GB</dd>
                    </div>
                </dl>

                <div className="kv-bar-group">
                    <div className="kv-bar-row">
                        <span className="kv-bar-row__label">Weights</span>
                        <div className="kv-bar-track">
                            <div
                                className="kv-bar-fill kv-bar-fill--weights"
                                style={{ transform: `scaleX(${weightsFrac})` }}
                            />
                        </div>
                        <span className="kv-bar-row__value tabular-nums">{fmtGB(WEIGHTS_BYTES, 1)} GB</span>
                    </div>
                    <div className="kv-bar-row">
                        <span className="kv-bar-row__label">One sequence&rsquo;s KV cache</span>
                        <div className="kv-bar-track">
                            <div
                                className="kv-bar-fill kv-bar-fill--kv"
                                style={{ transform: `scaleX(${kvSeqFrac})` }}
                            />
                        </div>
                        <span className="kv-bar-row__value tabular-nums">{fmtGB(perSeqBytes)} GB</span>
                    </div>
                    <p className="kv-bar-caption">Share of 80 GB HBM on one H100.</p>
                </div>

                <div className="kv-result" aria-live="polite">
                    <p className="kv-result__label">
                        Concurrent sequences at {contextOpt.label} context, {precision.label}
                    </p>
                    <div className="kv-result__values">
                        <div className="kv-result__value kv-result__value--projected" key={`proj-${comboKey}`}>
                            <span className="kv-result__number tabular-nums">{fmtInt(projected)}</span>
                            <span className="kv-result__tag">projected</span>
                        </div>
                        {measured !== null && (
                            <div className="kv-result__value kv-result__value--measured" key={`meas-${comboKey}`}>
                                <span className="kv-result__number tabular-nums">{fmtInt(measured)}</span>
                                <span className="kv-result__tag">measured on H100</span>
                            </div>
                        )}
                    </div>
                    {measured === null ? (
                        <p className="kv-result__note">
                            No H100 measurement recorded for this combination — projection only.
                        </p>
                    ) : projected === measured ? (
                        <p className="kv-result__note">Projection and measurement agree at this setting.</p>
                    ) : (
                        <p className="kv-result__note">
                            Off by {fmtInt(Math.abs(projected - measured))}: real serving reserves activation and
                            workspace memory this projection does not model.
                        </p>
                    )}
                </div>

                <div className="kv-formula">
                    <p className="kv-formula__line mono">
                        concurrent sequences = floor((80 GB − weights) / (context × 2 × layers × KV heads × head dim
                        × precision bytes))
                    </p>
                    <p className="kv-formula__line kv-formula__line--sub tabular-nums mono">
                        = floor(({fmtInt(HBM_BYTES)} − {fmtInt(WEIGHTS_BYTES)}) / ({fmtInt(contextTokens)} ×{' '}
                        {fmtInt(perTokenBytes)})) = floor({fmtInt(AVAILABLE_BYTES)} / {fmtInt(perSeqBytes)}) ={' '}
                        {fmtInt(projected)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default KvExplorer;
