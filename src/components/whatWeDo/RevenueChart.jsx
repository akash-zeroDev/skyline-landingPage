import { useId } from 'react';
import { REVENUE } from './config';

/**
 * Pure helper to construct a polyline path with rounded corners (radius r).
 */
function buildRoundedPolyline(points, radius = 3.0) {
  if (!points || points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;

  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];

    // In-vector and out-vector
    const vIn = { x: curr.x - prev.x, y: curr.y - prev.y };
    const vOut = { x: next.x - curr.x, y: next.y - curr.y };

    const lenIn = Math.hypot(vIn.x, vIn.y);
    const lenOut = Math.hypot(vOut.x, vOut.y);

    const r = Math.min(radius, lenIn / 2, lenOut / 2);

    const startX = curr.x - (vIn.x / lenIn) * r;
    const startY = curr.y - (vIn.y / lenIn) * r;

    const endX = curr.x + (vOut.x / lenOut) * r;
    const endY = curr.y + (vOut.y / lenOut) * r;

    d += ` L ${startX.toFixed(2)} ${startY.toFixed(2)}`;
    d += ` Q ${curr.x.toFixed(2)} ${curr.y.toFixed(2)} ${endX.toFixed(2)} ${endY.toFixed(2)}`;
  }

  const last = points[points.length - 1];
  d += ` L ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
  return d;
}

/**
 * Pure helper to construct smooth cubic bezier for the secondary ghost line.
 */
function buildSmoothCurve(points) {
  if (!points || points.length === 0) return '';
  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < points.length - 2 ? points[i + 2] : p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
  }
  return d;
}

/**
 * RevenueChart: SVG component rendering the revenue growth chart.
 */
export default function RevenueChart() {
  const gradientId = useId();
  const clipId = useId();
  const { CHART, COLORS } = REVENUE;

  const mainLinePath = buildRoundedPolyline(CHART.vertices, CHART.joinRadius);
  const ghostLinePath = buildSmoothCurve(CHART.ghost.points);

  // Closed area path: line path + right edge down to y=108 + bottom edge to x=15 + close
  const lastVertex = CHART.vertices[CHART.vertices.length - 1];
  const firstVertex = CHART.vertices[0];
  const areaPath = `${mainLinePath} L ${lastVertex.x.toFixed(2)} ${CHART.areaBottomY.toFixed(2)} L ${firstVertex.x.toFixed(2)} ${CHART.areaBottomY.toFixed(2)} Z`;

  return (
    <svg
      role="img"
      aria-label="Chart showing revenue growing over time"
      viewBox="0 0 248.33 194"
      preserveAspectRatio="xMidYMid meet"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'visible',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      <defs>
        {/* Vertical fade gradient from line color to transparent at areaBottomY */}
        <linearGradient
          id={gradientId}
          x1="0"
          y1="30"
          x2="0"
          y2={CHART.areaBottomY.toString()}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={COLORS.chartAreaStart} />
          <stop offset="100%" stopColor={COLORS.chartAreaEnd} />
        </linearGradient>

        {/* Clip path for synchronous left-to-right area reveal */}
        <clipPath id={clipId}>
          <rect
            data-part="chart-area-clip"
            x="0"
            y="0"
            width="248.33"
            height="194"
          />
        </clipPath>
      </defs>

      {/* 1. Ghost secondary dashed line */}
      <path
        data-part="chart-ghost"
        d={ghostLinePath}
        fill="none"
        stroke={COLORS.ghostLine}
        strokeWidth={CHART.ghost.strokeWidth}
        strokeDasharray={CHART.ghost.dash}
        strokeLinecap="round"
        aria-hidden="true"
      />

      {/* 2. Main chart area fill with vertical gradient and left-to-right clipPath */}
      <path
        data-part="chart-area"
        d={areaPath}
        fill={`url(#${gradientId})`}
        clipPath={`url(#${clipId})`}
        stroke="none"
        aria-hidden="true"
      />

      {/* 3. Main chart series line */}
      <path
        data-part="chart-line"
        d={mainLinePath}
        fill="none"
        stroke={COLORS.chartLine}
        strokeWidth={CHART.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength="1"
      />

      {/* 4. Marker dot on peak vertex */}
      <circle
        data-part="chart-marker"
        cx={CHART.marker.cx}
        cy={CHART.marker.cy}
        r={CHART.marker.r}
        fill={COLORS.marker}
        stroke={COLORS.markerStroke}
        strokeWidth={CHART.marker.strokeWidth}
      />
    </svg>
  );
}
