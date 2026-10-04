import React from 'react';
import { motion, type Variants } from 'framer-motion';
import appCardImage from '../../assets/appCardCropped.png';
import { CARD_LAYOUT } from './cardLayout';

const config = CARD_LAYOUT.app;

/**
 * Framer Motion Animation Variants for the Glossy Green "App Dev" Service Card (Link Style)
 * 
 * - Positioned on master 1536x1024 artboard via responsive percentage center
 * - Unrotated size: 186.5px x 254.1px (aspect ratio 0.734)
 * - Final rotation: -1.7 degrees, skewX: -16.6 degrees
 * - Resting center: (505.0px, 499.5px) -> 32.8776% left, 48.7793% top
 * - Overlap: Sits above Black Branding card (z:30) and below upcoming Blue Web card (z:50)
 */
export const appCardVariants: Variants = {
  hidden: {
    y: 400,
    rotateZ: 0,
    skewX: 0,
    scale: 0.9,
    opacity: 0,
    filter: 'blur(10px) drop-shadow(0 10px 15px rgba(0,0,0,0.08))',
  },
  visible: {
    // Curves upward into final resting angle, skew, and position
    y: [400, -20, 0],
    rotateZ: [0, -3, config.rotation],
    skewX: [0, -8, config.skewX],
    scale: [0.9, 1.02, 1],
    opacity: [0, 1, 1],
    filter: [
      'blur(10px) drop-shadow(0 10px 15px rgba(0,0,0,0.08))',
      'blur(2px) drop-shadow(0 32px 30px rgba(10,80,30,0.35))',
      'blur(0px) drop-shadow(0 18px 24px rgba(10,80,30,0.28))',
    ],
    transition: {
      duration: 1.4,
      times: [0, 0.4, 1],
      ease: ['easeOut', [0.16, 1, 0.3, 1]],
      delay: config.spring.delay,
    },
  },
};

export const appCardSpringVariants: Variants = {
  hidden: {
    y: 400,
    rotateZ: 0,
    skewX: 0,
    scale: 0.9,
    opacity: 0,
    filter: 'blur(10px) drop-shadow(0 10px 15px rgba(0,0,0,0.08))',
  },
  visible: {
    y: 0,
    rotateZ: config.rotation,
    skewX: config.skewX,
    scale: 1,
    opacity: 1,
    filter: 'blur(0px) drop-shadow(0 18px 24px rgba(10,80,30,0.28))',
    transition: {
      type: 'spring',
      stiffness: config.spring.stiffness,
      damping: config.spring.damping,
      mass: config.spring.mass,
      delay: config.spring.delay,
    },
  },
};

interface AppCardProps {
  className?: string;
  useSpringDirect?: boolean;
}

export const AppCard: React.FC<AppCardProps> = ({
  className = '',
  useSpringDirect = false,
}) => {
  // Support instant resting-pose query param for automated verification screenshotting
  const isInstant =
    typeof window !== 'undefined' &&
    (window.location.search.includes('instant') || window.location.search.includes('debug'));

  return (
    <div
      className={`app-card-positioner ${className}`}
      style={{
        position: 'absolute',
        left: `${config.leftPct}%`,
        top: `${config.topPct}%`,
        width: `${config.widthPct}%`,
        height: `${config.heightPct}%`,
        transform: 'translate(-50%, -50%)',
        transformOrigin: '50% 50%',
        zIndex: config.zIndex, // 40: above Black (30), White (20) & Yellow (10), below Blue (50)
        pointerEvents: 'auto',
      }}
    >
      <motion.div
        className="app-card-motion"
        variants={useSpringDirect ? appCardSpringVariants : appCardVariants}
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
                skewX: config.skewX,
                scale: 1,
                opacity: 1,
                filter: 'blur(0px) drop-shadow(0 18px 24px rgba(10,80,30,0.28))',
              },
              animate: {
                y: 0,
                rotateZ: config.rotation,
                skewX: config.skewX,
                scale: 1,
                opacity: 1,
                filter: 'blur(0px) drop-shadow(0 18px 24px rgba(10,80,30,0.28))',
              },
              transition: { duration: 0, delay: 0 },
            }
          : {})}
      >
        {/* Glossy Green 3D Card Surface */}
        <div
          className="app-card-surface"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '8.5%', // Corresponds to ~16px corner radius at 186.5px width
            overflow: 'hidden',
            position: 'relative',
            boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 0.45)',
          }}
        >
          <img
            src={appCardImage}
            alt="App Development Glossy Green Service Card"
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

export default AppCard;
