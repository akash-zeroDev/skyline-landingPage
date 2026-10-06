import { useEffect, useRef } from 'react';
import { motionValue, animate } from 'framer-motion';
import { EASE } from './tokens.js';

/**
 * useCountUp:
 * Drives a numeric count-up via Framer Motion's motionValue and writes textContent
 * directly through a DOM ref (0 React re-renders during animation).
 *
 * @param {React.RefObject} nodeRef - Target DOM element for animated text
 * @param {Object} config
 * @param {number} [config.from=0] - Starting number
 * @param {number} config.to - Target number
 * @param {number} [config.duration=1.0] - Duration in seconds
 * @param {number} [config.delay=0] - Delay in seconds
 * @param {Function} [config.format] - Formatter function (e.g. v => `$${Math.round(v).toLocaleString()}`)
 * @param {boolean} [config.play=false] - Whether animation should trigger
 * @param {boolean} [config.isAnimOff=false] - Jump immediately to final value
 * @param {number} [config.animScale=1] - Dev speed scale factor
 */
export function useCountUp(nodeRef, {
  from = 0,
  to,
  duration = 1.0,
  delay = 0,
  format = (v) => String(v),
  play = false,
  isAnimOff = false,
  animScale = 1,
}) {
  const mvRef = useRef(null);
  if (!mvRef.current) {
    mvRef.current = motionValue(from);
  }
  const mv = mvRef.current;

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    if (isAnimOff) {
      mv.set(to);
      node.textContent = format(to);
      return;
    }

    if (!play) {
      // Resting initial or reset state
      mv.set(from);
      node.textContent = format(from);
      return;
    }

    const controls = animate(mv, to, {
      duration: duration * animScale,
      delay: delay * animScale,
      ease: EASE.out,
      onUpdate: (latest) => {
        if (nodeRef.current) {
          nodeRef.current.textContent = format(latest);
        }
      },
      onComplete: () => {
        if (nodeRef.current) {
          nodeRef.current.textContent = format(to);
        }
      },
    });

    return () => controls.stop();
  }, [nodeRef, play, to, from, duration, delay, isAnimOff, animScale, format, mv]);

  return mv;
}

export default useCountUp;
