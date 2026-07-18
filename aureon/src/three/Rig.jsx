import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { sceneState } from './sceneState'

/**
 * Camera-space group: slow ambient rotation plus lerped pointer parallax,
 * so the scene feels weighted rather than glued to the mouse.
 *
 * On wide screens the whole scene is nudged into the right-hand third of the
 * viewport so the left-aligned headline reads on clean space and the glass
 * core sits beside the type instead of behind it. Narrow screens stay
 * centered — there the copy is meant to float over the field.
 */
export default function Rig({ children }) {
  const group = useRef()
  const { viewport, size } = useThree()

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime
    const k = Math.min(1, delta * 2.4)
    g.rotation.y += (t * 0.055 + sceneState.pointer.x * 0.34 - g.rotation.y) * k
    g.rotation.x += (sceneState.pointer.y * 0.16 - g.rotation.x) * k

    // Ease toward the composition offset (also animates smoothly on resize).
    const targetX = size.width > 900 ? viewport.width * 0.22 : 0
    g.position.x += (targetX - g.position.x) * k
  })

  return <group ref={group}>{children}</group>
}
