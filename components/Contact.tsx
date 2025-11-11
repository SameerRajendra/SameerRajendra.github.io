
import React from 'react';
import Section from './Section.tsx';
import { PERSONAL_INFO, Icons } from '../constants.tsx';

const Contact: React.FC = () => {
    return (
        <Section id="contact" title="Get In Touch" className="text-center !max-w-4xl">
            <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto">
                I'm currently looking for new opportunities in AI and Deep Learning. 
                Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </p>

            <div className="flex flex-col md:flex-row justify-center gap-6 mb-16 items-center">
                <a 
                    href={`mailto:${PERSONAL_INFO.email}`}
                    className="flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-primary text-primary rounded hover:bg-primary/10 transition-all font-bold text-lg w-full md:w-auto justify-center"
                >
                    <Icons.Mail /> Say Hello
                </a>
                <a 
                    href={PERSONAL_INFO.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 px-8 py-4 bg-slate-800 text-slate-200 rounded hover:bg-slate-700 transition-all font-bold text-base w-full md:w-auto justify-center whitespace-nowrap"
                >
                    <Icons.Linkedin className="flex-shrink-0" /> 
                    LinkedIn
                </a>
            </div>

            <footer className="pt-12 border-t border-slate-800 text-slate-500 font-mono text-sm">
                <p>Designed & Built by {PERSONAL_INFO.name}</p>
                <div className="flex justify-center gap-6 mt-4">
                     {/* Re-using icons for footer */}
                    
                </div>
            </footer>
        </Section>
    );
};

export default Contact;
