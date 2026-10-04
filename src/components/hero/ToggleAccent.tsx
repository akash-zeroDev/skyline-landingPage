import React, { useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import trackOffImg from '../../assets/toggle_track_off.png';
import trackOnImg from '../../assets/toggle_track_on.png';
import knobImg from '../../assets/knob.png';
import { TOGGLE_LAYOUT, TOGGLE_STATES } from './cardLayout';

const config = TOGGLE_LAYOUT;

export const toggleEntranceVariants: Variants = {
  hidden: {
    y: 50,
    rotateZ: config.rotation,
    scale: 0.5,
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
      stiffness: config.entranceSpring.stiffness,
      damping: config.entranceSpring.damping,
      mass: config.entranceSpring.mass,
      delay: config.entranceSpring.delay,
    },
  },
};

interface ToggleAccentProps {
  className?: string;
  isOn?: boolean;
  onToggle?: (checked: boolean) => void;
}

export const ToggleAccent: React.FC<ToggleAccentProps> = ({
  className = '',
  isOn: controlledIsOn,
  onToggle,
}) => {
  const isReducedMotion = useReducedMotion();

  const isInstant =
    typeof window !== 'undefined' &&
    (window.location.search.includes('instant') || window.location.search.includes('debug'));

  const isUrlOff =
    typeof window !== 'undefined' && window.location.search.includes('off');

  const [internalIsOn, setInternalIsOn] = useState(!isUrlOff);

  const activeIsOn = controlledIsOn !== undefined ? controlledIsOn : internalIsOn;

  const handleToggle = () => {
    const nextState = !activeIsOn;
    if (controlledIsOn === undefined) {
      setInternalIsOn(nextState);
    }
    if (onToggle) {
      onToggle(nextState);
    }
  };

  const springConfig = isReducedMotion
    ? { duration: config.reducedMotionDuration, ease: 'easeOut' as const }
    : isInstant
    ? { duration: 0 }
    : {
        type: 'spring' as const,
        stiffness: config.spring.stiffness,
        damping: config.spring.damping,
        mass: config.spring.mass,
      };

  return (
    <div
      className={`hero-accent-toggle-positioner ${className}`}
      style={{
        position: 'absolute',
        left: `${config.leftPct}%`,
        top: `${config.topPct}%`,
        width: `${config.widthPct}%`,
        aspectRatio: config.aspectRatio,
        transform: 'translate(-50%, -50%)',
        transformOrigin: '50% 50%',
        zIndex: config.zIndex,
        pointerEvents: 'auto',
      }}
    >
      <motion.div
        className="hero-accent-toggle-motion"
        variants={toggleEntranceVariants}
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
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)',
              },
              animate: {
                y: 0,
                rotateZ: config.rotation,
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)',
              },
              transition: { duration: 0, delay: 0 },
            }
          : {})}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            transformOrigin: '50% 50%',
            position: 'relative',
          }}
        >
          <button
            type="button"
            onClick={handleToggle}
            role="switch"
            aria-checked={activeIsOn ? TOGGLE_STATES.on.ariaChecked : TOGGLE_STATES.off.ariaChecked}
            aria-label="Toggle"
            style={{
              all: 'unset',
              display: 'block',
              width: '100%',
              aspectRatio: config.aspectRatio,
              position: 'relative',
              cursor: 'pointer',
              pointerEvents: 'auto',
              userSelect: 'none',
              WebkitTapHighlightColor: 'transparent',
              outline: 'none',
              filter: 'drop-shadow(0 16px 20px rgba(0, 0, 0, 0.14))',
            }}
            className="focus-visible:ring-4 focus-visible:ring-blue-500 rounded-full"
          >
            {/* LAYER 1: Shared Bezel + Track-Off (Static Base) */}
            <img
              src={trackOffImg}
              alt=""
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
                pointerEvents: 'none',
              }}
              draggable={false}
            />

            {/* LAYER 2: Shared Bezel + Track-On (Crossfade via Opacity) */}
            <motion.img
              src={trackOnImg}
              alt=""
              initial={false}
              animate={{ opacity: activeIsOn ? TOGGLE_STATES.on.trackOpacity : TOGGLE_STATES.off.trackOpacity }}
              transition={springConfig}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
                pointerEvents: 'none',
              }}
              draggable={false}
            />

            {/* LAYER 3: Knob (Translates along the tilted track's own axis) */}
            <motion.div
              initial={false}
              animate={{
                x: activeIsOn ? TOGGLE_STATES.on.knobX : TOGGLE_STATES.off.knobX,
              }}
              whileTap={{ scaleX: 1.05 }}
              transition={springConfig}
              style={{
                position: 'absolute',
                left: `${config.knobOnLeftPct}%`,
                top: `${config.knobOnTopPct}%`,
                width: `${config.knobWidthPct}%`,
                height: `${config.knobHeightPct}%`,
                pointerEvents: 'none',
                transformOrigin: activeIsOn ? 'left center' : 'right center',
              }}
            >
              <img
                src={knobImg}
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                  filter:
                    'drop-shadow(10px 15px 20px rgba(0,0,0,0.25)) drop-shadow(-2px -2px 5px rgba(0,0,0,0.05))',
                }}
                draggable={false}
              />
            </motion.div>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ToggleAccent;
