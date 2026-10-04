import React from 'react';
import { motion, type Variants } from 'framer-motion';
import socialMediaImage from '../../assets/socialMediaCropped.png';
import { CARD_LAYOUT } from './cardLayout';

const config = CARD_LAYOUT.social;

/**
 * Framer Motion Animation Variants for the Orange "Social Media" Service Card (Discover Style)
 * 
 * - Positioned on master 1536x1024 artboard via responsive percentage center
 * - Unrotated size: 176.8px x 230.5px (aspect ratio 0.767)
 * - Final rotation: 25.5 degrees, skewX: 0 degrees
 * - Overlap: Sits above Green App Dev card (z:40) and below Blue Web card (z:50)
 * - Keeping orange gradient and styling (KEEP_ORANGE mode)
 */
export const socialMediaCardVariants: Variants = {
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
    rotateZ: [0, 10, config.rotation],
    scale: [0.9, 1.02, 1],
    opacity: [0, 1, 1],
    filter: [
      'blur(10px) drop-shadow(0 15px 15px rgba(0,0,0,0.08))',
      'blur(2px) drop-shadow(0 35px 32px rgba(180,60,10,0.32))',
      'blur(0px) drop-shadow(0 20px 26px rgba(180,60,10,0.20))',
    ],
    transition: {
      duration: 1.4,
      times: [0, 0.4, 1],
      ease: ['easeOut', [0.16, 1, 0.3, 1]],
      delay: config.spring.delay,
    },
  },
};

export const socialMediaCardSpringVariants: Variants = {
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
    filter: 'blur(0px) drop-shadow(0 20px 26px rgba(180,60,10,0.20))',
    transition: {
      type: 'spring',
      stiffness: config.spring.stiffness,
      damping: config.spring.damping,
      mass: config.spring.mass,
      delay: config.spring.delay,
    },
  },
};

interface SocialMediaCardProps {
  className?: string;
  useSpringDirect?: boolean;
}

export const SocialMediaCard: React.FC<SocialMediaCardProps> = ({
  className = '',
  useSpringDirect = false,
}) => {
  // Support instant resting-pose query param for automated verification screenshotting
  const isInstant =
    typeof window !== 'undefined' &&
    (window.location.search.includes('instant') || window.location.search.includes('debug'));

  return (
    <div
      className={`social-media-service-card-positioner ${className}`}
      style={{
        position: 'absolute',
        left: `${config.leftPct}%`,
        top: `${config.topPct}%`,
        width: `${config.widthPct}%`,
        height: `${config.heightPct}%`,
        transform: 'translate(-50%, -50%)',
        transformOrigin: '50% 50%',
        zIndex: config.zIndex, // 45: above Green (40) and below Blue (50)
        pointerEvents: 'auto',
      }}
    >
      <motion.div
        className="social-media-service-card-motion"
        variants={useSpringDirect ? socialMediaCardSpringVariants : socialMediaCardVariants}
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
                filter: 'blur(0px) drop-shadow(0 20px 26px rgba(180,60,10,0.20))',
              },
              animate: {
                y: 0,
                rotateZ: config.rotation,
                scale: 1,
                opacity: 1,
                filter: 'blur(0px) drop-shadow(0 20px 26px rgba(180,60,10,0.20))',
              },
              transition: { duration: 0, delay: 0 },
            }
          : {})}
      >
        {/* Glossy Orange 3D Card Surface */}
        <div
          className="social-media-service-card-surface"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '9%', // Corresponds to ~16px corner radius at 176.8px width
            overflow: 'hidden',
            position: 'relative',
            boxShadow: 'inset 0 1.5px 2px rgba(255, 255, 255, 0.45)',
          }}
        >
          <img
            src={socialMediaImage}
            alt="Social Media Vivid Orange Service Card"
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

export default SocialMediaCard;
