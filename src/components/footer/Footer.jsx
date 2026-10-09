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

  return (
    <footer className="skyline-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand Card (Left) */}
          <div className="footer-brand-card">
            <div className="footer-brand-card-glow" aria-hidden="true" />

            <div className="footer-brand-header">
              <span className="footer-logo-badge" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18M5 21V7l7-4 7 4v14M9 9v.01M9 13v.01M9 17v.01M15 9v.01M15 13v.01M15 17v.01" />
                </svg>
              </span>
              <span className="footer-brand-title">
                SKYLINE
              </span>
            </div>

            <p className="footer-brand-tagline">
              Design and engineering for products that ship.
              <span className="footer-brand-subtagline">
                Three people, one room.
              </span>
            </p>
          </div>

          {/* Links Panel (Right) */}
          <div className="footer-links-panel">
            <div className="footer-columns-grid">
              {columns.map((col) => (
                <div key={col.title}>
                  <p className="footer-col-title">{col.title}</p>
                  <ul className="footer-links-list">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          onClick={(e) => handleLinkClick(e, link.href)}
                          className="footer-link-item"
                        >
                          <span>{link.label}</span>
                          <svg
                            className="footer-link-arrow"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="7" y1="17" x2="17" y2="7" />
                            <polyline points="7 7 17 7 17 17" />
                          </svg>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Skyline Digital Media. All rights reserved.
          </p>
        </div>
      </div>

      {/* Giant Outlined Skyline Watermark */}
      <div aria-hidden="true" className="footer-giant-wordmark-wrap">
        <p className="footer-giant-wordmark">
          SKYLINE
        </p>
      </div>
    </footer>
  );
}

export default Footer;
