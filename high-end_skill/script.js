document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- GSAP-powered marquee ---------- */
const marqueeTrack = document.querySelector('.marquee-track');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (marqueeTrack && typeof gsap !== 'undefined' && !prefersReducedMotion) {
  gsap.to(marqueeTrack, {
    xPercent: -50,
    duration: 22,
    ease: 'none',
    repeat: -1
  });
}

/* ---------- Mobile menu (hamburger morph + staggered reveal) ---------- */
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');

function closeMobileMenu(){
  mobileToggle.classList.remove('is-open');
  mobileMenu.classList.remove('is-open');
  mobileToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

mobileToggle.addEventListener('click', () => {
  const isOpen = mobileToggle.classList.toggle('is-open');
  mobileMenu.classList.toggle('is-open', isOpen);
  mobileToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

/* ---------- Sticky nav shadow on scroll (rAF throttled) ---------- */
const navPill = document.getElementById('navPill');
let navTicking = false;
window.addEventListener('scroll', () => {
  if (navTicking) return;
  navTicking = true;
  requestAnimationFrame(() => {
    navPill.style.boxShadow = window.scrollY > 40
      ? '0 20px 45px -16px rgba(28,19,14,.35)'
      : '0 20px 45px -20px rgba(28,19,14,.25)';
    navTicking = false;
  });
}, { passive: true });

/* ---------- Scroll reveal via IntersectionObserver ---------- */
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('is-visible'));
}

/* ---------- Magnetic primary buttons ---------- */
const magneticButtons = document.querySelectorAll('.btn-primary');
magneticButtons.forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.12}px, ${y * 0.35}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ---------- Reservation form (front-end only) ---------- */
const reserveForm = document.getElementById('reserveForm');
const formSuccess = document.getElementById('formSuccess');
reserveForm.addEventListener('submit', (e) => {
  e.preventDefault();
  formSuccess.classList.add('is-visible');
  reserveForm.reset();
});

/* ---------- Newsletter form (front-end only) ---------- */
const newsForm = document.getElementById('newsForm');
newsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const input = newsForm.querySelector('input');
  input.placeholder = 'You\'re on the list — grazie!';
  input.value = '';
});

/* ---------- Back to top ---------- */
const backToTop = document.getElementById('backToTop');
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
