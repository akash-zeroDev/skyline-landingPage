import React, { useState } from 'react';
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

export const HeroSection: React.FC = () => {
  const [animationKey, setAnimationKey] = useState(0);

  const handleReplay = () => {
    setAnimationKey((prev) => prev + 1);
  };

  return (
    <section className="hero-section" id="hero" aria-label="Hero Section">
      <div className="hero-container">
        {/* Wallet Container where the service cards fan out from inside the slot */}
        <div className="hero-wallet-stage">
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
