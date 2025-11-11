import React from 'react';
import Section from './Section';
import { EXPERIENCES } from '../constants';

const Experience: React.FC = () => {
    return (
        <Section id="experience" title="Where I've Worked">
            <div className="relative">
                {/* 
                  The timeline line. For desktop (`md:`), it's positioned in the middle of the gap.
                  The calculation `calc(25% + 1rem)` precisely centers it. The grid has a 4rem gap. The formula for the center point is: (ContainerWidth - Gap) / 4 + (Gap / 2) which simplifies to calc(25% + 1rem).
                */}
                <div className="absolute top-1.5 bottom-0 w-px bg-slate-800 left-4 md:left-[calc(25%+1rem)]"></div>

                <div className="space-y-12">
                    {EXPERIENCES.map((exp) => (
                        <div key={exp.id} className="relative pl-12 md:pl-0 md:grid md:grid-cols-12 md:gap-16 group">
                            
                            {/* 
                              Timeline dot. It uses the same precise calculation to position itself on the line and is then centered with a transform.
                            */}
                            <div className="absolute left-4 top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-primary z-10 group-hover:bg-primary transition-colors md:left-[calc(25%+1rem)] md:-translate-x-1/2"></div>
                            
                            {/* Left side: Company & Date */}
                            <div className="md:col-span-3 md:text-right">
                                <h3 className="text-xl font-bold text-slate-100">{exp.company}</h3>
                                <p className="text-primary font-mono text-sm mt-1 mb-4 md:mb-0">{exp.period}</p>
                            </div>

                            {/* Right side: Role & Details */}
                            <div className="md:col-span-9 relative">
                                {/* Horizontal connector line - spans half the gap (2rem) to connect the card to the timeline. */}
                                <div className="hidden md:block absolute top-3.5 -left-8 w-8 h-px bg-slate-800"></div>
                                
                                <div className="bg-card/50 p-6 rounded-xl border border-slate-800/50 hover:border-primary/30 transition-colors">
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
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
};

export default Experience;