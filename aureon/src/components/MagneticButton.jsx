import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { finePointer, prefersReduced } from '../utils/motion'

/**
 * Magnetic CTA: the label is gently pulled toward the pointer and springs
 * back on leave. Renders a plain element on touch devices.
 */
export default function MagneticButton({
  as: Tag = 'a',
  className = '',
  children,
  ...rest
}) {
  const wrap = useRef(null)
  const inner = useRef(null)

  useEffect(() => {
    if (!finePointer() || prefersReduced()) return
    const el = wrap.current
    const label = inner.current
    if (!el || !label) return

    const xTo = gsap.quickTo(label, 'x', { duration: 0.4, ease: 'power3.out' })
    const yTo = gsap.quickTo(label, 'y', { duration: 0.4, ease: 'power3.out' })

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * 0.32)
      yTo((e.clientY - (r.top + r.height / 2)) * 0.32)
    }
    const onLeave = () => {
      gsap.to(label, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.35)' })
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <Tag ref={wrap} className={`btn ${className}`} {...rest}>
      <span ref={inner} className="btn__label">
        {children}
      </span>
    </Tag>
  )
}
