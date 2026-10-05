import { useEffect, useState } from 'react';

export type Tier = 'high' | 'medium' | 'low';

export interface Quality {
  tier: Tier;
  waterSegments: number;
  particles: number;
  bubbles: number;
  rays: number;
  clouds: number;
  coral: number;
  dprMax: number;
  antialias: boolean;
  isTouch: boolean;
  reducedMotion: boolean;
}

export function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

function detect(): Quality {
  const w = window.innerWidth;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 8;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let tier: Tier = w < 768 || isTouch && w < 1024 ? 'low' : w < 1100 ? 'medium' : 'high';
  if (tier === 'high' && (mem < 4 || cores <= 4)) tier = 'medium';

  const table: Record<Tier, Omit<Quality, 'tier' | 'isTouch' | 'reducedMotion'>> = {
    high: { waterSegments: 180, particles: 2600, bubbles: 320, rays: 9, clouds: 12, coral: 160, dprMax: 2, antialias: true },
    medium: { waterSegments: 120, particles: 1400, bubbles: 180, rays: 6, clouds: 8, coral: 90, dprMax: 1.5, antialias: true },
    low: { waterSegments: 64, particles: 650, bubbles: 80, rays: 3, clouds: 5, coral: 40, dprMax: 1.25, antialias: false },
  };
  return { tier, isTouch, reducedMotion, ...table[tier] };
}

/** Device-capability tiering for the 3D scene (desktop / tablet / phone). */
export function useResponsive3D(): Quality {
  const [q, setQ] = useState<Quality>(detect);
  useEffect(() => {
    let t: number;
    const onResize = () => {
      clearTimeout(t);
      t = window.setTimeout(() => setQ((prev) => {
        const next = detect();
        return next.tier === prev.tier && next.reducedMotion === prev.reducedMotion ? prev : next;
      }), 200);
    };
    window.addEventListener('resize', onResize);
    return () => { window.removeEventListener('resize', onResize); clearTimeout(t); };
  }, []);
  return q;
}
