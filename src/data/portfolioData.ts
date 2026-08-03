import { Project, SkillCategory, ExperienceItem, EducationItem, AchievementItem } from '../types';

export const PERSONAL_INFO = {
  name: "Seema Sultana",
  title: "Computer Science Engineering Student • Python Full Stack Developer • Data Science Enthusiast & ML Model Building",
  greeting: "HELLO, I'M",
  intro: "I am a Computer Science Engineering student passionate about Python full-stack development, Data Science, and ML model building. My interests span building end-to-end web applications, predictive machine learning pipelines, cloud technologies, and research-driven innovation. I enjoy transforming complex data into actionable insights and scalable solutions while continuously learning and contributing to technical communities.",
  email: "sultanaseema385@gmail.com",
  phone: "+91-8892872700",
  location: "Bengaluru, India",
  github: "https://github.com/seemasultana7362",
  linkedin: "https://www.linkedin.com/in/seemasultana385",
  profileImage: "/images/profile.jpeg",
  educationInstitution: "HKBK College of Engineering (VTU)",
  degree: "B.E. Computer Science & Engineering",
  gpa: "8.25 GPA",
};

export const PROJECTS_DATA: Project[] = [
  {
    id: "cognitive-compass",
    title: "Cognitive Compass",
    category: "AI • Multi-Agent Systems",
    summary: "An AI-powered developer assistance platform that detects cognitive load, explains complex code visually, and preserves engineering knowledge for teams.",
    problem: "Modern software projects become increasingly difficult to understand as systems grow in complexity. Developers often lose time understanding unfamiliar codebases, switching context, and repeatedly solving the same problems because organizational knowledge is scattered.",
    solution: "Cognitive Compass addresses these challenges by using a multi-agent AI architecture that identifies signs of developer confusion, generates visual explanations of complex code, and preserves technical knowledge in a searchable system that future developers can access.",
    technologies: [
      "React", "TypeScript", "Node.js", "GraphQL", "AWS Lambda", "Amazon Bedrock", "Amazon SageMaker", "Multi-Agent AI"
    ],
    highlights: [
      "Detects developer confusion in real time",
      "Generates visual explanations for complex code",
      "Creates a searchable organizational memory",
      "Designed around AI-assisted software engineering workflows"
    ],
    image: "/images/cognitive_compass.png",
    imageLabel: "Cognitive Compass Screenshot",
    imageNote: "Place cognitive_compass.png in public/images/",
    github: "https://github.com/seemasultana7362/cognitive_compass",
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
    id: "factsphere",
    title: "FactSphere — Hallucination-Aware Multi-Agent Search Intelligence",
    category: "Agentic AI • LLM & Search Intelligence",
    summary: "A solo-built Agentic AI system featuring a 4-agent Plan-and-Execute pipeline that detects hallucinated, misleading, or unreliable information from live web sources in real time.",
    problem: "Traditional Large Language Models (LLMs) often generate convincing but inaccurate or hallucinated responses because they rely primarily on static learned knowledge rather than dynamically verifying information against current live sources.",
    solution: "FactSphere addresses this challenge by combining multi-source live web retrieval, a 4-agent Plan-and-Execute orchestration pipeline, and Groq-powered Llama 3.3 70B reasoning to evaluate source credibility, deduplicate evidence, and deliver explainable credibility verdicts with trust scores. Includes a Chrome Extension for instant in-browser fact-checking.",
    technologies: [
      "Python", "Flask", "Groq API", "Llama 3.3 70B", "BeautifulSoup", "SentenceTransformers", "ChromaDB", "scikit-learn", "Chrome Extension API"
    ],
    highlights: [
      "Solo-built 4-agent Plan-and-Execute pipeline for claim verification",
      "Queries 4 live search engines simultaneously and deduplicates evidence",
      "Invokes Groq LLM (Llama 3.3 70B) per result for independent credibility verdicts with trust scores",
      "Achieved 91% accuracy in fabricated-claim detection",
      "Chrome Extension enables instant in-browser fact-checking on any webpage"
    ],
    image: "/images/factsphere.png",
    imageLabel: "FactSphere Architecture & Extension",
    imageNote: "Place factsphere.png in public/images/",
    github: "https://github.com/seemasultana7362/FactSphere-Hallucination-Aware-Multi-Agent-Search-Intelligence-Agentic-AI-LLM-NLP-Chrome-Extension-",
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
    skills: ["React.js", "Next.js", "HTML5", "CSS3", "Tailwind CSS"]
  },
  {
    category: "Backend",
    skills: ["FastAPI", "Django", "Flask", "REST APIs"]
  },
  {
    category: "Databases",
    skills: ["PostgreSQL", "MySQL"]
  },
  {
    category: "AI / Machine Learning",
    skills: ["NumPy", "Pandas", "Scikit-learn", "TensorFlow", "PyTorch", "XGBoost", "LangChain"]
  },
  {
    category: "DevOps & Tools",
    skills: ["Git", "GitHub", "GitHub Actions", "Docker"]
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
    role: "Co-Lead",
    duration: "May 2026 – Present",
    location: "Bengaluru, India",
    description: [
      "Completed multiple technical certifications through Study Jam activities to strengthen knowledge across cloud and development technologies.",
      "Contributed to Python full-stack projects involving HTML, CSS, and database integration.",
      "Collaborated with peers through technical learning initiatives and community activities."
    ],
    technologies: ["Python", "HTML", "CSS", "Databases", "AWS"]
  },
  {
    id: "embrizon-intern",
    organization: "Embrizon Technologies",
    role: "Data Science with AI Intern",
    duration: "February 2026 – April 2026",
    location: "Remote",
    description: [
      "Worked on a Customer Churn Prediction project involving data cleaning and feature engineering.",
      "Trained classification models including Logistic Regression, Random Forest, and XGBoost.",
      "Emphasized practical machine learning workflows and explainable data analytics."
    ],
    technologies: ["Python", "Scikit-learn", "XGBoost", "Machine Learning", "Data Analysis"]
  }
];

export const EDUCATION_DATA: EducationItem[] = [
  {
    institution: "HKBK College of Engineering",
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
    "Python", "TensorFlow Federated", "TensorFlow", "Pandas", "NumPy", "Docker", "AWS", "MQTT"
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
    description: "Contributed to maintaining the official IEEE CSBC website and coordinated events including IEEE CS PRO 2026 and Girl Geek."
  }
];
