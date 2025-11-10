import React from 'react';
import Section from './Section';
import { EDUCATION } from '../constants';

const Education: React.FC = () => {
    return (
        <Section id="education" title="Education" className="bg-card/20 -mx-6 px-6 md:-mx-12 md:px-12 lg:-mx-24 lg:px-24 rounded-3xl">
            <div className="space-y-8">
                {EDUCATION.map((edu) => (
                    <div key={edu.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-darker/50 rounded-xl border-l-4 border-primary">
                        <div>
                            <h3 className="text-xl font-bold text-slate-100">{edu.degree}</h3>
                            <p className="text-lg text-slate-400 mt-1">{edu.institution}</p>
                            {edu.details && <p className="text-slate-500 text-sm mt-2 font-mono">{edu.details}</p>}
                        </div>
                        <div className="mt-4 md:mt-0 text-primary font-mono whitespace-nowrap bg-primary/5 px-4 py-2 rounded-full text-sm">
                            {edu.period}
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
};

export default Education;