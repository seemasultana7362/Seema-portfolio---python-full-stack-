import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { LOCATIONS } from '../../data/portfolioData';
import { EXPERIENCE_POS } from '../../scene/zones';
import { useOcean } from '../../store/oceanStore';
import { shared } from '../../store/runtime';
import { Halo, WorldLabel, useHoverCursor, useNear, COLORS, rng } from './shared';

const NODE_OFFSETS: [number, number, number][] = [
  [-12, 1, 3],
  [-4, -3, -3],
  [4.5, 2, -1],
  [12, -2, -5],
];

const streamVert = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const streamFrag = /* glsl */ `
uniform float uTime;
uniform float uGlow;
varying vec2 vUv;
void main() {
  float flow = fract(vUv.x * 7.0 - uTime * 0.45);
  float pulse = smoothstep(0.0, 0.12, flow) * smoothstep(0.5, 0.12, flow);
  float core = 1.0 - abs(vUv.y - 0.5) * 2.0;
  float a = (0.18 + pulse * 0.8) * core * (0.6 + uGlow * 0.6);
  gl_FragColor = vec4(vec3(0.13, 0.83, 0.93), a);
}`;

/** EXPERIENCE — a dark trench of sonar beacons linked by data streams; one beacon per role. */
export function ExperienceDepths() {
  const near = useNear('experience', 1);
  const group = useRef<THREE.Group>(null);
  const orbs = useRef<(THREE.Mesh | null)[]>([]);
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const glows = useRef<number[]>(LOCATIONS.map(() => 0.2));
  const open = useOcean((s) => s.openDetail);
  const setHoverItem = useOcean((s) => s.setHoverItem);
  const cursor = useHoverCursor('OPEN');

  const { positions, streamGeos, streamMat, rocks, geos } = useMemo(() => {
    const positions = LOCATIONS.map((_, i) => new THREE.Vector3(...NODE_OFFSETS[i % NODE_OFFSETS.length]));
    const streamMat = new THREE.ShaderMaterial({
      vertexShader: streamVert,
      fragmentShader: streamFrag,
      uniforms: { uTime: shared.uTime, uGlow: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
    });
    const streamGeos: THREE.TubeGeometry[] = [];
    for (let i = 0; i < positions.length - 1; i++) {
      const a = positions[i].clone().add(new THREE.Vector3(0, 5.6, 0));
      const b = positions[i + 1].clone().add(new THREE.Vector3(0, 5.6, 0));
      const mid = a.clone().lerp(b, 0.5).add(new THREE.Vector3(0, -2.4, 1.2));
      streamGeos.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([a, mid, b]), 40, 0.11, 6, false));
    }
    const r = rng(7);
    const rocks = Array.from({ length: 14 }, () => ({
      x: (r() - 0.5) * 70,
      z: -12 - r() * 26,
      y: -7 - r() * 2,
      h: 5 + r() * 12,
      w: 2.5 + r() * 4,
    }));
    const geos = {
      pylon: new THREE.CylinderGeometry(0.55, 0.9, 5.2, 8),
      rock: new THREE.ConeGeometry(1, 1, 5),
      band: new THREE.TorusGeometry(0.72, 0.035, 6, 24),
      ring: new THREE.TorusGeometry(1.5, 0.02, 6, 60),
    };
    geos.band.rotateX(Math.PI / 2);
    return { positions, streamGeos, streamMat, rocks, geos };
  }, []);

  useEffect(() => () => { streamGeos.forEach((g) => g.dispose()); streamMat.dispose(); Object.values(geos).forEach((g) => g.dispose()); }, [streamGeos, streamMat, geos]);

  useFrame(({ clock }, dt) => {
    if (!group.current?.visible) return;
    const t = clock.elapsedTime * shared.uMotion.value;
    const st = useOcean.getState();
    let any = 0;
    LOCATIONS.forEach((l, i) => {
      const hot = st.hoverItem === l.id || (st.detail?.kind === 'experience' && st.detail.id === l.id);
      glows.current[i] += ((hot ? 1 : 0.2) - glows.current[i]) * (1 - Math.exp(-5 * dt));
      any = Math.max(any, glows.current[i]);
      const g = glows.current[i];
      const orb = orbs.current[i];
      if (orb) {
        orb.scale.setScalar(0.75 + g * 0.4 + Math.sin(t * 2 + i) * 0.05);
        orb.position.y = 5.6 + Math.sin(t * 0.8 + i) * 0.15;
      }
      const ring = rings.current[i];
      if (ring) { ring.rotation.z = t * 0.5 + i; ring.scale.setScalar(1 + g * 0.25); }
    });
    streamMat.uniforms.uGlow.value = any;
  });

  return (
    <group ref={group} position={EXPERIENCE_POS} visible={near}>
      <pointLight position={[0, 8, 6]} color="#14B8A6" intensity={90} distance={40} decay={2} />

      {/* trench walls / ruins */}
      {rocks.map((r, i) => (
        <mesh key={i} geometry={geos.rock} position={[r.x, r.y + r.h / 2, r.z]} scale={[r.w, r.h, r.w]} rotation={[0, i, 0]}>
          <meshStandardMaterial color="#04182a" roughness={1} flatShading />
        </mesh>
      ))}
      <mesh position={[0, -7.2, -4]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[34, 40]} />
        <meshStandardMaterial color="#04182a" roughness={1} flatShading />
      </mesh>

      {streamGeos.map((g, i) => (
        <mesh key={i} geometry={g} material={streamMat} />
      ))}

      {LOCATIONS.map((l, i) => (
        <group
          key={l.id}
          position={positions[i]}
          onPointerOver={(e) => { cursor.onPointerOver(e); setHoverItem(l.id); }}
          onPointerOut={() => { cursor.onPointerOut(); setHoverItem(null); }}
          onClick={(e) => { if (e.delta > 6) return; e.stopPropagation(); open({ kind: 'experience', id: l.id }); }}
        >
          <mesh geometry={geos.rock} position={[0, -1.6, 0]} scale={[2.6, 2.4, 2.6]}>
            <meshStandardMaterial color="#05233a" roughness={0.9} flatShading />
          </mesh>
          <mesh geometry={geos.pylon} position={[0, 1.4, 0]}>
            <meshStandardMaterial color="#0a3a58" metalness={0.7} roughness={0.3} flatShading emissive={COLORS.teal} emissiveIntensity={0.1} />
          </mesh>
          {[0.2, 1.5, 2.8].map((y) => (
            <mesh key={y} geometry={geos.band} position={[0, y, 0]} scale={1 - (y - 0.2) * 0.04}>
              <meshBasicMaterial color={COLORS.cyan} transparent opacity={0.75} />
            </mesh>
          ))}
          <mesh ref={(el) => { orbs.current[i] = el; }} position={[0, 5.6, 0]}>
            <icosahedronGeometry args={[0.55, 1]} />
            <meshBasicMaterial color={l.kind === 'Leadership' ? COLORS.teal : COLORS.cyan} />
          </mesh>
          <Halo position={[0, 5.6, 0]} scale={5} opacity={0.5} color={l.kind === 'Leadership' ? COLORS.teal : COLORS.cyan} />
          <mesh ref={(el) => { rings.current[i] = el; }} geometry={geos.ring} position={[0, 5.6, 0]} rotation={[Math.PI / 2.5, 0.3, 0]}>
            <meshBasicMaterial color={COLORS.white} transparent opacity={0.5} />
          </mesh>
          <mesh position={[0, 2.2, 0]}>
            <cylinderGeometry args={[2.2, 2.2, 8, 8]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
          <WorldLabel position={[0, 7.6, 0]} show={near} accent={COLORS.teal}>
            {(l.organization.match(/\(([^)]+)\)/)?.[1] ?? l.organization)} <b>{l.role.split('/')[0].replace(/ \(.*\)/, '').trim()}</b>
          </WorldLabel>
        </group>
      ))}
    </group>
  );
}
