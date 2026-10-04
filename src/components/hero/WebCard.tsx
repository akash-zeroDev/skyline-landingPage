import React from 'react';
import { motion, type Variants } from 'framer-motion';
import webCardImage from '../../assets/webCardCropped.png';
import { CARD_LAYOUT } from './cardLayout';

const config = CARD_LAYOUT.web;

/**
 * Framer Motion Animation Variants for the Vivid Blue "Web Design" Service Card (Visa Style)
 * 
 * - Positioned on master 1536x1024 artboard via responsive percentage center
 * - Unrotated size: 208.5px x 289.0px (aspect ratio 0.72)
 * - Final rotation: -32.0 degrees, skewX: 0 degrees
 * - Overlap: Sits above Green App Dev card (z:40) and below upcoming orange card
 */
export const webCardVariants: Variants = {
  hidden: {
    y: 400,
    rotateZ: 0,
    scale: 0.9,
    opacity: 0,
    filter: 'blur(10px) drop-shadow(0 10px 15px rgba(0,0,0,0.08))',
  },
  visible: {
    // Curves upward into final resting angle and position
    y: [400, -20, 0],
    rotateZ: [0, -10, config.rotation],
    scale: [0.9, 1.02, 1],
    opacity: [0, 1, 1],
    filter: [
      'blur(10px) drop-shadow(0 10px 15px rgba(0,0,0,0.08))',
      'blur(2px) drop-shadow(0 32px 30px rgba(10,50,150,0.35))',
      'blur(0px) drop-shadow(0 18px 24px rgba(10,50,150,0.28))',
    ],
    transition: {
      duration: 1.4,
      times: [0, 0.4, 1],
      ease: ['easeOut', [0.16, 1, 0.3, 1]],
      delay: config.spring.delay,
    },
  },
};

export const webCardSpringVariants: Variants = {
  hidden: {
    y: 400,
    rotateZ: 0,
    scale: 0.9,
    opacity: 0,
    filter: 'blur(10px) drop-shadow(0 10px 15px rgba(0,0,0,0.08))',
  },
  visible: {
    y: 0,
    rotateZ: config.rotation,
    scale: 1,
    opacity: 1,
    filter: 'blur(0px) drop-shadow(0 18px 24px rgba(10,50,150,0.28))',
    transition: {
      type: 'spring',
      stiffness: config.spring.stiffness,
      damping: config.spring.damping,
      mass: config.spring.mass,
      delay: config.spring.delay,
    },
  },
};

interface WebCardProps {
  className?: string;
  useSpringDirect?: boolean;
}

export const WebCard: React.FC<WebCardProps> = ({
  className = '',
  useSpringDirect = false,
}) => {
  // Support instant resting-pose query param for automated verification screenshotting
  const isInstant =
    typeof window !== 'undefined' &&
    (window.location.search.includes('instant') || window.location.search.includes('debug'));

  return (
    <div
      className={`web-card-positioner ${className}`}
      style={{
        position: 'absolute',
        left: `${config.leftPct}%`,
        top: `${config.topPct}%`,
        width: `${config.widthPct}%`,
        height: `${config.heightPct}%`,
        transform: 'translate(-50%, -50%)',
        transformOrigin: '50% 50%',
        zIndex: config.zIndex, // 50: above Green (40)
        pointerEvents: 'auto',
      }}
    >
      <motion.div
        className="web-card-motion"
        variants={useSpringDirect ? webCardSpringVariants : webCardVariants}
        initial="hidden"
        animate="visible"
        style={{
          width: '100%',
          height: '100%',
          transformOrigin: '50% 50%',
          position: 'relative',
          cursor: 'pointer',
          willChange: 'transform, filter, opacity',
        }}
        {...(isInstant
          ? {
              initial: {
                y: 0,
                rotateZ: config.rotation,
                scale: 1,
                opacity: 1,
                filter: 'blur(0px) drop-shadow(0 18px 24px rgba(10,50,150,0.28))',
              },
              animate: {
                y: 0,
                rotateZ: config.rotation,
                scale: 1,
                opacity: 1,
                filter: 'blur(0px) drop-shadow(0 18px 24px rgba(10,50,150,0.28))',
              },
              transition: { duration: 0, delay: 0 },
            }
          : {})}
      >
        {/* Vivid Blue 3D Card Surface */}
        <div
          className="web-card-surface"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '8%', // Corresponds to ~16px corner radius at 208px width
            overflow: 'hidden',
            position: 'relative',
            boxShadow: 'inset 0 1.5px 2px rgba(255, 255, 255, 0.45)',
          }}
        >
          <img
            src={webCardImage}
            alt="Web Design Vivid Blue Service Card"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
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

export default WebCard;
