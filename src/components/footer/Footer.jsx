import { useState } from 'react';
import './Footer.css';

const columns = [
  {
    title: 'Studio',
    links: [
      { label: 'How we work', href: '#work' },
      { label: 'Services', href: '#services' },
      { label: 'Selected work', href: '#work' },
      { label: 'Process', href: '#about' },
      { label: 'About', href: '#about' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy policy', href: '/contact' },
    ],
  },
];

export function Footer({ onNavigateContact, onNavigateSection }) {
  const [animationKey, setAnimationKey] = useState(0);

  const handleLinkClick = (e, href) => {
    if (href === '/contact') {
      e.preventDefault();
      if (onNavigateContact) {
        onNavigateContact();
      } else {
        window.location.href = '/contact';
      }
    } else if (href.startsWith('#')) {
      e.preventDefault();
      if (onNavigateSection) {
        onNavigateSection(href);
      } else {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleReplay = () => {
    setAnimationKey((prev) => prev + 1);
  };

  return (
    <footer className="skyline-footer">
      <div className="footer-container">
        <div className="footer-panels">
          {/* Brand Panel */}
          <div className="footer-panel footer-brand">
            <div className="footer-brand-head">
              <span className="footer-icon-box" aria-hidden="true">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
                  <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
                  <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
                  <path d="M10 6h4M10 10h4M10 14h4M10 18h4" />
                </svg>
              </span>
              <span className="footer-wordmark">SKYLINE</span>
            </div>
            <p className="footer-desc">Design and engineering for products that ship.</p>
            <p className="footer-tagline">Three people, one room.</p>
          </div>

          {/* Navigation Panel */}
          <nav className="footer-panel footer-nav" aria-label="Footer">
            {columns.map((col) => (
              <div key={col.title} className="footer-nav-col">
                <h3 className="footer-label">{col.title}</h3>
                <ul>
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        onClick={(e) => handleLinkClick(e, link.href)}
                      >
                        <span>{link.label}</span>
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <path d="M7 7h10v10" />
                          <path d="M7 17 17 7" />
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Copyright */}
        <p className="footer-copy">© 2026 Skyline Digital Media. All rights reserved.</p>
      </div>

      {/* Signature Animated Wordmark */}
      <div className="footer-signature">
        <button
          type="button"
          className="footer-replay"
          onClick={handleReplay}
          aria-label="Replay wordmark animation"
          title="Replay animation"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>

        <svg className="footer-big" viewBox="0 0 1000 190" role="img" aria-label="Skyline">
          <text
            key={animationKey}
            x="500"
            y="182"
            textAnchor="middle"
            pathLength="1"
            className="draw"
          >
            SKYLINE
          </text>
        </svg>
      </div>
    </footer>
  );
}

export default Footer;
