import { CONTENT_CARD } from './config';
import { ToolIcon } from './icons';

/**
 * IconRow: Horizontal scrolling strip container for Chunk 4.
 * Renders a viewport with symmetric edge fade masks, holding an un-transformed track
 * centered on the card with 7 cyclic tool icon tiles.
 */
export default function IconRow({ row, calibMode = false }) {
  const { mask, track } = CONTENT_CARD.GEOMETRY;

  // Mask gradient: transparent at 3r, ramping linearly to opaque at 18r; opaque across middle;
  // ramping to transparent from (100% - 18r) to (100% - 3r).
  const maskStyle = `linear-gradient(to right, transparent calc(var(--r) * ${mask.leftTransparent}), black calc(var(--r) * ${mask.leftOpaque}), black calc(100% - calc(var(--r) * ${mask.rightOpaque})), transparent calc(100% - calc(var(--r) * ${mask.rightTransparent})))`;

  return (
    <div
      data-part="icon-row"
      data-row={row.id}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: `calc(var(--r) * ${row.top})`,
        height: `calc(var(--r) * ${row.height})`,
        overflow: 'hidden',
        WebkitMaskImage: maskStyle,
        maskImage: maskStyle,
      }}
    >
      <div
        data-part="icon-track"
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'row',
          gap: 'calc(var(--r) * 10)',
          width: 'max-content',
          left: `calc(50% - calc(var(--r) * ${track.halfTrack}))`,
          top: 0,
          height: '100%',
        }}
      >
        {row.icons.map((iconId, idx) => (
          <div
            key={`${row.id}-${idx}-${iconId}`}
            className="wwd-icon-tile"
            data-part="icon-tile tile"
            data-icon={iconId}
            style={{
              width: 'calc(var(--r) * 51)',
              height: 'calc(var(--r) * 51)',
              borderRadius: 'calc(var(--r) * 12)',
              backgroundColor: calibMode ? CONTENT_CARD.COLORS.calibTileBg : CONTENT_CARD.COLORS.tileBg,
              border: calibMode ? 'none' : `1px solid ${CONTENT_CARD.COLORS.tileBorder}`,
              boxShadow: calibMode ? 'none' : CONTENT_CARD.COLORS.tileShadow,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxSizing: 'border-box',
              flexShrink: 0,
            }}
          >
            {!calibMode && <ToolIcon name={iconId} />}
          </div>
        ))}
      </div>
    </div>
  );
}

