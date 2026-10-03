import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import lockImage from '../../assets/lockIcon.png';

/**
 * Blue Padlock Square Accent
 * - Final Target: x: 520px, y: 400px, scale: 0.9, zIndex: 60 (front-most of group)
 * - Initial: opacity: 0, scale: 0.5, y: 450px (final + 50px), filter: blur(8px)
 * - Entrance: Spring (stiffness: 80, damping: 12, mass: 1), delay: 2.2s
 * - Idle Float: y: [0, -8, 0], rotateZ: [0, 1, 0, -1, 0], duration: 5.5s
 */
export const lockEntranceVariants: Variants = {
  hidden: {
    x: 520,
    y: 450, // 400 + 50px
    scale: 0.5,
    opacity: 0,
    filter: 'blur(8px)',
  },
  visible: {
    x: 520,
    y: 400,
    scale: 0.9,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 12,
      mass: 1,
      delay: 2.2,
    },
  },
};

interface LockAccentProps {
  className?: string;
}

export const LockAccent: React.FC<LockAccentProps> = ({ className = '' }) => {
  const [isEntered, setIsEntered] = useState(false);

  return (
    <motion.div
      className={`hero-accent-lock ${className}`}
      variants={lockEntranceVariants}
      initial="hidden"
      animate="visible"
      onAnimationComplete={() => setIsEntered(true)}
      style={{
        position: 'absolute',
        transformOrigin: 'center center',
        zIndex: 60, // Front-most of the bottom right cluster
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
          duration: 5.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ width: '100%', height: 'auto', transformOrigin: 'center center' }}
      >
        <img
          src={lockImage}
          alt="3D Blue Padlock Square Accent"
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
            display: 'block',
            filter: 'drop-shadow(0 16px 26px rgba(0, 0, 0, 0.22))',
          }}
          draggable={false}
        />
      </motion.div>
    </motion.div>
  );
};

export default LockAccent;
