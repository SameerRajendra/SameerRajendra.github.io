import React from 'react';
import { PERSONAL_INFO, EXPERIENCES, EDUCATION, SKILLS } from '../constants';

const RESUME_URL = 'https://raw.githubusercontent.com/SameerRajendra/SameerRajendra.github.io/main/resume.pdf';

const Resume: React.FC = () => {
    return (
        <section id="resume" className="py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-16">
                <h2 className="text-3xl font-bold text-slate-100 font-mono whitespace-nowrap">
                    <span className="text-primary">#</span>Resume
                </h2>
                <div className="h-px flex-grow bg-slate-800"></div>
                <a
                    href={RESUME_URL}
                    download="Sameer_Rajendra_Resume.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-2 px-5 py-2.5 border border-primary text-primary rounded font-mono text-sm hover:bg-primary/10 transition-colors whitespace-nowrap"
                    aria-label="Download resume PDF"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" x2="12" y1="15" y2="3"/>
                    </svg>
                    Download PDF
                </a>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column */}
                <div className="space-y-10">
                    {/* Contact */}
                    <div>
                        <h3 className="text-xs font-mono uppercase tracking-widest text-primary mb-4 border-b border-slate-800 pb-2">Contact</h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li>
                                <span className="text-slate-500 mr-2">Email</span>
                                <a href={`mailto:${PERSONAL_INFO.email}`} className="text-slate-300 hover:text-primary transition-colors break-all">{PERSONAL_INFO.email}</a>
                            </li>
                            <li>
                                <span className="text-slate-500 mr-2">LinkedIn</span>
                                <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="text-slate-300 hover:text-primary transition-colors">sameer-rajendra</a>
                            </li>
                            <li>
                                <span className="text-slate-500 mr-2">Location</span>
                                <span className="text-slate-300">{PERSONAL_INFO.location}</span>
                            </li>
                        </ul>
                    </div>

                    {/* Skills */}
                    <div>
                        <h3 className="text-xs font-mono uppercase tracking-widest text-primary mb-4 border-b border-slate-800 pb-2">Skills</h3>
                        <div className="space-y-4">
                            {SKILLS.map((cat) => (
                                <div key={cat.category}>
                                    <p className="text-xs text-slate-500 font-mono mb-2">{cat.category}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {cat.skills.map((skill) => (
                                            <span key={skill} className="text-xs px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Education */}
                    <div>
                        <h3 className="text-xs font-mono uppercase tracking-widest text-primary mb-4 border-b border-slate-800 pb-2">Education</h3>
                        <div className="space-y-5">
                            {EDUCATION.map((edu) => (
                                <div key={edu.id}>
                                    <p className="text-sm font-semibold text-slate-200 leading-snug">{edu.degree}</p>
                                    <p className="text-sm text-primary mt-0.5">{edu.institution}</p>
                                    <p className="text-xs text-slate-500 font-mono mt-1">{edu.period}</p>
                                    {edu.details && <p className="text-xs text-slate-400 mt-1">{edu.details}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column — Experience */}
                <div className="lg:col-span-2">
                    <h3 className="text-xs font-mono uppercase tracking-widest text-primary mb-6 border-b border-slate-800 pb-2">Experience</h3>
                    <div className="relative space-y-10 before:absolute before:left-0 before:top-2 before:bottom-2 before:w-px before:bg-slate-800">
                        {EXPERIENCES.map((exp) => (
                            <div key={exp.id} className="pl-8 relative">
                                {/* Timeline dot */}
                                <span className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-primary -translate-x-[3px]"></span>

                                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-3">
                                    <div>
                                        <h4 className="text-base font-bold text-slate-100">{exp.title}</h4>
                                        <p className="text-primary text-sm font-mono">{exp.company}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-xs font-mono text-slate-500">{exp.period}</p>
                                        <p className="text-xs text-slate-500">{exp.location}</p>
                                    </div>
                                </div>

                                <ul className="space-y-2">
                                    {exp.description.map((point, i) => (
                                        <li key={i} className="flex gap-3 text-sm text-slate-400">
                                            <span className="text-primary shrink-0 mt-0.5">▹</span>
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Resume;
