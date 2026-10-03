import { ExperienceItem } from '../types';

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

/** Experience + leadership as one list of "locations" for the ocean (derived, nothing added). */
export interface LocationItem {
  id: string;
  kind: 'Experience' | 'Leadership';
  organization: string;
  role: string;
  duration: string;
  location: string;
  description: string[];
  technologies: string[];
}

export const LOCATIONS: LocationItem[] = [
  ...EXPERIENCE_DATA.map((e): LocationItem => ({ ...e, kind: 'Experience' })),
  ...LEADERSHIP_DATA.map((l, i): LocationItem => ({
    id: `leadership-${i}`,
    kind: 'Leadership',
    organization: l.organization,
    role: l.role,
    duration: l.duration,
    location: l.location,
    description: [l.description],
    technologies: [],
  })),
];
