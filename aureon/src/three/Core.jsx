import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { coreVertex, coreFragment } from './shaders'
import { sceneState } from './sceneState'

/**
 * The hero's glass instrument — a fresnel-rimmed icosahedron at the heart
 * of the signal nebula. It fades away once the story leaves the hero.
 */
export default function Core() {
  const mesh = useRef()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uOpacity: { value: 0 },
      uColor: { value: new THREE.Color('#e8cf9e') },
    }),
    []
  )

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    uniforms.uTime.value = t
    // Follow the scroll-driven visibility with easing
    uniforms.uOpacity.value +=
      (sceneState.coreOpacity * 0.85 - uniforms.uOpacity.value) * Math.min(1, delta * 3)
    if (mesh.current) {
      mesh.current.rotation.y = t * 0.12
      mesh.current.rotation.z = t * 0.05
      const s = 1 + Math.sin(t * 0.7) * 0.03
      mesh.current.scale.setScalar(s)
    }
  })

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.02, 5]} />
      <shaderMaterial
        vertexShader={coreVertex}
        fragmentShader={coreFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}
