import { Project } from '../types';

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
