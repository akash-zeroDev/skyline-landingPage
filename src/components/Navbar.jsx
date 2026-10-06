import { useState, useEffect, useRef } from 'react';
import { useActiveSection } from '../hooks/useActiveSection';
import './Navbar.css';

const DEFAULT_NAV_ITEMS = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar({
  items = DEFAULT_NAV_ITEMS,
  ctaText = "Let's Talk",
  ctaHref = "/contact",
  currentRoute = '/',
  onNavigateHome,
  onNavigateContact,
  onNavigateSection,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navContainerRef = useRef(null);

  // Track active section using IntersectionObserver hook
  const sectionIds = items.map((item) => item.href.replace(/^#/, ''));
  const detectedActive = useActiveSection(sectionIds);
  const activeSection = currentRoute === '/contact' ? 'contact' : detectedActive;

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Close mobile menu on clicks outside the navbar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        mobileMenuOpen &&
        navContainerRef.current &&
        !navContainerRef.current.contains(e.target)
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Close menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 860 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const handleItemClick = (e, item) => {
    handleLinkClick();
    if (item.href === '#contact' || item.href === '/contact') {
      e.preventDefault();
      if (onNavigateContact) onNavigateContact();
    } else if (currentRoute === '/contact') {
      e.preventDefault();
      if (onNavigateSection) onNavigateSection(item.href);
    }
  };

  const handleCtaClick = (e) => {
    e.preventDefault();
    handleLinkClick();
    if (onNavigateContact) onNavigateContact();
  };

  const handleBrandClick = (e) => {
    e.preventDefault();
    handleLinkClick();
    if (onNavigateHome) onNavigateHome();
  };

  return (
    <header className="skyline-header" ref={navContainerRef}>
      {/* BRAND (Outside, Top-Left) */}
      <div className="skyline-brand-external">
        <a
          href="/"
          className="skyline-brand-link"
          aria-label="Skyline Digital Media Home"
          onClick={handleBrandClick}
        >
          <span className="skyline-brand-primary">Skyline</span>
          <span className="skyline-brand-sub">Digital Media</span>
        </a>
      </div>

      {/* CENTER: Small Compact Pill Navbar (Desktop) */}
      <nav
        className="skyline-navbar-pill desktop-only"
        aria-label="Main Navigation"
      >
        <ul className="skyline-links-list">
          {items.map((item) => {
            const itemId = item.href.replace(/^#/, '');
            const isActive = activeSection === itemId;

            return (
              <li key={item.label} className="skyline-nav-item">
                <a
                  href={item.href}
                  className={`skyline-nav-link ${isActive ? 'is-active' : ''}`}
                  aria-current={isActive ? 'true' : undefined}
                  onClick={(e) => handleItemClick(e, item)}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        <a
          href={ctaHref}
          className="skyline-cta-button"
          onClick={handleCtaClick}
        >
          {ctaText}
        </a>
      </nav>

      {/* MOBILE HAMBURGER BUTTON (Right side on Mobile) */}
      <button
        type="button"
        className="skyline-hamburger-btn mobile-only"
        aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={mobileMenuOpen}
        aria-controls="skyline-mobile-drawer"
        onClick={() => setMobileMenuOpen((prev) => !prev)}
      >
        <span
          className={`hamburger-icon ${mobileMenuOpen ? 'is-active' : ''}`}
          aria-hidden="true"
        >
          <span className="hamburger-line line-top" />
          <span className="hamburger-line line-bottom" />
        </span>
      </button>

      {/* MOBILE EXPANDED MENU DRAWER */}
      <div
        id="skyline-mobile-drawer"
        className={`skyline-mobile-menu ${mobileMenuOpen ? 'is-open' : ''}`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="skyline-mobile-inner">
          <ul className="skyline-mobile-list">
            {items.map((item) => {
              const itemId = item.href.replace(/^#/, '');
              const isActive = activeSection === itemId;

              return (
                <li key={`mobile-${item.label}`} className="skyline-mobile-item">
                  <a
                    href={item.href}
                    className={`skyline-mobile-link ${isActive ? 'is-active' : ''}`}
                    aria-current={isActive ? 'true' : undefined}
                    onClick={(e) => handleItemClick(e, item)}
                    tabIndex={mobileMenuOpen ? 0 : -1}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="skyline-mobile-cta-wrap">
            <a
              href={ctaHref}
              className="skyline-cta-button mobile-cta"
              onClick={handleCtaClick}
              tabIndex={mobileMenuOpen ? 0 : -1}
            >
              {ctaText}
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
