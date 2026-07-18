import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { finePointer, prefersReduced } from '../utils/motion'

/**
 * Custom cursor: a crisp dot with a lagging ring. Mounted only for fine
 * pointers — touch devices never pay for it.
 */
export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    if (!finePointer() || prefersReduced()) return
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    document.documentElement.classList.add('has-cursor')

    const pos = { x: innerWidth / 2, y: innerHeight / 2 }
    const ringPos = { x: pos.x, y: pos.y }

    const onMove = (e) => {
      pos.x = e.clientX
      pos.y = e.clientY
    }

    const tick = () => {
      // lerp the ring for that weighted, trailing feel
      ringPos.x += (pos.x - ringPos.x) * 0.16
      ringPos.y += (pos.y - ringPos.y) * 0.16
      dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`
    }

    // Grow the ring over anything interactive (event delegation — cheap)
    const isInteractive = (t) =>
      t.closest?.('a, button, input, textarea, select, [data-cursor]')
    const onOver = (e) => {
      if (isInteractive(e.target)) ring.classList.add('is-active')
    }
    const onOut = (e) => {
      if (isInteractive(e.target)) ring.classList.remove('is-active')
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })
    document.addEventListener('mouseout', onOut, { passive: true })
    gsap.ticker.add(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      gsap.ticker.remove(tick)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])

  return (
    <div className="cursor" aria-hidden="true">
      <div className="cursor__dot" ref={dotRef} />
      <div className="cursor__ring" ref={ringRef} />
    </div>
  )
}
