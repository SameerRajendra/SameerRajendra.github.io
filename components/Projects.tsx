import React from 'react';
import Section from './Section';
import { PROJECTS, Icons } from '../constants';

const Projects: React.FC = () => {
    return (
        <Section id="projects" title="Featured Projects">
            <div className="grid md:grid-cols-2 gap-6">
                {PROJECTS.map((project) => (
                    <div key={project.id} className="group relative bg-card/40 hover:bg-card/60 backdrop-blur-sm p-8 rounded-2xl transition-all duration-300 border border-slate-800 hover:border-primary/50 flex flex-col hover:-translate-y-2 overflow-hidden">

                        {/* Hover Gradient Effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                        {/* Header: folder icon */}
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className="p-3 bg-primary/10 rounded-xl text-primary ring-1 ring-primary/20 group-hover:ring-primary/50 transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>
                                </svg>
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-slate-200 mb-3 group-hover:text-primary transition-colors relative z-10">
                            {project.title}
                        </h3>

                        {/* Description */}
                        <p className="text-slate-400 mb-6 flex-grow leading-relaxed relative z-10 text-sm">
                            {project.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-6 relative z-10">
                            {project.tags.map((tag) => (
                                <span key={tag} className="text-xs font-mono font-medium text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700/50">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Action buttons */}
                        <div className="relative z-20 mt-auto flex flex-wrap gap-3">
                            {project.link && (
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-primary/30 text-primary text-sm font-mono hover:bg-primary/10 hover:border-primary transition-all"
                                    aria-label={`View ${project.title} on GitHub`}
                                >
                                    <Icons.GitHub className="w-4 h-4" />
                                    GitHub
                                </a>
                            )}
                            {project.reportUrl && (
                                <a
                                    href={project.reportUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-500/30 text-amber-400 text-sm font-mono hover:bg-amber-500/10 hover:border-amber-400 transition-all"
                                    aria-label={`Read research report for ${project.title}`}
                                >
                                    <Icons.FileText className="w-4 h-4" />
                                    Read Report
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
};

export default Projects;
