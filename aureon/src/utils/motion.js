/** Motion + accessibility helpers shared across sections. */

export const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const finePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: hover) and (pointer: fine)').matches

/**
 * Split an element's text into word spans for staggered reveals.
 * Keeps the original text on the element as aria-label so screen readers
 * hear one sentence, not a hundred fragments.
 */
export function splitWords(el) {
  const text = el.textContent.trim().replace(/\s+/g, ' ')
  el.setAttribute('aria-label', text)
  el.innerHTML = text
    .split(' ')
    .map((w) => `<span class="w" aria-hidden="true">${w}</span>`)
    .join(' ')
  return el.querySelectorAll('.w')
}

/** Smooth-scroll to an anchor, respecting Lenis when it is active. */
export function scrollToTarget(hash) {
  const el = document.querySelector(hash)
  if (!el) return
  if (window.__lenis) {
    window.__lenis.scrollTo(el, { offset: 0, duration: 1.4 })
  } else {
    el.scrollIntoView({ behavior: prefersReduced() ? 'auto' : 'smooth' })
  }
}
