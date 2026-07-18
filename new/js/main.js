/* ============================================================
   WALSH — motion & interaction engine
   GSAP + ScrollTrigger + Lenis. Progressive-enhanced,
   degrades gracefully if the animation stack is unavailable.
   ============================================================ */
(function () {
  'use strict';

  const html = document.documentElement;
  const body = document.body;
  // Motion-first: this is a motion-led site, not a static one, so we do NOT
  // downgrade to the near-static experience when the OS requests reduced motion.
  // (If GSAP fails to load, the failSafe below still reveals all content.)
  const reduced = false;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGSAP = !!(window.gsap && window.ScrollTrigger);
  const hasLenis = !!window.Lenis;
  // full motion = big movement/parallax/scrub. reduced still allows gentle opacity fades.
  const motion = hasGSAP && !reduced;

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;

  if (!hasGSAP) html.classList.add('no-motion');

  let gsap, ScrollTrigger, lenis;
  if (hasGSAP) {
    gsap = window.gsap;
    ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ---------------------------------------------------------
     SMOOTH SCROLL (Lenis) — skipped under reduced motion
  --------------------------------------------------------- */
  function initScroll() {
    if (!hasLenis || !hasGSAP || reduced) return;
    lenis = new window.Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  function scrollTo(target, opts) {
    if (lenis) { lenis.scrollTo(target, Object.assign({ duration: 1.1 }, opts)); return; }
    // No Lenis (e.g. it failed to load): fall back to native scrolling so anchor
    // links still work. Accept a selector string, a DOM element, or a Y offset.
    if (typeof target === 'string') target = $(target);
    if (target instanceof Element) {
      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: reduced ? 'auto' : 'smooth' });
    }
  }

  /* ---------------------------------------------------------
     TEXT SPLITTING helpers
  --------------------------------------------------------- */
  function wrapLine(el) {
    const line = document.createElement('span');
    line.className = 'split-line';
    const inner = document.createElement('span');
    inner.className = 'split-line__inner';
    while (el.firstChild) inner.appendChild(el.firstChild);
    line.appendChild(inner);
    el.appendChild(line);
    return inner;
  }

  function splitLines(el) {
    const text = el.textContent.replace(/\s+/g, ' ').trim();
    const words = text.split(' ');
    el.textContent = '';
    const spans = words.map((w, i) => {
      const s = document.createElement('span');
      s.style.display = 'inline-block';
      s.textContent = w;
      el.appendChild(s);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
      return s;
    });
    const lines = [];
    let cur = null, top = null;
    spans.forEach((s) => {
      const t = s.offsetTop;
      if (top === null || Math.abs(t - top) > 3) { cur = []; lines.push(cur); top = t; }
      cur.push(s.textContent);
    });
    el.textContent = '';
    return lines.map((wds) => {
      const line = document.createElement('span');
      line.className = 'split-line';
      const inner = document.createElement('span');
      inner.className = 'split-line__inner';
      inner.textContent = wds.join(' ');
      line.appendChild(inner);
      el.appendChild(line);
      return inner;
    });
  }

  function splitChars(el) {
    const text = el.textContent;
    el.textContent = '';
    const chars = [];
    [...text].forEach((ch) => {
      if (ch === ' ' || ch === ' ') { el.appendChild(document.createTextNode(' ')); return; }
      const s = document.createElement('span');
      s.className = 'char';
      s.textContent = ch;
      el.appendChild(s);
      chars.push(s);
    });
    return chars;
  }

  /* ---------------------------------------------------------
     PRELOADER  →  HERO INTRO
  --------------------------------------------------------- */
  function runPreloader(done) {
    const pre = $('[data-preloader]');
    if (!pre || !hasGSAP) { if (pre) pre.style.display = 'none'; done(); return; }
    if (reduced) {
      gsap.to(pre, { autoAlpha: 0, duration: 0.4, onComplete: () => { pre.style.display = 'none'; done(); } });
      return;
    }
    const countEl = $('[data-preloader-count]');
    const barEl = $('[data-preloader-bar]');
    const counter = { v: 0 };

    const tl = gsap.timeline({ onComplete: () => done() });
    tl.to(counter, {
      v: 100, duration: 1.0, ease: 'power2.inOut',
      onUpdate: () => {
        const n = Math.round(counter.v);
        if (countEl) countEl.textContent = String(n).padStart(2, '0');
        if (barEl) barEl.style.width = n + '%';
      },
    })
      .to('.preloader__inner', { autoAlpha: 0, y: -16, duration: 0.4, ease: 'power2.in' }, '+=0.08')
      .to(pre, { yPercent: -100, duration: 0.75, ease: 'expo.inOut' }, '-=0.05')
      .set(pre, { display: 'none' });
  }

  function heroIntro() {
    if (!hasGSAP) return;
    const heroEls = $$('[data-hero-el]');
    const lines = $$('.hero__line').map(wrapLine);
    const letters = $$('.hero__wm-letter');

    // reduced motion: opacity-only fades, no movement
    if (reduced) {
      gsap.to('.hero__line', { opacity: 1, duration: 0.7, stagger: 0.06 });
      gsap.to(letters, { opacity: 1, duration: 0.8, stagger: 0.03, delay: 0.1 });
      gsap.to(heroEls, { opacity: 1, duration: 0.7, stagger: 0.06, delay: 0.15 });
      return;
    }

    gsap.set([...lines], { yPercent: 115 });
    gsap.set('.hero__line', { opacity: 1 });
    gsap.set(letters, { yPercent: 115, opacity: 1 });
    gsap.set(heroEls, { opacity: 0, y: 22 });

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.to(lines, { yPercent: 0, duration: 1.1, stagger: 0.12 }, 0.05)
      .to(letters, { yPercent: 0, duration: 1.2, stagger: 0.06 }, 0.15)
      .to(heroEls, { opacity: 1, y: 0, duration: 0.9, stagger: 0.09 }, 0.55);
  }

  /* ---------------------------------------------------------
     SCROLL REVEALS
  --------------------------------------------------------- */
  function buildReveals() {
    if (!hasGSAP) return;

    // generic fade/rise (opacity-only under reduced motion)
    $$('[data-reveal]').forEach((el) => {
      gsap.fromTo(el, { autoAlpha: 0, y: reduced ? 0 : 34 }, {
        autoAlpha: 1, y: 0, duration: reduced ? 0.6 : 1, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
    });

    // CTA heading
    const ctaLines = $$('.cta__line');
    if (ctaLines.length) {
      if (reduced) {
        gsap.fromTo(ctaLines, { opacity: 0 }, {
          opacity: 1, duration: 0.6, stagger: 0.08,
          scrollTrigger: { trigger: '.cta', start: 'top 78%' },
        });
      } else {
        const inners = ctaLines.map(wrapLine);
        gsap.set(ctaLines, { opacity: 1 });
        gsap.set(inners, { yPercent: 115 });
        gsap.to(inners, {
          yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1,
          scrollTrigger: { trigger: '.cta', start: 'top 68%' },
        });
      }
    }

    // line/char-mask reveals
    $$('[data-split-reveal]').forEach((el) => {
      if (reduced) {
        gsap.fromTo(el, { opacity: 0 }, {
          opacity: 1, duration: 0.6, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        });
        return;
      }
      const mode = el.getAttribute('data-split-reveal');
      let inners;
      if (mode === 'chars') {
        inners = splitChars(el);
        gsap.set(el, { opacity: 1 });
        gsap.from(inners, {
          yPercent: 120, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.03,
          scrollTrigger: { trigger: el, start: 'top 88%' },
        });
      } else {
        inners = splitLines(el);
        gsap.set(el, { opacity: 1 });
        gsap.set(inners, { yPercent: 120 });
        gsap.to(inners, {
          yPercent: 0, duration: 1.05, ease: 'expo.out', stagger: 0.12,
          scrollTrigger: { trigger: el, start: 'top 84%' },
        });
      }
    });
  }

  /* ---------------------------------------------------------
     HERO PARALLAX
  --------------------------------------------------------- */
  function heroParallax() {
    if (!hasGSAP || reduced) return;
    const hero = $('[data-hero]');
    if (!hero) return;
    gsap.to('[data-hero-parallax]', {
      yPercent: -22, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to('[data-hero-wordmark]', {
      yPercent: 14, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to('.hero__glow', {
      yPercent: -30, ease: 'none',
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true },
    });
  }

  /* ---------------------------------------------------------
     HERO BACKGROUND — animated warm gradient field (canvas)
  --------------------------------------------------------- */
  function heroBackground() {
    const canvas = $('[data-hero-canvas]');
    const hero = $('[data-hero]');
    if (!canvas || !hero) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const SCALE = 0.5; // render at half-res, CSS scales up → soft & cheap
    let w = 1, h = 1;

    // warm blobs drifting over paper: [nx, ny, radius, r,g,b, alpha, speedX, speedY, mouseX, mouseY]
    const blobs = [
      { x: 0.26, y: 0.34, r: 0.58, c: [193, 66, 26], a: 0.14, sx: 0.5, sy: 0.4, px: 0.05, py: 0.06 },
      { x: 0.74, y: 0.5, r: 0.62, c: [120, 110, 90], a: 0.22, sx: 0.35, sy: 0.55, px: 0.06, py: 0.04 },
      { x: 0.52, y: 0.78, r: 0.5, c: [214, 90, 43], a: 0.10, sx: 0.6, sy: 0.3, px: 0.07, py: 0.07 },
      { x: 0.86, y: 0.22, r: 0.5, c: [255, 251, 242], a: 0.55, sx: 0.45, sy: 0.5, px: 0.03, py: 0.04 },
      { x: 0.14, y: 0.82, r: 0.52, c: [86, 80, 66], a: 0.10, sx: 0.4, sy: 0.45, px: 0.05, py: 0.03 },
    ];
    let mx = 0.5, my = 0.5, cmx = 0.5, cmy = 0.5;

    function resize() {
      const rect = hero.getBoundingClientRect();
      w = Math.max(1, Math.floor(rect.width * SCALE));
      h = Math.max(1, Math.floor(rect.height * SCALE));
      canvas.width = w; canvas.height = h;
    }

    function draw(t) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#f2ede4';
      ctx.fillRect(0, 0, w, h);
      cmx += (mx - cmx) * 0.045; cmy += (my - cmy) * 0.045;
      const time = t * 0.0001;
      const maxR = Math.max(w, h);
      for (let i = 0; i < blobs.length; i++) {
        const b = blobs[i];
        const bx = (b.x + Math.sin(time * b.sx + i) * 0.055 + (cmx - 0.5) * b.px) * w;
        const by = (b.y + Math.cos(time * b.sy + i * 1.3) * 0.055 + (cmy - 0.5) * b.py) * h;
        const br = b.r * maxR;
        const g = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        g.addColorStop(0, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},${b.a})`);
        g.addColorStop(1, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }
    }

    let raf = 0, visible = true;
    function loop(t) {
      if (!visible || document.hidden) { raf = 0; return; }
      draw(t);
      raf = requestAnimationFrame(loop);
    }
    function start() { if (!raf && !reduced) raf = requestAnimationFrame(loop); }

    resize();
    draw(performance.now());
    requestAnimationFrame(() => canvas.classList.add('is-ready'));

    if (fine && !reduced) {
      window.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        mx = clamp((e.clientX - rect.left) / rect.width, 0, 1);
        my = clamp((e.clientY - rect.top) / rect.height, 0, 1);
      }, { passive: true });
    }
    window.addEventListener('resize', () => { resize(); draw(performance.now()); });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) start(); });

    // pause when hero scrolls out of view
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); }, { threshold: 0 });
      io.observe(hero);
    }
    start();
  }

  /* ---------------------------------------------------------
     THEME INVERSION (nav follows section under it)
  --------------------------------------------------------- */
  function themeSwitch() {
    if (!hasGSAP) return;
    const set = (t) => { html.dataset.themeNav = t; };
    $$('[data-theme-section]').forEach((sec) => {
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 8%',
        end: 'bottom 8%',
        onToggle: (self) => { if (self.isActive) set(sec.dataset.themeSection); },
      });
    });
  }

  /* ---------------------------------------------------------
     NAV — hide on scroll down / reveal on scroll up
  --------------------------------------------------------- */
  function navBehavior() {
    const nav = $('[data-nav]');
    if (!nav) return;
    let last = window.scrollY, ticking = false;
    const onScroll = (y) => {
      if (y > last && y > 400) nav.classList.add('is-hidden');
      else nav.classList.remove('is-hidden');
      last = y;
    };
    if (lenis) lenis.on('scroll', ({ scroll }) => onScroll(scroll));
    else window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(() => { onScroll(window.scrollY); ticking = false; }); ticking = true; }
    }, { passive: true });
  }

  /* ---------------------------------------------------------
     GAP — split-apart reveal
  --------------------------------------------------------- */
  function gapSection() {
    if (!hasGSAP || reduced) return;
    const gap = $('.gap');
    if (!gap) return;
    const tl = gsap.timeline({
      scrollTrigger: { trigger: gap, start: 'top 78%', end: 'top 20%', scrub: 0.6 },
    });
    tl.fromTo('[data-gap-left]', { xPercent: 22 }, { xPercent: 0, ease: 'none' }, 0)
      .fromTo('[data-gap-right]', { xPercent: -22 }, { xPercent: 0, ease: 'none' }, 0)
      .fromTo('[data-gap-media]', { scale: 0.55, autoAlpha: 0.2 }, { scale: 1, autoAlpha: 1, ease: 'none' }, 0);
  }

  /* ---------------------------------------------------------
     STACKING recede for problems
  --------------------------------------------------------- */
  function stackRecede() {
    if (!hasGSAP || reduced) return;
    $$('[data-stack]').forEach((el) => {
      gsap.to(el, {
        scale: 0.95, autoAlpha: 0.55, yPercent: -4, ease: 'none',
        transformOrigin: 'center top',
        scrollTrigger: { trigger: el, start: 'bottom bottom', end: 'bottom top', scrub: true },
      });
    });
  }

  /* ---------------------------------------------------------
     MARQUEES
  --------------------------------------------------------- */
  function marquees() {
    // auto-loop trusted-by
    const track = $('[data-marquee-track]');
    if (track && hasGSAP && !reduced) {
      const clone = track.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.parentNode.appendChild(clone);
      gsap.to([track, clone], { xPercent: -100, repeat: -1, duration: 26, ease: 'none' });
      gsap.set(track.parentNode, { display: 'flex' });
    }
    // scroll-scrubbed work band
    const band = $('[data-marquee-band]');
    if (band && hasGSAP && !reduced) {
      band.textContent = band.textContent.repeat(2);
      gsap.fromTo(band, { xPercent: 5 }, {
        xPercent: -35, ease: 'none',
        scrollTrigger: { trigger: '.work', start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }
  }

  /* ---------------------------------------------------------
     SERVICES — active item + panel image swap
  --------------------------------------------------------- */
  function services() {
    const items = $$('[data-service]');
    const media = $('[data-service-panel-media]');
    if (!items.length) return;
    let active = -1;
    const setActive = (i) => {
      if (i === active) return;
      active = i;
      items.forEach((it, n) => it.classList.toggle('is-active', n === i));
      if (media && items[i]) {
        const img = items[i].getAttribute('data-service-img');
        if (img) media.style.backgroundImage = `url("${img}")`;
      }
    };
    setActive(0);
    items.forEach((it, i) => {
      it.addEventListener('mouseenter', () => setActive(i));
      it.addEventListener('focusin', () => setActive(i));
    });
    if (hasGSAP && !reduced) {
      const sec = $('.services');
      ScrollTrigger.create({
        trigger: sec, start: 'top top', end: 'bottom bottom',
        onUpdate: () => {
          const mid = window.innerHeight * 0.5;
          let best = 0, bestDist = Infinity;
          items.forEach((it, n) => {
            const r = it.getBoundingClientRect();
            const d = Math.abs(r.top + r.height / 2 - mid);
            if (d < bestDist) { bestDist = d; best = n; }
          });
          setActive(best);
        },
      });
    }
  }

  /* ---------------------------------------------------------
     TESTIMONIAL SLIDER
  --------------------------------------------------------- */
  function slider() {
    const root = $('[data-slider]');
    if (!root) return;
    const track = $('[data-slider-track]', root);
    const slides = $$('.slide', track);
    const prev = $('[data-slider-prev]', root);
    const next = $('[data-slider-next]', root);
    const curEl = $('[data-slider-current]', root);
    const totalEl = $('[data-slider-total]', root);
    const progress = $('[data-slider-progress]', root);
    let i = 0;
    const total = slides.length;
    if (totalEl) totalEl.textContent = String(total).padStart(2, '0');
    const go = (n) => {
      i = (n + total) % total;
      track.style.transform = `translateX(${-i * 100}%)`;
      if (curEl) curEl.textContent = String(i + 1).padStart(2, '0');
      if (progress) progress.style.width = ((i + 1) / total) * 100 + '%';
    };
    prev && prev.addEventListener('click', () => go(i - 1));
    next && next.addEventListener('click', () => go(i + 1));
    go(0);
  }

  /* ---------------------------------------------------------
     ACCORDIONS (single-open per group)
  --------------------------------------------------------- */
  function accordions() {
    $$('[data-accordion-group]').forEach((group) => {
      const items = $$('[data-accordion]', group);
      items.forEach((item) => {
        const btn = $('[data-accordion-toggle]', item);
        const bodyEl = $('[data-accordion-body]', item);
        if (!btn || !bodyEl) return;
        const isOpen = () => item.hasAttribute('data-accordion-open');
        const setOpen = (open) => {
          if (open) item.setAttribute('data-accordion-open', '');
          else item.removeAttribute('data-accordion-open');
          btn.setAttribute('aria-expanded', open ? 'true' : 'false');
          const target = open ? bodyEl.firstElementChild.offsetHeight : 0;
          if (hasGSAP && !reduced) {
            gsap.to(bodyEl, { height: target, duration: 0.6, ease: 'power3.inOut',
              onComplete: () => { if (open) bodyEl.style.height = 'auto'; } });
          } else {
            bodyEl.style.height = open ? 'auto' : '0px';
          }
        };
        // init: open ones get auto height
        if (isOpen()) { bodyEl.style.height = 'auto'; btn.setAttribute('aria-expanded', 'true'); }
        btn.addEventListener('click', () => {
          const willOpen = !isOpen();
          if (willOpen) {
            items.forEach((other) => {
              if (other !== item && other.hasAttribute('data-accordion-open')) {
                const oBtn = $('[data-accordion-toggle]', other);
                const oBody = $('[data-accordion-body]', other);
                other.removeAttribute('data-accordion-open');
                oBtn && oBtn.setAttribute('aria-expanded', 'false');
                if (hasGSAP && !reduced) gsap.to(oBody, { height: 0, duration: 0.5, ease: 'power3.inOut' });
                else oBody.style.height = '0px';
              }
            });
          }
          setOpen(willOpen);
          if (hasGSAP) ScrollTrigger && ScrollTrigger.refresh();
        });
      });
    });
  }

  /* ---------------------------------------------------------
     CUSTOM CURSOR
  --------------------------------------------------------- */
  function cursor() {
    if (!fine) return;
    const el = $('[data-cursor]');
    if (!el) return;
    html.classList.add('has-cursor');
    const labelEl = $('[data-cursor-label]', el);
    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let cx = x, cy = y;
    window.addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; }, { passive: true });
    const render = () => {
      cx = lerp(cx, x, 0.18); cy = lerp(cy, y, 0.18);
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    const enter = (e) => {
      const t = e.target.closest('[data-cursor-hover]');
      if (!t) return;
      el.classList.add('is-hover');
      const label = t.getAttribute('data-cursor-label');
      if (label) { el.classList.add('is-label'); if (labelEl) labelEl.textContent = label; }
      playTick();
    };
    const leave = (e) => {
      const t = e.target.closest('[data-cursor-hover]');
      if (!t) return;
      if (!e.relatedTarget || !e.relatedTarget.closest || !e.relatedTarget.closest('[data-cursor-hover]')) {
        el.classList.remove('is-hover', 'is-label');
      }
    };
    document.addEventListener('mouseover', enter);
    document.addEventListener('mouseout', leave);
    window.addEventListener('mousedown', () => el.classList.add('is-down'));
    window.addEventListener('mouseup', () => el.classList.remove('is-down'));
  }

  /* ---------------------------------------------------------
     MAGNETIC + TILT
  --------------------------------------------------------- */
  function magnetic() {
    if (!fine || reduced) return;
    $$('[data-magnetic]').forEach((el) => {
      const strength = 0.35;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  function tilt() {
    if (!fine || reduced) return;
    $$('[data-tilt]').forEach((el) => {
      el.style.transformStyle = 'preserve-3d';
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------------------------------------------------------
     SOUND (self-contained WebAudio ticks, opt-in)
  --------------------------------------------------------- */
  let audioCtx = null, soundOn = false;
  function playTick() {
    if (!soundOn || !audioCtx) return;
    try {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sine';
      o.frequency.value = 420 + Math.random() * 220;
      g.gain.value = 0.0001;
      o.connect(g); g.connect(audioCtx.destination);
      const t = audioCtx.currentTime;
      g.gain.exponentialRampToValueAtTime(0.05, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
      o.start(t); o.stop(t + 0.13);
    } catch (e) { /* noop */ }
  }
  function soundToggle() {
    const btn = $('[data-sound-toggle]');
    if (!btn) return;
    btn.addEventListener('click', () => {
      soundOn = !soundOn;
      btn.classList.toggle('is-on', soundOn);
      btn.setAttribute('aria-pressed', soundOn ? 'true' : 'false');
      if (soundOn && !audioCtx) {
        try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { audioCtx = null; }
      }
      if (soundOn && audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
    });
  }

  /* ---------------------------------------------------------
     ABOUT DRAWER
  --------------------------------------------------------- */
  function aboutDrawer() {
    const about = $('[data-about]');
    if (!about) return;
    const scrollArea = $('[data-about-scroll]', about);
    const open = (e) => {
      if (e) e.preventDefault();
      about.classList.add('is-open');
      about.setAttribute('aria-hidden', 'false');
      body.classList.add('is-locked');
      if (lenis) lenis.stop();
    };
    const close = () => {
      about.classList.remove('is-open');
      about.setAttribute('aria-hidden', 'true');
      body.classList.remove('is-locked');
      if (lenis) lenis.start();
    };
    $$('[data-open-about]').forEach((b) => b.addEventListener('click', open));
    $$('[data-about-close]', about).forEach((b) => b.addEventListener('click', close));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && about.classList.contains('is-open')) close(); });
  }

  /* ---------------------------------------------------------
     MOBILE MENU
  --------------------------------------------------------- */
  function mobileMenu() {
    const menu = $('[data-menu]');
    const btn = $('[data-menu-btn]');
    if (!menu || !btn) return;
    const open = () => {
      menu.classList.add('is-open');
      menu.setAttribute('aria-hidden', 'false');
      btn.setAttribute('aria-expanded', 'true');
      body.classList.add('is-locked');
      if (lenis) lenis.stop();
    };
    const close = () => {
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
      body.classList.remove('is-locked');
      if (lenis) lenis.start();
    };
    btn.addEventListener('click', () => (menu.classList.contains('is-open') ? close() : open()));
    $$('[data-menu-link]', menu).forEach((l) => l.addEventListener('click', close));
  }

  /* ---------------------------------------------------------
     ANCHOR SMOOTH SCROLL
  --------------------------------------------------------- */
  function anchors() {
    $$('a[href^="#"]').forEach((a) => {
      const href = a.getAttribute('href');
      if (a.hasAttribute('data-open-about')) return; // handled by the About drawer
      // placeholder links ("#") must not jump the page to the top
      if (href === '#') {
        a.addEventListener('click', (e) => e.preventDefault());
        return;
      }
      a.addEventListener('click', (e) => {
        const target = $(href);
        if (!target) return;
        e.preventDefault();
        scrollTo(target, { offset: -20 });
      });
    });
  }

  /* ---------------------------------------------------------
     LIVE CLOCK (New York)
  --------------------------------------------------------- */
  function clock() {
    const timeEl = $('[data-clock-time]');
    const dateEl = $('[data-clock-date]');
    if (!timeEl && !dateEl) return;
    const tick = () => {
      const now = new Date();
      try {
        const t = new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
        }).format(now);
        const d = new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/New_York', weekday: 'long', month: 'short', day: 'numeric', year: 'numeric',
        }).format(now);
        const tz = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', timeZoneName: 'short' })
          .formatToParts(now).find((p) => p.type === 'timeZoneName');
        if (timeEl) timeEl.textContent = `New York ${t}`;
        if (dateEl) dateEl.textContent = `${d} (${tz ? tz.value : 'ET'})`;
      } catch (e) {
        if (timeEl) timeEl.textContent = 'New York';
      }
    };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------------------------------------------------------
     SCROLL HEALTH — keep ScrollTrigger + Lenis honest over time
     Fixes two failure modes:
      • scrub animations drifting as lazy images decode and change
        the page height (trigger start/end points go stale), and
      • scroll "freezing"/acting weird after the tab has been in the
        background — RAF throttling desyncs Lenis, and without a
        re-measure it never recovers (the "stops after a few minutes"
        report). Also covers bfcache back/forward restores.
  --------------------------------------------------------- */
  function scrollHealth() {
    if (!hasGSAP) return;

    // debounce so bursts of events cost a single refresh
    let rid;
    const refresh = () => { clearTimeout(rid); rid = setTimeout(() => ScrollTrigger.refresh(), 200); };

    // lazy images shift layout as they decode → re-measure when each lands
    $$('img').forEach((img) => {
      if (img.complete) return;
      img.addEventListener('load', refresh, { once: true });
      img.addEventListener('error', refresh, { once: true });
    });
    window.addEventListener('load', refresh);

    // returning to a throttled/frozen tab: re-arm Lenis and re-measure
    const recover = () => {
      if (document.hidden) return;
      // don't fight an intentionally-stopped Lenis (About drawer / mobile menu open)
      if (lenis && !body.classList.contains('is-locked')) lenis.start();
      refresh();
    };
    document.addEventListener('visibilitychange', recover);
    window.addEventListener('pageshow', recover);
    window.addEventListener('focus', recover);
  }

  /* ---------------------------------------------------------
     BOOT
  --------------------------------------------------------- */
  // last-resort: never leave content stuck hidden
  function failSafe(err) {
    if (err) try { console.warn('[walsh] motion disabled, showing static content:', err); } catch (e) {}
    html.classList.add('no-motion');
    const pre = $('[data-preloader]');
    if (pre) pre.style.display = 'none';
  }

  function boot() {
    try {
      if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
      initScroll();
      if (lenis) lenis.scrollTo(0, { immediate: true });

      // always-on interactions (work without gsap)
      accordions();
      slider();
      services();
      aboutDrawer();
      mobileMenu();
      soundToggle();
      clock();
      anchors();
      heroBackground();

      // full-motion-only enhancements (self-gate internally)
      cursor();
      magnetic();
      tilt();
      navBehavior();
      themeSwitch();
      heroParallax();
      gapSection();
      stackRecede();
      marquees();
      scrollHealth();

      // reveals + hero intro wait for fonts so line-splitting measures correctly
      const ready = Promise.race([
        document.fonts ? document.fonts.ready : Promise.resolve(),
        new Promise((r) => setTimeout(r, 1500)),
      ]);
      ready.then(() => {
        try {
          buildReveals();
          runPreloader(() => {
            try { heroIntro(); if (hasGSAP) ScrollTrigger.refresh(); } catch (e) { failSafe(e); }
          });
        } catch (e) { failSafe(e); }
      }).catch(failSafe);

      // hard safety: if the hero never revealed after 3.5s, force everything visible
      setTimeout(() => {
        const l = $('.hero__wm-letter');
        if (l && parseFloat(getComputedStyle(l).opacity || '1') < 0.05) failSafe(new Error('intro timeout'));
      }, 3500);

      // keep triggers honest on resize
      let rt;
      window.addEventListener('resize', () => {
        clearTimeout(rt);
        rt = setTimeout(() => { if (hasGSAP) ScrollTrigger.refresh(); }, 250);
      });
    } catch (e) {
      failSafe(e);
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
