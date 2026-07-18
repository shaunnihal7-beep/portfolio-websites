# CLAUDE.md — Walsh Creative Studio

Instructions for working in this repo, plus a **replication guide**: enough spec to
rebuild this website from scratch. Read this before editing.

---

## 1. What this is

A high-end, single-page marketing site for **Walsh**, a fictional creative studio in
New York. Warm editorial "ink & paper" identity, oversized display wordmark, cinematic
scroll motion, theme-inverting sections, bespoke cursor. **Plain static frontend** —
no framework, no build step, no backend/CMS.

It is a homage/rebuild of **MONOLOG** (`bymonolog.com`). The reverse-engineered
ground-truth spec of that reference lives in `design.md`, with screenshots in
`design-reference/`. When replicating look & motion, `design.md` is the source of truth
for the *reference*; this file describes the *Walsh implementation*.

**Design intent: this is a motion-first site, not a static one.** Rich scroll motion is
the point. It must never silently degrade to a static page (see §6).

---

## 2. Run & view

It's plain HTML/CSS/JS — any static server works. Two supported ways:

```bash
py -m http.server 8123        # → http://localhost:8123
# or (matches .claude/launch.json):
npx --yes serve -l 3000 .     # → http://localhost:3000
```

Opening `index.html` directly (`file://`) also works — GSAP/ScrollTrigger/Lenis are
vendored in `js/vendor/`, so motion runs offline. Google Fonts + Unsplash images still
need the network; without it the page falls back to system fonts / empty frames but
stays functional.

### ⚠️ Caching gotcha (important)
`py -m http.server` and `npx serve` send **no cache headers**, so browsers reuse a
cached `js/main.js` / `css/styles.css` even after you edit them. A `?v=` query on the
page URL does **not** bust sub-resources. Always **hard-refresh (Ctrl+Shift+R)**, or
DevTools → Network → "Disable cache", after editing. If a change "isn't showing," this
is almost always why.

### Verifying changes
Drive the running server with a real browser (Playwright) — check the console for
errors, click nav links, scroll the whole page, and screenshot the affected section.
Don't trust `file://` for automated checks (Playwright blocks the `file:` protocol).

---

## 3. File structure

```
index.html        All markup: nav, hero, problems, gap, work, services, process,
                  faq, cta, footer, about drawer, mobile menu, cursor, preloader.
css/styles.css    Design system (tokens, type scale, theme inversion) + all sections.
js/main.js        Motion & interaction engine (one IIFE, progressively enhanced).
js/vendor/        gsap.min.js, ScrollTrigger.min.js, lenis.min.js (v3.13 / v1.1.14).
design.md         Ground-truth spec of the MONOLOG reference site.
design-reference/ Reference screenshots (desktop/tablet/mobile + states).
README.md         Short public-facing readme.
.claude/launch.json  `npx serve` config on port 3000.
```

There is **no CLAUDE.md-driven build**; edit the three source files directly.

---

## 4. Design system (replication reference)

All tokens are CSS custom properties in `css/styles.css` `:root`.

**Palette** — warm paper vs ink, single printer-red accent:
| Token | Value | Role |
|---|---|---|
| `--paper` / `--paper-2` / `--paper-3` | `#f2ede4` / `#e9e2d5` / `#ded6c6` | light surfaces |
| `--ink` / `--ink-2` / `--ink-3` | `#16140f` / `#201d16` / `#2c281f` | dark surfaces / text |
| `--accent` / `--accent-2` | `#c1421a` / `#d95a2b` | printer red (single accent) |

**Type** — three families doing distinct jobs (loaded from Google Fonts):
- `--f-serif` **Fraunces** (opsz) — editorial statement headings.
- `--f-grotesk` **Archivo** + `--f-black` **Archivo Black** — UI text + poster wordmarks.
- `--f-mono` **Space Mono** — labels, counters, eyebrows, meta.

**Layout** — `--maxw: 1600px`, fluid `--margin: clamp(18px,3.4vw,44px)`, `--gutter`.
**Motion eases** — `--ease-out`, `--ease-inout`, `--ease-back` (see `:root`).

**Theme inversion** — every section declares `data-theme-section="light|dark"`, which
re-maps `--bg/--fg/--muted/--line/--card`. The fixed nav inverts to match the section
under it (driven by JS `themeSwitch()` toggling `html[data-theme-nav]`).

**Texture** — SVG film-grain overlay (`#grain` filter + `.grain` div); halftone-dot
wave in the footer.

---

## 5. Page structure & sections (top → bottom)

`<main data-barba="container">` (Barba attr is vestigial — no Barba.js loaded) contains,
in order:

1. **Hero** (`data-theme-section="light"`) — full-viewport. Two-line Fraunces statement
   ("We make brands / _impossible to ignore._"), primary + secondary CTA, giant
   edge-to-edge **WALSH** wordmark. Background = live warm-gradient blob field on a
   half-res `<canvas>` (`heroBackground()`) + film grain. **No eyebrow pill** — it was
   removed; do not reintroduce `.hero__eyebrow`.
2. **Problems** (`dark`, `data-stack`) — big stat (`40+`), founder quote, "Trusted by"
   auto-marquee.
3. **Gap** (`dark`) — "WE CLOSE [image] THE GAP" scroll-driven split mechanic.
4. **Work** (`light`, `#work`) — six `.work-card`s (image + info + result pill).
   Scroll-scrubbed "Selected Work" band marquee.
5. **Services** (`dark`, `#services`) — testimonial slider + blend-mode services list
   with an image-swap panel.
6. **Process** (`dark`, `#process`) — char-reveal heading + single-open accordion steps.
7. **FAQ** (`light`) — single-open accordion.
8. **CTA** (`dark`, `#contact`) — masked line-reveal heading + magnetic button.
9. **Footer** (`dark`) — nav, live New York clock, halftone wave, oversized wordmark.

Plus overlays: **About drawer** (`[data-about]`, opened by any `[data-open-about]`),
**mobile menu** (`[data-menu]`), **custom cursor** (`[data-cursor]`), **preloader**.

Data-attributes are the JS contract — e.g. `data-reveal`, `data-split-line`,
`data-split-reveal[="chars"]`, `data-tilt`, `data-magnetic`, `data-cursor-hover`,
`data-marquee`, `data-accordion` / `-group` / `-toggle` / `-body` / `-open`,
`data-slider*`, `data-service*`. Keep these intact when editing markup.

---

## 6. Motion engine (`js/main.js`) — key decisions

One IIFE. Boots on DOMContentLoaded; every feature self-gates and there's a `failSafe()`
that force-reveals all content if the motion stack throws (so the page is never blank).

Capability flags at top:
- `hasGSAP` / `hasLenis` — libraries present.
- `fine` — `(hover:hover) and (pointer:fine)`; gates cursor / magnetic / tilt.
- **`reduced` is hard-set to `false`** — this site is deliberately **motion-first** and
  does **not** downgrade under the OS `prefers-reduced-motion` setting. The original
  behavior turned the site nearly static for such users; that was removed intentionally.
  (Trade-off: overrides that accessibility preference by design. If you ever restore it,
  restore the nav fallback in §7 too.)

Pipeline: `initScroll()` (Lenis + GSAP ticker) → interactions (accordions, slider,
services, drawers, clock, anchors, hero canvas) → motion enhancements (cursor, magnetic,
tilt, nav hide/show, theme switch, parallax, gap, stack recede, marquees) →
`scrollHealth()` → fonts-ready → `buildReveals()` → preloader → `heroIntro()`.

### `scrollHealth()` — keeps scroll motion alive over time (do not remove)
Fixes two real failure modes that made animations "act weird / stop after a few minutes":
- **Scrub drift:** lazy `<img>`s change page height as they decode, leaving
  ScrollTrigger start/end points stale. → refresh ScrollTrigger on each image `load`
  and on `window.load` (debounced).
- **Tab-throttle desync:** backgrounding the tab throttles rAF (which drives Lenis via
  `gsap.ticker` with `lagSmoothing(0)`); on return Lenis + ScrollTrigger desync and
  never recover. → on `visibilitychange`/`focus`/`pageshow`, re-arm Lenis
  (`lenis.start()`, unless `body.is-locked`) and refresh ScrollTrigger.

---

## 7. Gotchas / conventions

- **Nav / anchor links:** handled by `anchors()` → `scrollTo()`. `scrollTo()` must
  handle a **DOM element** target even when `lenis` is null (native `scrollIntoView`
  fallback) — otherwise nav links silently do nothing. Placeholder `href="#"` links
  (work cards, footer Instagram) get a `preventDefault` so they don't jump to top.
- **Images:** Unsplash URLs (`images.unsplash.com/photo-…?w=…&q=80&auto=format&fit=crop`).
  When swapping, verify the ID returns 200 **and** visually matches (200 only means the
  ID exists). Keep work images relevant to each fictional client (Meridian=architecture,
  Northbound=creative agency, Cedar & Vale=hospitality, Lumen Type=type foundry,
  Harbor House=waterfront real estate, Provision=fintech).
- **Cursor labels:** `data-cursor-label="…"` shows a word in the cursor on hover. Work
  cards intentionally have **no** label (the "View" label was removed).
- **Vendored libs are the point** — keep GSAP/ScrollTrigger/Lenis local so motion works
  offline / behind CDN blocks. Don't switch to CDN `<script>`s.
- Content (studio name, case studies, stats, quotes, awards) is **fictional placeholder**.

---

## 8. Rebuild-from-scratch checklist

1. `index.html` shell: fonts preconnect + Google Fonts link, `css/styles.css`, vendored
   scripts in order **gsap → ScrollTrigger → lenis → main.js**. Set
   `<html class="no-js" data-theme="light" data-theme-nav="light">` and flip `no-js`→`js`
   in an inline head script before paint.
2. `css/styles.css`: reset → tokens (§4) → `[data-theme-section]` maps → base → each
   section. Fluid `clamp()` sizing, no shadows, grain overlay.
3. Markup the 9 sections + overlays (§5) with the data-attribute contract (§6).
4. `js/main.js`: single IIFE, capability flags (`reduced=false`), the boot pipeline,
   and `scrollHealth()`. Keep `failSafe()`.
5. Verify against `design-reference/` screenshots; run a server and hard-refresh.
