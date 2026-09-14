import React from 'react';
import {
    PersonalInfo,
    FocusArea,
    KernelBenchmark,
    Project,
    EarlierWorkItem,
    ExperienceEntry,
    EducationEntry,
    Award,
    SkillCategory,
    Contact,
} from './types';

// ============================ IDENTITY ============================

export const PERSONAL_INFO: PersonalInfo = {
    name: "Sameer Rajendra",
    roleLine: "AI Engineer",
    headline: "Every number on this page has a run behind it.",
    location: "Jersey City, NJ",
    email: "sameer.rajendra@outlook.com",
    phone: "(201) 927-4722",
    linkedin: "https://www.linkedin.com/in/sameer-rajendra/",
    github: "https://github.com/SameerRajendra",
    resumeUrl: "/resume.pdf",
    subhead: "I build LLM systems end to end — CUDA decode kernels underneath, LangGraph agents and retrieval in the middle, and the evaluation harnesses that decide what ships. M.S. in Applied Artificial Intelligence, Stevens Institute of Technology, May 2026.",
    about: "I started in mechatronics, spent three years shipping computer vision into live transit and municipal deployments, and moved toward the systems layer when I needed CUDA to make training finish on time. I am finishing an M.S. in Applied Artificial Intelligence at Stevens with a computer engineering concentration. I read the paper before I write the code, and I measure before I claim.",
};

// ============================ WHAT I WORK ON ============================

export const FOCUS_AREAS: FocusArea[] = [
    {
        id: "inference-and-gpu",
        heading: "Inference and GPU",
        body: "I write CUDA decode kernels and measure them against a reference implementation. On Llama-3.1-8B I took a split-KV GQA kernel from 1.35 ms to 0.14 ms at 64K context, 9.7x against my own first working version, and raised HBM bandwidth utilization from 5.8% to 56% of peak, mostly by indexing the grid on KV heads to cut redundant KV traffic fourfold.",
    },
    {
        id: "agents-and-retrieval",
        heading: "Agents and retrieval",
        body: "I ship LangGraph agents built to survive production: tool calling, MCP servers, grammar-constrained structured outputs, and hybrid vector plus knowledge-graph retrieval. On Accord the same implementation is exposed over both a REST API and an MCP tool server, so there is one system to maintain rather than two.",
    },
    {
        id: "evaluation",
        heading: "Evaluation",
        body: "I treat the evaluation harness as the deliverable. Golden datasets, LLM-as-judge with position-bias controls, retrieval benchmarks with real reference baselines, and CI gates, so a change ships on evidence rather than on a demo that went well.",
    },
];

// ============================ HERO CHART ============================

export const KERNEL_BENCHMARK: KernelBenchmark = {
    rows: [
        { context: "4K", contextTokens: 4096, baselineMs: 14.902, optimizedMs: 0.910, speedup: 16.4, argmaxParity: 1.00 },
        { context: "16K", contextTokens: 16384, baselineMs: 25.388, optimizedMs: 6.494, speedup: 3.9, argmaxParity: 1.00 },
        { context: "64K", contextTokens: 64000, baselineMs: 71.835, optimizedMs: 25.441, speedup: 2.8, argmaxParity: 1.00 },
    ],
    meta: {
        model: "Llama-3.1-8B",
        hardware: "NVIDIA H100",
        baselineLabel: "dense attention (baseline)",
        optimizedLabel: "GQA-dense decode kernel",
    },
};

// ============================ SELECTED WORK ============================
// Order is fixed. DeltaFin first.

export const PROJECTS: Project[] = [
    {
        id: "deltafin",
        title: "DeltaFin — agentic financial variance and AP reconciliation",
        date: "September 2026",
        context: "AI x Finance Money Talks hackathon, Money Operations track",
        oneline: "An agentic system that turns monthly ledgers into a variance brief a controller can sign off on.",
        bullets: [
            "A 10-node LangGraph agent, plus a 7-node accounts-payable reconciliation pipeline, that moves the output from a headline like revenue increased 18% to which customers drove it, by how much, and whether the movement recurs.",
            "A hard deterministic/LLM boundary where finance needs it: Python computes every delta, percentage, z-score against a 6-month trailing baseline, materiality decision, driver cohort, and concentration share, and the model is handed those finished facts and constrained to writing prose over them. Nothing it emits changes a number, and every model call has a template fallback, so the pipeline produces a complete brief with no model configured at all.",
            "Cross-run institutional memory as an account_code::driver_key knowledge graph over an append-only SQLite history, making the question of whether a vendor has driven an account before, and for how many consecutive periods, an O(1) exact-key lookup instead of a similarity search over past narratives.",
            "Self-hosted Qwen2.5-7B-Instruct under vLLM 0.6.3 on a Modal A10G, scale-to-zero with weights cached in a Modal Volume so a cold start re-downloads nothing.",
            "A chart-first Streamlit and Altair interface for the person who signs off, carrying a redundant OK / X / dash glyph so status survives color-blindness and greyscale printing.",
        ],
        results: [
            { metric: "Eval assertions passed", value: "62 of 63", basis: "labeled 20-month ledger, hand-transcribed ground truth" },
            { metric: "Period comparisons replayed", value: "19", basis: "deterministic, model forced off" },
            { metric: "Automated tests", value: "119", basis: "with CI" },
        ],
        tags: ["LangGraph", "vLLM", "Qwen2.5-7B", "Modal", "DuckDB", "SQLite", "Streamlit", "Altair", "Python"],
        links: [
            { label: "GitHub", url: "https://github.com/SameerRajendra/DeltaFin" },
            { label: "Live demo", url: "https://sameerrajendra126--deltafin-ui-serve.modal.run" },
        ],
    },
    {
        id: "accord",
        title: "Accord — negotiation intelligence platform",
        date: "June 2026 to July 2026",
        oneline: "One agent implementation, served two ways, with the evaluation harness treated as part of the product.",
        bullets: [
            "A LangGraph agent running 5 analysis stages in parallel over a negotiation thread, grounded by retrieval against a 1,030-dialogue precedent corpus.",
            "Exposed identically over a FastAPI REST API and an MCP tool server from one shared implementation, a reusable component rather than two codebases, with per-stage graceful degradation that returns a partial result instead of a 500, and grammar-constrained structured outputs.",
            "Hybrid vector and knowledge-graph retrieval over a roughly 3,100-node and 23,000-edge entity-relation graph co-located with pgvector in a single Postgres, with provenance on every retrieved precedent and Langfuse tracing per node.",
            "A 10-module evaluation and safety harness behind one auto-generated scorecard that grades each metric as passing, failing, characterization, by-design-unmeasurable, or not-yet-run, so an unrun eval can never be read as a passing one.",
        ],
        results: [
            { metric: "Output throughput", value: "4,699 tokens/sec", basis: "Qwen2.5-7B on one H100, SGLang continuous batching" },
            { metric: "Speedup over single-stream", value: "30x", basis: "same model, same GPU" },
            { metric: "p50 time to first token", value: "25 ms", basis: "SGLang serving" },
            { metric: "Cost per 1M output tokens", value: "$0.27", basis: "scale-to-zero on Modal, about $0 idle" },
            { metric: "Cross-namespace leaks", value: "0", basis: "multi-tenant isolation probes" },
            { metric: "Automated tests", value: "220", basis: "gating the pipeline" },
        ],
        tags: ["LangGraph", "MCP", "FastAPI", "SGLang", "pgvector", "Postgres", "Langfuse", "Qwen2.5-7B", "Modal"],
        links: [
            { label: "GitHub", url: "https://github.com/SameerRajendra/Accord" },
        ],
    },
    {
        id: "llm-inference-optimization",
        title: "LLM Inference Optimization — Hopper decode kernel",
        date: "April 2026 to May 2026",
        context: "Independent research",
        oneline: "A split-KV FlashDecoding-style GQA decode kernel for Hopper, built and measured stage by stage.",
        bullets: [
            "A CUDA C++ decode kernel targeting Hopper sm_90a for Llama-3.1-8B, optimized across staged rewrites with PyTorch SDPA held as the reference oracle at every stage.",
            "The main win came from indexing the grid on KV heads, which cut redundant KV traffic fourfold.",
            "An FP8 (e4m3) KV cache with per-page scales dequantized in-register, halving KV bandwidth and residency.",
            "Every run SHA-stamped behind 28 correctness gates, with each result row pinned to the commit that produced it.",
        ],
        results: [
            { metric: "Decode latency at 64K context", value: "1.35 to 0.14 ms", basis: "9.7x vs. first working kernel" },
            { metric: "HBM bandwidth utilization", value: "5.8% to 56% of peak", basis: "same kernel, same GPU" },
            { metric: "Concurrent 64K-context sequences", value: "7 to 14", basis: "80 GB H100, FP16 to FP8 KV cache" },
            { metric: "Perplexity cost of FP8", value: "+0.24%", basis: "100% argmax parity on confident predictions" },
            { metric: "Correctness gates", value: "28", basis: "partial-tile and batch boundaries" },
        ],
        tags: ["CUDA C++", "Hopper sm_90a", "FlashDecoding", "GQA", "FP8", "Llama-3.1-8B", "Nsight Systems"],
        links: [
            { label: "GitHub", url: "https://github.com/SameerRajendra/LLM_Inference_Optimization" },
            { label: "Report", url: "https://github.com/SameerRajendra/LLM_Inference_Optimization/blob/main/LLM_Inference_optimization.pdf" },
        ],
    },
    {
        id: "aegof",
        title: "AEGOF — adaptive evolutionary GPU optimization framework",
        date: "September 2025 to December 2025",
        oneline: "Multi-objective autotuning that searches GPU configurations for throughput per watt.",
        bullets: [
            "NSGA-II via DEAP on a mu-plus-lambda strategy, jointly optimizing 8 hardware and software knobs (power cap, batch size, sequence length, bf16 versus fp16 precision, kernel-fusion mode, block size, tile config, and FlashAttention-2 versus CUTLASS backends) for Llama-2-7B inference on an NVIDIA H100.",
            "A white-box benchmark harness measuring tokens/sec throughput, NVML power draw, and Model FLOPs Utilization per trial, with CUDA OOM and subprocess-timeout handlers enabling unattended overnight evaluation runs.",
            "V2 adds an agentic layer: a 5-node LangGraph loop (Analyst, Proposer, Verifier, Evaluator, Reflect) over an MCP tool server, with Pydantic schema validation rejecting or clamping invalid configs at the write boundary and a mock/real harness seam that keeps the whole stack GPU-free and CI-testable.",
        ],
        results: [
            { metric: "Efficiency multiplier", value: "8.09x", basis: "tokens/sec/Watt vs. PyTorch defaults" },
            { metric: "Configurations evaluated", value: "238+", basis: "16 individuals across 5 generations" },
            { metric: "Pareto front", value: "throughput vs. power", basis: "serialized to a Hall-of-Fame JSON" },
        ],
        tags: ["NSGA-II", "DEAP", "CUDA", "H100", "FlashAttention-2", "CUTLASS", "LangGraph", "MCP", "Pydantic"],
        links: [
            { label: "GitHub", url: "https://github.com/SameerRajendra/Adaptive-GPU-Optimization-for-Deep-Learning-Workloads-Using-Evolutionary-Algorithms" },
            { label: "Report", url: "https://github.com/SameerRajendra/Adaptive-GPU-Optimization-for-Deep-Learning-Workloads-Using-Evolutionary-Algorithms/blob/transformer-with-custom-kernal/Sameer_AAI_800_Final_Report.pdf" },
            { label: "V2", url: "https://github.com/SameerRajendra/AEGOF-V2" },
        ],
    },
    {
        id: "serverless-scoring-pipeline",
        title: "Serverless LLM-scoring and document pipeline",
        date: "April 2026",
        oneline: "An event-driven AWS pipeline that ingests, scores, and tailors documents on a schedule.",
        bullets: [
            "An EventBridge cron triggers a containerized Lambda that ingests external sources hourly, dedupes against DynamoDB, applies a regex prefilter, then a scoring agent classifies each survivor and persists results with SNS alerting.",
            "The entire stack is defined in Terraform (Lambda, DynamoDB, S3, EventBridge, SNS, IAM, and budgets) and deploys from a single terraform apply.",
            "A second, independently specialized agent sits behind an HMAC-signed Lambda Function URL: it reads a source .docx from S3, drafts a structured find/replace plan, writes a per-request artifact back to S3, and returns a presigned download URL, with a containerized Streamlit dashboard over DynamoDB for state review.",
            "An anti-fabrication guardrail at the write boundary: a configured forbidden-claims list the agent may never introduce, returning the skipped claims and the resulting capability gap in a structured response instead of silently inventing a qualification.",
        ],
        results: [
            { metric: "Infrastructure cost", value: "about $1-5/month", basis: "AWS always-free tier" },
            { metric: "Deploy", value: "single terraform apply", basis: "Lambda, DynamoDB, S3, EventBridge, SNS, IAM, budgets" },
        ],
        tags: ["AWS Lambda", "DynamoDB", "S3", "EventBridge", "SNS", "Terraform", "Docker", "Streamlit"],
        links: [
            { label: "GitHub", url: "https://github.com/SameerRajendra/Serverless-GenAI-Scoring-Document-Tailoring-Pipeline-AWS-" },
        ],
    },
];

// ============================ EARLIER WORK ============================

export const EARLIER_WORK: EarlierWorkItem[] = [
    {
        id: "financial-news-sentiment-analysis",
        title: "Financial News Sentiment Analysis",
        summary: "Fine-tuned GPT-Neo 125M as a sentiment classifier, 92% accuracy and 0.72 macro F1 on a test set of 36,000+ financial news articles, with a custom WeightedTrainer correcting severe class imbalance.",
        url: "https://github.com/SameerRajendra/Financial-News-Sentiment-Analysis",
    },
    {
        id: "detecting-diabetic-retinopathy",
        title: "Detecting Diabetic Retinopathy",
        summary: "EfficientNet-B4 grading retinal images into five clinical severity categories, 80.49% peak validation accuracy and 0.91 F1 on the majority class, with balanced class weights folded into the loss.",
        url: "https://github.com/SameerRajendra/Detecting-Diabetic-Retinopathy-Using-EfficientNet-B4",
    },
    {
        id: "ai-generated-image-classifier",
        title: "AI-Generated Image Classifier",
        summary: "CNN and MobileNet transfer learning to separate human-made artwork from AI-generated images, benchmarked against SVM and Random Forest baselines.",
        url: "https://github.com/SameerRajendra/AI-generated-Image-classifier",
    },
    {
        id: "unbiased-mental-health-classifier",
        title: "Unbiased Mental Health Classifier",
        summary: "A fairness-aware classifier that minimizes demographic parity gap across sensitive attributes.",
        url: "https://github.com/SameerRajendra/Unbaised-Mental-Health-Classifier",
    },
];

// ============================ EXPERIENCE ============================

export const EXPERIENCE: ExperienceEntry[] = [
    {
        id: "oneirix-labs",
        company: "Oneirix Labs Pvt. Ltd.",
        role: "Associate Engineer (Computer Vision and Embedded Systems)",
        period: "September 2021 to June 2024",
        location: "Pune, India",
        bullets: [
            "Built and deployed a multi-task computer-vision system on live Pune Metro CCTV footage, four concurrent inference tasks in PyTorch and TorchVision covering crowd density, pose-based intrusion and track-jump detection, property-damage detection, and unattended-baggage detection, for a public-transit client’s operations team.",
            "Owned the controller-scheduler communication subsystem for a smart traffic-light deployment: wrote the bidirectional C++ protocol decode and forward layer, containerized the automation stack with Docker for on-site deployment, and ran field integration and debugging alongside the client’s engineers.",
            "Built a coronary-artery graph-traversal pipeline for stenosis screening, with CNN-based main-vessel identification, BFS traversal of secondary and tertiary branches, and geometric diameter-reduction detection.",
            "Translated ambiguous client requirements into shipped systems across transit, municipal infrastructure, and healthcare engagements, owning scoping, implementation, deployment, and post-launch support.",
        ],
    },
];

// ============================ EDUCATION ============================

export const EDUCATION: EducationEntry[] = [
    {
        id: "stevens",
        degree: "M.S. in Applied Artificial Intelligence, Computer Engineering concentration",
        institution: "Stevens Institute of Technology",
        location: "Hoboken, NJ",
        period: "August 2024 to May 2026",
        detail: "GPA 3.60",
        coursework: [
            "GPU and Multicore Programming (CUDA, software-hardware co-design)",
            "Digital and Computer Systems Architecture",
            "Real-Time and Embedded Systems",
            "Applied Modeling and Optimization",
            "Pattern Recognition and Classification",
        ],
    },
    {
        id: "symbiosis",
        degree: "B.Tech. in Mechatronics",
        institution: "Symbiosis Skills and Professional University",
        location: "Pune, India",
        period: "August 2017 to May 2021",
        coursework: [
            "Digital Signal Processing",
            "Communication Systems",
            "Control Engineering",
            "Microprocessors and Applications",
            "Digital Hardware Design and Analysis",
        ],
    },
];

// ============================ AWARD ============================

export const AWARD: Award = {
    id: "hack-mit-wpu-2024",
    title: "HACK MIT-WPU 2024",
    event: "CCTV Video Analytics Hackathon",
    organizers: "Maha Metro with the Ministry of Education, Maharashtra",
    location: "MIT World Peace University, Pune",
    date: "May 2024",
    description: "Team Oneirix Labs built a real-time multi-task CCTV analytics system for Pune Metro, recognized for innovation in sustainable urban transit infrastructure.",
};

// ============================ SKILLS ============================

export const SKILLS: SkillCategory[] = [
    {
        category: "Languages",
        items: ["Python", "C++", "CUDA C/C++", "SQL", "Bash"],
    },
    {
        category: "LLM, agents and retrieval",
        items: [
            "LangGraph", "agent orchestration", "tool calling", "Model Context Protocol (MCP)",
            "RAG", "vector search (pgvector, HNSW)", "knowledge-graph retrieval", "embeddings",
            "structured outputs", "prompt engineering", "LLM-as-judge evaluation", "vLLM",
            "SGLang", "quantization (INT8/INT4/FP8)",
        ],
    },
    {
        category: "Machine learning",
        items: [
            "PyTorch", "TensorFlow", "JAX", "scikit-learn", "XGBoost", "NumPy", "pandas",
            "Hugging Face Transformers", "LoRA and fine-tuning", "mixed precision",
            "distributed training (FSDP, NCCL)", "model calibration",
        ],
    },
    {
        category: "GPU and high-performance computing",
        items: [
            "CUDA", "cuDNN", "CUTLASS", "NCCL", "roofline analysis",
            "occupancy and bank-conflict analysis", "Nsight Systems and Nsight Compute",
        ],
    },
    {
        category: "Infrastructure",
        items: [
            "Docker", "AWS (Lambda, DynamoDB, S3, EventBridge, SNS, CloudWatch, ECR)",
            "Terraform", "CI/CD", "Git", "Linux", "SLURM", "FastAPI", "REST APIs", "Langfuse",
        ],
    },
    {
        category: "Computer vision",
        items: ["CNNs", "EfficientNet", "object detection", "pose estimation", "OpenCV", "TorchVision"],
    },
];

// ============================ CONTACT ============================

export const CONTACT: Contact = {
    heading: "Open to AI engineer roles in the United States",
    body: "The fastest way to reach me is email. Resume and code are both linked below.",
    ctas: {
        email: "Send an email",
        resume: "Download resume (PDF)",
        linkedin: "LinkedIn",
        github: "GitHub",
    },
};

// ============================ ICONS ============================
// Small typed inline SVG icon components, kept as-is.

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
    ),
};
