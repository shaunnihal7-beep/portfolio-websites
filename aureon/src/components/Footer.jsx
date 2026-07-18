import { scrollToTarget } from '../utils/motion'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="footer__wordmark" aria-hidden="true">
          AUREON
        </p>

        <div className="footer__row">
          <p className="footer__tag">Capital that thinks ahead.</p>
          <nav className="footer__nav" aria-label="Footer">
            <a href="#thesis" onClick={(e) => { e.preventDefault(); scrollToTarget('#thesis') }}>Thesis</a>
            <a href="#platform" onClick={(e) => { e.preventDefault(); scrollToTarget('#platform') }}>Platform</a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToTarget('#contact') }}>Contact</a>
          </nav>
          <button
            className="footer__top"
            onClick={() => scrollToTarget('#hero')}
            aria-label="Back to top"
          >
            Back to top ↑
          </button>
        </div>

        <div className="footer__legal">
          <span>© 2026 Aureon</span>
          <span>A fictional concept experience — no real financial services are offered.</span>
        </div>
      </div>
    </footer>
  )
}
