import React, { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Focus from './components/Focus';
import About from './components/About';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Skills from './components/Skills';
import Education from './components/Education';
import Awards from './components/Awards';
import Contact from './components/Contact';

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
                <Experience />
                <Skills />
                <Education />
                <Awards />
                <Contact />
            </main>
        </>
    );
};

export default App;
