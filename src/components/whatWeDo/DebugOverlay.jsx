import React from 'react';
import { GEOMETRY, DEBUG_GUIDES, REVENUE, STAT, FILE } from './config';

/**
 * Dev-only debug guide overlay.
 * Renders dashed magenta bounding boxes for expected card geometry and horizontal header center lines.
 * Completely omitted from production builds (returns null if !import.meta.env.DEV).
 */
export default function DebugOverlay({ enabled = false }) {
  if (!import.meta.env.DEV) return null;

  const isEnabled = enabled || DEBUG_GUIDES || (typeof window !== 'undefined' && window.location.search.includes('guides=1'));
  if (!isEnabled) return null;

  const { cards, header } = GEOMETRY;

  return (
    <div
      className="wwd-debug-overlay"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        userSelect: 'none',
      }}
    >
      {/* Header horizontal center reference lines */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 0,
          overflow: 'visible',
        }}
      >
        {/* Eyebrow center */}
        <div
          style={{
            position: 'absolute',
            top: `calc(var(--r) * ${header.eyebrow.centerY})`,
            left: 0,
            right: 0,
            borderTop: '1px dashed #ff00ff',
            opacity: 0.8,
          }}
        >
          <span style={{ fontSize: '10px', color: '#ff00ff', background: 'rgba(255,255,255,0.85)', padding: '0 4px' }}>
            eyebrow center ({header.eyebrow.centerY}r)
          </span>
        </div>

        {/* Headline center */}
        <div
          style={{
            position: 'absolute',
            top: `calc(var(--r) * ${header.headline.centerY})`,
            left: 0,
            right: 0,
            borderTop: '1px dashed #ff00ff',
            opacity: 0.8,
          }}
        >
          <span style={{ fontSize: '10px', color: '#ff00ff', background: 'rgba(255,255,255,0.85)', padding: '0 4px' }}>
            headline center ({header.headline.centerY}r)
          </span>
        </div>

        {/* Subtext line 1 center */}
        <div
          style={{
            position: 'absolute',
            top: `calc(var(--r) * ${header.subtext.line1CenterY})`,
            left: 0,
            right: 0,
            borderTop: '1px dashed #ff00ff',
            opacity: 0.8,
          }}
        >
          <span style={{ fontSize: '10px', color: '#ff00ff', background: 'rgba(255,255,255,0.85)', padding: '0 4px' }}>
            subtext L1 ({header.subtext.line1CenterY}r)
          </span>
        </div>

        {/* Subtext line 2 center */}
        <div
          style={{
            position: 'absolute',
            top: `calc(var(--r) * ${header.subtext.line2CenterY})`,
            left: 0,
            right: 0,
            borderTop: '1px dashed #ff00ff',
            opacity: 0.8,
          }}
        >
          <span style={{ fontSize: '10px', color: '#ff00ff', background: 'rgba(255,255,255,0.85)', padding: '0 4px' }}>
            subtext L2 ({header.subtext.line2CenterY}r)
          </span>
        </div>

        {/* Grid top (y = 0) */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            borderTop: '1px solid #ff00ff',
            opacity: 0.9,
          }}
        >
          <span style={{ fontSize: '10px', color: '#ff00ff', background: 'rgba(255,255,255,0.85)', padding: '0 4px' }}>
            grid top (y=0)
          </span>
        </div>
      </div>

      {/* Card expected bounding boxes */}
      {Object.values(cards).map((c) => (
        <div
          key={`guide-${c.slot}`}
          style={{
            position: 'absolute',
            left: `calc(var(--r) * ${c.x})`,
            top: `calc(var(--r) * ${c.y})`,
            width: `calc(var(--r) * ${c.w})`,
            height: `calc(var(--r) * ${c.h})`,
            borderRadius: `calc(var(--r) * ${c.r})`,
            border: '1.5px dashed #ff00ff',
            boxSizing: 'border-box',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            padding: '4px 6px',
            backgroundColor: 'rgba(255, 0, 255, 0.03)',
          }}
        >
          <span
            style={{
              fontSize: '10px',
              fontFamily: 'monospace',
              fontWeight: 600,
              color: '#ff00ff',
              background: 'rgba(255, 255, 255, 0.9)',
              padding: '1px 4px',
              borderRadius: '3px',
              lineHeight: 1.2,
            }}
          >
            {c.slot} ({Math.round(c.w)}x{Math.round(c.h)})
          </span>
        </div>
      ))}

      {/* Chunk 2: Revenue Card Debug Probes */}
      <div
        className="wwd-debug-revenue"
        style={{
          position: 'absolute',
          left: `calc(var(--r) * ${cards.revenue.x})`,
          top: `calc(var(--r) * ${cards.revenue.y})`,
          width: `calc(var(--r) * ${cards.revenue.w})`,
          height: `calc(var(--r) * ${cards.revenue.h})`,
          pointerEvents: 'none',
          overflow: 'visible',
        }}
      >
        {/* Flat Text Probes (horizontal guide lines) */}
        <div style={{ position: 'absolute', top: `calc(var(--r) * ${REVENUE.TYPE.number.centerY})`, left: `calc(var(--r) * ${REVENUE.TYPE.number.left})`, width: '40px', borderTop: '1px dashed #0d8438' }} />
        <div style={{ position: 'absolute', top: `calc(var(--r) * ${REVENUE.TYPE.title.centerY})`, left: '10%', right: '10%', borderTop: '1px dashed #111A5C' }} />
        <div style={{ position: 'absolute', top: `calc(var(--r) * ${REVENUE.TYPE.description.line1CenterY})`, left: '15%', right: '15%', borderTop: '1px dotted #5c5c70' }} />
        <div style={{ position: 'absolute', top: `calc(var(--r) * ${REVENUE.TYPE.description.line2CenterY})`, left: '15%', right: '15%', borderTop: '1px dotted #5c5c70' }} />
        <div style={{ position: 'absolute', top: `calc(var(--r) * ${REVENUE.TYPE.description.line3CenterY})`, left: '30%', right: '30%', borderTop: '1px dotted #5c5c70' }} />

        {/* Chart vertex markers (cyan dots) */}
        {REVENUE.CHART.vertices.map((v, i) => (
          <div
            key={`v-${i}`}
            style={{
              position: 'absolute',
              left: `calc(var(--r) * ${v.x} - 2px)`,
              top: `calc(var(--r) * ${v.y} - 2px)`,
              width: '4px',
              height: '4px',
              borderRadius: '50%',
              backgroundColor: '#00e5ff',
              border: '0.5px solid #000',
            }}
          />
        ))}

        {/* Tilted corner probes (crosshairs) */}
        {Object.entries(REVENUE.TILTED_CORNERS).map(([cornerName, pt]) => (
          <div
            key={`corner-${cornerName}`}
            style={{
              position: 'absolute',
              left: `calc(var(--r) * ${pt.x})`,
              top: `calc(var(--r) * ${pt.y})`,
              overflow: 'visible',
            }}
          >
            {/* Crosshair horizontal */}
            <div style={{ position: 'absolute', left: '-5px', top: '0', width: '11px', height: '0', borderTop: '1.5px solid #ff007f' }} />
            {/* Crosshair vertical */}
            <div style={{ position: 'absolute', left: '0', top: '-5px', width: '0', height: '11px', borderLeft: '1.5px solid #ff007f' }} />
            <span style={{ position: 'absolute', left: '6px', top: '-8px', fontSize: '9px', color: '#ff007f', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
              {cornerName}
            </span>
          </div>
        ))}
      </div>

      {/* Chunk 3: Stat Card A Guides */}
      <div
        className="wwd-debug-stat-a"
        style={{
          position: 'absolute',
          left: `calc(var(--r) * ${cards.statA.x})`,
          top: `calc(var(--r) * ${cards.statA.y})`,
          width: `calc(var(--r) * ${cards.statA.w})`,
          height: `calc(var(--r) * ${cards.statA.h})`,
          pointerEvents: 'none',
          overflow: 'visible',
        }}
      >
        {/* Value Box */}
        <div style={{ position: 'absolute', left: 'calc(var(--r) * 10.5)', top: 'calc(var(--r) * 10.5)', width: 'calc(var(--r) * 47.5)', height: 'calc(var(--r) * 18)', border: '1px dashed #ff00ff', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: '7px', height: '7px', transform: 'translate(-50%, -50%)', borderTop: '1px solid #ff00ff', borderLeft: '1px solid #ff00ff' }} />
        </div>
        {/* Delta Box */}
        <div style={{ position: 'absolute', left: 'calc(var(--r) * 61)', top: 'calc(var(--r) * 9)', width: 'calc(var(--r) * 19)', height: 'calc(var(--r) * 10)', border: '1px dashed #ff00ff', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: '5px', height: '5px', transform: 'translate(-50%, -50%)', borderTop: '1px solid #ff00ff', borderLeft: '1px solid #ff00ff' }} />
        </div>
        {/* Icon Tile Box */}
        <div style={{ position: 'absolute', left: 'calc(var(--r) * 10)', top: 'calc(var(--r) * 32)', width: 'calc(var(--r) * 22.75)', height: 'calc(var(--r) * 22.75)', borderRadius: 'calc(var(--r) * 5)', border: '1px dashed #ff00ff', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: '7px', height: '7px', transform: 'translate(-50%, -50%)', borderTop: '1px solid #ff00ff', borderLeft: '1px solid #ff00ff' }} />
        </div>
        {/* Label Box */}
        <div style={{ position: 'absolute', left: 'calc(var(--r) * 39.5)', top: 'calc(var(--r) * 37.5)', width: 'calc(var(--r) * 56)', height: 'calc(var(--r) * 14)', border: '1px dashed #ff00ff', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: '7px', height: '7px', transform: 'translate(-50%, -50%)', borderTop: '1px solid #ff00ff', borderLeft: '1px solid #ff00ff' }} />
        </div>
      </div>

      {/* Chunk 3: Stat Card B Guides */}
      <div
        className="wwd-debug-stat-b"
        style={{
          position: 'absolute',
          left: `calc(var(--r) * ${cards.statB.x})`,
          top: `calc(var(--r) * ${cards.statB.y})`,
          width: `calc(var(--r) * ${cards.statB.w})`,
          height: `calc(var(--r) * ${cards.statB.h})`,
          pointerEvents: 'none',
          overflow: 'visible',
        }}
      >
        {/* Value Box */}
        <div style={{ position: 'absolute', left: 'calc(var(--r) * 10.5)', top: 'calc(var(--r) * 10.5)', width: 'calc(var(--r) * 42)', height: 'calc(var(--r) * 18)', border: '1px dashed #ff00ff', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: '7px', height: '7px', transform: 'translate(-50%, -50%)', borderTop: '1px solid #ff00ff', borderLeft: '1px solid #ff00ff' }} />
        </div>
        {/* Delta Box */}
        <div style={{ position: 'absolute', left: 'calc(var(--r) * 55.5)', top: 'calc(var(--r) * 9)', width: 'calc(var(--r) * 16.5)', height: 'calc(var(--r) * 10)', border: '1px dashed #ff00ff', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: '5px', height: '5px', transform: 'translate(-50%, -50%)', borderTop: '1px solid #ff00ff', borderLeft: '1px solid #ff00ff' }} />
        </div>
        {/* Icon Tile Box */}
        <div style={{ position: 'absolute', left: 'calc(var(--r) * 10)', top: 'calc(var(--r) * 32)', width: 'calc(var(--r) * 22.75)', height: 'calc(var(--r) * 22.75)', borderRadius: 'calc(var(--r) * 5)', border: '1px dashed #ff00ff', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: '7px', height: '7px', transform: 'translate(-50%, -50%)', borderTop: '1px solid #ff00ff', borderLeft: '1px solid #ff00ff' }} />
        </div>
        {/* Label Box */}
        <div style={{ position: 'absolute', left: 'calc(var(--r) * 39.5)', top: 'calc(var(--r) * 37.5)', width: 'calc(var(--r) * 47.5)', height: 'calc(var(--r) * 14)', border: '1px dashed #ff00ff', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: '7px', height: '7px', transform: 'translate(-50%, -50%)', borderTop: '1px solid #ff00ff', borderLeft: '1px solid #ff00ff' }} />
        </div>
      </div>

      {/* Chunk 3: File Card Guides */}
      <div
        className="wwd-debug-file"
        style={{
          position: 'absolute',
          left: `calc(var(--r) * ${cards.file.x})`,
          top: `calc(var(--r) * ${cards.file.y})`,
          width: `calc(var(--r) * ${cards.file.w})`,
          height: `calc(var(--r) * ${cards.file.h})`,
          pointerEvents: 'none',
          overflow: 'visible',
        }}
      >
        {/* Icon Tile Box */}
        <div style={{ position: 'absolute', left: 'calc(var(--r) * 11.5)', top: 'calc(var(--r) * 15)', width: 'calc(var(--r) * 36)', height: 'calc(var(--r) * 36)', borderRadius: 'calc(var(--r) * 9)', border: '1px dashed #ff00ff', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: '9px', height: '9px', transform: 'translate(-50%, -50%)', borderTop: '1px solid #ff00ff', borderLeft: '1px solid #ff00ff' }} />
        </div>
        {/* File Name Box */}
        <div style={{ position: 'absolute', left: 'calc(var(--r) * 54.5)', top: 'calc(var(--r) * 19.5)', width: 'calc(var(--r) * 108)', height: 'calc(var(--r) * 14)', border: '1px dashed #ff00ff', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: '7px', height: '7px', transform: 'translate(-50%, -50%)', borderTop: '1px solid #ff00ff', borderLeft: '1px solid #ff00ff' }} />
        </div>
        {/* File Meta Box */}
        <div style={{ position: 'absolute', left: 'calc(var(--r) * 54.5)', top: 'calc(var(--r) * 35)', width: 'calc(var(--r) * 21.5)', height: 'calc(var(--r) * 11)', border: '1px dashed #ff00ff', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: '5px', height: '5px', transform: 'translate(-50%, -50%)', borderTop: '1px solid #ff00ff', borderLeft: '1px solid #ff00ff' }} />
        </div>
        {/* Button Box */}
        <div style={{ position: 'absolute', left: 'calc(var(--r) * 175)', top: 'calc(var(--r) * 20)', width: 'calc(var(--r) * 62)', height: 'calc(var(--r) * 25.5)', borderRadius: 'calc(var(--r) * 13)', border: '1px dashed #ff00ff', boxSizing: 'border-box' }}>
          <div style={{ position: 'absolute', left: '50%', top: '50%', width: '7px', height: '7px', transform: 'translate(-50%, -50%)', borderTop: '1px solid #ff00ff', borderLeft: '1px solid #ff00ff' }} />
        </div>
      </div>
    </div>
  );
}
