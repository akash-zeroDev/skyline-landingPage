import React, { useEffect, useRef, useState } from 'react';
import ProjectCard, { Project } from './ProjectCard';
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
  },
  {
    slug: 'hazz',
    title: 'Hazz',
    description: 'Role-based workspace for super admins, admins and employees',
    tags: ['Web App', 'UI/UX'],
    image: 'https://picsum.photos/seed/skyline-work-2/1200/900',
    imageAlt: 'Hazz role-based internal workspace and permissions admin portal',
  },
  {
    slug: 'aura-fintech',
    title: 'Aura Fintech',
    description: 'Conversion-focused landing page for a fintech startup',
    tags: ['Landing Page', 'SEO'],
    image: 'https://picsum.photos/seed/skyline-work-3/1200/900',
    imageAlt: 'Aura Fintech modern conversion-optimized financial platform landing page',
  },
  {
    slug: 'haven-hospitality',
    title: 'Haven Hospitality',
    description: 'Brand refresh and website for a hospitality business',
    tags: ['Branding', 'Website'],
    image: 'https://picsum.photos/seed/skyline-work-4/1200/900',
    imageAlt: 'Haven Hospitality bespoke branding and boutique hotel reservation website',
  },
];

export const WorkSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasEntered, setHasEntered] = useState(false);

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

        {/* 2-Column Responsive Project Grid */}
        <ul
          className={`work-grid ${hasEntered ? 'is-visible' : ''}`}
          aria-label="Selected projects grid"
        >
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              index={index}
            />
          ))}
        </ul>

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
