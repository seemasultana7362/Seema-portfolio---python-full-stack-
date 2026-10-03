import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { runtime } from '../store/runtime';
import { getCloudTexture, getGlowTexture } from './glow';
import { useQuality } from './QualityContext';

/** Low-cost sprite clouds near the horizon plus the sun's glow. Hidden underwater. */
export function Clouds() {
  const q = useQuality();
  const group = useRef<THREE.Group>(null);
  const { cloudMat, sunMat, items } = useMemo(() => {
    const cloudMat = new THREE.SpriteMaterial({ map: getCloudTexture(), color: '#6fb6d6', transparent: true, opacity: 0.4, depthWrite: false, depthTest: true, fog: false });
    const sunMat = new THREE.SpriteMaterial({ map: getGlowTexture(), color: '#bff3ff', transparent: true, opacity: 0.55, depthWrite: false, depthTest: true, fog: false, blending: THREE.AdditiveBlending });
    const items = Array.from({ length: q.clouds }, (_, i) => {
      const a = (i / q.clouds) * Math.PI * 1.1 - Math.PI * 0.55;
      const r = 260 + Math.random() * 60;
      return {
        pos: new THREE.Vector3(Math.sin(a) * r * 1.3, 28 + Math.random() * 55, -Math.cos(a) * r),
        scale: new THREE.Vector3(120 + Math.random() * 110, 40 + Math.random() * 40, 1),
      };
    });
    return { cloudMat, sunMat, items };
  }, [q.clouds]);
  useEffect(() => () => { cloudMat.dispose(); sunMat.dispose(); }, [cloudMat, sunMat]);

  useFrame(({ camera }) => {
    if (!group.current) return;
    group.current.position.set(camera.position.x, 0, camera.position.z);
    group.current.visible = runtime.above > 0.02;
    cloudMat.opacity = 0.4 * runtime.above;
    sunMat.opacity = 0.45 * runtime.above;
  });

  return (
    <group ref={group} renderOrder={-9}>
      {items.map((it, i) => (
        <sprite key={i} material={cloudMat} position={it.pos} scale={it.scale} />
      ))}
      <sprite material={sunMat} position={[70, 34, -250]} scale={[120, 120, 1]} />
    </group>
  );
}
