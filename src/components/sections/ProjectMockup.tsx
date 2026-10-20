import type { ReactNode } from 'react';
import type { MockupKind, Project } from './workData';

interface ProjectMockupProps {
  kind: MockupKind;
  name: string;
}

interface ProjectArtProps {
  project: Project;
}

function BrowserChrome({
  name,
  kind,
  children,
}: {
  name: string;
  kind: MockupKind;
  children: ReactNode;
}) {
  return (
    <span className="sw-browser">
      <span className="sw-browser-bar">
        <span className="sw-browser-dots">
          <span />
          <span />
          <span />
        </span>
        <span className="sw-browser-url">{name}</span>
      </span>
      <span className={`sw-browser-body sw-browser-body--${kind}`}>{children}</span>
    </span>
  );
}

function Dashboard() {
  return (
    <span className="sw-ui sw-ui--dashboard">
      <span className="sw-ui-side">
        <span className="sw-ui-logo" />
        <span className="sw-ui-nav is-active" />
        <span className="sw-ui-nav" />
        <span className="sw-ui-nav" />
        <span className="sw-ui-nav" />
        <span className="sw-ui-nav" />
        <span className="sw-ui-avatar" />
      </span>

      <span className="sw-ui-main">
        <span className="sw-ui-topline">
          <span className="sw-ui-heading" />
          <span className="sw-ui-pill" />
        </span>

        <span className="sw-ui-stats">
          <span className="sw-ui-stat">
            <span className="sw-ui-stat-label" />
            <span className="sw-ui-stat-value" />
          </span>
          <span className="sw-ui-stat">
            <span className="sw-ui-stat-label" />
            <span className="sw-ui-stat-value" />
          </span>
          <span className="sw-ui-stat">
            <span className="sw-ui-stat-label" />
            <span className="sw-ui-stat-value" />
          </span>
        </span>

        <span className="sw-ui-chart">
          <span className="sw-ui-bars">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </span>
        </span>

        <span className="sw-ui-rows">
          <span className="sw-ui-row">
            <span className="sw-ui-row-dot" />
            <span className="sw-ui-row-line" />
            <span className="sw-ui-row-tag" />
          </span>
          <span className="sw-ui-row">
            <span className="sw-ui-row-dot" />
            <span className="sw-ui-row-line" />
            <span className="sw-ui-row-tag" />
          </span>
          <span className="sw-ui-row">
            <span className="sw-ui-row-dot" />
            <span className="sw-ui-row-line" />
            <span className="sw-ui-row-tag" />
          </span>
        </span>
      </span>
    </span>
  );
}

function Workspace() {
  return (
    <span className="sw-ui sw-ui--workspace">
      <span className="sw-ui-wsbar">
        <span className="sw-ui-logo" />
        <span className="sw-ui-tabs">
          <span className="is-active" />
          <span />
          <span />
        </span>
        <span className="sw-ui-ws-actions">
          <span className="sw-ui-avatar" />
          <span className="sw-ui-avatar sw-ui-avatar--alt" />
        </span>
      </span>

      <span className="sw-ui-columns">
        <span className="sw-ui-column">
          <span className="sw-ui-column-head">
            <span className="sw-ui-coltitle" />
            <span className="sw-ui-count" />
          </span>
          <span className="sw-ui-task">
            <span className="sw-ui-task-line" />
            <span className="sw-ui-task-meta">
              <span className="sw-ui-avatar sw-ui-avatar--tiny" />
              <span className="sw-ui-mini-line" />
            </span>
          </span>
          <span className="sw-ui-task">
            <span className="sw-ui-task-line" />
            <span className="sw-ui-task-meta">
              <span className="sw-ui-avatar sw-ui-avatar--tiny" />
              <span className="sw-ui-mini-line" />
            </span>
          </span>
        </span>

        <span className="sw-ui-column">
          <span className="sw-ui-column-head">
            <span className="sw-ui-coltitle" />
            <span className="sw-ui-count" />
          </span>
          <span className="sw-ui-task is-highlight">
            <span className="sw-ui-task-line" />
            <span className="sw-ui-task-meta">
              <span className="sw-ui-avatar sw-ui-avatar--tiny" />
              <span className="sw-ui-mini-line" />
            </span>
          </span>
          <span className="sw-ui-task">
            <span className="sw-ui-task-line" />
            <span className="sw-ui-task-meta">
              <span className="sw-ui-avatar sw-ui-avatar--tiny" />
              <span className="sw-ui-mini-line" />
            </span>
          </span>
        </span>

        <span className="sw-ui-column">
          <span className="sw-ui-column-head">
            <span className="sw-ui-coltitle" />
            <span className="sw-ui-count" />
          </span>
          <span className="sw-ui-task">
            <span className="sw-ui-task-line" />
            <span className="sw-ui-task-meta">
              <span className="sw-ui-avatar sw-ui-avatar--tiny" />
              <span className="sw-ui-mini-line" />
            </span>
          </span>
          <span className="sw-ui-task">
            <span className="sw-ui-task-line" />
            <span className="sw-ui-task-meta">
              <span className="sw-ui-avatar sw-ui-avatar--tiny" />
              <span className="sw-ui-mini-line" />
            </span>
          </span>
        </span>
      </span>
    </span>
  );
}

function Landing() {
  return (
    <span className="sw-ui sw-ui--landing">
      <span className="sw-ui-lnav">
        <span className="sw-ui-logo" />
        <span className="sw-ui-lnavlinks">
          <span />
          <span />
          <span />
        </span>
        <span className="sw-ui-lnavcta" />
      </span>

      <span className="sw-ui-lhero">
        <span className="sw-ui-lebrow" />
        <span className="sw-ui-lheadline">
          <span />
          <span />
          <span className="is-short" />
        </span>
        <span className="sw-ui-lsub">
          <span />
          <span />
        </span>
        <span className="sw-ui-lcta" />
      </span>

      <span className="sw-ui-lcards">
        <span className="sw-ui-lcard">
          <span className="sw-ui-licon" />
          <span className="sw-ui-lline" />
          <span className="sw-ui-lline is-short" />
        </span>
        <span className="sw-ui-lcard">
          <span className="sw-ui-licon" />
          <span className="sw-ui-lline" />
          <span className="sw-ui-lline is-short" />
        </span>
        <span className="sw-ui-lcard">
          <span className="sw-ui-licon" />
          <span className="sw-ui-lline" />
          <span className="sw-ui-lline is-short" />
        </span>
      </span>
    </span>
  );
}

function BrandBoard() {
  return (
    <span className="sw-brandboard">
      <span className="sw-brand-top">
        <span className="sw-brand-mark">H</span>
        <span className="sw-brand-wordmark">
          <span />
          <span className="is-short" />
        </span>
      </span>

      <span className="sw-brand-swatches">
        <span />
        <span />
        <span />
        <span />
      </span>

      <span className="sw-brand-type">
        <span className="sw-brand-aa">Aa</span>
        <span className="sw-brand-type-lines">
          <span />
          <span />
          <span className="is-short" />
        </span>
      </span>

      <span className="sw-brand-footer">
        <span className="sw-brand-rule" />
        <span className="sw-brand-rule is-short" />
      </span>
    </span>
  );
}

export default function ProjectMockup({ kind, name }: ProjectMockupProps) {
  if (kind === 'brand') {
    return (
      <span className="sw-mockup-art" aria-hidden="true">
        <BrandBoard />
      </span>
    );
  }

  return (
    <span className="sw-mockup-art" aria-hidden="true">
      <BrowserChrome name={name} kind={kind}>
        {kind === 'dashboard' && <Dashboard />}
        {kind === 'workspace' && <Workspace />}
        {kind === 'landing' && <Landing />}
      </BrowserChrome>
    </span>
  );
}

export function ProjectArt({ project }: ProjectArtProps) {
  if (project.screenshot) {
    return (
      <span className="sw-mockup-art" aria-hidden="true">
        <BrowserChrome name={project.name} kind={project.mockup}>
          <img src={project.screenshot} alt="" loading="lazy" />
        </BrowserChrome>
      </span>
    );
  }

  return <ProjectMockup kind={project.mockup} name={project.name} />;
}
