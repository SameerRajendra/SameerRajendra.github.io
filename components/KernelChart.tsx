import React, { useState } from 'react';
import { KERNEL_BENCHMARK } from '../constants';
import { useInView } from '../hooks/useInView';
import CountUp from './CountUp';

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
//
// Motion: the draw/reveal sequence below only ever plays once JS has
// confirmed the chart scrolled into view (useInView, re-armed each time it
// leaves and re-enters — see MOTION-SPEC #2). Every element's true baseline
// (outside @media (scripting: enabled)) is fully drawn/visible, so a crawler
// or a no-JS browser always sees the complete, correct chart.

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

    // Redraws every time the chart re-enters the viewport (once: false), so
    // a visitor who scrolls away and back sees it as a deliberate moment
    // rather than a one-time trick.
    const [chartRef, isVisible] = useInView<HTMLDivElement>({ threshold: 0.3, once: false });
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

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

    const active = activeIndex !== null ? rows[activeIndex] : null;

    return (
        <figure className="kernel-chart">
            <div ref={chartRef} className={`kc-visual${isVisible ? ' is-visible' : ''}`}>
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

                <div className="kc-plot">
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
                            const speedupX = (bp.x + op.x) / 2 + 16;
                            const speedupY = (bp.y + op.y) / 2 + 4;
                            return (
                                <g key={r.context}>
                                    <foreignObject x={speedupX} y={speedupY - 11} width={52} height={16} className="kc-fo">
                                        <div className="kc-speedup-label tabular-nums">
                                            <CountUp value={formatSpeedup(r.speedup)} duration={700} />
                                        </div>
                                    </foreignObject>

                                    <circle cx={bp.x} cy={bp.y} r={5} className="kc-dot kc-dot--baseline" />
                                    <foreignObject
                                        x={bp.x - 32}
                                        y={baselineLabelY(bp.y) - 11}
                                        width={64}
                                        height={16}
                                        className="kc-fo"
                                    >
                                        <div className="kc-value-label kc-value-label--baseline tabular-nums">
                                            <CountUp value={formatMs(r.baselineMs)} duration={700} />
                                        </div>
                                    </foreignObject>

                                    <circle cx={op.x} cy={op.y} r={5} className="kc-dot kc-dot--signal" />
                                    <foreignObject
                                        x={op.x - 32}
                                        y={optimizedLabelY(op.y) - 11}
                                        width={64}
                                        height={16}
                                        className="kc-fo"
                                    >
                                        <div className="kc-value-label kc-value-label--signal tabular-nums">
                                            <CountUp value={formatMs(r.optimizedMs)} duration={700} />
                                        </div>
                                    </foreignObject>

                                    {/* Larger, invisible hit target — hover- and keyboard-focusable,
                                        raises the tooltip readout for this context. */}
                                    <circle
                                        cx={bp.x}
                                        cy={(bp.y + op.y) / 2}
                                        r={16}
                                        className="kc-hit"
                                        tabIndex={0}
                                        role="button"
                                        aria-label={`${r.context} context: ${meta.baselineLabel} ${formatMs(r.baselineMs)} ms, ${meta.optimizedLabel} ${formatMs(r.optimizedMs)} ms, ${formatSpeedup(r.speedup)} speedup, argmax parity ${formatParity(r.argmaxParity)}`}
                                        onMouseEnter={() => setActiveIndex(i)}
                                        onMouseLeave={() => setActiveIndex((cur) => (cur === i ? null : cur))}
                                        onFocus={() => setActiveIndex(i)}
                                        onBlur={() => setActiveIndex((cur) => (cur === i ? null : cur))}
                                    />
                                </g>
                            );
                        })}
                    </svg>

                    {active && activeIndex !== null && (
                        <div
                            className="kc-tooltip"
                            role="status"
                            style={{
                                left: `${(xFor(activeIndex) / VIEW_W) * 100}%`,
                                top: `${(Math.min(baselinePts[activeIndex].y, optimizedPts[activeIndex].y) / VIEW_H) * 100}%`,
                            }}
                        >
                            <p className="kc-tooltip-title">{active.context} context</p>
                            <p>
                                <span>{meta.baselineLabel}</span>
                                <span className="tabular-nums">{formatMs(active.baselineMs)} ms</span>
                            </p>
                            <p>
                                <span>{meta.optimizedLabel}</span>
                                <span className="tabular-nums">{formatMs(active.optimizedMs)} ms</span>
                            </p>
                            <p>
                                <span>Speedup</span>
                                <span className="tabular-nums">{formatSpeedup(active.speedup)}</span>
                            </p>
                            <p>
                                <span>Argmax parity</span>
                                <span className="tabular-nums">{formatParity(active.argmaxParity)}</span>
                            </p>
                        </div>
                    )}
                </div>
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

                .kc-plot {
                    position: relative;
                }

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
                }
                .kc-line--baseline { stroke: var(--baseline); }
                .kc-line--signal { stroke: var(--signal); }

                .kc-dot {
                    stroke: var(--surface);
                    stroke-width: 2;
                }
                .kc-dot--baseline { fill: var(--baseline); }
                .kc-dot--signal { fill: var(--signal); }

                .kc-fo {
                    overflow: visible;
                }
                .kc-value-label,
                .kc-speedup-label {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    line-height: 1;
                    white-space: nowrap;
                    color: var(--ink-soft);
                }
                .kc-value-label { font-size: 11px; }
                .kc-speedup-label { font-size: 12px; justify-content: flex-start; }

                .kc-hit {
                    fill: transparent;
                    stroke: transparent;
                    stroke-width: 2;
                    cursor: pointer;
                    pointer-events: all;
                    transition: fill 200ms var(--ease-in-out, ease), stroke 200ms var(--ease-in-out, ease);
                }
                .kc-hit:hover,
                .kc-hit:focus-visible {
                    outline: none;
                    stroke: var(--signal);
                    fill: color-mix(in srgb, var(--signal) 14%, transparent);
                }

                .kc-tooltip {
                    position: absolute;
                    transform: translate(-50%, calc(-100% - 14px));
                    background: var(--surface);
                    border: 1px solid var(--rule);
                    border-radius: var(--radius);
                    padding: var(--space-3) var(--space-4);
                    font-size: var(--fs-1);
                    min-width: 210px;
                    pointer-events: none;
                    z-index: 5;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
                }
                .kc-tooltip-title {
                    margin: 0 0 var(--space-2);
                    font-weight: 600;
                    color: var(--ink);
                }
                .kc-tooltip p {
                    margin: 0;
                    display: flex;
                    justify-content: space-between;
                    gap: var(--space-4);
                    color: var(--ink-soft);
                }
                .kc-tooltip p + p {
                    margin-top: var(--space-1);
                }
                .kc-tooltip span:last-child {
                    color: var(--ink);
                }

                @media (scripting: enabled) {
                    /* Container-level entrance (MOTION-SPEC hero item #1: "the chart
                       container scales up very slightly and fades") — unified here
                       with the internal draw sequence below under the same
                       .kc-visual.is-visible trigger, so nothing animates invisibly
                       behind a separately-timed outer wrapper. */
                    .kc-visual {
                        opacity: 0;
                        transform: scale(0.98);
                        transition: opacity var(--dur-base, 650ms) var(--ease-out-expo, ease-out),
                            transform var(--dur-base, 650ms) var(--ease-out-expo, ease-out);
                    }
                    .kc-visual.is-visible {
                        opacity: 1;
                        transform: none;
                    }

                    .kc-axis-title,
                    .kc-gridline,
                    .kc-tick-label {
                        opacity: 0;
                        transition: opacity var(--dur-base, 650ms) var(--ease-out-expo, ease-out);
                    }
                    .kc-visual.is-visible .kc-axis-title,
                    .kc-visual.is-visible .kc-gridline,
                    .kc-visual.is-visible .kc-tick-label {
                        opacity: 1;
                    }

                    .kc-line {
                        stroke-dasharray: 1;
                        stroke-dashoffset: 1;
                    }
                    .kc-visual.is-visible .kc-line--baseline {
                        animation: kc-draw 480ms ease-out forwards;
                        animation-delay: 150ms;
                    }
                    .kc-visual.is-visible .kc-line--signal {
                        animation: kc-draw 480ms ease-out forwards;
                        animation-delay: 300ms;
                    }

                    .kc-dot {
                        opacity: 0;
                        transform: scale(0);
                        transform-box: fill-box;
                        transform-origin: center;
                    }
                    .kc-visual.is-visible .kc-dot--baseline {
                        animation: kc-dot-pop 360ms var(--ease-out-expo, ease-out) forwards;
                        animation-delay: 560ms;
                    }
                    .kc-visual.is-visible .kc-dot--signal {
                        animation: kc-dot-pop 360ms var(--ease-out-expo, ease-out) forwards;
                        animation-delay: 700ms;
                    }

                    .kc-value-label,
                    .kc-speedup-label {
                        opacity: 0;
                        transform: translate3d(0, 6px, 0);
                        transition: opacity 320ms var(--ease-out-expo, ease-out),
                            transform 320ms var(--ease-out-expo, ease-out);
                    }
                    .kc-visual.is-visible .kc-value-label--baseline {
                        opacity: 1;
                        transform: none;
                        transition-delay: 620ms;
                    }
                    .kc-visual.is-visible .kc-value-label--signal {
                        opacity: 1;
                        transform: none;
                        transition-delay: 760ms;
                    }
                    .kc-visual.is-visible .kc-speedup-label {
                        opacity: 1;
                        transform: none;
                        transition-delay: 820ms;
                    }
                }

                @keyframes kc-draw { to { stroke-dashoffset: 0; } }
                @keyframes kc-dot-pop {
                    0% { opacity: 0; transform: scale(0); }
                    60% { opacity: 1; transform: scale(1.35); }
                    100% { opacity: 1; transform: scale(1); }
                }

                @media (prefers-reduced-motion: reduce) {
                    .kc-visual,
                    .kc-axis-title, .kc-gridline, .kc-tick-label,
                    .kc-line, .kc-dot, .kc-value-label, .kc-speedup-label {
                        animation: none !important;
                        transition: none !important;
                        opacity: 1 !important;
                        transform: none !important;
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
