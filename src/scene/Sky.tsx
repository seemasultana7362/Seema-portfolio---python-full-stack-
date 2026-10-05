import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { shared } from '../store/runtime';
import { SKY_GLSL } from './skyGlsl';

const vert = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = position;
  vec4 p = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * p;
  gl_Position.z = gl_Position.w; // always at the far plane
}`;

const frag = /* glsl */ `
uniform vec3 uFogColor;
uniform float uAbove;
varying vec3 vDir;
${SKY_GLSL}
float hash(vec3 p){ return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }
void main() {
  vec3 d = normalize(vDir);
  vec3 col = skyColor(d);
  // faint stars high in the sky
  vec3 g = floor(d * 260.0);
  float star = step(0.9975, hash(g)) * smoothstep(0.25, 0.7, d.y);
  col += vec3(0.7, 0.9, 1.0) * star * 0.6;
  // below the horizon blend into the fog colour so the sea meets the sky cleanly
  col = mix(col, uFogColor, smoothstep(0.02, -0.06, d.y));
  col = mix(uFogColor, col, uAbove);
  gl_FragColor = vec4(col, 1.0);
}`;

/** Gradient dusk sky dome that follows the camera and fades into the fog underwater. */
export function Sky() {
  const mesh = useRef<THREE.Mesh>(null);
  const camera = useThree((s) => s.camera);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        uniforms: {
          uFogColor: shared.uFogColor,
          uAbove: shared.uAbove,
          uHorizon: shared.uHorizon,
          uZenith: shared.uZenith,
          uSunDir: shared.uSunDir,
          uSunColor: shared.uSunColor,
        },
        side: THREE.BackSide,
        depthWrite: false,
        depthTest: false,
        fog: false,
      }),
    [],
  );
  useFrame(() => mesh.current?.position.copy(camera.position));
  return (
    <mesh ref={mesh} renderOrder={-10} frustumCulled={false} material={material}>
      <sphereGeometry args={[400, 32, 16]} />
    </mesh>
  );
}
