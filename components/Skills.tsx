
import React from 'react';
import Section from './Section';
import { SKILLS } from '../constants';

const Skills: React.FC = () => {
    return (
        <Section id="skills" title="Technical Expertise">
            <div className="grid md:grid-cols-2 gap-6">
                {SKILLS.map((category, index) => (
                    <div key={index} className="group bg-card/20 backdrop-blur-sm p-8 rounded-2xl border border-slate-800/80 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
                        {/* Subtle glowing corner */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-500"></div>

                        <h3 className="text-xl font-bold text-slate-100 mb-8 flex items-center relative z-10">
                            {category.category}
                        </h3>
                        <div className="flex flex-wrap gap-3 relative z-10">
                            {category.skills.map((skill) => (
                                <div key={skill} className="text-sm font-mono text-primary/90 bg-primary/5 border border-primary/20 px-4 py-2 rounded-lg transition-all hover:bg-primary/15 hover:border-primary/50 hover:text-primary cursor-default hover:shadow-[0_0_15px_-3px_rgba(6,182,212,0.2)]">
                                    {skill}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
};

export default Skills;
