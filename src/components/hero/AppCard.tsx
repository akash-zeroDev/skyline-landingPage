import React from 'react';
import { motion, type Variants } from 'framer-motion';
import appImage from '../../assets/app.png';

/**
 * Framer Motion Animation Variants for the Green "App Development" Service Card
 *
 * Sequence Breakdown:
 *  0%   (Slot/Hidden):   y: 500px, x: 0px, rotateZ: 0deg, scale: 1, opacity: 0, blur(10px)
 *  40%  (Peak Overshoot): y: -50px, x: -5px, rotateZ: -5deg, scale: 1, opacity: 1, blur(2px)
 *  100% (Final Settle):   y: -15px, x: -10px, rotateZ: -10deg, scale: 0.98, opacity: 1, blur(0px)
 */
export const appCardVariants: Variants = {
  hidden: {
    x: 0,
    y: 500,
    rotateZ: 0,
    scale: 1,
    opacity: 0,
    filter: 'blur(10px) drop-shadow(0 10px 15px rgba(0,0,0,0.08))',
  },
  visible: {
    // Tightest curved bezier path of the left-stacked cards
    x: [0, -5, -10],
    y: [500, -50, -15],
    rotateZ: [0, -5, -10],
    scale: [1, 1, 0.98],
    opacity: [0, 1, 1],

    // Glossy green dynamic specular depth & alpha drop-shadow
    filter: [
      'blur(10px) drop-shadow(0 15px 15px rgba(0,0,0,0.08))',
      'blur(2px) drop-shadow(0 35px 32px rgba(10,80,30,0.28))',
      'blur(0px) drop-shadow(0 18px 24px rgba(10,80,30,0.18))',
    ],
    transition: {
      duration: 1.4,
      times: [0, 0.4, 1],
      ease: ['easeOut', [0.16, 1, 0.3, 1]],
      delay: 0.65, // 0.15s stagger after Card 3 (delay 0.50s)
    },
  },
};

/**
 * Alternative variant using direct spring physics for final settle:
 * transition: { type: "spring", stiffness: 60, damping: 14, mass: 1, delay: 0.65 }
 */
export const appCardSpringVariants: Variants = {
  hidden: {
    x: 0,
    y: 500,
    rotateZ: 0,
    scale: 1,
    opacity: 0,
    filter: 'blur(10px)',
  },
  visible: {
    x: -10,
    y: -15,
    rotateZ: -10,
    scale: 0.98,
    opacity: 1,
    filter: 'blur(0px) drop-shadow(0 18px 24px rgba(10,80,30,0.18))',
    transition: {
      type: 'spring',
      stiffness: 60,
      damping: 14,
      mass: 1,
      delay: 0.65,
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
  return (
    <motion.div
      className={`app-service-card ${className}`}
      variants={useSpringDirect ? appCardSpringVariants : appCardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      style={{
        position: 'absolute',
        transformOrigin: 'center center',
        zIndex: 40, // Layered above Black Branding card (z:30) and below upcoming Blue Visa card (z:50)
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
        src={appImage}
        alt="App Development Glossy Green Service Card"
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

export default AppCard;
