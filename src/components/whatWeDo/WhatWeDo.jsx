import React, { useMemo } from 'react';
import { SECTION_ID, TOKENS, CONTENT, GEOMETRY } from './config';
import BentoCard from './BentoCard';
import RevenueCard from './RevenueCard';
import StatCard from './StatCard';
import FileCard from './FileCard';
import DebugOverlay from './DebugOverlay';

/**
 * WhatWeDo Section (Chunk 1 of 7)
 * Implements the responsive container, static header, and exact 7-card bento grid shells.
 */
export default function WhatWeDo() {
  const isRefMode = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const sp = new URLSearchParams(window.location.search);
    return sp.get('ref') === '1';
  }, []);

  return (
    <section
      id={SECTION_ID}
      aria-labelledby="wwd-headline"
      className="wwd-section"
      style={{
        '--card-bg': TOKENS.cardBg,
        '--card-border': TOKENS.cardBorder,
        '--card-shadow': TOKENS.cardShadow,
        '--card-radius': `${TOKENS.cardRadius}px`,
        '--text-1': TOKENS.text1,
        '--text-2': TOKENS.text2,
        '--eyebrow-text': TOKENS.eyebrowText,
        '--eyebrow-dot': TOKENS.eyebrowDot,
      }}
    >
      <style>{`
        .wwd-section {
          width: 100%;
          position: relative;
          overflow-x: clip;
          overflow-y: visible;
          background-color: transparent;
          box-sizing: border-box;
          padding-top: calc(var(--r) * ${GEOMETRY.paddingTop});
          padding-bottom: calc(var(--r) * ${GEOMETRY.paddingBottom});
          color: var(--text-1);
        }

        .wwd-container {
          width: min(calc(100% - 40px), 1160px);
          margin-left: auto;
          margin-right: auto;
          container-type: inline-size;
          position: relative;
          overflow: visible;
          box-sizing: border-box;
        }

        /* Unit system defaults */
        .wwd-container {
          --r: calc(100cqw / 771);
        }

        @media (max-width: 939.98px) {
          .wwd-container:not(.is-ref-mode) {
            --r: 1.25px;
          }
        }

        @container (max-width: 899.98px) {
          .wwd-container:not(.is-ref-mode),
          .wwd-container:not(.is-ref-mode) .wwd-header,
          .wwd-container:not(.is-ref-mode) .wwd-grid-wrapper,
          .wwd-container:not(.is-ref-mode) .wwd-grid,
          .wwd-container:not(.is-ref-mode) .wwd-card {
            --r: 1.25px;
          }
          .wwd-container:not(.is-ref-mode) [data-part="stat-delta"],
          .wwd-container:not(.is-ref-mode) [data-part="file-meta"] {
            font-size: max(calc(var(--r) * 8), 11px) !important;
          }
          .wwd-container:not(.is-ref-mode) [data-part="stat-value"],
          .wwd-container:not(.is-ref-mode) [data-part="stat-label"],
          .wwd-container:not(.is-ref-mode) [data-part="file-name"],
          .wwd-container:not(.is-ref-mode) [data-part="file-button"] {
            font-size: max(calc(var(--r) * 12), 12px) !important;
          }
        }

        /* Reference Mode Override */
        .wwd-container.is-ref-mode {
          width: 771px !important;
          max-width: 771px !important;
          min-width: 771px !important;
          --r: 1px !important;
        }

        /* 3-Column Layout: Desktop (>= 900px) OR in Reference Mode (?ref=1) */
        @container (min-width: 900px) {
          .wwd-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            column-gap: calc(var(--r) * 13);
            height: calc(var(--r) * 269);
            width: 100%;
            position: relative;
            overflow: visible;
            box-sizing: border-box;
          }
          .wwd-group-1 {
            display: flex;
            flex-direction: column;
            gap: calc(var(--r) * 10);
            height: 100%;
            width: 100%;
            position: relative;
            overflow: visible;
          }
          .wwd-card-revenue {
            height: calc(var(--r) * 194);
            width: 100%;
          }
          .wwd-stat-row {
            display: flex;
            flex-direction: row;
            gap: calc(var(--r) * 10);
            height: calc(var(--r) * 65);
            width: 100%;
            position: relative;
            overflow: visible;
          }
          .wwd-card-stat {
            flex: 1;
            height: 100%;
          }
          .wwd-group-2 {
            display: flex;
            flex-direction: column;
            height: 100%;
            width: 100%;
            position: relative;
            overflow: visible;
          }
          .wwd-card-content {
            height: calc(var(--r) * 269);
            width: 100%;
          }
          .wwd-group-3 {
            display: flex;
            flex-direction: column;
            gap: calc(var(--r) * 10);
            height: 100%;
            width: 100%;
            position: relative;
            overflow: visible;
          }
          .wwd-card-file {
            height: calc(var(--r) * 65);
            width: 100%;
          }
          .wwd-card-ai {
            height: calc(var(--r) * 194);
            width: 100%;
          }
        }

        /* Reference Mode 3-column enforcement */
        .wwd-container.is-ref-mode .wwd-grid {
          display: grid !important;
          grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          column-gap: calc(var(--r) * 13) !important;
          height: calc(var(--r) * 269) !important;
          width: 100% !important;
          position: relative;
          overflow: visible;
          box-sizing: border-box;
        }
        .wwd-container.is-ref-mode .wwd-group-1 {
          display: flex !important;
          flex-direction: column !important;
          gap: calc(var(--r) * 10) !important;
          height: 100% !important;
          width: 100% !important;
          grid-column: auto !important;
          position: relative;
          overflow: visible;
        }
        .wwd-container.is-ref-mode .wwd-card-revenue {
          height: calc(var(--r) * 194) !important;
          width: 100% !important;
        }
        .wwd-container.is-ref-mode .wwd-stat-row {
          display: flex !important;
          flex-direction: row !important;
          gap: calc(var(--r) * 10) !important;
          height: calc(var(--r) * 65) !important;
          width: 100% !important;
          position: relative;
          overflow: visible;
        }
        .wwd-container.is-ref-mode .wwd-card-stat {
          flex: 1 !important;
          height: 100% !important;
        }
        .wwd-container.is-ref-mode .wwd-group-2 {
          display: flex !important;
          flex-direction: column !important;
          height: 100% !important;
          width: 100% !important;
          grid-column: auto !important;
          position: relative;
          overflow: visible;
        }
        .wwd-container.is-ref-mode .wwd-card-content {
          height: calc(var(--r) * 269) !important;
          width: 100% !important;
        }
        .wwd-container.is-ref-mode .wwd-group-3 {
          display: flex !important;
          flex-direction: column !important;
          gap: calc(var(--r) * 10) !important;
          height: 100% !important;
          width: 100% !important;
          grid-column: auto !important;
          position: relative;
          overflow: visible;
        }
        .wwd-container.is-ref-mode .wwd-card-file {
          height: calc(var(--r) * 65) !important;
          width: 100% !important;
        }
        .wwd-container.is-ref-mode .wwd-card-ai {
          height: calc(var(--r) * 194) !important;
          width: 100% !important;
        }

        /* Tablet (560px to 899px container width, when NOT in ref mode): 2 columns */
        @container (min-width: 560px) and (max-width: 899.98px) {
          .wwd-container:not(.is-ref-mode) .wwd-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            column-gap: calc(var(--r) * 13);
            row-gap: calc(var(--r) * 10);
            width: 100%;
            position: relative;
            overflow: visible;
            box-sizing: border-box;
          }
          .wwd-container:not(.is-ref-mode) .wwd-group-1 {
            grid-column: span 2;
            display: flex;
            flex-direction: column;
            gap: calc(var(--r) * 10);
            width: 100%;
            position: relative;
            overflow: visible;
          }
          .wwd-container:not(.is-ref-mode) .wwd-card-revenue {
            height: calc(var(--r) * 194);
            width: calc(100% - 24px);
          }
          .wwd-container:not(.is-ref-mode) .wwd-stat-row {
            display: flex;
            flex-direction: row;
            gap: calc(var(--r) * 10);
            height: calc(var(--r) * 65);
            width: 100%;
            position: relative;
            overflow: visible;
          }
          .wwd-container:not(.is-ref-mode) .wwd-card-stat {
            flex: 1;
            height: 100%;
          }
          .wwd-container:not(.is-ref-mode) .wwd-group-2 {
            grid-column: span 1;
            display: flex;
            flex-direction: column;
            width: 100%;
            position: relative;
            overflow: visible;
          }
          .wwd-container:not(.is-ref-mode) .wwd-card-content {
            height: calc(var(--r) * 269);
            width: 100%;
          }
          .wwd-container:not(.is-ref-mode) .wwd-group-3 {
            grid-column: span 1;
            display: flex;
            flex-direction: column;
            gap: calc(var(--r) * 10);
            width: 100%;
            position: relative;
            overflow: visible;
          }
          .wwd-container:not(.is-ref-mode) .wwd-card-file {
            height: calc(var(--r) * 65);
            width: 100%;
          }
          .wwd-container:not(.is-ref-mode) .wwd-card-ai {
            height: calc(var(--r) * 194);
            width: 100%;
          }
        }

        /* Mobile (< 560px container width, when NOT in ref mode): 1 column */
        @container (max-width: 559.98px) {
          .wwd-container:not(.is-ref-mode) .wwd-grid {
            display: flex;
            flex-direction: column;
            gap: calc(var(--r) * 10);
            width: 100%;
            position: relative;
            overflow: visible;
            box-sizing: border-box;
          }
          .wwd-container:not(.is-ref-mode) .wwd-group-1 {
            display: flex;
            flex-direction: column;
            gap: calc(var(--r) * 10);
            width: 100%;
            position: relative;
            overflow: visible;
          }
          .wwd-container:not(.is-ref-mode) .wwd-card-revenue {
            height: calc(var(--r) * 194);
            width: calc(100% - 24px);
          }
          .wwd-container:not(.is-ref-mode) .wwd-stat-row {
            display: flex;
            flex-direction: row;
            gap: calc(var(--r) * 10);
            height: calc(var(--r) * 65);
            width: 100%;
            position: relative;
            overflow: visible;
          }
          .wwd-container:not(.is-ref-mode) .wwd-card-stat {
            flex: 1;
            height: 100%;
          }
          .wwd-container:not(.is-ref-mode) .wwd-group-2 {
            display: flex;
            flex-direction: column;
            width: 100%;
            position: relative;
            overflow: visible;
          }
          .wwd-container:not(.is-ref-mode) .wwd-card-content {
            height: calc(var(--r) * 269);
            width: 100%;
          }
          .wwd-container:not(.is-ref-mode) .wwd-group-3 {
            display: flex;
            flex-direction: column;
            gap: calc(var(--r) * 10);
            width: 100%;
            position: relative;
            overflow: visible;
          }
          .wwd-container:not(.is-ref-mode) .wwd-card-file {
            height: calc(var(--r) * 65);
            width: 100%;
          }
          .wwd-container:not(.is-ref-mode) .wwd-card-ai {
            height: calc(var(--r) * 194);
            width: 100%;
          }
        }

        /* HEADER TYPOGRAPHY & SPACING */
        .wwd-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          overflow: visible;
          margin-bottom: calc(var(--r) * ${GEOMETRY.header.gapToGrid});
        }

        .wwd-eyebrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: calc(var(--r) * 6);
          font-family: var(--font-primary);
          font-size: calc(var(--r) * ${GEOMETRY.header.eyebrow.fontSize});
          font-weight: ${GEOMETRY.header.eyebrow.fontWeight};
          letter-spacing: ${GEOMETRY.header.eyebrow.letterSpacing};
          text-transform: uppercase;
          color: var(--eyebrow-text);
          line-height: calc(var(--r) * 10);
          height: calc(var(--r) * 10);
          margin: 0 0 calc(var(--r) * 4) 0;
          padding: 0;
        }

        .wwd-eyebrow-dot {
          width: calc(var(--r) * ${GEOMETRY.header.eyebrow.dotSize});
          height: calc(var(--r) * ${GEOMETRY.header.eyebrow.dotSize});
          border-radius: 50%;
          background-color: var(--eyebrow-dot);
          display: inline-block;
          flex-shrink: 0;
        }

        .wwd-headline {
          font-family: var(--font-primary);
          font-size: calc(var(--r) * ${GEOMETRY.header.headline.fontSize});
          font-weight: ${GEOMETRY.header.headline.fontWeight};
          letter-spacing: ${GEOMETRY.header.headline.letterSpacing};
          color: var(--text-1);
          line-height: calc(var(--r) * 34);
          height: calc(var(--r) * 34);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 0 calc(var(--r) * 10) 0;
          padding: 0;
          white-space: nowrap;
        }

        .wwd-subtext {
          font-family: var(--font-primary);
          font-size: calc(var(--r) * ${GEOMETRY.header.subtext.fontSize});
          line-height: calc(var(--r) * ${GEOMETRY.header.subtext.lineHeight});
          font-weight: 400;
          color: var(--text-2);
          max-width: calc(var(--r) * ${GEOMETRY.header.subtext.maxWidth});
          margin: 0 auto;
          padding: 0;
          text-align: center;
          text-wrap: balance;
        }

        /* Responsive font scaling overrides (< 900px container width) */
        @container (max-width: 899.98px) {
          .wwd-container:not(.is-ref-mode) .wwd-eyebrow {
            font-size: max(12px, calc(var(--r) * ${GEOMETRY.header.eyebrow.fontSize}));
            height: auto;
            line-height: 1.2;
          }
          .wwd-container:not(.is-ref-mode) .wwd-subtext {
            font-size: max(12px, calc(var(--r) * ${GEOMETRY.header.subtext.fontSize}));
            line-height: max(16px, calc(var(--r) * ${GEOMETRY.header.subtext.lineHeight}));
          }
        }

        /* Mobile (< 560px container width) */
        @container (max-width: 559.98px) {
          .wwd-container:not(.is-ref-mode) .wwd-headline {
            font-size: clamp(26px, calc(var(--r) * ${GEOMETRY.header.headline.fontSize}), 45px);
            white-space: normal;
            height: auto;
            text-wrap: balance;
          }
        }
      `}</style>

      <div className={`wwd-container ${isRefMode ? 'is-ref-mode' : ''}`}>
        {/* Header Block */}
        <header className="wwd-header">
          <p data-slot="eyebrow" className="wwd-eyebrow">
            <span className="wwd-eyebrow-dot" aria-hidden="true" />
            <span className="wwd-eyebrow-text">{CONTENT.eyebrow}</span>
          </p>

          <h2 id="wwd-headline" data-slot="headline" className="wwd-headline">
            {CONTENT.headline}
          </h2>

          <p data-slot="subtext" className="wwd-subtext">
            {CONTENT.subtext}
          </p>
        </header>

        {/* Bento Grid Layer */}
        <div className="wwd-grid-wrapper" style={{ position: 'relative', overflow: 'visible' }}>
          <div className="wwd-grid">
            {/* Column 1: Revenue Card + Stat Cards */}
            <div className="wwd-group-1">
              <RevenueCard />
              <div className="wwd-stat-row">
                <StatCard slot="stat-a" stat={CONTENT.stats[0]} />
                <StatCard slot="stat-b" stat={CONTENT.stats[1]} />
              </div>
            </div>

            {/* Column 2: Content Card */}
            <div className="wwd-group-2">
              <BentoCard
                slot="content"
                title={CONTENT.content.title}
                className="wwd-card-content"
              />
            </div>

            {/* Column 3: File Card + AI Card */}
            <div className="wwd-group-3">
              <FileCard />
              <BentoCard
                slot="ai"
                title={CONTENT.ai.title}
                className="wwd-card-ai"
              />
            </div>
          </div>

          {/* Dev-only debug guide overlay */}
          <DebugOverlay />
        </div>
      </div>
    </section>
  );
}
