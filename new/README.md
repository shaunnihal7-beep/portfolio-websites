# Walsh — Creative Studio (New York)

A high-end, single-page marketing site for a fictional creative studio. Warm
editorial "ink & paper" identity with an oversized display wordmark, cinematic
scroll motion, theme-inverting sections, and a bespoke cursor — built as a
static frontend (no backend/CMS).

## Run it

It's plain HTML/CSS/JS. Any static server works:

```bash
# Python
py -m http.server 8123
# then open http://localhost:8123
```

Opening `index.html` directly also works. The motion engine (GSAP, ScrollTrigger,
Lenis) is **vendored locally** in `js/vendor/`, so animations run even offline or
on networks that block CDNs. Fonts (Google Fonts) and imagery (Unsplash) still
load over the network; if they're unavailable the page falls back to system fonts
and empty image frames but stays fully functional. If the motion engine itself
ever fails to load, a boot-level safety net reveals all content as static.

## Structure

```
index.html        All markup: nav, hero, problems, gap, work, services,
                  process, faq, cta, footer, about drawer, mobile menu, cursor.
css/styles.css    Design system (tokens, type scale, theme inversion) + sections.
js/main.js        Motion & interaction engine.
js/vendor/        GSAP + ScrollTrigger + Lenis (vendored, no CDN needed).
```

## Hero

Full-viewport scene: an eyebrow tag, a two-line statement ("We make brands /
_impossible to ignore._"), primary + secondary CTAs, and a giant edge-to-edge
WALSH wordmark. The background is a live, warm gradient field rendered on a
half-resolution `<canvas>` (drifting blobs + subtle mouse parallax) with film
grain over it — static under reduced motion, and it pauses when off-screen.

## Design system

- **Palette** — warm paper `#f2ede4`, ink `#16140f`, single printer-red accent `#c1421a`.
  Sections declare `data-theme-section="light|dark"`; the fixed nav inverts to match.
- **Type** — Fraunces (editorial serif statements), Archivo / Archivo Black
  (grotesque UI + poster wordmarks), Space Mono (labels, counters, meta).
- **Texture** — generated SVG film grain overlay; halftone-dot wave in the footer.

## Motion (js/main.js)

Lenis smooth scroll + GSAP ScrollTrigger. Preloader → hero intro (masked line +
letter reveals), scroll-driven line-mask reveals, hero parallax, the "WE CLOSE
[image] THE GAP" split mechanic, stacking recede, auto + scroll-scrubbed
marquees, blend-mode services list with content-swap panel, testimonial slider,
single-open accordions, magnetic buttons, tilt, a lerp-follow custom cursor with
contextual labels, an opt-in WebAudio hover tick, a live New York clock, the
About drawer, and the mobile menu.

Robustness: under `prefers-reduced-motion` the site still animates, but only as
gentle opacity fades (no parallax, marquees, or large movement). If the motion
engine is missing or any boot step throws, a safety net forces every element
visible so the page is never left blank. Custom cursor, magnetic buttons, and
tilt are gated to fine-pointer, non-reduced-motion devices.

_Imagery via Unsplash. Studio name, case studies, stats, and quotes are fictional placeholder content._
