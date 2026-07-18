import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'

/**
 * Section 7 — Contact. Underline fields over the resting order-halo.
 * Client-side validation with per-field errors and an aria-live status.
 * Swap `fakeSubmit` for a real endpoint (Formspree, Resend, your API)
 * before production.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const fakeSubmit = () => new Promise((resolve) => setTimeout(resolve, 900))

export default function Contact() {
  const root = useRef(null)
  const [values, setValues] = useState({ name: '', email: '', company: '', message: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contact__left > *, .contact__form > *', {
        opacity: 0,
        y: 36,
        duration: 0.9,
        stagger: 0.06,
        ease: 'power3.out',
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }))
    setErrors((er) => ({ ...er, [k]: undefined }))
  }

  const validate = () => {
    const er = {}
    if (!values.name.trim()) er.name = 'Add your name so we know who to reply to.'
    if (!EMAIL_RE.test(values.email)) er.email = 'Enter a valid email address.'
    if (values.message.trim().length < 10) er.message = 'Tell us a little more — at least a sentence.'
    return er
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    // Honeypot: bots fill hidden fields; humans never see it.
    if (e.target.elements.website?.value) return

    const er = validate()
    setErrors(er)
    if (Object.keys(er).length) return

    setStatus('sending')
    await fakeSubmit(values)
    setStatus('sent')
  }

  return (
    <section id="contact" className="contact" ref={root}>
      <div className="container contact__grid">
        <div className="contact__left">
          <p className="eyebrow">Contact</p>
          <h2 className="h2">
            Let’s build <em>what’s next.</em>
          </h2>
          <p className="contact__sub">
            Tell us where your capital should be working harder. A partner — not a
            bot — reads every message.
          </p>
          <address className="contact__details">
            <a href="mailto:hello@aureon.finance">hello@aureon.finance</a>
            <span>London · New York · Singapore</span>
          </address>
        </div>

        {status === 'sent' ? (
          <div className="contact__success" role="status">
            <span className="contact__success-mark" aria-hidden="true">✓</span>
            <h3>Message received.</h3>
            <p>We’ll be in touch within one business day.</p>
          </div>
        ) : (
          <form className="contact__form" onSubmit={onSubmit} noValidate>
            {/* Honeypot — visually hidden from humans, tempting for bots */}
            <input
              type="text"
              name="website"
              tabIndex="-1"
              autoComplete="off"
              className="visually-hidden"
              aria-hidden="true"
            />

            <div className="field">
              <label htmlFor="c-name">Name</label>
              <input
                id="c-name"
                type="text"
                autoComplete="name"
                value={values.name}
                onChange={set('name')}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? 'c-name-err' : undefined}
              />
              {errors.name && (
                <p className="field__error" id="c-name-err">{errors.name}</p>
              )}
            </div>

            <div className="field">
              <label htmlFor="c-email">Work email</label>
              <input
                id="c-email"
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={set('email')}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'c-email-err' : undefined}
              />
              {errors.email && (
                <p className="field__error" id="c-email-err">{errors.email}</p>
              )}
            </div>

            <div className="field">
              <label htmlFor="c-company">
                Company <span className="field__optional">optional</span>
              </label>
              <input
                id="c-company"
                type="text"
                autoComplete="organization"
                value={values.company}
                onChange={set('company')}
              />
            </div>

            <div className="field">
              <label htmlFor="c-message">Message</label>
              <textarea
                id="c-message"
                rows="4"
                value={values.message}
                onChange={set('message')}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'c-message-err' : undefined}
              />
              {errors.message && (
                <p className="field__error" id="c-message-err">{errors.message}</p>
              )}
            </div>

            <button className="btn btn--gold contact__submit" type="submit" disabled={status === 'sending'}>
              <span className="btn__label">
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </span>
            </button>

            <p className="visually-hidden" aria-live="polite">
              {status === 'sending' ? 'Sending your message' : ''}
            </p>
          </form>
        )}
      </div>
    </section>
  )
}
