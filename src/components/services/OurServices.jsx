import { useEffect, useRef, useState } from 'react';
import { ENGAGEMENT_INCLUDES, SERVICES } from './servicesData';
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

const INCLUDE_ICONS = {
  lead: (
    <>
      <circle cx="12" cy="8" r="3.2" />
      <path d="M5.5 19c.6-3.2 3.1-5.2 6.5-5.2s5.9 2 6.5 5.2" />
    </>
  ),
  demos: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <path d="M3.5 9h17M8 13.2l3.4 2.1L8 17.4v-4.2Z" />
    </>
  ),
  pricing: (
    <>
      <path d="M20 13 13 20 4 11V4h7l9 9Z" />
      <circle cx="8.5" cy="8.5" r="1.3" />
    </>
  ),
  handover: (
    <>
      <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5h3.2l2 2h5.8A2.5 2.5 0 0 1 20 9.5v7A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9Z" />
      <path d="m8.5 13 2 2 4-4" />
    </>
  ),
};

function ArrowIcon({ className }) {
  return (
    <svg
      className={className}
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
  );
}

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
      aria-labelledby="services-heading"
    >
      <div className="services-inner">
        <header className="services-header">
          <div className="services-header-main">
            <p className="services-eyebrow">
              <span className="services-eyebrow-dot" aria-hidden="true" />
              <span className="services-eyebrow-text">What we do</span>
            </p>

            <h2 id="services-heading" className="services-headline">
              Everything you need to
              <br className="services-headline-break" />{' '}
              <span className="services-headline-highlight">
                launch and grow.
              </span>
            </h2>

            <p className="services-subtext">
              Strategy, design and engineering under one roof, from first brief
              to launch.
            </p>
          </div>
        </header>

        <ul className="services-grid" aria-label="Services">
          {SERVICES.map((service, index) => (
            <li
              key={service.slug}
              className="service-item"
              style={{
                ['--accent']: service.accent,
                ['--accent-ink']: service.accentInk,
                ['--stagger']: `${index * 70}ms`,
              }}
            >
              <article
                className={[
                  'service-card',
                  `service-card--${service.slug}`,
                  service.tone ? `service-card--${service.tone}` : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-labelledby={`service-${service.slug}-title`}
              >
                <span className="service-card-bar" aria-hidden="true" />
                <span className="service-watermark" aria-hidden="true">
                  {service.watermark}
                </span>

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

                <h3
                  id={`service-${service.slug}-title`}
                  className="service-title"
                >
                  {service.title}
                </h3>
                <p className="service-description">{service.description}</p>

                <ul className="service-capabilities">
                  {service.capabilities.map((capability) => (
                    <li key={capability} className="service-capability">
                      {capability}
                    </li>
                  ))}
                </ul>

                <p className="service-best-for">
                  <strong>Best for:</strong> {service.bestFor}
                </p>

                <div className="service-footer">
                  <a className="service-link" href="#contact">
                    Learn more
                    <ArrowIcon className="service-link-arrow" />
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <div className="services-includes-wrap">
          <p
            className="services-includes-label"
            id="services-includes-label"
          >
            Every engagement includes
          </p>
          <ul
            className="services-includes"
            aria-labelledby="services-includes-label"
          >
            {ENGAGEMENT_INCLUDES.map((item) => (
              <li key={item.label} className="services-include">
                <span className="services-include-icon" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {INCLUDE_ICONS[item.icon]}
                  </svg>
                </span>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="services-cta">
          <span className="services-cta-glow" aria-hidden="true" />

          <div className="services-cta-copy">
            <h3 className="services-cta-title">
              Not sure what you need yet?
            </h3>
            <p className="services-cta-text">
              Tell us where you are and we&apos;ll help you scope the right mix
              of services. Free 30-minute call.
            </p>
          </div>

          <div className="services-cta-actions">
            <a className="services-cta-primary" href="#contact">
              Book a free call
              <ArrowIcon className="services-cta-arrow" />
            </a>

            <a className="services-cta-secondary" href="#work">
              See our work
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
