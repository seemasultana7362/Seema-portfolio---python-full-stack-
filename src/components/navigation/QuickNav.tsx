import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { FileText, Github, Linkedin, Mail, Monitor, X } from 'lucide-react';
import { SECTIONS } from '../../scene/zones';
import { useOcean } from '../../store/oceanStore';
import { useCameraNavigation } from '../../hooks/useCameraNavigation';
import { PERSONAL_INFO } from '../../data/portfolioData';

const BLURB: Record<string, string> = {
  hero: 'Back to the surface',
  about: 'Who I am',
  projects: 'Four project islands',
  skills: 'Underwater lab',
  experience: 'Roles & leadership',
  education: 'Degree, schooling & research',
  achievements: 'Hackathons & recognition',
  contact: 'Say hello',
};

/** Recruiter shortcut: every section and every professional link, no exploring required. */
export function QuickNav() {
  const open = useOcean((s) => s.quickNav);
  const setOpen = useOcean((s) => s.setQuickNav);
  const setMode = useOcean((s) => s.setMode);
  const { goTo } = useCameraNavigation();
  const first = useRef<HTMLButtonElement>(null);

  useEffect(() => { if (open) first.current?.focus(); }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="quick" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
          <motion.div
            className="quick__card"
            role="dialog"
            aria-label="Quick navigation"
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <header>
              <div>
                <p className="eyebrow">QUICK NAV</p>
                <h2 className="panel-title">Jump anywhere</h2>
              </div>
              <button type="button" className="icon-btn" onClick={() => setOpen(false)} aria-label="Close quick navigation"><X size={18} /></button>
            </header>
            <ul className="quick__grid">
              {SECTIONS.map((s, i) => (
                <li key={s.id}>
                  <button type="button" ref={i === 0 ? first : undefined} onClick={() => goTo(s.id)}>
                    <span className="quick__num">{s.code}</span>
                    <span><strong>{s.label}</strong><small>{BLURB[s.id]}</small></span>
                    <kbd>{i + 1}</kbd>
                  </button>
                </li>
              ))}
            </ul>
            <div className="quick__links">
              <a href={PERSONAL_INFO.github} target="_blank" rel="noopener noreferrer"><Github size={15} /> GitHub</a>
              <a href={PERSONAL_INFO.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={15} /> LinkedIn</a>
              <a href={`mailto:${PERSONAL_INFO.email}`}><Mail size={15} /> Email</a>
              <a href="/seema-sultana-resume.pdf" download><FileText size={15} /> Resume</a>
              <button type="button" onClick={() => { setOpen(false); setMode('classic'); }}><Monitor size={15} /> Classic 2D view</button>
            </div>
            <p className="quick__hint"><kbd>/</kbd> open · <kbd>1</kbd>–<kbd>8</kbd> jump · <kbd>Esc</kbd> close</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
