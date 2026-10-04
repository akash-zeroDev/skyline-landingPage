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
