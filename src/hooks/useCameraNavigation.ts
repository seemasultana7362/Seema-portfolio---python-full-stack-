import { useCallback, useEffect } from 'react';
import { animate } from 'motion';
import { runtime } from '../store/runtime';
import { useOcean } from '../store/oceanStore';
import { SECTIONS, SECTION_COUNT, type SectionId } from '../scene/zones';

/** Page-heights of scroll travelled per section. The page itself scrolls natively. */
export const STEP_VH = 0.95;

export const scrollerHeight = () => `calc(100vh * ${1 + (SECTION_COUNT - 1) * STEP_VH})`;
const stepPx = () => window.innerHeight * STEP_VH;

let cancel: (() => void) | null = null;

/** Cinematic scroll: eases the page (and so the camera) to a section's anchor. */
function flyToIndex(index: number, slow = false) {
  cancel?.();
  const from = window.scrollY;
  const to = Math.round(index * stepPx());
  const dist = Math.abs(index - runtime.progress);
  const duration = Math.min(4.2, Math.max(1.1, 0.8 + dist * 0.55)) * (slow ? 1.35 : 1);
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) { window.scrollTo(0, to); return; }
  const controls = animate(from, to, {
    duration,
    ease: [0.65, 0, 0.35, 1],
    onUpdate: (v) => window.scrollTo(0, v),
  });
  cancel = () => controls.stop();
}

/**
 * Drives the journey: native scroll position -> runtime.progress -> camera pose.
 * Also exposes goTo() for HUD / quick-nav / keyboard jumps.
 */
export function useScrollJourney() {
  const setActive = useOcean((s) => s.setActive);
  const entered = useOcean((s) => s.entered);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = Math.min(SECTION_COUNT - 1, Math.max(0, window.scrollY / stepPx()));
      runtime.progress = p;
      const idx = Math.round(p);
      const next = SECTIONS[idx].id;
      if (useOcean.getState().active !== next) setActive(next);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
    // a manual wheel/touch interrupts any running cinematic scroll
    const stop = () => cancel?.();
    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchstart', stop, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchstart', stop);
      if (raf) cancelAnimationFrame(raf);
      cancel?.();
    };
  }, [setActive]);

  // scroll is locked on the cover until the visitor enters
  useEffect(() => {
    document.documentElement.dataset.locked = entered ? 'false' : 'true';
  }, [entered]);
}

export function useCameraNavigation() {
  const goTo = useCallback((id: SectionId) => {
    const st = useOcean.getState();
    st.selectProject(null);
    st.openDetail(null);
    st.setQuickNav(false);
    if (!st.entered) st.enter();
    flyToIndex(SECTIONS.findIndex((s) => s.id === id), !st.entered);
  }, []);

  const enterOcean = useCallback(() => {
    const st = useOcean.getState();
    st.enter();
    flyToIndex(1, true);
  }, []);

  return { goTo, enterOcean };
}
