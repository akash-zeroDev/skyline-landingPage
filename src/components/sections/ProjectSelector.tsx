import { useEffect, useRef } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';
import type { MockupKind, Project } from './workData';

interface ProjectSelectorProps {
  projects: Project[];
  activeIndex: number;
  onSelect: (index: number) => void;
  autoplayEnabled: boolean;
  autoplayRunning: boolean;
  autoplayDuration: number;
  onAutoplayComplete: () => void;
}

function ProjectIcon({ kind }: { kind: MockupKind }) {
  if (kind === 'dashboard') {
    return (
      <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
        <rect x="3" y="3" width="5.5" height="5.5" rx="1.4" />
        <rect x="11.5" y="3" width="5.5" height="5.5" rx="1.4" />
        <rect x="3" y="11.5" width="5.5" height="5.5" rx="1.4" />
        <rect x="11.5" y="11.5" width="5.5" height="5.5" rx="1.4" />
      </svg>
    );
  }

  if (kind === 'workspace') {
    return (
      <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
        <rect x="3" y="3.5" width="14" height="4.2" rx="1.3" />
        <rect x="3" y="10.7" width="4" height="5.3" rx="1.2" />
        <rect x="8" y="10.7" width="4" height="5.3" rx="1.2" />
        <rect x="13" y="10.7" width="4" height="5.3" rx="1.2" />
      </svg>
    );
  }

  if (kind === 'landing') {
    return (
      <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
        <rect x="2.5" y="3.5" width="15" height="13" rx="2" />
        <path d="M2.5 7.2h15" />
        <path d="M6 10.5h8M6 13h5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true">
      <path d="M10 2.6l1.85 5.2 5.15 1.8-5.15 1.8L10 16.6l-1.85-5.2L3 9.6l5.15-1.8Z" />
      <path d="M15.6 3.2v2.4M14.4 4.4h2.4" />
    </svg>
  );
}

function AutoplayProgress({
  running,
  duration,
  onComplete,
}: {
  running: boolean;
  duration: number;
  onComplete: () => void;
}) {
  const fillRef = useRef<HTMLSpanElement>(null);
  const elapsedRef = useRef(0);
  const frameRef = useRef(0);
  const lastRef = useRef(0);
  const completeRef = useRef(onComplete);

  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!running) {
      window.cancelAnimationFrame(frameRef.current);
      return undefined;
    }

    lastRef.current = performance.now();

    const tick = (now: number) => {
      const delta = Math.min(now - lastRef.current, 250);
      lastRef.current = now;
      elapsedRef.current = Math.min(duration, elapsedRef.current + delta);

      const progress = elapsedRef.current / duration;
      if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${progress})`;
      }

      if (progress >= 1) {
        completeRef.current();
        return;
      }

      frameRef.current = window.requestAnimationFrame(tick);
    };

    frameRef.current = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameRef.current);
  }, [running, duration]);

  return (
    <span className="sw-tab-progress" aria-hidden="true">
      <span ref={fillRef} className="sw-tab-progress-fill" />
    </span>
  );
}

export default function ProjectSelector({
  projects,
  activeIndex,
  onSelect,
  autoplayEnabled,
  autoplayRunning,
  autoplayDuration,
  onAutoplayComplete,
}: ProjectSelectorProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = projects.length - 1;
    let target: number | null = null;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        target = index === last ? 0 : index + 1;
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        target = index === 0 ? last : index - 1;
        break;
      case 'Home':
        target = 0;
        break;
      case 'End':
        target = last;
        break;
      default:
        return;
    }

    event.preventDefault();
    onSelect(target);
    tabRefs.current[target]?.focus();
  };

  return (
    <div className="sw-selector" role="tablist" aria-label="Selected projects">
      {projects.map((project, index) => {
        const isActive = index === activeIndex;

        return (
          <button
            key={project.slug}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`sw-tab-${project.slug}`}
            aria-selected={isActive}
            aria-controls={`sw-panel-${project.slug}`}
            tabIndex={isActive ? 0 : -1}
            className={`sw-tab${isActive ? ' is-active' : ''}`}
            style={{ '--sw-accent': project.accent } as CSSProperties}
            title={`${project.year} · ${project.services.join(' · ')}`}
            onClick={() => onSelect(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            <span className="sw-tab-icon" aria-hidden="true">
              <ProjectIcon kind={project.mockup} />
            </span>

            <span className="sw-tab-body">
              <span className="sw-tab-name">{project.name}</span>
              <span className="sw-tab-meta">
                {project.year} · {project.services[0]}
                {project.services.length > 1 ? ` +${project.services.length - 1}` : ''}
              </span>
              <span className="sw-tab-sector">{project.sector}</span>
            </span>

            {isActive && autoplayEnabled && (
              <AutoplayProgress
                key={project.slug}
                running={autoplayRunning}
                duration={autoplayDuration}
                onComplete={onAutoplayComplete}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
