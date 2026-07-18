import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { prefersReduced } from '../utils/motion'

const QUOTES = [
  {
    quote:
      'Aureon didn’t replace our judgment. It sharpened it — every position we take is now backed by evidence we can interrogate.',
    name: 'Elena Marsh',
    role: 'CIO · Northwind Capital',
  },
  {
    quote:
      'The risk engine caught a correlation break three days before it hit the tape. That alone paid for the platform.',
    name: 'Dario Fen',
    role: 'Head of Risk · Meridian Bank',
  },
  {
    quote:
      'It feels less like software and more like a partner who never sleeps and never panics.',
    name: 'Amara Osei',
    role: 'Partner · Halcyon Ventures',
  },
]

/**
 * Section 6 — Voices. A horizontal drift: the card row translates
 * sideways as the page scrolls past, a quiet lateral beat between
 * the metrics and the close.
 */
export default function Voices() {
  const root = useRef(null)
  const track = useRef(null)

  useLayoutEffect(() => {
    if (prefersReduced()) return
    const ctx = gsap.context(() => {
      gsap.to(track.current, {
        x: () => {
          const wrap = track.current.parentElement
          return -Math.max(0, track.current.scrollWidth - wrap.clientWidth)
        },
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top 75%',
          end: 'bottom 20%',
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      })
      gsap.from('.voices__head > *', {
        opacity: 0,
        y: 32,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 85%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="voices" className="voices" ref={root}>
      <div className="container voices__head">
        <p className="eyebrow">Voices</p>
        <h2 className="h2">Trusted in the rooms that matter.</h2>
      </div>

      <div className="voices__viewport">
        <ul className="voices__track" ref={track}>
          {QUOTES.map((q) => (
            <li className="voice-card" key={q.name}>
              <p className="voice-card__quote">“{q.quote}”</p>
              <footer className="voice-card__meta">
                <span className="voice-card__monogram" aria-hidden="true">
                  {q.name[0]}
                </span>
                <div>
                  <p className="voice-card__name">{q.name}</p>
                  <p className="voice-card__role">{q.role}</p>
                </div>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
