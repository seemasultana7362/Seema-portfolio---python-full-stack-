import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { runtime, shared } from '../store/runtime';

/** Zone lighting: cool dusk key light above water, a soft cyan lamp that rides with the camera below. */
export function Lighting() {
  const hemi = useRef<THREE.HemisphereLight>(null);
  const sun = useRef<THREE.DirectionalLight>(null);
  const lamp = useRef<THREE.PointLight>(null);

  useFrame(({ camera }) => {
    const a = runtime.above;
    const depth = THREE.MathUtils.clamp(-camera.position.y / 140, 0, 1);
    if (hemi.current) hemi.current.intensity = 0.55 * a + 0.32 * (1 - a) * (1 - depth * 0.5);
    if (sun.current) {
      sun.current.intensity = 0.9 * a + 0.1;
      sun.current.position.copy(camera.position).addScaledVector(shared.uSunDir.value, 60);
      sun.current.target.position.copy(camera.position);
      sun.current.target.updateMatrixWorld();
    }
    if (lamp.current) {
      lamp.current.position.copy(camera.position).add(new THREE.Vector3(0, 1.5, -2));
      lamp.current.intensity = (1 - a) * (180 + depth * 160) * (1 - runtime.dim * 0.4);
    }
  });

  return (
    <>
      <hemisphereLight ref={hemi} args={['#8fd6ee', '#04182a', 0.55]} />
      <directionalLight ref={sun} color="#cdeffa" intensity={1.5} />
      <pointLight ref={lamp} color="#38d8ee" distance={48} decay={2} intensity={0} />
    </>
  );
}
