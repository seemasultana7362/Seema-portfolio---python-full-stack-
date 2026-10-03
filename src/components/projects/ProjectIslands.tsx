import type { ComponentType } from 'react';
import { PROJECTS_DATA } from '../../data/portfolioData';
import { ProjectIsland } from './ProjectIsland';
import { CitedPages, FederatedNetwork, ImportanceBars, MernTower } from './ProjectVisuals';

const VISUALS: Record<string, ComponentType> = {
  'mulberry-hotel': MernTower,
  'federated-iot': FederatedNetwork,
  'customer-churn-prediction': ImportanceBars,
  'doc-chat-ai': CitedPages,
};

/** One floating island per real project in data/projects.ts. */
export function ProjectIslands() {
  return (
    <group>
      {PROJECTS_DATA.map((p, i) => {
        const Visual = VISUALS[p.id];
        return (
          <ProjectIsland key={p.id} index={i} id={p.id}>
            {Visual && <Visual />}
          </ProjectIsland>
        );
      })}
    </group>
  );
}
