import React from 'react';
import { motion, type Variants } from 'framer-motion';
import webImage from '../../assets/web.png';

/**
 * Framer Motion Animation Variants for the Blue "Web Design" Service Card (Front-most)
 *
 * Sequence Breakdown:
 *  0%   (Slot/Hidden):   y: 500px, x: 0px, rotateZ: 0deg, scale: 1, opacity: 0, blur(10px)
 *  40%  (Peak Overshoot): y: -50px, x: 35px, rotateZ: 5deg, scale: 1, opacity: 1, blur(2px)
 *  100% (Final Settle):   y: -10px, x: 80px, rotateZ: 10deg, scale: 1.0, opacity: 1, blur(0px)
 */
export const webCardVariants: Variants = {
  hidden: {
    x: 0,
    y: 500,
    rotateZ: 0,
    scale: 1,
    opacity: 0,
    filter: 'blur(10px) drop-shadow(0 10px 15px rgba(0,0,0,0.08))',
  },
  visible: {
    // Curved bezier path arcing rightward (opposite to the back cards) to fan out the wallet
    x: [0, 35, 80],
    y: [500, -50, -10],
    rotateZ: [0, 5, 10],
    scale: [1, 1, 1.0],
    opacity: [0, 1, 1],

    // Glossy blue dynamic specular depth & alpha drop-shadow
    filter: [
      'blur(10px) drop-shadow(0 15px 15px rgba(0,0,0,0.08))',
      'blur(2px) drop-shadow(0 35px 32px rgba(10,50,140,0.30))',
      'blur(0px) drop-shadow(0 20px 26px rgba(10,50,140,0.20))',
    ],
    transition: {
      duration: 1.4,
      times: [0, 0.4, 1],
      ease: ['easeOut', [0.16, 1, 0.3, 1]],
      delay: 0.8, // 0.15s stagger after Card 4 (delay 0.65s)
    },
  },
};

/**
 * Alternative variant using direct spring physics for final settle:
 * transition: { type: "spring", stiffness: 60, damping: 14, mass: 1, delay: 0.8 }
 */
export const webCardSpringVariants: Variants = {
  hidden: {
    x: 0,
    y: 500,
    rotateZ: 0,
    scale: 1,
    opacity: 0,
    filter: 'blur(10px)',
  },
  visible: {
    x: 80,
    y: -10,
    rotateZ: 10,
    scale: 1.0,
    opacity: 1,
    filter: 'blur(0px) drop-shadow(0 20px 26px rgba(10,50,140,0.20))',
    transition: {
      type: 'spring',
      stiffness: 60,
      damping: 14,
      mass: 1,
      delay: 0.8,
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
  return (
    <motion.div
      className={`web-service-card ${className}`}
      variants={useSpringDirect ? webCardSpringVariants : webCardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      style={{
        position: 'absolute',
        transformOrigin: 'center center',
        zIndex: 50, // Front-most card in the wallet stack (highest z-index)
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
        src={webImage}
        alt="Web Design Glossy Blue Service Card"
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

export default WebCard;
