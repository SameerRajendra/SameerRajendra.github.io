import React from 'react';
import { PERSONAL_INFO } from '../constants';

const RESUME_URL = 'https://raw.githubusercontent.com/SameerRajendra/SameerRajendra.github.io/main/resume.pdf';

const Resume: React.FC = () => {
    return (
        <section id="resume" className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-16">
                <h2 className="text-3xl font-bold text-slate-100 font-mono whitespace-nowrap">
                    <span className="text-primary">#</span>Resume
                </h2>
                <div className="h-px flex-grow bg-slate-800"></div>
            </div>

            <div className="group relative bg-card/20 backdrop-blur-sm rounded-2xl border border-slate-800/80 hover:border-primary/30 transition-all duration-500 overflow-hidden">
                {/* Ambient glow */}
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-[96px] group-hover:bg-primary/15 transition-colors duration-700 pointer-events-none"></div>
                <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-600/5 rounded-full blur-[96px] pointer-events-none"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10 p-10 md:p-14">
                    {/* Left: Text */}
                    <div className="max-w-xl">
                        <p className="text-primary font-mono text-sm tracking-widest uppercase mb-4">Open to opportunities</p>
                        <h3 className="text-3xl md:text-4xl font-bold text-slate-100 leading-tight mb-4">
                            Let's build something<br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">intelligent together.</span>
                        </h3>
                        <p className="text-slate-400 leading-relaxed">
                            I'm {PERSONAL_INFO.name}, a {PERSONAL_INFO.title} based in {PERSONAL_INFO.location}.
                            My full resume covers my experience at Oneirix Labs, my MS at Stevens Institute of Technology,
                            and projects in computer vision, NLP, and fairness in AI.
                        </p>
                        <div className="flex flex-wrap gap-3 mt-6">
                            {['Deep Learning', 'Computer Vision', 'PyTorch', 'Transformers', 'CUDA'].map(tag => (
                                <span key={tag} className="text-xs font-mono text-primary/80 bg-primary/5 border border-primary/20 px-3 py-1 rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col items-center gap-4 shrink-0">
                        <a
                            href={RESUME_URL}
                            download="Sameer_Rajendra_Resume.pdf"
                            target="_blank"
                            rel="noreferrer"
                            className="group/btn flex items-center gap-3 px-8 py-4 bg-primary text-darker font-bold rounded-lg hover:bg-primary/90 transition-all shadow-[0_0_24px_-6px_rgba(6,182,212,0.5)] hover:shadow-[0_0_32px_-6px_rgba(6,182,212,0.7)] text-base"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:translate-y-0.5 transition-transform" aria-hidden="true">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" x2="12" y1="15" y2="3"/>
                            </svg>
                            Download Resume
                        </a>
                        <a
                            href={PERSONAL_INFO.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-8 py-4 bg-transparent text-primary border-2 border-primary/40 font-bold rounded-lg hover:border-primary hover:bg-primary/10 transition-all text-base"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                                <rect width="4" height="12" x="2" y="9"/>
                                <circle cx="4" cy="4" r="2"/>
                            </svg>
                            View LinkedIn
                        </a>
                        <p className="text-xs text-slate-600 font-mono mt-1">PDF · Updated 2026</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Resume;
