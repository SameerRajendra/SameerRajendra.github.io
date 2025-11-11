
import React, { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import Hero from './components/Hero.tsx';
import About from './components/About.tsx';
import Experience from './components/Experience.tsx';
import Projects from './components/Projects.tsx';
import Skills from './components/Skills.tsx';
import Education from './components/Education.tsx';
import Contact from './components/Contact.tsx';

const App: React.FC = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const updateMousePosition = (ev: MouseEvent) => {
            setMousePosition({ x: ev.clientX, y: ev.clientY });
        };
        window.addEventListener('mousemove', updateMousePosition);
        return () => window.removeEventListener('mousemove', updateMousePosition);
    }, []);

    return (
        <div className="min-h-screen bg-darker relative overflow-x-hidden">
            {/* Interactive Spotlight Background */}
            <div 
                className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(6, 182, 212, 0.07), transparent 80%)`
                }}
            ></div>

            {/* Fixed Background Grid */}
            <div className="fixed inset-0 bg-grid-pattern pointer-events-none z-0 opacity-50"></div>

            <Header />
            <main className="relative z-10">
                <Hero />
                <About />
                <Experience />
                <Projects />
                <Skills />
                <Education />
                <Contact />
            </main>
        </div>
    );
};

export default App;
