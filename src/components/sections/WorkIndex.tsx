import React, { useRef } from 'react';
import type { Project } from './ProjectCard';

interface WorkIndexProps {
  projects: Project[];
  activeIndex: number;
  onPreview: (index: number) => void;
  onCommit: (index: number) => void;
  prefersReducedMotion: boolean;
  controlsId: string;
}

/**
 * Interactive project index. A listbox of roving-tabindex rows.
 * Hover / focus previews a project; click / Enter commits it.
 */
export const WorkIndex: React.FC<WorkIndexProps> = ({
  projects,
  activeIndex,
  onPreview,
  onCommit,
  prefersReducedMotion,
  controlsId,
}) => {
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const focusRow = (index: number) => {
    const el = rowRefs.current[index];
    if (el) el.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = projects.length - 1;
    let target: number | null = null;

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        target = index === last ? 0 : index + 1;
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        target = index === 0 ? last : index - 1;
        break;
      case 'Home':
        target = 0;
        break;
      case 'End':
        target = last;
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        onCommit(index);
        return;
      default:
        return;
    }

    event.preventDefault();
    onPreview(target);
    focusRow(target);
  };

  return (
    <div
      className="work-index"
      role="listbox"
      aria-label="Project index"
      aria-orientation="vertical"
    >
      {projects.map((project, index) => {
        const isActive = index === activeIndex;
        const delay = prefersReducedMotion ? 0 : 0.45 + index * 0.06;

        return (
          <button
            key={project.slug}
            type="button"
            role="option"
            id={`work-index-${project.slug}`}
            aria-selected={isActive}
            aria-controls={controlsId}
            tabIndex={isActive ? 0 : -1}
            ref={(el) => {
              rowRefs.current[index] = el;
            }}
            className={`work-index-row${isActive ? ' is-active' : ''}`}
            style={{
              ['--accent' as string]: project.accent,
              transitionDelay: `${delay}s`,
            }}
            onClick={() => onCommit(index)}
            onMouseEnter={() => onPreview(index)}
            onFocus={() => onPreview(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            <span className="work-index-body">
              <span className="work-index-title">{project.title}</span>
              <span className="work-index-meta">
                {project.year} · {project.tags.slice(0, 2).join(' · ')}
              </span>
            </span>
            <span className="work-index-dot" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
};

export default WorkIndex;
