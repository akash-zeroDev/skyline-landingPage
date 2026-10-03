import React, { useState } from 'react';
import WalletSlot from './WalletSlot';
import UiUxCard from './UiUxCard';
import SeoCard from './SeoCard';
import BrandingCard from './BrandingCard';
import AppCard from './AppCard';
import WebCard from './WebCard';
import SocialMediaCard from './SocialMediaCard';
import FloatingCursor from './FloatingCursor';
import HeroAccents from './HeroAccents';
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
          {/* Central Wallet Slot Frame (z-index: 5, behind all cards) */}
          <WalletSlot key={`slot-${animationKey}`} />

          {/* Fanned-out Service Cards */}
          <UiUxCard key={`uiux-${animationKey}`} />
          <SeoCard key={`seo-${animationKey}`} />
          <BrandingCard key={`branding-${animationKey}`} />
          <AppCard key={`app-${animationKey}`} />
          <WebCard key={`web-${animationKey}`} />
          <SocialMediaCard key={`social-${animationKey}`} />

          {/* Floating 3D Cursor (z-index: 100, above all cards) */}
          <FloatingCursor key={`cursor-${animationKey}`} />

          {/* Floating 3D Accents (Toggle, Bolt, Fingerprint, Lock) */}
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
