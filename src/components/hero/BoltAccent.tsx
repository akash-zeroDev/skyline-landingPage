import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import boltImage from '../../assets/bolt.png';

/**
 * Black Lightning Bolt Square Accent
 * - Final Target: x: 380px, y: 280px, scale: 0.85, zIndex: 55
 * - Initial: opacity: 0, scale: 0.5, y: 330px (final + 50px), filter: blur(8px)
 * - Entrance: Spring (stiffness: 80, damping: 12, mass: 1), delay: 2.0s
 * - Idle Float: y: [0, -8, 0], rotateZ: [0, 1, 0, -1, 0], duration: 5.2s
 */
export const boltEntranceVariants: Variants = {
  hidden: {
    x: 380,
    y: 330, // 280 + 50px
    scale: 0.5,
    opacity: 0,
    filter: 'blur(8px)',
  },
  visible: {
    x: 380,
    y: 280,
    scale: 0.85,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 12,
      mass: 1,
      delay: 2.0,
    },
  },
};

interface BoltAccentProps {
  className?: string;
}

export const BoltAccent: React.FC<BoltAccentProps> = ({ className = '' }) => {
  const [isEntered, setIsEntered] = useState(false);

  return (
    <motion.div
      className={`hero-accent-bolt ${className}`}
      variants={boltEntranceVariants}
      initial="hidden"
      animate="visible"
      onAnimationComplete={() => setIsEntered(true)}
      style={{
        position: 'absolute',
        transformOrigin: 'center center',
        zIndex: 55, // In bottom cluster: in front of Fingerprint (54), behind Lock (60)
        width: '135px',
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
          duration: 5.2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ width: '100%', height: 'auto', transformOrigin: 'center center' }}
      >
        <img
          src={boltImage}
          alt="3D Lightning Bolt Square Accent"
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
            display: 'block',
            filter: 'drop-shadow(0 14px 24px rgba(0, 0, 0, 0.22))',
          }}
          draggable={false}
        />
      </motion.div>
    </motion.div>
  );
};

export default BoltAccent;
