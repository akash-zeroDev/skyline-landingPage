import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { CURSOR_LAYOUT } from './cardLayout';

const config = CURSOR_LAYOUT;

export const cursorEntranceVariants: Variants = {
  hidden: {
    x: -220,
    y: 400,
    opacity: 0,
    scale: 0.8,
    rotateZ: -30,
  },
  visible: {
    x: 0,
    y: 0,
    opacity: 1,
    scale: 1,
    rotateZ: config.rotation,
    transition: {
      type: 'spring',
      stiffness: config.spring.stiffness,
      damping: config.spring.damping,
      mass: config.spring.mass,
      delay: config.spring.delay,
    },
  },
};

interface FloatingCursorProps {
  className?: string;
}

export const FloatingCursor: React.FC<FloatingCursorProps> = ({
  className = '',
}) => {
  const isInstant =
    typeof window !== 'undefined' &&
    (window.location.search.includes('instant') || window.location.search.includes('debug'));

  return (
    <div
      className={`floating-cursor-positioner ${className}`}
      style={{
        position: 'absolute',
        left: `${config.leftPct}%`,
        top: `${config.topPct}%`,
        width: `${config.widthPct}%`,
        height: `${config.heightPct}%`,
        transformOrigin: '8% 5.381%', // Pivot exactly at the tip (6px, 6px)
        zIndex: config.zIndex,
        pointerEvents: 'none',
      }}
    >
      <motion.div
        className="floating-cursor-motion"
        variants={cursorEntranceVariants}
        initial="hidden"
        animate="visible"
        style={{
          width: '100%',
          height: '100%',
          transformOrigin: '8% 5.381%',
          position: 'relative',
          willChange: 'transform, opacity',
        }}
        {...(isInstant
          ? {
              initial: { x: 0, y: 0, opacity: 1, scale: 1, rotateZ: config.rotation },
              animate: { x: 0, y: 0, opacity: 1, scale: 1, rotateZ: config.rotation },
              transition: { duration: 0, delay: 0 },
            }
          : {})}
      >
        <svg viewBox="0 0 75 111.5" width="100%" height="100%" style={{ overflow: 'visible' }}>
          <defs>
            <filter id="cursor-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="6" dy="10" stdDeviation="6" floodColor="rgba(0,0,0,0.20)" />
            </filter>
          </defs>
          <path
            d="M 6.0 6.0 L 6.0 75.3 L 22.6 59.6 L 37.3 97.5 L 50.3 92.0 L 35.6 54.0 L 61.4 54.0 Z"
            fill="#111113"
            stroke="white"
            strokeWidth="18"
            strokeLinejoin="round"
            strokeLinecap="round"
            style={{ paintOrder: 'stroke fill', filter: 'url(#cursor-shadow)' }}
          />
        </svg>
      </motion.div>
    </div>
  );
};

export default FloatingCursor;
