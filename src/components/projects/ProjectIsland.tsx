import { createContext, useContext, useEffect, useMemo, useRef, type MutableRefObject, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PROJECT_POS } from '../../scene/zones';
import { ISLAND_THEME } from '../../scene/projectIslands';
import { useOcean } from '../../store/oceanStore';
import { shared } from '../../store/runtime';
import { getGlowTexture } from '../../scene/glow';
import { WorldLabel, useNear } from '../environment/shared';

interface IslandCtxValue {
  /** 0..1 eased "attention" on this island: hover / selected / idle */
  glow: MutableRefObject<number>;
  accent: string;
  index: number;
}
const IslandCtx = createContext<IslandCtxValue | null>(null);
export const useIsland = () => {
  const c = useContext(IslandCtx);
  if (!c) throw new Error('useIsland outside ProjectIsland');
  return c;
};

/** Shared floating platform; the per-project visual metaphor is passed as children. */
export function ProjectIsland({ index, id, children }: { index: number; id: string; children: ReactNode }) {
  const pos = PROJECT_POS[index];
  const theme = ISLAND_THEME[id];
  const group = useRef<THREE.Group>(null);
  const glow = useRef(0.18);
  const rimMat = useRef<THREE.MeshBasicMaterial>(null);
  const pad = useRef<THREE.MeshBasicMaterial>(null);
  const near = useNear('projects', 1);
  const select = useOcean((s) => s.selectProject);
  const hover = useOcean((s) => s.hoverProject);
  const setCursor = useOcean((s) => s.setCursor);
  const label = useOcean((s) => s.selectedProject !== id);

  const { disc, under, rim, edges, padMap } = useMemo(() => {
    const disc = new THREE.CylinderGeometry(4.7, 4.3, 0.7, 8);
    const under = new THREE.ConeGeometry(4.3, 5.6, 8);
    under.rotateX(Math.PI);
    const rim = new THREE.TorusGeometry(4.55, 0.045, 6, 64);
    rim.rotateX(Math.PI / 2);
    const edges = new THREE.EdgesGeometry(disc);
    return { disc, under, rim, edges, padMap: getGlowTexture() };
  }, []);
  useEffect(() => () => { disc.dispose(); under.dispose(); rim.dispose(); edges.dispose(); }, [disc, under, rim, edges]);

  useFrame(({ clock }, dt) => {
    const st = useOcean.getState();
    const target = st.selectedProject === id ? 1 : st.hoveredProject === id ? 0.65 : st.selectedProject ? 0.05 : 0.2;
    glow.current += (target - glow.current) * (1 - Math.exp(-4 * dt));
    const g = group.current;
    if (!g) return;
    const t = clock.elapsedTime * shared.uMotion.value;
    g.position.y = pos.y + Math.sin(t * 0.6 + index * 1.7) * 0.28;
    g.rotation.y = Math.sin(t * 0.15 + index) * 0.08;
    const s = 1 + glow.current * 0.04;
    g.scale.setScalar(s);
    if (rimMat.current) rimMat.current.opacity = 0.35 + glow.current * 0.65;
    if (pad.current) pad.current.opacity = 0.12 + glow.current * 0.5;
  });

  return (
    <IslandCtx.Provider value={{ glow, accent: theme.accent, index }}>
      {/* light pooled on the water beneath the island */}
      <mesh position={[pos.x, 0.9, pos.z]} rotation={[-Math.PI / 2, 0, 0]} scale={[17, 17, 1]} renderOrder={1}>
        <planeGeometry />
        <meshBasicMaterial ref={pad} map={padMap} color={theme.accent} transparent opacity={0.2} depthWrite={false} blending={THREE.AdditiveBlending} fog={false} />
      </mesh>

      <group
        ref={group}
        position={pos}
        onPointerOver={(e) => { e.stopPropagation(); hover(id); setCursor('EXPLORE'); }}
        onPointerOut={() => { hover(null); setCursor(null); }}
        onClick={(e) => { if (e.delta > 6) return; e.stopPropagation(); select(id); }}
      >
        <mesh geometry={disc}>
          <meshStandardMaterial color="#0b3a5a" roughness={0.4} metalness={0.4} flatShading emissive={theme.accent} emissiveIntensity={0.16} />
        </mesh>
        <lineSegments geometry={edges}>
          <lineBasicMaterial color={theme.accent} transparent opacity={0.5} />
        </lineSegments>
        <mesh geometry={under} position={[0, -3.15, 0]}>
          <meshStandardMaterial color="#061f35" roughness={0.6} metalness={0.3} flatShading />
        </mesh>
        <mesh geometry={rim} position={[0, 0.36, 0]}>
          <meshBasicMaterial ref={rimMat} color={theme.accent} transparent opacity={0.4} />
        </mesh>
        <group position={[0, 0.36, 0]}>{children}</group>
        {/* generous invisible hit area */}
        <mesh position={[0, 2.2, 0]}>
          <sphereGeometry args={[5.4, 12, 8]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        <WorldLabel position={[0, 7.4, 0]} accent={theme.accent} show={near && label}>
          {theme.short}
        </WorldLabel>
      </group>
    </IslandCtx.Provider>
  );
}
