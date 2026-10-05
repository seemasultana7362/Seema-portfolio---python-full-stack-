import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EDUCATION_DATA, RESEARCH_DATA } from '../../data/portfolioData';
import { EDUCATION_POS } from '../../scene/zones';
import { useOcean } from '../../store/oceanStore';
import { shared } from '../../store/runtime';
import { Halo, WorldLabel, useHoverCursor, useNear, COLORS } from './shared';

const holoVert = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const holoFrag = /* glsl */ `
uniform float uTime;
uniform float uGlow;
uniform vec3 uColor;
uniform float uSeed;
varying vec2 vUv;
float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5); }
void main() {
  // rows of holographic "data" bars
  float row = floor(vUv.y * 14.0);
  float w = 0.25 + 0.65 * hash(vec2(row, uSeed));
  float bar = step(vUv.x, w) * step(0.35, fract(vUv.y * 14.0)) * step(0.12, vUv.x);
  float scan = 0.65 + 0.35 * sin(vUv.y * 160.0 - uTime * 2.0);
  vec2 e = min(vUv, 1.0 - vUv);
  float frame = 1.0 - smoothstep(0.0, 0.014, min(e.x, e.y));
  float sweep = smoothstep(0.06, 0.0, abs(fract(uTime * 0.2 + uSeed) - vUv.y));
  vec3 col = uColor * (bar * 0.55 + sweep * 0.6 + 0.12) * scan + uColor * frame * (0.9 + uGlow);
  gl_FragColor = vec4(col, (0.2 + bar * 0.35 + sweep * 0.3 + uGlow * 0.15) + frame);
}`;

interface Plate { key: string; kind: 'education' | 'research'; id: number | string; label: string; color: string; pos: [number, number, number] }

/** EDUCATION — a glass research dome holding one holographic plate per qualification, plus the research project. */
export function EducationObservatory() {
  const near = useNear('education', 1);
  const group = useRef<THREE.Group>(null);
  const plateRefs = useRef<(THREE.Mesh | null)[]>([]);
  const ringRefs = useRef<(THREE.Mesh | null)[]>([]);
  const glows = useRef<number[]>([]);
  const scope = useRef<THREE.Group>(null);
  const open = useOcean((s) => s.openDetail);
  const setHoverItem = useOcean((s) => s.setHoverItem);
  const cursor = useHoverCursor('OPEN');

  const plates = useMemo<Plate[]>(() => {
    const list: Plate[] = [
      ...EDUCATION_DATA.map((e, i) => ({
        key: `edu-${i}`, kind: 'education' as const, id: i, label: e.qualification.split('—')[0].trim(), color: i === 0 ? COLORS.cyan : COLORS.teal,
        pos: [0, 0, 0] as [number, number, number],
      })),
      { key: 'research', kind: 'research' as const, id: 'research', label: 'RESEARCH', color: '#5EEAD4', pos: [0, 0, 0] as [number, number, number] },
    ];
    list.forEach((p, i) => {
      const x = (i - (list.length - 1) / 2) * 4.4;
      p.pos = [x, 2.9 + (i % 2) * 0.6, 2.2 - Math.abs(x) * 0.14];
    });
    return list;
  }, []);

  const { geos, mats } = useMemo(() => {
    const dome = new THREE.SphereGeometry(9.5, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2);
    const lattice = new THREE.SphereGeometry(9.55, 14, 7, 0, Math.PI * 2, 0, Math.PI / 2);
    const floor = new THREE.CylinderGeometry(10.5, 11.2, 0.8, 12);
    const ring = new THREE.TorusGeometry(1.1, 0.02, 6, 48);
    const mats = plates.map(
      (p, i) =>
        new THREE.ShaderMaterial({
          vertexShader: holoVert,
          fragmentShader: holoFrag,
          uniforms: { uTime: shared.uTime, uGlow: { value: 0 }, uColor: { value: new THREE.Color(p.color) }, uSeed: { value: i * 3.7 } },
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        }),
    );
    return { geos: { dome, lattice, floor, ring }, mats };
  }, [plates]);
  useEffect(() => () => { Object.values(geos).forEach((g) => g.dispose()); mats.forEach((m) => m.dispose()); }, [geos, mats]);

  useFrame(({ clock }, dt) => {
    if (!group.current?.visible) return;
    const t = clock.elapsedTime * shared.uMotion.value;
    const st = useOcean.getState();
    plates.forEach((p, i) => {
      const hot = st.hoverItem === p.key || (st.detail && ((p.kind === 'research' && st.detail.kind === 'research') || (p.kind === 'education' && st.detail.kind === 'education' && st.detail.id === p.id)));
      glows.current[i] = (glows.current[i] ?? 0.2) + ((hot ? 1 : 0.2) - (glows.current[i] ?? 0.2)) * (1 - Math.exp(-5 * dt));
      mats[i].uniforms.uGlow.value = glows.current[i];
      const m = plateRefs.current[i];
      if (m) { m.position.y = p.pos[1] + Math.sin(t * 0.7 + i) * 0.15; m.scale.setScalar(1 + glows.current[i] * 0.08); }
      const r = ringRefs.current[i];
      if (r) r.rotation.z = t * 0.5 + i;
    });
    if (scope.current) scope.current.rotation.y = Math.sin(t * 0.15) * 0.5;
  });

  return (
    <group ref={group} position={EDUCATION_POS} visible={near}>
      <pointLight position={[0, 4, 4]} color="#22D3EE" intensity={110} distance={34} decay={2} />

      <mesh geometry={geos.floor} position={[0, -3.4, 0]}>
        <meshStandardMaterial color="#05223a" roughness={0.4} metalness={0.6} flatShading />
      </mesh>
      <mesh position={[0, -2.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[10, 0.05, 6, 96]} />
        <meshBasicMaterial color={COLORS.cyan} transparent opacity={0.8} />
      </mesh>
      <group position={[0, -3, 0]}>
        <mesh geometry={geos.dome}>
          <meshStandardMaterial color="#4fd8ee" transparent opacity={0.06} side={THREE.DoubleSide} depthWrite={false} roughness={0.1} emissive={COLORS.cyan} emissiveIntensity={0.15} />
        </mesh>
        <mesh geometry={geos.lattice}>
          <meshBasicMaterial color={COLORS.cyan} wireframe transparent opacity={0.28} />
        </mesh>
      </group>

      {/* research telescope at the back of the dome */}
      <group ref={scope} position={[0, -2.6, -5]}>
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.35, 0.6, 2.4, 6]} />
          <meshStandardMaterial color="#0a3a58" metalness={0.7} roughness={0.3} flatShading />
        </mesh>
        <mesh position={[0.6, 3, 0]} rotation={[0, 0, -0.9]}>
          <cylinderGeometry args={[0.35, 0.55, 3.2, 10]} />
          <meshStandardMaterial color="#0b4f71" metalness={0.6} roughness={0.3} emissive={COLORS.cyan} emissiveIntensity={0.25} />
        </mesh>
        <Halo position={[1.9, 4.2, 0]} scale={3} opacity={0.6} color="#5EEAD4" />
      </group>

      {plates.map((p, i) => (
        <group
          key={p.key}
          onPointerOver={(e) => { cursor.onPointerOver(e); setHoverItem(p.key); }}
          onPointerOut={() => { cursor.onPointerOut(); setHoverItem(null); }}
          onClick={(e) => {
            if (e.delta > 6) return;
            e.stopPropagation();
            open(p.kind === 'research' ? { kind: 'research' } : { kind: 'education', id: p.id });
          }}
        >
          <mesh ref={(el) => { plateRefs.current[i] = el; }} position={p.pos} material={mats[i]} rotation={[0, -p.pos[0] * 0.04, 0]}>
            <planeGeometry args={[3.9, 2.8]} />
          </mesh>
          <mesh ref={(el) => { ringRefs.current[i] = el; }} geometry={geos.ring} position={[p.pos[0], p.pos[1] - 1.9, p.pos[2]]} rotation={[Math.PI / 2.1, 0, 0]}>
            <meshBasicMaterial color={p.color} transparent opacity={0.6} />
          </mesh>
          <WorldLabel position={[p.pos[0], p.pos[1] + 2.1, p.pos[2]]} show={near} accent={p.color}>
            {p.label}
          </WorldLabel>
        </group>
      ))}
    </group>
  );
}
