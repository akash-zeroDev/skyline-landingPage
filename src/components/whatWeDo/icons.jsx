import React, { useId } from 'react';

/**
 * Inline SVG icons for WhatWeDo Chunk 3:
 * - GoogleAdsIcon: White tile with subtle border & shadow, simplified Google Ads geometric "A" mark.
 * - InstagramIcon: Diagonal gradient tile with subtle shadow, white camera glyph.
 * - PdfFileIcon: Hero orange diagonal gradient tile with sheen, white document outline with fold and minus line.
 */

export function GoogleAdsIcon({ size = 22.75, className = '', style = {} }) {
  return (
    <div
      style={{
        width: `calc(var(--r) * ${size})`,
        height: `calc(var(--r) * ${size})`,
        borderRadius: 'calc(var(--r) * 5)',
        backgroundColor: '#ffffff',
        border: '1px solid rgba(26, 15, 92, 0.10)',
        boxShadow: '0 1px 2px rgba(26, 15, 92, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        flexShrink: 0,
        ...style,
      }}
      className={className}
      aria-hidden="true"
    >
      <svg
        width="76%"
        height="76%"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        {/* Blue bar leaning right */}
        <line
          x1="6.8"
          y1="14.8"
          x2="13.2"
          y2="3.8"
          stroke="#4285F4"
          strokeWidth="3.6"
          strokeLinecap="round"
        />
        {/* Yellow bar leaning left */}
        <line
          x1="13.2"
          y1="14.8"
          x2="6.8"
          y2="3.8"
          stroke="#FBBC04"
          strokeWidth="3.6"
          strokeLinecap="round"
        />
        {/* Green dot at lower left */}
        <circle cx="6.8" cy="14.8" r="1.8" fill="#34A853" />
      </svg>
    </div>
  );
}

export function InstagramIcon({ size = 22.75, className = '', style = {} }) {
  const gradientId = useId();

  return (
    <div
      style={{
        width: `calc(var(--r) * ${size})`,
        height: `calc(var(--r) * ${size})`,
        borderRadius: 'calc(var(--r) * 5)',
        background: 'linear-gradient(135deg, #4F5BD5 0%, #962FBF 25%, #D62976 50%, #FA7E1E 75%, #FEDA75 100%)',
        boxShadow: '0 1px 2px rgba(26, 15, 92, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        flexShrink: 0,
        ...style,
      }}
      className={className}
      aria-hidden="true"
    >
      <svg
        width="66%"
        height="66%"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        {/* Outer rounded square */}
        <rect
          x="2.2"
          y="2.2"
          width="15.6"
          height="15.6"
          rx="4.5"
          stroke="#ffffff"
          strokeWidth="1.6"
        />
        {/* Center lens circle */}
        <circle cx="10" cy="10" r="3.7" stroke="#ffffff" strokeWidth="1.6" />
        {/* Flash dot */}
        <circle cx="14.3" cy="5.7" r="0.9" fill="#ffffff" />
      </svg>
    </div>
  );
}

export function PdfFileIcon({ size = 36, className = '', style = {} }) {
  const gradientId = useId();

  return (
    <div
      style={{
        width: `calc(var(--r) * ${size})`,
        height: `calc(var(--r) * ${size})`,
        borderRadius: 'calc(var(--r) * 9)',
        background: 'linear-gradient(145deg, #ff822e 0%, #fb6b07 50%, #df5300 100%)',
        boxShadow: '0 2px 5px rgba(251, 107, 7, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        flexShrink: 0,
        ...style,
      }}
      className={className}
      aria-hidden="true"
    >
      <svg
        width="16"
        height="18"
        viewBox="0 0 16 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block', overflow: 'visible' }}
      >
        {/* File outline with top-right fold */}
        <path
          d="M 2.5 1.5 L 9.5 1.5 L 13.5 5.5 L 13.5 15.5 C 13.5 16.2 12.9 16.8 12.2 16.8 L 3.8 16.8 C 3.1 16.8 2.5 16.2 2.5 15.5 L 2.5 2.8 C 2.5 2.1 3.1 1.5 3.8 1.5 Z"
          stroke="#ffffff"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Corner fold flap */}
        <path
          d="M 9.5 1.5 L 9.5 5.5 L 13.5 5.5"
          stroke="#ffffff"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Horizontal minus / content bar */}
        <line
          x1="5.5"
          y1="12.5"
          x2="10.5"
          y2="12.5"
          stroke="#ffffff"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/**
 * Chunk 4 Tool Icons for ContentCard icon strips:
 * - FigmaIcon (5 colored geometric shapes)
 * - PhotoshopIcon (dark navy rounded square with blue "Ps")
 * - WebflowIcon (stylized blue "W" mark)
 * - TiktokIcon (black musical note with cyan and red 3D glitch offset)
 * - PowerpointIcon (orange pie chart base with overlapping crimson "P" badge)
 * Note: InstagramIcon from Chunk 3 is reused with size=24.75.
 */

export function FigmaIcon({ className = '', style = {} }) {
  return (
    <svg
      width="calc(var(--r) * 17)"
      height="calc(var(--r) * 25.5)"
      viewBox="0 0 17 25.5"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0, ...style }}
      className={className}
      aria-hidden="true"
    >
      <path d="M 8.5 0 L 4.25 0 C 1.9 0 0 1.9 0 4.25 C 0 6.6 1.9 8.5 4.25 8.5 L 8.5 8.5 Z" fill="#F24E1E" />
      <path d="M 8.5 0 L 12.75 0 C 15.1 0 17 1.9 17 4.25 C 17 6.6 15.1 8.5 12.75 8.5 C 10.4 8.5 8.5 6.6 8.5 4.25 Z" fill="#FF7262" />
      <path d="M 8.5 8.5 L 4.25 8.5 C 1.9 8.5 0 10.4 0 12.75 C 0 15.1 1.9 17 4.25 17 L 8.5 17 Z" fill="#A259FF" />
      <circle cx="12.75" cy="12.75" r="4.25" fill="#1ABCFE" />
      <path d="M 8.5 17 L 4.25 17 C 1.9 17 0 18.9 0 21.25 C 0 23.6 1.9 25.5 4.25 25.5 C 6.6 25.5 8.5 23.6 8.5 21.25 Z" fill="#0ACF83" />
    </svg>
  );
}

export function PhotoshopIcon({ size = 25.5, className = '', style = {} }) {
  return (
    <div
      style={{
        width: `calc(var(--r) * ${size})`,
        height: `calc(var(--r) * ${size})`,
        borderRadius: 'calc(var(--r) * 5.5)',
        backgroundColor: '#001E36',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        flexShrink: 0,
        boxShadow: '0 1px 2px rgba(0, 30, 54, 0.20)',
        ...style,
      }}
      className={className}
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 26 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        <text
          x="13"
          y="18.2"
          fill="#31A8FF"
          fontSize="14.5"
          fontWeight="bold"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
          textAnchor="middle"
          letterSpacing="-0.5px"
        >
          Ps
        </text>
      </svg>
    </div>
  );
}

export function WebflowIcon({ className = '', style = {} }) {
  return (
    <svg
      width="calc(var(--r) * 26.5)"
      height="calc(var(--r) * 17)"
      viewBox="0 0 26.5 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0, ...style }}
      className={className}
      aria-hidden="true"
    >
      <path
        d="M 26.5 0 L 19.8 17 L 13.9 17 L 17.5 7.8 L 17.3 7.8 C 15.3 11.2 11.8 15.2 6.7 16.2 L 8.4 11.8 C 11.4 11.1 13.2 8.7 14.5 5.6 L 14.7 5.6 L 11.3 5.6 L 11.3 0 L 16.5 0 L 14.7 4.7 L 14.9 4.7 C 16.4 2.1 19.3 0 22.8 0 Z M 0 11.6 L 3.8 0 L 9.0 0 L 5.2 11.6 Z"
        fill="#146EF5"
      />
    </svg>
  );
}

export function TiktokIcon({ className = '', style = {} }) {
  return (
    <svg
      width="calc(var(--r) * 23.5)"
      height="calc(var(--r) * 25)"
      viewBox="0 0 24 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0, overflow: 'visible', ...style }}
      className={className}
      aria-hidden="true"
    >
      <path
        d="M 17.5 0 C 18.2 2.8 20.2 4.8 23 5.5 L 23 9 C 20.7 9 18.7 8.1 17.2 6.7 L 17.2 16.2 C 17.2 20.8 13.5 24.5 8.9 24.5 C 4.3 24.5 0.5 20.8 0.5 16.2 C 0.5 11.6 4.3 7.9 8.9 7.9 C 9.5 7.9 10.1 8 10.7 8.1 L 10.7 11.7 C 10.1 11.5 9.5 11.4 8.9 11.4 C 6.3 11.4 4.1 13.5 4.1 16.2 C 4.1 18.8 6.3 21 8.9 21 C 11.6 21 13.7 18.8 13.7 16.2 L 13.7 0 Z"
        fill="#25F4EE"
        transform="translate(-1, -0.8)"
      />
      <path
        d="M 17.5 0 C 18.2 2.8 20.2 4.8 23 5.5 L 23 9 C 20.7 9 18.7 8.1 17.2 6.7 L 17.2 16.2 C 17.2 20.8 13.5 24.5 8.9 24.5 C 4.3 24.5 0.5 20.8 0.5 16.2 C 0.5 11.6 4.3 7.9 8.9 7.9 C 9.5 7.9 10.1 8 10.7 8.1 L 10.7 11.7 C 10.1 11.5 9.5 11.4 8.9 11.4 C 6.3 11.4 4.1 13.5 4.1 16.2 C 4.1 18.8 6.3 21 8.9 21 C 11.6 21 13.7 18.8 13.7 16.2 L 13.7 0 Z"
        fill="#FE2C55"
        transform="translate(1, 0.8)"
      />
      <path
        d="M 17.5 0 C 18.2 2.8 20.2 4.8 23 5.5 L 23 9 C 20.7 9 18.7 8.1 17.2 6.7 L 17.2 16.2 C 17.2 20.8 13.5 24.5 8.9 24.5 C 4.3 24.5 0.5 20.8 0.5 16.2 C 0.5 11.6 4.3 7.9 8.9 7.9 C 9.5 7.9 10.1 8 10.7 8.1 L 10.7 11.7 C 10.1 11.5 9.5 11.4 8.9 11.4 C 6.3 11.4 4.1 13.5 4.1 16.2 C 4.1 18.8 6.3 21 8.9 21 C 11.6 21 13.7 18.8 13.7 16.2 L 13.7 0 Z"
        fill="#010101"
      />
    </svg>
  );
}

export function PowerpointIcon({ className = '', style = {} }) {
  return (
    <svg
      width="calc(var(--r) * 27.5)"
      height="calc(var(--r) * 25)"
      viewBox="0 0 28 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0, ...style }}
      className={className}
      aria-hidden="true"
    >
      <g transform="translate(3, 0)">
        <path d="M 12.5 0 C 19.4 0 25 5.6 25 12.5 C 25 19.4 19.4 25 12.5 25 L 12.5 12.5 Z" fill="#D83B01" />
        <path d="M 12.5 0 C 19.4 0 25 5.6 25 12.5 L 12.5 12.5 Z" fill="#EA4800" />
        <path d="M 21.3 21.3 C 19.0 23.6 15.9 25 12.5 25 L 12.5 12.5 Z" fill="#C43E1C" />
      </g>
      <rect x="0" y="3" width="15" height="19" rx="3.5" fill="#B7472A" />
      <text
        x="7.5"
        y="17.2"
        fill="#ffffff"
        fontSize="14"
        fontWeight="bold"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        textAnchor="middle"
      >
        P
      </text>
    </svg>
  );
}

export function ToolIcon({ name, className = '', style = {} }) {
  switch (name) {
    case 'figma':
      return <FigmaIcon className={className} style={style} />;
    case 'photoshop':
      return <PhotoshopIcon className={className} style={style} />;
    case 'webflow':
      return <WebflowIcon className={className} style={style} />;
    case 'tiktok':
      return <TiktokIcon className={className} style={style} />;
    case 'instagram':
      return <InstagramIcon size={24.75} className={className} style={style} />;
    case 'powerpoint':
      return <PowerpointIcon className={className} style={style} />;
    default:
      return null;
  }
}

/**
 * Chunk 5 Sparkle Glyph for AICard:
 * Two four-point sparkles:
 * - One large (centered around x=14, y=10.5)
 * - One small (centered around x=7.5, y=15.5)
 * Outlined in white with stroke about 1.1, ~14x14 total bounding box inside 23x23 viewBox.
 */
export function SparkleIcon({ className = '', style = {} }) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 23 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0, ...style }}
      className={className}
      aria-hidden="true"
    >
      {/* Large sparkle */}
      <path
        d="M 14 4.5 Q 14 10.5 20 10.5 Q 14 10.5 14 16.5 Q 14 10.5 8 10.5 Q 14 10.5 14 4.5 Z"
        stroke="#ffffff"
        strokeWidth="1.1"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="rgba(255, 255, 255, 0.15)"
      />
      {/* Small sparkle */}
      <path
        d="M 7.5 12.3 Q 7.5 15.5 10.7 15.5 Q 7.5 15.5 7.5 18.7 Q 7.5 15.5 4.3 15.5 Q 7.5 15.5 7.5 12.3 Z"
        stroke="#ffffff"
        strokeWidth="1.1"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="rgba(255, 255, 255, 0.15)"
      />
    </svg>
  );
}

