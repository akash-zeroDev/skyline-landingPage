import React from 'react';
import ToggleAccent from './ToggleAccent';
import BoltAccent from './BoltAccent';
import FingerprintAccent from './FingerprintAccent';
import LockAccent from './LockAccent';

export { ToggleAccent, BoltAccent, FingerprintAccent, LockAccent };

interface HeroAccentsProps {
  className?: string;
  animationKey?: number | string;
}

/**
 * HeroAccents Container
 * Groups the four floating 3D decorative accents on the right side of the hero canvas:
 * 1. Green Toggle Switch (x: 420px, y: -220px, z: 60)
 * 2. Black Lightning Bolt (x: 380px, y: 280px, z: 55)
 * 3. Frosted Fingerprint (x: 450px, y: 340px, z: 54)
 * 4. Blue Padlock (x: 520px, y: 400px, z: 60)
 */
export const HeroAccents: React.FC<HeroAccentsProps> = ({
  className = '',
  animationKey = 0,
}) => {
  return (
    <div
      className={`hero-accents-group ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <ToggleAccent key={`accent-toggle-${animationKey}`} />
      <BoltAccent key={`accent-bolt-${animationKey}`} />
      <FingerprintAccent key={`accent-fingerprint-${animationKey}`} />
      <LockAccent key={`accent-lock-${animationKey}`} />
    </div>
  );
};

export default HeroAccents;
