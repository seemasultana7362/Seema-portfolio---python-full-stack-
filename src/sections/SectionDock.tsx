import { AnimatePresence } from 'motion/react';
import { useOcean } from '../store/oceanStore';
import { Hero } from './Hero';
import { AboutDock, AboutPanel } from './About';
import { ProjectsDock, ProjectPanel } from './Projects';
import { SkillsDock } from './Skills';
import { ExperienceDock, ExperiencePanel } from './Experience';
import { EducationDock, EducationPanel, ResearchPanel } from './Education';
import { AchievementsDock, AchievementPanel } from './Achievements';
import { ContactDock, ContactPanel } from './Contact';

/** Chooses what sits beside the 3D scene: cover, section dock, or an open detail panel. */
export function SectionDock() {
  const active = useOcean((s) => s.active);
  const entered = useOcean((s) => s.entered);
  const selected = useOcean((s) => s.selectedProject);
  const detail = useOcean((s) => s.detail);
  const panelOpen = !!selected || !!detail;

  return (
    <>
      <AnimatePresence>{active === 'hero' && !panelOpen && <Hero key="hero" />}</AnimatePresence>
      <div className="dock-slot">
        <AnimatePresence mode="wait">
          {entered && !panelOpen && active === 'about' && <AboutDock key="about" />}
          {entered && !panelOpen && active === 'projects' && <ProjectsDock key="projects" />}
          {entered && !panelOpen && active === 'skills' && <SkillsDock key="skills" />}
          {entered && !panelOpen && active === 'experience' && <ExperienceDock key="experience" />}
          {entered && !panelOpen && active === 'education' && <EducationDock key="education" />}
          {entered && !panelOpen && active === 'achievements' && <AchievementsDock key="achievements" />}
          {entered && !panelOpen && active === 'contact' && <ContactDock key="contact" />}
        </AnimatePresence>
      </div>
      <AnimatePresence mode="wait">
        {selected && <ProjectPanel key={`p-${selected}`} id={selected} />}
        {detail?.kind === 'about' && <AboutPanel key="about-panel" />}
        {detail?.kind === 'experience' && <ExperiencePanel key={`x-${detail.id}`} id={String(detail.id)} />}
        {detail?.kind === 'education' && <EducationPanel key={`e-${detail.id}`} id={Number(detail.id)} />}
        {detail?.kind === 'research' && <ResearchPanel key="research" />}
        {detail?.kind === 'achievement' && <AchievementPanel key={`a-${detail.id}`} id={Number(detail.id)} />}
        {detail?.kind === 'contact' && <ContactPanel key="contact-panel" />}
      </AnimatePresence>
    </>
  );
}
