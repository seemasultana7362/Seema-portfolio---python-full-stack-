/** Sky gradient shared by the sky dome and the water's reflection. */
export const SKY_GLSL = /* glsl */ `
uniform vec3 uHorizon;
uniform vec3 uZenith;
uniform vec3 uSunDir;
uniform vec3 uSunColor;
vec3 skyColor(vec3 d) {
  float h = clamp(d.y, 0.0, 1.0);
  vec3 col = mix(uHorizon, uZenith, pow(h, 0.45));
  float s = max(dot(d, uSunDir), 0.0);
  col += uSunColor * (pow(s, 900.0) * 2.2 + pow(s, 40.0) * 0.28 + pow(s, 6.0) * 0.12);
  return col;
}
`;
