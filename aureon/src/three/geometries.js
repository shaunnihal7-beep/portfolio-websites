/**
 * Procedural morph targets for the particle field. Everything is generated
 * at startup — zero textures, zero fetched assets, tiny GPU memory footprint.
 * Each shape narrates one chapter of the scroll story:
 *   nebula  — raw market signals, unstructured
 *   knot    — signals woven into structured intelligence
 *   helix   — continuous reasoning over time
 *   halo    — a clean, executed order: calm and precise
 */

const TAU = Math.PI * 2

/** Cheap approximate gaussian (sum of uniforms), good enough for scatter. */
function gauss() {
  return Math.random() + Math.random() + Math.random() - 1.5
}

export function buildTargets(count) {
  const nebula = new Float32Array(count * 3)
  const knot = new Float32Array(count * 3)
  const helix = new Float32Array(count * 3)
  const halo = new Float32Array(count * 3)
  const seeds = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    seeds[i] = Math.random()

    // --- Nebula: a breathing shell of signal dust with an inner haze -------
    {
      let x = gauss(), y = gauss(), z = gauss()
      const len = Math.sqrt(x * x + y * y + z * z) || 1
      x /= len; y /= len; z /= len
      const shell = Math.random() < 0.82
      const r = shell
        ? 2.1 + Math.random() * 0.75 // outer shell
        : 0.5 + Math.random() * 1.5  // sparse inner haze
      nebula[i3] = x * r
      nebula[i3 + 1] = y * r * 0.86 // slightly oblate — feels like an atmosphere
      nebula[i3 + 2] = z * r
    }

    // --- Torus knot (p=2, q=3): structure emerging from noise --------------
    {
      const t = Math.random() * TAU
      const s = 0.82
      const rr = 2 + Math.cos(3 * t)
      knot[i3] = (rr * Math.cos(2 * t) + gauss() * 0.16) * s
      knot[i3 + 1] = (rr * Math.sin(2 * t) + gauss() * 0.16) * s
      knot[i3 + 2] = (Math.sin(3 * t) * 1.4 + gauss() * 0.16) * s
    }

    // --- Double helix: reasoning strands with ambient data dust ------------
    {
      const dust = Math.random() < 0.14
      if (dust) {
        const a = Math.random() * TAU
        const r = 1.9 + Math.random() * 0.8
        helix[i3] = Math.cos(a) * r
        helix[i3 + 1] = (Math.random() * 2 - 1) * 2.9
        helix[i3 + 2] = Math.sin(a) * r
      } else {
        const strand = i % 2
        const p = Math.random()
        const y = (p * 2 - 1) * 2.7
        const a = p * TAU * 2.6 + strand * Math.PI
        const r = 1.22 + gauss() * 0.06
        helix[i3] = Math.cos(a) * r
        helix[i3 + 1] = y
        helix[i3 + 2] = Math.sin(a) * r
      }
    }

    // --- Halo: a tilted orbital ring — the executed order, at rest ---------
    {
      const a = Math.random() * TAU
      const r = 2.55 + gauss() * 0.2
      const x = Math.cos(a) * r
      let y = gauss() * 0.09
      let z = Math.sin(a) * r
      // bake a gentle tilt so the ring reads in perspective
      const tilt = 0.42
      const y2 = y * Math.cos(tilt) - z * Math.sin(tilt)
      const z2 = y * Math.sin(tilt) + z * Math.cos(tilt)
      halo[i3] = x
      halo[i3 + 1] = y2
      halo[i3 + 2] = z2
    }
  }

  return { nebula, knot, helix, halo, seeds }
}
