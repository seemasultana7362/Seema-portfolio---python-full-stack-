import * as THREE from 'three';

/**
 * The ocean's vertical journey. Each section is a "zone" with a depth (m below
 * the surface), a cinematic camera pose and a world anchor for its structure.
 * Scroll progress 0..N-1 interpolates between these poses.
 */
export const SECTIONS = [
  { id: 'hero', label: 'SURFACE', code: '00' },
  { id: 'about', label: 'ABOUT', code: '01' },
  { id: 'projects', label: 'PROJECTS', code: '02' },
  { id: 'skills', label: 'SKILLS', code: '03' },
  { id: 'experience', label: 'EXPERIENCE', code: '04' },
  { id: 'education', label: 'EDUCATION', code: '05' },
  { id: 'achievements', label: 'ACHIEVEMENTS', code: '06' },
  { id: 'contact', label: 'CONTACT', code: '07' },
] as const;

export type SectionId = (typeof SECTIONS)[number]['id'];
export const SECTION_COUNT = SECTIONS.length;
export const sectionIndex = (id: SectionId) => SECTIONS.findIndex((s) => s.id === id);

/** World anchors. Everything above y=0 floats over the surface; below is underwater. */
export const ABOUT_POS = new THREE.Vector3(-13, 1.4, 4);
export const PROJECT_POS = [
  new THREE.Vector3(-19, 2.2, -22),
  new THREE.Vector3(-6, 3.4, -35),
  new THREE.Vector3(8, 2.4, -26),
  new THREE.Vector3(20, 3.4, -38),
];
export const SKILLS_POS = new THREE.Vector3(0, -26, -8);
export const EXPERIENCE_POS = new THREE.Vector3(0, -52, -8);
export const EDUCATION_POS = new THREE.Vector3(0, -80, -8);
export const ACHIEVEMENTS_POS = new THREE.Vector3(0, -108, -8);
export const CONTACT_POS = new THREE.Vector3(0, -138, -8);

export interface Pose {
  pos: THREE.Vector3;
  look: THREE.Vector3;
  /** horizontal view-offset (fraction of width) so the scene sits left of the info panel */
  shift: number;
}

const v = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

export const POSES: Pose[] = [
  { pos: v(0, 9, 64), look: v(0, 4, 0), shift: 0 },
  { pos: v(-1, 4.4, 23), look: v(-8, 2.4, 4), shift: 0.085 },
  { pos: v(0, 10, 16), look: v(1, 3, -34), shift: 0.085 },
  { pos: v(0, -18, 32), look: v(2, -27, -8), shift: 0.085 },
  { pos: v(0, -45, 30), look: v(2, -52, -8), shift: 0.085 },
  { pos: v(0, -72, 26), look: v(2, -79, -8), shift: 0.085 },
  { pos: v(0, -100, 26), look: v(2, -109, -8), shift: 0.085 },
  { pos: v(0, -128, 26), look: v(2, -136, -8), shift: 0.085 },
];

/** Camera pose when a project island is focused */
export function projectFocusPose(i: number): Pose {
  const p = PROJECT_POS[i];
  return { pos: v(p.x + 4, p.y + 3.2, p.z + 16), look: v(p.x, p.y + 1.2, p.z), shift: 0.1 };
}

const smoother = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/** Interpolates the guided-journey pose with a dwell at each keyframe. */
export function journeyPose(progress: number, outPos: THREE.Vector3, outLook: THREE.Vector3) {
  const p = Math.min(SECTION_COUNT - 1, Math.max(0, progress));
  const i = Math.min(SECTION_COUNT - 2, Math.floor(p));
  const f = smoother(clamp01((p - i - 0.18) / 0.64));
  outPos.lerpVectors(POSES[i].pos, POSES[i + 1].pos, f);
  outLook.lerpVectors(POSES[i].look, POSES[i + 1].look, f);
  return POSES[i].shift + (POSES[i + 1].shift - POSES[i].shift) * f;
}

/** Fog / water colour profile by depth (world y). */
export const DEPTH_PROFILE: { y: number; color: string; density: number }[] = [
  { y: 4, color: '#11587c', density: 0.0055 },
  { y: -6, color: '#0a4a6c', density: 0.014 },
  { y: -26, color: '#073a58', density: 0.017 },
  { y: -52, color: '#052a45', density: 0.021 },
  { y: -80, color: '#041d33', density: 0.025 },
  { y: -108, color: '#03152a', density: 0.027 },
  { y: -140, color: '#02101e', density: 0.03 },
];
