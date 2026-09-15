import React, { useEffect, useRef, useState } from 'react';
import Section from './Section';
import Reveal from './Reveal';
import { FOCUS_AREAS } from '../constants';
import './Focus.css';

/**
 * "What I work on" — the pinned scroll sequence.
 *
 * On a wide viewport with motion enabled, this becomes a sticky stage: the
 * three focus areas cross-fade as the user scrolls through a tall track,
 * driven by an IntersectionObserver watching three invisible sentinels
 * (cheaper and more robust than a scroll handler — see MOTION-SPEC).
 *
 * `pinned` starts false and only ever flips true from inside an effect, so:
 *  - Server-rendered / no-JS markup is always the plain stacked branch below
 *    (renderToString never runs effects) — fully readable, no fixed heights.
 *  - `prefers-reduced-motion: reduce` and viewports under 900px never flip
 *    it, so those visitors get the identical plain stacked branch.
 * A CSS-level reduced-motion fallback in Focus.css backs this up in case the
 * pinned branch is ever visible while the media query matches.
 */
const Focus: React.FC = () => {
    const [pinned, setPinned] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const sentinelRefs = useRef<Array<HTMLDivElement | null>>([]);

    useEffect(() => {
        if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
        if (typeof IntersectionObserver === 'undefined') return;

        const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const widthQuery = window.matchMedia('(min-width: 900px)');

        const evaluate = () => {
            setPinned(!reduceMotionQuery.matches && widthQuery.matches);
        };

        evaluate();
        reduceMotionQuery.addEventListener('change', evaluate);
        widthQuery.addEventListener('change', evaluate);
        return () => {
            reduceMotionQuery.removeEventListener('change', evaluate);
            widthQuery.removeEventListener('change', evaluate);
        };
    }, []);

    useEffect(() => {
        if (!pinned) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const idx = Number((entry.target as HTMLElement).dataset.index);
                    if (!Number.isNaN(idx)) setActiveIndex(idx);
                });
            },
            { threshold: 0, rootMargin: '-50% 0px -50% 0px' }
        );

        sentinelRefs.current.forEach((el) => el && observer.observe(el));
        return () => observer.disconnect();
    }, [pinned]);

    if (!pinned) {
        return (
            <Section id="focus" heading="What I work on">
                <div className="focus-list">
                    {FOCUS_AREAS.map((area, i) => (
                        <Reveal
                            as="article"
                            key={area.id}
                            variant="up"
                            delay={i * 80}
                            className="focus-item measure"
                        >
                            <h3 className="focus-item__heading">{area.heading}</h3>
                            <p>{area.body}</p>
                        </Reveal>
                    ))}
                </div>
            </Section>
        );
    }

    return (
        <Section id="focus" heading="What I work on">
            <div className="focus-track">
                <div className="focus-stage">
                    {FOCUS_AREAS.map((area, i) => (
                        <article
                            className={`focus-panel measure${i === activeIndex ? ' is-active' : ''}`}
                            key={area.id}
                            aria-hidden={i === activeIndex ? undefined : true}
                        >
                            <h3 className="focus-item__heading">{area.heading}</h3>
                            <p>{area.body}</p>
                        </article>
                    ))}

                    <div className="focus-progress" aria-hidden="true">
                        {FOCUS_AREAS.map((area, i) => (
                            <span
                                key={area.id}
                                className={`focus-progress__dot${i === activeIndex ? ' is-active' : ''}`}
                            />
                        ))}
                    </div>
                </div>

                {FOCUS_AREAS.map((area, i) => (
                    <div
                        key={area.id}
                        className="focus-sentinel"
                        data-index={i}
                        aria-hidden="true"
                        style={{ '--index': i } as React.CSSProperties}
                        ref={(el) => { sentinelRefs.current[i] = el; }}
                    />
                ))}
            </div>
        </Section>
    );
};

export default Focus;
