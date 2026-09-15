import React, { useEffect, useRef, useState } from 'react';
import { Icons } from '../constants';

// Plain-text contents rail (desktop, >=900px) collapsing to a normal top nav
// with a hamburger toggle below that. IDs below are the conventional section
// ids each owning component is expected to render on its own <section>; if a
// concurrently-built section ever uses a different id, its nav link simply
// becomes an inert anchor rather than breaking anything.
const SECTIONS: { id: string; label: string }[] = [
    { id: 'hero', label: 'Home' },
    { id: 'focus', label: 'Focus' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Selected work' },
    { id: 'kv-explorer', label: 'KV cache' },
    { id: 'live-inference', label: 'Run a model' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'education', label: 'Education' },
    { id: 'awards', label: 'Awards' },
    { id: 'contact', label: 'Contact' },
];

const Header: React.FC = () => {
    const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);
    const [mobileOpen, setMobileOpen] = useState(false);
    const activeIdRef = useRef(activeId);
    activeIdRef.current = activeId;
    const railNavRef = useRef<HTMLElement>(null);
    const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({ opacity: 0 });

    useEffect(() => {
        const elements = SECTIONS.map((s) => document.getElementById(s.id)).filter(
            (el): el is HTMLElement => el !== null
        );
        if (elements.length === 0 || !('IntersectionObserver' in window)) {
            return;
        }

        const visible = new Map<string, number>();

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        visible.set(entry.target.id, entry.intersectionRatio);
                    } else {
                        visible.delete(entry.target.id);
                    }
                });
                if (visible.size > 0) {
                    const [topId] = [...visible.entries()].sort((a, b) => b[1] - a[1])[0];
                    if (topId !== activeIdRef.current) {
                        setActiveId(topId);
                    }
                }
            },
            { rootMargin: '-15% 0px -60% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
        );

        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    // Sliding active-item indicator (motion spec #5): rather than the old
    // per-item border-color snap, one bar translates between list items.
    // Measured via getBoundingClientRect rather than assumed row heights,
    // since "Selected work" can wrap to two lines on a narrow rail while
    // single-word labels don't. Only ever writes a transform (+ a one-time
    // height on change, not itself transitioned), so the animated property
    // stays within the transform/opacity budget.
    useEffect(() => {
        const measure = () => {
            const nav = railNavRef.current;
            if (!nav) return;
            const activeLi = nav.querySelector<HTMLLIElement>(`li[data-id="${activeId}"]`);
            if (!activeLi) return;
            const navRect = nav.getBoundingClientRect();
            const itemRect = activeLi.getBoundingClientRect();
            if (itemRect.height === 0) return;
            setIndicatorStyle({
                opacity: 1,
                transform: `translateY(${itemRect.top - navRect.top}px)`,
                height: itemRect.height,
            });
        };
        measure();
        window.addEventListener('resize', measure, { passive: true });
        return () => window.removeEventListener('resize', measure);
    }, [activeId]);

    const closeMobile = () => setMobileOpen(false);

    return (
        <header className="site-header">
            <div className="site-header-bar">
                <a href="#hero" className="site-brand">
                    Sameer Rajendra
                </a>
                <button
                    type="button"
                    className="menu-toggle"
                    aria-expanded={mobileOpen}
                    aria-controls="mobile-nav"
                    onClick={() => setMobileOpen((open) => !open)}
                >
                    <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
                    {mobileOpen ? <Icons.X width={22} height={22} aria-hidden="true" /> : <Icons.Menu width={22} height={22} aria-hidden="true" />}
                </button>
            </div>

            <nav id="mobile-nav" className="mobile-nav" aria-label="Section navigation" hidden={!mobileOpen}>
                <ul>
                    {SECTIONS.map((s) => (
                        <li key={s.id}>
                            <a
                                href={`#${s.id}`}
                                aria-current={activeId === s.id ? 'true' : undefined}
                                onClick={closeMobile}
                            >
                                {s.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            <nav className="rail-nav" aria-label="Table of contents" ref={railNavRef}>
                <span className="rail-indicator" style={indicatorStyle} aria-hidden="true" />
                <ul>
                    {SECTIONS.map((s) => (
                        <li key={s.id} data-id={s.id} className={activeId === s.id ? 'is-active' : undefined}>
                            <a href={`#${s.id}`} aria-current={activeId === s.id ? 'true' : undefined}>
                                {s.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            <style>{`
                .site-header-bar {
                    position: sticky;
                    top: 0;
                    z-index: 50;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: var(--space-4);
                    padding: var(--space-3) var(--space-4);
                    background: var(--ground);
                    border-bottom: 1px solid var(--rule);
                }
                .site-brand {
                    color: var(--ink);
                    text-decoration: none;
                    font-weight: 600;
                    font-size: var(--fs-3);
                    display: inline-block;
                    transition: color 200ms var(--ease-in-out, ease), transform 200ms var(--ease-in-out, ease);
                }
                .site-brand:hover,
                .site-brand:focus-visible {
                    color: var(--signal);
                    transform: translateX(2px);
                }
                .menu-toggle {
                    min-width: 44px;
                    min-height: 44px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background: transparent;
                    border: 1px solid var(--rule);
                    border-radius: var(--radius);
                    color: var(--ink);
                    cursor: pointer;
                    transition: color 200ms var(--ease-in-out, ease), border-color 200ms var(--ease-in-out, ease),
                        transform 200ms var(--ease-in-out, ease);
                }
                .menu-toggle:hover,
                .menu-toggle:focus-visible {
                    color: var(--signal);
                    border-color: var(--signal);
                    transform: scale(1.04);
                }

                .mobile-nav {
                    position: sticky;
                    top: 60px;
                    z-index: 49;
                    background: var(--surface);
                    border-bottom: 1px solid var(--rule);
                }
                .mobile-nav ul {
                    list-style: none;
                    margin: 0;
                    padding: var(--space-3) var(--space-4);
                    display: flex;
                    flex-direction: column;
                    gap: var(--space-1);
                }
                .mobile-nav a {
                    display: block;
                    padding: var(--space-3) 0;
                    color: var(--ink-soft);
                    text-decoration: none;
                    font-size: var(--fs-3);
                    transition: color 200ms var(--ease-in-out, ease);
                }
                .mobile-nav a[aria-current="true"] {
                    color: var(--ink);
                }
                .mobile-nav a:hover,
                .mobile-nav a:focus-visible {
                    color: var(--ink);
                }

                .rail-nav {
                    display: none;
                }

                @media (min-width: 900px) {
                    .site-header-bar,
                    .mobile-nav {
                        display: none;
                    }
                    body {
                        padding-left: 200px;
                    }
                    .rail-nav {
                        display: block;
                        position: fixed;
                        left: var(--space-6);
                        top: 50%;
                        transform: translateY(-50%);
                        width: 150px;
                        z-index: 40;
                    }
                    .rail-nav ul {
                        position: relative;
                        list-style: none;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        flex-direction: column;
                        gap: var(--space-3);
                    }
                    .rail-nav li {
                        border-left: 2px solid transparent;
                        padding-left: var(--space-3);
                    }
                    /* The active state itself is carried by .rail-indicator sliding
                       between items (motion spec #5); the border above only reserves
                       the gutter it slides through. */
                    .rail-indicator {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 2px;
                        background: var(--signal);
                        opacity: 0;
                        transition: transform var(--dur-base, 650ms) var(--ease-in-out, ease),
                            opacity var(--dur-fast, 400ms) ease;
                        will-change: transform;
                    }
                    .rail-nav a {
                        display: inline-block;
                        color: var(--ink-soft);
                        text-decoration: none;
                        font-size: var(--fs-2);
                        transition: color 200ms var(--ease-in-out, ease), transform 200ms var(--ease-in-out, ease);
                    }
                    .rail-nav li.is-active a {
                        color: var(--ink);
                    }
                    .rail-nav a:hover,
                    .rail-nav a:focus-visible {
                        color: var(--ink);
                        transform: translateX(2px);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .rail-indicator {
                        transition: none !important;
                    }
                }
            `}</style>
        </header>
    );
};

export default Header;
