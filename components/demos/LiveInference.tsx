import React, { useCallback, useEffect, useRef, useState } from 'react';
// Type-only import: erased entirely at compile time (tsconfig has
// isolatedModules: true, so this is guaranteed to produce zero runtime
// code and zero bundle/prerender side effects). The actual library is
// pulled in with a dynamic import() inside handleLoad, below, so it never
// touches the main bundle and never runs during prerender.
import type * as TransformersNS from '@huggingface/transformers';
import './LiveInference.css';

// ============================ LIVE IN-BROWSER INFERENCE ============================
// A real transformer running client-side via transformers.js, echoing the
// Financial News Sentiment project (see EARLIER_WORK in constants.tsx) —
// but deliberately NOT that project. That project fine-tuned GPT-Neo 125M
// and measured 92% accuracy on a 36,000+ article test set; this widget runs
// a small, off-the-shelf, general-purpose classifier with no fine-tuning at
// all. The two are not interchangeable and this component's copy says so.
//
// State machine: idle -> loading -> ready (-> running per submission, with
// its own runError channel that doesn't discard the loaded model) or ->
// error (load failed; "try again" re-enters loading from a clean state).
//
// Nothing above module scope touches window/document/navigator, and no
// state derived from them is computed during render — only inside
// useEffect/handlers — so this renders a plain, correct pre-load shell
// during prerender (see prerender.mjs) with no crash risk.

const MODEL_ID = 'Xenova/distilbert-base-uncased-finetuned-sst-2-english';
const LOAD_TIMEOUT_MS = 45_000;
const MAX_HISTORY = 8;

const SUGGESTIONS = [
    'Fed signals rate cuts as inflation cools faster than expected',
    'Chipmaker shares tumble after guidance falls short of estimates',
    'Retailer posts record quarterly profit, raises full-year outlook',
    'Regulators open investigation into bank’s lending practices',
];

type Phase = 'idle' | 'loading' | 'ready' | 'error';
type Device = 'webgpu' | 'wasm';

interface ProgressState {
    pct: number;
    loadedBytes: number;
    totalBytes: number;
    file: string | null;
}

interface LoadStats {
    device: Device;
    precision: string;
    loadTimeMs: number;
}

interface RunResult {
    id: number;
    text: string;
    label: string;
    score: number;
    latencyMs: number;
    tokenCount: number;
    tokensExact: boolean;
    device: Device;
    loadTimeMs: number;
}

// Any classifier pipeline callable transformers.js returns for a
// text-classification/sentiment-analysis task, typed loosely on purpose:
// modeling this precisely would mean re-deriving transformers.js's own
// generic overloads, which buys nothing here since every access below is
// guarded at runtime anyway (tokenizer shape, output shape).
type Classifier = {
    (text: string): Promise<Array<{ label: string; score: number }> | { label: string; score: number }>;
    tokenizer?: unknown;
    dispose?: () => Promise<void> | void;
};

async function detectWebGPU(): Promise<boolean> {
    if (typeof navigator === 'undefined') return false;
    const gpu = (navigator as Navigator & { gpu?: { requestAdapter: () => Promise<unknown> } }).gpu;
    if (!gpu || typeof gpu.requestAdapter !== 'function') return false;
    try {
        const adapter = await gpu.requestAdapter();
        return !!adapter;
    } catch {
        return false;
    }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('__li_timeout__')), ms);
        promise.then(
            (value) => {
                clearTimeout(timer);
                resolve(value);
            },
            (err) => {
                clearTimeout(timer);
                reject(err);
            }
        );
    });
}

function describeLoadError(err: unknown): string {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg === '__li_timeout__') {
        return `The model didn't finish downloading within ${Math.round(LOAD_TIMEOUT_MS / 1000)} seconds. ` +
            'That usually means a content blocker, VPN, or corporate proxy is quietly dropping the request. ' +
            'Disable it or switch networks, then press run again.';
    }
    if (/fetch|network|ERR_|NetworkError|Load failed/i.test(msg)) {
        return "The model files couldn't be downloaded. Hugging Face's file host may be blocked on this network. " +
            'Try a different network or disable content blockers, then press run again.';
    }
    if (/webgpu|gpu/i.test(msg)) {
        return "This browser couldn't run the model on WebGPU or WebAssembly. Try a recent Chrome, Edge, or Firefox.";
    }
    return `The model failed to load (${msg}). Press run to try again.`;
}

// Tries the real tokenizer for an exact count; falls back to a whitespace
// estimate if the shape doesn't match what's expected, which is marked as
// approximate wherever it's shown rather than presented as exact.
function countTokens(classifier: Classifier, text: string): { count: number; exact: boolean } {
    try {
        const tokenizerFn = classifier.tokenizer as unknown as
            | ((t: string, opts?: Record<string, unknown>) => { input_ids?: unknown })
            | undefined;
        if (typeof tokenizerFn === 'function') {
            const encoded = tokenizerFn(text, { return_tensor: false });
            const ids = encoded?.input_ids;
            if (Array.isArray(ids)) return { count: ids.length, exact: true };
            const dims = (ids as { dims?: number[] } | undefined)?.dims;
            if (Array.isArray(dims) && dims.length > 0) {
                return { count: dims[dims.length - 1], exact: true };
            }
            const size = (ids as { size?: number } | undefined)?.size;
            if (typeof size === 'number') return { count: size, exact: true };
        }
    } catch {
        // fall through to the approximation below
    }
    const approx = text.trim().split(/\s+/).filter(Boolean).length;
    return { count: approx, exact: false };
}

function formatBytes(bytes: number): string {
    return `${(bytes / 1_000_000).toFixed(1)} MB`;
}

function formatMs(ms: number): string {
    return ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${ms.toFixed(0)} ms`;
}

function titleCaseLabel(label: string): string {
    if (!label) return label;
    return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
}

const LiveInference: React.FC = () => {
    const [phase, setPhase] = useState<Phase>('idle');
    const [progress, setProgress] = useState<ProgressState>({ pct: 0, loadedBytes: 0, totalBytes: 0, file: null });
    const [loadStats, setLoadStats] = useState<LoadStats | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [runError, setRunError] = useState<string | null>(null);
    const [history, setHistory] = useState<RunResult[]>([]);

    const classifierRef = useRef<Classifier | null>(null);
    const runIdRef = useRef(0);

    // Release WebGPU/WASM resources if the visitor navigates away mid-session.
    useEffect(() => {
        return () => {
            void classifierRef.current?.dispose?.();
        };
    }, []);

    const handleLoad = useCallback(async () => {
        setPhase('loading');
        setLoadError(null);
        setProgress({ pct: 0, loadedBytes: 0, totalBytes: 0, file: null });

        if (typeof navigator !== 'undefined' && 'onLine' in navigator && navigator.onLine === false) {
            setLoadError('This browser reports no network connection right now. Reconnect, then press run again.');
            setPhase('error');
            return;
        }

        const progressCallback = (info: TransformersNS.ProgressInfo) => {
            if (info.status === 'progress_total') {
                setProgress({ pct: info.progress, loadedBytes: info.loaded, totalBytes: info.total, file: null });
            } else if (info.status === 'initiate') {
                setProgress((p) => ({ ...p, file: info.file }));
            }
        };

        const start = performance.now();

        try {
            const mod = await import('@huggingface/transformers');
            const supportsWebGPU = await detectWebGPU();
            let device: Device = supportsWebGPU ? 'webgpu' : 'wasm';

            let classifier: Classifier;
            try {
                classifier = (await withTimeout(
                    mod.pipeline('sentiment-analysis', MODEL_ID, { device, progress_callback: progressCallback }),
                    LOAD_TIMEOUT_MS
                )) as unknown as Classifier;
            } catch (firstErr) {
                if (device !== 'webgpu') throw firstErr;
                // WebGPU looked available but failed to actually stand up a
                // session (driver quirk, unsupported op, etc.) — fall back
                // to WASM rather than surface an avoidable error.
                device = 'wasm';
                setProgress({ pct: 0, loadedBytes: 0, totalBytes: 0, file: null });
                classifier = (await withTimeout(
                    mod.pipeline('sentiment-analysis', MODEL_ID, { device, progress_callback: progressCallback }),
                    LOAD_TIMEOUT_MS
                )) as unknown as Classifier;
            }

            const loadTimeMs = performance.now() - start;
            classifierRef.current = classifier;
            setLoadStats({ device, precision: device === 'webgpu' ? 'fp32' : 'int8 (quantized)', loadTimeMs });
            setPhase('ready');
        } catch (err) {
            setLoadError(describeLoadError(err));
            setPhase('error');
        }
    }, []);

    const runClassification = useCallback(
        async (rawText: string) => {
            const text = rawText.trim();
            const classifier = classifierRef.current;
            if (!text || !classifier || !loadStats) return;

            setIsRunning(true);
            setRunError(null);
            try {
                const start = performance.now();
                const output = await classifier(text);
                const latencyMs = performance.now() - start;
                const first = Array.isArray(output) ? output[0] : output;
                const label = first?.label ?? 'unknown';
                const score = typeof first?.score === 'number' ? first.score : 0;
                const { count, exact } = countTokens(classifier, text);

                runIdRef.current += 1;
                const entry: RunResult = {
                    id: runIdRef.current,
                    text,
                    label,
                    score,
                    latencyMs,
                    tokenCount: count,
                    tokensExact: exact,
                    device: loadStats.device,
                    loadTimeMs: loadStats.loadTimeMs,
                };
                setHistory((h) => [entry, ...h].slice(0, MAX_HISTORY));
            } catch (err) {
                setRunError(
                    err instanceof Error
                        ? `The model couldn't classify that text (${err.message}). Try again, or try shorter text.`
                        : "The model couldn't classify that text. Try again."
                );
            } finally {
                setIsRunning(false);
            }
        },
        [loadStats]
    );

    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            void runClassification(inputValue);
        },
        [inputValue, runClassification]
    );

    const handleSuggestion = useCallback(
        (headline: string) => {
            setInputValue(headline);
            void runClassification(headline);
        },
        [runClassification]
    );

    return (
        <>
            <p className="li-intro measure">
                This runs <span className="mono">{MODEL_ID}</span>, a small, off-the-shelf sentiment classifier,
                entirely in your browser — no server call, nothing sent anywhere. It is not the GPT-Neo model
                fine-tuned in the Financial News Sentiment project above, and its output here carries none of that
                project's measured 92% accuracy. Treat it as a live demonstration of in-browser inference, not a
                benchmark of that work.
            </p>

            <div className="li-panel surface">
                {phase === 'idle' && (
                    <div className="li-idle">
                        <p className="li-idle__copy measure">
                            Nothing is downloaded until you ask for it. Pressing run fetches the model files from
                            Hugging Face and runs the classifier with WebGPU if this browser supports it, falling
                            back to WebAssembly otherwise.
                        </p>
                        <button type="button" className="li-btn li-btn--primary" onClick={() => void handleLoad()}>
                            Run the model (about 65 MB download)
                        </button>
                    </div>
                )}

                {phase === 'loading' && (
                    <div className="li-loading" role="status" aria-live="polite">
                        <p className="li-loading__label">
                            {progress.totalBytes > 0
                                ? `Downloading model files — ${formatBytes(progress.loadedBytes)} of ${formatBytes(progress.totalBytes)}`
                                : progress.file
                                    ? `Starting download — ${progress.file}`
                                    : 'Starting download…'}
                        </p>
                        <div
                            className="li-progress"
                            role="progressbar"
                            aria-valuenow={Math.round(progress.pct)}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label="Model download progress"
                        >
                            <div className="li-progress__fill" style={{ width: `${Math.max(2, progress.pct)}%` }} />
                        </div>
                        <p className="li-loading__pct tabular-nums">{Math.round(progress.pct)}%</p>
                    </div>
                )}

                {phase === 'error' && (
                    <div className="li-error" role="alert">
                        <p className="li-error__message measure">{loadError}</p>
                        <button type="button" className="li-btn li-btn--quiet" onClick={() => void handleLoad()}>
                            Try again
                        </button>
                    </div>
                )}

                {phase === 'ready' && loadStats && (
                    <div className="li-ready">
                        <p className="li-loaded-note tabular-nums" role="status">
                            Loaded in {formatMs(loadStats.loadTimeMs)} on {loadStats.device === 'webgpu' ? 'WebGPU' : 'WebAssembly'}
                            {' '}({loadStats.precision})
                        </p>

                        <form className="li-form" onSubmit={handleSubmit}>
                            <label htmlFor="li-headline" className="li-form__label">
                                Headline to classify
                            </label>
                            <div className="li-form__row">
                                <input
                                    id="li-headline"
                                    type="text"
                                    className="li-input"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type a finance headline…"
                                    autoComplete="off"
                                />
                                <button
                                    type="submit"
                                    className="li-btn li-btn--primary"
                                    disabled={isRunning || inputValue.trim().length === 0}
                                >
                                    {isRunning ? 'Classifying…' : 'Classify the headline'}
                                </button>
                            </div>
                        </form>

                        <div className="li-suggestions">
                            <p className="li-suggestions__label">Or run one of these:</p>
                            <div className="li-suggestions__list">
                                {SUGGESTIONS.map((headline) => (
                                    <button
                                        key={headline}
                                        type="button"
                                        className="li-chip"
                                        disabled={isRunning}
                                        onClick={() => void handleSuggestion(headline)}
                                    >
                                        {headline}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {runError && (
                            <p className="li-run-error" role="alert">
                                {runError}
                            </p>
                        )}

                        {history.length > 0 && (
                            <div className="li-table-wrap">
                                <table className="li-table">
                                    <caption className="sr-only">In-browser inference runs, most recent first</caption>
                                    <thead>
                                        <tr>
                                            <th scope="col">Headline</th>
                                            <th scope="col">Result</th>
                                            <th scope="col">Confidence</th>
                                            <th scope="col">Device</th>
                                            <th scope="col">Load time</th>
                                            <th scope="col">Latency</th>
                                            <th scope="col">Tokens/s</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((r) => {
                                            const tps = r.latencyMs > 0 ? r.tokenCount / (r.latencyMs / 1000) : null;
                                            return (
                                                <tr key={r.id}>
                                                    <th scope="row" className="li-table__headline">{r.text}</th>
                                                    <td>{titleCaseLabel(r.label)}</td>
                                                    <td className="tabular-nums">{(r.score * 100).toFixed(1)}%</td>
                                                    <td>{r.device === 'webgpu' ? 'WebGPU' : 'WASM'}</td>
                                                    <td className="tabular-nums">{formatMs(r.loadTimeMs)}</td>
                                                    <td className="tabular-nums">{formatMs(r.latencyMs)}</td>
                                                    <td className="tabular-nums">
                                                        {tps === null
                                                            ? 'n/a'
                                                            : `${r.tokensExact ? '' : '~'}${tps.toFixed(1)}`}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                <p className="li-domain-note">
                                    Expect it to get some of these wrong. SST-2 is trained on
                                    movie reviews, so finance vocabulary sits outside its
                                    domain: it reads &ldquo;rate cuts&rdquo; and &ldquo;falls
                                    short&rdquo; on general sentiment rather than market
                                    meaning. That domain gap is the reason the Financial News
                                    Sentiment project fine-tuned its own classifier on 36,000
                                    financial articles instead of reaching for a general model.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default LiveInference;
