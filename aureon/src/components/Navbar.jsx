import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MagneticButton from './MagneticButton'
import { scrollToTarget, prefersReduced } from '../utils/motion'

const LINKS = [
  { label: 'Thesis', hash: '#thesis' },
  { label: 'Capabilities', hash: '#capabilities' },
  { label: 'Platform', hash: '#platform' },
  { label: 'Metrics', hash: '#metrics' },
  { label: 'Voices', hash: '#voices' },
  { label: 'Contact', hash: '#contact' },
]

/**
 * Contextual navigation: hides on scroll down, returns on scroll up,
 * gains a frosted backdrop once the hero is left behind.
 */
export default function Navbar({ ready }) {
  const nav = useRef(null)
  const [open, setOpen] = useState(false)

  // Entrance once the preloader lifts
  useEffect(() => {
    if (!ready || !nav.current) return
    gsap.fromTo(
      nav.current,
      { y: prefersReduced() ? 0 : -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.35 }
    )
  }, [ready])

  // Hide / reveal on scroll direction + scrolled state
  useEffect(() => {
    const el = nav.current
    if (!el) return
    const st = ScrollTrigger.create({
      start: 'top top',
      end: 'max',
      onUpdate: (self) => {
        el.classList.toggle('is-scrolled', self.scroll() > 60)
        if (self.scroll() < 120) {
          el.classList.remove('is-hidden')
          return
        }
        el.classList.toggle('is-hidden', self.direction === 1)
      },
    })
    return () => st.kill()
  }, [])

  // Lock page scroll while the mobile menu is open
  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
    if (window.__lenis) open ? window.__lenis.stop() : window.__lenis.start()
  }, [open])

  const go = (e, hash) => {
    e.preventDefault()
    setOpen(false)
    // let the menu close before the glide starts
    setTimeout(() => scrollToTarget(hash), open ? 250 : 0)
  }

  return (
    <>
      <header className="nav" ref={nav}>
        <div className="nav__inner">
          <a
            href="#hero"
            className="nav__brand"
            aria-label="Aureon — back to top"
            onClick={(e) => go(e, '#hero')}
          >
            AUREON<span className="nav__brand-dot">.</span>
          </a>

          <nav className="nav__links" aria-label="Primary">
            {LINKS.map((l) => (
              <a key={l.hash} href={l.hash} onClick={(e) => go(e, l.hash)}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className="nav__actions">
            <MagneticButton
              className="btn--gold nav__cta"
              href="#contact"
              onClick={(e) => go(e, '#contact')}
            >
              Start a conversation
            </MagneticButton>
            <button
              className={`nav__burger ${open ? 'is-open' : ''}`}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" className={`menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <nav className="menu__links" aria-label="Mobile">
          {LINKS.map((l, i) => (
            <a
              key={l.hash}
              href={l.hash}
              style={{ transitionDelay: open ? `${0.08 + i * 0.05}s` : '0s' }}
              onClick={(e) => go(e, l.hash)}
              tabIndex={open ? 0 : -1}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <p className="menu__note">hello@aureon.finance</p>
      </div>
    </>
  )
}
