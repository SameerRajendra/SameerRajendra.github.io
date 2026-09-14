import React from 'react';
import Section from './Section';
import { EDUCATION } from '../constants';
import './Education.css';

const Education: React.FC = () => {
    return (
        <Section id="education" heading="Education">
            <div className="education-list">
                {EDUCATION.map((edu) => (
                    <article className="education-item measure" key={edu.id}>
                        <h3 className="education-item__degree">{edu.degree}</h3>
                        <p className="education-item__institution">{edu.institution}, {edu.location}</p>
                        <p className="education-item__period">
                            {edu.period}{edu.detail ? `, ${edu.detail}` : ''}
                        </p>
                        <p className="education-item__coursework">
                            <span className="education-item__coursework-label">Coursework: </span>
                            {edu.coursework.join(', ')}
                        </p>
                    </article>
                ))}
            </div>
        </Section>
    );
};

export default Education;
