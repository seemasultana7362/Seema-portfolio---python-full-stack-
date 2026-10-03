import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useIsland } from './ProjectIsland';
import { shared } from '../../store/runtime';
import { getGlowTexture } from '../../scene/glow';

const dummy = new THREE.Object3D();
const col = new THREE.Color();

function useDispose(...items: { dispose: () => void }[]) {
  useEffect(() => () => items.forEach((i) => i.dispose()), []); // eslint-disable-line react-hooks/exhaustive-deps
}

/* ─────────────────────────────────────────────────────────────────────────
 * Mulberry Shades — a MERN-stack tower: four rotating hex layers with a
 * light spine, which spread apart as attention increases.
 * ───────────────────────────────────────────────────────────────────────── */
export function MernTower() {
  const { glow, accent } = useIsland();
  const layers = useRef<(THREE.Group | null)[]>([]);
  const beam = useRef<THREE.Mesh>(null);
  const radii = [2.8, 2.3, 1.8, 1.3];
  const geo = useMemo(() => new THREE.CylinderGeometry(1, 1, 0.2, 6), []);
  const edges = useMemo(() => new THREE.EdgesGeometry(geo), [geo]);
  useDispose(geo, edges);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * shared.uMotion.value;
    const spread = 1 + glow.current * 0.55;
    layers.current.forEach((g, i) => {
      if (!g) return;
      g.position.y = 0.6 + i * 0.85 * spread;
      g.rotation.y = t * 0.25 * (i % 2 ? -1 : 1) + i;
    });
    if (beam.current) {
      const m = beam.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.25 + 0.2 * Math.sin(t * 2) + glow.current * 0.4;
      beam.current.scale.y = 1 + glow.current * 0.55;
    }
  });

  return (
    <group>
      {radii.map((r, i) => (
        <group key={i} ref={(el) => { layers.current[i] = el; }} scale={[r, 1, r]}>
          <mesh geometry={geo}>
            <meshStandardMaterial color="#0a3a58" roughness={0.25} metalness={0.7} transparent opacity={0.85} emissive={accent} emissiveIntensity={0.12 + i * 0.05} />
          </mesh>
          <lineSegments geometry={edges}>
            <lineBasicMaterial color={accent} transparent opacity={0.9} />
          </lineSegments>
        </group>
      ))}
      <mesh ref={beam} position={[0, 2.4, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 4.6, 8]} />
        <meshBasicMaterial color={accent} transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Federated IoT — clients orbit a central aggregation server; update pulses
 * travel up to the server and the global model comes back down.
 * ───────────────────────────────────────────────────────────────────────── */
const CLIENTS = 9;
export function FederatedNetwork() {
  const { glow, accent } = useIsland();
  const clients = useRef<THREE.InstancedMesh>(null);
  const pulses = useRef<THREE.InstancedMesh>(null);
  const lines = useRef<THREE.LineSegments>(null);
  const server = useRef<THREE.Group>(null);
  const cPos = useMemo(() => Array.from({ length: CLIENTS }, () => new THREE.Vector3()), []);
  const lineGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(CLIENTS * 6), 3));
    return g;
  }, []);
  const ico = useMemo(() => new THREE.IcosahedronGeometry(0.95, 1), []);
  useDispose(lineGeo, ico);
  const center = new THREE.Vector3(0, 2.4, 0);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * shared.uMotion.value;
    const g = glow.current;
    const arr = lineGeo.attributes.position.array as Float32Array;
    for (let i = 0; i < CLIENTS; i++) {
      const a = (i / CLIENTS) * Math.PI * 2 + t * 0.22;
      const r = 3.1 + Math.sin(i * 2.3) * 0.5;
      const y = 2.4 + Math.sin(a * 2 + i) * 1.1;
      cPos[i].set(Math.cos(a) * r, y, Math.sin(a) * r);
      arr.set([cPos[i].x, cPos[i].y, cPos[i].z, center.x, center.y, center.z], i * 6);
      dummy.position.copy(cPos[i]);
      dummy.rotation.set(t * 0.5 + i, t * 0.4, 0);
      dummy.scale.setScalar(0.34 + g * 0.1);
      dummy.updateMatrix();
      clients.current?.setMatrixAt(i, dummy.matrix);
      // update pulse (up) then model broadcast (down)
      const ph = (t * (0.35 + g * 0.35) + i / CLIENTS) % 1;
      const up = ph < 0.5;
      const k = up ? ph * 2 : 1 - (ph - 0.5) * 2;
      dummy.position.lerpVectors(cPos[i], center, up ? k : 1 - k);
      dummy.scale.setScalar(0.12 + 0.05 * g);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();
      pulses.current?.setMatrixAt(i, dummy.matrix);
      col.set(up ? accent : '#F8FAFC');
      pulses.current?.setColorAt(i, col);
    }
    if (clients.current) clients.current.instanceMatrix.needsUpdate = true;
    if (pulses.current) {
      pulses.current.instanceMatrix.needsUpdate = true;
      if (pulses.current.instanceColor) pulses.current.instanceColor.needsUpdate = true;
    }
    lineGeo.attributes.position.needsUpdate = true;
    if (lines.current) (lines.current.material as THREE.LineBasicMaterial).opacity = 0.18 + g * 0.35;
    if (server.current) { server.current.rotation.y = t * 0.4; server.current.scale.setScalar(1 + g * 0.12 + Math.sin(t * 2) * 0.02); }
  });

  return (
    <group>
      <group ref={server} position={[0, 2.4, 0]}>
        <mesh geometry={ico}>
          <meshStandardMaterial color="#0b4f71" emissive={accent} emissiveIntensity={0.5} wireframe />
        </mesh>
        <mesh scale={0.45}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color={accent} />
        </mesh>
      </group>
      <instancedMesh ref={clients} args={[undefined, undefined, CLIENTS]} frustumCulled={false}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#0f6b8e" emissive={accent} emissiveIntensity={0.35} flatShading />
      </instancedMesh>
      <instancedMesh ref={pulses} args={[undefined, undefined, CLIENTS]} frustumCulled={false}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshBasicMaterial />
      </instancedMesh>
      <lineSegments ref={lines} geometry={lineGeo} frustumCulled={false}>
        <lineBasicMaterial color={accent} transparent opacity={0.25} />
      </lineSegments>
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Customer Churn — ranked importance bars (the explainability story) with a
 * decision plane floating through them.
 * ───────────────────────────────────────────────────────────────────────── */
const BARS = 12;
const BAR_H = [3.3, 2.7, 2.2, 1.85, 1.5, 1.25, 1.0, 0.82, 0.66, 0.5, 0.38, 0.28];
export function ImportanceBars() {
  const { glow, accent } = useIsland();
  const bars = useRef<THREE.InstancedMesh>(null);
  const ring = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (!bars.current) return;
    for (let i = 0; i < BARS; i++) {
      col.set(accent).lerp(new THREE.Color('#0B4F71'), i / BARS * 0.85);
      bars.current.setColorAt(i, col);
    }
    if (bars.current.instanceColor) bars.current.instanceColor.needsUpdate = true;
  }, [accent]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * shared.uMotion.value;
    const g = glow.current;
    for (let i = 0; i < BARS; i++) {
      const a = (i / (BARS - 1) - 0.5) * Math.PI * 1.25;
      const h = BAR_H[i] * (1 + g * 0.18 + Math.sin(t * 1.2 + i * 0.7) * 0.04);
      dummy.position.set(Math.sin(a) * 3.1, h / 2, -Math.cos(a) * 1.6 + 1.6);
      dummy.rotation.set(0, -a * 0.6, 0);
      dummy.scale.set(0.46, h, 0.46);
      dummy.updateMatrix();
      bars.current?.setMatrixAt(i, dummy.matrix);
    }
    if (bars.current) bars.current.instanceMatrix.needsUpdate = true;
    if (ring.current) {
      ring.current.position.y = 1.9 + Math.sin(t * 0.7) * 0.35;
      ring.current.rotation.z = t * 0.2;
      (ring.current.material as THREE.MeshBasicMaterial).opacity = 0.3 + g * 0.5;
    }
  });

  return (
    <group>
      <instancedMesh ref={bars} args={[undefined, undefined, BARS]} frustumCulled={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffffff" roughness={0.25} metalness={0.5} emissive="#0a7f95" emissiveIntensity={0.35} />
      </instancedMesh>
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.6, 0.03, 6, 72]} />
        <meshBasicMaterial color={accent} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * DOC-CHAT-AI — fanned document pages, a retrieval scan, and a citation pin
 * that locks onto one row at a time.
 * ───────────────────────────────────────────────────────────────────────── */
const PAGES = 5;
const ROWS = 8;
export function CitedPages() {
  const { glow, accent } = useIsland();
  const pages = useRef<THREE.Group>(null);
  const rows = useRef<THREE.InstancedMesh>(null);
  const scan = useRef<THREE.Mesh>(null);
  const pin = useRef<THREE.Mesh>(null);
  const glowTex = useMemo(() => getGlowTexture(), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * shared.uMotion.value;
    const g = glow.current;
    if (pages.current) pages.current.rotation.y = Math.sin(t * 0.3) * 0.12 + g * 0.2;
    const hot = Math.floor(t * 0.8) % ROWS;
    let n = 0;
    for (let p = 0; p < PAGES; p++) {
      for (let r = 0; r < ROWS; r++) {
        const isHot = p === 2 && r === hot;
        const ang = (p - (PAGES - 1) / 2) * 0.26;
        const y = 0.85 + (3.1 / ROWS) * (ROWS - r - 0.5);
        dummy.position.set(Math.sin(ang) * 3.2, y, -Math.cos(ang) * 3.2 + 3.2 + 0.04);
        dummy.scale.set(isHot ? 1.7 : 0.9 + ((r * 7 + p * 3) % 5) * 0.25, isHot ? 0.1 : 0.05, 0.02);
        dummy.rotation.set(0, -ang, 0);
        dummy.updateMatrix();
        rows.current?.setMatrixAt(n, dummy.matrix);
        col.set(isHot ? '#F8FAFC' : accent).multiplyScalar(isHot ? 1 : 0.6);
        rows.current?.setColorAt(n, col);
        n++;
      }
    }
    if (rows.current) {
      rows.current.instanceMatrix.needsUpdate = true;
      if (rows.current.instanceColor) rows.current.instanceColor.needsUpdate = true;
    }
    if (scan.current) {
      scan.current.position.y = 0.9 + ((t * 0.55) % 1) * 3.1;
      (scan.current.material as THREE.MeshBasicMaterial).opacity = 0.18 + g * 0.3;
    }
    if (pin.current) {
      pin.current.position.set(0, 0.85 + (3.1 / ROWS) * (ROWS - hot - 0.5), 0.9 + Math.sin(t * 3) * 0.05);
    }
  });

  const pageGeo = useMemo(() => new THREE.BoxGeometry(2.3, 3.1, 0.05), []);
  const pageEdges = useMemo(() => new THREE.EdgesGeometry(pageGeo), [pageGeo]);
  useDispose(pageGeo, pageEdges);

  return (
    <group>
      <group ref={pages} position={[0, 0, 0]}>
        {Array.from({ length: PAGES }, (_, p) => {
          const ang = (p - (PAGES - 1) / 2) * 0.26;
          return (
            <group key={p} position={[Math.sin(ang) * 3.2, 2.4, -Math.cos(ang) * 3.2 + 3.2]} rotation={[0, -ang, 0]}>
              <mesh geometry={pageGeo}>
                <meshStandardMaterial color="#0a3a58" transparent opacity={0.55} roughness={0.2} metalness={0.4} emissive={accent} emissiveIntensity={0.08} />
              </mesh>
              <lineSegments geometry={pageEdges}>
                <lineBasicMaterial color={accent} transparent opacity={0.55} />
              </lineSegments>
            </group>
          );
        })}
        <instancedMesh ref={rows} args={[undefined, undefined, PAGES * ROWS]} position={[0, 0, 0]} frustumCulled={false}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial transparent opacity={0.9} />
        </instancedMesh>
      </group>
      <mesh ref={scan} position={[0, 2, 1.6]}>
        <boxGeometry args={[6.6, 0.05, 1.8]} />
        <meshBasicMaterial color={accent} transparent opacity={0.25} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh ref={pin}>
        <sphereGeometry args={[0.13, 10, 8]} />
        <meshBasicMaterial color="#F8FAFC" />
      </mesh>
      <sprite position={[0, 2.4, 1.2]} scale={[5, 5, 1]}>
        <spriteMaterial map={glowTex} color={accent} transparent opacity={0.12 + 0} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
    </group>
  );
}
