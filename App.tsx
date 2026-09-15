import React, { Suspense, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Focus from './components/Focus';
import About from './components/About';
import Projects from './components/Projects';
import Section from './components/Section';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Education from './components/Education';
import Awards from './components/Awards';
import Contact from './components/Contact';
import { useInView } from './hooks/useInView';

// Both demos are code-split: their JS/CSS chunks are not part of the main
// bundle, and (for the KV explorer — see DeferredDemo below) not even
// fetched until the visitor scrolls near the section. A visitor who never
// reaches "Selected work" downloads neither.
//
// The KV explorer owns no <Section> of its own (see DeferredDemo): its
// wrapping <Section id="kv-explorer"> below renders eagerly so the id/h2
// exist immediately for the contents rail and Header's IntersectionObserver
// (which queries document.getElementById once on mount) — only the
// interactive calculator inside it is deferred.
//
// Live inference is wrapped in an eager <Section id="live-inference"> here,
// like the KV explorer: the id and h2 must exist on first paint or the
// contents-rail anchor resolves to nothing and Header's one-shot
// getElementById never finds it. It is mounted through DeferredDemo (not a
// bare <Suspense>): legacy renderToString cannot wait on a React.lazy
// import, so an eagerly-rendered Suspense boundary around it breaks
// prerender (it emits a broken internal error marker, exposing a local
// file path, in place of the section, and everything upstream of it in the
// same boundary). Gating on inView means the lazy import is never attempted
// server-side (inView starts false with no window), so prerender only ever
// sees the plain placeholder for this section — exactly like the KV
// explorer above.
const KvExplorer = React.lazy(() => import('./components/demos/KvExplorer'));
const LiveInference = React.lazy(() => import('./components/demos/LiveInference'));

// Defers fetching a lazy demo's chunk until its wrapper scrolls near the
// viewport (rootMargin gives it a head start so it's ready before fully in
// view), rather than fetching it the moment the page mounts. Reserves
// `minHeight` both before and during the fetch so nothing shifts when the
// real content swaps in — CLS stays 0.
const DeferredDemo: React.FC<{ minHeight: number; children: React.ReactNode }> = ({ minHeight, children }) => {
    const [ref, inView] = useInView<HTMLDivElement>({ rootMargin: '600px 0px', threshold: 0 });
    return (
        <div ref={ref}>
            {inView ? (
                <Suspense fallback={<div className="demo-placeholder" style={{ minHeight }} aria-hidden="true" />}>
                    {children}
                </Suspense>
            ) : (
                <div className="demo-placeholder" style={{ minHeight }} aria-hidden="true" />
            )}
        </div>
    );
};

// Single shared, passive, rAF-batched scroll listener driving both the top
// progress bar and every .parallax element on the page (see MOTION-SPEC
// "SCROLL HANDLER RULES" — never one listener per component). It only ever
// writes CSS custom properties, never reads them back, so there is no
// forced-reflow read/write interleaving. Skipped entirely under reduced
// motion: the progress bar is hidden and .parallax collapses to no offset
// via CSS alone (styles/motion.css), so no listener needs to run at all.
function useScrollDepthAndParallax(): void {
    useEffect(() => {
        const reduced =
            typeof window !== 'undefined' &&
            !!window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduced) return;

        let ticking = false;

        const update = () => {
            ticking = false;
            const doc = document.documentElement;
            const scrollableHeight = doc.scrollHeight - window.innerHeight;
            const progress = scrollableHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight)) : 0;
            doc.style.setProperty('--progress', progress.toFixed(4));

            const vh = window.innerHeight;
            document.querySelectorAll<HTMLElement>('.parallax').forEach((el) => {
                const rect = el.getBoundingClientRect();
                const delta = (vh / 2 - (rect.top + rect.height / 2)) * 0.15;
                const clamped = Math.max(-40, Math.min(40, delta));
                el.style.setProperty('--parallax', `${clamped.toFixed(1)}px`);
            });
        };

        const onScroll = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(update);
            }
        };

        update();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, []);
}

const App: React.FC = () => {
    useScrollDepthAndParallax();

    return (
        <>
            <a href="#main" className="skip-link">
                Skip to main content
            </a>
            <div className="scroll-progress" aria-hidden="true" />
            <Header />
            <main id="main">
                <Hero />
                <Focus />
                <About />
                <Projects />

                <Section id="kv-explorer" heading="KV cache and serving capacity">
                    <p className="measure demo-intro">
                        Pick a context length and a KV cache precision. The numbers below are computed live from
                        Llama-3.1-8B&rsquo;s real architecture, then checked against what I measured on an H100.
                    </p>
                    <DeferredDemo minHeight={640}>
                        <KvExplorer />
                    </DeferredDemo>
                </Section>

                <Section id="live-inference" heading="Run a model in this tab">
                    <DeferredDemo minHeight={560}>
                        <LiveInference />
                    </DeferredDemo>
                </Section>

                <Experience />
                <Skills />
                <Education />
                <Awards />
                <Contact />
            </main>

            <style>{`
                .demo-intro {
                    color: var(--ink-soft);
                    margin-bottom: var(--space-5);
                }
                .demo-placeholder {
                    background: var(--surface);
                    border: 1px solid var(--rule);
                    border-radius: var(--radius);
                }
                @media (max-width: 560px) {
                    .demo-placeholder {
                        min-height: 480px !important;
                    }
                }
            `}</style>
        </>
    );
};

export default App;
