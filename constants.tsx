import React from 'react';
import { ExperienceItem, EducationItem, ProjectItem, SkillCategory } from './types';

export const PERSONAL_INFO = {
    name: "Sameer Rajendra",
    title: "Machine Learning & AI Engineer",
    tagline: "Deep Learning | Computer Vision | Transformer | PyTorch",
    email: "sameer.rajendra@outlook.com",
    linkedin: "https://www.linkedin.com/in/sameer-rajendra",
    location: "Jersey City, New Jersey, United States",
    about: [
        "I am someone who approaches problems by bringing people together first. My role often goes beyond just writing code; I actively participate in brainstorming approaches, implementing solutions, analyzing results, and iterating—a cycle that has taught me that the best solutions come from collaboration.",
        "I also deeply value independent learning. When working on my own projects, I start by digging into research papers to understand the fundamentals. Whether it's understanding the medical side of retinopathy before applying CNNs, or discovering CUDA to speed up training when I got stuck, I embrace the challenge of learning something new every time.",
        "Currently pursuing my Master's in Applied Artificial Intelligence at Stevens Institute of Technology, I am driven by the combination of asking good questions, listening to others, and staying curious."
    ]
};

export const EXPERIENCES: ExperienceItem[] = [
    {
        id: "oneirix",
        title: "Associate Engineer",
        company: "Oneirix Labs",
        period: "Sep 2021 - June 2024",
        location: "Pune, Maharashtra, India",
        description: [
            "Developed and trained computer vision models for detecting humans and objects in real-time CCTV footage using OpenCV and PyTorch.",
            "Designed an ML-based diagnostic model to detect stenosis in coronary arteries, improving detection methods through iterative brainstorming and implementation cycles.",
            "Developed communication algorithms using C++ to facilitate interaction between traffic signal controllers and scheduler algorithms.",
            "Deployed models using Docker, ensuring smooth integration into production environments."
        ]
    },
    {
        id: "siemens",
        title: "Summer Intern",
        company: "Siemens",
        period: "June 2019 - July 2019",
        location: "Aurangabad, Maharashtra, India",
        description: [
            "Gained exposure to industrial automation and engineering processes during a dedicated summer internship."
        ]
    }
];

export const EDUCATION: EducationItem[] = [
    {
        id: "stevens",
        degree: "Master of Science - MS, Applied Artificial Intelligence",
        institution: "Stevens Institute of Technology",
        period: "Aug 2024 - June 2026 (Expected)",
        details: "Currently pursuing, taking advanced courses including OpenCV."
    },
    {
        id: "symbiosis",
        degree: "Bachelor of Technology - BTech, Mechatronics",
        institution: "Symbiosis Skills & Professional University",
        period: "Aug 2017 - June 2021"
    }
];

export const PROJECTS: ProjectItem[] = [
    {
        id: "llm-inference",
        title: "LLM Inference Optimization",
        description: "Full-stack inference optimization pipeline for Meta-LLaMA 3.1-8B. Implements custom fused GQA decode CUDA kernels with macro-sequence SRAM tiling and intra-warp register shuffles, integrated via PyBind11 into a vLLM Tensor Parallel serving runtime.",
        tags: ["CUDA", "vLLM", "LLaMA", "PyBind11", "C++", "Inference"],
        link: "https://github.com/SameerRajendra/llm-inference-optimization"
    },
    {
        id: "adaptive-gpu",
        title: "Adaptive GPU Optimization via Evolutionary Algorithms",
        description: "Automated framework that uses a \u03bc+\u03bb evolutionary algorithm to navigate a complex search space of GPU configs (batch size, precision, CUDA tile sizes, attention kernels) for LLaMA-2-7B on NVIDIA H100, maximizing throughput (tokens/sec) and power efficiency.",
        tags: ["Evolutionary Algorithms", "CUDA", "LLaMA-2", "H100", "FlashAttention", "Python"],
        link: "https://github.com/SameerRajendra/Adaptive-GPU-Optimization-for-Deep-Learning-Workloads-Using-Evolutionary-Algorithms",
        reportUrl: "https://raw.githubusercontent.com/SameerRajendra/Adaptive-GPU-Optimization-for-Deep-Learning-Workloads-Using-Evolutionary-Algorithms/main/Sameer_AAI_800_Final_Report.pdf"
    },
    {
        id: "financial-news",
        title: "Financial News Sentiment Analysis",
        description: "Fine-tuned a GPT-Neo 125M language model on a large corpus of financial news articles (2015\u20132024) for sentiment classification, achieving 92% accuracy across positive, neutral, and negative categories.",
        tags: ["NLP", "Transformers", "GPT-Neo", "Fine-tuning"],
        link: "https://github.com/SameerRajendra/Financial-News-Sentiment-Analysis",
        reportUrl: "https://raw.githubusercontent.com/SameerRajendra/Financial-News-Sentiment-Analysis/main/Pattern_Report.pdf"
    },
    {
        id: "diabetic-retinopathy",
        title: "Diabetic Retinopathy Detection",
        description: "EfficientNet-B4 classifier for grading diabetic retinopathy severity in retinal images into five clinical categories (No DR \u2192 Proliferative DR), handling class imbalance and variable image quality.",
        tags: ["Computer Vision", "EfficientNet-B4", "Healthcare", "PyTorch"],
        link: "https://github.com/SameerRajendra/Detecting-Diabetic-Retinopathy-Using-EfficientNet-B4",
        reportUrl: "https://raw.githubusercontent.com/SameerRajendra/Detecting-Diabetic-Retinopathy-Using-EfficientNet-B4/main/Diabetic%20Retinopathy%20Detection%20with%20CNNs.pdf"
    },
    {
        id: "mental-health-classifier",
        title: "Unbiased Mental Health Classifier",
        description: "A fairness-aware ML model for mental health prediction that minimizes Demographic Parity Gap\u2014ensuring predictions are not disproportionately influenced by sensitive attributes such as gender or ethnicity.",
        tags: ["Fairness in AI", "Classification", "Ethics", "scikit-learn"],
        link: "https://github.com/SameerRajendra/Unbaised-Mental-Health-Classifier"
    },
    {
        id: "ai-image-classifier",
        title: "AI-Generated Image Classifier",
        description: "Deep learning model that distinguishes human-made artwork from AI-generated images\u2014a critical tool for detecting synthetic media and deepfakes in content moderation pipelines.",
        tags: ["Image Classification", "Deep Learning", "AI Detection", "CNN"],
        link: "https://github.com/SameerRajendra/AI-generated-Image-classifier"
    }
];

export const SKILLS: SkillCategory[] = [
    {
        category: "Core AI & ML",
        skills: ["Deep Learning", "Computer Vision", "Machine Learning", "Transformer", "Problem Solving"]
    },
    {
        category: "Languages & Tools",
        skills: ["Python", "C++", "PyTorch", "OpenCV", "Docker", "Git", "CUDA"]
    }
];

// Simple SVG Icons
export const Icons = {
    Mail: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
    ),
    Linkedin: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
    ),
    MapPin: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
    ),
    Download: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
    ),
    ExternalLink: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
    ),
    GitHub: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
    ),
    FileText: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
    ),
    ChevronDown: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m6 9 6 6 6-6"/></svg>
    ),
    Menu: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
    ),
    X: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    )
};
