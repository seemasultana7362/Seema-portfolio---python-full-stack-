import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

const ISLANDS: { x: number; z: number; r: number; h: number; seg: number }[] = [
  { x: -160, z: -210, r: 34, h: 26, seg: 6 },
  { x: -110, z: -260, r: 50, h: 38, seg: 7 },
  { x: -30, z: -300, r: 40, h: 18, seg: 6 },
  { x: 70, z: -270, r: 56, h: 44, seg: 7 },
  { x: 150, z: -220, r: 30, h: 24, seg: 5 },
  { x: 210, z: -180, r: 24, h: 14, seg: 6 },
  { x: -220, z: -140, r: 22, h: 16, seg: 5 },
];

/** Distant silhouettes that give the horizon scale; fogged out by the scene fog. */
export function DistantIslands() {
  const { geos, mat } = useMemo(() => {
    const geos = ISLANDS.map((i) => new THREE.ConeGeometry(i.r, i.h, i.seg, 1, false));
    const mat = new THREE.MeshStandardMaterial({ color: '#03121f', flatShading: true, roughness: 1, metalness: 0 });
    return { geos, mat };
  }, []);
  useEffect(() => () => { geos.forEach((g) => g.dispose()); mat.dispose(); }, [geos, mat]);
  return (
    <group>
      {ISLANDS.map((it, i) => (
        <mesh key={i} geometry={geos[i]} material={mat} position={[it.x * 1.35, it.h / 2 - 1.5, it.z * 1.35]} rotation={[0, i * 1.3, 0]} />
      ))}
    </group>
  );
}
