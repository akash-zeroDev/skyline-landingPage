import { useState, useEffect, useRef, useCallback } from 'react';
import { WORKFLOW_PHASES } from './workflowData';
import WorkflowDial from './WorkflowDial';
import AmbientBlurBackdrop from './AmbientBlurBackdrop';
import './WorkflowDialSection.css';

/** 'STRATEGY & STRUCTURE' -> 'Strategy & Structure' (for the live-region announcement). */
function toTitleCase(value) {
  return value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

function ArrowIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M4 10h11M10.5 5l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * WorkflowDialSection
 * Sticky scroll-driven studio process workflow showcase.
 * Features rotating circular dial, multi-orb ambient changing background blur,
 * and comprehensive, structured phase content.
 */
export function WorkflowDialSection() {
  const outerRef = useRef(null);
  const pillsRef = useRef(null);
  const introRef = useRef(null);
  const hasMountedRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  // Reduced motion starts with the header already revealed (no animation).
  const [isIntroVisible, setIsIntroVisible] = useState(prefersReducedMotion);
  const totalPhases = WORKFLOW_PHASES.length;

  // Track scroll position through the multi-screen container
  const handleScroll = useCallback(() => {
    const el = outerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalDist = rect.height - windowHeight;

    if (totalDist <= 0) return;

    // Calculate progress through this section (0 to 1)
    const progress = Math.max(0, Math.min(1, -rect.top / totalDist));
    setScrollProgress(progress);

    // Map progress symmetrically to active phase index (0 to 4)
    const rawIndex = Math.max(0, Math.min(totalPhases - 1, Math.round(progress * (totalPhases - 1))));
    setActiveIndex(rawIndex);
  }, [totalPhases]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [handleScroll]);

  // Track the preference so the stacked reduced-motion layout can expose every
  // step to assistive tech (no panels are hidden in that mode).
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (event) => setPrefersReducedMotion(event.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  // Reveal the section header once, using the same fade-and-rise pattern as
  // the other sections (OurServices). Skipped when reduced motion is requested.
  useEffect(() => {
    const node = introRef.current;
    if (!node) return undefined;

    // Reduced motion is already handled by the initial state; nothing to animate.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsIntroVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25, rootMargin: '0px 0px -10% 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Keep the active phase pill visible inside the mobile horizontal scroller.
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    if (!window.matchMedia('(max-width: 767.98px)').matches) return;
    const container = pillsRef.current;
    const activePill = container?.children?.[activeIndex];
    if (!container || !activePill) return;
    container.scrollTo({
      left:
        activePill.offsetLeft -
        container.clientWidth / 2 +
        activePill.offsetWidth / 2,
      behavior: 'smooth',
    });
  }, [activeIndex]);

  // Click on a dial number or phase pill to smoothly scroll to that phase
  const handleSelectPhase = (index) => {
    const el = outerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const currentScrollY = window.scrollY;
    const sectionTop = currentScrollY + rect.top;
    const totalDist = rect.height - window.innerHeight;

    // Target scroll position corresponding to this phase
    const targetScrollY = sectionTop + (index / (totalPhases - 1)) * totalDist;
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
  };

  const currentPhase = WORKFLOW_PHASES[activeIndex] || WORKFLOW_PHASES[0];

  // Dynamic continuous dial rotation linked to scroll progress (24 deg per phase step)
  const angleStep = 24;
  const radius = 460;
  const rotationAngle = -scrollProgress * (totalPhases - 1) * angleStep;

  return (
    <section
      id="process"
      className={`workflow-section${isIntroVisible ? ' is-visible' : ''}`}
      aria-labelledby="process-heading"
    >
      {/* Section Header — fades and rises once on entry */}
      <header className="workflow-intro" ref={introRef}>
        <p className="workflow-eyebrow">
          <span className="workflow-eyebrow-dot" aria-hidden="true" />
          <span className="workflow-eyebrow-text">How we work</span>
        </p>

        <h2 id="process-heading" className="workflow-heading">
          From first call to growth,{' '}
          <span className="workflow-heading-highlight">in five clear steps</span>
        </h2>

        <p className="workflow-subtext">
          No black boxes. Every project follows the same five steps, with weekly
          demos and one point of contact, so you always know what&apos;s happening
          and what&apos;s next.
        </p>
      </header>

      {/* Multi-screen sticky scroll track */}
      <div ref={outerRef} className="workflow-section-outer">
        {/* Anchors for alternate nav links */}
        <div id="how-we-work" className="workflow-anchor" />
        <div id="about" className="workflow-anchor" />

        {/* 100vh Sticky Stage Container */}
        <div className="workflow-sticky-stage">
          {/* Dynamic Changing Ambient Blurred Mesh Backdrop */}
          <AmbientBlurBackdrop activeIndex={activeIndex} phases={WORKFLOW_PHASES} />

          {/* Top Header — live step counter */}
          <div className="workflow-top-bar">
            <div className="workflow-section-eyebrow">
              Step {currentPhase.id} / {String(totalPhases).padStart(2, '0')}
            </div>
          </div>

          {/* Main 2-Column Stage: Dial on Left, Rich Content Card on Right */}
          <div className="workflow-stage-grid">
            {/* Left Column: Rotating Circular Dial */}
            <div className="workflow-dial-column">
              <WorkflowDial
                phases={WORKFLOW_PHASES}
                activeIndex={activeIndex}
                onSelectPhase={handleSelectPhase}
                rotationAngle={rotationAngle}
                radius={radius}
                angleStep={angleStep}
              />
            </div>

            {/* Right Column: In-Depth Phase Content Card (all steps in DOM; inactive
                steps are hidden from assistive tech and crossfade with the active one) */}
            <div className="workflow-content-column">
              <div className="workflow-content-card">
                {WORKFLOW_PHASES.map((phase, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <div
                      key={phase.id}
                      className={`workflow-step-panel${isActive ? ' is-active' : ''}`}
                      role="group"
                      aria-label={`${phase.phase}: ${phase.title}`}
                      aria-hidden={
                        isActive || prefersReducedMotion ? undefined : 'true'
                      }
                      inert={
                        isActive || prefersReducedMotion ? undefined : true
                      }
                    >
                      {/* Header: Phase number and Title */}
                      <div className="workflow-card-header">
                        <div className="workflow-card-meta">
                          <span className="workflow-mobile-phase-num">{phase.id}</span>
                        </div>

                        <h3 className="workflow-phase-title">{phase.title}</h3>

                        <p className="workflow-phase-tagline">{phase.tagline}</p>

                        <p className="workflow-phase-desc">{phase.description}</p>
                      </div>

                      {/* Core Activities 4-Tile Grid */}
                      <div className="workflow-activities-section">
                        <h4 className="workflow-activities-title">
                          Core Sprints &amp; Methodology
                        </h4>
                        <div className="workflow-activities-grid">
                          {phase.activities.map((act) => (
                            <div key={act.title} className="workflow-activity-tile">
                              <div className="activity-body">
                                <strong className="activity-title">{act.title}</strong>
                                <p className="activity-desc">{act.desc}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery snapshot: deliverable and what we need */}
                      <dl className="workflow-info-row">
                        <div className="workflow-info-item">
                          <dt className="workflow-info-label">You get</dt>
                          <dd className="workflow-info-value">{phase.deliverable}</dd>
                        </div>
                        <div className="workflow-info-item">
                          <dt className="workflow-info-label">We need from you</dt>
                          <dd className="workflow-info-value">{phase.needFromYou}</dd>
                        </div>
                      </dl>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Phase Stepper & Navigation Pills */}
          <div className="workflow-bottom-bar">
            <div className="workflow-stepper-pills" ref={pillsRef}>
              {WORKFLOW_PHASES.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  className={`stepper-pill ${idx === activeIndex ? 'is-active' : ''}`}
                  onClick={() => handleSelectPhase(idx)}
                  aria-current={idx === activeIndex ? 'step' : undefined}
                  aria-label={`Jump to ${p.phase}: ${p.title}`}
                >
                  <span className="stepper-pill-num">{p.id}</span>
                  <span className="stepper-pill-label">{p.label}</span>
                </button>
              ))}
            </div>

            <div className="workflow-scroll-hint">
              <span className="scroll-hint-text">SCROLL TO ADVANCE</span>
              <span className="scroll-hint-bar">
                <span
                  className="scroll-hint-fill"
                  style={{ width: `${Math.round(scrollProgress * 100)}%` }}
                />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Single polite announcement for the currently active step */}
      <p className="workflow-sr-only" aria-live="polite">
        Step {activeIndex + 1} of {totalPhases}: {toTitleCase(currentPhase.title)}
      </p>

      {/* Closing strip — appears once the pinned scroll releases */}
      <div className="workflow-outro">
        <h3 className="workflow-outro-title">Ready to start step one?</h3>
        <p className="workflow-outro-text">
          Book a free 30-minute call and we&apos;ll walk you through exactly how
          your project would run.
        </p>

        <div className="workflow-outro-actions">
          <a className="workflow-outro-primary" href="#contact">
            Book a free call
            <ArrowIcon className="workflow-outro-arrow" />
          </a>
          <a className="workflow-outro-secondary" href="#work">
            See our work
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <p className="workflow-outro-meta">
          Fixed scope · Weekly demos · One point of contact · Clear handover
        </p>
      </div>
    </section>
  );
}

export default WorkflowDialSection;
