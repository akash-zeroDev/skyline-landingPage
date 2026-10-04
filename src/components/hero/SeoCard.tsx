import React from 'react';
import { motion, type Variants } from 'framer-motion';
import seoCardDecal from '../../assets/seoCardDecal.png';
import { CARD_LAYOUT } from './cardLayout';

const config = CARD_LAYOUT.seo;

/**
 * Framer Motion Animation Variants for the White Frosted Glass "SEO" Service Card
 * 
 * - Positioned on master 1536x1024 artboard via responsive percentage center
 * - Unrotated size: 169.2px x 229.6px (aspect ratio 0.737)
 * - Final rotation: +9.8 degrees (Clockwise)
 * - Resting center: (325.5px, 348.0px) -> 21.1914% left, 33.9844% top
 * - Overlap: Sits above Yellow UI/UX card (z:10) and below Black Branding card (z:30)
 */
export const seoCardVariants: Variants = {
  hidden: {
    y: 380,
    rotateZ: 0,
    scale: 0.9,
    opacity: 0,
    filter: 'blur(10px) drop-shadow(0 8px 10px rgba(0,0,0,0.04))',
  },
  visible: {
    // Curves upward into final resting angle and position
    y: [380, -20, 0],
    rotateZ: [0, 3, config.rotation],
    scale: [0.9, 1.02, 1],
    opacity: [0, 1, 1],
    filter: [
      'blur(10px) drop-shadow(0 8px 10px rgba(0,0,0,0.04))',
      'blur(2px) drop-shadow(0 28px 24px rgba(17,26,92,0.20))',
      'blur(0px) drop-shadow(0 14px 22px rgba(17,26,92,0.10))',
    ],
    transition: {
      duration: 1.4,
      times: [0, 0.4, 1],
      ease: ['easeOut', [0.16, 1, 0.3, 1]],
      delay: config.spring.delay,
    },
  },
};

export const seoCardSpringVariants: Variants = {
  hidden: {
    y: 380,
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
    filter: 'blur(0px) drop-shadow(0 14px 22px rgba(17,26,92,0.10))',
    transition: {
      type: 'spring',
      stiffness: config.spring.stiffness,
      damping: config.spring.damping,
      mass: config.spring.mass,
      delay: config.spring.delay,
    },
  },
};

interface SeoCardProps {
  className?: string;
  useSpringDirect?: boolean;
}

export const SeoCard: React.FC<SeoCardProps> = ({
  className = '',
  useSpringDirect = false,
}) => {
  // Support instant resting-pose query param for automated verification screenshotting
  const isInstant =
    typeof window !== 'undefined' &&
    (window.location.search.includes('instant') || window.location.search.includes('debug'));

  return (
    <div
      className={`seo-card-positioner ${className}`}
      style={{
        position: 'absolute',
        left: `${config.leftPct}%`,
        top: `${config.topPct}%`,
        width: `${config.widthPct}%`,
        height: `${config.heightPct}%`,
        transform: 'translate(-50%, -50%)',
        transformOrigin: '50% 50%',
        zIndex: config.zIndex, // 20: above yellow (10), below black (30)
        pointerEvents: 'auto',
      }}
    >
      <motion.div
        className="seo-card-motion"
        variants={useSpringDirect ? seoCardSpringVariants : seoCardVariants}
        initial="hidden"
        animate="visible"
        style={{
          width: '100%',
          height: '100%',
          transformOrigin: '50% 50%',
          position: 'relative',
          cursor: 'pointer',
          willChange: 'transform',
        }}
        {...(isInstant
          ? {
              initial: {
                y: 0,
                rotateZ: config.rotation,
                scale: 1,
                opacity: 1,
                filter: 'blur(0px) drop-shadow(0 14px 22px rgba(17,26,92,0.10))',
              },
              animate: {
                y: 0,
                rotateZ: config.rotation,
                scale: 1,
                opacity: 1,
                filter: 'blur(0px) drop-shadow(0 14px 22px rgba(17,26,92,0.10))',
              },
              transition: { duration: 0, delay: 0 },
            }
          : {})}
      >
        {/* Frosted Glass 3D Card Surface */}
        <div
          className="seo-card-surface"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '9.4%', // Corresponds to 16px corner radius at 171px width
            overflow: 'hidden',
            position: 'relative',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.58) 0%, rgba(245, 247, 252, 0.42) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.65)',
            boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(255, 255, 255, 0.35), 0 14px 24px rgba(17, 26, 92, 0.08)',
          }}
        >
          {/* Card Decal Graphics (SEO Logo, Services Label, SEO Watermark, Edge Highlights) */}
          <img
            src={seoCardDecal}
            alt="SEO White Frosted Glass Service Card"
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

export default SeoCard;
