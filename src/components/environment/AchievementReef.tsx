import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ACHIEVEMENTS_DATA } from '../../data/portfolioData';
import { ACHIEVEMENTS_POS } from '../../scene/zones';
import { useOcean } from '../../store/oceanStore';
import { shared } from '../../store/runtime';
import { Halo, WorldLabel, useHoverCursor, useNear, COLORS, rng } from './shared';
import { Seabed } from './Seabed';
import { useQuality } from '../../scene/QualityContext';

const dummy = new THREE.Object3D();
const tint = new THREE.Color();
const PALETTE = ['#14B8A6', '#22D3EE', '#5EEAD4', '#2DD4BF', '#67E8F9', '#0E9AA7'];

/** ACHIEVEMENTS — a bioluminescent coral reef; each achievement is a glowing pearl on a coral spire. */
export function AchievementReef() {
  const q = useQuality();
  const near = useNear('achievements', 1);
  const group = useRef<THREE.Group>(null);
  const corals = useRef<THREE.InstancedMesh>(null);
  const pearls = useRef<(THREE.Mesh | null)[]>([]);
  const glows = useRef<number[]>(ACHIEVEMENTS_DATA.map(() => 0.25));
  const open = useOcean((s) => s.openDetail);
  const setHoverItem = useOcean((s) => s.setHoverItem);
  const cursor = useHoverCursor('OPEN');
  const hoverItem = useOcean((s) => s.hoverItem);

  const { coralGeo, spireGeo, pearlPos } = useMemo(() => {
    // tapered branch with a vertex-colour gradient: dark base -> glowing tip
    const coralGeo = new THREE.ConeGeometry(0.28, 1, 6, 1, true);
    coralGeo.translate(0, 0.5, 0);
    const pos = coralGeo.attributes.position;
    const cols = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const k = THREE.MathUtils.clamp(pos.getY(i), 0, 1);
      const c = 0.12 + k * 0.95;
      cols.set([c, c, c], i * 3);
    }
    coralGeo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    const spireGeo = new THREE.CylinderGeometry(0.35, 0.8, 1, 7);
    spireGeo.translate(0, 0.5, 0);
    const pearlPos = ACHIEVEMENTS_DATA.map((_, i) => {
      const x = (i - (ACHIEVEMENTS_DATA.length - 1) / 2) * 7.5;
      return new THREE.Vector3(x, 5.2 + (i === 1 ? 1.4 : 0), 1.5 - Math.abs(x) * 0.08);
    });
    return { coralGeo, spireGeo, pearlPos };
  }, []);

  const count = q.coral;
  useEffect(() => {
    const m = corals.current;
    if (!m) return;
    const r = rng(11);
    let n = 0;
    while (n < count) {
      // clusters of leaning branches scattered over the reef shelf
      const cx = (r() - 0.5) * 38, cz = (r() - 0.5) * 22 - 4;
      const branches = 3 + Math.floor(r() * 3);
      const base = new THREE.Color(PALETTE[Math.floor(r() * PALETTE.length)]);
      const cl = 0.9 + r() * 2.4;
      for (let b = 0; b < branches && n < count; b++, n++) {
        const a = r() * Math.PI * 2;
        dummy.position.set(cx + Math.cos(a) * 0.5, -5.6, cz + Math.sin(a) * 0.5);
        dummy.rotation.set((r() - 0.5) * 0.7, a, (r() - 0.5) * 0.7);
        dummy.scale.set(0.8 + r() * 0.8, cl * (0.6 + r() * 0.9), 0.8 + r() * 0.8);
        dummy.updateMatrix();
        m.setMatrixAt(n, dummy.matrix);
        tint.copy(base);
        m.setColorAt(n, tint);
      }
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [count]);

  useEffect(() => () => { coralGeo.dispose(); spireGeo.dispose(); }, [coralGeo, spireGeo]);

  useFrame(({ clock }, dt) => {
    if (!group.current?.visible) return;
    const t = clock.elapsedTime * shared.uMotion.value;
    const st = useOcean.getState();
    ACHIEVEMENTS_DATA.forEach((_, i) => {
      const hot = st.hoverItem === `ach-${i}` || (st.detail?.kind === 'achievement' && st.detail.id === i);
      glows.current[i] += ((hot ? 1 : 0.25) - glows.current[i]) * (1 - Math.exp(-5 * dt));
      const p = pearls.current[i];
      if (p) {
        p.position.y = pearlPos[i].y + Math.sin(t * 0.8 + i * 2) * 0.25;
        p.scale.setScalar(0.9 + glows.current[i] * 0.3);
      }
    });
    // slow breathing of the whole reef glow
    if (corals.current) (corals.current.material as THREE.MeshBasicMaterial).opacity = 0.82 + Math.sin(t * 0.9) * 0.1;
  });

  const hovered = hoverItem?.startsWith('ach-') ? Number(hoverItem.slice(4)) : -1;

  return (
    <group ref={group} position={ACHIEVEMENTS_POS} visible={near}>
      <pointLight position={[0, 6, 6]} color="#14B8A6" intensity={300} distance={46} decay={2} />
      <Seabed y={-6} seed={3} color="#04202c" />
      <instancedMesh ref={corals} args={[coralGeo, undefined, count]} frustumCulled={false}>
        <meshBasicMaterial vertexColors transparent opacity={0.85} side={THREE.DoubleSide} />
      </instancedMesh>

      {ACHIEVEMENTS_DATA.map((a, i) => (
        <group
          key={a.title}
          onPointerOver={(e) => { cursor.onPointerOver(e); setHoverItem(`ach-${i}`); }}
          onPointerOut={() => { cursor.onPointerOut(); setHoverItem(null); }}
          onClick={(e) => { if (e.delta > 6) return; e.stopPropagation(); open({ kind: 'achievement', id: i }); }}
        >
          <mesh geometry={spireGeo} position={[pearlPos[i].x, -5.8, pearlPos[i].z]} scale={[0.75, pearlPos[i].y + 5.2, 0.75]}>
            <meshStandardMaterial color="#0b4f71" emissive={COLORS.teal} emissiveIntensity={0.35} flatShading roughness={0.6} />
          </mesh>
          <mesh ref={(el) => { pearls.current[i] = el; }} position={pearlPos[i]}>
            <sphereGeometry args={[0.95, 24, 16]} />
            <meshStandardMaterial color="#e8fbff" emissive={COLORS.cyan} emissiveIntensity={0.9} roughness={0.2} metalness={0.1} />
          </mesh>
          <Halo position={pearlPos[i].toArray()} scale={7} opacity={0.55} color={COLORS.cyan} />
          <mesh position={pearlPos[i]} rotation={[Math.PI / 2.4, 0, 0]}>
            <torusGeometry args={[1.6, 0.02, 6, 60]} />
            <meshBasicMaterial color={COLORS.white} transparent opacity={0.5} />
          </mesh>
          <mesh position={pearlPos[i]}>
            <sphereGeometry args={[2.2, 10, 8]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
          <WorldLabel position={[pearlPos[i].x, pearlPos[i].y + 2.3, pearlPos[i].z]} show={near}>
            {a.badge.toUpperCase()}
          </WorldLabel>
        </group>
      ))}
      <WorldLabel position={[pearlPos[Math.max(0, hovered)].x, pearlPos[Math.max(0, hovered)].y - 3.2, pearlPos[Math.max(0, hovered)].z]} show={hovered >= 0}>
        <span className="world-card">
          <strong>{ACHIEVEMENTS_DATA[Math.max(0, hovered)].title}</strong>
          <em>{ACHIEVEMENTS_DATA[Math.max(0, hovered)].date}</em>
          <span>{ACHIEVEMENTS_DATA[Math.max(0, hovered)].description}</span>
        </span>
      </WorldLabel>

    </group>
  );
}
