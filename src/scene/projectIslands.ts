import { PROJECTS_DATA } from '../data/portfolioData';

export const PROJECT_IDS = PROJECTS_DATA.map((p) => p.id);

/** Visual identity per project island (presentation only; content stays in data/projects.ts). */
export const ISLAND_THEME: Record<string, { short: string; accent: string; metaphor: string }> = {
  'mulberry-hotel': { short: 'MULBERRY SHADES', accent: '#22D3EE', metaphor: 'Layered MERN stack tower' },
  'federated-iot': { short: 'FEDERATED IoT IDS', accent: '#14B8A6', metaphor: 'Clients and a central aggregation server' },
  'customer-churn-prediction': { short: 'CHURN PREDICTION', accent: '#67E8F9', metaphor: 'Ranked feature-importance bars' },
  'doc-chat-ai': { short: 'DOC-CHAT-AI', accent: '#5EEAD4', metaphor: 'Cited pages under a retrieval scan' },
};
