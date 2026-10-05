import { EducationItem } from '../types';

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

export const RESEARCH_DATA = {
  title: "Analysis of Privacy-Preserving Federated Learning Frameworks for IoT-Based Distributed Data Analytics",
  status: "Work in Progress",
  expectedPublication: "Expected IEEE publication (late 2026)",
  description: "The research explores privacy-preserving federated learning frameworks for IoT-based distributed data analytics, focusing on secure collaborative machine learning while maintaining data privacy.",
  technologies: [
    "Python", "PyTorch", "Flower", "Scikit-learn", "Pandas", "NumPy", "Opacus", "Secure Aggregation", "Adaptive Communication"
  ]
};
