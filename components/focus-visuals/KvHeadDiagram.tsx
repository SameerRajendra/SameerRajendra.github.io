import React, { useState } from 'react';
import { useInView } from '../../hooks/useInView';
import './diagrams.css';

interface DiagramProps {
    /** False pauses the loop even while in view — used by the pinned
     * sequence to animate only the currently active panel. Standalone
     * (stacked-layout) usage leaves this at its default of true and is
     * gated purely by its own in-view state instead. */
    active?: boolean;
}

function initialReducedMotion(): boolean {
    return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;
}

const HEAD_X = [46, 116, 186, 256];
const HEAD_Y = 146;
const HEAD_W = 44;
const HEAD_H = 26;
const KV_X = 138;
const KV_Y = 34;
const KV_W = 44;
const KV_H = 22;
const KV_CX = KV_X + KV_W / 2;
const KV_BOTTOM = KV_Y + KV_H;
const JUNCTION_Y = 96;

/**
 * Panel 1 — "Inference and GPU": grouped-query attention, illustrated as the
 * exact mechanism in the copy ("indexing the grid on KV heads to cut
 * redundant KV traffic fourfold"). Two phases cross-fade in a slow loop:
 *  - naive: four query heads each issue their own read of the same KV
 *    block (four arrows, a "KV block reads: 4" counter).
 *  - indexed: one read serves all four (one arrow feeding a shared
 *    junction, "KV block reads: 1 — 4x less KV traffic").
 * The 4 heads and the 4x figure are the only numbers on this diagram, both
 * already stated in constants.tsx / the panel's own copy.
 */
const KvHeadDiagram: React.FC<DiagramProps> = ({ active = true }) => {
    const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3, once: false });
    const [reduced] = useState(initialReducedMotion);

    const isPlaying = active && inView && !reduced;
    const rootClass = `fv-diagram${isPlaying ? ' is-playing' : ''}${reduced ? ' is-reduced' : ''}`;

    return (
        <div ref={ref} className={rootClass}>
            <svg
                className="fv-svg"
                viewBox="0 0 320 200"
                role="img"
                aria-labelledby="kv-diagram-title kv-diagram-desc"
            >
                <title id="kv-diagram-title">
                    Grouped-query attention: four query heads sharing one KV cache read
                </title>
                <desc id="kv-diagram-desc">
                    Naive attention issues four separate KV block reads from HBM, one per query
                    head. Indexing the grid on the KV head instead serves all four query heads
                    from a single read, cutting KV traffic fourfold.
                </desc>

                <defs>
                    <marker
                        id="fv-kv-arrowhead"
                        markerWidth="6"
                        markerHeight="6"
                        refX="4.5"
                        refY="3"
                        orient="auto"
                    >
                        <path d="M0,0 L6,3 L0,6 Z" className="fv-kv-arrowhead-fill" />
                    </marker>
                </defs>

                {/* Static structure: bands, KV block, query heads. */}
                <rect x={12} y={14} width={296} height={44} rx={3} className="fv-band" />
                <text x={16} y={10} className="fv-label">HBM</text>

                <rect x={12} y={136} width={296} height={44} rx={3} className="fv-band" />
                <text x={16} y={132} className="fv-label">SM (compute)</text>

                <rect x={KV_X} y={KV_Y} width={KV_W} height={KV_H} rx={2} className="fv-box" />
                <text x={KV_CX} y={KV_Y + KV_H / 2 + 3} textAnchor="middle" className="fv-label--strong">
                    KV
                </text>

                {HEAD_X.map((x, i) => (
                    <g key={i}>
                        <rect x={x} y={HEAD_Y} width={HEAD_W} height={HEAD_H} rx={2} className="fv-box" />
                        <text x={x + HEAD_W / 2} y={HEAD_Y + HEAD_H / 2 + 3} textAnchor="middle" className="fv-label--strong">
                            {`Q${i}`}
                        </text>
                    </g>
                ))}

                {/* Phase A — naive: one read per query head. */}
                <g className="fv-anim fv-toggle-a fv-kv-phase-a">
                    {HEAD_X.map((x, i) => (
                        <line
                            key={i}
                            x1={KV_CX}
                            y1={KV_BOTTOM}
                            x2={x + HEAD_W / 2}
                            y2={HEAD_Y}
                            className="fv-line-flow fv-kv-arrow"
                        />
                    ))}
                </g>
                <text
                    x={160}
                    y={192}
                    textAnchor="middle"
                    className="fv-label--strong fv-anim fv-toggle-a fv-kv-phase-a"
                >
                    KV block reads: 4
                </text>

                {/* Phase B — indexed on the KV head: one read, shared out. */}
                <g className="fv-anim fv-toggle-b fv-kv-phase-b">
                    <line
                        x1={KV_CX}
                        y1={KV_BOTTOM}
                        x2={KV_CX}
                        y2={JUNCTION_Y}
                        className="fv-line-flow fv-kv-arrow"
                    />
                    <circle cx={KV_CX} cy={JUNCTION_Y} r={2.5} className="fv-kv-junction" />
                    {HEAD_X.map((x, i) => (
                        <line
                            key={i}
                            x1={KV_CX}
                            y1={JUNCTION_Y}
                            x2={x + HEAD_W / 2}
                            y2={HEAD_Y}
                            className="fv-kv-branch"
                        />
                    ))}
                </g>
                <text
                    x={160}
                    y={192}
                    textAnchor="middle"
                    className="fv-label--strong fv-label--signal fv-anim fv-toggle-b fv-kv-phase-b"
                >
                    KV block reads: 1 — 4x less KV traffic
                </text>
            </svg>
        </div>
    );
};

export default KvHeadDiagram;
