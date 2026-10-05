import React from 'react';
import { AI_CARD, CONTENT, TOKENS } from './config';
import { SparkleIcon } from './icons';

/**
 * AICard: Slot "ai" for the "What We Do" bento grid (Chunk 5).
 * Static render featuring:
 * - Ambient glow panel with blue-to-green gradient, radial glow ellipses, and blurred swirl
 * - Frosted input mock pill with sparkle tile, static caret, and placeholder
 * - Primary title ("Stay Ahead with AI")
 * - 4-line description with balanced wrap and dedicated tagline
 */
export default function AICard({ className = '', style = {}, ...rest }) {
  const { panel, pill, sparkleTile, caret, placeholder, title, description, colors } = AI_CARD;

  return (
    <article
      data-slot="ai"
      aria-labelledby="wwd-ai-title"
      className={`wwd-card wwd-card-ai ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: 'calc(var(--r) * 194)',
        background: 'var(--card-bg, #ffffff)',
        border: '1px solid var(--card-border, rgba(17, 26, 92, 0.08))',
        borderRadius: `calc(var(--r) * ${AI_CARD.cardBorderRadius})`,
        boxShadow: 'var(--card-shadow, 0 1px 2px rgba(17, 26, 92, 0.04))',
        boxSizing: 'border-box',
        flexShrink: 0,
        overflow: 'hidden',
        ...style,
      }}
      {...rest}
    >
      {/* 1. Ambient Glow Panel */}
      <div
        data-part="glow-panel"
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: `calc(var(--r) * ${panel.cardLeft})`,
          top: `calc(var(--r) * ${panel.cardTop})`,
          width: `calc(var(--r) * ${panel.width})`,
          height: `calc(var(--r) * ${panel.height})`,
          borderRadius: `calc(var(--r) * ${panel.radius})`,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #02121f 0%, #041f33 22%, #063147 42%, #0a5260 68%, #149580 100%)',
          boxShadow: colors.shadow,
          boxSizing: 'border-box',
        }}
      >
        {/* Glow Layer 1: Bottom-Right Mint & Green Glow */}
        <div
          data-part="glow-layer"
          style={{
            position: 'absolute',
            left: '38%',
            bottom: '-40%',
            width: '58%',
            height: '115%',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, #3fe0b5 0%, #19b954 35%, rgba(20, 160, 140, 0.4) 65%, transparent 80%)',
            filter: 'blur(calc(var(--r) * 10))',
            opacity: 0.95,
            pointerEvents: 'none',
          }}
        />

        {/* Glow Layer 1b: Right-edge subtle vignette for natural reference falloff */}
        <div
          data-part="glow-layer"
          style={{
            position: 'absolute',
            right: '-10%',
            bottom: '-25%',
            width: '28%',
            height: '80%',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(2, 14, 24, 0.75) 0%, transparent 80%)',
            filter: 'blur(calc(var(--r) * 6))',
            pointerEvents: 'none',
          }}
        />

        {/* Glow Layer 2: Curved highlight swirl curving from top-center down to right */}
        <div
          data-part="glow-layer"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 220 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: '100%', display: 'block' }}
          >
            <path
              d="M 135 -10 C 150 15, 180 25, 208 55"
              stroke="#ffffff"
              strokeWidth="18"
              strokeLinecap="round"
              fill="none"
              style={{
                filter: 'blur(calc(var(--r) * 6))',
                opacity: 0.20,
              }}
            />
          </svg>
        </div>

        {/* Glow Layer 3: Dark backdrop behind pill left side to guarantee WCAG >= 4.5:1 contrast */}
        <div
          data-part="glow-layer"
          style={{
            position: 'absolute',
            left: '8%',
            top: '18%',
            width: '50%',
            height: '60%',
            borderRadius: 'calc(var(--r) * 10)',
            background: 'radial-gradient(ellipse at center, rgba(2, 14, 24, 0.75) 0%, rgba(2, 14, 24, 0.45) 60%, transparent 100%)',
            filter: 'blur(calc(var(--r) * 4))',
            pointerEvents: 'none',
          }}
        />

        {/* Glow Layer 4: Lower-Left Dark Vignette (keeps row 3 col 0 dark as in reference) */}
        <div
          data-part="glow-layer"
          style={{
            position: 'absolute',
            left: '-15%',
            bottom: '-25%',
            width: '45%',
            height: '90%',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(2, 12, 22, 0.95) 0%, rgba(3, 20, 34, 0.8) 50%, transparent 80%)',
            filter: 'blur(calc(var(--r) * 6))',
            pointerEvents: 'none',
          }}
        />

        {/* Glow Layer 5: Top-Left Dark Vignette */}
        <div
          data-part="glow-layer"
          style={{
            position: 'absolute',
            left: '-10%',
            top: '-25%',
            width: '40%',
            height: '80%',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(2, 14, 24, 0.92) 0%, transparent 80%)',
            filter: 'blur(calc(var(--r) * 6))',
            pointerEvents: 'none',
          }}
        />

        {/* 2. Frosted Input Mock Pill */}
        <div
          data-part="input-mock"
          style={{
            position: 'absolute',
            left: `calc(var(--r) * ${pill.panelLeft})`,
            top: `calc(var(--r) * ${pill.panelTop})`,
            width: `calc(var(--r) * ${pill.width})`,
            height: `calc(var(--r) * ${pill.height})`,
            borderRadius: `calc(var(--r) * ${pill.radius})`,
            background: colors.pillBg,
            border: `1px solid ${colors.pillBorder}`,
            boxSizing: 'border-box',
            zIndex: 2,
          }}
        >
          {/* Sparkle Tile */}
          <span
            data-part="spark-tile"
            style={{
              position: 'absolute',
              left: `calc(var(--r) * ${sparkleTile.pillLeft})`,
              top: `calc(var(--r) * ${sparkleTile.pillTop})`,
              width: `calc(var(--r) * ${sparkleTile.size})`,
              height: `calc(var(--r) * ${sparkleTile.size})`,
              borderRadius: `calc(var(--r) * ${sparkleTile.radius})`,
              background: colors.sparkleTileBg,
              border: `1px solid ${colors.sparkleTileBorder}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
              padding: 'calc(var(--r) * 1)',
            }}
          >
            <SparkleIcon />
          </span>

          {/* Static Caret */}
          <span
            data-part="caret"
            style={{
              position: 'absolute',
              left: `calc(var(--r) * ${caret.pillLeft})`,
              top: `calc(var(--r) * ${caret.pillTop})`,
              width: `calc(var(--r) * ${caret.width})`,
              height: `calc(var(--r) * ${caret.height})`,
              backgroundColor: colors.caret,
              borderRadius: 'calc(var(--r) * 0.5)',
              display: 'block',
            }}
          />

          {/* Placeholder Text */}
          <span
            data-part="placeholder"
            style={{
              position: 'absolute',
              left: `calc(var(--r) * ${placeholder.pillLeft})`,
              top: `calc(var(--r) * ${placeholder.top})`,
              fontSize: `calc(var(--r) * ${placeholder.fontSize})`,
              lineHeight: `calc(var(--r) * ${placeholder.lineHeight})`,
              fontWeight: placeholder.fontWeight,
              letterSpacing: placeholder.letterSpacing || 'normal',
              color: colors.placeholder,
              whiteSpace: 'nowrap',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              userSelect: 'none',
            }}
          >
            {CONTENT.ai.placeholder}
          </span>
        </div>
      </div>

      {/* 3. Card Title */}
      <h3
        id="wwd-ai-title"
        data-part="title"
        style={{
          position: 'absolute',
          left: '50%',
          top: `calc(var(--r) * ${title.top})`,
          transform: 'translateX(-50%)',
          width: `calc(var(--r) * ${title.width})`,
          margin: 0,
          padding: 0,
          fontSize: `calc(var(--r) * ${title.fontSize})`,
          lineHeight: `calc(var(--r) * ${title.lineHeight})`,
          fontWeight: title.fontWeight,
          letterSpacing: title.letterSpacing,
          color: TOKENS.text1,
          textAlign: 'center',
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
        }}
      >
        {CONTENT.ai.title}
      </h3>

      {/* 4. Card Description & Dedicated Tagline */}
      <p
        data-part="description"
        style={{
          position: 'absolute',
          left: '50%',
          top: `calc(var(--r) * ${description.top})`,
          transform: 'translateX(-50%)',
          width: `calc(var(--r) * ${description.blockWidth})`,
          margin: 0,
          padding: 0,
          fontSize: `calc(var(--r) * ${description.fontSize})`,
          lineHeight: `calc(var(--r) * ${description.linePitch})`,
          color: TOKENS.text2,
          textAlign: 'center',
          fontWeight: description.fontWeight,
          letterSpacing: description.letterSpacing,
          textWrap: 'balance',
          boxSizing: 'border-box',
        }}
      >
        <span style={{ display: 'block', whiteSpace: 'nowrap' }}>With advanced AI insights, we optimize every</span>
        <span style={{ display: 'block', whiteSpace: 'nowrap' }}>touchpoint, from ad performance to detailed</span>
        <span style={{ display: 'block', whiteSpace: 'nowrap' }}>customer behavior analytics.</span>
        <span data-part="tagline" style={{ display: 'block', whiteSpace: 'nowrap' }}>{CONTENT.ai.tagline}</span>
      </p>
    </article>
  );
}
