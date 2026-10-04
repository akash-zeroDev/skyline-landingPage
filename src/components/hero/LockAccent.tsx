import React from 'react';
import { motion, type Variants } from 'framer-motion';
import padlockImage from '../../assets/padlock.png';
import { ICON_CLUSTER_LAYOUT } from './cardLayout';

const blueConfig = ICON_CLUSTER_LAYOUT.blue;
const padlockConfig = ICON_CLUSTER_LAYOUT.padlock;

export const blueEntranceVariants: Variants = {
  hidden: {
    y: 50,
    rotateZ: blueConfig.rotation,
    scale: 0.7,
    opacity: 0,
    filter: 'blur(8px)',
  },
  visible: {
    y: 0,
    rotateZ: blueConfig.rotation,
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: blueConfig.spring.stiffness,
      damping: blueConfig.spring.damping,
      mass: blueConfig.spring.mass,
      delay: blueConfig.spring.delay,
    },
  },
};

export const padlockEntranceVariants: Variants = {
  hidden: {
    y: 50,
    rotateZ: padlockConfig.rotation,
    scale: 0.7,
    opacity: 0,
    filter: 'blur(8px)',
  },
  visible: {
    y: 0,
    rotateZ: padlockConfig.rotation,
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: padlockConfig.spring.stiffness,
      damping: padlockConfig.spring.damping,
      mass: padlockConfig.spring.mass,
      delay: padlockConfig.spring.delay,
    },
  },
};

interface LockAccentProps {
  className?: string;
}

export const LockAccent: React.FC<LockAccentProps> = ({ className = '' }) => {
  const isInstant =
    typeof window !== 'undefined' &&
    (window.location.search.includes('instant') || window.location.search.includes('debug'));

  return (
    <>
      {/* 1. VIVID BLUE TILE (z-index: 65) */}
      <div
        className={`hero-accent-blue-tile-positioner ${className}`}
        style={{
          position: 'absolute',
          left: `${blueConfig.leftPct}%`,
          top: `${blueConfig.topPct}%`,
          width: `${blueConfig.widthPct}%`,
          aspectRatio: '1 / 1',
          transform: 'translate(-50%, -50%)',
          transformOrigin: '50% 50%',
          zIndex: blueConfig.zIndex, // 65: in front of Frosted tile (60)
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <motion.div
          className="hero-accent-blue-tile-motion"
          variants={blueEntranceVariants}
          initial={isInstant ? 'visible' : 'hidden'}
          animate="visible"
          style={{
            width: '100%',
            height: '100%',
            transformOrigin: '50% 50%',
            position: 'relative',
            willChange: 'transform, opacity, filter',
          }}
          {...(isInstant
            ? {
                initial: {
                  y: 0,
                  rotateZ: blueConfig.rotation,
                  scale: 1,
                  opacity: 1,
                  filter: 'blur(0px)',
                },
                animate: {
                  y: 0,
                  rotateZ: blueConfig.rotation,
                  scale: 1,
                  opacity: 1,
                  filter: 'blur(0px)',
                },
                transition: { duration: 0, delay: 0 },
              }
            : {})}
        >
          {/* 3D Glossy Blue Clay Tile Surface */}
          <div
            className="blue-clay-tile-surface"
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '22%',
              background:
                'linear-gradient(135deg, #428eff 0%, #1f59e6 100%)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              boxShadow:
                'inset 0 2px 4px rgba(255, 255, 255, 0.55), inset 0 -2px 4px rgba(0, 0, 0, 0.22), 0 16px 28px rgba(31, 89, 230, 0.22)',
              position: 'relative',
            }}
          />
        </motion.div>
      </div>

      {/* 2. SILVER PADLOCK (z-index: 70, sticks past blue tile edges) */}
      <div
        className="hero-accent-padlock-positioner"
        style={{
          position: 'absolute',
          left: `${padlockConfig.leftPct}%`,
          top: `${padlockConfig.topPct}%`,
          width: `${padlockConfig.widthPct}%`,
          aspectRatio: '667 / 780',
          transform: 'translate(-50%, -50%)',
          transformOrigin: '50% 50%',
          zIndex: padlockConfig.zIndex, // 70: front-most of the entire cluster
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        <motion.div
          className="hero-accent-padlock-motion"
          variants={padlockEntranceVariants}
          initial={isInstant ? 'visible' : 'hidden'}
          animate="visible"
          style={{
            width: '100%',
            height: '100%',
            transformOrigin: '50% 50%',
            position: 'relative',
            willChange: 'transform, opacity, filter',
          }}
          {...(isInstant
            ? {
                initial: {
                  y: 0,
                  rotateZ: padlockConfig.rotation,
                  scale: 1,
                  opacity: 1,
                  filter: 'blur(0px)',
                },
                animate: {
                  y: 0,
                  rotateZ: padlockConfig.rotation,
                  scale: 1,
                  opacity: 1,
                  filter: 'blur(0px)',
                },
                transition: { duration: 0, delay: 0 },
              }
            : {})}
        >
          <img
            src={padlockImage}
            alt="3D Silver Padlock"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              filter:
                'drop-shadow(0 14px 22px rgba(0, 0, 0, 0.28)) drop-shadow(-2px -2px 6px rgba(0, 0, 0, 0.08))',
            }}
            draggable={false}
          />
        </motion.div>
      </div>
    </>
  );
};

export default LockAccent;
