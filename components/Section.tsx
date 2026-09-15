import React from 'react';
import { useInView } from '../hooks/useInView';
import './Section.css';

interface SectionProps {
    /** Also used for the nav-rail anchor target. */
    id: string;
    /** Rendered verbatim as the section's h2 — the page's h1 lives in Hero. */
    heading: string;
    className?: string;
    children: React.ReactNode;
}

/**
 * Shared section landmark: gives every section its id (for the contents
 * rail), an h2 tied to the section via aria-labelledby, and one owned place
 * for vertical rhythm. Individual sections own their own inner layout.
 *
 * The heading reveals with --lift on scroll into view (every section
 * heading site-wide gets this for free, since they all render through
 * here). useInView is applied directly to the h2 rather than via <Reveal>
 * so the heading keeps its own id (the aria-labelledby target) with no
 * dependency on prop-forwarding. Baseline visibility (no JS, reduced
 * motion) is guaranteed by useInView's own contract, not by anything here.
 */
const Section: React.FC<SectionProps> = ({ id, heading, className, children }) => {
    const headingId = `${id}-heading`;
    const [headingRef, headingInView] = useInView<HTMLHeadingElement>();

    return (
        <section id={id} aria-labelledby={headingId} className={['section', className].filter(Boolean).join(' ')}>
            <div className="container">
                <h2
                    id={headingId}
                    ref={headingRef}
                    className={`section__heading reveal reveal--lift${headingInView ? ' is-visible' : ''}`}
                >
                    {heading}
                </h2>
                <div className="section__body">{children}</div>
            </div>
        </section>
    );
};

export default Section;
