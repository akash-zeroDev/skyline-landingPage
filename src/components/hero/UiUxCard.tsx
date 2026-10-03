import React from 'react';
import { motion, type Variants } from 'framer-motion';
import uiUxImage from '../../assets/uiUx.png';

/**
 * Framer Motion Animation Variants for the UI/UX 3D Service Card
 * 
 * Note: We do NOT apply rectangular CSS `box-shadow` or `border-radius` to the container div.
 * The 3D card asset already features photorealistic 3D bevels, depth, and transparent edges.
 * Using container `box-shadow` creates an artificial rectangular border around the card.
 */
export const uiUxCardVariants: Variants = {
  hidden: {
    x: 0,
    y: 500,
    rotateZ: 0,
    scale: 1,
    opacity: 0,
    filter: 'blur(10px)',
  },
  visible: {
    // Curved bezier path: shoots straight up, then arcs leftward to -280px / 40px
    x: [0, -75, -280],
    y: [500, -50, 40],
    rotateZ: [0, -15, -25],
    scale: [1, 1, 0.90],
    opacity: [0, 1, 1],
    filter: [
      'blur(10px) drop-shadow(0 15px 15px rgba(0,0,0,0.06))',
      'blur(2px) drop-shadow(0 30px 25px rgba(17,26,92,0.18))',
      'blur(0px) drop-shadow(0 16px 20px rgba(17,26,92,0.12))',
    ],
    transition: {
      duration: 1.4,
      times: [0, 0.4, 1],
      ease: ['easeOut', [0.16, 1, 0.3, 1]],
      delay: 0.2,
    },
  },
};

export const uiUxCardSpringVariants: Variants = {
  hidden: {
    x: 0,
    y: 500,
    rotateZ: 0,
    scale: 1,
    opacity: 0,
    filter: 'blur(10px)',
  },
  visible: {
    x: -280,
    y: 40,
    rotateZ: -25,
    scale: 0.90,
    opacity: 1,
    filter: 'blur(0px) drop-shadow(0 16px 20px rgba(17,26,92,0.12))',
    transition: {
      type: 'spring',
      stiffness: 60,
      damping: 14,
      mass: 1,
      delay: 0.2,
    },
  },
};

interface UiUxCardProps {
  className?: string;
  useSpringDirect?: boolean;
}

export const UiUxCard: React.FC<UiUxCardProps> = ({
  className = '',
  useSpringDirect = false,
}) => {
  return (
    <motion.div
      className={`ui-ux-service-card ${className}`}
      variants={useSpringDirect ? uiUxCardSpringVariants : uiUxCardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      style={{
        position: 'absolute',
        transformOrigin: 'center center',
        zIndex: 10, // Lowest in stack (back-most, left-most card)
        width: '320px',
        maxWidth: '90vw',
        background: 'transparent', // Pure transparent container
        border: 'none',
        borderRadius: 0,
        overflow: 'visible',
        willChange: 'transform, opacity, filter',
        cursor: 'pointer',
      }}
    >
      <img
        src={uiUxImage}
        alt="UI/UX Design 3D Service Card"
        style={{
          width: '100%',
          height: 'auto',
          display: 'block',
          userSelect: 'none',
          pointerEvents: 'none',
          background: 'transparent',
          border: 'none',
          outline: 'none',
        }}
        draggable={false}
      />
    </motion.div>
  );
};

export default UiUxCard;
