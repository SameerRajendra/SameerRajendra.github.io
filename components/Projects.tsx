import React from 'react';
import Section from './Section';
import { PROJECTS, EARLIER_WORK } from '../constants';
import './Projects.css';

/**
 * Selected work — report entries, not cards. Each entry carries a real
 * results table (the one place a raised surface + rule hairlines belong)
 * with the measurement basis always visible as its own column.
 */
const Projects: React.FC = () => {
    return (
        <Section id="projects" heading="Selected work">
            <div className="projects-list">
                {PROJECTS.map((project) => {
                    const titleId = `${project.id}-title`;
                    return (
                        <article className="project" key={project.id} aria-labelledby={titleId}>
                            <header className="project__header">
                                <h3 id={titleId} className="project__title">{project.title}</h3>
                                <p className="project__date">{project.date}</p>
                                {project.context && (
                                    <p className="project__context">{project.context}</p>
                                )}
                            </header>

                            <p className="project__oneline measure">{project.oneline}</p>

                            <ul className="project__bullets measure">
                                {project.bullets.map((bullet, i) => (
                                    <li key={i}>{bullet}</li>
                                ))}
                            </ul>

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
                                    <tbody>
                                        {project.results.map((result, i) => (
                                            <tr key={i}>
                                                <th scope="row">{result.metric}</th>
                                                <td className="tabular-nums">{result.value}</td>
                                                <td>{result.basis}</td>
                                            </tr>
                                        ))}
                                    </tbody>
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
                })}
            </div>

            <div className="earlier-work">
                <h3 className="earlier-work__heading">Earlier work</h3>
                <ul className="earlier-work__list">
                    {EARLIER_WORK.map((item) => (
                        <li key={item.id} className="earlier-work__item">
                            <p className="earlier-work__title">{item.title}</p>
                            <p className="earlier-work__summary measure">{item.summary}</p>
                            <a href={item.url} target="_blank" rel="noopener noreferrer">GitHub</a>
                        </li>
                    ))}
                </ul>
            </div>
        </Section>
    );
};

export default Projects;
