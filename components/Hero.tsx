
import React from 'react';
import { PERSONAL_INFO, Icons } from '../constants';

const Hero: React.FC = () => {
    return (
        <section id="hero" className="min-h-screen flex flex-col justify-center relative px-6 md:px-12 lg:px-24 max-w-7xl mx-auto pt-10">
             {/* Decorational glowing orbs */}
             <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-[128px] pointer-events-none opacity-40 mix-blend-screen"></div>
             <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] pointer-events-none opacity-40 mix-blend-screen"></div>

             <div className="space-y-6 relative z-10 animate-fade-in-up">
                <p className="text-primary font-mono tracking-wide ml-1">Hi, my name is</p>
                <h1 className="text-6xl md:text-8xl font-bold text-slate-100 tracking-tighter">
                    {PERSONAL_INFO.name}.
                </h1>
                <h2 className="text-4xl md:text-6xl font-bold text-slate-400">
                    I build <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-400 to-primary bg-[length:200%_auto] animate-text-shimmer"> intelligent systems.</span>
                </h2>
                <div className="max-w-2xl">
                    <p className="text-lg md:text-xl text-slate-400 mt-8 leading-relaxed">
                        I'm a {PERSONAL_INFO.title} specializing in {PERSONAL_INFO.tagline}.
                    </p>
                    <p className="text-lg md:text-xl text-slate-400 mt-2 leading-relaxed">
                        Currently pursuing my MS in AI at <span className="text-slate-200 font-medium">Stevens Institute of Technology</span>.
                    </p>
                </div>

                <div className="flex flex-wrap gap-5 pt-10">
                    <a href="#projects" className="group px-8 py-4 bg-primary text-darker rounded font-bold flex items-center gap-2 cursor-pointer hover:bg-primary/90 transition-all shadow-[0_0_20px_-5px_rgba(6,182,212,0.5)] hover:shadow-[0_0_25px_-5px_rgba(6,182,212,0.7)]">
                        View My Work <Icons.ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                    </a>
                    <a href="#contact" className="px-8 py-4 bg-transparent text-primary border-2 border-primary rounded font-bold cursor-pointer hover:bg-primary/10 transition-colors">
                        Get In Touch
                    </a>
                </div>

                <div className="flex items-center gap-6 pt-16 text-slate-500">
                    <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors transform hover:scale-110" aria-label="LinkedIn">
                        <Icons.Linkedin className="w-6 h-6" />
                    </a>
                    <a href={`mailto:${PERSONAL_INFO.email}`} className="hover:text-primary transition-colors transform hover:scale-110" aria-label="Email">
                        <Icons.Mail className="w-6 h-6" />
                    </a>
                    <div className="h-px w-12 bg-slate-800"></div>
                    <div className="flex items-center gap-2 text-sm font-mono">
                        <Icons.MapPin className="w-4 h-4 text-primary" />
                        {PERSONAL_INFO.location}
                    </div>
                </div>
             </div>
        </section>
    );
};

export default Hero;
