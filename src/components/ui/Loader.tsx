import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useOcean } from '../../store/oceanStore';

const STAGES = ['Calibrating sonar', 'Charting the surface', 'Seeding bioluminescence', 'Tuning the tide', 'Ready to dive'];

/** Cover shown while the 3D chunk loads and shaders compile. */
export function Loader() {
  const ready = useOcean((s) => s.ready);
  const [p, setP] = useState(4);
  const [minDone, setMinDone] = useState(false);

  useEffect(() => {
    const t = window.setTimeout(() => setMinDone(true), 1400);
    // ease toward 90% while we wait; jump to 100% once the scene reports ready
    const iv = window.setInterval(() => setP((v) => (v < 90 ? v + (90 - v) * 0.09 : v)), 120);
    return () => { clearTimeout(t); clearInterval(iv); };
  }, []);

  const done = ready && minDone;
  const shown = done ? 100 : p;
  const stage = STAGES[Math.min(STAGES.length - 1, Math.floor(shown / 22))];

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="loader"
          role="status"
          aria-live="polite"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        >
          <div className="loader__mark">
            <span>SEEMA</span>
            <small>DIGITAL OCEAN</small>
          </div>
          <div className="loader__bar" aria-hidden="true"><i style={{ width: `${shown}%` }} /></div>
          <p className="loader__stage">{stage}… {Math.round(shown)}%</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
