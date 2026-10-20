import { useEffect, useRef } from 'react';
import type { CSSProperties, RefObject } from 'react';
import { ProjectArt } from './ProjectMockup';
import type { Project } from './workData';

interface ProjectDialogProps {
  project: Project;
  open: boolean;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLElement | null>;
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

export default function ProjectDialog({
  project,
  open,
  onClose,
  returnFocusRef,
}: ProjectDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const accentStyle = { '--sw-accent': project.accent } as CSSProperties;
  const titleId = `sw-dialog-title-${project.slug}`;
  const summaryId = `sw-dialog-summary-${project.slug}`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (open) return undefined;

    const trigger = returnFocusRef.current;
    if (!trigger) return undefined;

    const frame = window.requestAnimationFrame(() => {
      if (document.contains(trigger)) trigger.focus();
    });

    return () => window.cancelAnimationFrame(frame);
  }, [open, returnFocusRef]);

  return (
    <dialog
      ref={dialogRef}
      className="sw-dialog"
      aria-labelledby={titleId}
      aria-describedby={summaryId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button type="button" className="sw-dialog-close" onClick={onClose} aria-label="Close case study">
        <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
          <path
            d="M5.5 5.5l9 9M14.5 5.5l-9 9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div className="sw-dialog-inner">
        <div className="sw-dialog-visual" style={accentStyle}>
          <div className="sw-dialog-art">
            <ProjectArt project={project} />
          </div>
        </div>

        <div className="sw-dialog-body">
          <p className="sw-dialog-kicker">
            {project.year} · Case study
          </p>
          <h2 className="sw-dialog-title" id={titleId}>{project.name}</h2>
          <p className="sw-dialog-summary" id={summaryId}>{project.summary}</p>

          <ul className="sw-dialog-tags" aria-label="Services">
            {project.services.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>

          <dl className="sw-dialog-facts">
            <div>
              <dt>Sector</dt>
              <dd>{project.sector}</dd>
            </div>
            <div>
              <dt>Timeline</dt>
              <dd>{project.timeline}</dd>
            </div>
          </dl>

          <section className="sw-dialog-section">
            <h3>The challenge</h3>
            <p>{project.challenge}</p>
          </section>

          <section className="sw-dialog-section">
            <h3>What we did</h3>
            <p>{project.approach}</p>
          </section>

          <section className="sw-dialog-section">
            <h3>Key outcomes</h3>
            <ul className="sw-dialog-outcomes">
              {project.outcomes.map((outcome) => (
                <li key={outcome}>
                  <span className="sw-check" aria-hidden="true"><CheckIcon /></span>
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </section>

          {project.metrics.length > 0 && (
            <dl className="sw-dialog-metrics">
              {project.metrics.map((metric) => (
                <div key={`${metric.value}-${metric.label}`}>
                  <dt>{metric.label}</dt>
                  <dd>{metric.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="sw-dialog-actions">
            <a href="#contact" className="sw-btn sw-btn--primary" onClick={onClose}>
              Start a project like this
              <span className="sw-btn-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </dialog>
  );
}
