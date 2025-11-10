import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';

const Header: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'About', href: '#about' },
        { name: 'Experience', href: '#experience' },
        { name: 'Projects', href: '#projects' },
        { name: 'Skills', href: '#skills' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-darker/90 backdrop-blur-md py-3 shadow-lg shadow-black/20' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
                <a href="#hero" className="text-2xl font-bold tracking-tight text-primary font-mono">
                    SR<span className="text-slate-300">.</span>
                </a>

                {/* Desktop Nav */}
                <nav className="hidden md:flex space-x-8">
                    {navLinks.map((link) => (
                        <a key={link.name} href={link.href} className="text-sm font-medium text-slate-300 hover:text-primary transition-colors">
                            <span className="text-primary mr-1">#</span>{link.name}
                        </a>
                    ))}
                </nav>

                {/* Mobile Menu Button */}
                <button 
                    className="md:hidden text-slate-300 hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <Icons.X /> : <Icons.Menu />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isMobileMenuOpen && (
                <nav className="md:hidden absolute top-full left-0 w-full bg-card/95 backdrop-blur-md border-b border-slate-800 py-4 px-6 flex flex-col space-y-4 shadow-2xl">
                    {navLinks.map((link) => (
                        <a 
                            key={link.name} 
                            href={link.href} 
                            className="text-base font-medium text-slate-200 hover:text-primary py-2 border-b border-slate-800/50"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                             <span className="text-primary mr-2">#</span>{link.name}
                        </a>
                    ))}
                </nav>
            )}
        </header>
    );
};

export default Header;