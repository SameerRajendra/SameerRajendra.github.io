// ============================ IDENTITY ============================

export interface PersonalInfo {
    name: string;
    roleLine: string;
    headline: string;
    location: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    resumeUrl: string;
    subhead: string;
    about: string;
}

// ============================ WHAT I WORK ON ============================

export interface FocusArea {
    id: string;
    heading: string;
    body: string;
}

// ============================ HERO CHART ============================

export interface KernelBenchmarkRow {
    context: string;
    contextTokens: number;
    baselineMs: number;
    optimizedMs: number;
    speedup: number;
    argmaxParity: number;
}

export interface KernelBenchmarkMeta {
    model: string;
    hardware: string;
    baselineLabel: string;
    optimizedLabel: string;
}

export interface KernelBenchmark {
    rows: KernelBenchmarkRow[];
    meta: KernelBenchmarkMeta;
}

// ============================ SELECTED WORK ============================

export interface ProjectResult {
    metric: string;
    value: string;
    basis: string;
}

export interface ProjectLink {
    label: string;
    url: string;
}

export interface Project {
    id: string;
    title: string;
    date: string;
    context?: string;
    oneline: string;
    bullets: string[];
    results: ProjectResult[];
    tags: string[];
    links: ProjectLink[];
}

export interface EarlierWorkItem {
    id: string;
    title: string;
    summary: string;
    url: string;
}

// ============================ EXPERIENCE ============================

export interface ExperienceEntry {
    id: string;
    company: string;
    role: string;
    period: string;
    location: string;
    bullets: string[];
}

// ============================ EDUCATION ============================

export interface EducationEntry {
    id: string;
    degree: string;
    institution: string;
    location: string;
    period: string;
    detail?: string;
    coursework: string[];
}

// ============================ AWARD ============================

export interface Award {
    id: string;
    title: string;
    event: string;
    organizers: string;
    location: string;
    date: string;
    description: string;
}

// ============================ SKILLS ============================

export interface SkillCategory {
    category: string;
    items: string[];
}

// ============================ CONTACT ============================

export interface ContactCTAs {
    email: string;
    resume: string;
    linkedin: string;
    github: string;
}

export interface Contact {
    heading: string;
    body: string;
    ctas: ContactCTAs;
}
