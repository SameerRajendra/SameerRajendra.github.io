import React from 'react';
import Section from './Section';
import { FOCUS_AREAS } from '../constants';
import './Focus.css';

/**
 * "What I work on" — three short prose blocks. No cards, no icons, no
 * borders; whitespace and the type scale do the work.
 */
const Focus: React.FC = () => {
    return (
        <Section id="focus" heading="What I work on">
            <div className="focus-list">
                {FOCUS_AREAS.map((area) => (
                    <div className="focus-item measure" key={area.id}>
                        <h3 className="focus-item__heading">{area.heading}</h3>
                        <p>{area.body}</p>
                    </div>
                ))}
            </div>
        </Section>
    );
};

export default Focus;
