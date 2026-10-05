import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { runtime, shared } from '../store/runtime';
import { useQuality } from './QualityContext';
import { SKY_GLSL } from './skyGlsl';

const RIPPLES = 6;
const SIZE = 900;

const HEIGHT_GLSL = /* glsl */ `
uniform float uTime;
uniform float uMotion;
uniform float uSwell;
uniform vec4 uRipples[${RIPPLES}];
uniform vec3 uFocus;
float swell(vec2 p) {
  float t = uTime * uMotion;
  float h = 0.55 * sin(p.x * 0.11 + t * 0.8)
          + 0.35 * sin(p.y * 0.16 - t * 0.65 + p.x * 0.05)
          + 0.16 * sin((p.x + p.y) * 0.31 + t * 1.3)
          + 0.07 * sin((p.x * 0.9 - p.y * 1.2) * 0.7 - t * 1.9);
  return h * uSwell;
}
float heightAt(vec2 p) {
  float h = swell(p);
  // an island being approached stirs the water around it
  float fd = length(p - uFocus.xy);
  h *= 1.0 + uFocus.z * 1.2 * exp(-fd * fd * 0.004);
  h += uFocus.z * 0.14 * sin(fd * 1.3 - uTime * 2.2) * exp(-fd * 0.07);
  for (int i = 0; i < ${RIPPLES}; i++) {
    float age = uTime - uRipples[i].z;
    if (age > 0.0 && age < 7.0) {
      float d = length(p - uRipples[i].xy);
      float front = age * 4.5;
      h += sin((d - front) * 2.1) * exp(-age * 0.75) * exp(-abs(d - front) * 0.3) * uRipples[i].w * 0.5;
    }
  }
  return h;
}
`;

const vert = /* glsl */ `
${HEIGHT_GLSL}
varying vec3 vWorld;
varying float vH;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  float h = heightAt(w.xz);
  w.y += h;
  vH = h;
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const frag = /* glsl */ `
${HEIGHT_GLSL}
${SKY_GLSL}
uniform vec3 uFogColor;
uniform float uFogDensity;
uniform vec2 uPointer;
varying vec3 vWorld;
varying float vH;
void main() {
  vec3 V = normalize(cameraPosition - vWorld);
  float dist = length(cameraPosition - vWorld);
  float e = 0.35;
  float h0 = heightAt(vWorld.xz);
  vec3 N = normalize(vec3(h0 - heightAt(vWorld.xz + vec2(e, 0.0)), e * 1.6, h0 - heightAt(vWorld.xz + vec2(0.0, e))));
  float fog = 1.0 - exp(-pow(uFogDensity * dist, 2.0));
  vec3 col;
  if (cameraPosition.y > 0.0) {
    float fres = pow(1.0 - max(dot(N, V), 0.0), 4.0);
    vec3 R = reflect(-V, N);
    R.y = abs(R.y);
    vec3 deep = vec3(0.006, 0.05, 0.095);
    vec3 shallow = vec3(0.02, 0.24, 0.34);
    vec3 body = mix(deep, shallow, clamp(0.45 + vH * 0.55, 0.0, 1.0) * 0.55);
    col = mix(body, skyColor(R), fres * 0.9 + 0.04);
    float s = max(dot(R, uSunDir), 0.0);
    col += uSunColor * (pow(s, 700.0) * 4.0 + pow(s, 70.0) * 0.5);
    col += vec3(0.45, 0.9, 1.0) * smoothstep(0.7, 1.15, vH) * 0.18;
    float d = length(vWorld.xz - uPointer);
    col += vec3(0.08, 0.7, 0.85) * exp(-d * d * 0.015) * 0.3;
  } else {
    float up = abs(V.y);
    vec3 under = mix(uFogColor * 1.35, vec3(0.22, 0.68, 0.82), pow(up, 3.0));
    float glint = pow(max(dot(N, vec3(0.0, -1.0, 0.0)), 0.0), 18.0);
    col = under * 0.85 + vec3(0.5, 0.9, 1.0) * glint * 0.25;
  }
  col = mix(col, uFogColor, fog);
  gl_FragColor = vec4(col, 1.0);
}`;

/**
 * The ocean surface: a camera-following displaced plane. Swell, click ripples,
 * pointer light and the "island is nearby" disturbance all live in one shader.
 */
export function Ocean() {
  const q = useQuality();
  const mesh = useRef<THREE.Mesh>(null);
  const camera = useThree((s) => s.camera);
  const rippleIdx = useRef(0);

  const { geometry, material } = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(SIZE, SIZE, q.waterSegments, q.waterSegments);
    geometry.rotateX(-Math.PI / 2);
    const ripples = Array.from({ length: RIPPLES }, () => new THREE.Vector4(0, 0, -100, 0));
    const material = new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        uTime: shared.uTime,
        uMotion: shared.uMotion,
        uSwell: { value: 1 },
        uFogColor: shared.uFogColor,
        uFogDensity: shared.uFogDensity,
        uHorizon: shared.uHorizon,
        uZenith: shared.uZenith,
        uSunDir: shared.uSunDir,
        uSunColor: shared.uSunColor,
        uRipples: { value: ripples },
        uFocus: { value: new THREE.Vector3(0, 0, 0) },
        uPointer: { value: new THREE.Vector2(9999, 9999) },
      },
      side: THREE.DoubleSide,
      fog: false,
    });
    return { geometry, material };
  }, [q.waterSegments]);

  useEffect(() => () => { geometry.dispose(); material.dispose(); }, [geometry, material]);

  const smoothFocus = useRef(new THREE.Vector3());
  useFrame((_, dt) => {
    const m = mesh.current;
    if (!m) return;
    // snap to a grid so the plane follows the camera without the swell "swimming"
    const cell = SIZE / q.waterSegments;
    m.position.x = Math.round(camera.position.x / cell) * cell;
    m.position.z = Math.round(camera.position.z / cell) * cell;
    material.uniforms.uSwell.value = q.reducedMotion ? 0.35 : 1;

    // smoothed focus disturbance (xz + strength)
    const f = runtime.focus;
    const sf = smoothFocus.current;
    const k = 1 - Math.exp(-dt * 3);
    sf.x += (f.x - sf.x) * k;
    sf.y += (f.z - sf.y) * k;
    sf.z += (f.w - sf.z) * k;
    (material.uniforms.uFocus.value as THREE.Vector3).set(sf.x, sf.y, sf.z);

    const p = material.uniforms.uPointer.value as THREE.Vector2;
    p.lerp(runtime.waterPointer, 1 - Math.exp(-dt * 8));
  });

  const addRipple = (e: ThreeEvent<MouseEvent>, amp: number) => {
    const r = (material.uniforms.uRipples.value as THREE.Vector4[])[rippleIdx.current++ % RIPPLES];
    r.set(e.point.x, e.point.z, shared.uTime.value, amp);
  };

  return (
    <mesh
      ref={mesh}
      geometry={geometry}
      material={material}
      frustumCulled={false}
      onClick={(e) => {
        if (e.delta > 6 || runtime.above < 0.5) return;
        addRipple(e, 1.2);
      }}
      onPointerMove={(e) => {
        if (runtime.above < 0.5) return;
        runtime.waterPointer.set(e.point.x, e.point.z);
      }}
      onPointerLeave={() => runtime.waterPointer.set(9999, 9999)}
    />
  );
}
