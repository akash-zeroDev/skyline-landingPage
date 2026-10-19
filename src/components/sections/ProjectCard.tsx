import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { EASE } from '../../motion/tokens';

export interface Project {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  imageAlt: string;
  year: string;
  accent: string;
}

interface ProjectCardProps {
  project: Project;
  onNext: () => void;
  onPrev: () => void;
  onCommit: () => void;
  prefersReducedMotion: boolean;
  commitPulse: number;
  mediaId: string;
}

const DRAG_THRESHOLD = 70;

/**
 * Focus card for the Project Deck: one large media card that supports
 * hover cursor-ring play, click-to-commit, and drag/swipe to cycle projects.
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onNext,
  onPrev,
  onCommit,
  prefersReducedMotion,
  commitPulse,
  mediaId,
}) => {
  const draggedRef = useRef(false);
  const mediaRef = useRef<HTMLButtonElement>(null);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const ringX = useSpring(pointerX, { stiffness: 120, damping: 20, mass: 1 });
  const ringY = useSpring(pointerY, { stiffness: 120, damping: 20, mass: 1 });

  const handlePointerMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (prefersReducedMotion) return;
    const rect = mediaRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointerX.set(event.clientX - rect.left);
    pointerY.set(event.clientY - rect.top);
  };

  const handleDragEnd = (_event: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x < -DRAG_THRESHOLD) onNext();
    else if (info.offset.x > DRAG_THRESHOLD) onPrev();

    // Suppress the click that follows a real drag (fires within ~250ms),
    // then release the guard so a later genuine click still commits.
    window.setTimeout(() => {
      draggedRef.current = false;
    }, 250);
  };

  const handleCommitClick = () => {
    if (draggedRef.current) return;
    onCommit();
  };

  return (
    <div className="work-focus-wrap" style={{ ['--accent' as string]: project.accent }}>
      <motion.button
        ref={mediaRef}
        type="button"
        id={mediaId}
        className="work-focus-media"
        aria-label={`View ${project.title} case study: ${project.description}`}
        drag={prefersReducedMotion ? false : 'x'}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.14}
        dragMomentum={false}
        onDragStart={() => {
          draggedRef.current = true;
        }}
        onDragEnd={handleDragEnd}
        onClick={handleCommitClick}
        onMouseMove={handlePointerMove}
      >
        <motion.img
          key={project.slug}
          src={project.image}
          alt={project.imageAlt}
          className="work-focus-image"
          loading="lazy"
          width={1200}
          height={900}
          draggable={false}
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: EASE.out }}
        />

        {!prefersReducedMotion && (
          <motion.span
            key={`${project.slug}-wipe`}
            className="work-focus-wipe"
            aria-hidden="true"
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 0.55, ease: EASE.out }}
          />
        )}

        {commitPulse > 0 && !prefersReducedMotion && (
          <motion.span
            key={`flash-${commitPulse}`}
            className="work-focus-flash"
            aria-hidden="true"
            initial={{ opacity: 0.55, scale: 0.985 }}
            animate={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.6, ease: EASE.out }}
          />
        )}

        <span className="case-study-badge" aria-hidden="true">
          <span>View case study</span>
          <span className="badge-arrow">→</span>
        </span>

        {!prefersReducedMotion && (
          <motion.span
            className="work-focus-ring"
            aria-hidden="true"
            style={{ x: ringX, y: ringY }}
          >
            <span className="work-focus-ring-label">View →</span>
          </motion.span>
        )}
      </motion.button>

      <div className="work-focus-footer">
        <div className="work-focus-heading">
          <h3 className="work-focus-title">{project.title}</h3>
          <p className="work-focus-description">{project.description}</p>
        </div>
        <ul className="project-tags-list" aria-label="Project tags">
          {project.tags.map((tag) => (
            <li key={tag} className="project-tag-pill">
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProjectCard;
