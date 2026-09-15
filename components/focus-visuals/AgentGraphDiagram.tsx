import React, { useState } from 'react';
import { useInView } from '../../hooks/useInView';
import './diagrams.css';

interface DiagramProps {
    active?: boolean;
}

function initialReducedMotion(): boolean {
    return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;
}

const STAGE_CX = [40, 100, 160, 220, 280];
const STAGE_Y = 86;
const STAGE_W = 48;
const STAGE_H = 30;
const DEGRADED_INDEX = 3; // one stage resolves to a degraded state, per the spec

const REQUEST_CX = 160;
const REQUEST_BOTTOM = 34;
const CORE_CX = 160;
const CORE_CY = 175;
const CORE_R = 22;
const REST_CX = 108;
const MCP_CX = 212;
const SURFACE_Y = 222;
const SURFACE_H = 26;

// Timing (ms), all inside the shared 6s loop defined in diagrams.css. Each
// stage "completes" at a slightly different time because the five stages
// genuinely run in parallel, not in sequence.
const FANOUT_DELAY = STAGE_CX.map((_, i) => 200 + i * 300);
const STAGE_DELAY = FANOUT_DELAY.map((d) => d + 500);
const CONVERGE_DELAY = STAGE_DELAY.map((d) => d + 400);
const CORE_DELAY = Math.max(...CONVERGE_DELAY) + 500;
const OUTPUT_DELAY = CORE_DELAY + 400;

function pulseStyle(x1: number, y1: number, x2: number, y2: number, delayMs: number): React.CSSProperties {
    return {
        '--fv-x1': `${x1}px`,
        '--fv-y1': `${y1}px`,
        '--fv-x2': `${x2}px`,
        '--fv-y2': `${y2}px`,
        animationDelay: `${delayMs}ms`,
    } as React.CSSProperties;
}

/**
 * Panel 2 — "Agents and retrieval": the Accord agent graph. A request fans
 * out to five stages that genuinely run in parallel (they light up at
 * different times each loop); one resolves to a degraded state and still
 * returns a partial result, and the graph converges anyway. The converged
 * core then exposes two surfaces — REST and MCP — drawn from the same node,
 * to make the "one implementation, not two" point visual rather than stated.
 *
 * --signal marks live flow, --baseline idle structure, --verify only the
 * converged/completed core (the one genuinely verified fact here).
 */
const AgentGraphDiagram: React.FC<DiagramProps> = ({ active = true }) => {
    const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3, once: false });
    const [reduced] = useState(initialReducedMotion);

    const isPlaying = active && inView && !reduced;
    const rootClass = `fv-diagram${isPlaying ? ' is-playing' : ''}${reduced ? ' is-reduced' : ''}`;

    return (
        <div ref={ref} className={rootClass}>
            <svg
                className="fv-svg"
                viewBox="0 0 320 256"
                role="img"
                aria-labelledby="graph-diagram-title graph-diagram-desc"
            >
                <title id="graph-diagram-title">
                    The Accord agent graph: one request fanning out to five parallel stages
                </title>
                <desc id="graph-diagram-desc">
                    A request fans out to five analysis stages running in parallel; they
                    complete at different times. One stage resolves to a degraded state and
                    still returns a partial result, and the graph converges anyway. The
                    converged result is exposed over both a REST API and an MCP tool server
                    from the same underlying implementation.
                </desc>

                {/* Idle edges — always drawn, structural. */}
                <g className="fv-line-idle">
                    {STAGE_CX.map((cx, i) => (
                        <line key={`fan-${i}`} x1={REQUEST_CX} y1={REQUEST_BOTTOM} x2={cx} y2={STAGE_Y} />
                    ))}
                    {STAGE_CX.map((cx, i) => (
                        <line
                            key={`conv-${i}`}
                            x1={cx}
                            y1={STAGE_Y + STAGE_H}
                            x2={CORE_CX}
                            y2={CORE_CY - CORE_R}
                        />
                    ))}
                    <line x1={CORE_CX} y1={CORE_CY + CORE_R} x2={REST_CX} y2={SURFACE_Y} />
                    <line x1={CORE_CX} y1={CORE_CY + CORE_R} x2={MCP_CX} y2={SURFACE_Y} />
                </g>

                {/* Request node. */}
                <rect x={REQUEST_CX - 32} y={8} width={64} height={26} rx={4} className="fv-box" />
                <text x={REQUEST_CX} y={25} textAnchor="middle" className="fv-label--strong">
                    REQUEST
                </text>

                {/* Fan-out pulses: request -> each stage. */}
                {STAGE_CX.map((cx, i) => (
                    <circle
                        key={`p-fan-${i}`}
                        cx={0}
                        cy={0}
                        r={3}
                        className="fv-pulse fv-anim fv-graph-pulse"
                        style={pulseStyle(REQUEST_CX, REQUEST_BOTTOM, cx, STAGE_Y, FANOUT_DELAY[i])}
                    />
                ))}

                {/* Stage nodes: idle box + an activation overlay that fades in and back
                    out on a loop, staggered so the five feel genuinely parallel. */}
                {STAGE_CX.map((cx, i) => {
                    const degraded = i === DEGRADED_INDEX;
                    return (
                        <g key={`stage-${i}`}>
                            <rect x={cx - STAGE_W / 2} y={STAGE_Y} width={STAGE_W} height={STAGE_H} rx={4} className="fv-box" />
                            <text x={cx} y={STAGE_Y + STAGE_H / 2 + 3} textAnchor="middle" className="fv-label--strong">
                                {`S${i + 1}`}
                            </text>
                            <g
                                className={`fv-anim fv-toggle-b fv-graph-node-active${degraded ? ' fv-graph-node-degraded' : ''}`}
                                style={{ animationDelay: `${STAGE_DELAY[i]}ms` }}
                            >
                                <rect
                                    x={cx - STAGE_W / 2}
                                    y={STAGE_Y}
                                    width={STAGE_W}
                                    height={STAGE_H}
                                    rx={4}
                                    className={degraded ? 'fv-graph-degraded-outline' : 'fv-graph-active-outline'}
                                />
                                <text x={cx + STAGE_W / 2 - 8} y={STAGE_Y - 3} textAnchor="middle" className="fv-label--strong">
                                    {degraded ? '~' : '✓'}
                                </text>
                            </g>
                            {degraded && (
                                <text x={cx} y={STAGE_Y + STAGE_H + 11} textAnchor="middle" className="fv-label">
                                    partial
                                </text>
                            )}
                        </g>
                    );
                })}

                {/* Convergence pulses: each stage -> core. */}
                {STAGE_CX.map((cx, i) => (
                    <circle
                        key={`p-conv-${i}`}
                        cx={0}
                        cy={0}
                        r={3}
                        className="fv-pulse fv-anim fv-graph-pulse"
                        style={pulseStyle(cx, STAGE_Y + STAGE_H, CORE_CX, CORE_CY - CORE_R, CONVERGE_DELAY[i])}
                    />
                ))}

                {/* Core: the single converged, shared implementation. */}
                <circle cx={CORE_CX} cy={CORE_CY} r={CORE_R} className="fv-box" />
                <text x={CORE_CX} y={CORE_CY + 4} textAnchor="middle" className="fv-label--strong">
                    CORE
                </text>
                <g className="fv-anim fv-toggle-b fv-graph-node-active" style={{ animationDelay: `${CORE_DELAY}ms` }}>
                    <circle cx={CORE_CX} cy={CORE_CY} r={CORE_R} className="fv-graph-verify-outline" />
                    <text x={CORE_CX} y={CORE_CY - CORE_R - 6} textAnchor="middle" className="fv-label--verify fv-label--strong">
                        ✓
                    </text>
                </g>

                {/* Output pulses: core -> REST, core -> MCP — from the same node. */}
                <circle
                    cx={0}
                    cy={0}
                    r={3}
                    className="fv-pulse fv-anim fv-graph-pulse"
                    style={pulseStyle(CORE_CX, CORE_CY + CORE_R, REST_CX, SURFACE_Y, OUTPUT_DELAY)}
                />
                <circle
                    cx={0}
                    cy={0}
                    r={3}
                    className="fv-pulse fv-anim fv-graph-pulse"
                    style={pulseStyle(CORE_CX, CORE_CY + CORE_R, MCP_CX, SURFACE_Y, OUTPUT_DELAY)}
                />

                {/* Two surfaces, one implementation. */}
                <rect x={REST_CX - 32} y={SURFACE_Y} width={64} height={SURFACE_H} rx={4} className="fv-box" />
                <text x={REST_CX} y={SURFACE_Y + SURFACE_H / 2 + 3} textAnchor="middle" className="fv-label--strong">
                    REST
                </text>
                <rect x={MCP_CX - 32} y={SURFACE_Y} width={64} height={SURFACE_H} rx={4} className="fv-box" />
                <text x={MCP_CX} y={SURFACE_Y + SURFACE_H / 2 + 3} textAnchor="middle" className="fv-label--strong">
                    MCP
                </text>
            </svg>
        </div>
    );
};

export default AgentGraphDiagram;
