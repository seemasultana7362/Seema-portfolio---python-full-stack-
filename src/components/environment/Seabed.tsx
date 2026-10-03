import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

/** Low-poly rocky shelf that grounds a deep zone. Flat-shaded, dark, fogged. */
export function Seabed({ y, size = 150, seed = 1, color = '#05202f' }: { y: number; size?: number; seed?: number; color?: string }) {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(size, size, 56, 56);
    g.rotateX(-Math.PI / 2);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i);
      const d = Math.hypot(x, z + 8);
      const h = Math.sin(x * 0.13 + seed) * 1.6 + Math.cos(z * 0.11 + seed * 2) * 1.4 + Math.sin((x + z) * 0.31) * 0.5;
      // keep the centre calm so structures sit flat, rise toward the edges
      p.setY(i, h * THREE.MathUtils.smoothstep(d, 14, 40) + Math.max(0, d - 45) * 0.25);
    }
    g.computeVertexNormals();
    return g;
  }, [size, seed]);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <mesh geometry={geo} position={[0, y, -8]}>
      <meshStandardMaterial color={color} roughness={0.95} metalness={0} flatShading />
    </mesh>
  );
}
