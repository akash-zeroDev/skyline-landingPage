import { useEffect, useId, useRef, useState } from 'react';
import { FAQS } from './faqData';
import './FaqSection.css';

export default function FaqSection() {
  const sectionRef = useRef(null);
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState(0);
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

  const toggle = (index) => {
    setOpenIndex((current) => (current === index ? -1 : index));
  };

  return (
    <section
      id="faq"
      ref={sectionRef}
      className={`faq-section${isVisible ? ' is-visible' : ''}`}
      aria-labelledby="faq-headline"
    >
      <div className="faq-inner">
        <header className="faq-header">
          <div className="faq-header-main">
            <p className="faq-eyebrow">
              <span className="faq-eyebrow-dot" aria-hidden="true" />
              <span className="faq-eyebrow-text">FAQ</span>
            </p>

            <h2 id="faq-headline" className="faq-headline">
              Questions, answered.
            </h2>
          </div>

          <div className="faq-header-aside">
            <p className="faq-subtext">
              The things clients ask before we start working together. If yours
              is not here, we are one message away.
            </p>

            <a className="faq-contact-link" href="#contact">
              Ask us anything
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
          </div>
        </header>

        <div className="faq-list">
          {FAQS.map((item, index) => {
            const isOpen = openIndex === index;
            const buttonId = `${baseId}-trigger-${index}`;
            const panelId = `${baseId}-panel-${index}`;

            return (
              <div
                key={item.question}
                className={`faq-item${isOpen ? ' is-open' : ''}`}
                style={{ ['--stagger']: `${index * 60}ms` }}
              >
                <h3 className="faq-question">
                  <button
                    type="button"
                    id={buttonId}
                    className="faq-trigger"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(index)}
                  >
                    <span className="faq-question-text">{item.question}</span>
                    <span className="faq-icon" aria-hidden="true">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  aria-hidden={!isOpen}
                  className="faq-panel"
                >
                  <div className="faq-answer-wrap">
                    <p className="faq-answer">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
