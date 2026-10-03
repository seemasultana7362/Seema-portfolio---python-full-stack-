import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useQuality } from './QualityContext';

/** Watches frame time and steps the device pixel ratio up/down to hold ~50+ fps. */
export function AdaptiveQuality() {
  const q = useQuality();
  const setDpr = useThree((s) => s.setDpr);
  const acc = useRef({ t: 0, n: 0, dpr: Math.min(window.devicePixelRatio, q.dprMax) });

  useFrame((_, dt) => {
    const a = acc.current;
    a.t += dt; a.n++;
    if (a.t < 1.5) return;
    const fps = a.n / a.t;
    a.t = 0; a.n = 0;
    const max = Math.min(window.devicePixelRatio, q.dprMax);
    let next = a.dpr;
    if (fps < 40) next = Math.max(0.75, a.dpr - 0.25);
    else if (fps > 56) next = Math.min(max, a.dpr + 0.25);
    if (next !== a.dpr) { a.dpr = next; setDpr(next); }
  });
  return null;
}
