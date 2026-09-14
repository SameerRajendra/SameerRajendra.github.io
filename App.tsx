import React from 'react';
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

const App: React.FC = () => {
    return (
        <>
            <a href="#main" className="skip-link">
                Skip to main content
            </a>
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
