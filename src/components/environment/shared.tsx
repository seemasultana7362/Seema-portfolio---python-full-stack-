import { useEffect, useMemo, type ReactNode } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useOcean } from '../../store/oceanStore';
import { SECTIONS, type SectionId } from '../../scene/zones';
import { getGlowTexture } from '../../scene/glow';

/** True while the visitor is in (or adjacent to) a section — used to gate labels and animation. */
export function useNear(id: SectionId, range = 1) {
  return useOcean((s) => {
    const a = SECTIONS.findIndex((x) => x.id === s.active);
    const b = SECTIONS.findIndex((x) => x.id === id);
    return Math.abs(a - b) <= range;
  });
}

export const useIsActive = (id: SectionId) => useOcean((s) => s.active === id);

/** Small projected world label. Only mounted where relevant so the DOM stays light. */
export function WorldLabel({
  position,
  children,
  accent = '#22D3EE',
  show = true,
}: {
  position: [number, number, number] | THREE.Vector3;
  children: ReactNode;
  accent?: string;
  show?: boolean;
}) {
  // always mounted (unmounting drei <Html> mid-render is unsafe); visibility is CSS-driven
  return (
    <Html position={position} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
      <div className={`world-label ${show ? '' : 'is-hidden'}`} style={{ ['--accent' as string]: accent }}>
        {children}
      </div>
    </Html>
  );
}

/** Additive halo sprite (shared glow texture). */
export function Halo({
  position = [0, 0, 0],
  scale = 6,
  color = '#22D3EE',
  opacity = 0.5,
}: {
  position?: [number, number, number];
  scale?: number;
  color?: string;
  opacity?: number;
}) {
  const mat = useMemo(
    () => new THREE.SpriteMaterial({ map: getGlowTexture(), color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending }),
    [color, opacity],
  );
  useEffect(() => () => mat.dispose(), [mat]);
  return <sprite position={position} scale={[scale, scale, 1]} material={mat} />;
}

/** Cursor label + hover plumbing for any interactive 3D object. */
export function useHoverCursor(label: string | null) {
  const setCursor = useOcean((s) => s.setCursor);
  return {
    onPointerOver: (e: { stopPropagation: () => void }) => { e.stopPropagation(); setCursor(label); },
    onPointerOut: () => setCursor(null),
  };
}

export const COLORS = {
  navy: '#03111F',
  midnight: '#061B2E',
  ocean: '#0B4F71',
  cyan: '#22D3EE',
  teal: '#14B8A6',
  white: '#F8FAFC',
};

/** Seeded pseudo-random so structures are identical between renders. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
