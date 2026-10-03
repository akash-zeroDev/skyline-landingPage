import React from 'react';
import { motion, type Variants } from 'framer-motion';
import socialMediaImage from '../../assets/socialMedia.png';

/**
 * Framer Motion Animation Variants for the Orange "Social Media" Service Card (Far-Right)
 *
 * Sequence Breakdown:
 *  0%   (Slot/Hidden):   y: 500px, x: 0px, rotateZ: 0deg, scale: 1, opacity: 0, blur(10px)
 *  40%  (Peak Overshoot): y: -50px, x: 75px, rotateZ: 10deg, scale: 1, opacity: 1, blur(2px)
 *  100% (Final Settle):   y: 30px, x: 180px, rotateZ: 22deg, scale: 0.95, opacity: 1, blur(0px)
 */
export const socialMediaCardVariants: Variants = {
  hidden: {
    x: 0,
    y: 500,
    rotateZ: 0,
    scale: 1,
    opacity: 0,
    filter: 'blur(10px) drop-shadow(0 10px 15px rgba(0,0,0,0.08))',
  },
  visible: {
    // Sharp rightward curve, sweeping outward to complete the right side of the fan
    x: [0, 75, 180],
    y: [500, -50, 30],
    rotateZ: [0, 10, 22],
    scale: [1, 1, 0.95],
    opacity: [0, 1, 1],

    // Glossy orange dynamic specular depth & alpha drop-shadow
    filter: [
      'blur(10px) drop-shadow(0 15px 15px rgba(0,0,0,0.08))',
      'blur(2px) drop-shadow(0 35px 32px rgba(180,60,10,0.32))',
      'blur(0px) drop-shadow(0 20px 26px rgba(180,60,10,0.20))',
    ],
    transition: {
      duration: 1.4,
      times: [0, 0.4, 1],
      ease: ['easeOut', [0.16, 1, 0.3, 1]],
      delay: 0.95, // 0.15s stagger after Card 5 (delay 0.80s)
    },
  },
};

/**
 * Alternative variant using direct spring physics for final settle:
 * transition: { type: "spring", stiffness: 60, damping: 14, mass: 1, delay: 0.95 }
 */
export const socialMediaCardSpringVariants: Variants = {
  hidden: {
    x: 0,
    y: 500,
    rotateZ: 0,
    scale: 1,
    opacity: 0,
    filter: 'blur(10px)',
  },
  visible: {
    x: 180,
    y: 30,
    rotateZ: 22,
    scale: 0.95,
    opacity: 1,
    filter: 'blur(0px) drop-shadow(0 20px 26px rgba(180,60,10,0.20))',
    transition: {
      type: 'spring',
      stiffness: 60,
      damping: 14,
      mass: 1,
      delay: 0.95,
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
  return (
    <motion.div
      className={`social-media-service-card ${className}`}
      variants={useSpringDirect ? socialMediaCardSpringVariants : socialMediaCardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      style={{
        position: 'absolute',
        transformOrigin: 'center center',
        zIndex: 45, // Layered behind the front-most Blue card (z:50) and above Green card (z:40)
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
        src={socialMediaImage}
        alt="Social Media Vivid Orange Service Card"
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

export default SocialMediaCard;
