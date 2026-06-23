import React from 'react';
import { ExperienceItem, EducationItem, ProjectItem, SkillCategory, AwardItem } from './types';

export const PERSONAL_INFO = {
    name: "Sameer Rajendra",
    title: "Machine Learning & AI Engineer",
    tagline: "GPU Computing • LLM Inference • Computer Vision • PyTorch • CUDA",
    email: "sameer.rajendra@outlook.com",
    phone: "(201) 927-4722",
    linkedin: "https://www.linkedin.com/in/sameer-rajendra",
    github: "https://github.com/SameerRajendra",
    location: "Jersey City, NJ",
    resumeUrl: "https://raw.githubusercontent.com/SameerRajendra/SameerRajendra.github.io/main/resume.pdf",
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
        company: "Oneirix Labs Pvt. Ltd.",
        period: "Sept 2021 – June 2024",
        location: "Pune, India",
        description: [
            "Real-Time CV System: Engineered a multi-task real-time computer vision system deployed on live CCTV feeds for Pune Metro, using PyTorch and TorchVision for four simultaneous inference tasks: (1) crowd density estimation at ticket counters, (2) platform intrusion and track-jump detection via pose estimation, (3) metro property damage detection, and (4) unattended baggage detection — all under strict per-frame latency constraints on continuous high-resolution video streams.",
            "C++ Performance: Developed communication algorithms using C++ to facilitate low-latency data exchange between controller units and scheduler algorithms.",
            "Medical Imaging: Designed a deep learning model to detect coronary artery diameter reduction, balancing diagnostic precision with inference overhead on resource-constrained deployment hardware.",
            "Architecture: Deployed containerized computer vision traffic-management applications via Docker; optimized container architecture for resource efficiency and horizontal scalability."
        ]
    },
    {
        id: "siemens",
        title: "Summer Intern",
        company: "Siemens",
        period: "June 2019 – July 2019",
        location: "Aurangabad, India",
        description: [
            "Gained exposure to industrial automation and engineering processes during a dedicated summer internship."
        ]
    }
];

export const EDUCATION: EducationItem[] = [
    {
        id: "stevens",
        degree: "MS in Applied Artificial Intelligence",
        institution: "Stevens Institute of Technology",
        period: "Aug 2024 – May 2026",
        details: "GPA: 3.60 • Hoboken, NJ"
    },
    {
        id: "symbiosis",
        degree: "Bachelor of Technology in Mechatronics",
        institution: "Symbiosis Skills and Professional University",
        period: "Aug 2017 – May 2021",
        details: "Pune, India"
    }
];

export const PROJECTS: ProjectItem[] = [
    {
        id: "llm-inference",
        title: "LLM Inference Optimization",
        description: "Custom CUDA kernel pipeline for Meta-LLaMA 3.1-8B targeting the Memory Bandwidth Wall on Hopper (sm_90) architecture.",
        bullets: [
            "Architected a custom Fused Grouped-Query Attention (GQA) decode kernel in C++/CUDA for Hopper (sm_90), designed specifically to break the LLM inference Memory Bandwidth Wall.",
            "Implemented macro-sequence SRAM tiling (64-token blocks) and cooperative thread-block memory fetches to maximize 128-byte HBM3e bus coalescing efficiency.",
            "Eliminated 98% of block synchronization barriers via intra-warp register shuffles, achieving a 5.2× latency speedup (3.13ms → 0.60ms) over naive baselines.",
            "Profiled distributed PEFT (FSDP + LoRA) execution timelines on a dual-H200 cluster using NVIDIA Nsight Systems, isolating compute-communication overlap across the 900 GB/s NVLink fabric."
        ],
        tags: ["CUDA", "C++", "vLLM", "LLaMA 3.1", "PyBind11", "Nsight Systems", "HBM3e"],
        link: "https://github.com/SameerRajendra/llm-inference-optimization"
    },
    {
        id: "adaptive-gpu",
        title: "Adaptive Evolutionary GPU Optimization Framework (AEGOF)",
        description: "Automated multi-objective autotuning pipeline for LLaMA-2-7B on NVIDIA H100, jointly optimizing 8 hardware/software knobs using evolutionary search.",
        bullets: [
            "Architected an automated autotuning pipeline to jointly optimize 8 hardware/software knobs (Power Limits, Batch/Seq, Kernel Fusion) for LLaMA-2-7B on NVIDIA H100 clusters.",
            "Developed a custom NSGA-II evolutionary core using the DEAP library to solve multi-objective trade-offs between throughput (tokens/s) and power consumption (Watts).",
            "Integrated FlashAttention-2 and CUTLASS backends via a white-box benchmarking harness, achieving up to an 8.09× efficiency multiplier over standard PyTorch defaults.",
            "Implemented robust CUDA OOM and subprocess timeout handling, enabling evaluation of 238+ unique hardware configurations without manual intervention."
        ],
        tags: ["CUDA", "NSGA-II", "DEAP", "LLaMA-2", "H100", "FlashAttention-2", "CUTLASS"],
        link: "https://github.com/SameerRajendra/Adaptive-GPU-Optimization-for-Deep-Learning-Workloads-Using-Evolutionary-Algorithms",
        reportUrl: "https://raw.githubusercontent.com/SameerRajendra/Adaptive-GPU-Optimization-for-Deep-Learning-Workloads-Using-Evolutionary-Algorithms/transformer-with-custom-kernal/Sameer_AAI_800_Final_Report.pdf"
    },
    {
        id: "financial-news",
        title: "Financial News Sentiment Analysis",
        description: "Fine-tuned GPT-Neo 125M for financial sentiment classification, achieving 92% accuracy on 36,000+ articles.",
        bullets: [
            "Fine-tuned a GPT-Neo 125M model as a sentiment classifier with Hugging Face and PyTorch, achieving 92% accuracy and a 0.72 macro F1-score on a test set of 36,000+ financial news articles.",
            "Developed a data pipeline to process articles from QuestDB, implementing a custom WeightedTrainer with a weighted loss function to correct for severe class imbalance.",
            "Packaged the trained transformer model and tokenizer into a streamlined inference function for on-demand sentiment classification and confidence scoring."
        ],
        tags: ["NLP", "GPT-Neo", "HuggingFace", "PyTorch", "QuestDB", "Transformers"],
        link: "https://github.com/SameerRajendra/Financial-News-Sentiment-Analysis",
        reportUrl: "https://raw.githubusercontent.com/SameerRajendra/Financial-News-Sentiment-Analysis/main/Pattern_Report.pdf"
    },
    {
        id: "diabetic-retinopathy",
        title: "Detecting Diabetic Retinopathy using Computer Vision",
        description: "EfficientNet-B4 deep learning classifier for grading diabetic retinopathy severity into five clinical categories.",
        bullets: [
            "Developed a deep learning algorithm to detect Diabetic Retinopathy, achieving a peak validation accuracy of over 80.49% for rapid and reliable screening.",
            "Addressed inherent class imbalance by integrating sklearn balanced class weights directly into the nn.CrossEntropyLoss function.",
            "Final evaluation highlights strong performance on the majority class (\u201cNo DR\u201d F1-score: 0.91) and detailed performance trade-offs on imbalanced minority classes."
        ],
        tags: ["Computer Vision", "EfficientNet-B4", "PyTorch", "Healthcare AI", "scikit-learn"],
        link: "https://github.com/SameerRajendra/Detecting-Diabetic-Retinopathy-Using-EfficientNet-B4",
        reportUrl: "https://raw.githubusercontent.com/SameerRajendra/Detecting-Diabetic-Retinopathy-Using-EfficientNet-B4/main/Diabetic%20Retinopathy%20Detection%20with%20CNNs.pdf"
    },
    {
        id: "mental-health-classifier",
        title: "Unbiased Mental Health Classifier",
        description: "A fairness-aware ML model for mental health prediction that minimizes Demographic Parity Gap across sensitive attributes.",
        bullets: [
            "Built a fairness-aware ML classifier that minimizes Demographic Parity Gap, ensuring predictions are not disproportionately influenced by sensitive attributes such as gender or ethnicity.",
            "Applied fairness constraints and bias mitigation techniques from the AI fairness literature to produce equitable predictions across demographic groups."
        ],
        tags: ["Fairness in AI", "Classification", "Ethics", "scikit-learn", "Bias Mitigation"],
        link: "https://github.com/SameerRajendra/Unbaised-Mental-Health-Classifier"
    },
    {
        id: "ai-image-classifier",
        title: "AI-Generated Image Classifier",
        description: "CNN-based classifier that distinguishes human-made artwork from AI-generated images for synthetic media detection.",
        bullets: [
            "Trained CNN and MobileNet models to distinguish real artwork from AI-generated images using transfer learning.",
            "Benchmarked SVM, Random Forest, and CNN architectures (vanilla and MobileNet) on both full and reduced feature sets.",
            "Critical tool for detecting synthetic media and deepfakes in content moderation pipelines."
        ],
        tags: ["CNN", "MobileNet", "SVM", "Random Forest", "Transfer Learning", "AI Detection"],
        link: "https://github.com/SameerRajendra/AI-generated-Image-classifier"
    }
];

export const SKILLS: SkillCategory[] = [
    {
        category: "GPU / Parallel Computing",
        skills: ["CUDA", "NVML", "CUTLASS", "FlashAttention-2", "cuDNN", "Nsight Systems"]
    },
    {
        category: "Programming Languages",
        skills: ["Python", "C++"]
    },
    {
        category: "Frameworks & Libraries",
        skills: ["PyTorch", "TensorFlow", "HuggingFace", "TorchVision", "OpenCV", "Transformers", "vLLM"]
    },
    {
        category: "Tools & Platforms",
        skills: ["Docker", "Git", "Linux", "QuestDB", "Jupyter Notebook"]
    }
];

export const AWARDS: AwardItem[] = [
    {
        id: "hack-mit-wpu",
        title: "HACK MIT-WPU 2024 — CCTV Video Analytics Hackathon",
        organization: "Maha Metro × Ministry of Education, Maharashtra • MIT World Peace University, Pune",
        period: "May 2024",
        description: "Team Oneirix Labs. Built a real-time multi-task CCTV analytics system for Pune Metro covering crowd estimation, platform intrusion detection, property damage detection, and unattended baggage detection — recognized for innovation in sustainable urban transit infrastructure."
    }
];

// Simple SVG Icons
export const Icons = {
    Mail: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
    ),
    Phone: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.82h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.4a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
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
    Trophy: (props: React.SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
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
