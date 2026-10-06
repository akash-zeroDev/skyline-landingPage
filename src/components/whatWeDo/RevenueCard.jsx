import { useMemo } from 'react';
import { CONTENT, REVENUE } from './config';
import RevenueChart from './RevenueChart';

/**
 * RevenueCard: "Boost Your Revenue" Bento Card (Chunk 2 of 7).
 * Implements dual poses (tilted default, flat override) with back plate,
 * pixel-accurate typography, and the vectorized SVG revenue chart.
 */
export default function RevenueCard({ className = '', style = {}, isSettled = false, ...rest }) {
  const flags = useMemo(() => {
    if (typeof window === 'undefined') {
      return { isAnimOff: true, urlPose: null };
    }
    const sp = new URLSearchParams(window.location.search);
    const prefersReduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isAnimOff = sp.get('anim') === 'off' || prefersReduced;
    const urlPose = sp.get('pose');
    return { isAnimOff, urlPose };
  }, []);

  // Read pose override from URL query param in dev mode: ?pose=flat or ?pose=tilted
  const activePoseKey = useMemo(() => {
    if (flags.urlPose === 'flat' || flags.urlPose === 'tilted') {
      return flags.urlPose;
    }
    return REVENUE.POSE.default || 'tilted';
  }, [flags.urlPose]);

  // When animation is active, it starts in flat pose until tilted; if anim=off or isSettled, it rests in activePoseKey
  const isTilted = flags.urlPose === 'flat' ? false : flags.isAnimOff || isSettled ? activePoseKey === 'tilted' : false;
  const pose = isTilted ? REVENUE.POSE.tilted : REVENUE.POSE.flat;

  const numTop = REVENUE.TYPE.number.centerY - REVENUE.TYPE.number.lineHeight / 2;
  const titleTop = REVENUE.TYPE.title.centerY - REVENUE.TYPE.title.lineHeight / 2;
  const descTop = REVENUE.TYPE.description.line1CenterY - REVENUE.TYPE.description.lineHeight / 2;

  return (
    <article
      data-slot="revenue"
      aria-labelledby="wwd-revenue-title"
      className={`wwd-card wwd-card-revenue ${className}`}
      style={{
        position: 'relative',
        borderRadius: 'calc(var(--r) * var(--card-radius))',
        overflow: 'visible',
        boxSizing: 'border-box',
        ...style,
      }}
      {...rest}
    >
      {/* 1. Back Plate (exposed only in tilted pose) */}
      <div
        data-part="plate"
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'calc(var(--r) * 14)',
          background: REVENUE.COLORS.plateBg,
          border: `${REVENUE.PLATE.borderWidth}px dashed ${REVENUE.COLORS.plateBorder}`,
          boxSizing: 'border-box',
          opacity: isTilted ? 1 : 0,
          pointerEvents: 'none',
          transition: 'opacity 0.2s ease',
        }}
      />

      {/* 2. Card Face (transforms with pose) */}
      <div
        data-part="face"
        data-pose={activePoseKey}
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: '50% 50%',
          transform: `translate(calc(var(--r) * ${pose.x}), calc(var(--r) * ${pose.y})) rotate(${pose.rotate}deg)`,
          zIndex: isTilted ? 20 : 1,
          background: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: 'calc(var(--r) * 14)',
          boxShadow: isTilted ? REVENUE.COLORS.shadowTilted : REVENUE.COLORS.shadowFlat,
          boxSizing: 'border-box',
          overflow: 'visible',
        }}
      >
        {/* SVG Chart Layer */}
        <RevenueChart />

        {/* Top-left metric */}
        <p
          data-part="number"
          data-count-to="5.8"
          data-suffix="k"
          style={{
            position: 'absolute',
            left: `calc(var(--r) * ${REVENUE.TYPE.number.left})`,
            top: `calc(var(--r) * ${numTop})`,
            margin: 0,
            padding: 0,
            fontSize: `calc(var(--r) * ${REVENUE.TYPE.number.fontSize})`,
            lineHeight: `calc(var(--r) * ${REVENUE.TYPE.number.lineHeight})`,
            fontWeight: REVENUE.TYPE.number.fontWeight || 500,
            color: REVENUE.COLORS.number,
            fontFeatureSettings: '"tnum" 1',
            letterSpacing: '-0.02em',
            userSelect: 'none',
          }}
        >
          {CONTENT.revenue.value}
        </p>

        {/* Card Title */}
        <h3
          id="wwd-revenue-title"
          data-part="title"
          style={{
            position: 'absolute',
            top: `calc(var(--r) * ${titleTop})`,
            left: 0,
            right: 0,
            margin: 0,
            padding: 0,
            textAlign: 'center',
            fontSize: `calc(var(--r) * ${REVENUE.TYPE.title.fontSize})`,
            lineHeight: `calc(var(--r) * ${REVENUE.TYPE.title.lineHeight})`,
            fontWeight: REVENUE.TYPE.title.fontWeight || 500,
            letterSpacing: REVENUE.TYPE.title.letterSpacing || '-0.015em',
            color: REVENUE.COLORS.title,
          }}
        >
          {CONTENT.revenue.title}
        </h3>

        {/* Card Description */}
        <p
          data-part="description"
          style={{
            position: 'absolute',
            top: `calc(var(--r) * ${descTop})`,
            left: 0,
            right: 0,
            margin: '0 auto',
            maxWidth: `calc(var(--r) * ${REVENUE.TYPE.description.maxWidth})`,
            paddingLeft: `calc(var(--r) * ${REVENUE.TYPE.description.paddingX})`,
            paddingRight: `calc(var(--r) * ${REVENUE.TYPE.description.paddingX})`,
            boxSizing: 'border-box',
            textAlign: 'center',
            fontSize: `calc(var(--r) * ${REVENUE.TYPE.description.fontSize})`,
            lineHeight: `calc(var(--r) * ${REVENUE.TYPE.description.lineHeight})`,
            fontWeight: REVENUE.TYPE.description.fontWeight || 400,
            color: REVENUE.COLORS.description,
            textWrap: 'pretty',
          }}
        >
          {CONTENT.revenue.description}
        </p>
      </div>
    </article>
  );
}
