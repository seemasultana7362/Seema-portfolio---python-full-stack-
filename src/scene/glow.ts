import * as THREE from 'three';

let glow: THREE.CanvasTexture | null = null;
let cloud: THREE.CanvasTexture | null = null;

/** Soft radial gradient used for halos, beacons and sun glow (shared, built once). */
export function getGlowTexture(): THREE.CanvasTexture {
  if (glow) return glow;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.25, 'rgba(255,255,255,0.45)');
  grad.addColorStop(0.6, 'rgba(255,255,255,0.1)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  glow = new THREE.CanvasTexture(c);
  glow.colorSpace = THREE.SRGBColorSpace;
  return glow;
}

/** Soft cloud puff: a few overlapping blobs. */
export function getCloudTexture(): THREE.CanvasTexture {
  if (cloud) return cloud;
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 128;
  const g = c.getContext('2d')!;
  const blobs = [[128, 70, 54], [90, 76, 40], [170, 78, 42], [60, 84, 28], [200, 86, 28], [125, 52, 34]];
  for (const [x, y, r] of blobs) {
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, 'rgba(255,255,255,0.55)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grad;
    g.fillRect(0, 0, 256, 128);
  }
  cloud = new THREE.CanvasTexture(c);
  cloud.colorSpace = THREE.SRGBColorSpace;
  return cloud;
}
