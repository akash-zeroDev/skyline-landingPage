import { useMemo } from 'react';
import './AmbientBlurBackdrop.css';

/**
 * AmbientBlurBackdrop
 * Renders dynamic, multi-orb blurred ambient gradient atmospheric backdrops
 * that smoothly shift colors, coordinates, and scale as the workflow phases advance.
 */
export function AmbientBlurBackdrop({ activeIndex = 0, phases = [] }) {
  const currentPhase = phases[activeIndex] || phases[0];
  const theme = currentPhase?.theme || {
    orb1: 'rgba(110, 231, 183, 0.45)',
    orb2: 'rgba(186, 230, 253, 0.50)',
    orb3: 'rgba(21, 27, 92, 0.08)',
  };

  // Orbital positions mapped per phase index (0 to 4)
  const orbTransforms = useMemo(() => {
    const positions = [
      // Phase 01: Top-left mint, center-right cyan, bottom navy
      {
        orb1: { transform: 'translate(5%, -10%) scale(1.1)' },
        orb2: { transform: 'translate(65%, 20%) scale(1.0)' },
        orb3: { transform: 'translate(25%, 65%) scale(0.95)' },
      },
      // Phase 02: Drift towards center-left & top-right
      {
        orb1: { transform: 'translate(45%, -5%) scale(1.05)' },
        orb2: { transform: 'translate(15%, 45%) scale(1.15)' },
        orb3: { transform: 'translate(70%, 55%) scale(1.0)' },
      },
      // Phase 03: Radiant spread for design phase
      {
        orb1: { transform: 'translate(70%, 10%) scale(1.2)' },
        orb2: { transform: 'translate(30%, 25%) scale(1.05)' },
        orb3: { transform: 'translate(10%, 65%) scale(1.1)' },
      },
      // Phase 04: Engineering teal focus
      {
        orb1: { transform: 'translate(20%, 35%) scale(1.15)' },
        orb2: { transform: 'translate(75%, -5%) scale(1.0)' },
        orb3: { transform: 'translate(45%, 70%) scale(1.05)' },
      },
      // Phase 05: Launch golden-mint surge
      {
        orb1: { transform: 'translate(55%, 15%) scale(1.25)' },
        orb2: { transform: 'translate(10%, 10%) scale(1.1)' },
        orb3: { transform: 'translate(75%, 60%) scale(1.15)' },
      },
    ];
    return positions[activeIndex] || positions[0];
  }, [activeIndex]);

  return (
    <div className="ambient-blur-backdrop" aria-hidden="true">
      {/* Orb 1: Primary Accent Glow */}
      <div
        className="ambient-orb orb-primary"
        style={{
          backgroundColor: theme.orb1,
          ...orbTransforms.orb1,
        }}
      />

      {/* Orb 2: Secondary Harmonic Glow */}
      <div
        className="ambient-orb orb-secondary"
        style={{
          backgroundColor: theme.orb2,
          ...orbTransforms.orb2,
        }}
      />

      {/* Orb 3: Atmosphere Depth Glow */}
      <div
        className="ambient-orb orb-depth"
        style={{
          backgroundColor: theme.orb3,
          ...orbTransforms.orb3,
        }}
      />

      {/* Subtle Fine Mesh Surface Wash */}
      <div className="ambient-mesh-overlay" />
    </div>
  );
}

export default AmbientBlurBackdrop;
