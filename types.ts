export interface ExperienceItem {
    id: string;
    title: string;
    company: string;
    period: string;
    location: string;
    description: string[];
}

export interface EducationItem {
    id: string;
    degree: string;
    institution: string;
    period: string;
    details?: string;
}

export interface ProjectItem {
    id: string;
    title: string;
    description: string;
    tags: string[];
    link?: string;
}

export interface SkillCategory {
    category: string;
    skills: string[];
}