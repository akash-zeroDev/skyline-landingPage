import { useEffect, useRef, useState } from 'react';
import { RATING_SUMMARY, TESTIMONIALS } from './testimonialsData';
import TestimonialCard from './TestimonialCard';
import './Testimonials.css';

const CAROUSEL_QUERY = '(max-width: 639.98px)';

export default function Testimonials() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const frameRef = useRef(0);
  const [isVisible, setIsVisible] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [isCarousel, setIsCarousel] = useState(false);
  const [activeSlide, setActiveSlide] = useState(1);

  // Reveal once when the section scrolls into view.
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

  // Track the mobile carousel mode so the scroll container only takes focus
  // (and exposes carousel semantics) when it can actually scroll.
  useEffect(() => {
    const query = window.matchMedia(CAROUSEL_QUERY);
    const sync = () => setIsCarousel(query.matches);

    sync();
    query.addEventListener?.('change', sync);
    return () => query.removeEventListener?.('change', sync);
  }, []);

  // Update the "1 / 6" counter as the mobile carousel scrolls.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;

    const update = () => {
      frameRef.current = 0;

      if (!window.matchMedia(CAROUSEL_QUERY).matches) return;

      const cards = Array.from(
        track.querySelectorAll('.testimonial-item')
      );
      if (!cards.length) return;

      const trackRect = track.getBoundingClientRect();
      const viewportCenter = trackRect.left + trackRect.width / 2;
      let closest = 0;
      let closestDistance = Infinity;

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const distance = Math.abs(
          (rect.left + rect.right) / 2 - viewportCenter
        );
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = index;
        }
      });

      setActiveSlide(closest + 1);
    };

    const requestUpdate = () => {
      if (frameRef.current) return;
      frameRef.current = window.requestAnimationFrame(update);
    };

    track.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    update();

    return () => {
      track.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className={`testimonials-section${isVisible ? ' is-visible' : ''}`}
      aria-labelledby="testimonials-heading"
    >
      <div className="testimonials-inner">
        <header className="testimonials-header">
          <p className="testimonials-eyebrow">
            <span className="testimonials-eyebrow-pill">Client love</span>
          </p>

          <h2 id="testimonials-heading" className="testimonials-heading">
            Words from the teams we&apos;ve{' '}
            <span className="testimonials-highlight">helped grow</span>
          </h2>

          <p className="testimonials-subtext">
            A few honest words from the founders and marketers we&apos;ve built
            with.
          </p>
        </header>

        <ul className="testimonials-summary" aria-label="Client results">
          {RATING_SUMMARY.map((item) => (
            <li key={item.label} className="testimonials-summary-item">
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>

        <ul
          ref={trackRef}
          className="testimonials-grid"
          tabIndex={isCarousel ? 0 : -1}
          aria-label={
            isCarousel
              ? 'Client testimonials. Scroll horizontally to see more.'
              : undefined
          }
        >
          {TESTIMONIALS.map((testimonial, index) => (
            <li
              key={testimonial.name}
              className={`testimonial-item${
                testimonial.featured ? ' testimonial-item--featured' : ''
              }`}
              style={{ '--stagger': `${index * 80}ms` }}
            >
              <TestimonialCard testimonial={testimonial} />
            </li>
          ))}
        </ul>

        <p className="testimonials-counter" aria-hidden="true">
          {activeSlide} / {TESTIMONIALS.length}
        </p>

        <div className="testimonials-cta">
          <p className="testimonials-cta-text">Want results like these?</p>

          <div className="testimonials-cta-row">
            <a className="testimonials-cta-primary" href="#contact">
              Start your project
              <svg
                className="testimonials-cta-arrow"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </a>

            <a className="testimonials-cta-link" href="#work">
              See our work
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
