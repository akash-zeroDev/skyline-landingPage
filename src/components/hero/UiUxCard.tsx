import React from 'react';
import { motion, type Variants } from 'framer-motion';
import uiUxCardImage from '../../assets/uiUxCardCropped.png';
import { CARD_LAYOUT } from './cardLayout';

const config = CARD_LAYOUT.uiUx;

/**
 * Framer Motion Animation Variants for the UI/UX Design (Yellow) Card
 * 
 * - Positioned on master 1536x1024 artboard via responsive percentage center
 * - Unrotated size: 143px x 196px (aspect ratio 0.73)
 * - Final rotation: -24.4 degrees
 * - Resting center: (177.5px, 291.5px) -> 11.556% left, 28.467% top
 */
export const uiUxCardVariants: Variants = {
  hidden: {
    y: 350,
    rotateZ: 0,
    scale: 0.9,
    opacity: 0,
    filter: 'blur(10px) drop-shadow(0 8px 10px rgba(0,0,0,0.04))',
  },
  visible: {
    // Curves upward into final resting angle and position
    y: [350, -25, 0],
    rotateZ: [0, -10, config.rotation],
    scale: [0.9, 1.02, 1],
    opacity: [0, 1, 1],
    filter: [
      'blur(10px) drop-shadow(0 8px 10px rgba(0,0,0,0.04))',
      'blur(2px) drop-shadow(0 28px 24px rgba(17,26,92,0.22))',
      'blur(0px) drop-shadow(0 14px 20px rgba(17,26,92,0.12))',
    ],
    transition: {
      duration: 1.4,
      times: [0, 0.4, 1],
      ease: ['easeOut', [0.16, 1, 0.3, 1]],
      delay: config.spring.delay,
    },
  },
};

export const uiUxCardSpringVariants: Variants = {
  hidden: {
    y: 350,
    rotateZ: 0,
    scale: 0.9,
    opacity: 0,
    filter: 'blur(10px) drop-shadow(0 8px 10px rgba(0,0,0,0.04))',
  },
  visible: {
    y: 0,
    rotateZ: config.rotation,
    scale: 1,
    opacity: 1,
    filter: 'blur(0px) drop-shadow(0 14px 20px rgba(17,26,92,0.12))',
    transition: {
      type: 'spring',
      stiffness: config.spring.stiffness,
      damping: config.spring.damping,
      mass: config.spring.mass,
      delay: config.spring.delay,
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
  // Support instant resting-pose query param for automated verification screenshotting
  const isInstant =
    typeof window !== 'undefined' &&
    (window.location.search.includes('instant') || window.location.search.includes('debug'));

  return (
    <div
      className={`ui-ux-card-positioner ${className}`}
      style={{
        position: 'absolute',
        left: `${config.leftPct}%`,
        top: `${config.topPct}%`,
        width: `${config.widthPct}%`,
        height: `${config.heightPct}%`,
        transform: 'translate(-50%, -50%)',
        transformOrigin: '50% 50%',
        zIndex: config.zIndex,
        pointerEvents: 'auto',
      }}
    >
      <motion.div
        className="ui-ux-card-motion"
        variants={useSpringDirect ? uiUxCardSpringVariants : uiUxCardVariants}
        initial="hidden"
        animate="visible"
        style={{
          width: '100%',
          height: '100%',
          transformOrigin: '50% 50%',
          position: 'relative',
          cursor: 'pointer',
          willChange: 'transform, opacity, filter',
        }}
        {...(isInstant
          ? {
              initial: {
                y: 0,
                rotateZ: config.rotation,
                scale: 1,
                opacity: 1,
                filter: 'blur(0px) drop-shadow(0 14px 20px rgba(17,26,92,0.12))',
              },
              animate: {
                y: 0,
                rotateZ: config.rotation,
                scale: 1,
                opacity: 1,
                filter: 'blur(0px) drop-shadow(0 14px 20px rgba(17,26,92,0.12))',
              },
              transition: { duration: 0, delay: 0 },
            }
          : {})}
      >
        {/* Yellow Card 3D Surface */}
        <div
          className="ui-ux-card-surface"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '11.2%', // Corresponds to 16px corner radius at 143px width
            overflow: 'hidden',
            position: 'relative',
            boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 0.45)',
          }}
        >
          <img
            src={uiUxCardImage}
            alt="UI/UX Design 3D Service Card"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
            draggable={false}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default UiUxCard;
