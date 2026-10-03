import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SKILLS_DATA } from '../../data/portfolioData';
import { SKILLS_POS } from '../../scene/zones';
import { useOcean } from '../../store/oceanStore';
import { shared } from '../../store/runtime';
import { Halo, WorldLabel, useNear, COLORS } from './shared';

const dummy = new THREE.Object3D();
const color = new THREE.Color();
const RX = 11.5;
const RZ = 7.5;

interface NodeRef { cat: string; skill: string; pod: number; local: THREE.Vector3; world: THREE.Vector3 }

/** SKILLS — an underwater research station: one glass pod per skill category, one glowing node per skill. */
export function SkillsLab() {
  const near = useNear('skills', 1);
  const group = useRef<THREE.Group>(null);
  const nodesMesh = useRef<THREE.InstancedMesh>(null);
  const pulses = useRef<THREE.InstancedMesh>(null);
  const hubRing = useRef<THREE.Mesh>(null);
  const tip = useRef<THREE.Group>(null);
  const holoRings = useRef<(THREE.Mesh | null)[]>([]);
  const podGlass = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const podRim = useRef<(THREE.MeshBasicMaterial | null)[]>([]);
  const glows = useRef<number[]>(SKILLS_DATA.map(() => 0.25));
  const nodeGlow = useRef<number[]>([]);
  const setHoverItem = useOcean((s) => s.setHoverItem);
  const setHoverCategory = useOcean((s) => s.setHoverCategory);
  const hoverItem = useOcean((s) => s.hoverItem);

  const { pods, nodes, geos, lineGeo } = useMemo(() => {
    const pods = SKILLS_DATA.map((c, i) => {
      const a = (i / SKILLS_DATA.length) * Math.PI * 2 - Math.PI / 2;
      return { cat: c.category, pos: new THREE.Vector3(Math.cos(a) * RX, 0, Math.sin(a) * RZ), count: c.skills.length };
    });
    const nodes: NodeRef[] = [];
    SKILLS_DATA.forEach((c, pi) => {
      c.skills.forEach((skill, k) => {
        const n = c.skills.length;
        const a = (k / n) * Math.PI * 2 + pi;
        const r = n > 6 ? 1.35 : 1.1;
        nodes.push({
          cat: c.category,
          skill,
          pod: pi,
          local: new THREE.Vector3(Math.cos(a) * r, -1.3 + (k / Math.max(1, n - 1)) * 3.0, Math.sin(a) * r),
          world: new THREE.Vector3(),
        });
      });
    });
    const cyl = new THREE.CylinderGeometry(2.2, 2.2, 5.4, 20, 1, true);
    const rimGeo = new THREE.TorusGeometry(2.2, 0.04, 6, 40);
    rimGeo.rotateX(Math.PI / 2);
    const base = new THREE.CylinderGeometry(2.5, 2.8, 0.5, 6);
    const lineGeo = new THREE.BufferGeometry();
    const arr = new Float32Array(pods.length * 6);
    pods.forEach((p, i) => arr.set([0, 1.2, 0, p.pos.x, 0.4, p.pos.z], i * 6));
    lineGeo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    return { pods, nodes, geos: { cyl, rimGeo, base }, lineGeo };
  }, []);
  useEffect(() => () => { Object.values(geos).forEach((g) => g.dispose()); lineGeo.dispose(); }, [geos, lineGeo]);

  // hovered node -> instance index (driven by 3D hover or the DOM skill list)
  const hoveredIndex = useMemo(
    () => (hoverItem ? nodes.findIndex((n) => `${n.cat}|${n.skill}` === hoverItem) : -1),
    [hoverItem, nodes],
  );

  useFrame(({ clock }, dt) => {
    if (!group.current?.visible) return;
    const t = clock.elapsedTime * shared.uMotion.value;
    const st = useOcean.getState();
    // pods
    pods.forEach((p, i) => {
      const hot = st.hoverCategory === p.cat || (st.hoverItem?.startsWith(p.cat + '|') ?? false);
      glows.current[i] += ((hot ? 1 : 0.25) - glows.current[i]) * (1 - Math.exp(-5 * dt));
      const g = glows.current[i];
      const gm = podGlass.current[i];
      if (gm) { gm.opacity = 0.07 + g * 0.12; gm.emissiveIntensity = 0.1 + g * 0.6; }
      const rm = podRim.current[i];
      if (rm) rm.opacity = 0.35 + g * 0.65;
      const hr = holoRings.current[i];
      if (hr) { hr.rotation.z = t * (0.4 + g) + i; hr.position.y = 3.4 + Math.sin(t + i) * 0.12; }
    });
    // nodes
    const m = nodesMesh.current;
    if (m) {
      nodes.forEach((n, i) => {
        const pod = pods[n.pod];
        const hot = i === hoveredIndex;
        nodeGlow.current[i] = (nodeGlow.current[i] ?? 0) + ((hot ? 1 : 0) - (nodeGlow.current[i] ?? 0)) * (1 - Math.exp(-8 * dt));
        const ng = nodeGlow.current[i];
        const ang = t * 0.35 + n.pod;
        const c = Math.cos(ang), s = Math.sin(ang);
        n.world.set(pod.pos.x + n.local.x * c - n.local.z * s, n.local.y + 2.3 + Math.sin(t * 0.9 + i) * 0.1, pod.pos.z + n.local.x * s + n.local.z * c);
        dummy.position.copy(n.world);
        dummy.scale.setScalar(0.2 + glows.current[n.pod] * 0.07 + ng * 0.16);
        dummy.updateMatrix();
        m.setMatrixAt(i, dummy.matrix);
        color.set(i % 2 ? COLORS.cyan : COLORS.teal).lerp(color.clone().set('#F8FAFC'), ng * 0.7);
        m.setColorAt(i, color);
      });
      m.instanceMatrix.needsUpdate = true;
      if (m.instanceColor) m.instanceColor.needsUpdate = true;
    }
    // data pulses along the spokes
    const pm = pulses.current;
    if (pm) {
      pods.forEach((p, i) => {
        const k = (t * 0.25 + i / pods.length) % 1;
        const out = k < 0.5 ? k * 2 : 1 - (k - 0.5) * 2;
        dummy.position.set(p.pos.x * out, 1.2 - 0.8 * out, p.pos.z * out);
        dummy.scale.setScalar(0.14);
        dummy.updateMatrix();
        pm.setMatrixAt(i, dummy.matrix);
      });
      pm.instanceMatrix.needsUpdate = true;
    }
    if (hubRing.current) hubRing.current.rotation.z = t * 0.3;
    if (tip.current && hoveredIndex >= 0) tip.current.position.copy(nodes[hoveredIndex].world).y += 0.9;
  });

  const hovered = hoveredIndex >= 0 ? nodes[hoveredIndex] : null;

  return (
    <group ref={group} position={SKILLS_POS} visible={near}>
      <pointLight position={[0, 6, 4]} color="#22D3EE" intensity={120} distance={36} decay={2} />

      {/* platform */}
      <mesh position={[0, -2.9, 0]} scale={[1.1, 1, 0.78]}>
        <cylinderGeometry args={[16, 17, 0.8, 8]} />
        <meshStandardMaterial color="#06223a" roughness={0.4} metalness={0.6} flatShading />
      </mesh>
      <mesh position={[0, -2.45, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[1.1, 0.78, 1]}>
        <torusGeometry args={[15.6, 0.05, 6, 96]} />
        <meshBasicMaterial color={COLORS.cyan} transparent opacity={0.7} />
      </mesh>

      {/* hub */}
      <group position={[0, 1.2, 0]}>
        <mesh>
          <icosahedronGeometry args={[1.5, 1]} />
          <meshStandardMaterial color="#0b4f71" emissive={COLORS.cyan} emissiveIntensity={0.5} wireframe />
        </mesh>
        <mesh scale={0.6}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color={COLORS.cyan} />
        </mesh>
        <mesh ref={hubRing} rotation={[Math.PI / 2.4, 0, 0]}>
          <torusGeometry args={[2.4, 0.03, 6, 72]} />
          <meshBasicMaterial color={COLORS.white} transparent opacity={0.6} />
        </mesh>
        <Halo scale={9} opacity={0.4} />
      </group>
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.5, 0.9, 3.4, 8]} />
        <meshStandardMaterial color="#0a3a58" metalness={0.7} roughness={0.3} flatShading />
      </mesh>

      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color={COLORS.cyan} transparent opacity={0.28} />
      </lineSegments>
      <instancedMesh ref={pulses} args={[undefined, undefined, pods.length]} frustumCulled={false}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshBasicMaterial color={COLORS.white} />
      </instancedMesh>

      {/* pods */}
      {pods.map((p, i) => (
        <group
          key={p.cat}
          position={p.pos}
          onPointerOver={(e) => { e.stopPropagation(); setHoverCategory(p.cat); }}
          onPointerOut={() => setHoverCategory(null)}
        >
          <mesh geometry={geos.base} position={[0, -2.45, 0]}>
            <meshStandardMaterial color="#08304c" metalness={0.6} roughness={0.3} flatShading />
          </mesh>
          <mesh geometry={geos.cyl} position={[0, 0.3, 0]}>
            <meshStandardMaterial
              ref={(el) => { podGlass.current[i] = el; }}
              color="#4fd8ee"
              emissive={COLORS.cyan}
              emissiveIntensity={0.1}
              transparent
              opacity={0.08}
              side={THREE.DoubleSide}
              depthWrite={false}
              roughness={0.1}
            />
          </mesh>
          <mesh geometry={geos.rimGeo} position={[0, 3, 0]}>
            <meshBasicMaterial ref={(el) => { podRim.current[i] = el; }} color={COLORS.cyan} transparent opacity={0.4} />
          </mesh>
          <mesh geometry={geos.rimGeo} position={[0, -2.2, 0]}>
            <meshBasicMaterial color={COLORS.cyan} transparent opacity={0.4} />
          </mesh>
          {/* holo display ring */}
          <mesh ref={(el) => { holoRings.current[i] = el; }} position={[0, 3.4, 0]} rotation={[Math.PI / 2.3, 0, 0]} scale={0.9}>
            <torusGeometry args={[1.3, 0.02, 6, 48]} />
            <meshBasicMaterial color={COLORS.white} transparent opacity={0.55} />
          </mesh>
          <WorldLabel position={[0, 4.6, 0]} show={near}>
            {p.cat.toUpperCase()} <b>{p.count}</b>
          </WorldLabel>
        </group>
      ))}

      <instancedMesh
        ref={nodesMesh}
        args={[undefined, undefined, nodes.length]}
        frustumCulled={false}
        onPointerMove={(e) => {
          e.stopPropagation();
          if (e.instanceId == null) return;
          const n = nodes[e.instanceId];
          setHoverItem(`${n.cat}|${n.skill}`);
          setHoverCategory(n.cat);
        }}
        onPointerOut={() => { setHoverItem(null); setHoverCategory(null); }}
      >
        <sphereGeometry args={[1, 12, 10]} />
        <meshBasicMaterial />
      </instancedMesh>
      <group ref={tip}>
        <WorldLabel position={[0, 0, 0]} show={!!hovered}>{hovered?.skill}</WorldLabel>
      </group>
    </group>
  );
}
