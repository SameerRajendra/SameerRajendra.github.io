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

interface ScoreRow {
    id: string;
    glyph: string;
    label: string;
    ringClass: string;
    textClass: string;
}

// Exactly the five statuses named in the spec — no others, no invented ones.
// Every row carries a text label as well as a glyph, so status never rests
// on colour (or on the glyph) alone.
const ROWS: ScoreRow[] = [
    { id: 'check-01', glyph: '✓', label: 'PASS', ringClass: 'fv-score-ring--verify', textClass: 'fv-label--verify' },
    { id: 'check-02', glyph: '✕', label: 'FAIL', ringClass: 'fv-score-ring--solid', textClass: 'fv-label--strong' },
    { id: 'check-03', glyph: '≈', label: 'CHARACTERIZATION', ringClass: 'fv-score-ring--solid', textClass: 'fv-label' },
    { id: 'check-04', glyph: '—', label: 'BY DESIGN — N/M', ringClass: 'fv-score-ring--dashed', textClass: 'fv-label' },
];
const PENDING_ROW: ScoreRow = {
    id: 'check-05',
    glyph: '…',
    label: 'NOT YET RUN',
    ringClass: 'fv-score-ring--dashed',
    textClass: 'fv-label',
};

const ROW_H = 38;
const TOP = 10;

/**
 * Panel 3 — "Evaluation": the auto-generated scorecard. Five rows resolve
 * into their status one at a time — except the fifth, which stays visibly,
 * persistently unresolved (dashed ring, ellipsis, "NOT YET RUN" in text) so
 * an unrun eval can never be mistaken for a pass, or for nothing at all.
 * --verify appears exactly once, on the one row that is a genuine pass.
 */
const ScorecardDiagram: React.FC<DiagramProps> = ({ active = true }) => {
    const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.3, once: false });
    const [reduced] = useState(initialReducedMotion);

    const isPlaying = active && inView && !reduced;
    const rootClass = `fv-diagram${isPlaying ? ' is-playing' : ''}${reduced ? ' is-reduced' : ''}`;
    const allRows = [...ROWS, PENDING_ROW];

    return (
        <div ref={ref} className={rootClass}>
            <svg
                className="fv-svg"
                viewBox="0 0 320 210"
                role="img"
                aria-labelledby="score-diagram-title score-diagram-desc"
            >
                <title id="score-diagram-title">
                    Eval scorecard: rows resolving into distinct pass, fail and unrun statuses
                </title>
                <desc id="score-diagram-desc">
                    A grid of eval rows resolves into one of five statuses: passing, failing,
                    characterization, by-design-unmeasurable, or not yet run. Rows that have
                    not been run stay visibly and persistently unresolved, dashed and
                    ellipsis-marked, so an unrun eval can never be read as a passing one.
                </desc>

                {allRows.map((row, i) => {
                    const y = TOP + i * ROW_H;
                    const cy = y + 16;
                    const pending = row === PENDING_ROW;
                    return (
                        <g key={row.id}>
                            <line x1={0} y1={y + ROW_H - 4} x2={320} y2={y + ROW_H - 4} className="fv-score-rule" />
                            <text x={44} y={cy - 3} className="fv-label">{row.id}</text>

                            {pending ? (
                                <g className="fv-anim fv-pending-persistent fv-score-pending-loop">
                                    <circle cx={20} cy={cy} r={13} className={row.ringClass} />
                                    <text x={20} y={cy + 4} textAnchor="middle" className={row.textClass}>
                                        {row.glyph}
                                    </text>
                                    <text x={44} y={cy + 11} className={row.textClass}>{row.label}</text>
                                </g>
                            ) : (
                                <>
                                    <g
                                        className="fv-anim fv-toggle-a fv-score-cell-a"
                                        style={{ animationDelay: `${i * 900}ms` } as React.CSSProperties}
                                    >
                                        <circle cx={20} cy={cy} r={13} className="fv-score-ring--dashed" />
                                        <text x={20} y={cy + 4} textAnchor="middle" className="fv-label">
                                            {'…'}
                                        </text>
                                        <text x={44} y={cy + 11} className="fv-label">PENDING</text>
                                    </g>
                                    <g
                                        className="fv-anim fv-toggle-b fv-score-cell-b"
                                        style={{ animationDelay: `${i * 900}ms` } as React.CSSProperties}
                                    >
                                        <circle cx={20} cy={cy} r={13} className={row.ringClass} />
                                        <text x={20} y={cy + 4} textAnchor="middle" className={row.textClass}>
                                            {row.glyph}
                                        </text>
                                        <text x={44} y={cy + 11} className={row.textClass}>{row.label}</text>
                                    </g>
                                </>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

export default ScorecardDiagram;
