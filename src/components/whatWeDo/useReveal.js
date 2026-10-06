import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { MOTION, REVENUE, TOKENS, CONTENT } from './config';
import {
  EASE,
  SPRING,
  DUR,
  STAGGER,
  DIST,
  CARD_ENTRANCE,
  CARD_DELAYS,
  createCubicBezierSolver,
  createSpringSolver,
} from '../../motion/tokens.js';
import { getMotionFlags, getScrollSpeed } from '../../motion/useInViewReplay.js';

/**
 * useReveal hook:
 * Orchestrates the scroll-driven, replayable choreography for the "What We Do" section.
 * - Header group trigger: amount 0.6
 * - Grid group trigger: amount 0.35 or >= 60% vh, 120ms debounce, settle speed guard < 600px/s
 * - Single-column layout: per-card trigger (amount 0.35, margin -8% bottom, delay 0)
 * - Card entrance family: linear opacity 0.85s, EASE.out position, 0.96 -> 1 scale
 * - Revenue tilt sequence: flat initial pose, bouncy spring (14.6% overshoot) at later of T 1.35 and 70% visibility
 * - SVGs: pathLength line draw + left-to-right clipPath area reveal
 * - Tabular counters: $15,230, $3,405, 5.8k
 * - Reset on exit (400ms out-of-view delay) for clean replay
 */
export default function useReveal(sectionRef) {
  const flags = useMemo(() => getMotionFlags(), []);
  const [revealState, setRevealState] = useState(flags.isAnimOff ? 'settled' : 'pending');
  const isSettled = revealState === 'settled';

  const animScale = flags.animScale;
  const isAnimOff = flags.isAnimOff;

  const rafIdRef = useRef(null);
  const headerTriggeredRef = useRef(false);
  const gridTriggeredRef = useRef(false);
  const headerStartTimeRef = useRef(null);
  const gridStartTimeRef = useRef(null);
  const revenue70VisibleTimeRef = useRef(null);
  const singleCardTimesRef = useRef({});

  // Reset element styles to initial frame 0 state off-screen
  const resetToInitialState = useCallback(() => {
    const node = sectionRef.current;
    if (!node) return;

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    headerTriggeredRef.current = false;
    gridTriggeredRef.current = false;
    headerStartTimeRef.current = null;
    gridStartTimeRef.current = null;
    revenue70VisibleTimeRef.current = null;
    singleCardTimesRef.current = {};

    node.setAttribute('data-reveal-state', 'pending');
    setRevealState('pending');

    // Header elements
    const dot = node.querySelector('.wwd-eyebrow-dot');
    const label = node.querySelector('.wwd-eyebrow-text');
    const words = Array.from(node.querySelectorAll('.wwd-word'));
    const subtext = node.querySelector('[data-slot="subtext"]');

    if (dot) dot.style.transform = 'scale(0)';
    if (label) {
      label.style.opacity = '0';
      label.style.transform = `translateX(calc(var(--r) * ${MOTION.header.eyebrow.labelX}))`;
    }
    words.forEach((w) => {
      w.style.opacity = '0';
      w.style.transform = `translateY(calc(var(--r) * ${MOTION.header.words.yOffset}))`;
    });
    if (subtext) {
      subtext.style.opacity = '0';
      subtext.style.transform = `translateY(calc(var(--r) * ${MOTION.header.subtext.yOffset}))`;
    }

    // Card slots
    const slots = ['revenue', 'content', 'stat-a', 'stat-b', 'file', 'ai'];
    slots.forEach((s) => {
      const cardEl = node.querySelector(`[data-slot="${s}"]`);
      if (cardEl) {
        cardEl.style.opacity = '0';
        const off = CARD_ENTRANCE.offsets[s] || { x: 0, y: 28 };
        const tx = off.x ? `translateX(calc(var(--r) * ${off.x}))` : '';
        const ty = off.y ? `translateY(calc(var(--r) * ${off.y}))` : '';
        cardEl.style.transform = `${tx} ${ty} scale(${CARD_ENTRANCE.scaleFrom})`.trim();
      }
    });

    // Revenue Card
    const revenueFace = node.querySelector('[data-slot="revenue"] [data-part="face"]');
    const revenuePlate = node.querySelector('[data-slot="revenue"] [data-part="plate"]');
    const chartGhost = node.querySelector('[data-part="chart-ghost"]');
    const chartLine = node.querySelector('[data-part="chart-line"]');
    const chartClip = node.querySelector('[data-part="chart-area-clip"]');
    const chartMarker = node.querySelector('[data-part="chart-marker"]');
    const revNum = node.querySelector('[data-slot="revenue"] [data-part="number"]');
    const revTitle = node.querySelector('[data-slot="revenue"] [data-part="title"]');
    const revDesc = node.querySelector('[data-slot="revenue"] [data-part="description"]');

    if (revenueFace) {
      revenueFace.style.transform = 'translate(0px, 0px) rotate(0deg)';
      revenueFace.style.zIndex = '1';
      revenueFace.style.boxShadow = REVENUE.COLORS.shadowFlat;
    }
    if (revenuePlate) revenuePlate.style.opacity = '0';
    if (chartGhost) chartGhost.style.opacity = '0';
    if (chartLine) {
      chartLine.style.strokeDasharray = '1';
      chartLine.style.strokeDashoffset = '1';
    }
    if (chartClip) chartClip.setAttribute('width', '0');
    if (chartMarker) chartMarker.style.transform = 'scale(0)';
    if (revNum) revNum.textContent = '0.0k';
    if (revTitle) {
      revTitle.style.opacity = '0';
      revTitle.style.transform = 'translateY(calc(var(--r) * 8))';
    }
    if (revDesc) {
      revDesc.style.opacity = '0';
      revDesc.style.transform = 'translateY(calc(var(--r) * 8))';
    }

    // Stat Cards
    ['stat-a', 'stat-b'].forEach((s, idx) => {
      const valEl = node.querySelector(`[data-slot="${s}"] [data-part="stat-value"]`);
      const deltaEl = node.querySelector(`[data-slot="${s}"] [data-part="stat-delta"]`);
      const iconEl = node.querySelector(`[data-slot="${s}"] [data-part="stat-icon"]`);
      if (valEl) valEl.textContent = '$0';
      if (deltaEl) {
        deltaEl.style.opacity = '0';
        deltaEl.style.transform = 'translateY(calc(var(--r) * -8.5)) scale(0.5)';
      }
      if (iconEl) iconEl.style.transform = 'scale(0.6) rotate(-10deg)';
    });

    // File Card
    const fileIcon = node.querySelector('[data-slot="file"] [data-part="file-icon"]');
    const fileName = node.querySelector('[data-slot="file"] [data-part="file-name"]');
    const fileMeta = node.querySelector('[data-slot="file"] [data-part="file-meta"]');
    const fileBtn = node.querySelector('[data-slot="file"] [data-part="file-button"]');

    if (fileIcon) fileIcon.style.transform = 'scale(0.6) rotate(-8deg)';
    if (fileName) {
      fileName.style.opacity = '0';
      fileName.style.transform = 'translateY(calc(var(--r) * 6))';
    }
    if (fileMeta) {
      fileMeta.style.opacity = '0';
      fileMeta.style.transform = 'translateY(calc(var(--r) * 6))';
    }
    if (fileBtn) fileBtn.style.transform = 'scale(0.9)';

    // Content Card
    const tiles = Array.from(node.querySelectorAll('[data-slot="content"] .wwd-icon-tile'));
    tiles.forEach((t) => {
      t.style.opacity = '0';
      t.style.transform = 'scale(0.6) translateY(calc(var(--r) * 10))';
    });
    const contTitle = node.querySelector('[data-slot="content"] [data-part="title"]');
    const contDesc = node.querySelector('[data-slot="content"] [data-part="description"]');
    if (contTitle) {
      contTitle.style.opacity = '0';
      contTitle.style.transform = 'translateX(-50%) translateY(calc(var(--r) * 8))';
    }
    if (contDesc) {
      contDesc.style.opacity = '0';
      contDesc.style.transform = 'translateX(-50%) translateY(calc(var(--r) * 8))';
    }

    // AI Card
    const glow = node.querySelector('[data-slot="ai"] [data-part="glow-panel"]');
    const pill = node.querySelector('[data-slot="ai"] [data-part="input-mock input-pill"]');
    const spark = node.querySelector('[data-slot="ai"] [data-part="spark-tile"]');
    const caret = node.querySelector('[data-slot="ai"] [data-part="caret"]');
    const placeholder = node.querySelector('[data-slot="ai"] [data-part="placeholder"]');
    const aiTitle = node.querySelector('[data-slot="ai"] [data-part="title"]');
    const aiDesc = node.querySelector('[data-slot="ai"] [data-part="description"]');

    if (glow) {
      glow.style.opacity = '0';
      glow.style.transform = 'scale(0.94)';
    }
    if (pill) {
      pill.style.opacity = '0';
      pill.style.transform = 'translateY(calc(var(--r) * 10))';
    }
    if (spark) spark.style.transform = 'scale(0.6) rotate(-20deg)';
    if (caret) caret.style.opacity = '0';
    if (placeholder) placeholder.style.opacity = '0';
    if (aiTitle) {
      aiTitle.style.opacity = '0';
      aiTitle.style.transform = 'translateX(-50%) translateY(calc(var(--r) * 8))';
    }
    if (aiDesc) {
      aiDesc.style.opacity = '0';
      aiDesc.style.transform = 'translateX(-50%) translateY(calc(var(--r) * 8))';
    }
  }, [sectionRef]);

  // Jump to settled static state (pixel-identical to static page)
  const jumpToSettledState = useCallback(() => {
    const node = sectionRef.current;
    if (!node) return;

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    node.setAttribute('data-reveal-state', 'settled');
    setRevealState('settled');

    // Header
    const dot = node.querySelector('.wwd-eyebrow-dot');
    const label = node.querySelector('.wwd-eyebrow-text');
    const words = Array.from(node.querySelectorAll('.wwd-word'));
    const subtext = node.querySelector('[data-slot="subtext"]');

    if (dot) dot.style.transform = '';
    if (label) {
      label.style.opacity = '1';
      label.style.transform = '';
    }
    words.forEach((w) => {
      w.style.opacity = '1';
      w.style.transform = '';
    });
    if (subtext) {
      subtext.style.opacity = '1';
      subtext.style.transform = '';
    }

    // Cards
    const slots = ['revenue', 'content', 'stat-a', 'stat-b', 'file', 'ai'];
    slots.forEach((s) => {
      const cardEl = node.querySelector(`[data-slot="${s}"]`);
      if (cardEl) {
        cardEl.style.opacity = '1';
        cardEl.style.transform = 'none';
      }
    });

    // Revenue Card
    const revenueFace = node.querySelector('[data-slot="revenue"] [data-part="face"]');
    const revenuePlate = node.querySelector('[data-slot="revenue"] [data-part="plate"]');
    const chartGhost = node.querySelector('[data-part="chart-ghost"]');
    const chartLine = node.querySelector('[data-part="chart-line"]');
    const chartClip = node.querySelector('[data-part="chart-area-clip"]');
    const chartMarker = node.querySelector('[data-part="chart-marker"]');
    const revNum = node.querySelector('[data-slot="revenue"] [data-part="number"]');
    const revTitle = node.querySelector('[data-slot="revenue"] [data-part="title"]');
    const revDesc = node.querySelector('[data-slot="revenue"] [data-part="description"]');

    const shouldTilt = flags.pose !== 'flat';
    if (revenueFace) {
      if (shouldTilt) {
        revenueFace.style.transform = `translate(calc(var(--r) * ${REVENUE.POSE.tilted.x}), calc(var(--r) * ${REVENUE.POSE.tilted.y})) rotate(${REVENUE.POSE.tilted.rotate}deg)`;
        revenueFace.style.zIndex = '20';
        revenueFace.style.boxShadow = REVENUE.COLORS.shadowTilted;
      } else {
        revenueFace.style.transform = 'translate(0px, 0px) rotate(0deg)';
        revenueFace.style.zIndex = '1';
        revenueFace.style.boxShadow = REVENUE.COLORS.shadowFlat;
      }
    }
    if (revenuePlate) revenuePlate.style.opacity = shouldTilt ? '1' : '0';
    if (chartGhost) chartGhost.style.opacity = '1';
    if (chartLine) {
      chartLine.style.strokeDasharray = '';
      chartLine.style.strokeDashoffset = '';
    }
    if (chartClip) chartClip.setAttribute('width', '248.33');
    if (chartMarker) chartMarker.style.transform = '';
    if (revNum) revNum.textContent = CONTENT.revenue.value;
    if (revTitle) {
      revTitle.style.opacity = '1';
      revTitle.style.transform = '';
    }
    if (revDesc) {
      revDesc.style.opacity = '1';
      revDesc.style.transform = '';
    }

    // Stat Cards
    ['stat-a', 'stat-b'].forEach((s, idx) => {
      const valEl = node.querySelector(`[data-slot="${s}"] [data-part="stat-value"]`);
      const deltaEl = node.querySelector(`[data-slot="${s}"] [data-part="stat-delta"]`);
      const iconEl = node.querySelector(`[data-slot="${s}"] [data-part="stat-icon"]`);
      if (valEl) valEl.textContent = CONTENT.stats[idx].value;
      if (deltaEl) {
        deltaEl.style.opacity = '1';
        deltaEl.style.transform = 'translateY(calc(var(--r) * -8.5))';
      }
      if (iconEl) iconEl.style.transform = '';
    });

    // File Card
    const fileIcon = node.querySelector('[data-slot="file"] [data-part="file-icon"]');
    const fileName = node.querySelector('[data-slot="file"] [data-part="file-name"]');
    const fileMeta = node.querySelector('[data-slot="file"] [data-part="file-meta"]');
    const fileBtn = node.querySelector('[data-slot="file"] [data-part="file-button"]');

    if (fileIcon) fileIcon.style.transform = '';
    if (fileName) {
      fileName.style.opacity = '1';
      fileName.style.transform = '';
    }
    if (fileMeta) {
      fileMeta.style.opacity = '1';
      fileMeta.style.transform = '';
    }
    if (fileBtn) fileBtn.style.transform = '';

    // Content Card
    const tiles = Array.from(node.querySelectorAll('[data-slot="content"] .wwd-icon-tile'));
    tiles.forEach((t) => {
      t.style.opacity = '1';
      t.style.transform = '';
    });
    const contTitle = node.querySelector('[data-slot="content"] [data-part="title"]');
    const contDesc = node.querySelector('[data-slot="content"] [data-part="description"]');
    if (contTitle) {
      contTitle.style.opacity = '1';
      contTitle.style.transform = 'translateX(-50%)';
    }
    if (contDesc) {
      contDesc.style.opacity = '1';
      contDesc.style.transform = 'translateX(-50%)';
    }

    // AI Card
    const glow = node.querySelector('[data-slot="ai"] [data-part="glow-panel"]');
    const pill = node.querySelector('[data-slot="ai"] [data-part="input-mock input-pill"]');
    const spark = node.querySelector('[data-slot="ai"] [data-part="spark-tile"]');
    const caret = node.querySelector('[data-slot="ai"] [data-part="caret"]');
    const placeholder = node.querySelector('[data-slot="ai"] [data-part="placeholder"]');
    const aiTitle = node.querySelector('[data-slot="ai"] [data-part="title"]');
    const aiDesc = node.querySelector('[data-slot="ai"] [data-part="description"]');

    if (glow) {
      glow.style.opacity = '1';
      glow.style.transform = '';
    }
    if (pill) {
      pill.style.opacity = '1';
      pill.style.transform = '';
    }
    if (spark) spark.style.transform = '';
    if (caret) caret.style.opacity = '1';
    if (placeholder) placeholder.style.opacity = '1';
    if (aiTitle) {
      aiTitle.style.opacity = '1';
      aiTitle.style.transform = 'translateX(-50%)';
    }
    if (aiDesc) {
      aiDesc.style.opacity = '1';
      aiDesc.style.transform = 'translateX(-50%)';
    }
  }, [sectionRef, flags.pose]);

  // Main animation runner
  const startChoreography = useCallback(
    (forceAll = false) => {
      const node = sectionRef.current;
      if (!node) return;

      if (isAnimOff && !forceAll) {
        jumpToSettledState();
        return;
      }

      node.setAttribute('data-reveal-state', 'animating');
      setRevealState('animating');

      // Solvers
      const easeOut = createCubicBezierSolver(EASE.out[0], EASE.out[1], EASE.out[2], EASE.out[3]);
      const easeInOut = createCubicBezierSolver(EASE.inOut[0], EASE.inOut[1], EASE.inOut[2], EASE.inOut[3]);
      const springPop = createSpringSolver(SPRING.pop.stiffness, SPRING.pop.damping, SPRING.pop.mass);
      const springSoft = createSpringSolver(SPRING.soft.stiffness, SPRING.soft.damping, SPRING.soft.mass);
      const springBouncy = createSpringSolver(SPRING.bouncy.stiffness, SPRING.bouncy.damping, SPRING.bouncy.mass);

      // Elements
      const dot = node.querySelector('.wwd-eyebrow-dot');
      const label = node.querySelector('.wwd-eyebrow-text');
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
      const chartGhost = cardEls.revenue?.querySelector('[data-part="chart-ghost"]');
      const chartLine = cardEls.revenue?.querySelector('[data-part="chart-line"]');
      const chartClip = cardEls.revenue?.querySelector('[data-part="chart-area-clip"]');
      const chartMarker = cardEls.revenue?.querySelector('[data-part="chart-marker"]');
      const revNum = cardEls.revenue?.querySelector('[data-part="number"]');
      const revTitle = cardEls.revenue?.querySelector('[data-part="title"]');
      const revDesc = cardEls.revenue?.querySelector('[data-part="description"]');

      const statAVal = cardEls['stat-a']?.querySelector('[data-part="stat-value"]');
      const statADelta = cardEls['stat-a']?.querySelector('[data-part="stat-delta"]');
      const statAIcon = cardEls['stat-a']?.querySelector('[data-part="stat-icon"]');

      const statBVal = cardEls['stat-b']?.querySelector('[data-part="stat-value"]');
      const statBDelta = cardEls['stat-b']?.querySelector('[data-part="stat-delta"]');
      const statBIcon = cardEls['stat-b']?.querySelector('[data-part="stat-icon"]');

      const fileIcon = cardEls.file?.querySelector('[data-part="file-icon"]');
      const fileName = cardEls.file?.querySelector('[data-part="file-name"]');
      const fileMeta = cardEls.file?.querySelector('[data-part="file-meta"]');
      const fileBtn = cardEls.file?.querySelector('[data-part="file-button"]');

      const contentTiles = Array.from(cardEls.content?.querySelectorAll('.wwd-icon-tile') || []);
      const contentTitle = cardEls.content?.querySelector('[data-part="title"]');
      const contentDesc = cardEls.content?.querySelector('[data-part="description"]');

      const aiGlow = cardEls.ai?.querySelector('[data-part="glow-panel"]');
      const aiPill = cardEls.ai?.querySelector('[data-part="input-mock input-pill"]');
      const aiSpark = cardEls.ai?.querySelector('[data-part="spark-tile"]');
      const aiCaret = cardEls.ai?.querySelector('[data-part="caret"]');
      const aiPlaceholder = cardEls.ai?.querySelector('[data-part="placeholder"]');
      const aiTitle = cardEls.ai?.querySelector('[data-part="title"]');
      const aiDesc = cardEls.ai?.querySelector('[data-part="description"]');

      // Detect layout column count (multi-column vs single-column)
      const slots = Object.keys(cardEls);
      const leftPositions = new Set();
      slots.forEach((s) => {
        const el = cardEls[s];
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.width > 0) leftPositions.add(Math.round(rect.left));
        }
      });
      const isMultiColumn = leftPositions.size >= 2;

      const baseNow = performance.now();
      if (headerTriggeredRef.current && !headerStartTimeRef.current) {
        headerStartTimeRef.current = baseNow;
      }
      if (gridTriggeredRef.current && !gridStartTimeRef.current) {
        gridStartTimeRef.current = baseNow;
      }
      if (forceAll) {
        headerStartTimeRef.current = baseNow;
        gridStartTimeRef.current = baseNow;
      }

      function frame() {
        const now = performance.now();

        // 1. Header Animation (T relative to header trigger)
        if (headerStartTimeRef.current) {
          const elapsed = (now - headerStartTimeRef.current) / 1000 / animScale;

          // Eyebrow dot
          if (dot) {
            const p = springPop(elapsed);
            dot.style.transform = `scale(${Math.max(0, p).toFixed(4)})`;
          }

          // Eyebrow label (delay 0.1, duration 0.5)
          if (label) {
            const d = 0.1;
            const dur = DUR.base;
            if (elapsed >= d) {
              const p = Math.min(1, (elapsed - d) / dur);
              label.style.opacity = p.toFixed(4);
              const xOff = (1 - easeOut(p)) * MOTION.header.eyebrow.labelX;
              label.style.transform = `translateX(calc(var(--r) * ${xOff.toFixed(3)}))`;
            }
          }

          // Headline words (baseDelay 0.15, stagger 0.08, duration 0.7)
          words.forEach((w, i) => {
            const d = 0.15 + i * STAGGER.word;
            const dur = 0.7;
            if (elapsed >= d) {
              const p = Math.min(1, (elapsed - d) / dur);
              w.style.opacity = p.toFixed(4);
              const yOff = (1 - easeOut(p)) * MOTION.header.words.yOffset;
              w.style.transform = `translateY(calc(var(--r) * ${yOff.toFixed(3)}))`;
            }
          });

          // Subtext (delay 0.55, duration 0.5)
          if (subtext) {
            const d = 0.55;
            const dur = DUR.base;
            if (elapsed >= d) {
              const p = Math.min(1, (elapsed - d) / dur);
              subtext.style.opacity = p.toFixed(4);
              const yOff = (1 - easeOut(p)) * MOTION.header.subtext.yOffset;
              subtext.style.transform = `translateY(calc(var(--r) * ${yOff.toFixed(3)}))`;
            }
          }
        }

        // 2. Cards Animation (T relative to grid trigger or card trigger)
        if (gridStartTimeRef.current || (!isMultiColumn && Object.keys(singleCardTimesRef.current).length > 0)) {
          const gridBase = gridStartTimeRef.current || baseNow;

          // Check if revenue slot is >= 70% visible
          if (cardEls.revenue) {
            const rRect = cardEls.revenue.getBoundingClientRect();
            const vh = window.innerHeight || 800;
            const top = Math.max(0, rRect.top);
            const bottom = Math.min(vh, rRect.bottom);
            const visH = Math.max(0, bottom - top);
            const visFrac = rRect.height > 0 ? visH / rRect.height : 0;
            if (visFrac >= 0.7 && !revenue70VisibleTimeRef.current) {
              revenue70VisibleTimeRef.current = now;
            }
          }

          let allSettled = true;

          // Card Entrance Stagger
          slots.forEach((s) => {
            const cardEl = cardEls[s];
            if (!cardEl) return;

            let cardStartT = isMultiColumn ? gridStartTimeRef.current : singleCardTimesRef.current[s];
            if (!cardStartT) {
              allSettled = false;
              return;
            }
            const delay = isMultiColumn ? (CARD_DELAYS.multiColumn[s] || 0) : 0;
            const cardElapsed = (now - cardStartT) / 1000 / animScale - delay;

            if (cardElapsed < 0) {
              allSettled = false;
              return;
            }

            const opDur = CARD_ENTRANCE.opacityDuration; // 0.85s linear
            const posDur = CARD_ENTRANCE.posDuration;    // 0.85s easeOut
            const scDur = CARD_ENTRANCE.scaleDuration;   // 0.90s easeOut

            const opProgress = Math.min(1, cardElapsed / opDur);
            const posProgress = Math.min(1, cardElapsed / posDur);
            const scProgress = Math.min(1, cardElapsed / scDur);

            if (cardElapsed < Math.max(opDur, posDur, scDur)) {
              allSettled = false;
              cardEl.style.opacity = opProgress.toFixed(4);

              const off = CARD_ENTRANCE.offsets[s] || { x: 0, y: 28 };
              const curX = (1 - easeOut(posProgress)) * off.x;
              const curY = (1 - easeOut(posProgress)) * off.y;
              const curSc = CARD_ENTRANCE.scaleFrom + (1 - CARD_ENTRANCE.scaleFrom) * easeOut(scProgress);

              const tx = curX !== 0 ? `translateX(calc(var(--r) * ${curX.toFixed(3)}))` : '';
              const ty = curY !== 0 ? `translateY(calc(var(--r) * ${curY.toFixed(3)}))` : '';
              cardEl.style.transform = `${tx} ${ty} scale(${curSc.toFixed(4)})`.trim();
            } else {
              // Entrance completed: remove inline transform so text rendering is clean
              cardEl.style.opacity = '1';
              cardEl.style.transform = 'none';
            }

            // --- REVENUE CARD CHOREOGRAPHY ---
            if (s === 'revenue') {
              // Ghost line (T 0.35, duration 0.5)
              if (chartGhost && cardElapsed >= 0.35) {
                const p = Math.min(1, (cardElapsed - 0.35) / DUR.base);
                chartGhost.style.opacity = p.toFixed(4);
              }

              // Main chart line + Area clip (T 0.35, duration 1.2, easeInOut)
              if (chartLine && cardElapsed >= 0.35) {
                const p = Math.min(1, (cardElapsed - 0.35) / 1.2);
                const drawP = easeInOut(p);
                chartLine.style.strokeDasharray = '1';
                chartLine.style.strokeDashoffset = (1 - drawP).toFixed(4);

                if (chartClip) {
                  const clipW = (drawP * 248.33).toFixed(2);
                  chartClip.setAttribute('width', clipW);
                }
              }

              // Revenue counter (0.0 to 5.8 over 1.2s, easeOut)
              if (revNum && cardElapsed >= 0.35) {
                const p = Math.min(1, (cardElapsed - 0.35) / 1.2);
                const val = (easeOut(p) * 5.8).toFixed(1);
                revNum.textContent = `${val}k`;
              }

              // Title & Description (T 0.50 and 0.65, rise 8)
              if (revTitle && cardElapsed >= 0.5) {
                const p = Math.min(1, (cardElapsed - 0.5) / DUR.base);
                revTitle.style.opacity = p.toFixed(4);
                const yOff = (1 - easeOut(p)) * 8;
                revTitle.style.transform = `translateY(calc(var(--r) * ${yOff.toFixed(3)}))`;
              }
              if (revDesc && cardElapsed >= 0.65) {
                const p = Math.min(1, (cardElapsed - 0.65) / DUR.base);
                revDesc.style.opacity = p.toFixed(4);
                const yOff = (1 - easeOut(p)) * 8;
                revDesc.style.transform = `translateY(calc(var(--r) * ${yOff.toFixed(3)}))`;
              }

              // Marker dot pop (T 1.45, springPop, scale 0 to 1.6 to 1)
              if (chartMarker && cardElapsed >= 1.45) {
                const p = springPop(cardElapsed - 1.45);
                chartMarker.style.transformOrigin = `${REVENUE.CHART.marker.cx}px ${REVENUE.CHART.marker.cy}px`;
                chartMarker.style.transform = `scale(${Math.max(0, p).toFixed(4)})`;
              }

              // REVENUE TILT SEQUENCE
              // Starts at the LATER of (T 1.35) and (when revenue slot >= 70% visible)
              let tiltAllowed = false;
              let tiltStartTimestamp = cardStartT + 1.35 * 1000 * animScale;
              if (revenue70VisibleTimeRef.current) {
                tiltStartTimestamp = Math.max(tiltStartTimestamp, revenue70VisibleTimeRef.current);
              }

              if (now >= tiltStartTimestamp && flags.pose !== 'flat') {
                tiltAllowed = true;
              }

              if (tiltAllowed && revenueFace && revenuePlate) {
                const tTilt = (now - tiltStartTimestamp) / 1000 / animScale;
                const p = springBouncy(tTilt);
                const rot = (p * REVENUE.POSE.tilted.rotate).toFixed(4);
                const x = (p * REVENUE.POSE.tilted.x).toFixed(4);
                const y = (p * REVENUE.POSE.tilted.y).toFixed(4);

                revenueFace.style.transform = `translate(calc(var(--r) * ${x}), calc(var(--r) * ${y})) rotate(${rot}deg)`;
                revenueFace.style.zIndex = '20';
                revenueFace.style.boxShadow = REVENUE.COLORS.shadowTilted;

                const plateP = Math.min(1, tTilt / (MOTION.revenue.tilt.plateFadeDuration || 0.25));
                revenuePlate.style.opacity = plateP.toFixed(4);

                // Settled check for tilt (> 1.1s and within +/-1%)
                if (tTilt >= 1.1) {
                  revenueFace.style.transform = `translate(calc(var(--r) * ${REVENUE.POSE.tilted.x}), calc(var(--r) * ${REVENUE.POSE.tilted.y})) rotate(${REVENUE.POSE.tilted.rotate}deg)`;
                  revenuePlate.style.opacity = '1';
                } else {
                  allSettled = false;
                }
              } else if (!tiltAllowed) {
                allSettled = false;
              }
            }

            // --- STAT CARDS CHOREOGRAPHY ---
            if (s === 'stat-a' || s === 'stat-b') {
              const isA = s === 'stat-a';
              const valEl = isA ? statAVal : statBVal;
              const deltaEl = isA ? statADelta : statBDelta;
              const iconEl = isA ? statAIcon : statBIcon;
              const targetNum = isA ? 15230 : 3405;

              // Counter (+0.25 to +1.25, 1.0s easeOut)
              if (valEl && cardElapsed >= 0.25) {
                const p = Math.min(1, (cardElapsed - 0.25) / 1.0);
                const cur = Math.round(easeOut(p) * targetNum);
                valEl.textContent = `$${cur.toLocaleString('en-US')}`;
              }

              // Delta badge pop (at +1.25)
              if (deltaEl && cardElapsed >= 1.25) {
                const p = springPop(cardElapsed - 1.25);
                deltaEl.style.opacity = Math.min(1, Math.max(0, p)).toFixed(4);
                deltaEl.style.transform = `translateY(calc(var(--r) * -8.5)) scale(${Math.max(0.5, p).toFixed(4)})`;
              }

              // Icon tile pop (at +0.15, scale 0.6 to 1, rotate -10 to 0)
              if (iconEl && cardElapsed >= 0.15) {
                const p = springPop(cardElapsed - 0.15);
                const rot = (1 - Math.min(1, p)) * -10;
                iconEl.style.transform = `scale(${Math.max(0.6, p).toFixed(4)}) rotate(${rot.toFixed(3)}deg)`;
              }
            }

            // --- FILE CARD CHOREOGRAPHY ---
            if (s === 'file') {
              // Icon tile pop (+0.20, scale 0.6 to 1, rotate -8 to 0)
              if (fileIcon && cardElapsed >= 0.2) {
                const p = springPop(cardElapsed - 0.2);
                const rot = (1 - Math.min(1, p)) * -8;
                fileIcon.style.transform = `scale(${Math.max(0.6, p).toFixed(4)}) rotate(${rot.toFixed(3)}deg)`;
              }

              // File name (+0.30, rise 6)
              if (fileName && cardElapsed >= 0.3) {
                const p = Math.min(1, (cardElapsed - 0.3) / DUR.base);
                fileName.style.opacity = p.toFixed(4);
                const yOff = (1 - easeOut(p)) * 6;
                fileName.style.transform = `translateY(calc(var(--r) * ${yOff.toFixed(3)}))`;
              }

              // File meta size (+0.36, rise 6)
              if (fileMeta && cardElapsed >= 0.36) {
                const p = Math.min(1, (cardElapsed - 0.36) / DUR.base);
                fileMeta.style.opacity = p.toFixed(4);
                const yOff = (1 - easeOut(p)) * 6;
                fileMeta.style.transform = `translateY(calc(var(--r) * ${yOff.toFixed(3)}))`;
              }

              // Preview button pop (+0.50, scale 0.9 to 1)
              if (fileBtn && cardElapsed >= 0.5) {
                const p = springPop(cardElapsed - 0.5);
                fileBtn.style.transform = `scale(${Math.max(0.9, p).toFixed(4)})`;
              }
            }

            // --- CONTENT CARD CHOREOGRAPHY ---
            if (s === 'content') {
              // Tiles ordered by distance from center: [3, 2, 4, 1, 5, 0, 6]
              // Row 1: 0..6; Row 2: 7..13 (+0.12s)
              const distOrder = [3, 2, 4, 1, 5, 0, 6];
              contentTiles.forEach((tileEl, idx) => {
                const isRow2 = idx >= 7;
                const colIdx = idx % 7;
                const distRank = distOrder.indexOf(colIdx);
                const delay = (isRow2 ? 0.12 : 0) + distRank * STAGGER.tile;

                if (cardElapsed >= delay) {
                  const p = springPop(cardElapsed - delay);
                  tileEl.style.opacity = Math.min(1, Math.max(0, p)).toFixed(4);
                  const yOff = (1 - Math.min(1, p)) * 10;
                  tileEl.style.transform = `scale(${Math.max(0.6, p).toFixed(4)}) translateY(calc(var(--r) * ${yOff.toFixed(3)}))`;
                }
              });

              // Title and description (+0.70 and +0.85, rise 8)
              if (contentTitle && cardElapsed >= 0.7) {
                const p = Math.min(1, (cardElapsed - 0.7) / DUR.base);
                contentTitle.style.opacity = p.toFixed(4);
                const yOff = (1 - easeOut(p)) * 8;
                contentTitle.style.transform = `translateX(-50%) translateY(calc(var(--r) * ${yOff.toFixed(3)}))`;
              }
              if (contentDesc && cardElapsed >= 0.85) {
                const p = Math.min(1, (cardElapsed - 0.85) / DUR.base);
                contentDesc.style.opacity = p.toFixed(4);
                const yOff = (1 - easeOut(p)) * 8;
                contentDesc.style.transform = `translateX(-50%) translateY(calc(var(--r) * ${yOff.toFixed(3)}))`;
              }
            }

            // --- AI CARD CHOREOGRAPHY ---
            if (s === 'ai') {
              // Glow panel (+0.15, scale 0.94 to 1, springSoft)
              if (aiGlow && cardElapsed >= 0.15) {
                const p = springSoft(cardElapsed - 0.15);
                aiGlow.style.opacity = Math.min(1, Math.max(0, p)).toFixed(4);
                const sc = 0.94 + (1 - 0.94) * Math.min(1, p);
                aiGlow.style.transform = `scale(${sc.toFixed(4)})`;
              }

              // Pill (+0.40, y 10 to 0)
              if (aiPill && cardElapsed >= 0.4) {
                const p = Math.min(1, (cardElapsed - 0.4) / DUR.base);
                aiPill.style.opacity = p.toFixed(4);
                const yOff = (1 - easeOut(p)) * 10;
                aiPill.style.transform = `translateY(calc(var(--r) * ${yOff.toFixed(3)}))`;
              }

              // Sparkle tile (+0.50, scale 0.6 to 1, rotate -20 to 0)
              if (aiSpark && cardElapsed >= 0.5) {
                const p = springPop(cardElapsed - 0.5);
                const rot = (1 - Math.min(1, p)) * -20;
                aiSpark.style.transform = `scale(${Math.max(0.6, p).toFixed(4)}) rotate(${rot.toFixed(3)}deg)`;
              }

              // Caret and placeholder (+0.70)
              if (cardElapsed >= 0.7) {
                if (aiCaret) aiCaret.style.opacity = '1';
                if (aiPlaceholder) aiPlaceholder.style.opacity = '1';
              }

              // Title and description (+0.80 and +0.95, rise 8)
              if (aiTitle && cardElapsed >= 0.8) {
                const p = Math.min(1, (cardElapsed - 0.8) / DUR.base);
                aiTitle.style.opacity = p.toFixed(4);
                const yOff = (1 - easeOut(p)) * 8;
                aiTitle.style.transform = `translateX(-50%) translateY(calc(var(--r) * ${yOff.toFixed(3)}))`;
              }
              if (aiDesc && cardElapsed >= 0.95) {
                const p = Math.min(1, (cardElapsed - 0.95) / DUR.base);
                aiDesc.style.opacity = p.toFixed(4);
                const yOff = (1 - easeOut(p)) * 8;
                aiDesc.style.transform = `translateX(-50%) translateY(calc(var(--r) * ${yOff.toFixed(3)}))`;
              }
            }
          });

          // Check total completion: header settled + all cards settled
          const totalHeaderElapsed = headerStartTimeRef.current ? (now - headerStartTimeRef.current) / 1000 / animScale : 0;
          const totalGridElapsed = gridStartTimeRef.current ? (now - gridStartTimeRef.current) / 1000 / animScale : 0;
          const totalDuration = (flags.pose === 'flat' ? 2.2 : 2.8) * animScale;

          if (allSettled && totalHeaderElapsed >= 1.2 && totalGridElapsed >= totalDuration) {
            jumpToSettledState();
            return;
          }
        }

        rafIdRef.current = requestAnimationFrame(frame);
      }

      rafIdRef.current = requestAnimationFrame(frame);
    },
    [sectionRef, flags.pose, isAnimOff, animScale, jumpToSettledState]
  );

  // Setup Scroll-Driven Observers & Triggers
  useEffect(() => {
    if (import.meta.env.DEV) {
      window.__wwdReplay = () => {
        resetToInitialState();
        requestAnimationFrame(() => {
          headerTriggeredRef.current = true;
          gridTriggeredRef.current = true;
          startChoreography(true);
        });
      };
    }

    const node = sectionRef.current;
    if (!node) return;

    if (flags.isAnimOff) {
      jumpToSettledState();
      return () => {
        if (import.meta.env.DEV) delete window.__wwdReplay;
      };
    }

    if (flags.isReplay) {
      resetToInitialState();
      const frameId = requestAnimationFrame(() => {
        headerTriggeredRef.current = true;
        gridTriggeredRef.current = true;
        startChoreography(true);
      });
      return () => {
        cancelAnimationFrame(frameId);
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        if (import.meta.env.DEV) delete window.__wwdReplay;
      };
    }

    // Initialize frame 0 states
    resetToInitialState();

    // Safety fallback: Missing IntersectionObserver
    if (typeof window.IntersectionObserver === 'undefined') {
      jumpToSettledState();
      return () => {
        if (import.meta.env.DEV) delete window.__wwdReplay;
      };
    }

    const headerNode = node.querySelector('.wwd-header');
    const gridNode = node.querySelector('.wwd-grid-wrapper') || node.querySelector('.wwd-grid');

    let headerDebounceTimer = null;
    let gridDebounceTimer = null;
    let sectionOutTimer = null;

    // Header in-view observer: amount 0.6, 120ms debounce
    const headerObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          if (!headerTriggeredRef.current && !headerDebounceTimer) {
            headerDebounceTimer = setTimeout(() => {
              headerDebounceTimer = null;
              headerTriggeredRef.current = true;
              headerStartTimeRef.current = performance.now();
              startChoreography();
            }, 120);
          }
        } else {
          if (headerDebounceTimer) {
            clearTimeout(headerDebounceTimer);
            headerDebounceTimer = null;
          }
        }
      },
      { threshold: [0, 0.3, 0.6, 1.0], rootMargin: '0px' }
    );

    if (headerNode) headerObserver.observe(headerNode);

    // Grid in-view observer: amount 0.35 OR visible height >= 60% vh, 120ms debounce, settle guard < 600px/s
    const gridObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        const vh = window.innerHeight || 800;
        const rect = entry.boundingClientRect;
        const top = Math.max(0, rect.top);
        const bottom = Math.min(vh, rect.bottom);
        const visH = Math.max(0, bottom - top);
        const isCoverageMet = visH >= 0.6 * vh;
        const isRatioMet = entry.intersectionRatio >= 0.35;

        if (entry.isIntersecting && (isRatioMet || isCoverageMet)) {
          if (!gridTriggeredRef.current && !gridDebounceTimer) {
            gridDebounceTimer = setTimeout(() => {
              gridDebounceTimer = null;
              // Settle speed guard: check if scroll speed < 600 px/s
              const checkSettle = () => {
                const speed = getScrollSpeed();
                if (speed < 600) {
                  gridTriggeredRef.current = true;
                  gridStartTimeRef.current = performance.now();
                  startChoreography();
                } else {
                  setTimeout(checkSettle, 50);
                }
              };
              checkSettle();
            }, 120);
          }
        } else {
          if (gridDebounceTimer) {
            clearTimeout(gridDebounceTimer);
            gridDebounceTimer = null;
          }
        }
      },
      { threshold: [0, 0.1, 0.2, 0.35, 0.5, 0.6, 0.8, 1.0], rootMargin: '0px' }
    );

    if (gridNode) gridObserver.observe(gridNode);

    // Single-column individual card observer: amount 0.35, margin -8% bottom
    const cardObservers = [];
    const cardSlots = ['revenue', 'content', 'stat-a', 'stat-b', 'file', 'ai'];
    cardSlots.forEach((s) => {
      const cardEl = node.querySelector(`[data-slot="${s}"]`);
      if (!cardEl) return;

      const co = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;

          // Check if currently in single-column mode
          const rect = cardEl.getBoundingClientRect();
          const pRect = gridNode ? gridNode.getBoundingClientRect() : rect;
          const isSingleCol = Math.abs(rect.width - pRect.width) < 50;

          if (isSingleCol && entry.isIntersecting && entry.intersectionRatio >= 0.35) {
            if (!singleCardTimesRef.current[s]) {
              singleCardTimesRef.current[s] = performance.now();
              if (!gridTriggeredRef.current) {
                gridTriggeredRef.current = true;
                gridStartTimeRef.current = performance.now();
              }
              startChoreography();
            }
          }
        },
        { threshold: [0, 0.35, 0.7, 1.0], rootMargin: '0px 0px -8% 0px' }
      );
      co.observe(cardEl);
      cardObservers.push(co);
    });

    // Whole section OUT observer (for replay on re-entry): intersectionRatio 0 for >= 400ms
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        if (entry.intersectionRatio === 0) {
          if (!sectionOutTimer) {
            sectionOutTimer = setTimeout(() => {
              sectionOutTimer = null;
              const r = node.getBoundingClientRect();
              const vh = window.innerHeight || 800;
              const isOffscreen = r.bottom <= 0 || r.top >= vh;
              if (isOffscreen && MOTION.REPLAY === 'reenter') {
                resetToInitialState();
              }
            }, 400);
          }
        } else {
          if (sectionOutTimer) {
            clearTimeout(sectionOutTimer);
            sectionOutTimer = null;
          }
        }
      },
      { threshold: [0, 0.05], rootMargin: '0px' }
    );

    sectionObserver.observe(node);

    // 4-second safety timeout
    const safetyTimeout = setTimeout(() => {
      if (node.getAttribute('data-reveal-state') !== 'settled') {
        jumpToSettledState();
      }
    }, 4000);

    // Beforeprint handler
    const handleBeforePrint = () => {
      jumpToSettledState();
    };
    window.addEventListener('beforeprint', handleBeforePrint);

    // Visibility change handler
    const handleVisibilityChange = () => {
      if (!document.hidden && node.getAttribute('data-reveal-state') !== 'settled') {
        const r = node.getBoundingClientRect();
        const vh = window.innerHeight || 800;
        if (r.top < vh && r.bottom > 0) {
          jumpToSettledState();
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
          jumpToSettledState();
        }
      };
      mql.addEventListener?.('change', handleMotionChange);
    }

    return () => {
      headerObserver.disconnect();
      gridObserver.disconnect();
      cardObservers.forEach((co) => co.disconnect());
      sectionObserver.disconnect();
      if (headerDebounceTimer) clearTimeout(headerDebounceTimer);
      if (gridDebounceTimer) clearTimeout(gridDebounceTimer);
      if (sectionOutTimer) clearTimeout(sectionOutTimer);
      clearTimeout(safetyTimeout);
      window.removeEventListener('beforeprint', handleBeforePrint);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (import.meta.env.DEV) delete window.__wwdReplay;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [flags, resetToInitialState, jumpToSettledState, startChoreography, sectionRef]);

  return {
    revealState,
    isSettled,
    isAnimOff: flags.isAnimOff,
    animScale: flags.animScale,
    pose: flags.pose,
    replay: () => {
      resetToInitialState();
      requestAnimationFrame(() => {
        headerTriggeredRef.current = true;
        gridTriggeredRef.current = true;
        startChoreography(true);
      });
    },
  };
}
