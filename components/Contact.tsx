import React from 'react';
import Section from './Section';
import { PERSONAL_INFO, CONTACT } from '../constants';
import './Contact.css';

const Contact: React.FC = () => {
    return (
        <Section id="contact" heading={CONTACT.heading}>
            <div className="contact measure">
                <p className="contact__body">{CONTACT.body}</p>
                <div className="cluster contact__actions">
                    <a className="contact__cta contact__cta--primary" href={`mailto:${PERSONAL_INFO.email}`}>
                        {CONTACT.ctas.email}
                    </a>
                    <a className="contact__cta" href={PERSONAL_INFO.resumeUrl}>
                        {CONTACT.ctas.resume}
                    </a>
                    <a
                        className="contact__cta"
                        href={PERSONAL_INFO.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {CONTACT.ctas.linkedin}
                    </a>
                    <a
                        className="contact__cta"
                        href={PERSONAL_INFO.github}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {CONTACT.ctas.github}
                    </a>
                </div>
            </div>
        </Section>
    );
};

export default Contact;
