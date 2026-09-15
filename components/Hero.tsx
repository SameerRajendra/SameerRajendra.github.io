import React, { useEffect, useState } from 'react';
import { PERSONAL_INFO } from '../constants';
import KernelChart from './KernelChart';

// Sequence timing (ms). This is a one-shot load orchestration, not a
// scroll reveal, so it is driven by a single `started` flag set on mount
// rather than by useInView — everything above the fold needs to move
// together on one deterministic clock instead of several independent
// IntersectionObservers each resolving on their own frame.
const LINE_STAGGER = 90;
const LINE_START = 100;
const SUBHEAD_GAP = 240;

function prefersReducedMotion(): boolean {
    return typeof window !== 'undefined' && !!window.matchMedia
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;
}

const Hero: React.FC = () => {
    const [started, setStarted] = useState(false);

    useEffect(() => {
        if (prefersReducedMotion()) {
            setStarted(true);
            return;
        }
        const raf = requestAnimationFrame(() => setStarted(true));
        return () => cancelAnimationFrame(raf);
    }, []);

    // The headline is split into two lines for the masked reveal rather than
    // relying on natural wrapping, so the choreography is consistent across
    // widths. The exact wording from constants.tsx is preserved untouched —
    // this only changes where the line break falls.
    const words = PERSONAL_INFO.headline.split(' ');
    const mid = Math.ceil(words.length / 2);
    const lines = [words.slice(0, mid).join(' '), words.slice(mid).join(' ')].filter(Boolean);
    const lastLineDelay = LINE_START + (lines.length - 1) * LINE_STAGGER;
    const subheadDelay = lastLineDelay + SUBHEAD_GAP;

    const visible = started ? ' is-visible' : '';
    const delayStyle = (delay: number): React.CSSProperties => ({ transitionDelay: `${delay}ms` });

    return (
        <section id="hero" className="hero">
            <div className="container">
                <p className={`cluster hero-meta reveal${visible}`} style={delayStyle(0)}>
                    <span>{PERSONAL_INFO.name}</span>
                    <span>{PERSONAL_INFO.roleLine}</span>
                    <span>{PERSONAL_INFO.location}</span>
                </p>

                <h1 className="hero-headline">
                    {lines.map((line, i) => (
                        // The trailing space is real DOM text, not decorative: with
                        // .mask-line CSS unavailable (JS disabled — see the
                        // @media (scripting: enabled) guard in motion.css) these
                        // spans render inline, and without it the two lines would
                        // run together as one word ("...pagehas...").
                        <React.Fragment key={line}>
                            <span
                                className={`mask-line${started ? ' is-visible' : ''}`}
                                style={delayStyle(LINE_START + i * LINE_STAGGER)}
                            >
                                <span>{line}</span>
                            </span>
                            {i < lines.length - 1 ? ' ' : ''}
                        </React.Fragment>
                    ))}
                </h1>

                <p className={`measure hero-subhead reveal${visible}`} style={delayStyle(subheadDelay)}>
                    {PERSONAL_INFO.subhead}
                </p>

                {/* The chart's own scale+fade entrance (MOTION-SPEC hero item #1) lives
                    inside KernelChart itself, unified with its scroll-redraw sequence
                    (item #2) under one IntersectionObserver — see .kc-visual in
                    KernelChart.tsx. Wrapping it in a second, independently-timed
                    reveal here would hide its internal draw behind this wrapper's own
                    opacity, since IntersectionObserver fires on geometry, not paint. */}
                <div className="hero-chart-wrap">
                    <KernelChart />
                </div>
            </div>

            <style>{`
                .hero {
                    padding-block: var(--space-9) var(--space-8);
                }
                .hero-meta {
                    color: var(--ink-soft);
                    font-size: var(--fs-2);
                    margin-bottom: var(--space-5);
                    --cluster-gap: var(--space-4);
                }
                .hero-headline {
                    color: var(--ink);
                    margin-bottom: var(--space-5);
                }
                .hero-headline .mask-line {
                    line-height: var(--lh-heading);
                }
                .hero-subhead {
                    color: var(--ink-soft);
                    font-size: var(--fs-4);
                    margin-bottom: var(--space-8);
                }
                .hero-chart-wrap {
                    max-width: 640px;
                }
            `}</style>
        </section>
    );
};

export default Hero;
