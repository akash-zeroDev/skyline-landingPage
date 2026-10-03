import React from 'react';
import { motion, type Variants } from 'framer-motion';
import roundedUiImage from '../../assets/roundedUI.png';

/**
 * Framer Motion Animation Variants for the Central Wallet Slot
 *
 * Trajectory:
 *  0%:   y: 400px, opacity: 0, scaleY: 0.5
 *  40%:  y: 180px, opacity: 1, scaleY: 0.8
 *  100%: y: 150px, opacity: 1, scaleY: 1
 */
export const walletSlotVariants: Variants = {
  hidden: {
    x: 0,
    y: 400,
    opacity: 0,
    scaleY: 0.5,
  },
  visible: {
    x: 0,
    y: [400, 180, 150],
    opacity: [0, 1, 1],
    scaleY: [0.5, 0.8, 1.0],
    transition: {
      duration: 1.2,
      times: [0, 0.4, 1],
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const walletSlotSpringVariants: Variants = {
  hidden: {
    x: 0,
    y: 400,
    opacity: 0,
    scaleY: 0.5,
  },
  visible: {
    x: 0,
    y: 150,
    opacity: 1,
    scaleY: 1,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 15,
      mass: 1,
    },
  },
};

interface WalletSlotProps {
  className?: string;
  useSpringDirect?: boolean;
}

export const WalletSlot: React.FC<WalletSlotProps> = ({
  className = '',
  useSpringDirect = false,
}) => {
  return (
    <motion.div
      className={`wallet-slot-container ${className}`}
      variants={useSpringDirect ? walletSlotSpringVariants : walletSlotVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      style={{
        position: 'absolute',
        transformOrigin: 'center bottom',
        zIndex: 5, // Sits behind all cards (cards start at z:10)
        width: '600px',
        maxWidth: '92vw',
        height: '180px',
        borderRadius: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        willChange: 'transform, opacity',
      }}
    >
      {/* Glossy Black Cavity & Inner Shadow */}
      <div
        className="wallet-slot-cavity"
        style={{
          position: 'absolute',
          inset: '10px 18px',
          backgroundColor: '#0c0e14',
          borderRadius: '32px',
          boxShadow: `
            inset 0 14px 28px -4px rgba(0, 0, 0, 0.95),
            inset 0 -4px 10px rgba(255, 255, 255, 0.08),
            0 12px 28px rgba(0, 0, 0, 0.15)
          `,
          zIndex: 1,
        }}
      />

      {/* 3D Glossy Rounded Frame Rim Asset */}
      <img
        src={roundedUiImage}
        alt="Wallet Slot 3D Frame"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          zIndex: 2,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
        draggable={false}
      />
    </motion.div>
  );
};

export default WalletSlot;
