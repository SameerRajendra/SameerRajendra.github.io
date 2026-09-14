import React from 'react';
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
 */
const Section: React.FC<SectionProps> = ({ id, heading, className, children }) => {
    const headingId = `${id}-heading`;

    return (
        <section id={id} aria-labelledby={headingId} className={['section', className].filter(Boolean).join(' ')}>
            <div className="container">
                <h2 id={headingId} className="section__heading">{heading}</h2>
                <div className="section__body">{children}</div>
            </div>
        </section>
    );
};

export default Section;
