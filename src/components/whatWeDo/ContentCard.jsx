import React, { useMemo } from 'react';
import { CONTENT, CONTENT_CARD, TYPE } from './config';
import IconRow from './IconRow';

/**
 * ContentCard: Tall central slot "content" (Chunk 4 of 7).
 * Renders two cyclic icon strips (tool strip), headline title, and balanced description.
 */
export default function ContentCard({ className = '', style = {}, ...rest }) {
  const isProbe = useMemo(() => {
    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      return sp.get('probe') === '1';
    }
    return false;
  }, []);

  const { title: titleGeo, description: descGeo, rows } = CONTENT_CARD.GEOMETRY;

  return (
    <article
      data-slot="content"
      aria-labelledby="wwd-content-title"
      className={`wwd-card wwd-card-content ${className}`}
      style={{
        position: 'relative',
        background: isProbe ? '#ffffff' : 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'calc(var(--r) * var(--card-radius))',
        boxShadow: 'var(--card-shadow)',
        boxSizing: 'border-box',
        overflow: 'hidden',
        height: 'calc(var(--r) * 269)',
        zIndex: 1, // stays below revenue card's tilted face (z-index 20)
        ...style,
      }}
      {...rest}
    >
      <style>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      `}</style>

      {/* 1. Icon Rows Layer (decorative, aria-hidden) */}
      <div
        data-part="icon-rows"
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: 'calc(var(--r) * 137)',
          overflow: 'hidden',
        }}
      >
        <IconRow row={rows[0]} probeMode={isProbe} />
        <IconRow row={rows[1]} probeMode={isProbe} />
      </div>

      {/* 2. Title */}
      <h3
        id="wwd-content-title"
        data-part="title"
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          top: `calc(var(--r) * ${titleGeo.top})`,
          margin: 0,
          padding: 0,
          fontSize: `calc(var(--r) * ${TYPE.cardTitle})`,
          lineHeight: `calc(var(--r) * ${titleGeo.lineHeight})`,
          fontWeight: titleGeo.fontWeight,
          color: CONTENT_CARD.COLORS.title,
          letterSpacing: titleGeo.letterSpacing,
          whiteSpace: 'nowrap',
          textAlign: 'center',
        }}
      >
        {CONTENT.content.title}
      </h3>

      {/* 3. Description (4 balanced lines matching reference) */}
      <p
        data-part="description"
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          top: `calc(var(--r) * ${descGeo.top})`,
          width: `calc(var(--r) * ${descGeo.blockWidth})`,
          margin: 0,
          padding: 0,
          fontSize: `calc(var(--r) * ${TYPE.cardDescription})`,
          lineHeight: `calc(var(--r) * ${descGeo.linePitch})`,
          fontWeight: descGeo.fontWeight,
          color: CONTENT_CARD.COLORS.description,
          textAlign: 'center',
          letterSpacing: descGeo.letterSpacing,
        }}
      >
        <span style={{ display: 'block', whiteSpace: 'nowrap' }}>
          From engaging social media visuals and
        </span>
        <span style={{ display: 'block', whiteSpace: 'nowrap' }}>
          interactive ads to stunning landing pages, we
        </span>
        <span style={{ display: 'block', whiteSpace: 'nowrap' }}>
          help brands capture attention and stand out in
        </span>
        <span style={{ display: 'block', whiteSpace: 'nowrap' }}>
          the ever-changing digital landscape.
        </span>
      </p>

      {/* 4. Visually hidden tools utility for accessibility */}
      <p className="sr-only">
        Tools we work with: Figma, Photoshop, Webflow, TikTok, Instagram, PowerPoint.
      </p>
    </article>
  );
}
