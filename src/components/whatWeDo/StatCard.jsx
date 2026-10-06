import { STAT, TYPE } from './config';
import { GoogleAdsIcon, InstagramIcon } from './icons';

/**
 * StatCard: Compact metric tile for slots "stat-a" and "stat-b" (Chunk 3 of 7).
 * Displays numeric value, raised superscript delta with screen-reader prefix,
 * and branded platform icon tile with secondary label.
 */
export default function StatCard({
  slot,
  stat,
  className = '',
  style = {},
  ...rest
}) {
  const isStatA = slot === 'stat-a';
  const numericCountTo = stat.value ? stat.value.replace(/[^0-9]/g, '') : '';

  return (
    <article
      data-slot={slot}
      aria-label={`${stat.value} with ${stat.delta} change for ${stat.label}`}
      className={`wwd-card wwd-card-stat ${className}`}
      style={{
        position: 'relative',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'calc(var(--r) * var(--card-radius))',
        boxShadow: 'var(--card-shadow)',
        boxSizing: 'border-box',
        overflow: 'hidden',
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

      {/* Row 1: Stat Value & Raised Delta */}
      <div
        style={{
          position: 'absolute',
          top: 'calc(var(--r) * 10)',
          left: 'calc(var(--r) * 10)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'baseline',
          gap: 'calc(var(--r) * 3)',
          whiteSpace: 'nowrap',
          lineHeight: 1,
        }}
      >
        <p
          data-part="stat-value"
          data-count-to={numericCountTo}
          data-prefix="$"
          data-format="comma"
          style={{
            margin: 0,
            padding: 0,
            fontSize: `calc(var(--r) * ${TYPE.statValue})`,
            lineHeight: `calc(var(--r) * ${TYPE.statValueLineHeight})`,
            fontWeight: 500,
            color: STAT.COLORS.value,
            fontFeatureSettings: '"tnum" 1',
            letterSpacing: '-0.02em',
          }}
        >
          {stat.value}
        </p>

        <span
          data-part="stat-delta"
          style={{
            display: 'inline-block',
            fontSize: `calc(var(--r) * ${TYPE.statDelta})`,
            lineHeight: `calc(var(--r) * ${TYPE.statDeltaLineHeight})`,
            fontWeight: 500,
            color: STAT.COLORS.delta,
            transform: 'translateY(calc(var(--r) * -8.5))',
            letterSpacing: '-0.01em',
          }}
        >
          <span className="sr-only">change </span>
          <span data-part="delta-text">{stat.delta}</span>
        </span>
      </div>

      {/* Row 2: Branded Platform Icon & Secondary Label */}
      <div
        style={{
          position: 'absolute',
          top: 'calc(var(--r) * 32)',
          left: 'calc(var(--r) * 9.5)',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 'calc(var(--r) * 6.75)',
          whiteSpace: 'nowrap',
        }}
      >
        <div data-part="stat-icon" aria-hidden="true" style={{ display: 'flex', flexShrink: 0 }}>
          {isStatA ? <GoogleAdsIcon /> : <InstagramIcon />}
        </div>

        <span
          data-part="stat-label"
          style={{
            margin: 0,
            padding: 0,
            fontSize: `calc(var(--r) * ${TYPE.statLabel})`,
            lineHeight: `calc(var(--r) * ${TYPE.statLabelLineHeight})`,
            fontWeight: 400,
            color: STAT.COLORS.label,
            letterSpacing: '-0.01em',
          }}
        >
          {stat.label}
        </span>
      </div>
    </article>
  );
}
