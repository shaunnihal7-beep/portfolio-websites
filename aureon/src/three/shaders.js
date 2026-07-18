/**
 * All shading is custom + unlit: no lights, no shadow maps, no textures.
 * The entire scene renders in two draw calls (particles + fresnel core).
 */

export const particleVertex = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;      // 0 nebula → 1 knot → 2 helix → 3 halo
  uniform float uSize;
  uniform float uPixelRatio;

  attribute vec3 aKnot;
  attribute vec3 aHelix;
  attribute vec3 aHalo;
  attribute float aSeed;

  varying float vSeed;
  varying float vDepth;

  void main() {
    // Piecewise morph between the four story shapes, eased per segment.
    float m1 = smoothstep(0.0, 1.0, clamp(uMorph, 0.0, 1.0));
    float m2 = smoothstep(0.0, 1.0, clamp(uMorph - 1.0, 0.0, 1.0));
    float m3 = smoothstep(0.0, 1.0, clamp(uMorph - 2.0, 0.0, 1.0));
    vec3 p = mix(position, aKnot, m1);
    p = mix(p, aHelix, m2);
    p = mix(p, aHalo, m3);

    // Ambient drift — cheap trigonometric "breathing", no noise texture.
    float t = uTime * 0.45;
    float s = aSeed * 31.7;
    p.x += sin(t + s) * 0.055;
    p.y += cos(t * 1.31 + s * 1.7) * 0.055;
    p.z += sin(t * 0.83 + s * 2.3) * 0.055;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    float size = uSize * (0.55 + aSeed * 0.9);
    gl_PointSize = size * uPixelRatio * (34.0 / -mv.z);

    vSeed = aSeed;
    vDepth = clamp((-mv.z - 4.0) / 9.0, 0.0, 1.0);
  }
`

export const particleFragment = /* glsl */ `
  uniform vec3 uColorA;   // bullion (deep gold)
  uniform vec3 uColorB;   // champagne (pale gold)
  uniform float uOpacity;

  varying float vSeed;
  varying float vDepth;

  void main() {
    // Soft round sprite from gl_PointCoord — no texture fetch.
    float d = length(gl_PointCoord - 0.5);
    float alpha = smoothstep(0.5, 0.06, d);
    vec3 col = mix(uColorA, uColorB, vSeed);
    col *= 1.0 - vDepth * 0.55; // recede into the ink
    gl_FragColor = vec4(col, alpha * uOpacity);
  }
`

export const coreVertex = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    vec3 p = position;
    // Subtle living-surface undulation
    p += normal * sin(uTime * 0.9 + position.y * 4.0 + position.x * 3.0) * 0.022;
    vec4 world = modelMatrix * vec4(p, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-(viewMatrix * world).xyz);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`

export const coreFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    // Fresnel rim — a glass instrument catching light at its edges.
    float f = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 2.6);
    gl_FragColor = vec4(uColor * (0.25 + f * 1.6), f * uOpacity);
  }
`
