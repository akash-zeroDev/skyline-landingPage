/**
 * Unified Motion Token Language for Skyline Digital Media.
 * Calibrated against Hero animation vocabulary and analytical spring specifications.
 * All translations are unit-free ref-px rendered via calc(var(--r) * N).
 */

// 1. Easing curves
export const EASE = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
  linear: [0, 0, 1, 1],
};

// 2. Physics-based springs (mass = 1)
// - bouncy: 14.64% overshoot, first peak at 0.274s, settled within +/-1% by 0.655s (< 1.1s), undershoot 2.14% (< 4%)
export const SPRING = {
  soft: { stiffness: 120, damping: 20, mass: 1 },
  snappy: { stiffness: 300, damping: 26, mass: 1 },
  pop: { stiffness: 420, damping: 16, mass: 1 },
  bouncy: { stiffness: 180, damping: 14, mass: 1 },
};

// 3. Durations (seconds)
export const DUR = {
  fast: 0.25,
  base: 0.5,
  slow: 0.9,
};

// 4. Stagger intervals (seconds)
export const STAGGER = {
  word: 0.08,
  tile: 0.045,
  line: 0.06,
};

// 5. Reference distances (unit-free ref-px, rendered as calc(var(--r) * N))
export const DIST = {
  rise: 28,
  slide: 24,
  small: 10,
};

// 6. Card entrance initial offsets and timings (unit-free ref-px)
export const CARD_ENTRANCE = {
  opacityDuration: 0.85, // linear opacity over 0.85s
  posDuration: 0.85,     // position EASE.out over 0.85s
  scaleDuration: 0.90,   // scale 0.96 to 1 over 0.90s
  scaleFrom: 0.96,
  offsets: {
    revenue: { x: 0, y: 28 },
    content: { x: 0, y: 28 },
    'stat-a': { x: -16, y: 20 },
    'stat-b': { x: 16, y: 20 },
    file: { x: 24, y: 0 },
    ai: { x: 0, y: 28 },
  },
};

// 7. Card entrance delays (seconds from group trigger)
export const CARD_DELAYS = {
  multiColumn: {
    revenue: 0,
    content: 0.25,
    'stat-a': 0.37,
    file: 0.37,
    'stat-b': 0.57,
    ai: 0.67,
  },
  singleColumn: {
    revenue: 0,
    content: 0,
    'stat-a': 0,
    file: 0,
    'stat-b': 0,
    ai: 0,
  },
};

// 8. Default replay behavior: 'reenter' (resets off-screen) or 'once'
export const REPLAY = 'reenter';

/**
 * Analytical cubic bezier solver for cubic-bezier(x1, y1, x2, y2).
 * Uses Newton-Raphson iteration with robust fallbacks.
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
 * Analytical spring solver for mass-spring-damper:
 * m * x'' + c * x' + k * (x - 1) = 0 with x(0) = 0, x'(0) = 0.
 */
export function createSpringSolver(k = 180, c = 14, m = 1) {
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
