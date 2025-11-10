
import React from 'react';
import Section from './Section';
import { PERSONAL_INFO } from '../constants';

const About: React.FC = () => {
    // Extract initials for the placeholder
    const initials = PERSONAL_INFO.name
        .split(' ')
        .map(n => n[0])
        .join('');

    return (
        <Section id="about" title="About Me" className="bg-card/30 rounded-3xl my-10">
            <div className="grid md:grid-cols-3 gap-12 items-center">
                <div className="md:col-span-2 space-y-6 text-slate-300 leading-relaxed text-lg">
                    {PERSONAL_INFO.about.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>
                <div className="relative group mx-auto w-full max-w-[250px] md:max-w-none">
                    <div className="absolute -inset-1 bg-gradient-to-tr from-primary via-blue-500 to-primary rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative aspect-square rounded-2xl bg-darker border-2 border-slate-800 overflow-hidden flex items-center justify-center group-hover:border-primary/50 transition-colors">
                         {/* Styled Initials Placeholder */}
                         <div className="flex flex-col items-center justify-center">
                            <span className="text-7xl font-bold font-mono text-slate-700 group-hover:text-primary/50 transition-all duration-500 select-none">
                                {initials}
                            </span>
                         </div>
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default About;
