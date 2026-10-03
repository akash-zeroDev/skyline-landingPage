import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import toggleImage from '../../assets/toggleON.png';

/**
 * Green Toggle Switch Accent
 * - Final Target: x: 420px, y: -220px, scale: 0.9, zIndex: 60
 * - Initial: opacity: 0, scale: 0.5, y: -170px (final + 50px), filter: blur(8px)
 * - Entrance: Spring (stiffness: 80, damping: 12, mass: 1), delay: 1.8s
 * - Idle Float: y: [0, -8, 0], rotateZ: [0, 1, 0, -1, 0], duration: 4.5s
 */
export const toggleEntranceVariants: Variants = {
  hidden: {
    x: 420,
    y: -170, // -220 + 50px
    scale: 0.5,
    opacity: 0,
    filter: 'blur(8px)',
  },
  visible: {
    x: 420,
    y: -220,
    scale: 0.9,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 12,
      mass: 1,
      delay: 1.8,
    },
  },
};

interface ToggleAccentProps {
  className?: string;
}

export const ToggleAccent: React.FC<ToggleAccentProps> = ({ className = '' }) => {
  const [isEntered, setIsEntered] = useState(false);

  return (
    <motion.div
      className={`hero-accent-toggle ${className}`}
      variants={toggleEntranceVariants}
      initial="hidden"
      animate="visible"
      onAnimationComplete={() => setIsEntered(true)}
      style={{
        position: 'absolute',
        transformOrigin: 'center center',
        zIndex: 60,
        width: '170px',
        maxWidth: '35vw',
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
          duration: 4.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ width: '100%', height: 'auto', transformOrigin: 'center center' }}
      >
        <img
          src={toggleImage}
          alt="3D Green Toggle Switch Accent"
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
            display: 'block',
            filter: 'drop-shadow(0 14px 22px rgba(0, 0, 0, 0.16))',
          }}
          draggable={false}
        />
      </motion.div>
    </motion.div>
  );
};

export default ToggleAccent;
