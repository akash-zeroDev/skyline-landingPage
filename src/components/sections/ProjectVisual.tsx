import { useRef } from 'react';
import type { CSSProperties, MouseEvent } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ProjectArt } from './ProjectMockup';
import { MOCKUP_LABELS } from './workData';
import type { Project } from './workData';

interface ProjectVisualProps {
  project: Project;
  onOpen: (event: MouseEvent<HTMLButtonElement>) => void;
  prefersReducedMotion: boolean;
}

export default function ProjectVisual({
  project,
  onOpen,
  prefersReducedMotion,
}: ProjectVisualProps) {
  const stageRef = useRef<HTMLSpanElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const ringX = useSpring(pointerX, { stiffness: 140, damping: 22, mass: 0.8 });
  const ringY = useSpring(pointerY, { stiffness: 140, damping: 22, mass: 0.8 });

  const labelId = `sw-visual-label-${project.slug}`;
  const style = { '--sw-accent': project.accent } as CSSProperties;

  const moveBubble = (event: MouseEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion) return;
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointerX.set(event.clientX - rect.left);
    pointerY.set(event.clientY - rect.top);
  };

  return (
    <button
      type="button"
      className="sw-visual"
      style={style}
      onClick={onOpen}
      onMouseEnter={moveBubble}
      onMouseMove={moveBubble}
      aria-haspopup="dialog"
      aria-labelledby={labelId}
    >
      <span className="sw-visual-stage" ref={stageRef}>
        <span className="sw-float-chip sw-float-chip--sector" aria-hidden="true">
          {project.sector}
        </span>
        <span className="sw-float-chip sw-float-chip--kind" aria-hidden="true">
          {project.projectType === 'Concept project' ? 'Concept' : 'Client'} ·{' '}
          {MOCKUP_LABELS[project.mockup]}
        </span>

        <span className="sw-mockup-frame">
          <span className="sw-mockup">
            <ProjectArt project={project} />
          </span>
        </span>
      </span>

      <span className="sw-featured-outcome" aria-hidden="true">
        <span className="sw-featured-outcome-label">Featured outcome</span>
        <span className="sw-featured-outcome-text">{project.outcomes[0]}</span>
      </span>

      <span className="sw-visual-hint" aria-hidden="true">
        View case study <span className="sw-visual-hint-arrow">→</span>
      </span>

      {!prefersReducedMotion && (
        <motion.span className="sw-cursor" aria-hidden="true" style={{ x: ringX, y: ringY }}>
          View <span className="sw-cursor-arrow">→</span>
        </motion.span>
      )}

      <span id={labelId} className="sw-sr-only">
        View the {project.name}{' '}
        {project.projectType === 'Concept project' ? 'concept project' : 'case study'}.
        Illustrative preview of the {project.name} {MOCKUP_LABELS[project.mockup]}.
      </span>
    </button>
  );
}
