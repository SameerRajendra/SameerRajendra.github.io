import React from 'react';
import Section from './Section.tsx';
import { EXPERIENCES } from '../constants.tsx';

const Experience: React.FC = () => {
    return (
        <Section id="experience" title="Where I've Worked">
            <div className="space-y-12">
                {EXPERIENCES.map((exp) => (
                    <div key={exp.id} className="relative pl-8 md:pl-0 md:grid md:grid-cols-12 gap-8 group">
                        {/* Timeline line for desktop */}
                        <div className="hidden md:block absolute left-0 top-2 bottom-0 w-px bg-slate-800 md:left-[25%]"></div>
                        
                        {/* Left side: Company & Date */}
                        <div className="md:col-span-3 md:text-right relative">
                            <h3 className="text-xl font-bold text-slate-100">{exp.company}</h3>
                            <p className="text-primary font-mono text-sm mt-1 mb-4 md:mb-0">{exp.period}</p>
                             {/* Timeline dot */}
                             <div className="absolute left-[-2.3rem] md:left-auto md:right-[-2.3rem] top-2 w-4 h-4 rounded-full bg-slate-900 border-2 border-primary z-10 group-hover:bg-primary transition-colors"></div>
                        </div>

                        {/* Right side: Role & Details */}
                        <div className="md:col-span-9 bg-card/50 p-6 rounded-xl border border-slate-800/50 hover:border-primary/30 transition-colors">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-4">
                                <h4 className="text-lg font-semibold text-slate-200">{exp.title}</h4>
                                <span className="text-slate-500 text-sm font-mono mt-1 sm:mt-0">{exp.location}</span>
                            </div>
                            <ul className="space-y-3">
                                {exp.description.map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="text-primary mr-2 mt-1.5">▹</span>
                                        <span className="text-slate-400 leading-relaxed">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
};

export default Experience;