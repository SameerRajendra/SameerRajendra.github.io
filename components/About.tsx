import React from 'react';
import { PERSONAL_INFO } from '../constants';
import photo from '../myphoto.jpg';
import Reveal from './Reveal';

const About: React.FC = () => {
    return (
        <section id="about" className="about-section">
            <div className="container about-layout">
                <Reveal as="p" className="measure about-copy">
                    {PERSONAL_INFO.about}
                </Reveal>
                <img
                    src={photo}
                    alt="Portrait of Sameer Rajendra"
                    width={280}
                    height={280}
                    className="about-photo parallax"
                />
            </div>

            <style>{`
                .about-section {
                    padding-block: var(--space-8);
                    border-top: 1px solid var(--rule);
                }
                .about-layout {
                    display: flex;
                    flex-direction: column-reverse;
                    gap: var(--space-6);
                    align-items: flex-start;
                }
                .about-copy {
                    color: var(--ink-soft);
                    margin: 0;
                }
                .about-photo {
                    width: 140px;
                    height: 140px;
                    object-fit: cover;
                    border-radius: var(--radius);
                    flex-shrink: 0;
                }
                @media (min-width: 700px) {
                    .about-layout {
                        flex-direction: row;
                        align-items: flex-start;
                    }
                    .about-photo {
                        width: 200px;
                        height: 200px;
                    }
                }
            `}</style>
        </section>
    );
};

export default About;
