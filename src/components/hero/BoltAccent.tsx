import React from 'react';
import { motion, type Variants } from 'framer-motion';
import boltImage from '../../assets/bolt.png';
import { ICON_CLUSTER_LAYOUT } from './cardLayout';

const config = ICON_CLUSTER_LAYOUT.bolt;

export const boltEntranceVariants: Variants = {
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

interface BoltAccentProps {
  className?: string;
}

export const BoltAccent: React.FC<BoltAccentProps> = ({ className = '' }) => {
  const isInstant =
    typeof window !== 'undefined' &&
    (window.location.search.includes('instant') || window.location.search.includes('debug'));

  return (
    <div
      className={`hero-accent-bolt-positioner ${className}`}
      style={{
        position: 'absolute',
        left: `${config.leftPct}%`,
        top: `${config.topPct}%`,
        width: `${config.widthPct}%`,
        aspectRatio: '1 / 1',
        transform: 'translate(-50%, -50%)',
        transformOrigin: '50% 50%',
        zIndex: config.zIndex, // 55: back-most of the cluster
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <motion.div
        className="hero-accent-bolt-motion"
        variants={boltEntranceVariants}
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
        <div style={{ width: '100%', height: '100%', transformOrigin: '50% 50%' }}>
          <img
            src={boltImage}
            alt="3D Lightning Bolt Square Accent"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
              filter: 'drop-shadow(0 14px 22px rgba(0, 0, 0, 0.22))',
            }}
            draggable={false}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default BoltAccent;
