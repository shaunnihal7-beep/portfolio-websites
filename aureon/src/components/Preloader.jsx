import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { prefersReduced } from '../utils/motion'

/**
 * Entry sequence: brand mark + counting index, then the curtain lifts.
 * The only real payload is fonts, so the count is choreography — it paces
 * the reveal so the first frame of the hero always lands composed.
 */
export default function Preloader({ onComplete }) {
  const root = useRef(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return

    if (prefersReduced()) {
      el.style.display = 'none'
      onComplete?.()
      return
    }

    const num = el.querySelector('.preloader__num')
    const fill = el.querySelector('.preloader__fill')
    const mark = el.querySelector('.preloader__mark')
    const state = { p: 0 }

    const tl = gsap.timeline({ delay: 0.2 })
    tl.to(mark, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
      .to(
        state,
        {
          p: 100,
          duration: 1.5,
          ease: 'power2.inOut',
          onUpdate: () => {
            num.textContent = String(Math.round(state.p)).padStart(3, '0')
          },
        },
        0.1
      )
      .to(fill, { scaleX: 1, duration: 1.5, ease: 'power2.inOut' }, 0.1)
      .add(() => onComplete?.(), '-=0.05')
      .to(el, { yPercent: -100, duration: 0.95, ease: 'power4.inOut' }, '+=0.15')
      .set(el, { display: 'none' })

    return () => tl.kill()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="preloader" ref={root} role="status" aria-label="Loading Aureon">
      <div className="preloader__mark">
        AUREON<span className="preloader__dot">.</span>
      </div>
      <div className="preloader__meta">
        <span className="preloader__num">000</span>
        <div className="preloader__bar">
          <div className="preloader__fill" />
        </div>
      </div>
    </div>
  )
}
