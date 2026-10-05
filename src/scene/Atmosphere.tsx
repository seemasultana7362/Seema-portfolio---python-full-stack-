import { useEffect, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { runtime, shared } from '../store/runtime';
import { DEPTH_PROFILE } from './zones';
import { useQuality } from './QualityContext';

const profileColors = DEPTH_PROFILE.map((p) => new THREE.Color(p.color));
const tmp = new THREE.Color();

/** Owns fog, background and the shared time/atmosphere uniforms; colours follow camera depth. */
export function Atmosphere() {
  const scene = useThree((s) => s.scene);
  const q = useQuality();
  const fog = useMemo(() => new THREE.FogExp2('#11587c', 0.0055), []);

  useEffect(() => {
    scene.fog = fog;
    scene.background = shared.uFogColor.value;
    return () => { scene.fog = null; scene.background = null; };
  }, [scene, fog]);

  useFrame((state, dt) => {
    shared.uTime.value += Math.min(dt, 0.1);
    shared.uMotion.value = q.reducedMotion ? 0.12 : 1;

    const y = state.camera.position.y;
    // depth profile lookup
    let i = 0;
    while (i < DEPTH_PROFILE.length - 2 && y < DEPTH_PROFILE[i + 1].y) i++;
    const a = DEPTH_PROFILE[i];
    const b = DEPTH_PROFILE[i + 1];
    const t = THREE.MathUtils.clamp((a.y - y) / (a.y - b.y), 0, 1);
    tmp.copy(profileColors[i]).lerp(profileColors[i + 1], t);
    let density = a.density + (b.density - a.density) * t;

    // approached project island: background dims, water thickens
    tmp.multiplyScalar(1 - runtime.dim * 0.3);
    density *= 1 + runtime.dim * 0.45;

    shared.uFogColor.value.copy(tmp);
    shared.uFogDensity.value = density;
    fog.color.copy(tmp);
    fog.density = density;

    const above = THREE.MathUtils.smoothstep(y, -4, 3);
    runtime.above = above;
    shared.uAbove.value = above;
  }, -1);

  return null;
}
