import React from 'react';
import { motion, type Variants } from 'framer-motion';
import cursorImage from '../../assets/cursor.png';

/**
 * Framer Motion Animation Variants for the Entrance of the Floating Cursor
 *
 * Trajectory:
 *  Initial: x: -220px, y: 400px, opacity: 0, scale: 0.8, rotateZ: -10deg
 *  Final:   x: -220px, y: 250px, opacity: 1, scale: 0.8, rotateZ: 0deg
 *  Easing:  spring { stiffness: 70, damping: 12, delay: 0.4 }
 */
export const cursorEntranceVariants: Variants = {
  hidden: {
    x: -220,
    y: 400,
    opacity: 0,
    scale: 0.8,
    rotateZ: -10,
  },
  visible: {
    x: -220,
    y: 250,
    opacity: 1,
    scale: 0.8,
    rotateZ: 0,
    transition: {
      type: 'spring',
      stiffness: 70,
      damping: 12,
      delay: 0.4,
    },
  },
};

interface FloatingCursorProps {
  className?: string;
}

export const FloatingCursor: React.FC<FloatingCursorProps> = ({
  className = '',
}) => {
  return (
    /* Outer container controls entrance animation */
    <motion.div
      className={`floating-cursor-wrapper ${className}`}
      variants={cursorEntranceVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      style={{
        position: 'absolute',
        transformOrigin: 'center center',
        zIndex: 100, // Highest z-index (floats above slot and all cards)
        width: '110px',
        maxWidth: '25vw',
        willChange: 'transform, opacity, filter',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {/* Inner container executes the continuous floating hover loop with pulsing drop-shadow */}
      <motion.div
        animate={{
          y: [0, -10, 0],
          filter: [
            'drop-shadow(0 10px 14px rgba(0, 0, 0, 0.22))',
            'drop-shadow(0 18px 22px rgba(0, 0, 0, 0.32))',
            'drop-shadow(0 10px 14px rgba(0, 0, 0, 0.22))',
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ width: '100%', height: 'auto' }}
      >
        <img
          src={cursorImage}
          alt="3D Floating Cursor"
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
            display: 'block',
          }}
          draggable={false}
        />
      </motion.div>
    </motion.div>
  );
};

export default FloatingCursor;
