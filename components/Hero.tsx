import React from 'react';
import { PERSONAL_INFO } from '../constants';
import KernelChart from './KernelChart';

const Hero: React.FC = () => {
    return (
        <section id="hero" className="hero">
            <div className="container">
                <p className="cluster hero-meta">
                    <span>{PERSONAL_INFO.name}</span>
                    <span>{PERSONAL_INFO.roleLine}</span>
                    <span>{PERSONAL_INFO.location}</span>
                </p>

                <h1 className="hero-headline">{PERSONAL_INFO.headline}</h1>

                <p className="measure hero-subhead">{PERSONAL_INFO.subhead}</p>

                <div className="hero-chart-wrap">
                    <KernelChart />
                </div>
            </div>

            <style>{`
                .hero {
                    padding-block: var(--space-9) var(--space-8);
                }
                .hero-meta {
                    color: var(--ink-soft);
                    font-size: var(--fs-2);
                    margin-bottom: var(--space-5);
                    --cluster-gap: var(--space-4);
                }
                .hero-headline {
                    color: var(--ink);
                    margin-bottom: var(--space-5);
                }
                .hero-subhead {
                    color: var(--ink-soft);
                    font-size: var(--fs-4);
                    margin-bottom: var(--space-8);
                }
                .hero-chart-wrap {
                    max-width: 640px;
                }
            `}</style>
        </section>
    );
};

export default Hero;
