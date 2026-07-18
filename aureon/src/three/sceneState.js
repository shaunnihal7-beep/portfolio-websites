/**
 * Shared mutable state bridging the DOM world (GSAP ScrollTrigger) and the
 * WebGL world (react-three-fiber). GSAP writes to it on scroll; the render
 * loop reads and eases toward it. No React re-renders are involved, which
 * keeps the bridge allocation-free and 60fps-safe.
 */
export const sceneState = {
  /** Morph target: 0 signal nebula → 1 torus knot → 2 reasoning helix → 3 order halo */
  morph: 0,
  /** Fresnel core visibility (fades out after the hero) */
  coreOpacity: 1,
  /** Normalized pointer, -1..1 */
  pointer: { x: 0, y: 0 },
}
