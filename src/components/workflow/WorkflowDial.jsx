import './WorkflowDial.css';

/**
 * WorkflowDial
 * Renders the circular dial arc on the left with rotating phase numbers (01–05).
 * Numbers rotate along the circle perimeter as the user scrolls,
 * lighting up in vibrant mint green when aligned with the active horizontal target.
 */
export function WorkflowDial({
  phases = [],
  activeIndex = 0,
  onSelectPhase,
  rotationAngle = 0,
  radius = 460,
  angleStep = 24,
}) {
  return (
    <div className="workflow-dial-wrapper" aria-label="Workflow Phase Dial">
      <div
        className="workflow-dial-wheel"
        style={{
          transform: `rotate(${rotationAngle}deg)`,
        }}
      >
        {/* The Outer Circular Arc Guide */}
        <svg
          className="dial-arc-svg"
          viewBox="0 0 1200 1200"
          aria-hidden="true"
        >
          <circle
            cx="600"
            cy="600"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="dial-arc-circle"
          />
        </svg>

        {/* Phase Numbers along the Arc Perimeter */}
        {phases.map((phase, index) => {
          const itemAngle = index * angleStep;
          const rad = (itemAngle * Math.PI) / 180;
          // Coordinates on circle centered at (600, 600)
          const x = 600 + radius * Math.cos(rad);
          const y = 600 + radius * Math.sin(rad);
          const isActive = index === activeIndex;

          return (
            <button
              key={phase.id}
              type="button"
              className={`dial-number-btn ${isActive ? 'is-active' : ''}`}
              style={{
                left: `${(x / 1200) * 100}%`,
                top: `${(y / 1200) * 100}%`,
                transform: `translate(-50%, -50%) rotate(${itemAngle}deg)`,
              }}
              onClick={() => onSelectPhase?.(index)}
              aria-label={`Go to ${phase.phase}: ${phase.title}`}
              aria-current={isActive ? 'step' : undefined}
            >
              <span className="dial-number-text">{phase.id}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default WorkflowDial;
