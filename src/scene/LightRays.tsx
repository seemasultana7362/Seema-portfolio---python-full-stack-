import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { runtime, shared } from '../store/runtime';
import { useQuality } from './QualityContext';

const vert = /* glsl */ `
varying vec2 vUv;
varying vec3 vWorld;
void main() {
  vUv = uv;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;
const frag = /* glsl */ `
uniform float uTime;
uniform float uIntensity;
uniform float uPhase;
varying vec2 vUv;
varying vec3 vWorld;
void main() {
  float x = abs(vUv.x - 0.5) * 2.0;
  float shaft = pow(1.0 - x, 1.8);
  float shimmer = 0.65 + 0.35 * sin(uTime * 0.5 + uPhase + vWorld.y * 0.08);
  float a = shaft * pow(vUv.y, 1.4) * shimmer * uIntensity;
  gl_FragColor = vec4(vec3(0.35, 0.85, 0.95), a);
}`;

/** Volumetric-looking god rays from the surface; fade out with depth and above water. */
export function LightRays() {
  const q = useQuality();
  const group = useRef<THREE.Group>(null);

  const { geo, mats, items } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1, 1);
    const items = Array.from({ length: q.rays }, (_, i) => ({
      x: (i / Math.max(1, q.rays - 1) - 0.5) * 60 + (Math.random() - 0.5) * 6,
      z: -28 + Math.random() * 30,
      w: 3 + Math.random() * 6,
      tilt: 0.12 + Math.random() * 0.1,
    }));
    const mats = items.map(
      (_, i) =>
        new THREE.ShaderMaterial({
          vertexShader: vert,
          fragmentShader: frag,
          uniforms: { uTime: shared.uTime, uIntensity: { value: 0.2 }, uPhase: { value: i * 1.7 } },
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          side: THREE.DoubleSide,
        }),
    );
    return { geo, mats, items };
  }, [q.rays]);

  useEffect(() => () => { geo.dispose(); mats.forEach((m) => m.dispose()); }, [geo, mats]);

  useFrame(({ camera }) => {
    const y = camera.position.y;
    const under = 1 - runtime.above;
    // brightest near the surface, gone by ~70m
    const k = THREE.MathUtils.clamp(1 - Math.abs(y + 20) / 60, 0, 1) * under;
    if (group.current) group.current.visible = k > 0.01;
    mats.forEach((m) => (m.uniforms.uIntensity.value = 0.26 * k));
  });

  return (
    <group ref={group} position={[0, -30, 0]}>
      {items.map((it, i) => (
        <mesh key={i} geometry={geo} material={mats[i]} position={[it.x, 0, it.z]} rotation={[0, 0, it.tilt]} scale={[it.w, 62, 1]} frustumCulled={false} renderOrder={1} />
      ))}
    </group>
  );
}
