import { useEffect } from 'react';
import { useOcean } from '../store/oceanStore';
import { SECTIONS } from '../scene/zones';
import { useCameraNavigation } from './useCameraNavigation';
import { PROJECT_IDS } from '../scene/projectIslands';

/**
 * Global interaction plumbing for the ocean: keyboard shortcuts, cover-screen
 * scroll intent, and locking page scroll while a panel/project is open.
 */
export function useOceanInteraction() {
  const { goTo, enterOcean } = useCameraNavigation();
  const entered = useOcean((s) => s.entered);
  const modal = useOcean((s) => !!s.selectedProject || !!s.detail || s.quickNav);

  // scroll lock while a panel is open (panels scroll internally)
  useEffect(() => {
    document.documentElement.dataset.modal = modal ? 'true' : 'false';
  }, [modal]);

  // any scroll gesture on the cover means "enter"
  useEffect(() => {
    if (entered) return;
    const onWheel = (e: WheelEvent) => { if (e.deltaY > 8) enterOcean(); };
    let y0 = 0;
    const onStart = (e: TouchEvent) => { y0 = e.touches[0].clientY; };
    const onMove = (e: TouchEvent) => { if (y0 - e.touches[0].clientY > 24) enterOcean(); };
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
    };
  }, [entered, enterOcean]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const st = useOcean.getState();
      const tag = (e.target as HTMLElement)?.tagName;
      const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
      if (e.key === 'Escape') {
        if (st.quickNav) st.setQuickNav(false);
        else if (st.selectedProject) st.selectProject(null);
        else if (st.detail) st.openDetail(null);
        return;
      }
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === '/' || e.key.toLowerCase() === 'k') { e.preventDefault(); st.setQuickNav(!st.quickNav); return; }
      if (!st.entered) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'PageDown') {
          if ((e.target as HTMLElement)?.closest?.('a,button')) return;
          e.preventDefault(); enterOcean();
        }
        return;
      }
      if (/^[1-8]$/.test(e.key)) { goTo(SECTIONS[Number(e.key) - 1].id); return; }
      if (st.selectedProject) {
        const i = PROJECT_IDS.indexOf(st.selectedProject);
        if (e.key === 'ArrowRight') st.selectProject(PROJECT_IDS[(i + 1) % PROJECT_IDS.length]);
        if (e.key === 'ArrowLeft') st.selectProject(PROJECT_IDS[(i - 1 + PROJECT_IDS.length) % PROJECT_IDS.length]);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo, enterOcean]);
}
