# AUREON — Capital that thinks ahead.

A premium, cinematic 3D concept site for a fictional AI-native finance company.
React + Three.js (react-three-fiber) + GSAP ScrollTrigger + Lenis.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle in dist/
npm run preview  # serve the production build
```

## The idea

One persistent GPU particle field sits behind the entire page and **morphs with
your scroll** — the shape *is* the story:

| Scroll chapter        | Shape          | Meaning                          |
| --------------------- | -------------- | -------------------------------- |
| Hero / Thesis         | Signal nebula  | Raw market signals, unstructured |
| Capabilities          | Torus knot     | Signals woven into structure     |
| Platform · 02 Reason  | Double helix   | Continuous reasoning             |
| Platform · 03 Act →   | Orbital halo   | A clean, executed order          |

## Structure

```
src/
  App.jsx                 shell: Lenis, global scroll→3D choreography
  three/
    sceneState.js         mutable bridge between GSAP and the render loop
    Experience.jsx        the single fixed <Canvas> (lazy-loaded chunk)
    ParticleField.jsx     the signature morphing particle system
    Core.jsx              fresnel glass core (hero)
    Rig.jsx               ambient rotation + pointer parallax
    geometries.js         procedural morph targets (no assets)
    shaders.js            custom GLSL — unlit, no lights or shadows
  sections/               Hero · Manifesto · Capabilities · Platform ·
                          Metrics · Voices · Contact
  components/             Preloader · Cursor · Navbar · MagneticButton · Footer
  styles/                 base (tokens) · components · sections
  utils/motion.js         reduced-motion, word splitting, smooth anchors
```

## Performance decisions

- **2 draw calls total** — one `<points>` + one fresnel mesh. Morph targets are
  vertex attributes; morphing costs a single uniform update.
- **Zero textures / zero fetched assets** — everything procedural; GPU memory
  footprint is a few MB of vertex data.
- **Clamped DPR** (1.75 desktop / 1.5 touch), `antialias: false`, no
  postprocessing. Touch devices get ~5k particles instead of ~11k.
- **Lazy WebGL** — three.js loads as an async chunk behind the preloader;
  first paint ships ~75 kB gzipped.
- **Transform/opacity-only** DOM animation; custom cursor and magnetic buttons
  mount only for `(hover: hover) and (pointer: fine)`.
- `prefers-reduced-motion` disables smooth-scroll hijacking, intro
  choreography and continuous loops.

## Before a real deploy

- Replace `fakeSubmit` in `src/sections/Contact.jsx` with a real endpoint.
- Set the real domain in `index.html` (canonical, og:url, JSON-LD) and add a
  1200×630 `og:image`.
- This is an SPA; for stronger SEO, prerender (e.g. `vite-plugin-ssr`/SSG) so
  crawlers get the HTML without executing JS.

All names, quotes and figures are fictional.
