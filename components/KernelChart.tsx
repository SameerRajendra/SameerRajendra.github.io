import React from 'react';
import { KERNEL_BENCHMARK } from '../constants';

// ============================ HERO CHART ============================
// Hand-built inline SVG, no chart library. Every figure below is read from
// KERNEL_BENCHMARK (constants.tsx) — nothing here is a hardcoded number.
//
// Form: a two-series connected-line comparison (dense-attention baseline vs.
// the GQA-dense decode kernel) across three ordered context lengths, on a
// log y-axis (latency spans 0.9 ms to 71.8 ms — linear would crush the small
// values). Two named series -> categorical color, both drawn, both labeled,
// legend always present. Below ~560px the plotted chart is dropped in favor
// of the same three rows as a table with inline proportional bars (CSS
// media query only — no window measurement during render).

const VIEW_W = 520;
const VIEW_H = 320;
const MARGIN = { top: 34, right: 20, bottom: 40, left: 42 };
const PLOT_W = VIEW_W - MARGIN.left - MARGIN.right;
const PLOT_H = VIEW_H - MARGIN.top - MARGIN.bottom;
const LABEL_CLEARANCE = 20;

function niceLogDomain(values: number[]): [number, number] {
    const min = Math.min(...values);
    const max = Math.max(...values);
    // Multiplicative headroom (not a data value) so extreme points and their
    // labels never sit flush against the plot edge.
    return [min * 0.72, max * 1.4];
}

function logTicks(domainMin: number, domainMax: number): number[] {
    const ticks: number[] = [];
    let p = Math.pow(10, Math.floor(Math.log10(domainMin)));
    while (p <= domainMax * 1.0001) {
        if (p >= domainMin) ticks.push(p);
        p *= 10;
    }
    return ticks;
}

const formatMs = (v: number) => v.toFixed(3);
const formatSpeedup = (v: number) => `${v.toFixed(1)}x`;
const formatParity = (v: number) => v.toFixed(2);

const KernelChart: React.FC = () => {
    const { rows, meta } = KERNEL_BENCHMARK;
    const allLatencies = rows.flatMap((r) => [r.baselineMs, r.optimizedMs]);
    const maxLatency = Math.max(...allLatencies);
    const [domainMin, domainMax] = niceLogDomain(allLatencies);
    const logMin = Math.log10(domainMin);
    const logMax = Math.log10(domainMax);
    const ticks = logTicks(domainMin, domainMax);

    const yFor = (v: number) => MARGIN.top + ((logMax - Math.log10(v)) / (logMax - logMin)) * PLOT_H;
    const xFor = (i: number) =>
        rows.length > 1 ? MARGIN.left + (i / (rows.length - 1)) * PLOT_W : MARGIN.left + PLOT_W / 2;

    const baselinePts = rows.map((r, i) => ({ x: xFor(i), y: yFor(r.baselineMs) }));
    const optimizedPts = rows.map((r, i) => ({ x: xFor(i), y: yFor(r.optimizedMs) }));
    const pathD = (pts: { x: number; y: number }[]) =>
        pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ');

    // Keep value labels off the plot edges regardless of where a given point
    // happens to fall — computed from geometry, not tuned per data point.
    const baselineLabelY = (y: number) => (y - MARGIN.top < LABEL_CLEARANCE ? y + 16 : y - 10);
    const optimizedLabelY = (y: number) =>
        MARGIN.top + PLOT_H - y < LABEL_CLEARANCE ? y - 10 : y + 18;

    const parityValues = rows.map((r) => r.argmaxParity);
    const parityIsUniform = parityValues.every((p) => p === parityValues[0]);
    const parityStatement = parityIsUniform
        ? `argmax parity is ${formatParity(parityValues[0])} at every context`
        : `argmax parity is ${rows.map((r) => `${formatParity(r.argmaxParity)} at ${r.context}`).join(', ')}`;

    const descText =
        `Line chart. ${meta.optimizedLabel} versus the ${meta.baselineLabel}, decode latency in milliseconds ` +
        `on a base-10 logarithmic y-axis (about ${domainMin.toFixed(2)} to ${domainMax.toFixed(0)} ms), by context ` +
        `length on the x-axis, measured on ${meta.model} on ${meta.hardware}. ` +
        rows
            .map(
                (r) =>
                    `At ${r.context} context: ${meta.baselineLabel} ${formatMs(r.baselineMs)} ms, ` +
                    `${meta.optimizedLabel} ${formatMs(r.optimizedMs)} ms, a ${formatSpeedup(r.speedup)} speedup, ` +
                    `argmax parity ${formatParity(r.argmaxParity)}.`
            )
            .join(' ');

    return (
        <figure className="kernel-chart">
            <div className="kc-visual">
                <div className="kc-legend">
                    <span className="kc-legend-item">
                        <i className="kc-swatch kc-swatch--baseline" aria-hidden="true" />
                        {meta.baselineLabel}
                    </span>
                    <span className="kc-legend-item">
                        <i className="kc-swatch kc-swatch--signal" aria-hidden="true" />
                        {meta.optimizedLabel}
                    </span>
                </div>

                <svg
                    className="kc-svg"
                    viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                    role="img"
                    aria-labelledby="kc-title kc-desc"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <title id="kc-title">
                        {`${meta.optimizedLabel} vs. ${meta.baselineLabel}: decode latency by context length, log scale`}
                    </title>
                    <desc id="kc-desc">{descText}</desc>

                    <text x={MARGIN.left} y={16} className="kc-axis-title">
                        latency, ms — log scale
                    </text>

                    {ticks.map((t) => (
                        <g key={t}>
                            <line
                                x1={MARGIN.left}
                                x2={VIEW_W - MARGIN.right}
                                y1={yFor(t)}
                                y2={yFor(t)}
                                className="kc-gridline"
                            />
                            <text
                                x={MARGIN.left - 8}
                                y={yFor(t)}
                                textAnchor="end"
                                dominantBaseline="middle"
                                className="kc-tick-label tabular-nums"
                            >
                                {t}
                            </text>
                        </g>
                    ))}

                    {rows.map((r, i) => (
                        <text
                            key={r.context}
                            x={xFor(i)}
                            y={VIEW_H - MARGIN.bottom + 22}
                            textAnchor="middle"
                            className="kc-tick-label tabular-nums"
                        >
                            {r.context}
                        </text>
                    ))}

                    {rows.map((r, i) => (
                        <line
                            key={`gap-${r.context}`}
                            x1={xFor(i)}
                            x2={xFor(i)}
                            y1={baselinePts[i].y}
                            y2={optimizedPts[i].y}
                            className="kc-gap-line"
                        />
                    ))}

                    <path d={pathD(baselinePts)} pathLength={1} className="kc-line kc-line--baseline" />
                    <path d={pathD(optimizedPts)} pathLength={1} className="kc-line kc-line--signal" />

                    {rows.map((r, i) => {
                        const bp = baselinePts[i];
                        const op = optimizedPts[i];
                        return (
                            <g key={r.context}>
                                <text
                                    x={(bp.x + op.x) / 2 + 16}
                                    y={(bp.y + op.y) / 2 + 4}
                                    textAnchor="start"
                                    className="kc-speedup-label tabular-nums"
                                >
                                    {formatSpeedup(r.speedup)}
                                </text>

                                <circle cx={bp.x} cy={bp.y} r={5} className="kc-dot kc-dot--baseline" />
                                <text
                                    x={bp.x}
                                    y={baselineLabelY(bp.y)}
                                    textAnchor="middle"
                                    className="kc-value-label kc-value-label--baseline tabular-nums"
                                >
                                    {formatMs(r.baselineMs)}
                                </text>

                                <circle cx={op.x} cy={op.y} r={5} className="kc-dot kc-dot--signal" />
                                <text
                                    x={op.x}
                                    y={optimizedLabelY(op.y)}
                                    textAnchor="middle"
                                    className="kc-value-label kc-value-label--signal tabular-nums"
                                >
                                    {formatMs(r.optimizedMs)}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>

            <div className="kc-table-scroll">
                <table className="kc-table">
                    <caption>
                        Decode latency by context length — {meta.model} on {meta.hardware}
                    </caption>
                    <thead>
                        <tr>
                            <th scope="col">Context</th>
                            <th scope="col">{meta.baselineLabel}</th>
                            <th scope="col">{meta.optimizedLabel}</th>
                            <th scope="col">Speedup</th>
                            <th scope="col">Argmax parity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r) => {
                            const baselinePct = (r.baselineMs / maxLatency) * 100;
                            const optimizedPct = (r.optimizedMs / maxLatency) * 100;
                            return (
                                <tr key={r.context}>
                                    <th scope="row">{r.context}</th>
                                    <td
                                        className="tabular-nums kc-bar-cell kc-bar-cell--baseline"
                                        style={{ '--kc-bar': `${baselinePct}%` } as React.CSSProperties}
                                    >
                                        {formatMs(r.baselineMs)} ms
                                    </td>
                                    <td
                                        className="tabular-nums kc-bar-cell kc-bar-cell--signal"
                                        style={{ '--kc-bar': `${optimizedPct}%` } as React.CSSProperties}
                                    >
                                        {formatMs(r.optimizedMs)} ms
                                    </td>
                                    <td className="tabular-nums">{formatSpeedup(r.speedup)}</td>
                                    <td className="tabular-nums kc-parity">{formatParity(r.argmaxParity)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <figcaption className="kc-caption">
                {meta.optimizedLabel} against the {meta.baselineLabel}, measured on {meta.model} on {meta.hardware}.
                {' '}Argmax <span className="kc-parity-inline">{parityStatement}</span> — identical token selection,
                so the speedup costs no accuracy.
            </figcaption>

            <style>{`
                .kernel-chart {
                    margin: 0;
                    max-width: 640px;
                }
                .kc-legend {
                    display: flex;
                    flex-wrap: wrap;
                    gap: var(--space-5);
                    margin-bottom: var(--space-3);
                    font-size: var(--fs-2);
                    color: var(--ink-soft);
                }
                .kc-legend-item {
                    display: inline-flex;
                    align-items: center;
                    gap: var(--space-2);
                }
                .kc-swatch {
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    border-radius: 2px;
                    flex-shrink: 0;
                }
                .kc-swatch--baseline { background: var(--baseline); }
                .kc-swatch--signal { background: var(--signal); }

                .kc-svg {
                    width: 100%;
                    height: auto;
                    overflow: visible;
                }

                .kc-gridline {
                    stroke: var(--rule);
                    stroke-width: 1;
                }
                .kc-axis-title,
                .kc-tick-label {
                    fill: var(--ink-soft);
                }
                .kc-axis-title { font-size: 11px; }
                .kc-tick-label { font-size: 11px; }

                .kc-gap-line {
                    stroke: var(--rule);
                    stroke-width: 1;
                }

                .kc-line {
                    fill: none;
                    stroke-width: 2;
                    stroke-linecap: round;
                    stroke-linejoin: round;
                    stroke-dasharray: 1;
                    stroke-dashoffset: 1;
                    animation: kc-draw 480ms ease-out forwards;
                }
                .kc-line--baseline { stroke: var(--baseline); animation-delay: 0ms; }
                .kc-line--signal { stroke: var(--signal); animation-delay: 130ms; }

                .kc-dot {
                    stroke: var(--surface);
                    stroke-width: 2;
                    opacity: 0;
                    animation: kc-fade-in 200ms ease-out forwards;
                }
                .kc-dot--baseline { fill: var(--baseline); animation-delay: 340ms; }
                .kc-dot--signal { fill: var(--signal); animation-delay: 470ms; }

                .kc-value-label {
                    font-size: 11px;
                    opacity: 0;
                    animation: kc-fade-in 200ms ease-out forwards;
                }
                .kc-value-label--baseline { fill: var(--ink-soft); animation-delay: 340ms; }
                .kc-value-label--signal { fill: var(--ink-soft); animation-delay: 470ms; }

                .kc-speedup-label {
                    font-size: 12px;
                    fill: var(--ink-soft);
                    opacity: 0;
                    animation: kc-fade-in 220ms ease-out forwards;
                    animation-delay: 560ms;
                }

                @keyframes kc-draw { to { stroke-dashoffset: 0; } }
                @keyframes kc-fade-in { to { opacity: 1; } }

                @media (prefers-reduced-motion: reduce) {
                    .kc-line, .kc-dot, .kc-value-label, .kc-speedup-label {
                        animation: none !important;
                        opacity: 1 !important;
                        stroke-dashoffset: 0 !important;
                    }
                }

                .kc-table-scroll {
                    overflow-x: auto;
                    margin-top: var(--space-6);
                }
                .kc-table {
                    font-size: var(--fs-2);
                    min-width: 420px;
                }
                .kc-table th, .kc-table td {
                    padding: var(--space-2) var(--space-3);
                }
                .kc-parity { color: var(--verify); }
                .kc-parity-inline {
                    color: var(--verify);
                    font-family: var(--font-mono);
                    font-variant-numeric: tabular-nums;
                }
                .kc-bar-cell { position: relative; }

                .kc-caption {
                    margin-top: var(--space-4);
                    color: var(--ink-soft);
                    font-size: var(--fs-2);
                    max-width: var(--measure);
                }

                @media (max-width: 560px) {
                    .kc-visual { display: none; }
                    .kc-bar-cell--baseline {
                        background: linear-gradient(
                            to right,
                            color-mix(in srgb, var(--baseline) 25%, transparent) var(--kc-bar),
                            transparent 0
                        );
                    }
                    .kc-bar-cell--signal {
                        background: linear-gradient(
                            to right,
                            color-mix(in srgb, var(--signal) 25%, transparent) var(--kc-bar),
                            transparent 0
                        );
                    }
                }
            `}</style>
        </figure>
    );
};

export default KernelChart;
