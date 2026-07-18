import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { finePointer, prefersReduced } from '../utils/motion'

const CARDS = [
  {
    title: 'Predictive intelligence',
    copy: 'Foresight, quantified. Proprietary models surface market inflections before they become consensus.',
    glyph: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M4 24 L12 14 L18 19 L28 6" />
        <circle cx="28" cy="6" r="2.2" />
      </svg>
    ),
  },
  {
    title: 'Autonomous risk',
    copy: 'A risk engine that never sleeps — continuous stress-testing across every position, portfolio and counterparty.',
    glyph: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M16 3 L27 8 V15 C27 22.5 22.5 27 16 29 C9.5 27 5 22.5 5 15 V8 Z" />
        <path d="M11.5 16 L15 19.5 L21 12.5" />
      </svg>
    ),
  },
  {
    title: 'Adaptive portfolios',
    copy: 'Allocations that evolve. Strategies rebalance to regime change in minutes, not quarters.',
    glyph: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <circle cx="16" cy="16" r="11" />
        <ellipse cx="16" cy="16" rx="11" ry="4.5" />
        <circle cx="24.5" cy="10" r="1.8" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: 'Continuous compliance',
    copy: 'Regulation, automated. Every decision is explainable, auditable and reported as it happens.',
    glyph: (
      <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="7" y="4" width="18" height="24" rx="2.5" />
        <path d="M12 11 H20 M12 16 H20 M12 21 H16" />
      </svg>
    ),
  },
]

/**
 * Section 3 — Capabilities. Frosted cards with a pointer-tracked tilt;
 * the field behind has just woven itself into the torus knot.
 */
export default function Capabilities() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cap-card', {
        opacity: 0,
        y: prefersReduced() ? 0 : 56,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '.cap-grid', start: 'top 82%' },
      })
      gsap.from('.capabilities__head > *', {
        opacity: 0,
        y: prefersReduced() ? 0 : 36,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '.capabilities__head', start: 'top 85%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  // Dimensional hover: subtle 3D tilt following the pointer (fine pointers only)
  useLayoutEffect(() => {
    if (!finePointer() || prefersReduced()) return
    const cards = root.current?.querySelectorAll('.cap-card') ?? []
    const cleanups = []
    cards.forEach((card) => {
      const rx = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3.out' })
      const ry = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3.out' })
      const onMove = (e) => {
        const r = card.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width - 0.5
        const py = (e.clientY - r.top) / r.height - 0.5
        ry(px * 7)
        rx(-py * 7)
      }
      const onLeave = () => { rx(0); ry(0) }
      card.addEventListener('pointermove', onMove)
      card.addEventListener('pointerleave', onLeave)
      cleanups.push(() => {
        card.removeEventListener('pointermove', onMove)
        card.removeEventListener('pointerleave', onLeave)
      })
    })
    return () => cleanups.forEach((fn) => fn())
  }, [])

  return (
    <section id="capabilities" className="capabilities" ref={root}>
      <div className="container">
        <header className="capabilities__head">
          <p className="eyebrow">Capabilities</p>
          <h2 className="h2">
            An operating system for <em>intelligent capital.</em>
          </h2>
        </header>

        <div className="cap-grid">
          {CARDS.map((c) => (
            <article className="cap-card" key={c.title}>
              <div className="cap-card__glyph">{c.glyph}</div>
              <h3 className="cap-card__title">{c.title}</h3>
              <p className="cap-card__copy">{c.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
