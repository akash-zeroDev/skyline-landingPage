import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import fingerprintImage from '../../assets/fingerprint.png';

/**
 * Frosted Glass Fingerprint Square Accent
 * - Final Target: x: 450px, y: 340px, scale: 0.8, zIndex: 54 (behind Lightning & Lock)
 * - Initial: opacity: 0, scale: 0.5, y: 390px (final + 50px), filter: blur(8px)
 * - Entrance: Spring (stiffness: 80, damping: 12, mass: 1), delay: 2.1s
 * - Idle Float: y: [0, -8, 0], rotateZ: [0, 1, 0, -1, 0], duration: 4.8s
 */
export const fingerprintEntranceVariants: Variants = {
  hidden: {
    x: 450,
    y: 390, // 340 + 50px
    scale: 0.5,
    opacity: 0,
    filter: 'blur(8px)',
  },
  visible: {
    x: 450,
    y: 340,
    scale: 0.8,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 12,
      mass: 1,
      delay: 2.1,
    },
  },
};

interface FingerprintAccentProps {
  className?: string;
}

export const FingerprintAccent: React.FC<FingerprintAccentProps> = ({ className = '' }) => {
  const [isEntered, setIsEntered] = useState(false);

  return (
    <motion.div
      className={`hero-accent-fingerprint ${className}`}
      variants={fingerprintEntranceVariants}
      initial="hidden"
      animate="visible"
      onAnimationComplete={() => setIsEntered(true)}
      style={{
        position: 'absolute',
        transformOrigin: 'center center',
        zIndex: 54, // Positioned slightly behind Lightning (55) and Lock (60)
        width: '140px',
        maxWidth: '28vw',
        pointerEvents: 'none',
        userSelect: 'none',
        willChange: 'transform, opacity, filter',
      }}
    >
      <motion.div
        animate={
          isEntered
            ? {
                y: [0, -8, 0],
                rotateZ: [0, 1, 0, -1, 0],
              }
            : { y: 0, rotateZ: 0 }
        }
        transition={{
          duration: 4.8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ width: '100%', height: 'auto', transformOrigin: 'center center' }}
      >
        <img
          src={fingerprintImage}
          alt="3D Frosted Glass Fingerprint Square Accent"
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
            display: 'block',
            filter: 'drop-shadow(0 14px 24px rgba(0, 0, 0, 0.16))',
          }}
          draggable={false}
        />
      </motion.div>
    </motion.div>
  );
};

export default FingerprintAccent;
