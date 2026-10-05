import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ABOUT_POS } from '../../scene/zones';
import { useOcean } from '../../store/oceanStore';
import { shared } from '../../store/runtime';
import { getGlowTexture } from '../../scene/glow';
import { PERSONAL_INFO } from '../../data/portfolioData';
import { WorldLabel, useHoverCursor, useNear } from './shared';

const holoVert = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const holoFrag = /* glsl */ `
uniform sampler2D uMap;
uniform float uHasMap;
uniform float uTime;
uniform float uGlow;
varying vec2 vUv;
void main() {
  vec3 tex = texture2D(uMap, vUv).rgb;
  float lum = dot(tex, vec3(0.299, 0.587, 0.114));
  vec3 base = mix(vec3(0.02, 0.1, 0.16), mix(vec3(0.05, 0.4, 0.55) * lum * 1.6, tex * 0.75, 0.3), uHasMap);
  float scan = 0.5 + 0.5 * sin(vUv.y * 240.0 - uTime * 2.0);
  base *= 0.82 + scan * 0.18;
  base += vec3(0.13, 0.83, 0.93) * smoothstep(0.02, 0.0, abs(fract(vUv.y * 6.0 - uTime * 0.12) - 0.5) - 0.495) * 0.4;
  vec2 e = min(vUv, 1.0 - vUv);
  float edge = smoothstep(0.0, 0.05, min(e.x, e.y));
  float frame = 1.0 - smoothstep(0.0, 0.012, min(e.x, e.y));
  vec3 col = base + vec3(0.13, 0.83, 0.93) * frame * (0.8 + uGlow);
  gl_FragColor = vec4(col, (0.55 + 0.25 * uGlow) * edge + frame);
}`;

/** ABOUT — a floating glass platform with a holographic profile slab. */
export function AboutIsland() {
  const group = useRef<THREE.Group>(null);
  const holo = useRef<THREE.Mesh>(null);
  const rim = useRef<THREE.MeshBasicMaterial>(null);
  const pad = useRef<THREE.MeshBasicMaterial>(null);
  const glow = useRef(0.25);
  const near = useNear('about', 1);
  const hoverItem = useOcean((s) => s.setHoverItem);
  const open = useOcean((s) => s.openDetail);
  const cursor = useHoverCursor('OPEN');
  const detailOpen = useOcean((s) => s.detail?.kind === 'about');

  const { disc, under, ring, edges, holoMat, tex } = useMemo(() => {
    const disc = new THREE.CylinderGeometry(5.8, 5.2, 0.8, 10);
    const under = new THREE.ConeGeometry(5.2, 6.5, 10);
    under.rotateX(Math.PI);
    const ring = new THREE.TorusGeometry(5.6, 0.05, 6, 80);
    ring.rotateX(Math.PI / 2);
    const edges = new THREE.EdgesGeometry(disc);
    const tex = new THREE.Texture();
    const holoMat = new THREE.ShaderMaterial({
      vertexShader: holoVert,
      fragmentShader: holoFrag,
      uniforms: { uMap: { value: tex }, uHasMap: { value: 0 }, uTime: shared.uTime, uGlow: { value: 0 } },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    return { disc, under, ring, edges, holoMat, tex };
  }, []);

  // profile photo is the only asset; load it lazily and fall back to a plain hologram
  useEffect(() => {
    let live = true;
    new THREE.TextureLoader().load(
      PERSONAL_INFO.profileImage,
      (t) => {
        if (!live) return;
        t.colorSpace = THREE.SRGBColorSpace;
        holoMat.uniforms.uMap.value = t;
        holoMat.uniforms.uHasMap.value = 1;
      },
      undefined,
      () => undefined,
    );
    return () => { live = false; };
  }, [holoMat]);
  useEffect(() => () => {
    disc.dispose(); under.dispose(); ring.dispose(); edges.dispose(); holoMat.dispose(); tex.dispose();
    (holoMat.uniforms.uMap.value as THREE.Texture).dispose();
  }, [disc, under, ring, edges, holoMat, tex]);

  const hovered = useRef(false);
  useFrame(({ clock }, dt) => {
    const active = useOcean.getState().active === 'about';
    const target = hovered.current || detailOpen ? 1 : active ? 0.55 : 0.2;
    glow.current += (target - glow.current) * (1 - Math.exp(-4 * dt));
    const t = clock.elapsedTime * shared.uMotion.value;
    const g = group.current;
    if (g) {
      g.position.y = ABOUT_POS.y + Math.sin(t * 0.55) * 0.25;
      g.rotation.y = Math.sin(t * 0.12) * 0.06;
    }
    if (holo.current) {
      holo.current.position.y = 4.2 + Math.sin(t * 0.8) * 0.12 + glow.current * 0.25;
      holo.current.scale.setScalar(1 + glow.current * 0.06);
    }
    holoMat.uniforms.uGlow.value = glow.current;
    if (rim.current) rim.current.opacity = 0.35 + glow.current * 0.65;
    if (pad.current) pad.current.opacity = 0.12 + glow.current * 0.5;
  });

  const padMap = useMemo(() => getGlowTexture(), []);

  return (
    <>
      <mesh position={[ABOUT_POS.x, 0.9, ABOUT_POS.z]} rotation={[-Math.PI / 2, 0, 0]} scale={[22, 22, 1]} renderOrder={1}>
        <planeGeometry />
        <meshBasicMaterial ref={pad} map={padMap} color="#22D3EE" transparent opacity={0.2} depthWrite={false} blending={THREE.AdditiveBlending} fog={false} />
      </mesh>
      <group
        ref={group}
        position={ABOUT_POS}
        onPointerOver={(e) => { cursor.onPointerOver(e); hovered.current = true; hoverItem('about'); }}
        onPointerOut={() => { cursor.onPointerOut(); hovered.current = false; hoverItem(null); }}
        onClick={(e) => { if (e.delta > 6) return; e.stopPropagation(); open({ kind: 'about' }); }}
      >
        <mesh geometry={disc}>
          <meshStandardMaterial color="#0b3a5a" roughness={0.4} metalness={0.4} flatShading emissive="#22D3EE" emissiveIntensity={0.16} />
        </mesh>
        <lineSegments geometry={edges}>
          <lineBasicMaterial color="#22D3EE" transparent opacity={0.5} />
        </lineSegments>
        <mesh geometry={under} position={[0, -3.65, 0]}>
          <meshStandardMaterial color="#061f35" roughness={0.6} metalness={0.3} flatShading />
        </mesh>
        <mesh geometry={ring} position={[0, 0.4, 0]}>
          <meshBasicMaterial ref={rim} color="#22D3EE" transparent opacity={0.4} />
        </mesh>

        <mesh ref={holo} position={[0, 4.2, 0]} material={holoMat}>
          <planeGeometry args={[3.6, 4.8]} />
        </mesh>
        {/* holo pedestal + orbiting data ring */}
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[1.4, 1.8, 0.9, 6]} />
          <meshStandardMaterial color="#0a3a58" metalness={0.7} roughness={0.25} emissive="#22D3EE" emissiveIntensity={0.15} flatShading />
        </mesh>
        <OrbitRing />
        {/* a couple of small lit "structures" to give the platform scale */}
        {[[-3.4, 0.8, 1.6, 0.5], [3.6, 0.9, 1.2, 0.7], [2.2, 0.7, -3, 0.4]].map(([x, y, z, s], i) => (
          <mesh key={i} position={[x, y, z]} scale={s}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#0b4f71" emissive="#14B8A6" emissiveIntensity={0.5} flatShading />
          </mesh>
        ))}
        <mesh position={[0, 2.5, 0]}>
          <sphereGeometry args={[6.4, 12, 8]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        <WorldLabel position={[0, 8.2, 0]} show={near && !detailOpen}>
          ABOUT THE EXPLORER
        </WorldLabel>
      </group>
    </>
  );
}

function OrbitRing() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.elapsedTime * 0.3 * shared.uMotion.value;
    }
  });
  return (
    <mesh ref={ref} position={[0, 3.2, 0]} rotation={[Math.PI / 2.2, 0.2, 0]}>
      <torusGeometry args={[3.1, 0.018, 6, 100]} />
      <meshBasicMaterial color="#22D3EE" transparent opacity={0.55} />
    </mesh>
  );
}
