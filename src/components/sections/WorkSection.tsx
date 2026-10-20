import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent } from 'react';
import ProjectDialog from './ProjectDialog';
import ProjectSelector from './ProjectSelector';
import ProjectVisual from './ProjectVisual';
import { PROJECTS } from './workData';
import { RESULTS_DISCLOSURE, STUDIO_PROOF } from '../../data/studioProof';
import { useProjectDeck } from './useProjectDeck';
import './WorkSection.css';

const AUTOPLAY_DURATION_MS = 6000;

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const mediaQuery = window.matchMedia(query);
    const onChange = () => setMatches(mediaQuery.matches);

    onChange();
    mediaQuery.addEventListener?.('change', onChange);

    return () => mediaQuery.removeEventListener?.('change', onChange);
  }, [query]);

  return matches;
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d="M3.5 8.2 6.4 11l6.1-6.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
      <path
        d={direction === 'left' ? 'm12 5-5 5 5 5' : 'm8 5 5 5-5 5'}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlayPauseIcon({ playing }: { playing: boolean }) {
  if (playing) {
    return (
      <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
        <rect x="6" y="5" width="3" height="10" rx="1" fill="currentColor" />
        <rect x="11" y="5" width="3" height="10" rx="1" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
      <path d="M7 5.4v9.2L15 10Z" fill="currentColor" />
    </svg>
  );
}

export function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const dialogTriggerRef = useRef<HTMLElement | null>(null);

  const [hasEntered, setHasEntered] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const [isPaused, setIsPaused] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { activeIndex, goTo, next, prev, prefersReducedMotion } = useProjectDeck(
    PROJECTS.length
  );
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const activeProject = PROJECTS[activeIndex];
  const autoplayEnabled = isDesktop && !prefersReducedMotion;
  const autoplayRunning =
    autoplayEnabled && hasEntered && !isPaused && !isDialogOpen;

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setHasEntered(true);
      return undefined;
    }

    const node = sectionRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const handleTabSelect = useCallback(
    (index: number) => {
      setIsPaused(false);
      goTo(index);
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', `#work-${PROJECTS[index].slug}`);
      }
    },
    [goTo]
  );

  const handleStep = useCallback(
    (direction: 1 | -1) => {
      setIsPaused(false);
      if (direction === 1) next();
      else prev();
    },
    [next, prev]
  );

  const toggleAutoplay = useCallback(() => {
    setIsPaused((value) => !value);
  }, []);

  const handleAutoplayComplete = useCallback(() => {
    next();
  }, [next]);

  const openCaseStudy = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    dialogTriggerRef.current = event.currentTarget;
    setIsDialogOpen(true);
  }, []);

  const closeCaseStudy = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const counterCurrent = String(activeIndex + 1).padStart(2, '0');
  const counterTotal = String(PROJECTS.length).padStart(2, '0');
  const showPlay = isPaused;
  const autoplayLabel = isPaused
    ? 'Resume automatic project rotation'
    : 'Pause automatic project rotation';

  return (
    <section
      id="work"
      ref={sectionRef}
      className={`sw-section${hasEntered ? ' is-visible' : ''}`}
      aria-labelledby="work-heading"
    >
      <div className="sw-shell">
        <header className="sw-header">
          <div className="sw-header-copy">
            <span className="sw-eyebrow">
              <span className="sw-eyebrow-dot" aria-hidden="true" />
              Selected work
            </span>
            <h2 id="work-heading" className="sw-title">
              Projects we&apos;re proud of
            </h2>
            <p className="sw-subtitle">
              A look at the products, brands and websites we&apos;ve designed and
              built — and the outcomes behind them. Concept projects are clearly
              labelled.
            </p>
          </div>

          <div className="sw-controls">
            <span className="sw-counter" aria-hidden="true">
              <span className="sw-counter-current">{counterCurrent}</span>
              <span className="sw-counter-sep">/</span>
              <span>{counterTotal}</span>
            </span>

            <div className="sw-control-buttons">
              <button
                type="button"
                className="sw-control-btn"
                onClick={() => handleStep(-1)}
                aria-label="Previous project"
              >
                <ChevronIcon direction="left" />
              </button>
              <button
                type="button"
                className="sw-control-btn"
                onClick={() => handleStep(1)}
                aria-label="Next project"
              >
                <ChevronIcon direction="right" />
              </button>
              {autoplayEnabled && (
                <button
                  type="button"
                  className="sw-control-btn sw-control-btn--play"
                  onClick={toggleAutoplay}
                  aria-label={autoplayLabel}
                >
                  <PlayPauseIcon playing={!showPlay} />
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="sw-panels">
          {PROJECTS.map((project, index) => {
            const isActive = index === activeIndex;

            return (
              <div
                key={project.slug}
                id={`sw-panel-${project.slug}`}
                role="tabpanel"
                aria-labelledby={`sw-tab-${project.slug}`}
                className={`sw-panel${isActive ? ' is-active' : ''}`}
                inert={!isActive}
                aria-hidden={isActive ? undefined : true}
              >
                <div
                  className="sw-feature"
                  style={{ '--sw-accent': project.accent } as CSSProperties}
                >
                  <ProjectVisual
                    project={project}
                    onOpen={openCaseStudy}
                    prefersReducedMotion={prefersReducedMotion}
                  />

                  <div className="sw-feature-copy">
                    <div className="sw-meta-row">
                      <span className="sw-sector">{project.sector}</span>
                      <span
                        className={`sw-project-type${
                          project.projectType === 'Concept project' ? ' is-concept' : ''
                        }`}
                      >
                        {project.projectType}
                      </span>
                      <span className="sw-year">{project.year}</span>
                    </div>

                    <h3 className="sw-project-name">{project.name}</h3>
                    <p className="sw-project-summary">{project.summary}</p>

                    <div className="sw-story">
                      <div className="sw-story-block">
                        <h4>The challenge</h4>
                        <p>{project.challenge}</p>
                      </div>
                      <div className="sw-story-block">
                        <h4>What we did</h4>
                        <p>{project.approach}</p>
                      </div>
                    </div>

                    <div className="sw-outcomes">
                      <h4>Key outcomes</h4>
                      <ul>
                        {project.outcomes.map((outcome) => (
                          <li key={outcome}>
                            <span className="sw-check" aria-hidden="true"><CheckIcon /></span>
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <dl className="sw-facts">
                      <div className="sw-fact">
                        <dt>Timeline</dt>
                        <dd>{project.timeline}</dd>
                      </div>
                      <div className="sw-fact">
                        <dt>Services</dt>
                        <dd>
                          <span className="sw-service-pills">
                            {project.services.map((service) => (
                              <span key={service} className="sw-service-pill">{service}</span>
                            ))}
                          </span>
                        </dd>
                      </div>
                    </dl>

                    {project.metrics.length > 0 && (
                      <dl className="sw-metrics">
                        {project.metrics.map((metric) => (
                          <div key={`${metric.value}-${metric.label}`}>
                            <dt>{metric.label}</dt>
                            <dd>{metric.value}</dd>
                          </div>
                        ))}
                      </dl>
                    )}

                    <div className="sw-actions">
                      <button
                        type="button"
                        className="sw-btn sw-btn--primary"
                        onClick={openCaseStudy}
                        aria-haspopup="dialog"
                      >
                        {project.projectType === 'Concept project'
                          ? 'View concept project'
                          : 'Read the case study'}
                        <span className="sw-btn-arrow" aria-hidden="true">→</span>
                      </button>
                      <a href="#contact" className="sw-text-link">
                        Start a project like this
                        <span className="sw-text-link-arrow" aria-hidden="true">→</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="sw-selector-wrap">
          <ProjectSelector
            projects={PROJECTS}
            activeIndex={activeIndex}
            onSelect={handleTabSelect}
            autoplayEnabled={autoplayEnabled}
            autoplayRunning={autoplayRunning}
            autoplayDuration={AUTOPLAY_DURATION_MS}
            onAutoplayComplete={handleAutoplayComplete}
          />
        </div>

        <footer className="sw-closing">
          <ul className="sw-proof" aria-label="Studio results">
            {STUDIO_PROOF.map((item) => (
              <li key={item.label} className="sw-proof-item">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </li>
            ))}
          </ul>

          <p className="sw-proof-note">{RESULTS_DISCLOSURE}</p>

          <div className="sw-closing-copy">
            <h3 className="sw-closing-title">Have a project like these in mind?</h3>
            <p className="sw-closing-text">
              Tell us what you&apos;re building and we&apos;ll suggest the right mix of
              design, development and growth work. Free 30-minute call.
            </p>
          </div>

          <a href="#contact" className="sw-btn sw-btn--primary sw-btn--lg">
            Start your project
            <span className="sw-btn-arrow" aria-hidden="true">→</span>
          </a>
        </footer>

        <p className="sw-sr-only" aria-live="polite" aria-atomic="true">
          Project {activeIndex + 1} of {PROJECTS.length}: {activeProject.name}.
        </p>
      </div>

      <ProjectDialog
        project={activeProject}
        open={isDialogOpen}
        onClose={closeCaseStudy}
        returnFocusRef={dialogTriggerRef}
      />
    </section>
  );
}

export default WorkSection;
