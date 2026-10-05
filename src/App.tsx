import { lazy, Suspense, useEffect, useState } from 'react';
import { useOcean } from './store/oceanStore';
import { hasWebGL } from './hooks/useResponsive3D';
import ClassicPortfolio from './ClassicPortfolio';

const OceanApp = lazy(() => import('./OceanApp'));

const initialMode = (webgl: boolean) => {
  if (!webgl) return 'classic' as const;
  const q = new URLSearchParams(window.location.search).get('view');
  if (q === 'classic' || q === 'ocean') return q;
  try { return localStorage.getItem('view') === 'classic' ? ('classic' as const) : ('ocean' as const); } catch { return 'ocean' as const; }
};

/**
 * Entry point. Visitors with WebGL get the immersive Digital Ocean; everyone
 * else (or anyone who opts out) gets the classic 2D portfolio with the same content.
 */
export default function App() {
  const [webgl] = useState(hasWebGL);
  const mode = useOcean((s) => s.mode);
  const setMode = useOcean((s) => s.setMode);

  useEffect(() => { setMode(initialMode(webgl)); }, [webgl, setMode]);
  useEffect(() => {
    try { localStorage.setItem('view', mode); } catch { /* storage unavailable */ }
  }, [mode]);

  if (mode === 'ocean' && webgl) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-[#03111F]" />}>
        <OceanApp />
      </Suspense>
    );
  }
  return <ClassicPortfolio onEnterOcean={webgl ? () => setMode('ocean') : undefined} />;
}
