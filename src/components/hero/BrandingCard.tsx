import React from 'react';
import { motion, type Variants } from 'framer-motion';
import brandingImage from '../../assets/branding.png';

/**
 * Framer Motion Animation Variants for the Glossy Black "Branding" Service Card
 *
 * Sequence Breakdown:
 *  0%   (Slot/Hidden):   y: 500px, x: 0px, rotateZ: 0deg, scale: 1, opacity: 0, blur(10px)
 *  40%  (Peak Overshoot): y: -50px, x: -25px, rotateZ: -6deg, scale: 1, opacity: 1, blur(2px)
 *  100% (Final Settle):   y: -10px, x: -60px, rotateZ: -12deg, scale: 0.95, opacity: 1, blur(0px)
 */
export const brandingCardVariants: Variants = {
  hidden: {
    x: 0,
    y: 500,
    rotateZ: 0,
    scale: 1,
    opacity: 0,
    filter: 'blur(10px) drop-shadow(0 10px 15px rgba(0,0,0,0.08))',
  },
  visible: {
    // Tighter bezier arc than Card 1 & Card 2 to prevent collision during flight, settling at spread position
    x: [0, -25, -70],
    y: [500, -50, 5],
    rotateZ: [0, -5, -10],
    scale: [1, 0.98, 0.95],
    opacity: [0, 1, 1],
    // Glossy black dynamic specular depth & shadow
    filter: [
      'blur(10px) drop-shadow(0 15px 15px rgba(0,0,0,0.10))',
      'blur(2px) drop-shadow(0 35px 32px rgba(0,0,0,0.30))',
      'blur(0px) drop-shadow(0 18px 24px rgba(0,0,0,0.18))',
    ],
    transition: {
      duration: 1.4,
      times: [0, 0.4, 1],
      ease: ['easeOut', [0.16, 1, 0.3, 1]],
      delay: 0.5, // 0.15s stagger after Card 2 (delay 0.35s)
    },
  },
};

/**
 * Alternative variant using direct spring physics for final settle:
 * transition: { type: "spring", stiffness: 60, damping: 14, mass: 1, delay: 0.5 }
 */
export const brandingCardSpringVariants: Variants = {
  hidden: {
    x: 0,
    y: 500,
    rotateZ: 0,
    scale: 1,
    opacity: 0,
    filter: 'blur(10px) drop-shadow(0 10px 15px rgba(0,0,0,0.08))',
  },
  visible: {
    x: -70,
    y: 5,
    rotateZ: -10,
    scale: 0.95,
    opacity: 1,
    filter: 'blur(0px) drop-shadow(0 18px 24px rgba(0,0,0,0.18))',
    transition: {
      type: 'spring',
      stiffness: 60,
      damping: 14,
      mass: 1,
      delay: 0.5,
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
  return (
    <motion.div
      className={`branding-service-card ${className}`}
      variants={useSpringDirect ? brandingCardSpringVariants : brandingCardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      style={{
        position: 'absolute',
        transformOrigin: 'center center',
        zIndex: 30, // Layered above White SEO card (z:20) and below upcoming Green card (z:40)
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
        src={brandingImage}
        alt="Branding Glossy Black Service Card"
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

export default BrandingCard;
