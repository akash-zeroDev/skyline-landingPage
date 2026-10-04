import React from 'react';
import { motion, type Variants } from 'framer-motion';
import trayFrameImage from '../../assets/trayFrameCropped.png';
import { TRAY_LAYOUT } from './cardLayout';

const config = TRAY_LAYOUT;

/**
 * Framer Motion Animation Variants for the Central Wallet Slot (Dark Tray)
 *
 * Smooth upward entrance spring settling at resting center (642px, 481.5px).
 */
export const trayEntranceVariants: Variants = {
  hidden: {
    y: 80,
    opacity: 0,
    scale: 0.96,
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: config.spring.stiffness,
      damping: config.spring.damping,
      mass: config.spring.mass,
      delay: config.spring.delay,
    },
  },
};

interface WalletSlotProps {
  className?: string;
  variant?: 'shadow' | 'back' | 'front' | 'all';
}

export const WalletSlot: React.FC<WalletSlotProps> = ({
  className = '',
  variant = 'all',
}) => {
  const isInstant =
    typeof window !== 'undefined' &&
    (window.location.search.includes('instant') || window.location.search.includes('debug'));

  const zIndexValue =
    variant === 'shadow'
      ? config.zIndex.shadow
      : variant === 'front'
      ? config.zIndex.front
      : config.zIndex.back;

  return (
    <div
      className={`wallet-tray-positioner wallet-tray-${variant} ${className}`}
      style={{
        position: 'absolute',
        left: `${config.leftPct}%`,
        top: `${config.topPct}%`,
        width: `${config.widthPct}%`,
        height: `${config.heightPct}%`,
        transform: 'translate(-50%, -50%)',
        transformOrigin: '50% 50%',
        zIndex: zIndexValue,
        pointerEvents: 'none',
      }}
    >
      <motion.div
        className="wallet-tray-motion"
        variants={trayEntranceVariants}
        initial="hidden"
        animate="visible"
        style={{
          width: '100%',
          height: '100%',
          transformOrigin: '50% 50%',
          position: 'relative',
        }}
        {...(isInstant
          ? {
              initial: { y: 0, opacity: 1, scale: 1 },
              animate: { y: 0, opacity: 1, scale: 1 },
              transition: { duration: 0, delay: 0 },
            }
          : {})}
      >
        {/* L0: Tray Drop Shadow (soft light-gray blur underneath) */}
        {(variant === 'shadow' || variant === 'all') && (
          <div
            className="wallet-tray-shadow"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: `${config.borderRadius}px`,
              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.20)',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* L1: Back Frame (full hollow frame with transparent interior) */}
        {(variant === 'back' || variant === 'all') && (
          <div
            className="wallet-tray-back-frame"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
            }}
          >
            <img
              src={trayFrameImage}
              alt="Wallet Slot 3D Frame Back"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'fill',
                display: 'block',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
              draggable={false}
            />
          </div>
        )}

        {/* L2: Front Lip (clipped copy showing bottom rim and lower corner curves) */}
        {variant === 'front' && (
          <div
            className="wallet-tray-front-lip"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              clipPath: 'inset(80% 0 0 0)', // Shows only bottom 20% (bottom edge and corner arcs)
              pointerEvents: 'none',
            }}
          >
            <img
              src={trayFrameImage}
              alt="Wallet Slot 3D Frame Front Lip"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'fill',
                display: 'block',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
              draggable={false}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default WalletSlot;
