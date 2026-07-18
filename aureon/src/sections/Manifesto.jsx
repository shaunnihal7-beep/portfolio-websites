import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { splitWords } from '../utils/motion'

/**
 * Section 2 — Thesis. A single editorial statement that resolves
 * word-by-word as you scroll, like conviction forming.
 */
export default function Manifesto() {
  const root = useRef(null)
  const textRef = useRef(null)

  useLayoutEffect(() => {
    if (!textRef.current) return
    const words = splitWords(textRef.current)

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0.13 },
        {
          opacity: 1,
          ease: 'none',
          stagger: 0.6,
          scrollTrigger: {
            trigger: root.current,
            start: 'top 72%',
            end: 'bottom 78%',
            scrub: 0.4,
          },
        }
      )
      gsap.from('.manifesto__aside', {
        opacity: 0,
        y: 32,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.manifesto__aside', start: 'top 88%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="thesis" className="manifesto" ref={root}>
      <div className="container">
        <p className="eyebrow">Our thesis</p>
        <p className="manifesto__text" ref={textRef}>
          Markets move in milliseconds. Institutions move in meetings. Aureon closes
          that gap — systems that read risk in real time, learn from every signal,
          and act with conviction, so capital flows to where the future is being built.
        </p>
        <div className="manifesto__aside">
          <p>
            We were founded on a simple conviction: the next decade of finance belongs
            to firms that treat intelligence as infrastructure.
          </p>
          <p>We build that infrastructure — quietly, rigorously, at institutional scale.</p>
        </div>
      </div>
    </section>
  )
}
