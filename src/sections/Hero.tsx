import { motion } from 'motion/react';
import { useOcean } from '../store/oceanStore';
import { useCameraNavigation } from '../hooks/useCameraNavigation';

/** Cover copy over the wide ocean shot. */
export function Hero() {
  const entered = useOcean((s) => s.entered);
  const { enterOcean, goTo } = useCameraNavigation();
  return (
    <motion.div
      className="hero"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
      transition={{ duration: 0.9 }}
    >
      <motion.p className="hero__eyebrow" aria-hidden="true" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
        SEEMA — DIGITAL OCEAN
      </motion.p>
      <motion.p className="hero__name" aria-hidden="true" initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ delay: 0.7, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
        SEEMA SULTANA
      </motion.p>
      <motion.p className="hero__sub" aria-hidden="true" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.9 }}>
        Computer Science Engineer <i>•</i> Full Stack Developer <i>•</i> AI/ML Enthusiast
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.9 }} className="hero__cta">
        <button type="button" className="cta" onClick={enterOcean} data-cursor="DIVE">
          {entered ? 'DIVE IN' : 'ENTER THE OCEAN'} <span aria-hidden="true">→</span>
        </button>
        <button type="button" className="cta cta--ghost" onClick={() => goTo('projects')}>
          VIEW PROJECTS
        </button>
      </motion.div>
      <motion.p className="hero__hint" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 2.1, duration: 1 }}>
        DRAG TO EXPLORE <i>•</i> SCROLL TO DIVE
      </motion.p>
    </motion.div>
  );
}
