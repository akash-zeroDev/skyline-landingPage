/**
 * BentoCard: Base shell surface for the 7 bento grid cards.
 * Provides the shared background gradient, subtle border, shadow, and corner radius.
 */
export default function BentoCard({
  slot,
  title,
  ariaLabel,
  className = '',
  style = {},
  children,
  ...rest
}) {
  return (
    <article
      data-slot={slot}
      aria-label={ariaLabel || title || slot}
      className={`wwd-card ${className}`}
      style={{
        position: 'relative',
        background: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 'calc(var(--r) * var(--card-radius))',
        boxShadow: 'var(--card-shadow)',
        boxSizing: 'border-box',
        overflow: 'visible',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
        ...style,
      }}
      {...rest}
    >
      {children}
    </article>
  );
}
