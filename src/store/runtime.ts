import * as THREE from 'three';

/**
 * Mutable per-frame state shared between the DOM HUD and the 3D scene.
 * Kept outside React state so hot values (scroll, depth, heading) never
 * trigger re-renders.
 */
export const runtime = {
  /** fractional section index, 0..N-1, derived from page scroll */
  progress: 0,
  /** smoothed camera world position / look target */
  camPos: new THREE.Vector3(0, 26, 110),
  camLook: new THREE.Vector3(0, 4, 0),
  /** camera yaw (radians) for the compass */
  heading: 0,
  /** 1 above water, 0 below (smooth) */
  above: 1,
  /** 0..1 dimming applied while a project is focused */
  dim: 0,
  /** pointer in NDC */
  pointer: new THREE.Vector2(),
  /** world focus point for particle reaction (xyz) + strength (w) */
  focus: new THREE.Vector4(0, 0, 0, 0),
  /** water ripple origin on pointer hover (xz) */
  waterPointer: new THREE.Vector2(9999, 9999),
};

/** Uniform objects shared by reference across every custom shader. */
export const shared = {
  uTime: { value: 0 },
  uFogColor: { value: new THREE.Color('#11587c') },
  uFogDensity: { value: 0.0055 },
  uAbove: { value: 1 },
  uMotion: { value: 1 },
  uHorizon: { value: new THREE.Color('#1d7396') },
  uZenith: { value: new THREE.Color('#03111F') },
  uSunDir: { value: new THREE.Vector3(0.28, 0.13, -1).normalize() },
  uSunColor: { value: new THREE.Color('#bff3ff') },
};
