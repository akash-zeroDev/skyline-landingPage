const ACCENTS = new Set(['blue', 'green', 'orange', 'yellow']);

function getInitials(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

function Stars() {
  return (
    <div className="testimonial-stars" role="img" aria-label="Rated 5 out of 5">
      {[0, 1, 2, 3, 4].map((index) => (
        <svg
          key={index}
          viewBox="0 0 20 20"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M10 1.6l2.53 5.13 5.66.82-4.1 4 .97 5.64L10 14.52l-5.06 2.67.97-5.64-4.1-4 5.66-.82L10 1.6Z" />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialCard({ testimonial }) {
  const { name, role, company, quote, result, accent, avatar, featured } =
    testimonial;

  const accentName = ACCENTS.has(accent) ? accent : 'blue';
  const className = [
    'testimonial-card',
    `testimonial-card--${accentName}`,
    featured ? 'testimonial-card--featured' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <figure className={className}>
      {featured ? (
        <span className="testimonial-quote-mark" aria-hidden="true">
          “
        </span>
      ) : null}

      <Stars />

      <blockquote className="testimonial-quote">
        <p>{quote}</p>
      </blockquote>

      <figcaption className="testimonial-footer">
        <span className="testimonial-result">{result}</span>

        <span className="testimonial-person">
          {avatar ? (
            <img
              className="testimonial-avatar"
              src={avatar}
              alt=""
              width="44"
              height="44"
              loading="lazy"
            />
          ) : (
            <span className="testimonial-avatar" aria-hidden="true">
              {getInitials(name)}
            </span>
          )}

          <span className="testimonial-meta">
            <strong className="testimonial-name">{name}</strong>
            <span className="testimonial-role">
              {role} · {company}
            </span>
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
