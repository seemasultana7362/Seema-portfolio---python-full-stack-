export interface Project {
  id: string;
  title: string;
  category: string;
  summary: string;
  problem: string;
  solution: string;
  technologies: string[];
  highlights: string[];
  image?: string;
  imageLabel: string;
  imageNote: string;
  github: string;
  demo: string;
  isLiveExperience?: boolean;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface ExperienceItem {
  id: string;
  organization: string;
  role: string;
  duration: string;
  location: string;
  description: string[];
  technologies: string[];
}

export interface EducationItem {
  institution: string;
  qualification: string;
  affiliation?: string;
  duration: string;
  score: string;
  description: string;
}

export interface AchievementItem {
  badge: string;
  title: string;
  date: string;
  description: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
