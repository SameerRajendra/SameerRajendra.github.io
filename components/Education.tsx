import React from 'react';
import Section from './Section';
import { EDUCATION } from '../constants';

const Education: React.FC = () => {
    return (
        <Section id="education" title="Education">
            <div className="space-y-6">
                {EDUCATION.map((edu) => (
                    <div 
                        key={edu.id}
                        className="group bg-card/20 backdrop-blur-sm p-8 rounded-2xl border border-slate-800/80 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                    >
                        {/* Decorative glowing corner */}
                        <div className="absolute -top-12 -right-12 w-36 h-36 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/15 transition-colors duration-500 pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                            <div className="flex-grow">
                                <h3 className="text-xl font-bold text-slate-100 group-hover:text-primary transition-colors">{edu.degree}</h3>
                                <p className="text-lg text-slate-400 mt-1">{edu.institution}</p>
                                {edu.details && <p className="text-slate-500 text-sm mt-2 font-mono">{edu.details}</p>}
                            </div>
                            <div className="mt-2 sm:mt-1 text-primary font-mono whitespace-nowrap bg-primary/5 px-4 py-2 rounded-full text-sm border border-primary/20 self-start flex-shrink-0">
                                {edu.period}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
};

export default Education;