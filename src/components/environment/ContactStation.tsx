import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CONTACT_POS } from '../../scene/zones';
import { useOcean } from '../../store/oceanStore';
import { shared } from '../../store/runtime';
import { Halo, WorldLabel, useHoverCursor, useNear, COLORS, rng } from './shared';
import { Seabed } from './Seabed';

const dummy = new THREE.Object3D();
const BURST = 3.4; // seconds
const TOP = 7.5;

/** CONTACT — the deepest point: a communication station with a live signal array and a "transmission" burst. */
export function ContactStation() {
  const near = useNear('contact', 1);
  const group = useRef<THREE.Group>(null);
  const dish = useRef<THREE.Group>(null);
  const signal = useRef<(THREE.Mesh | null)[]>([]);
  const burstRings = useRef<(THREE.Mesh | null)[]>([]);
  const beam = useRef<THREE.Mesh>(null);
  const packet = useRef<THREE.Mesh>(null);
  const masts = useRef<THREE.InstancedMesh>(null);
  const core = useRef<THREE.MeshBasicMaterial>(null);
  const glow = useRef(0.25);
  const hovered = useRef(false);
  const burstStart = useRef(-100);
  const lastTransmit = useRef(0);
  const open = useOcean((s) => s.openDetail);
  const cursor = useHoverCursor('OPEN');
  const isActive = useOcean((s) => s.active === 'contact');
  const detailOpen = useOcean((s) => s.detail?.kind === 'contact');

  const ringGeo = useMemo(() => {
    const g = new THREE.TorusGeometry(1, 0.025, 6, 80);
    g.rotateX(Math.PI / 2);
    return g;
  }, []);
  useEffect(() => () => ringGeo.dispose(), [ringGeo]);

  useEffect(() => {
    const m = masts.current;
    if (!m) return;
    const r = rng(5);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const h = 4 + r() * 4;
      dummy.position.set(Math.cos(a) * 8.5, -7 + h / 2, Math.sin(a) * 8.5);
      dummy.scale.set(0.18, h, 0.18);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame(({ clock }, dt) => {
    if (!group.current?.visible) return;
    const t = clock.elapsedTime * shared.uMotion.value;
    const now = clock.elapsedTime;
    const st = useOcean.getState();
    if (st.transmit !== lastTransmit.current) { lastTransmit.current = st.transmit; burstStart.current = now; }

    const active = st.active === 'contact';
    const target = hovered.current || detailOpen ? 1 : active ? 0.55 : 0.2;
    glow.current += (target - glow.current) * (1 - Math.exp(-4 * dt));
    if (dish.current) dish.current.rotation.y = t * 0.4;
    if (core.current) core.current.opacity = 0.6 + glow.current * 0.4;

    // continuous low-key signal rings
    signal.current.forEach((m, i) => {
      if (!m) return;
      const k = ((t * 0.18 + i / 3) % 1);
      m.scale.setScalar(2 + k * 12);
      (m.material as THREE.MeshBasicMaterial).opacity = (1 - k) * (0.25 + glow.current * 0.4);
    });

    // transmission burst: packet shoots to the surface, rings flare
    const b = (now - burstStart.current) / BURST;
    const on = b >= 0 && b < 1;
    if (beam.current) {
      beam.current.visible = on;
      if (on) {
        const e = 1 - Math.pow(1 - Math.min(1, b * 1.6), 3);
        const len = 140 * e;
        beam.current.scale.set(1, Math.max(0.01, len), 1);
        beam.current.position.y = TOP + len / 2;
        (beam.current.material as THREE.MeshBasicMaterial).opacity = (1 - b) * 0.55;
      }
    }
    if (packet.current) {
      packet.current.visible = on;
      if (on) {
        const e = 1 - Math.pow(1 - Math.min(1, b * 1.6), 3);
        packet.current.position.y = TOP + 140 * e;
      }
    }
    burstRings.current.forEach((m, i) => {
      if (!m) return;
      const k = THREE.MathUtils.clamp((now - burstStart.current - i * 0.25) / 1.8, 0, 1);
      m.visible = k > 0 && k < 1;
      m.scale.setScalar(1 + k * 16);
      (m.material as THREE.MeshBasicMaterial).opacity = (1 - k) * 0.8;
    });
  });

  return (
    <group ref={group} position={CONTACT_POS} visible={near}>
      <pointLight position={[0, 6, 6]} color="#22D3EE" intensity={380} distance={46} decay={2} />
      <Seabed y={-7.4} seed={9} color="#041a27" />

      <mesh position={[0, -7, 0]} onClick={undefined}>
        <cylinderGeometry args={[11, 12, 0.7, 10]} />
        <meshStandardMaterial color="#05233a" metalness={0.6} roughness={0.35} flatShading />
      </mesh>
      <mesh position={[0, -6.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[10.6, 0.05, 6, 96]} />
        <meshBasicMaterial color={COLORS.cyan} transparent opacity={0.75} />
      </mesh>

      <instancedMesh ref={masts} args={[undefined, undefined, 8]} frustumCulled={false}>
        <cylinderGeometry args={[1, 1, 1, 6]} />
        <meshStandardMaterial color="#0a3a58" metalness={0.7} roughness={0.3} emissive={COLORS.teal} emissiveIntensity={0.25} />
      </instancedMesh>

      <group
        onPointerOver={(e) => { cursor.onPointerOver(e); hovered.current = true; }}
        onPointerOut={() => { cursor.onPointerOut(); hovered.current = false; }}
        onClick={(e) => { if (e.delta > 6) return; e.stopPropagation(); open({ kind: 'contact' }); }}
      >
        {/* spire */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.7, 1.7, 14.4, 8]} />
          <meshStandardMaterial color="#0a3a58" metalness={0.6} roughness={0.3} flatShading emissive={COLORS.cyan} emissiveIntensity={0.3} />
        </mesh>
        {[-4.5, -1.5, 1.5, 4.5].map((y) => (
          <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} scale={1.15 - (y + 4.5) * 0.045}>
            <torusGeometry args={[1.25, 0.05, 6, 32]} />
            <meshBasicMaterial color={COLORS.cyan} transparent opacity={0.8} />
          </mesh>
        ))}
        {/* rotating transceiver array */}
        <group ref={dish} position={[0, TOP - 0.5, 0]}>
          <mesh rotation={[0, 0, Math.PI]} position={[1.6, 0, 0]}>
            <coneGeometry args={[1.4, 0.8, 16, 1, true]} />
            <meshStandardMaterial color="#0b4f71" emissive={COLORS.cyan} emissiveIntensity={0.35} side={THREE.DoubleSide} metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[1.6, -0.1, 0]}>
            <sphereGeometry args={[0.2, 10, 8]} />
            <meshBasicMaterial color={COLORS.white} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI]} position={[-1.6, 0, 0]}>
            <coneGeometry args={[1.0, 0.6, 16, 1, true]} />
            <meshStandardMaterial color="#0b4f71" emissive={COLORS.teal} emissiveIntensity={0.35} side={THREE.DoubleSide} metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
        <mesh position={[0, TOP + 0.9, 0]}>
          <icosahedronGeometry args={[0.55, 1]} />
          <meshBasicMaterial ref={core} color={COLORS.cyan} transparent opacity={0.8} />
        </mesh>
        <Halo position={[0, TOP + 0.9, 0]} scale={9} opacity={0.6} />
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[3.2, 3.2, 17, 8]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>

      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(el) => { signal.current[i] = el; }} geometry={ringGeo} position={[0, TOP + 0.9, 0]}>
          <meshBasicMaterial color={COLORS.cyan} transparent opacity={0.3} depthWrite={false} />
        </mesh>
      ))}
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(el) => { burstRings.current[i] = el; }} geometry={ringGeo} position={[0, TOP + 0.9, 0]} visible={false}>
          <meshBasicMaterial color={COLORS.white} transparent opacity={0.8} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
      <mesh ref={beam} position={[0, TOP, 0]} visible={false}>
        <cylinderGeometry args={[0.18, 0.18, 1, 8, 1, true]} />
        <meshBasicMaterial color={COLORS.cyan} transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={packet} position={[0, TOP, 0]} visible={false}>
        <sphereGeometry args={[0.6, 12, 10]} />
        <meshBasicMaterial color={COLORS.white} />
      </mesh>

      <WorldLabel position={[0, TOP + 4.2, 0]} show={isActive && !detailOpen}>
        LET'S CONNECT FROM THE DEEP
      </WorldLabel>
    </group>
  );
}
