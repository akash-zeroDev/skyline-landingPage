import React from 'react';
import { motion, type Variants } from 'framer-motion';
import seoImage from '../../assets/seo.png';

/**
 * Framer Motion Animation Variants for the White Frosted Glass "SEO" Service Card
 *
 * Staggered Sequence:
 *  0%   (Slot/Hidden):   y: 500px, x: 0px, rotateZ: 0deg, scale: 1, opacity: 0, blur(10px)
 *  40%  (Peak Overshoot): y: -50px, x: -50px, rotateZ: -8deg, scale: 1, opacity: 1, blur(2px)
 *  100% (Final Settle):   y: 20px, x: -180px, rotateZ: -15deg, scale: 0.92, opacity: 1, blur(0px)
 */
export const seoCardVariants: Variants = {
  hidden: {
    x: 0,
    y: 500,
    rotateZ: 0,
    scale: 1,
    opacity: 0,
    filter: 'blur(10px) drop-shadow(0 10px 15px rgba(0,0,0,0.05))',
  },
  visible: {
    // Tighter bezier arc than Card 1 to prevent collision during flight, settling at spread position
    x: [0, -60, -220],
    y: [500, -50, 15],
    rotateZ: [0, -10, -20],
    scale: [1, 0.98, 0.90],
    opacity: [0, 1, 1],
    // Frosted glass dynamic shadow & blur reduction
    filter: [
      'blur(10px) drop-shadow(0 15px 15px rgba(0,0,0,0.06))',
      'blur(2px) drop-shadow(0 34px 30px rgba(17,26,92,0.22))',
      'blur(0px) drop-shadow(0 16px 20px rgba(17,26,92,0.12))',
    ],
    transition: {
      duration: 1.4,
      times: [0, 0.4, 1],
      ease: ['easeOut', [0.16, 1, 0.3, 1]],
      delay: 0.35, // 0.15s stagger after first card
    },
  },
};

/**
 * Alternative variant using direct spring physics for final settle
 */
export const seoCardSpringVariants: Variants = {
  hidden: {
    x: 0,
    y: 500,
    rotateZ: 0,
    scale: 1,
    opacity: 0,
    filter: 'blur(10px) drop-shadow(0 10px 15px rgba(0,0,0,0.05))',
  },
  visible: {
    x: -220,
    y: 15,
    rotateZ: -20,
    scale: 0.90,
    opacity: 1,
    filter: 'blur(0px) drop-shadow(0 16px 20px rgba(17,26,92,0.12))',
    transition: {
      type: 'spring',
      stiffness: 60,
      damping: 14,
      mass: 1,
      delay: 0.35,
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
  const isInstant =
    typeof window !== 'undefined' &&
    (window.location.search.includes('instant') || window.location.search.includes('debug'));

  return (
    <motion.div
      className={`seo-service-card ${className}`}
      variants={useSpringDirect ? seoCardSpringVariants : seoCardVariants}
      initial="hidden"
      animate="visible"
      {...(isInstant
        ? {
            initial: {
              x: -220,
              y: 15,
              rotateZ: -20,
              scale: 0.9,
              opacity: 1,
              filter: 'blur(0px) drop-shadow(0 16px 20px rgba(17,26,92,0.12))',
            },
            animate: {
              x: -220,
              y: 15,
              rotateZ: -20,
              scale: 0.9,
              opacity: 1,
              filter: 'blur(0px) drop-shadow(0 16px 20px rgba(17,26,92,0.12))',
            },
            transition: { duration: 0, delay: 0 },
          }
        : {})}
      style={{
        position: 'absolute',
        transformOrigin: 'center center',
        zIndex: 20, // Sits above Yellow UI/UX card (z:10) and behind upcoming Black card (z:30)
        width: '320px',
        maxWidth: '90vw',
        background: 'transparent',
        border: 'none',
        overflow: 'visible',
        willChange: 'transform, opacity, filter',
        cursor: 'pointer',
      }}
    >
      <img
        src={seoImage}
        alt="SEO White Frosted Glass Service Card"
        style={{
          width: '100%',
          height: 'auto',
          objectFit: 'contain',
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

export default SeoCard;
