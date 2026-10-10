import { useState, useEffect, useRef, useCallback } from 'react';
import { WORKFLOW_PHASES } from './workflowData';
import WorkflowDial from './WorkflowDial';
import AmbientBlurBackdrop from './AmbientBlurBackdrop';
import './WorkflowDialSection.css';

/**
 * WorkflowDialSection
 * Sticky scroll-driven studio process workflow showcase.
 * Features rotating circular dial, multi-orb ambient changing background blur,
 * and comprehensive, structured phase content.
 */
export function WorkflowDialSection() {
  const outerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
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
      ref={outerRef}
      id="process"
      className="workflow-section-outer"
      aria-label="How We Work — Studio Process"
    >
      {/* Anchors for alternate nav links */}
      <div id="how-we-work" className="workflow-anchor" />
      <div id="about" className="workflow-anchor" />

      {/* 100vh Sticky Stage Container */}
      <div className="workflow-sticky-stage">
        {/* Dynamic Changing Ambient Blurred Mesh Backdrop */}
        <AmbientBlurBackdrop activeIndex={activeIndex} phases={WORKFLOW_PHASES} />

        {/* Top Header & Section Eyebrow */}
        <div className="workflow-top-bar">
          <div className="workflow-badge-pill">
            <span className="workflow-badge-dot" />
            <span className="workflow-badge-text">STUDIO WORKFLOW</span>
          </div>

          <div className="workflow-section-eyebrow">
            HOW WE WORK
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

          {/* Right Column: In-Depth Phase Content Card */}
          <div className="workflow-content-column">
            <div
              key={currentPhase.id}
              className="workflow-content-card"
              role="region"
              aria-live="polite"
              aria-label={`${currentPhase.phase}: ${currentPhase.title}`}
            >
              {/* Header: Phase number, Sprint pill, and Title */}
              <div className="workflow-card-header">
                <div className="workflow-card-meta">
                  <span className="workflow-mobile-phase-num">{currentPhase.id}</span>
                  <span className="workflow-phase-eyebrow">
                    {currentPhase.phase}
                  </span>
                  <span className="workflow-sprint-badge">
                    {currentPhase.badge}
                  </span>
                </div>

                <h2 className="workflow-phase-title">
                  {currentPhase.title}
                </h2>

                <p className="workflow-phase-tagline">
                  {currentPhase.tagline}
                </p>

                <p className="workflow-phase-desc">
                  {currentPhase.description}
                </p>
              </div>

              {/* Core Activities 4-Tile Grid */}
              <div className="workflow-activities-section">
                <h3 className="workflow-activities-title">
                  Core Sprints & Methodology
                </h3>
                <div className="workflow-activities-grid">
                  {currentPhase.activities.map((act) => (
                    <div key={act.title} className="workflow-activity-tile">
                      <span className="activity-bullet" aria-hidden="true" />
                      <div className="activity-body">
                        <strong className="activity-title">{act.title}</strong>
                        <p className="activity-desc">{act.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliverables Bar */}
              <div className="workflow-deliverables-bar">
                <span className="deliverables-label">Key Deliverables:</span>
                <div className="deliverables-chips">
                  {currentPhase.deliverables.map((item) => (
                    <span key={item} className="deliverable-chip">
                      <svg
                        className="chip-check"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Phase Stepper & Navigation Pills */}
        <div className="workflow-bottom-bar">
          <div className="workflow-stepper-pills">
            {WORKFLOW_PHASES.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                className={`stepper-pill ${idx === activeIndex ? 'is-active' : ''}`}
                onClick={() => handleSelectPhase(idx)}
                aria-label={`Jump to ${p.phase}: ${p.title}`}
              >
                <span className="stepper-pill-num">{p.id}</span>
                <span className="stepper-pill-label">{p.title.split(' ')[0]}</span>
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
    </section>
  );
}

export default WorkflowDialSection;
