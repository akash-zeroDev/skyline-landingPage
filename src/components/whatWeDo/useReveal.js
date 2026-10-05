import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { MOTION, REVENUE } from './config';

/**
 * Creates an analytical cubic bezier solver for cubic-bezier(x1, y1, x2, y2).
 * Uses Newton-Raphson iterations to solve x(t) = targetX, then computes y(t).
 */
export function createCubicBezierSolver(x1, y1, x2, y2) {
  function sampleX(t) {
    return ((1 - 3 * x2 + 3 * x1) * t + (3 * x2 - 6 * x1)) * t * t + 3 * x1 * t;
  }
  function sampleY(t) {
    return ((1 - 3 * y2 + 3 * y1) * t + (3 * y2 - 6 * y1)) * t * t + 3 * y1 * t;
  }
  function sampleDerivX(t) {
    return (3 * (1 - 3 * x2 + 3 * x1) * t + 2 * (3 * x2 - 6 * x1)) * t + 3 * x1;
  }

  return function solve(x) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const d2 = sampleDerivX(t);
      if (Math.abs(d2) < 1e-6) break;
      const x2Val = sampleX(t) - x;
      t -= x2Val / d2;
    }
    return sampleY(t);
  };
}

/**
 * Creates an analytical spring solver for mass-spring-damper:
 * m * x'' + c * x' + k * (x - 1) = 0 with x(0) = 0, x'(0) = 0.
 */
export function createSpringSolver(k = 220, c = 19, m = 1) {
  const w0 = Math.sqrt(k / m);
  const zeta = c / (2 * Math.sqrt(m * k));
  const wd = w0 * Math.sqrt(1 - zeta * zeta);
  const s = zeta * w0;
  const cFactor = s / wd;

  return function solve(t) {
    if (t <= 0) return 0;
    const decay = Math.exp(-s * t);
    return 1 - decay * (Math.cos(wd * t) + cFactor * Math.sin(wd * t));
  };
}

/**
 * Reads dev flags and preferences from URL and system environment.
 */
export function getMotionFlags() {
  if (typeof window === 'undefined') {
    return { isAnimOff: true, animScale: 1, isReplay: false, pose: 'tilted' };
  }
  const sp = new URLSearchParams(window.location.search);
  const prefersReduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isAnimOff = sp.get('anim') === 'off' || prefersReduced;
  const scaleParam = parseFloat(sp.get('animScale') || '1');
  const animScale = !isNaN(scaleParam) && scaleParam > 0 ? scaleParam : 1;
  const isReplay = sp.get('replay') === '1';
  const urlPose = sp.get('pose');
  const pose = urlPose === 'flat' ? 'flat' : 'tilted';

  return { isAnimOff, animScale, isReplay, pose };
}

/**
 * useReveal hook:
 * Orchestrates the "What We Do" section reveal animation timeline:
 * - Single-trigger IntersectionObserver (threshold 0.3, rootMargin 0)
 * - Header word-by-word fade-in
 * - 7 Bento card entrance stagger with cubic-bezier ease-out
 * - Revenue card tilt sequence with overshoot spring
 * - Full reduced-motion and dev control support (?anim=off, ?animScale=N, ?replay=1, window.__wwdReplay())
 */
export default function useReveal(sectionRef) {
  const flags = useMemo(() => getMotionFlags(), []);
  const [revealState, setRevealState] = useState(flags.isAnimOff ? 'settled' : 'pending');
  const isSettled = revealState === 'settled';

  const rafIdRef = useRef(null);

  const startAnimation = useCallback(
    (forceReplay = false) => {
      const node = sectionRef.current;
      if (!node) return;

      if (flags.isAnimOff && !forceReplay) {
        setRevealState('settled');
        node.setAttribute('data-reveal-state', 'settled');
        return;
      }

      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      setRevealState('animating');
      node.setAttribute('data-reveal-state', 'animating');

      // Query animated elements
      const eyebrow = node.querySelector('[data-slot="eyebrow"]');
      const words = Array.from(node.querySelectorAll('.wwd-word'));
      const subtext = node.querySelector('[data-slot="subtext"]');

      const cardEls = {
        revenue: node.querySelector('[data-slot="revenue"]'),
        content: node.querySelector('[data-slot="content"]'),
        'stat-a': node.querySelector('[data-slot="stat-a"]'),
        file: node.querySelector('[data-slot="file"]'),
        'stat-b': node.querySelector('[data-slot="stat-b"]'),
        ai: node.querySelector('[data-slot="ai"]'),
      };

      const revenueFace = cardEls.revenue?.querySelector('[data-part="face"]');
      const revenuePlate = cardEls.revenue?.querySelector('[data-part="plate"]');

      // Initialize frame 0 states
      if (eyebrow) eyebrow.style.opacity = '0';
      words.forEach((w) => {
        w.style.opacity = '0';
      });
      if (subtext) subtext.style.opacity = '0';

      Object.values(cardEls).forEach((cardEl) => {
        if (cardEl) {
          cardEl.style.opacity = '0';
          cardEl.style.transform = `translateY(calc(var(--r) * ${MOTION.cards.yOffset}))`;
        }
      });

      if (revenueFace) {
        revenueFace.style.transform = 'translate(0px, 0px) rotate(0deg)';
        revenueFace.style.zIndex = '1';
        revenueFace.style.boxShadow = REVENUE.COLORS.shadowFlat;
      }
      if (revenuePlate) {
        revenuePlate.style.opacity = '0';
      }

      const startTime = performance.now();
      const animScale = flags.animScale;
      const easeOutCubic = createCubicBezierSolver(
        MOTION.cards.cubicBezier[0],
        MOTION.cards.cubicBezier[1],
        MOTION.cards.cubicBezier[2],
        MOTION.cards.cubicBezier[3]
      );
      const spring = createSpringSolver(
        MOTION.tilt.spring.stiffness,
        MOTION.tilt.spring.damping,
        MOTION.tilt.spring.mass
      );

      function frame() {
        const now = performance.now();
        const elapsed = (now - startTime) / 1000;

        // 1. Eyebrow fade
        if (eyebrow) {
          const d = MOTION.header.eyebrow.delay * animScale;
          const dur = MOTION.header.eyebrow.duration * animScale;
          if (elapsed >= d) {
            const p = Math.min(1, (elapsed - d) / dur);
            eyebrow.style.opacity = p.toFixed(4);
          }
        }

        // 2. Headline words word-by-word fade
        if (words.length > 0) {
          const baseD = MOTION.header.words.baseDelay * animScale;
          const stag = MOTION.header.words.stagger * animScale;
          const dur = MOTION.header.words.duration * animScale;
          words.forEach((w, i) => {
            const d = baseD + i * stag;
            if (elapsed >= d) {
              const p = Math.min(1, (elapsed - d) / dur);
              w.style.opacity = p.toFixed(4);
            }
          });
        }

        // 3. Subtext fade
        if (subtext) {
          const d = MOTION.header.subtext.delay * animScale;
          const dur = MOTION.header.subtext.duration * animScale;
          if (elapsed >= d) {
            const p = Math.min(1, (elapsed - d) / dur);
            subtext.style.opacity = p.toFixed(4);
          }
        }

        // 4. Cards entrance stagger
        let allCardsSettled = true;
        Object.entries(MOTION.cards.delays).forEach(([slot, delayVal]) => {
          const cardEl = cardEls[slot];
          if (!cardEl) return;
          const d = delayVal * animScale;
          const dur = MOTION.cards.duration * animScale;
          if (elapsed < d) {
            allCardsSettled = false;
          } else {
            const p = Math.min(1, (elapsed - d) / dur);
            if (p < 1) {
              allCardsSettled = false;
              const yP = easeOutCubic(p);
              const yOffset = (1 - yP) * MOTION.cards.yOffset;
              cardEl.style.transform = `translateY(calc(var(--r) * ${yOffset.toFixed(3)}))`;
              cardEl.style.opacity = p.toFixed(4);
            } else {
              cardEl.style.transform = 'none';
              cardEl.style.opacity = '1';
            }
          }
        });

        // 5. Revenue tilt sequence
        let tiltSettled = true;
        if (flags.pose !== 'flat' && revenueFace && revenuePlate) {
          const tiltStart = MOTION.tilt.delay * animScale;
          if (elapsed < tiltStart) {
            tiltSettled = false;
          } else {
            const tTilt = (elapsed - tiltStart) / animScale;
            if (tTilt < 0.65) {
              tiltSettled = false;
              const p = spring(tTilt);
              const rot = p * MOTION.tilt.target.rotate;
              const x = p * MOTION.tilt.target.x;
              const y = p * MOTION.tilt.target.y;
              revenueFace.style.transform = `translate(calc(var(--r) * ${x.toFixed(4)}), calc(var(--r) * ${y.toFixed(4)})) rotate(${rot.toFixed(4)}deg)`;
              revenueFace.style.zIndex = '20';
              revenueFace.style.boxShadow = REVENUE.COLORS.shadowTilted;

              const plateP = Math.min(1, tTilt / (MOTION.tilt.plateFadeDuration || 0.35));
              revenuePlate.style.opacity = plateP.toFixed(4);
            } else {
              revenueFace.style.transform = `translate(calc(var(--r) * ${MOTION.tilt.target.x}), calc(var(--r) * ${MOTION.tilt.target.y})) rotate(${MOTION.tilt.target.rotate}deg)`;
              revenueFace.style.zIndex = '20';
              revenueFace.style.boxShadow = REVENUE.COLORS.shadowTilted;
              revenuePlate.style.opacity = '1';
            }
          }
        }

        // Completion check
        const totalDuration = (flags.pose === 'flat' ? 1.95 : MOTION.tilt.delay + 0.65) * animScale;
        if (allCardsSettled && tiltSettled && elapsed >= totalDuration) {
          // Settled! Clean up transforms so subpixel text rendering is optimal
          Object.values(cardEls).forEach((cardEl) => {
            if (cardEl) {
              cardEl.style.transform = 'none';
              cardEl.style.opacity = '1';
            }
          });
          if (eyebrow) eyebrow.style.opacity = '1';
          words.forEach((w) => {
            w.style.opacity = '1';
          });
          if (subtext) subtext.style.opacity = '1';

          if (flags.pose !== 'flat' && revenueFace && revenuePlate) {
            revenueFace.style.transform = `translate(calc(var(--r) * ${MOTION.tilt.target.x}), calc(var(--r) * ${MOTION.tilt.target.y})) rotate(${MOTION.tilt.target.rotate}deg)`;
            revenueFace.style.zIndex = '20';
            revenueFace.style.boxShadow = REVENUE.COLORS.shadowTilted;
            revenuePlate.style.opacity = '1';
          }

          node.setAttribute('data-reveal-state', 'settled');
          setRevealState('settled');
          return;
        }

        rafIdRef.current = requestAnimationFrame(frame);
      }

      rafIdRef.current = requestAnimationFrame(frame);
    },
    [flags, sectionRef]
  );

  // Setup observer and window.__wwdReplay
  useEffect(() => {
    window.__wwdReplay = () => {
      startAnimation(true);
    };

    if (flags.isAnimOff) {
      sectionRef.current?.setAttribute('data-reveal-state', 'settled');
      return () => {
        delete window.__wwdReplay;
      };
    }

    const node = sectionRef.current;
    if (!node) return;

    if (flags.isReplay) {
      const frameId = requestAnimationFrame(() => startAnimation(true));
      return () => {
        delete window.__wwdReplay;
        cancelAnimationFrame(frameId);
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && (entry.isIntersecting || entry.intersectionRatio >= 0.3)) {
          observer.disconnect();
          startAnimation();
        }
      },
      { threshold: 0.3, rootMargin: '0px' }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      delete window.__wwdReplay;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [flags, startAnimation, sectionRef]);

  return {
    revealState,
    isSettled,
    isAnimOff: flags.isAnimOff,
    animScale: flags.animScale,
    pose: flags.pose,
    replay: () => startAnimation(true),
  };
}
