import React from 'react';
import Section from './Section';
import { EXPERIENCE } from '../constants';
import './Experience.css';

const Experience: React.FC = () => {
    return (
        <Section id="experience" heading="Experience">
            <div className="experience-list">
                {EXPERIENCE.map((exp) => (
                    <article className="experience-item measure" key={exp.id}>
                        <h3 className="experience-item__role">{exp.role}</h3>
                        <p className="experience-item__company">{exp.company}, {exp.location}</p>
                        <p className="experience-item__period">{exp.period}</p>
                        <ul className="experience-item__bullets">
                            {exp.bullets.map((bullet, i) => (
                                <li key={i}>{bullet}</li>
                            ))}
                        </ul>
                    </article>
                ))}
            </div>
        </Section>
    );
};

export default Experience;
