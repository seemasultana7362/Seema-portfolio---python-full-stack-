import { useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { runtime, shared } from '../store/runtime';
import { useQuality } from './QualityContext';
import { useFrame } from '@react-three/fiber';

const BOX = new THREE.Vector3(90, 60, 90);

const planktonVert = /* glsl */ `
uniform float uTime;
uniform float uMotion;
uniform float uPx;
uniform vec4 uFocus;
uniform vec3 uBox;
uniform float uDensity;
attribute vec4 aSeed;
varying float vAlpha;
varying vec3 vCol;
void main() {
  float t = uTime * uMotion;
  vec3 base = position + vec3(0.35, 0.08, 0.1) * t;
  base += vec3(sin(t * 0.3 * aSeed.x + aSeed.y * 6.28), sin(t * 0.22 * aSeed.z + aSeed.w * 6.28), cos(t * 0.27 * aSeed.y + aSeed.x * 6.28)) * 1.4;
  vec3 rel = mod(base - cameraPosition + uBox * 0.5, uBox) - uBox * 0.5;
  vec3 p = cameraPosition + rel;
  // focused island pulls plankton into a slow orbit
  vec3 d = uFocus.xyz - p;
  float dist = length(d);
  float inf = uFocus.w * smoothstep(16.0, 2.0, dist);
  p += d * inf * 0.22 + cross(vec3(0.0, 1.0, 0.0), d) * inf * 0.07;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float depth = clamp(-p.y / 150.0, 0.0, 1.0);
  float pulse = 0.65 + 0.35 * sin(t * (0.6 + aSeed.z * 1.5) + aSeed.w * 20.0);
  float show = step(aSeed.w, uDensity);
  float fade = 1.0 - smoothstep(0.35, 0.5, length(rel / uBox));
  vAlpha = show * fade * smoothstep(3.0, -1.0, p.y) * (0.3 + depth * 0.75) * pulse;
  float big = step(0.86, aSeed.x);
  vCol = mix(vec3(0.15, 0.72, 0.65), vec3(0.13, 0.83, 0.93), aSeed.y);
  vCol = mix(vCol, vec3(0.8, 1.0, 1.0), big * 0.4);
  gl_PointSize = uPx * (0.55 + aSeed.x * 0.9 + big * 1.6) * (46.0 / -mv.z);
}`;

const planktonFrag = /* glsl */ `
varying float vAlpha;
varying vec3 vCol;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float a = smoothstep(1.0, 0.0, d);
  a *= a;
  gl_FragColor = vec4(vCol, a * vAlpha);
}`;

const bubbleVert = /* glsl */ `
uniform float uTime;
uniform float uMotion;
uniform float uPx;
uniform vec3 uBox;
attribute vec4 aSeed;
varying float vAlpha;
void main() {
  float t = uTime * uMotion;
  vec3 base = position;
  base.y += t * (0.9 + aSeed.x * 1.4);
  base.x += sin(t * 0.8 + aSeed.y * 40.0) * 0.5;
  base.z += cos(t * 0.7 + aSeed.z * 40.0) * 0.5;
  vec3 rel = mod(base - cameraPosition + uBox * 0.5, uBox) - uBox * 0.5;
  vec3 p = cameraPosition + rel;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float fade = 1.0 - smoothstep(0.3, 0.5, length(rel / uBox));
  vAlpha = fade * smoothstep(-0.5, -3.0, p.y) * (0.35 + aSeed.w * 0.4);
  gl_PointSize = uPx * (0.9 + aSeed.x * 1.8) * (46.0 / -mv.z);
}`;

const bubbleFrag = /* glsl */ `
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float ring = smoothstep(0.55, 0.9, d) * smoothstep(1.0, 0.88, d);
  float body = smoothstep(1.0, 0.0, d) * 0.08;
  float hl = smoothstep(0.35, 0.0, length(gl_PointCoord - vec2(0.32, 0.3)));
  gl_FragColor = vec4(vec3(0.7, 0.95, 1.0), (ring * 0.8 + body + hl * 0.6) * vAlpha);
}`;

function seeds(n: number) {
  const a = new Float32Array(n * 4);
  for (let i = 0; i < a.length; i++) a[i] = Math.random();
  return a;
}

function cloud(n: number, box: THREE.Vector3, yMin: number, yMax: number) {
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    pos[i * 3] = (Math.random() - 0.5) * box.x;
    pos[i * 3 + 1] = yMin + Math.random() * (yMax - yMin);
    pos[i * 3 + 2] = (Math.random() - 0.5) * box.z - 10;
  }
  return pos;
}

/**
 * Plankton + bubbles. Both are single GPU-animated Points draws whose positions
 * wrap around the camera, so density stays constant wherever the visitor dives.
 */
export function Particles() {
  const q = useQuality();
  const gl = useThree((s) => s.gl);

  const { plankton, bubbles } = useMemo(() => {
    const px = Math.min(gl.getPixelRatio(), 2);
    const pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.BufferAttribute(cloud(q.particles, BOX, -160, 6), 3));
    pg.setAttribute('aSeed', new THREE.BufferAttribute(seeds(q.particles), 4));
    const pm = new THREE.ShaderMaterial({
      vertexShader: planktonVert,
      fragmentShader: planktonFrag,
      uniforms: {
        uTime: shared.uTime,
        uMotion: shared.uMotion,
        uPx: { value: 4.5 * px },
        uFocus: { value: runtime.focus },
        uBox: { value: BOX },
        uDensity: { value: 0.5 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const bb = new THREE.Vector3(60, 50, 60);
    const bg = new THREE.BufferGeometry();
    bg.setAttribute('position', new THREE.BufferAttribute(cloud(q.bubbles, bb, -160, 6), 3));
    bg.setAttribute('aSeed', new THREE.BufferAttribute(seeds(q.bubbles), 4));
    const bm = new THREE.ShaderMaterial({
      vertexShader: bubbleVert,
      fragmentShader: bubbleFrag,
      uniforms: {
        uTime: shared.uTime,
        uMotion: shared.uMotion,
        uPx: { value: 5 * px },
        uBox: { value: bb },
      },
      transparent: true,
      depthWrite: false,
    });
    return { plankton: { geo: pg, mat: pm }, bubbles: { geo: bg, mat: bm } };
  }, [q.particles, q.bubbles, gl]);

  useEffect(() => () => {
    plankton.geo.dispose(); plankton.mat.dispose(); bubbles.geo.dispose(); bubbles.mat.dispose();
  }, [plankton, bubbles]);

  // more life the deeper you go
  useFrame(({ camera }) => {
    const depth = THREE.MathUtils.clamp(-camera.position.y / 150, 0, 1);
    plankton.mat.uniforms.uDensity.value = 0.4 + depth * 0.6;
  });

  return (
    <>
      <points geometry={plankton.geo} material={plankton.mat} frustumCulled={false} renderOrder={2} />
      <points geometry={bubbles.geo} material={bubbles.mat} frustumCulled={false} renderOrder={2} />
    </>
  );
}
