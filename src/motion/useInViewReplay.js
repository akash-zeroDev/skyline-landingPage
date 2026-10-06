import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { REPLAY } from './tokens.js';

/**
 * Reads dev flags and system preferences from URL query params and media queries.
 */
export function getMotionFlags() {
  if (typeof window === 'undefined') {
    return { isAnimOff: true, animScale: 1, isReplay: false, pose: 'tilted', prefersReduced: false };
  }
  const sp = new URLSearchParams(window.location.search);
  const prefersReduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isAnimOff = sp.get('anim') === 'off' || prefersReduced;

  let animScale = 1;
  let isReplay = false;
  let pose = 'tilted';

  if (import.meta.env.DEV) {
    const scaleParam = parseFloat(sp.get('animScale') || '1');
    animScale = !isNaN(scaleParam) && scaleParam > 0 ? scaleParam : 1;
    isReplay = sp.get('replay') === '1';
    const urlPose = sp.get('pose');
    pose = urlPose === 'flat' ? 'flat' : 'tilted';
  } else {
    const urlPose = sp.get('pose');
    if (urlPose === 'flat') pose = 'flat';
  }

  return { isAnimOff, animScale, isReplay, pose, prefersReduced };
}

// Global scroll velocity monitor for settle detection (< 600 px/s)
let globalScrollY = 0;
let globalScrollTime = 0;
let globalScrollSpeed = 0;
let scrollListenerAttached = false;
let scrollDecayTimer = null;

function ensureScrollSpeedTracking() {
  if (typeof window === 'undefined' || scrollListenerAttached) return;
  scrollListenerAttached = true;
  globalScrollY = window.scrollY;
  globalScrollTime = performance.now();

  window.addEventListener(
    'scroll',
    () => {
      const now = performance.now();
      const dt = (now - globalScrollTime) / 1000;
      if (dt >= 0.015) {
        const dy = Math.abs(window.scrollY - globalScrollY);
        globalScrollSpeed = dy / dt;
        globalScrollY = window.scrollY;
        globalScrollTime = now;
      }
      clearTimeout(scrollDecayTimer);
      scrollDecayTimer = setTimeout(() => {
        globalScrollSpeed = 0;
      }, 80);
    },
    { passive: true }
  );
}

export function getScrollSpeed() {
  return globalScrollSpeed;
}

/**
 * useInViewReplay hook:
 * Reusable scroll-driven state machine: "idle" -> "in" -> "out".
 *
 * @param {React.RefObject} targetRef - Element to observe
 * @param {Object} options
 * @param {number} [options.amount=0.35] - Intersection ratio threshold
 * @param {string} [options.margin='0px'] - Root margin
 * @param {'reenter'|'once'} [options.replay=REPLAY] - Replay mode
 * @param {boolean} [options.settle=false] - Settle guard: wait until scroll speed < 600 px/s
 * @param {boolean} [options.disabled=false] - Skip animation and settle immediately
 * @param {number} [options.minHeightFraction=0.6] - Visible height fraction of viewport for tall elements
 */
export function useInViewReplay(targetRef, options = {}) {
  const {
    amount = 0.35,
    margin = '0px',
    replay = REPLAY,
    settle = false,
    disabled = false,
    minHeightFraction = 0.6,
  } = options;

  const flags = useMemo(() => getMotionFlags(), []);
  const [state, setState] = useState(() => (flags.isAnimOff || disabled ? 'in' : 'idle'));
  const [cycle, setCycle] = useState(0);

  const stateRef = useRef(state);
  stateRef.current = state;

  const inTimerRef = useRef(null);
  const outTimerRef = useRef(null);
  const settlePollRef = useRef(null);
  const conditionStartTimeRef = useRef(null);

  const forceReplay = useCallback(() => {
    setState('idle');
    setCycle((c) => c + 1);
    setTimeout(() => {
      setState('in');
    }, 16);
  }, []);

  useEffect(() => {
    ensureScrollSpeedTracking();
    const node = targetRef.current;
    if (!node) return;

    if (flags.isAnimOff || disabled) {
      setState('in');
      return;
    }

    if (flags.isReplay) {
      setState('idle');
      const timer = setTimeout(() => {
        setState('in');
      }, 50);
      return () => clearTimeout(timer);
    }

    // Safety fallback: Missing IntersectionObserver
    if (typeof window.IntersectionObserver === 'undefined') {
      setState('in');
      return;
    }

    function checkCondition(entry) {
      if (!entry.isIntersecting) return false;
      if (entry.intersectionRatio >= amount) return true;

      // Check tall element viewport height coverage
      const vh = window.innerHeight || 800;
      const rect = entry.boundingClientRect;
      const top = Math.max(0, rect.top);
      const bottom = Math.min(vh, rect.bottom);
      const visibleHeight = Math.max(0, bottom - top);
      return visibleHeight >= minHeightFraction * vh;
    }

    function startSettleCheck(onPassed) {
      const startTime = conditionStartTimeRef.current || performance.now();
      function poll() {
        const elapsed = performance.now() - startTime;
        const speed = getScrollSpeed();
        // Settle condition: speed < 600 px/s, or max timeout 600ms
        if (speed < 600 || elapsed >= 600) {
          onPassed();
        } else {
          settlePollRef.current = requestAnimationFrame(poll);
        }
      }
      poll();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        const isMet = checkCondition(entry);

        if (isMet) {
          // Cancel any pending OUT reset
          if (outTimerRef.current) {
            clearTimeout(outTimerRef.current);
            outTimerRef.current = null;
          }

          if (stateRef.current === 'idle') {
            if (!inTimerRef.current) {
              conditionStartTimeRef.current = performance.now();
              // Condition must hold continuously for >= 120ms
              inTimerRef.current = setTimeout(() => {
                inTimerRef.current = null;
                if (settle) {
                  startSettleCheck(() => {
                    setState('in');
                  });
                } else {
                  setState('in');
                }
              }, 120);
            }
          }
        } else {
          // Condition no longer met: cancel IN debounce if still pending
          if (inTimerRef.current) {
            clearTimeout(inTimerRef.current);
            inTimerRef.current = null;
          }
          if (settlePollRef.current) {
            cancelAnimationFrame(settlePollRef.current);
            settlePollRef.current = null;
          }

          // Check for complete exit: intersectionRatio === 0
          if (entry.intersectionRatio === 0 && (stateRef.current === 'in' || stateRef.current === 'idle')) {
            if (!outTimerRef.current) {
              // Must be 0 for >= 400ms before OUT transition
              outTimerRef.current = setTimeout(() => {
                outTimerRef.current = null;
                // Double-check element is completely outside viewport bounds
                const r = node.getBoundingClientRect();
                const vh = window.innerHeight || 800;
                const isCompletelyOffscreen = r.bottom <= 0 || r.top >= vh;

                if (isCompletelyOffscreen) {
                  setState('out');
                  if (replay === 'reenter') {
                    // Reset instantly to initial state off-screen for next entry
                    setState('idle');
                    setCycle((c) => c + 1);
                  }
                }
              }, 400);
            }
          }
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.35, 0.5, 0.6, 0.7, 0.85, 1.0],
        rootMargin: margin,
      }
    );

    observer.observe(node);

    // 4-second safety timeout after mount
    const safetyTimeout = setTimeout(() => {
      if (stateRef.current === 'idle') {
        const r = node.getBoundingClientRect();
        const vh = window.innerHeight || 800;
        if (r.top < vh && r.bottom > 0) {
          setState('in');
        }
      }
    }, 4000);

    // Beforeprint handler
    const handleBeforePrint = () => {
      setState('in');
    };
    window.addEventListener('beforeprint', handleBeforePrint);

    // Visibility change handler
    const handleVisibilityChange = () => {
      if (!document.hidden && stateRef.current === 'idle') {
        const r = node.getBoundingClientRect();
        const vh = window.innerHeight || 800;
        if (r.top < vh && r.bottom > 0) {
          setState('in');
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Live reduced-motion toggling
    let mql;
    if (typeof window.matchMedia === 'function') {
      mql = window.matchMedia('(prefers-reduced-motion: reduce)');
      const handleMotionChange = (e) => {
        if (e.matches) {
          setState('in');
        }
      };
      mql.addEventListener?.('change', handleMotionChange);
    }

    return () => {
      observer.disconnect();
      if (inTimerRef.current) clearTimeout(inTimerRef.current);
      if (outTimerRef.current) clearTimeout(outTimerRef.current);
      if (settlePollRef.current) cancelAnimationFrame(settlePollRef.current);
      clearTimeout(safetyTimeout);
      window.removeEventListener('beforeprint', handleBeforePrint);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [targetRef, amount, margin, replay, settle, disabled, minHeightFraction, flags]);

  return {
    state,
    isIn: state === 'in',
    isIdle: state === 'idle',
    isOut: state === 'out',
    cycle,
    forceReplay,
    flags,
  };
}

export default useInViewReplay;
