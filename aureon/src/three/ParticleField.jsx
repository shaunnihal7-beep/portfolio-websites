import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { buildTargets } from './geometries'
import { particleVertex, particleFragment } from './shaders'
import { sceneState } from './sceneState'

/**
 * The signature element: one GPU particle system whose shape is the
 * scroll narrative. All four morph targets live as vertex attributes, so
 * morphing costs nothing but a uniform update — one draw call, no textures.
 */
export default function ParticleField({ count = 10000 }) {
  const gl = useThree((s) => s.gl)

  const geometry = useMemo(() => {
    const { nebula, knot, helix, halo, seeds } = buildTargets(count)
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(nebula, 3))
    geo.setAttribute('aKnot', new THREE.BufferAttribute(knot, 3))
    geo.setAttribute('aHelix', new THREE.BufferAttribute(helix, 3))
    geo.setAttribute('aHalo', new THREE.BufferAttribute(halo, 3))
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1))
    return geo
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uSize: { value: 1.0 },
      uOpacity: { value: 0 }, // fades in under the preloader
      uPixelRatio: { value: gl.getPixelRatio() },
      uColorA: { value: new THREE.Color('#a97f3f') }, // bullion
      uColorB: { value: new THREE.Color('#f0dcac') }, // champagne
    }),
    [gl]
  )

  const matRef = useRef()

  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.elapsedTime
    // Ease toward the scroll-driven target so shape changes feel weighted.
    uniforms.uMorph.value += (sceneState.morph - uniforms.uMorph.value) * Math.min(1, delta * 4)
    if (uniforms.uOpacity.value < 1) {
      uniforms.uOpacity.value = Math.min(1, uniforms.uOpacity.value + delta * 0.55)
    }
  })

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        vertexShader={particleVertex}
        fragmentShader={particleFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
