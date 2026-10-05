import { lazy, Suspense, useEffect } from 'react';
import { useOcean } from './store/oceanStore';
import { useResponsive3D } from './hooks/useResponsive3D';
import { scrollerHeight, useScrollJourney } from './hooks/useCameraNavigation';
import { useOceanInteraction } from './hooks/useOceanInteraction';
import { HUD } from './components/navigation/HUD';
import { QuickNav } from './components/navigation/QuickNav';
import { SectionDock } from './sections/SectionDock';
import { Loader } from './components/ui/Loader';
import { Cursor } from './components/ui/Cursor';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { SemanticOutline } from './components/ui/SemanticOutline';
import './ocean.css';

const OceanScene = lazy(() => import('./scene/OceanScene'));

/** "Seema — Digital Ocean": the immersive portfolio. */
export default function OceanApp() {
  const quality = useResponsive3D();
  const setMode = useOcean((s) => s.setMode);
  const dimmed = useOcean((s) => !!s.selectedProject);
  const ready = useOcean((s) => s.ready);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.ocean = 'on';
    window.scrollTo(0, 0);
    useOcean.setState({ entered: false, active: 'hero', ready: false, selectedProject: null, detail: null, quickNav: false });
    return () => {
      delete root.dataset.ocean; delete root.dataset.locked; delete root.dataset.modal;
      window.scrollTo(0, 0);
    };
  }, []);

  useScrollJourney();
  useOceanInteraction();

  return (
    <div className="ocean-root">
      <ErrorBoundary onError={() => setMode('classic')}>
        <Suspense fallback={null}>
          <OceanScene quality={quality} />
        </Suspense>
      </ErrorBoundary>

      <div className={`dim ${dimmed ? 'is-on' : ''}`} aria-hidden="true" />
      <div className="cursor-glow" aria-hidden="true" />
      <SemanticOutline />
      <div className="ocean-scroller" style={{ height: scrollerHeight() }} aria-hidden="true" />

      {ready && (
        <>
          <HUD />
          <SectionDock />
          <QuickNav />
        </>
      )}
      <Loader />
      {!quality.isTouch && <Cursor />}
    </div>
  );
}
