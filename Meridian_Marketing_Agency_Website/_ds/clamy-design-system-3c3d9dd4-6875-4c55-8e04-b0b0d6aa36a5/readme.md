# clamy Design System

### MONOLOG Studio — Brand & Web Experience

---

## Overview

MONOLOG is a brand and web-experience studio founded by Huy (By Huy) Nguyen in 2022. Based in Hanoi City, Vietnam and Melbourne, Australia, working worldwide. The studio builds change-making website experiences for established brands whose reputation has outgrown their digital presence.

**Tagline:** "Refuse to be underestimated."

**Services:** Brand Strategy · Visual Identity · Website Strategy · Website Design · Website Development · 3D Development

---

## Sources

This design system was built from the following provided materials:

- **`design-reference/`** — Full-page screenshots across desktop, tablet, and mobile breakpoints, plus UI state captures (hover, modal, menu). These are the primary visual ground truth.
- **`uploads/index.html`** — Production HTML source file. Used for component structure, class naming conventions, font choices, and interaction architecture (custom cursor, preloader, GSAP/Lenis patterns).
- **GitHub: [pbakaus/impeccable](https://github.com/pbakaus/impeccable)** — Impeccable design skill for AI coding agents. Referenced as a tool for ongoing design quality enforcement. Explore this repo to understand how to apply design governance rules on top of this brand system.

**Note on the logo:** The MONOLOG wordmark uses custom letterforms — a spiral glyph replacing the first O, and a square frame glyph replacing the second O. These glyphs are not reproducible in standard typefaces. Placeholder text "MONOLOG" in Archivo Black is used wherever the custom wordmark would appear. **Request SVG logo assets from the studio.**

---

## Content Fundamentals

### Voice

Direct, confident, zero hedging. Impeccable speaks like a design director who has seen everything and knows exactly what's wrong. MONOLOG writes like a founder who has seen the same failure pattern a thousand times and is done being subtle about it.

- **Direct:** "Great founders deserve a presence as powerful as what they're building." Not "We help founders potentially improve their presence."
- **Specific:** "$2M+ in new projects within 3 months of launch." Not "significant growth."
- **Founder-voiced:** Copy is often first-person from Huy. "Hey I'm Huy. I started MONOLOG because I watched exceptional founders stay invisible..."
- **Concrete results front-loaded:** Stats appear before explanations. Numbers are organic ($2M+, 58%, 30+, 60,000 — never round or predictable).

### Tone

Authoritative but not distant. The brand respects the reader's intelligence, assumes they already know they have a problem, and gets straight to the solution.

### Casing

- Section labels: ALL CAPS tracked mono ("REAL CLIENT STORIES", "STEP · 01")
- Navigation: Sentence case ("About", "Work")
- Headlines: Sentence case or Title Case for short punchy lines ("PROJECT JOURNEY", "We uncover your story")
- MONOLOG is always fully capitalised

### Pronouns

We/you. Studio-as-team speaks as "we". Direct address to the client as "you."

### No emoji. No hedging words. No startup clichés.

---

## Visual Foundations

### Color

Two modes, used in alternating sections — never mixed within one viewport:

| Role | Token | Value |
| --- | --- | --- |
| Dark ground | `--ground` | `oklch(8% 0.005 95)` — warm near-black |
| Dark deep | `--ground-deep` | `oklch(5% 0.003 95)` |
| Dark panel | `--surface` | `oklch(13% 0.005 95)` |
| Light bg | `--paper` | `oklch(94% 0.012 80)` — warm cream (#f2ede4) |
| Light raised | `--paper-raised` | `oklch(97% 0.008 80)` |
| Text on dark | `--ink` | `oklch(93% 0.003 80)` — near-white |
| Text muted (dark) | `--ink-muted` | `oklch(65% 0.002 80)` |
| Text faint (dark) | `--ink-faint` | `oklch(42% 0.002 80)` |
| Text on light | `--text` | `oklch(12% 0.010 80)` — near-black |
| Text muted (light) | `--text-muted` | `oklch(45% 0.008 80)` |
| Accent | `--accent` | `oklch(47% 0.175 35)` — rust/burnt orange |
| Rule (dark) | `--rule` | `oklch(100% 0 0 / 0.09)` |
| Rule (light) | `--rule-paper` | `oklch(0% 0 0 / 0.09)` |

**The accent rule:** The rust dot appears only as a status signal — one small dot (●) before a section label. It is never used on text, backgrounds, or as a fill. Extreme restraint.

**Color rhythm:** Hero → dark. Stats → dark. Work/portfolio → LIGHT (warm cream). Services → dark. Process → dark. FAQ → ambiguous/dark. CTA → dark over B&W photo. Footer → dark.

### Typography

- **Archivo Black** (weight 900): Display and headline. Every major statement. The brand's visual signature.
- **Archivo** (weight 400–700): Body, navigation, UI. The invisible workhorse.
- **Space Mono**: All technical labels, counters, index numbers. Always uppercase with tracking.
- **Fraunces** (optional): Italic serif for editorial pull-quotes only — not currently used prominently but loaded.

**Scale philosophy:** Headlines at viewport-filling scale. "PROJECT JOURNEY" spans full width. The MONOLOG wordmark at the bottom of the hero is multiple hundred pixels. Restraint is expressed through near-silence in the body copy, not in the headlines. Section-level type is 900 weight; only body drops to 400.

**Tracking:** Body and headlines: tight (`-0.02em`). Mono labels: wide (`+0.15em`). This contrast is as important as the weight contrast.

### Grain Texture

Heavy halftone-style grain runs over all dark sections as a fixed `pointer-events: none` overlay. Applied via SVG `feTurbulence` filter:

```html
<filter id="grain">
  <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch" />
  <feColorMatrix type="saturate" values="0" />
</filter>
```

The grain overlay is `position: fixed; inset: 0; z-index: 9999; opacity: 0.35`. At the very bottom of the footer, a halftone dot-pattern wave transitions from dark to cream — this is the brand's decorative signature moment.

### Corners & Borders

Sharp. Radius is `0` on almost everything. Minimal `2px` on a few utility elements (inline code, small chips). No card shadows — depth comes from background contrast between sections. Hairline borders (`1px`) at very low opacity.

### Hover States

- **Buttons:** Background lightens slightly, no translate
- **Service items:** Inactive items are `--ink-faint`, active/hovered item is `--ink` (full opacity)
- **Work cards:** Subtle image scale (`scale(1.02)`) inside overflow-hidden container
- **Footer links:** Opacity shift

### Animation

- **GSAP + ScrollTrigger:** For all scroll-driven reveals and parallax
- **Lenis:** Smooth scroll
- **Custom cursor:** Expanding ring + small dot, follows mouse. Label shows on hover targets.
- **Preloader:** Counts 0→100, bar fills, then fades out
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` — fast exponential out. No bounce. No elastic.
- **Split text:** Headlines animate character-by-character from below
- **Marquee:** Infinite horizontal scroll, reverses/speeds on interaction

### Imagery

- Editorial photography — concrete, contextual, not stock-generic
- Often monochromatic or desaturated in the CTA section
- Real project imagery (architecture, people, studio)
- Grain from the CSS overlay unifies all photos with the brand texture

### Layout

- `max-width: 1400px` with `clamp(1.5rem, 5vw, 4rem)` gutters
- No card grid layouts — content stacks in full-width sections or asymmetric splits
- Work section: left-aligned image (65%) + right info (35%), stacked vertically per project
- Services: left 1/3 testimonial slider + right 2/3 services list
- Process: full-width giant heading + 2-col step list
- Footer: left large nav links + right location/meta

---

## Iconography

No icon system is used. The brand relies on:

- **Custom letterforms** in the MONOLOG wordmark (spiral, square glyphs)
- **Unicode/SVG arrows** for CTAs: `→`, `↑`, `↗`, diagonal SVG paths for button arrows
- **Globe wireframe SVG** in the hero (low-opacity, fine-line illustration)
- **AI tool logos** in the footer "Ask AI about MONOLOG" block — Claude, Gemini, ChatGPT, Perplexity, Anthropic icons
- **Accent dot** `●` before section labels (in --accent rust color)
- **Decorative asterisk** `✳` as marquee separator

No icon font. No Phosphor, Lucide, or Heroicons. Keep visuals typographic or custom SVG.

---

## File Index

```
styles.css                       ← global CSS entry point (consumers link this)
tokens/
  colors.css                     ← surface, text, accent, rule tokens
  typography.css                 ← font families + type scale
  spacing.css                    ← space scale, layout, radius
  effects.css                    ← easing, duration, grain, shadow
components/
  buttons/                       ← Button — primary, outline, ghost
  badge/                         ← Badge — stat result pill
  card/                          ← WorkCard — project work card
  accordion/                     ← Accordion — process steps + FAQ
  marquee/                       ← Marquee — infinite scrolling band
guidelines/                      ← Foundation specimen cards
assets/                          ← (no logo files provided — see note above)
ui_kits/
  website/                       ← Full MONOLOG marketing website recreation
readme.md                        ← this file
SKILL.md                         ← Claude Code / AI skill descriptor
```

### Intentional additions

- **`Marquee`** — not explicitly a named component in the source but appears in multiple sections; extracted as a reusable primitive.
- **`Badge`** — the "pill" result component from work cards; named for clarity.

---

## Impeccable Integration

This design system works well with the [Impeccable](https://github.com/pbakaus/impeccable) skill (`npx impeccable install`). Once installed in your AI coding tool, use `/impeccable audit` to check any new UI against MONOLOG's anti-patterns, and `/impeccable polish` before shipping. The Impeccable repo contains 45 deterministic detector rules that catch generic AI design tells — exactly the kind of drift this brand cannot afford.
