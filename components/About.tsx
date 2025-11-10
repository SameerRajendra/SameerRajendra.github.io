import React from 'react';
import Section from './Section';
import { PERSONAL_INFO } from '../constants';

const About: React.FC = () => {
    return (
        <Section id="about" title="About Me" className="bg-card/30 rounded-3xl my-10">
            <div className="grid md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-6 text-slate-300 leading-relaxed text-lg">
                    {PERSONAL_INFO.about.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                    ))}
                </div>
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative aspect-square rounded-lg bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
                         {/* Placeholder for actual image if user had one. Using a tech-themed placeholder. */}
                         <div className="text-center p-6">
                            <span className="text-6xl">👨‍💻</span>
                            <p className="mt-4 text-slate-500 text-sm font-mono">
                                [Profile Photo Placeholder]
                            </p>
                         </div>
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default About;