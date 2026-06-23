import React from 'react';
import Section from './Section';
import { AWARDS, Icons } from '../constants';

const Awards: React.FC = () => {
    if (!AWARDS || AWARDS.length === 0) return null;
    return (
        <Section id="awards" title="Awards &amp; Recognition">
            <div className="space-y-6">
                {AWARDS.map((award) => (
                    <div key={award.id} className="relative bg-card/40 backdrop-blur-sm p-8 rounded-2xl border border-slate-800 hover:border-yellow-500/40 transition-all duration-300 group">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"></div>
                        <div className="flex items-start gap-4 relative z-10">
                            <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-400 ring-1 ring-yellow-500/20 shrink-0">
                                <Icons.Trophy className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                                    <h3 className="text-lg font-bold text-slate-200 group-hover:text-yellow-400 transition-colors">{award.title}</h3>
                                    <span className="text-xs font-mono text-slate-500 shrink-0">{award.period}</span>
                                </div>
                                <p className="text-sm text-primary mb-3">{award.organization}</p>
                                <p className="text-sm text-slate-400 leading-relaxed">{award.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
};

export default Awards;
