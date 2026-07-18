import { useEffect, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import MagneticButton from '../components/MagneticButton'
import { scrollToTarget, prefersReduced } from '../utils/motion'

/**
 * Section 1 — Hero. Cinematic opening over the signal nebula:
 * masked line reveals, then a slow parallax exit as the story begins.
 */
export default function Hero({ ready }) {
  const root = useRef(null)

  // Intro choreography, gated on the preloader lifting
  useEffect(() => {
    if (!ready || !root.current) return
    const q = gsap.utils.selector(root.current)

    if (prefersReduced()) {
      gsap.set(q('.hero__line-inner, .hero__eyebrow, .hero__sub, .hero__cta, .hero__foot'), {
        y: 0,
        opacity: 1,
      })
      return
    }

    const tl = gsap.timeline({ delay: 0.25, defaults: { ease: 'power4.out' } })
    tl.to(q('.hero__line-inner'), { y: 0, duration: 1.3, stagger: 0.12 })
      .to(q('.hero__eyebrow'), { opacity: 1, y: 0, duration: 0.9 }, 0.35)
      .to(q('.hero__sub'), { opacity: 1, y: 0, duration: 0.9 }, 0.65)
      .to(q('.hero__cta'), { opacity: 1, y: 0, duration: 0.9 }, 0.8)
      .to(q('.hero__foot'), { opacity: 1, duration: 1.2 }, 1.05)
  }, [ready])

  // Parallax exit while scrolling away
  useLayoutEffect(() => {
    if (prefersReduced()) return
    const ctx = gsap.context(() => {
      gsap.to('.hero__content', {
        yPercent: -18,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom 40%',
          scrub: true,
        },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="hero" className="hero" ref={root}>
      <div className="container hero__content">
        <p className="hero__eyebrow">Aureon · AI-native finance</p>

        <h1 className="hero__title">
          <span className="hero__line">
            <span className="hero__line-inner">Capital that</span>
          </span>
          <span className="hero__line">
            <span className="hero__line-inner">
              thinks <em>ahead.</em>
            </span>
          </span>
        </h1>

        <p className="hero__sub">
          Aureon is the intelligence layer for modern capital — predictive models,
          autonomous risk and adaptive execution for institutions that move first.
        </p>

        <div className="hero__cta">
          <MagneticButton
            className="btn--gold"
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollToTarget('#contact') }}
          >
            Start a conversation
          </MagneticButton>
          <a
            className="link-arrow"
            href="#platform"
            onClick={(e) => { e.preventDefault(); scrollToTarget('#platform') }}
          >
            Explore the platform
          </a>
        </div>
      </div>

      <div className="hero__foot">
        <span className="hero__scroll" aria-hidden="true">
          <span className="hero__scroll-line" />
          Scroll
        </span>
        <span className="hero__ticker" aria-hidden="true">
          12.4B signals · live
        </span>
      </div>
    </section>
  )
}
