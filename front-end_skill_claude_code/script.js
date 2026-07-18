(() => {
  const html = document.documentElement;
  const header = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');

  // Live-updating so OS/browser changes are respected without a reload.
  const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktopMQ = window.matchMedia('(min-width: 768px)');

  html.classList.add('js');

  /* ======================================================================
     Header background on scroll
     ====================================================================== */
  const setHeaderBg = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
  setHeaderBg();
  window.addEventListener('scroll', setHeaderBg, { passive: true });

  /* ======================================================================
     Mobile nav toggle
     ====================================================================== */
  const closeNav = () => {
    navToggle.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('is-open');
    document.body.style.overflow = '';
  };
  const openNav = () => {
    navToggle.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeNav() : openNav();
  });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeNav));

  /* ======================================================================
     Scroll reveals  (IntersectionObserver — works everywhere, incl. file://)
     Movement vs. fade is decided in CSS; JS only toggles .in-view, so this
     path runs identically whether or not reduced-motion is set.
     ====================================================================== */
  const reveal = el => el.classList.add('in-view');
  const revealTargets = document.querySelectorAll('.reveal, [data-divider], [data-menu-list]');

  // Stagger the menu courses: per-item transition-delay, revealed as a group.
  document.querySelectorAll('.menu-list__item, .menu-list__footnote')
    .forEach((item, i) => { item.style.transitionDelay = (i * 0.06) + 's'; });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          reveal(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach(el => io.observe(el));
  } else {
    // Very old browsers: just show everything.
    revealTargets.forEach(reveal);
  }

  // Signature veins draw in on load regardless of scroll position.
  document.querySelectorAll('.hero__vein, .prenotazioni__vein')
    .forEach(el => requestAnimationFrame(() => reveal(el)));

  /* ======================================================================
     Header auto-hide on scroll down / reveal on scroll up
     (skipped under reduced-motion — it's a moving element)
     ====================================================================== */
  let lastY = window.scrollY;
  let headerTicking = false;
  const updateHeader = () => {
    const y = window.scrollY;
    const goingDown = y > lastY;
    const menuOpen = mobileNav.classList.contains('is-open');
    header.classList.toggle('is-hidden', goingDown && y > 240 && !menuOpen);
    lastY = y;
    headerTicking = false;
  };
  const onHeaderScroll = () => {
    if (!headerTicking) { headerTicking = true; requestAnimationFrame(updateHeader); }
  };

  /* ======================================================================
     Parallax  (desktop + no reduced-motion only; transform-only, rAF-driven)
     ====================================================================== */
  const heroSection = document.querySelector('.hero');
  const heroContent = document.querySelector('.hero__content');
  const menuFigure = document.querySelector('.menu-section__image');
  const menuImg = menuFigure ? menuFigure.querySelector('img') : null;
  const prenSection = document.querySelector('.prenotazioni');
  const prenVein = document.querySelector('.prenotazioni__vein');

  let parallaxOn = false;
  let parallaxTicking = false;

  const updateParallax = () => {
    const vh = window.innerHeight;

    if (heroContent && heroSection) {
      const p = Math.min(Math.max(window.scrollY / heroSection.offsetHeight, 0), 1);
      heroContent.style.transform = 'translateY(' + (p * -60).toFixed(1) + 'px)';
      heroContent.style.opacity = (1 - p * 0.6).toFixed(3);
    }
    if (menuImg && menuFigure) {
      const r = menuFigure.getBoundingClientRect();
      const prog = (r.top + r.height / 2 - vh / 2) / vh; // ~ -1 .. 1
      // scale(1.12) is set in CSS so the shift never exposes a gap
      menuImg.style.transform = 'translateY(' + (prog * -22).toFixed(1) + 'px) scale(1.12)';
    }
    if (prenVein && prenSection) {
      const r = prenSection.getBoundingClientRect();
      const prog = (r.top + r.height / 2 - vh / 2) / vh;
      prenVein.style.transform = 'translateY(' + (prog * 36).toFixed(1) + 'px)';
    }
    parallaxTicking = false;
  };
  const onParallaxScroll = () => {
    if (!parallaxTicking) { parallaxTicking = true; requestAnimationFrame(updateParallax); }
  };

  const clearParallax = () => {
    [heroContent, menuImg, prenVein].forEach(el => {
      if (el) { el.style.transform = ''; el.style.opacity = ''; }
    });
  };

  const enableParallax = () => {
    if (parallaxOn) return;
    parallaxOn = true;
    html.classList.add('js-parallax');
    window.addEventListener('scroll', onParallaxScroll, { passive: true });
    updateParallax();
  };
  const disableParallax = () => {
    if (!parallaxOn) return;
    parallaxOn = false;
    html.classList.remove('js-parallax');
    window.removeEventListener('scroll', onParallaxScroll);
    clearParallax();
  };

  /* ======================================================================
     Wire motion-dependent behaviour to the current environment, and keep it
     correct if the user changes settings or resizes / rotates the device.
     ====================================================================== */
  const applyMotionPrefs = () => {
    const reduce = reduceMQ.matches;

    // Header auto-hide only when motion is allowed
    window.removeEventListener('scroll', onHeaderScroll);
    header.classList.remove('is-hidden');
    if (!reduce) window.addEventListener('scroll', onHeaderScroll, { passive: true });

    // Parallax only on a real pointer-sized viewport with motion allowed
    if (!reduce && desktopMQ.matches) enableParallax();
    else disableParallax();
  };

  applyMotionPrefs();
  const onMQChange = () => applyMotionPrefs();
  // addEventListener('change') is the modern API; both MQs support it.
  reduceMQ.addEventListener('change', onMQChange);
  desktopMQ.addEventListener('change', onMQChange);

  // Recalculate parallax once late-loading images settle the layout.
  window.addEventListener('load', () => { if (parallaxOn) updateParallax(); });
})();
