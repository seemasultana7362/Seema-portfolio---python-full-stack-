import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { runtime } from '../store/runtime';
import { useOcean } from '../store/oceanStore';
import { PROJECT_POS, ABOUT_POS, journeyPose, projectFocusPose, type Pose } from './zones';
import { PROJECT_IDS } from './projectIslands';
import { useQuality } from './QualityContext';

const UP = new THREE.Vector3(0, 1, 0);
const posT = new THREE.Vector3();
const lookT = new THREE.Vector3();
const rel = new THREE.Vector3();
const axis = new THREE.Vector3();

/**
 * Cinematic camera rig. The target pose comes from page-scroll progress (guided
 * journey) or from a focused project island; the real camera is damped toward
 * it so nothing ever teleports. Dragging adds a free-orbit offset on top.
 */
export function CameraController() {
  const { camera, gl, size } = useThree();
  const q = useQuality();
  const orbit = useRef({ yaw: 0, pitch: 0, dragging: false, idle: 0, lastX: 0, lastY: 0 });
  const shift = useRef(0);
  const dimRef = useRef(0);
  const first = useRef(true);

  useEffect(() => {
    const el = gl.domElement;
    el.style.touchAction = 'pan-y';
    const o = orbit.current;
    const down = (e: PointerEvent) => { o.dragging = true; o.lastX = e.clientX; o.lastY = e.clientY; };
    const move = (e: PointerEvent) => {
      runtime.pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
      if (!o.dragging || (e.pointerType === 'mouse' && e.buttons === 0)) return;
      o.yaw = THREE.MathUtils.clamp(o.yaw - (e.clientX - o.lastX) * 0.004, -0.9, 0.9);
      o.pitch = THREE.MathUtils.clamp(o.pitch + (e.clientY - o.lastY) * 0.003, -0.32, 0.4);
      o.lastX = e.clientX; o.lastY = e.clientY; o.idle = 0;
    };
    const up = () => { o.dragging = false; };
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      (camera as THREE.PerspectiveCamera).clearViewOffset();
    };
  }, [gl, camera]);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const st = useOcean.getState();
    const cam = camera as THREE.PerspectiveCamera;
    const o = orbit.current;

    // --- target pose -------------------------------------------------------
    let shiftT: number;
    let lambda: number;
    const focusIdx = st.selectedProject ? PROJECT_IDS.indexOf(st.selectedProject) : -1;
    if (focusIdx >= 0) {
      const p: Pose = projectFocusPose(focusIdx);
      posT.copy(p.pos); lookT.copy(p.look); shiftT = p.shift; lambda = 2.2;
    } else {
      shiftT = journeyPose(runtime.progress, posT, lookT);
      lambda = st.entered ? 3.2 : 0.55; // slow, cinematic approach on first load
    }
    if (q.reducedMotion) lambda = 14;

    // portrait screens: pull back, and lift the scene above the bottom sheet
    const aspect = size.width / size.height;
    const mobile = size.width < 768;
    if (aspect < 1.1) {
      rel.copy(posT).sub(lookT).multiplyScalar(1 + (1.1 - aspect) * 1.1);
      posT.copy(lookT).add(rel);
    }

    if (first.current) {
      first.current = false;
      runtime.camPos.set(0, 26, 112);
      runtime.camLook.copy(lookT);
    }
    const k = 1 - Math.exp(-lambda * dt);
    runtime.camPos.lerp(posT, k);
    runtime.camLook.lerp(lookT, k);

    // --- free exploration offset + parallax ----------------------------------
    if (!o.dragging) {
      o.idle += dt;
      if (o.idle > 3.5) {
        const r = 1 - Math.exp(-0.5 * dt);
        o.yaw -= o.yaw * r; o.pitch -= o.pitch * r;
      }
    }
    rel.copy(runtime.camPos).sub(runtime.camLook);
    rel.applyAxisAngle(UP, o.yaw);
    axis.crossVectors(UP, rel).normalize();
    rel.applyAxisAngle(axis, o.pitch);
    cam.position.copy(runtime.camLook).add(rel);

    const t = performance.now() * 0.001;
    const sway = q.reducedMotion ? 0 : 1;
    cam.position.x += runtime.pointer.x * 0.9 + Math.sin(t * 0.31) * 0.25 * sway;
    cam.position.y += runtime.pointer.y * 0.45 + Math.sin(t * 0.43) * 0.18 * sway;
    cam.lookAt(runtime.camLook);

    // --- view offset: keep subject clear of the info panel --------------------
    shift.current += ((mobile ? 0 : shiftT) - shift.current) * k;
    const sx = shift.current * size.width;
    const sy = mobile && (st.selectedProject || st.detail || st.entered) ? size.height * 0.16 : 0;
    cam.setViewOffset(size.width, size.height, sx, sy, size.width, size.height);

    // --- shared state for HUD / shaders ----------------------------------------
    runtime.heading = Math.atan2(-Math.sin(o.yaw) * 0 + (runtime.camLook.x - cam.position.x), -(runtime.camLook.z - cam.position.z));

    const dimT = focusIdx >= 0 ? 1 : 0;
    dimRef.current += (dimT - dimRef.current) * (1 - Math.exp(-2.5 * dt));
    runtime.dim = dimRef.current;

    let fx = runtime.focus.x, fy = runtime.focus.y, fz = runtime.focus.z, fw = 0;
    if (focusIdx >= 0) { const p = PROJECT_POS[focusIdx]; fx = p.x; fy = p.y; fz = p.z; fw = 1; }
    else if (st.hoveredProject) { const i = PROJECT_IDS.indexOf(st.hoveredProject); if (i >= 0) { const p = PROJECT_POS[i]; fx = p.x; fy = p.y; fz = p.z; fw = 0.5; } }
    else if (st.hoverItem === 'about') { fx = ABOUT_POS.x; fy = ABOUT_POS.y; fz = ABOUT_POS.z; fw = 0.6; }
    if (runtime.focus.w < 0.03 && fw > 0) runtime.focus.set(fx, fy, fz, runtime.focus.w);
    runtime.focus.x += (fx - runtime.focus.x) * k;
    runtime.focus.y += (fy - runtime.focus.y) * k;
    runtime.focus.z += (fz - runtime.focus.z) * k;
    runtime.focus.w += (fw - runtime.focus.w) * (1 - Math.exp(-3 * dt));
  }, -2);

  return null;
}
