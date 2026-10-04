import React from 'react';
import { motion, type Variants } from 'framer-motion';
import fingerprintIcon from '../../assets/fingerprintIcon.png';
import { ICON_CLUSTER_LAYOUT } from './cardLayout';

const config = ICON_CLUSTER_LAYOUT.fingerprint;

export const fingerprintEntranceVariants: Variants = {
  hidden: {
    y: 50,
    rotateZ: config.rotation,
    scale: 0.7,
    opacity: 0,
    filter: 'blur(8px)',
  },
  visible: {
    y: 0,
    rotateZ: config.rotation,
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: config.spring.stiffness,
      damping: config.spring.damping,
      mass: config.spring.mass,
      delay: config.spring.delay,
    },
  },
};

interface FingerprintAccentProps {
  className?: string;
}

export const FingerprintAccent: React.FC<FingerprintAccentProps> = ({ className = '' }) => {
  const isInstant =
    typeof window !== 'undefined' &&
    (window.location.search.includes('instant') || window.location.search.includes('debug'));

  return (
    <div
      className={`hero-accent-fingerprint-positioner ${className}`}
      style={{
        position: 'absolute',
        left: `${config.leftPct}%`,
        top: `${config.topPct}%`,
        width: `${config.widthPct}%`,
        aspectRatio: '1 / 1',
        transform: 'translate(-50%, -50%)',
        transformOrigin: '50% 50%',
        zIndex: config.zIndex, // 60: middle tile (overlaps black tile)
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <motion.div
        className="hero-accent-fingerprint-motion"
        variants={fingerprintEntranceVariants}
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
                rotateZ: config.rotation,
                scale: 1,
                opacity: 1,
                filter: 'blur(0px)',
              },
              animate: {
                y: 0,
                rotateZ: config.rotation,
                scale: 1,
                opacity: 1,
                filter: 'blur(0px)',
              },
              transition: { duration: 0, delay: 0 },
            }
          : {})}
      >
        {/* Frosted Glass Tile Surface with genuine backdrop-filter */}
        <div
          className="fingerprint-glass-tile"
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '22%',
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.55) 0%, rgba(245, 247, 252, 0.38) 100%)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(255, 255, 255, 0.75)',
            boxShadow:
              'inset 0 1px 2px rgba(255, 255, 255, 0.9), inset 0 0 0 1px rgba(255, 255, 255, 0.35), 0 16px 26px rgba(17, 26, 92, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <img
            src={fingerprintIcon}
            alt="3D Frosted Glass Orange Fingerprint"
            style={{
              width: '56%',
              height: '56%',
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(0 4px 10px rgba(255, 122, 26, 0.35))',
            }}
            draggable={false}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default FingerprintAccent;
