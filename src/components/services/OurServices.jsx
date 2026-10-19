import { useEffect, useRef, useState } from 'react';
import { SERVICES } from './servicesData';
import './OurServices.css';

const ICONS = {
  uiux: (
    <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17.5v-11Zm0 4.5h16M9.5 11v9" />
  ),
  seo: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.35-4.35" />
    </>
  ),
  branding: (
    <>
      <path d="M12 3.5 14.6 9l6 .9-4.3 4.2 1 6-5.3-2.8-5.3 2.8 1-6L3.4 9.9l6-.9L12 3.5Z" />
    </>
  ),
  app: (
    <>
      <rect x="6.5" y="3" width="11" height="18" rx="2.5" />
      <path d="M10.5 18h3" />
    </>
  ),
  web: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <path d="M3 9h18M7 6.6h.01M9.6 6.6h.01" />
    </>
  ),
  social: (
    <>
      <circle cx="6" cy="12" r="2.6" />
      <circle cx="17.5" cy="6" r="2.6" />
      <circle cx="17.5" cy="18" r="2.6" />
      <path d="m8.4 10.8 6.8-3.5M8.4 13.2l6.8 3.5" />
    </>
  ),
};

export default function OurServices() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return undefined;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className={`services-section${isVisible ? ' is-visible' : ''}`}
      aria-labelledby="services-headline"
    >
      <div className="services-inner">
        <header className="services-header">
          <p className="services-eyebrow">
            <span className="services-eyebrow-dot" aria-hidden="true" />
            <span className="services-eyebrow-text">OUR SERVICES</span>
          </p>

          <h2 id="services-headline" className="services-headline">
            Everything you need to
            <br />
            launch and grow.
          </h2>

          <p className="services-subtext">
            Strategy, design and engineering under one roof — the six disciplines
            we bring to every engagement.
          </p>
        </header>

        <ul className="services-grid">
          {SERVICES.map((service, index) => (
            <li
              key={service.slug}
              className="service-card"
              style={{
                ['--accent']: service.accent,
                ['--stagger']: `${index * 70}ms`,
              }}
            >
              <span className="service-card-bar" aria-hidden="true" />
              <span className="service-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {ICONS[service.icon]}
                </svg>
              </span>

              <h3 className="service-title">{service.title}</h3>
              <p className="service-description">{service.description}</p>

              <ul className="service-capabilities">
                {service.capabilities.map((capability) => (
                  <li key={capability} className="service-capability">
                    {capability}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <footer className="services-footer">
          <p className="services-footer-text">
            Not sure what you need yet? We&apos;ll help you scope it.
          </p>
          <a className="services-footer-link" href="#contact">
            Start a project
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </a>
        </footer>
      </div>
    </section>
  );
}
