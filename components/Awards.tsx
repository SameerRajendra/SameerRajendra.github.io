import React from 'react';
import Section from './Section';
import { AWARD } from '../constants';
import './Awards.css';

const Awards: React.FC = () => {
    return (
        <Section id="awards" heading="Award">
            <article className="award measure">
                <h3 className="award__title">{AWARD.title}</h3>
                <p className="award__meta">{AWARD.event}, {AWARD.date}</p>
                <p className="award__organizers">{AWARD.organizers}, {AWARD.location}</p>
                <p className="award__description">{AWARD.description}</p>
            </article>
        </Section>
    );
};

export default Awards;
