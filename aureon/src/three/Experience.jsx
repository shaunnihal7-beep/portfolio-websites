import { Canvas } from '@react-three/fiber'
import Rig from './Rig'
import ParticleField from './ParticleField'
import Core from './Core'

/**
 * One persistent, fixed WebGL canvas behind the whole page.
 * A single canvas (instead of per-section scenes) means one GL context,
 * one render loop and no context-switch cost while scrolling.
 */
export default function Experience() {
  const coarse =
    typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

  return (
    <div className="webgl" aria-hidden="true">
      <Canvas
        // Clamp device pixel ratio — the single biggest GPU saving. Additive
        // particles are fill-rate bound, so we cap well below native retina.
        dpr={[1, coarse ? 1.5 : 1.6]}
        camera={{ fov: 42, near: 0.1, far: 40, position: [0, 0, 9] }}
        gl={{
          antialias: false, // soft additive particles don't need MSAA
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
        }}
      >
        <Rig>
          {/* Fewer particles on touch devices; still reads as the same scene */}
          <ParticleField count={coarse ? 4800 : 8200} />
          <Core />
        </Rig>
      </Canvas>
    </div>
  )
}
