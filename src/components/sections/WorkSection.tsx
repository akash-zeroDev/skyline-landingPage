import React, { useCallback, useEffect, useRef, useState } from 'react';
import ProjectCard, { Project } from './ProjectCard';
import WorkIndex from './WorkIndex';
import { useProjectDeck } from './useProjectDeck';
import './WorkSection.css';

/**
 * Curated projects array.
 * Update image URLs or copy here to effortlessly swap case studies.
 */
export const projects: Project[] = [
  {
    slug: 'classly',
    title: 'Classly',
    description: 'Attendance and fee management for coaching institutes',
    tags: ['Web App', 'Dashboard', 'SaaS'],
    image: 'https://picsum.photos/seed/skyline-work-1/1200/900',
    imageAlt: 'Classly coaching institute attendance and fee management dashboard interface',
    year: '2025',
    accent: '#2b7ffb',
  },
  {
    slug: 'hazz',
    title: 'Hazz',
    description: 'Role-based workspace for super admins, admins and employees',
    tags: ['Web App', 'UI/UX'],
    image: 'https://picsum.photos/seed/skyline-work-2/1200/900',
    imageAlt: 'Hazz role-based internal workspace and permissions admin portal',
    year: '2024',
    accent: '#19b954',
  },
  {
    slug: 'aura-fintech',
    title: 'Aura Fintech',
    description: 'Conversion-focused landing page for a fintech startup',
    tags: ['Landing Page', 'SEO'],
    image: 'https://picsum.photos/seed/skyline-work-3/1200/900',
    imageAlt: 'Aura Fintech modern conversion-optimized financial platform landing page',
    year: '2024',
    accent: '#fb6b07',
  },
  {
    slug: 'haven-hospitality',
    title: 'Haven Hospitality',
    description: 'Brand refresh and website for a hospitality business',
    tags: ['Branding', 'Website'],
    image: 'https://picsum.photos/seed/skyline-work-4/1200/900',
    imageAlt: 'Haven Hospitality bespoke branding and boutique hotel reservation website',
    year: '2023',
    accent: '#fcc80c',
  },
];

const IDLE_INTERVAL_MS = 6000;

export const WorkSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [commitPulse, setCommitPulse] = useState(0);

  const { activeIndex, goTo, next, prev, prefersReducedMotion } = useProjectDeck(
    projects.length
  );

  const activeProject = projects[activeIndex];

  // Trigger viewport entrance animation
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setHasEntered(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Idle auto-advance: only while visible, allowed, and never interacted.
  useEffect(() => {
    if (!hasEntered || prefersReducedMotion || userInteracted) return;
    const timer = window.setInterval(() => next(), IDLE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [hasEntered, prefersReducedMotion, userInteracted, next]);

  const handlePreview = useCallback(
    (index: number) => {
      setUserInteracted(true);
      goTo(index);
    },
    [goTo]
  );

  const handleCommit = useCallback(
    (index: number) => {
      setUserInteracted(true);
      goTo(index);
      setCommitPulse((value) => value + 1);
      if (typeof window !== 'undefined') {
        window.history.replaceState({}, '', `#work-${projects[index].slug}`);
      }
    },
    [goTo]
  );

  return (
    <section
      id="work"
      ref={sectionRef}
      className="work-section scroll-mt-28"
      aria-labelledby="work-heading"
    >
      <div className="work-container">
        {/* Section Header */}
        <header className="work-header">
          <div className="work-header-copy">
            <span className="work-eyebrow">Selected Work</span>
            <h2 id="work-heading" className="work-title">
              Projects we&apos;re proud of
            </h2>
            <p className="work-subtitle">
              Carefully engineered web applications, digital products, and brand experiences.
            </p>
          </div>

          {/* Desktop Right-Aligned Action Link */}
          <div className="work-header-action desktop-action">
            <a href="#work" className="view-all-link">
              <span>View all work</span>
              <span className="link-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </header>

        {/* Interactive Project Deck */}
        <div
          className={`work-deck ${hasEntered ? 'is-visible' : ''}`}
          style={{ ['--accent' as string]: activeProject.accent }}
        >
          <div className="work-deck-stage">
            <ProjectCard
              project={activeProject}
              mediaId="work-focus"
              onNext={next}
              onPrev={prev}
              onCommit={() => handleCommit(activeIndex)}
              prefersReducedMotion={prefersReducedMotion}
              commitPulse={commitPulse}
            />

            {/* Deck progress */}
            <div className="work-progress">
              <div
                className="work-progress-dots"
                role="group"
                aria-label="Project deck position"
              >
                {projects.map((project, index) => (
                  <button
                    key={project.slug}
                    type="button"
                    aria-current={index === activeIndex ? 'true' : undefined}
                    aria-label={`Show ${project.title}`}
                    tabIndex={-1}
                    className={`work-progress-dot${index === activeIndex ? ' is-active' : ''}`}
                    style={{ ['--accent' as string]: project.accent }}
                    onClick={() => handleCommit(index)}
                  />
                ))}
              </div>
            </div>

            <p className="sr-only" aria-live="polite">
              Now showing {activeProject.title}: {activeProject.description}
            </p>
          </div>

          <div className="work-deck-side">
            <WorkIndex
              projects={projects}
              activeIndex={activeIndex}
              onPreview={handlePreview}
              onCommit={handleCommit}
              prefersReducedMotion={prefersReducedMotion}
              controlsId="work-focus"
            />
          </div>
        </div>

        {/* Mobile View All Work Link (rendered below grid on screens < 640px) */}
        <div className="work-footer-action mobile-action">
          <a href="#work" className="view-all-link mobile-btn">
            <span>View all work</span>
            <span className="link-arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
