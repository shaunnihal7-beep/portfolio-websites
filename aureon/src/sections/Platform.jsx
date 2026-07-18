import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { sceneState } from '../three/sceneState'
import { prefersReduced } from '../utils/motion'

/**
 * Section 4 — Platform. The pinned centerpiece: the viewport locks and the
 * pipeline plays out in three acts while the particle field morphs
 * knot → helix → halo behind the copy. Numbered because it truly is a
 * sequence — signals go in, reasoning happens, orders come out.
 */
const STEPS = [
  {
    n: '01',
    name: 'Ingest',
    title: 'Every signal, one stream.',
    copy: 'Market feeds, macro indicators, filings and alternative data — normalized into a single living model of the market.',
  },
  {
    n: '02',
    name: 'Reason',
    title: 'Context, not just correlation.',
    copy: 'Aureon weighs scenarios the way your best analysts do — then does it a million more times before lunch.',
  },
  {
    n: '03',
    name: 'Act',
    title: 'Execution at the speed of thought.',
    copy: 'From insight to order in milliseconds, with guardrails your risk committee will actually sign off on.',
  },
]

export default function Platform() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const reduced = prefersReduced()
    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray('.pstep')
      const fill = root.current.querySelector('.platform__progress-fill')

      // Initial stack state: only step one visible
      gsap.set(steps, { autoAlpha: 0, y: reduced ? 0 : 44 })
      gsap.set(steps[0], { autoAlpha: 1, y: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=260%',
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
        },
      })

      // Act I → Act II
      tl.to(steps[0], { autoAlpha: 0, y: reduced ? 0 : -44, duration: 0.35 }, 0.9)
        .to(steps[1], { autoAlpha: 1, y: 0, duration: 0.4 }, 1.05)
        .to(sceneState, { morph: 2, duration: 0.8, ease: 'none' }, 0.75)
        // Act II → Act III
        .to(steps[1], { autoAlpha: 0, y: reduced ? 0 : -44, duration: 0.35 }, 2.1)
        .to(steps[2], { autoAlpha: 1, y: 0, duration: 0.4 }, 2.25)
        .to(sceneState, { morph: 3, duration: 0.8, ease: 'none' }, 1.95)
        // progress rail
        .fromTo(fill, { scaleY: 1 / 3 }, { scaleY: 1, duration: 2.9, ease: 'none' }, 0)
        .addLabel('end', 3)

      tl.to({}, { duration: 0.4 }) // tail room so Act III breathes before unpin
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="platform" className="platform" ref={root}>
      <div className="container platform__inner">
        <header className="platform__head">
          <p className="eyebrow">The platform</p>
          <h2 className="h2">From signal to order.</h2>
        </header>

        <div className="platform__stage">
          <div className="platform__steps">
            {STEPS.map((s) => (
              <div className="pstep" key={s.n}>
                <span className="pstep__index" aria-hidden="true">{s.n}</span>
                <p className="pstep__name">{s.name}</p>
                <h3 className="pstep__title">{s.title}</h3>
                <p className="pstep__copy">{s.copy}</p>
              </div>
            ))}
          </div>

          <div className="platform__progress" aria-hidden="true">
            <div className="platform__progress-fill" />
          </div>
        </div>
      </div>
    </section>
  )
}
