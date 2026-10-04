import React from 'react';
import { motion, type Variants } from 'framer-motion';
import brandingCardImage from '../../assets/brandingCardCropped.png';
import { CARD_LAYOUT } from './cardLayout';

const config = CARD_LAYOUT.branding;

/**
 * Framer Motion Animation Variants for the Glossy Black "Branding" Service Card
 * 
 * - Positioned on master 1536x1024 artboard via responsive percentage center
 * - Unrotated size: 208.3px x 281.0px (aspect ratio 0.741)
 * - Final rotation: -19.1 degrees (Counter-Clockwise)
 * - Resting center: (463.2px, 439.8px) -> 30.1563% left, 42.9492% top
 * - Overlap: Sits above White SEO card (z:20) and below upcoming Green card (z:40)
 */
export const brandingCardVariants: Variants = {
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
    rotateZ: [0, -8, config.rotation],
    scale: [0.9, 1.02, 1],
    opacity: [0, 1, 1],
    filter: [
      'blur(10px) drop-shadow(0 10px 15px rgba(0,0,0,0.08))',
      'blur(2px) drop-shadow(0 32px 30px rgba(0,0,0,0.35))',
      'blur(0px) drop-shadow(0 18px 24px rgba(0,0,0,0.28))',
    ],
    transition: {
      duration: 1.4,
      times: [0, 0.4, 1],
      ease: ['easeOut', [0.16, 1, 0.3, 1]],
      delay: config.spring.delay,
    },
  },
};

export const brandingCardSpringVariants: Variants = {
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
    filter: 'blur(0px) drop-shadow(0 18px 24px rgba(0,0,0,0.28))',
    transition: {
      type: 'spring',
      stiffness: config.spring.stiffness,
      damping: config.spring.damping,
      mass: config.spring.mass,
      delay: config.spring.delay,
    },
  },
};

interface BrandingCardProps {
  className?: string;
  useSpringDirect?: boolean;
}

export const BrandingCard: React.FC<BrandingCardProps> = ({
  className = '',
  useSpringDirect = false,
}) => {
  // Support instant resting-pose query param for automated verification screenshotting
  const isInstant =
    typeof window !== 'undefined' &&
    (window.location.search.includes('instant') || window.location.search.includes('debug'));

  return (
    <div
      className={`branding-card-positioner ${className}`}
      style={{
        position: 'absolute',
        left: `${config.leftPct}%`,
        top: `${config.topPct}%`,
        width: `${config.widthPct}%`,
        height: `${config.heightPct}%`,
        transform: 'translate(-50%, -50%)',
        transformOrigin: '50% 50%',
        zIndex: config.zIndex, // 30: above White (20) & Yellow (10), below Green (40)
        pointerEvents: 'auto',
      }}
    >
      <motion.div
        className="branding-card-motion"
        variants={useSpringDirect ? brandingCardSpringVariants : brandingCardVariants}
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
                filter: 'blur(0px) drop-shadow(0 18px 24px rgba(0,0,0,0.28))',
              },
              animate: {
                y: 0,
                rotateZ: config.rotation,
                scale: 1,
                opacity: 1,
                filter: 'blur(0px) drop-shadow(0 18px 24px rgba(0,0,0,0.28))',
              },
              transition: { duration: 0, delay: 0 },
            }
          : {})}
      >
        {/* Glossy Black 3D Card Surface */}
        <div
          className="branding-card-surface"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '7.5%', // Corresponds to ~16px corner radius at 214.5px width
            overflow: 'hidden',
            position: 'relative',
            boxShadow: 'inset 0 1px 1.5px rgba(255, 255, 255, 0.35)',
          }}
        >
          <img
            src={brandingCardImage}
            alt="Branding Glossy Black Service Card"
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

export default BrandingCard;
