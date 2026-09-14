import React from 'react';
import Section from './Section';
import { SKILLS } from '../constants';
import './Skills.css';

/**
 * Six categories as a definition list — comma-separated inline text per
 * category, never bordered pill chips.
 */
const Skills: React.FC = () => {
    return (
        <Section id="skills" heading="Skills">
            <dl className="skills-list">
                {SKILLS.map((category) => (
                    <React.Fragment key={category.category}>
                        <dt className="skills-list__category">{category.category}</dt>
                        <dd className="skills-list__items">{category.items.join(', ')}</dd>
                    </React.Fragment>
                ))}
            </dl>
        </Section>
    );
};

export default Skills;
