import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'

const STATS = [
  { value: 38, format: (v) => `+${Math.round(v)}%`, label: 'uplift in forecast precision' },
  { value: 27, format: (v) => `−${Math.round(v)}%`, label: 'reduction in tail-risk exposure' },
  { value: 12.4, format: (v) => `${v.toFixed(1)}B`, label: 'signals processed daily' },
  { value: 99.99, format: (v) => `${v.toFixed(2)}%`, label: 'platform uptime' },
]

/**
 * Section 5 — Metrics. Counters resolve once as they enter view;
 * numbers land with the same weight as the type around them.
 */
export default function Metrics() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.stat').forEach((el, i) => {
        const numEl = el.querySelector('.stat__value')
        const target = STATS[i]
        const state = { v: 0 }

        gsap.from(el, {
          opacity: 0,
          y: 40,
          duration: 0.9,
          ease: 'power3.out',
          delay: i * 0.08,
          scrollTrigger: { trigger: root.current, start: 'top 78%', once: true },
        })
        gsap.to(state, {
          v: target.value,
          duration: 1.8,
          ease: 'power2.out',
          delay: i * 0.08,
          scrollTrigger: { trigger: root.current, start: 'top 78%', once: true },
          onUpdate: () => { numEl.textContent = target.format(state.v) },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="metrics" className="metrics" ref={root}>
      <div className="container">
        <header className="metrics__head">
          <p className="eyebrow">Proof</p>
          <h2 className="h2">Measured where it matters.</h2>
        </header>

        <dl className="metrics__grid">
          {STATS.map((s) => (
            <div className="stat" key={s.label}>
              <dt className="stat__label">{s.label}</dt>
              <dd className="stat__value">{s.format(0)}</dd>
            </div>
          ))}
        </dl>

        <p className="metrics__note">
          Figures represent median results across institutional deployments, FY 2025.
          (Fictional — this is a concept experience.)
        </p>
      </div>
    </section>
  )
}
