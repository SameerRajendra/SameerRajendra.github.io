import React from 'react';
import Section from './Section';
import Reveal from './Reveal';
import CountUp from './CountUp';
import { useInView } from '../hooks/useInView';
import { PROJECTS, EARLIER_WORK } from '../constants';
import type { Project } from '../types';
import './Projects.css';

/**
 * One project entry. Split out so each entry owns its own useInView call
 * for its heading (hooks can't be called in a .map callback directly).
 */
const ProjectEntry: React.FC<{ project: Project }> = ({ project }) => {
    const titleId = `${project.id}-title`;
    // useInView (not <Reveal>) for the title: it carries the id that
    // aria-labelledby points to, and the shared Reveal contract only
    // guarantees it forwards className, not arbitrary props like id.
    const [titleRef, titleInView] = useInView<HTMLHeadingElement>();

    return (
        <article className="project" aria-labelledby={titleId}>
            <header className="project__header">
                <h3
                    id={titleId}
                    ref={titleRef}
                    className={`project__title reveal reveal--lift${titleInView ? ' is-visible' : ''}`}
                >
                    {project.title}
                </h3>
                <p className="project__date">{project.date}</p>
                {project.context && (
                    <p className="project__context">{project.context}</p>
                )}
            </header>

            <p className="project__oneline measure">{project.oneline}</p>

            <Reveal as="ul" variant="up" stagger className="project__bullets measure">
                {project.bullets.map((bullet, i) => (
                    <li key={i} style={{ '--i': i } as React.CSSProperties}>{bullet}</li>
                ))}
            </Reveal>

            <div className="table-wrap surface">
                <table className="project__results">
                    <caption className="sr-only">Results for {project.title}</caption>
                    <thead>
                        <tr>
                            <th scope="col">Metric</th>
                            <th scope="col">Value</th>
                            <th scope="col">Measured against</th>
                        </tr>
                    </thead>
                    <Reveal as="tbody" variant="up" stagger>
                        {project.results.map((result, i) => (
                            <tr
                                key={i}
                                className="project__result-row"
                                tabIndex={0}
                                style={{ '--i': i } as React.CSSProperties}
                            >
                                <th scope="row">{result.metric}</th>
                                <td className="tabular-nums"><CountUp value={result.value} /></td>
                                <td>{result.basis}</td>
                            </tr>
                        ))}
                    </Reveal>
                </table>
            </div>

            <ul className="project__tags">
                {project.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                ))}
            </ul>

            <div className="cluster project__links">
                {project.links.map((link) => (
                    <a
                        key={link.url}
                        className="project__link"
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {link.label}
                    </a>
                ))}
            </div>
        </article>
    );
};

/**
 * Selected work — report entries, not cards. Each entry carries a real
 * results table (the one place a raised surface + rule hairlines belong)
 * with the measurement basis always visible as its own column.
 */
const Projects: React.FC = () => {
    return (
        <Section id="projects" heading="Selected work">
            <div className="projects-list">
                {PROJECTS.map((project) => (
                    <ProjectEntry project={project} key={project.id} />
                ))}
            </div>

            <div className="earlier-work">
                <h3 className="earlier-work__heading">Earlier work</h3>
                <ul className="earlier-work__list">
                    {EARLIER_WORK.map((item) => (
                        <li key={item.id} className="earlier-work__item">
                            <p className="earlier-work__title">{item.title}</p>
                            <p className="earlier-work__summary measure">{item.summary}</p>
                            <a className="project__link" href={item.url} target="_blank" rel="noopener noreferrer">GitHub</a>
                        </li>
                    ))}
                </ul>
            </div>
        </Section>
    );
};

export default Projects;
