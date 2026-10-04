import React, { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
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

const SUBTEXT_TOP = HEADLINE.lines[2].baseline + 52;

const DEBUG_GUIDES = true;

export const HeroSection: React.FC = () => {
  const [animationKey, setAnimationKey] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [fontsReady, setFontsReady] = useState(false);

  const handleReplay = () => {
    setAnimationKey((prev) => prev + 1);
  };

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

  // Start the headline animation after fonts load so there is no font flash.
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

  return (
    <section className="hero-section" id="hero" aria-label="Hero Section">
      <div className="hero-container">
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
              aria-hidden="true"
              viewBox="0 0 1536 1024"
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
              {HEADLINE.lines.map((line, i) => (
                <motion.g
                  key={line.text}
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 24 }}
                  animate={fontsReady ? { opacity: 1, y: 0 } : { opacity: 0, y: reduceMotion ? 0 : 24 }}
                  transition={{
                    duration: reduceMotion ? 0.01 : 0.7,
                    delay: i * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <text
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
              ))}
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

          {/* Subtext: same layering rule (behind everything else) */}
          <p
            className="hero-subtext"
            style={{
              position: 'absolute',
              left: '50%',
              top: `${(SUBTEXT_TOP / 1024) * 100}%`,
              transform: 'translateX(-50%)',
              width: '30.6%',
              margin: 0,
              padding: 0,
              textAlign: 'center',
              fontFamily: 'var(--font-primary)',
              fontWeight: 400,
              fontSize: 'calc(var(--u) * 19px)',
              lineHeight: 'calc(var(--u) * 30px)',
              color: '#555',
              textWrap: 'balance',
              zIndex: 0,
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            Designed for modern experiences that feel seamless from the first
            click to final confirmation.
          </p>

          {/* L0: Tray Drop Shadow (z-index: 2, unclipped, below cards) */}
          <WalletSlot key={`slot-shadow-${animationKey}`} variant="shadow" />

          {/* L1: Cards Layer Wrapper with clip-path at front lip middle */}
          <div
            className="hero-cards-layer"
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
  );
};

export default HeroSection;
