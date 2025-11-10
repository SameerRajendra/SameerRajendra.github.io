
import React, { useRef, useEffect, useState } from 'react';

interface SectionProps {
    id: string;
    title?: string;
    className?: string;
    children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ id, title, className = "", children }) => {
    const sectionRef = useRef<HTMLElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                // Lower threshold triggers visibility sooner when entering viewport
                threshold: 0.1,
            }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <section 
            id={id} 
            ref={sectionRef}
            className={`py-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto scroll-mt-20 transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'} ${className}`}
        >
            {title && (
                <div className="mb-12 flex items-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-100 whitespace-nowrap">
                        <span className="text-primary/80 font-mono text-2xl mr-2">#</span>{title}
                    </h2>
                    <div className="ml-6 h-px bg-slate-800 w-full max-w-md opacity-50"></div>
                </div>
            )}
            {children}
        </section>
    );
};

export default Section;
