import { lazy, Suspense, useEffect, useLayoutEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

import { sceneState } from './three/sceneState'
import { prefersReduced } from './utils/motion'

// Lazy-load the WebGL layer: three.js stays out of the critical path and
// streams in behind the preloader, so first paint is instant.
const Experience = lazy(() => import('./three/Experience'))
import Preloader from './components/Preloader'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Hero from './sections/Hero'
import Manifesto from './sections/Manifesto'
import Capabilities from './sections/Capabilities'
import Platform from './sections/Platform'
import Metrics from './sections/Metrics'
import Voices from './sections/Voices'
import Contact from './sections/Contact'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [ready, setReady] = useState(false)

  // Smooth scrolling (skipped entirely under prefers-reduced-motion)
  useEffect(() => {
    if (prefersReduced()) return
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    window.__lenis = lenis
    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      window.__lenis = null
    }
  }, [])

  // Global 3D choreography: the particle field morphs as the story advances.
  // (The pinned Platform section drives morph 1 → 3 in its own timeline.)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(sceneState, {
        morph: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '#capabilities',
          start: 'top bottom',
          end: 'top 15%',
          scrub: 0.6,
        },
      })
      // The hero's glass core dissolves as the thesis arrives.
      gsap.to(sceneState, {
        coreOpacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: '#thesis',
          start: 'top bottom',
          end: 'top 35%',
          scrub: true,
        },
      })
    })
    return () => ctx.revert()
  }, [])

  // Pointer parallax feed for the 3D rig
  useEffect(() => {
    const onMove = (e) => {
      sceneState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      sceneState.pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  const handleLoaded = () => {
    setReady(true)
    requestAnimationFrame(() => ScrollTrigger.refresh())
  }

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <Preloader onComplete={handleLoaded} />
      <Cursor />
      <Suspense fallback={null}>
        <Experience />
      </Suspense>
      <div className="grain" aria-hidden="true" />

      <Navbar ready={ready} />

      <main id="main">
        <Hero ready={ready} />
        <Manifesto />
        <Capabilities />
        <Platform />
        <Metrics />
        <Voices />
        <Contact />
      </main>

      <Footer />
    </>
  )
}
