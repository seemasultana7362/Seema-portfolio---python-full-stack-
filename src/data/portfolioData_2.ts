import { Project, SkillCategory, ExperienceItem, EducationItem, AchievementItem } from '../types';

export const PERSONAL_INFO = {
  name: "Seema Sultana",
  title: "Computer Science Engineering Student • Full Stack Developer • AI/ML & Data Engineer",
  greeting: "HELLO, I'M",
  intro: "I am a Computer Science Engineering student at Visvesvaraya Technological University passionate about building scalable full-stack applications, privacy-preserving ML systems, and distributed architectures. My interests span federated learning, agentic AI, cloud-native infrastructure, and research-driven innovation. I enjoy architecting end-to-end solutions, transforming complex data into actionable insights, and contributing to open-source communities and technical leadership initiatives.",
  email: "sultanaseema385@gmail.com",
  phone: "+91-8892872700",
  location: "Bengaluru, India",
  github: "https://github.com/seemasultana7362",
  linkedin: "https://www.linkedin.com/in/seemasultana385",
  profileImage: "/images/profile.jpeg",
  educationInstitution: "Visvesvaraya Technological University",
  degree: "B.E. Computer Science & Engineering",
  gpa: "8.25 GPA",
};

export const PROJECTS_DATA: Project[] = [
  {
    id: "mulberry-hotel",
    title: "Mulberry Shades Nandi Hills — Full Stack Hotel Booking Website",
    category: "Full Stack • MERN Stack • Live Deployed",
    summary: "A deployed full-stack MERN web application for Mulberry Shades Nandi Hills, a resort near Bengaluru, presenting the property and its offerings in a responsive, modern interface.",
    problem: "Hotels and resorts need a fast, polished online presence where guests can explore the property and its offerings easily on any device.",
    solution: "Built and deployed a MERN stack (MongoDB, Express.js, React, Node.js) application with a responsive front end and a REST API back end, hosted live on Vercel.",
    technologies: [
      "MongoDB", "Express.js", "React.js", "Node.js", "REST APIs", "Vercel"
    ],
    highlights: [
      "End-to-end MERN stack application",
      "Deployed live on Vercel",
      "Responsive, mobile-friendly UI",
      "REST API back end with MongoDB"
    ],
    image: "/images/mulberry_hotel.png",
    imageLabel: "Mulberry Shades Nandi Hills",
    imageNote: "Live deployed MERN stack hotel website",
    github: "",
    demo: "https://mernstack-project-mulberry-hotel.vercel.app/#home"
  },
  {
    id: "federated-iot",
    title: "Privacy-Preserving Federated Learning for IoT Intrusion Detection",
    category: "Federated Learning • Cybersecurity",
    summary: "A privacy-preserving federated learning pipeline for detecting intrusions in distributed IoT environments.",
    problem: "Centralizing IoT security data can expose sensitive information, while distributed devices need effective intrusion detection with manageable communication costs.",
    solution: "Built a PyTorch and Flower pipeline on UNSW-NB15 with Differential Privacy, Secure Aggregation, and adaptive communication; evaluated accuracy, privacy, convergence, and communication overhead.",
    technologies: [
      "Python", "PyTorch", "Flower", "Scikit-learn", "Opacus", "Secure Aggregation", "Differential Privacy", "Adaptive Communication"
    ],
    highlights: [
      "Trained on the UNSW-NB15 intrusion-detection dataset",
      "Applied Differential Privacy with Opacus",
      "Used secure aggregation for decentralized updates",
      "Measured accuracy, privacy, convergence, and communication overhead"
    ],
    image: "/images/federated_iot.png",
    imageLabel: "Federated IoT Intrusion Detection",
    imageNote: "Privacy-preserving federated learning pipeline",
    github: "https://github.com/seemasultana7362/Federated-IoT",
    demo: "#"
  },
  {
    id: "customer-churn-prediction",
    title: "Customer Churn Prediction using Explainable Machine Learning",
    category: "Machine Learning",
    summary: "An explainable machine learning pipeline that predicts customer churn while helping businesses understand why customers leave.",
    problem: "Traditional churn prediction models often generate predictions without explaining the reasons behind them, making it difficult for businesses to design meaningful customer retention strategies.",
    solution: "Developed an explainable machine learning pipeline using SHAP to identify the most influential churn factors and presented insights through an interactive Streamlit dashboard to support data-driven business decisions.",
    technologies: [
      "Python", "Pandas", "NumPy", "Scikit-learn", "XGBoost", "SHAP", "Matplotlib", "Seaborn", "Streamlit"
    ],
    highlights: [
      "Data cleaning and preprocessing",
      "Feature engineering",
      "Explainable AI using SHAP",
      "Interactive dashboard for business insights"
    ],
    image: "/images/customer_churn.png",
    imageLabel: "Customer Churn Analytics",
    imageNote: "Place customer_churn.png in public/images/",
    github: "https://github.com/seemasultana7362/Customer-Churn-Prediction-project",
    demo: "#"
  },
  {
    id: "doc-chat-ai",
    title: "DOC-CHAT-AI — Citation-First Document Question Answering",
    category: "RAG • Document AI • LLM",
    summary: "An AI-powered document Q&A system that lets users upload complex PDFs and get answers grounded in the source, cited down to the exact page, row and column.",
    problem: "Manually searching through financial statements, contracts and other long PDFs is slow and error-prone, and generic AI chatbots can hallucinate details or miscalculate numbers that are not in the document.",
    solution: "Built a document-understanding pipeline using Docling and PyMuPDF for parsing and table extraction, with ColPali as an OCR-free visual search fallback. A semantic retriever (Sentence Transformers + FAISS) routes each question to the right table or page, an LLM compiles it into a structured operation, and a deterministic pandas engine computes the answer so there is zero LLM arithmetic.",
    technologies: [
      "Python", "FastAPI", "Docling", "PyMuPDF", "ColPali", "Sentence Transformers", "FAISS", "Pandas", "Streamlit", "OpenAI-compatible LLMs"
    ],
    highlights: [
      "Every answer cited by exact (doc_id, page, row, col)",
      "Deterministic pandas engine: zero LLM arithmetic",
      "Semantic retrieval using Sentence Transformers and FAISS",
      "OCR-free visual document search fallback with ColPali",
      "Web interface for real-time document chat"
    ],
    image: "/images/doc-chat-ai.png",
    imageLabel: "DOC-CHAT-AI",
    imageNote: "Citation-first document question answering with RAG",
    github: "https://github.com/seemasultana7362/doc-chat-ai",
    demo: "#"
  }
];

export const SKILLS_DATA: SkillCategory[] = [
  {
    category: "Languages",
    skills: ["Python", "Java", "SQL", "TypeScript", "JavaScript"]
  },
  {
    category: "Frontend",
    skills: ["React.js", "Next.js", "Tailwind CSS"]
  },
  {
    category: "Backend",
    skills: ["FastAPI", "Node.js", "REST APIs"]
  },
  {
    category: "Database",
    skills: ["PostgreSQL", "MySQL", "MongoDB"]
  },
  {
    category: "Frameworks",
    skills: ["NumPy", "Pandas", "Scikit-learn", "TensorFlow", "PyTorch", "XGBoost", "LangChain"]
  },
  {
    category: "Platforms",
    skills: ["Linux", "Web", "Windows", "Arduino", "AWS", "IBM Cloud"]
  },
  {
    category: "Tools",
    skills: ["AWS EC2", "AWS S3", "AWS Lambda", "AWS IAM", "Amazon Bedrock", "Amazon SageMaker", "Git", "GitHub", "Docker"]
  },
  {
    category: "Soft Skills",
    skills: ["Leadership", "Event Management", "Writing", "Public Speaking", "Time Management"]
  }
];

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    id: "aws-co-lead",
    organization: "AWS Student Builder Group",
    role: "Co-Lead (Full-time)",
    duration: "May 2026 – Present",
    location: "Bengaluru, India (On Campus)",
    description: [
      "Engineered cloud-native solutions leveraging scalable AWS infrastructure tools (EC2, S3, Lambda, Bedrock, SageMaker).",
      "Delivered technical consultations to guide peers through cloud implementation strategies and best practices.",
      "Led initiatives to promote cloud adoption and AWS technologies within the engineering community."
    ],
    technologies: ["AWS", "EC2", "S3", "Lambda", "Bedrock", "SageMaker", "Cloud Architecture"]
  },
  {
    id: "embrizon-intern",
    organization: "Embrizon Technologies",
    role: "Data Science Internship (AI)",
    duration: "February 2026 – April 2026",
    location: "Remote",
    description: [
      "Consulted on technical delivery of end-to-end predictive analytics pipelines from data collection to model deployment.",
      "Architected full-stack data dashboards using Python and visualization frameworks to guide stakeholders through cloud implementation strategies.",
      "Developed and deployed classification models for customer behavior prediction and business intelligence applications."
    ],
    technologies: ["Python", "Pandas", "Scikit-learn", "XGBoost", "Data Analytics", "Predictive Modeling"]
  }
];

export const EDUCATION_DATA: EducationItem[] = [
  {
    institution: "Visvesvaraya Technological University",
    qualification: "Bachelor of Engineering — Computer Science & Engineering",
    affiliation: "VTU",
    duration: "September 2023 – Present",
    score: "8.25 GPA",
    description: "Currently pursuing a Bachelor's degree with a focus on software engineering, artificial intelligence, machine learning, and modern web technologies while actively participating in technical communities and projects."
  },
  {
    institution: "Presidency PU College",
    qualification: "Class 12 (State Board)",
    duration: "2021",
    score: "92.5%",
    description: "Completed higher secondary education with strong academic performance, building a foundation for engineering studies."
  },
  {
    institution: "SVN English High School",
    qualification: "Class 10 (State Board)",
    duration: "2019",
    score: "91.04%",
    description: "Completed secondary education with distinction and developed a strong interest in mathematics, logical reasoning, and technology."
  }
];

export const ACHIEVEMENTS_DATA: AchievementItem[] = [
  {
    badge: "1st Place",
    title: "ELECTROLYTHON National Level Hackathon",
    date: "September 2025",
    description: "Secured top position for developing an innovative technology solution under competitive constraints."
  },
  {
    badge: "Top 6 Finalist",
    title: "Gen-AI Hackathon",
    date: "May 2026",
    description: "Recognized among top teams for building generative AI applications with practical utility."
  },
  {
    badge: "Shortlisted",
    title: "Google Build with AI (Bangalore)",
    date: "June 2026",
    description: "Selected among top student innovators to participate in Google's flagship AI building event."
  }
];

export const RESEARCH_DATA = {
  title: "Analysis of Privacy-Preserving Federated Learning Frameworks for IoT-Based Distributed Data Analytics",
  status: "Work in Progress",
  expectedPublication: "Expected IEEE publication (late 2026)",
  description: "The research explores privacy-preserving federated learning frameworks for IoT-based distributed data analytics, focusing on secure collaborative machine learning while maintaining data privacy.",
  technologies: [
    "Python", "PyTorch", "Flower", "Scikit-learn", "Pandas", "NumPy", "Opacus", "Secure Aggregation", "Adaptive Communication"
  ]
};

export const LEADERSHIP_DATA = [
  {
    organization: "AWS Student Builder Group",
    role: "Vice President / Operations Lead",
    location: "Bengaluru",
    duration: "July 2026 – Present",
    description: "Organized workshops and technical events through AWS while helping engage students and developers in technical learning initiatives."
  },
  {
    organization: "IEEE Computer Society Bangalore Chapter (IEEE CSBC)",
    role: "Volunteer / Website Contributor",
    location: "Bengaluru",
    duration: "January 2026 – Present",
    description: "Managing the official IEEE CSBC website and coordinating IEEE CS PRO 2026 and Girl Geek."
  }
];
