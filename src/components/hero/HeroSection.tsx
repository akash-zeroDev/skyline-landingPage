import React, { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion, MotionConfig } from 'framer-motion';
import WalletSlot from './WalletSlot';
import UiUxCard from './UiUxCard';
import SeoCard from './SeoCard';
import BrandingCard from './BrandingCard';
import AppCard from './AppCard';
import WebCard from './WebCard';
import SocialMediaCard from './SocialMediaCard';
import FloatingCursor from './FloatingCursor';
import ToggleAccent from './ToggleAccent';
import HeroAccents from './HeroAccents';
import headlinePathsData from '../../data/headlinePaths.json';
import { STUDIO_PROOF } from '../../data/studioProof';
import { TRAY_CLIP_LINE_PCT } from './cardLayout';
import './HeroSection.css';

const INK = '#161616';
const ACCENT = '#111A5C'; // the color the third line already uses (Let's Talk indigo)
const HEADLINE_FONT_STACK = 'Anton, "Bebas Neue", Impact, sans-serif';

const HEADLINE = {
  fontSize: 128, // viewBox units
  capHeight: 108, // target cap height, used by debug guides only
  lines: [
    { text: 'One click', x: 520, baseline: 360, width: 458.5, color: INK },
    { text: 'closer to', x: 960, baseline: 563, width: 446.9, color: INK },
    { text: 'growth', x: 520, baseline: 766, width: 357.6, color: ACCENT },
  ],
} as const;

const HEADLINE_ANIM = {
  startDelay: 0.25,      // s, after mount
  glyphStagger: 0.05,    // s between letters, reading order, spaces skipped, across all 3 lines
  strokeWidth: 2.5,      // viewBox units
  drawDuration: 0.5,
  fillLag: 0.35,         // fill starts this long after a letter starts drawing
  fillDuration: 0.35,
  strokeFadeDuration: 0.25,
  drawEase: [0.65, 0, 0.35, 1] as [number, number, number, number],
  subtextDelay: 1.5,
  subtextDuration: 0.6,
};

function computeHeadlineHash(fontSize: number, lines: readonly { text: string; x: number; baseline: number }[]) {
  const str = `${fontSize}:` + lines.map(l => `${l.text}|${l.x}|${l.baseline}`).join(';');
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16);
}

// Desktop-only modest tightening (~15%): lines 2 and 3 are pulled up so the
// headline reads as one block. The toggle and cursor are nudged in cardLayout
// to keep their clearances. Baselines become 360 / 533 / 706 (pitch 173).
const DESKTOP_LINE_DY = [0, -30, -60] as const;

// Mobile-only artboard: the 1536x1024 stage becomes a portrait 3:5 canvas.
// Each headline line is re-anchored with an SVG group transform so the same
// glyph paths and Framer Motion tweens are reused (positions only change).
const MOBILE_MEDIA_QUERY = '(max-width: 767.98px)';
// Tight portrait artboard around the three glyphs, re-stacked on a 0.95
// line-height (121.6u pitch) and centred on a 457.3u content width. The
// horizontal breathing room (107.7u each side) makes 17vw ≈ 128u * 0.498 at
// a 375px viewport, i.e. the clamp(3.25rem, 17vw, 5.5rem) mobile type scale.
const MOBILE_HEADLINE_VIEWBOX = '-107.7 -4 672.7 377.45';
const MOBILE_LINE_TRANSFORMS = [
  { tx: -524, ty: -241.88 },
  { tx: -955.445, ty: -331.4 },
  { tx: -470.12, ty: -412.8 },
] as const;

const DEBUG_GUIDES = false;

export const HeroSection: React.FC = () => {
  const [animationKey, setAnimationKey] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [fontsReady, setFontsReady] = useState(false);
  const [isMobileLayout, setIsMobileLayout] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia(MOBILE_MEDIA_QUERY).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_MEDIA_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobileLayout(event.matches);
    };
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  // URL params for dev inspection
  const [devConfig] = useState(() => {
    if (typeof window === 'undefined') {
      return { headlineRender: 'paths', animOff: false, animScale: 1 };
    }
    const sp = new URLSearchParams(window.location.search);
    return {
      headlineRender: sp.get('headlineRender') || 'paths',
      animOff: sp.get('anim') === 'off' || sp.has('instant'),
      animScale: Math.max(0.01, parseFloat(sp.get('animScale') || '1') || 1),
    };
  });

  const currentHash = computeHeadlineHash(HEADLINE.fontSize, HEADLINE.lines);
  const isDataValid = Boolean(headlinePathsData && headlinePathsData.sourceHash === currentHash);

  useEffect(() => {
    if (import.meta.env.DEV && !isDataValid) {
      console.warn(
        `[HeroSection] headlinePaths.json data is missing or stale (expected hash ${currentHash}, got ${headlinePathsData?.sourceHash}). Falling back to text render.`
      );
    }
  }, [isDataValid, currentHash]);

  const useTextRender = (import.meta.env.DEV && devConfig.headlineRender === 'text') || !isDataValid;

  const [strokesDone, setStrokesDone] = useState(
    devConfig.animOff || Boolean(reduceMotion)
  );

  const handleReplay = () => {
    setAnimationKey((prev) => prev + 1);
    setStrokesDone(devConfig.animOff || Boolean(reduceMotion));
  };

  // The dev replay control (bottom-right) also replays the hero entrance.
  useEffect(() => {
    const onReplay = () => {
      setAnimationKey((prev) => prev + 1);
      setStrokesDone(devConfig.animOff || Boolean(reduceMotion));
    };
    window.addEventListener('skyline:replay', onReplay);
    return () => window.removeEventListener('skyline:replay', onReplay);
  }, [devConfig.animOff, reduceMotion]);

  // --u = stageWidth / 1536 (unitless), used by the subtext only.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => {
      el.style.setProperty('--u', (el.clientWidth / 1536).toString());
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Start the headline animation after fonts load so there is no font flash (for text fallback).
  useEffect(() => {
    let cancelled = false;
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) setFontsReady(true);
      });
    } else {
      setFontsReady(true);
    }
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (DEBUG_GUIDES && typeof window !== 'undefined' && fontsReady) {
      const texts = document.querySelectorAll('.hero-headline svg text');
      if (texts.length === 3) {
        console.table(
          HEADLINE.lines.map((l, i) => ({
            line: l.text,
            configWidth: l.width,
            naturalWidth: (texts[i] as SVGTextElement).getComputedTextLength(),
          }))
        );
      }
    }
  }, [fontsReady]);

  // Pre-calculate reading order glyph indices across lines
  let runningGlyphIndex = 0;
  const totalGlyphsCount = headlinePathsData?.lines
    ? headlinePathsData.lines.reduce((acc, l) => acc + l.glyphs.length, 0)
    : 22;

  return (
    <MotionConfig reducedMotion="user">
    <section className="hero-section" id="hero" aria-label="Hero Section">
      <div className="hero-container">
        {/* Eyebrow pill — sits in the empty band above the headline */}
        <div className="hero-eyebrow">
          <motion.div
            key={`hero-eyebrow-${animationKey}`}
            className="hero-eyebrow-pill"
            initial={{
              opacity: devConfig.animOff ? 1 : 0,
              y: devConfig.animOff || reduceMotion ? 0 : 12,
            }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              devConfig.animOff
                ? { duration: 0 }
                : reduceMotion
                ? { duration: 0.3 }
                : { delay: 0.15, duration: 0.55, ease: [0.16, 1, 0.3, 1] }
            }
          >
            <span>Digital agency for ambitious brands</span>
          </motion.div>
        </div>

        {/* Wallet Container where the service cards fan out from inside the slot */}
        <div
          className="hero-wallet-stage"
          ref={stageRef}
          style={{ ['--u' as string]: 1 }}
        >
          {/* Headline SVG layer: BEHIND every element (z 0 < shadow 2 < back 5 < cards/tray/cursor/toggle/tiles) */}
          <h1
            aria-label="One click closer to growth"
            className="hero-headline"
            style={{ position: 'absolute', inset: 0, margin: 0, zIndex: 0 }}
          >
            <svg
              key={`headline-svg-${animationKey}-${isMobileLayout ? 'mobile' : 'desktop'}`}
              aria-hidden="true"
              viewBox={isMobileLayout ? MOBILE_HEADLINE_VIEWBOX : '0 0 1536 1024'}
              preserveAspectRatio="xMidYMid meet"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                overflow: 'visible',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              {useTextRender ? (
                // Fallback text rendering
                HEADLINE.lines.map((line, i) => (
                  <motion.g
                    key={line.text}
                    transform={
                      isMobileLayout
                        ? `translate(${MOBILE_LINE_TRANSFORMS[i].tx} ${MOBILE_LINE_TRANSFORMS[i].ty})`
                        : `translate(0 ${DESKTOP_LINE_DY[i] ?? 0})`
                    }
                    initial={{ opacity: devConfig.animOff ? 1 : 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: devConfig.animOff ? 0 : 0.5,
                      delay: devConfig.animOff ? 0 : (reduceMotion ? 0 : i * 0.12),
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <text
                      data-headline-line={i}
                      x={line.x}
                      y={line.baseline}
                      textAnchor="start"
                      dominantBaseline="alphabetic"
                      fill={line.color}
                      style={{
                        fontFamily: HEADLINE_FONT_STACK,
                        fontWeight: 400,
                        fontSize: HEADLINE.fontSize,
                        letterSpacing: '-0.01em',
                        textTransform: 'none',
                      }}
                    >
                      {line.text}
                    </text>
                  </motion.g>
                ))
              ) : (
                // Outline-to-fill path rendering
                headlinePathsData.lines.map((lineData, lineIdx) => {
                  const lineColor = HEADLINE.lines[lineIdx].color;
                  return (
                    <g
                      key={`headline-line-${lineIdx}`}
                      data-headline-line={lineIdx}
                      transform={
                        isMobileLayout
                          ? `translate(${MOBILE_LINE_TRANSFORMS[lineIdx].tx} ${MOBILE_LINE_TRANSFORMS[lineIdx].ty})`
                          : `translate(0 ${DESKTOP_LINE_DY[lineIdx] ?? 0})`
                      }
                    >
                      {lineData.glyphs.map((glyph, glyphIdx) => {
                        const glyphOrderIdx = runningGlyphIndex++;
                        const isLastContourOfLastGlyph = glyphOrderIdx === totalGlyphsCount - 1;

                        const t0 =
                          (HEADLINE_ANIM.startDelay + glyphOrderIdx * HEADLINE_ANIM.glyphStagger) *
                          devConfig.animScale;
                        const drawDur = HEADLINE_ANIM.drawDuration * devConfig.animScale;
                        const fillLag = HEADLINE_ANIM.fillLag * devConfig.animScale;
                        const fillDur = HEADLINE_ANIM.fillDuration * devConfig.animScale;
                        const strokeFadeDur = HEADLINE_ANIM.strokeFadeDuration * devConfig.animScale;
                        const totalStrokeLife = fillLag + fillDur + strokeFadeDur;

                        return (
                          <g key={`glyph-${glyphOrderIdx}-${glyph.char}`}>
                            {/* FILL LAYER */}
                            <motion.path
                              d={glyph.fill}
                              fill={lineColor}
                              stroke="none"
                              initial={{ opacity: (devConfig.animOff || reduceMotion) ? 1 : 0 }}
                              animate={{ opacity: 1 }}
                              transition={
                                (devConfig.animOff || reduceMotion)
                                  ? { duration: reduceMotion ? 0.3 : 0 }
                                  : {
                                      delay: t0 + fillLag,
                                      duration: fillDur,
                                      ease: 'easeOut',
                                    }
                              }
                            />

                            {/* STROKE LAYER (unmounted once strokesDone is true) */}
                            {!strokesDone &&
                              glyph.contours.map((contourD, contourIdx) => {
                                const isFinalContour =
                                  isLastContourOfLastGlyph && contourIdx === glyph.contours.length - 1;
                                return (
                                  <motion.path
                                    key={`contour-${contourIdx}`}
                                    d={contourD}
                                    fill="none"
                                    stroke={lineColor}
                                    strokeWidth={HEADLINE_ANIM.strokeWidth}
                                    strokeLinecap="butt"
                                    strokeLinejoin="round"
                                    initial={{ pathLength: 0, opacity: 0 }}
                                    animate={{
                                      pathLength: 1,
                                      opacity: [0, 1, 1, 0],
                                    }}
                                    transition={{
                                      pathLength: {
                                        delay: t0,
                                        duration: drawDur,
                                        ease: HEADLINE_ANIM.drawEase,
                                      },
                                      opacity: {
                                        delay: t0,
                                        duration: totalStrokeLife,
                                        times: [
                                          0,
                                          Math.min(0.06 * devConfig.animScale, fillLag) / totalStrokeLife,
                                          (fillLag + fillDur) / totalStrokeLife,
                                          1,
                                        ],
                                        ease: 'linear',
                                      },
                                    }}
                                    {...(isFinalContour
                                      ? { onAnimationComplete: () => setStrokesDone(true) }
                                      : {})}
                                  />
                                );
                              })}
                          </g>
                        );
                      })}
                    </g>
                  );
                })
              )}
              {DEBUG_GUIDES &&
                HEADLINE.lines.map((line) => (
                  <g key={`guides-${line.text}`} opacity={0.7}>
                    <line
                      x1={line.x}
                      x2={line.x + line.width}
                      y1={line.baseline}
                      y2={line.baseline}
                      stroke="red"
                      strokeWidth={1}
                    />
                    <line
                      x1={line.x}
                      x2={line.x + line.width}
                      y1={line.baseline - HEADLINE.capHeight}
                      y2={line.baseline - HEADLINE.capHeight}
                      stroke="blue"
                      strokeWidth={1}
                    />
                    <line
                      x1={line.x}
                      x2={line.x}
                      y1={line.baseline - HEADLINE.capHeight}
                      y2={line.baseline}
                      stroke="green"
                      strokeWidth={1}
                    />
                    <line
                      x1={line.x + line.width}
                      x2={line.x + line.width}
                      y1={line.baseline - HEADLINE.capHeight}
                      y2={line.baseline}
                      stroke="green"
                      strokeWidth={1}
                    />
                  </g>
                ))}
            </svg>
          </h1>

          {/* Desktop: display:contents, so every layer keeps resolving against
              the wallet stage. Mobile: a real full-bleed portrait scene. */}
          <div className="hero-art">
            {/* L0: Tray Drop Shadow (z-index: 2, unclipped, below cards) */}
            <WalletSlot key={`slot-shadow-${animationKey}`} variant="shadow" />

            {/* L1: Cards Layer Wrapper with clip-path at front lip middle */}
            <div
              className="hero-cards-layer"
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                clipPath: `inset(0 0 calc(100% - ${TRAY_CLIP_LINE_PCT}%) 0)`,
              }}
            >
              {/* Back Tray Frame (z-index: 5, behind all cards) */}
              <WalletSlot key={`slot-back-${animationKey}`} variant="back" />

              {/* Fanned-out Service Cards */}
              <UiUxCard key={`uiux-${animationKey}`} />
              <SeoCard key={`seo-${animationKey}`} />
              <BrandingCard key={`branding-${animationKey}`} />
              <AppCard key={`app-${animationKey}`} />
              <WebCard key={`web-${animationKey}`} />
              <SocialMediaCard key={`social-${animationKey}`} />
            </div>

            {/* L2: Front Lip (z-index: 60, in front of cards layer) */}
            <WalletSlot key={`slot-front-${animationKey}`} variant="front" />

            {/* L3: Floating 3D Cursor (z-index: 100, above all cards & front lip) */}
            <FloatingCursor key={`cursor-${animationKey}`} />

            {/* L4: Floating 3D Green Toggle Switch (z-index: 65) */}
            <ToggleAccent key={`toggle-${animationKey}`} />

            {/* Floating 3D Accents Icon Cluster (Bolt, Fingerprint, Lock) */}
            <HeroAccents animationKey={animationKey} />
          </div>
        </div>

        {/* Bottom band: subtext, CTAs, proof strip — over the empty lower band */}
        <div className="hero-bottom">
          <motion.p
            key={`subtext-${animationKey}`}
            className="hero-subtext"
            initial={{
              opacity: devConfig.animOff ? 1 : 0,
              y: devConfig.animOff || reduceMotion ? 0 : 16,
            }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              devConfig.animOff
                ? { duration: 0 }
                : reduceMotion
                ? { duration: 0.3 }
                : { delay: 0.95, duration: 0.55, ease: [0.16, 1, 0.3, 1] }
            }
          >
            Websites, apps and brands for education, fintech, hospitality and
            B2B teams — designed to turn attention into customers.
          </motion.p>

          <motion.div
            key={`hero-cta-${animationKey}`}
            className="hero-cta-row"
            initial={{
              opacity: devConfig.animOff ? 1 : 0,
              y: devConfig.animOff || reduceMotion ? 0 : 16,
            }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              devConfig.animOff
                ? { duration: 0 }
                : reduceMotion
                ? { duration: 0.3 }
                : { delay: 1.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] }
            }
          >
            <a className="hero-cta hero-cta--primary" href="#contact">
              <span>Start your project</span>
              <svg
                className="hero-cta-arrow"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 10h11M10.5 5l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a className="hero-cta hero-cta--ghost" href="#work">
              View our work
            </a>
          </motion.div>

          <motion.ul
            key={`hero-proof-${animationKey}`}
            className="hero-proof"
            aria-label="Studio results"
            initial={{
              opacity: devConfig.animOff ? 1 : 0,
              y: devConfig.animOff || reduceMotion ? 0 : 14,
            }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              devConfig.animOff
                ? { duration: 0 }
                : reduceMotion
                ? { duration: 0.3 }
                : { delay: 1.25, duration: 0.55, ease: [0.16, 1, 0.3, 1] }
            }
          >
            {STUDIO_PROOF.map((item) => (
              <li key={item.label} className="hero-proof-item">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Interactive controller to re-trigger the animation */}
        <div className="hero-animation-controls">
          <button
            type="button"
            className="hero-replay-btn"
            onClick={handleReplay}
            aria-label="Replay card entrance animation"
          >
            <span>Replay Animation</span>
            <span aria-hidden="true" className="replay-icon">↺</span>
          </button>
        </div>
      </div>
    </section>
    </MotionConfig>
  );
};

export default HeroSection;
