/**
 * Configuration and design tokens for the "What We Do" section.
 * Measurements calibrated against reference frames (862x566 px, 771 ref-px container).
 */

export const SECTION_ID = 'what-we-do';

export const DEBUG_GUIDES = false;

// 1. Semantic theme tokens (Light mode matching Skyline Digital Media palette)
export const TOKENS = {
  // Surface tokens
  cardBg: 'linear-gradient(180deg, #ffffff 0%, #fafafc 100%)',
  cardBorder: 'rgba(26, 15, 92, 0.07)',
  cardShadow: '0 1px 2px rgba(26, 15, 92, 0.04), 0 14px 32px -14px rgba(26, 15, 92, 0.12)',
  cardRadius: 14, // ref-px (corner radius measured on reference frames)

  // Typography tokens
  text1: '#111A5C', // deep navy indigo (primary site text)
  text2: '#5c5c70', // cool gray / secondary text (6.2:1 contrast against white)
  eyebrowText: '#111A5C',
  eyebrowDot: '#111A5C',

  // Accent palette (mapped from hero cards for later chunks)
  accent: '#111A5C',       // primary navy
  accentBlue: '#2b7ffb',   // Web design card blue
  accentGreen: '#19b954',  // App development card green
  accentYellow: '#fcc80c', // UI/UX card yellow
  accentOrange: '#fb6b07', // Social media card orange
  accentDark: '#1e1e1e',   // Branding card dark charcoal
};

// 2. Typography scale in ref-px
export const TYPE = {
  eyebrow: 8,
  headline: 30,
  subtext: 10.5,
  subtextLineHeight: 14,
  cardTitle: 16,
  cardDescription: 10.5,
  cardDescriptionLineHeight: 13.5, // verified line pitch from ref_4 (y: 140.5, 155.0, 168.5)
  statValue: 14.5, // measured from 10.0 ref-px cap height in ref_3 (3.3% update from chunk-1's 15)
  statValueLineHeight: 18,
  statDelta: 8, // raised superscript (+18%, +9%)
  statDeltaLineHeight: 10,
  statLabel: 10.5, // secondary platform label (Google Ads, Instagram)
  statLabelLineHeight: 14,
  fileName: 11, // file card document name
  fileNameLineHeight: 14,
  fileMeta: 8, // file card size text (7.1mb)
  fileMetaLineHeight: 11,
  button: 9.5, // pill button label (Preview)
  buttonLineHeight: 12,
  smallLabel: 9,
};

// 3. Section copy content
export const CONTENT = {
  eyebrow: 'WHAT WE DO',
  headline: 'We help brands grow smarter',
  subtext: 'A freelance digital studio crafting strategies for SEO, social media, paid ads, email marketing and next-gen web solutions.',
  revenue: {
    value: '5.8k',
    title: 'Boost Your Revenue',
    description: 'At Skyline, we drive qualified leads with optimized campaigns, delivering measurable growth for your business.',
  },
  stats: [
    { value: '$15,230', delta: '+18%', label: 'Google Ads' },
    { value: '$3,405', delta: '+9%', label: 'Instagram' }, // updated from '9%' to '+9%' as specified
  ],
  content: {
    title: 'Next-Level Content',
    description: 'From engaging social media visuals and interactive ads to stunning landing pages, we help brands capture attention and stand out in the ever-changing digital landscape.',
  },
  file: {
    name: 'Campaign_Report.pdf',
    size: '7.1mb',
    button: 'Preview',
  },
  ai: {
    placeholder: 'Name project',
    title: 'Stay Ahead with AI',
    description: 'With advanced AI insights, we optimize every touchpoint, from ad performance to detailed customer behavior analytics.',
    tagline: 'Stay ahead of the curve.',
  },
};

// 4. Exact Reference Geometry (measured from ref_2_cards_settled.png at 771 ref-px container width)
export const GEOMETRY = {
  containerWidth: 771,
  gridHeight: 269,
  columnGap: 13,
  rowGap: 10,
  columnWidth: 248.33,
  cards: {
    revenue: { slot: 'revenue', x: 0, y: 0, w: 248.33, h: 194, r: 14 },
    statA: { slot: 'stat-a', x: 0, y: 204, w: 119.17, h: 65, r: 14 },
    statB: { slot: 'stat-b', x: 129.17, y: 204, w: 119.17, h: 65, r: 14 },
    content: { slot: 'content', x: 261.33, y: 0, w: 248.33, h: 269, r: 14 },
    file: { slot: 'file', x: 522.67, y: 0, w: 248.33, h: 65, r: 14 },
    ai: { slot: 'ai', x: 522.67, y: 75, w: 248.33, h: 194, r: 14 },
  },
  header: {
    centerX: 385.5,
    eyebrow: {
      centerY: -114.5,
      dotSize: 5,
      fontSize: 8,
      letterSpacing: '0.12em',
      fontWeight: 600,
    },
    headline: {
      centerY: -88.5,
      fontSize: 30,
      capHeight: 21,
      fontWeight: 500,
      letterSpacing: '-0.02em',
      refWidth: 420,
    },
    subtext: {
      line1CenterY: -54.5,
      line2CenterY: -40.5,
      lineHeight: 14,
      fontSize: 10.5,
      maxWidth: 360,
    },
    gapToGrid: 34,
  },
  paddingTop: 45,
  paddingBottom: 110,
};

// 5. CHUNK 2: REVENUE CARD CONFIGURATION
export const REVENUE = {
  // Theme colors for light mode (converted from dark/orange reference)
  COLORS: {
    // Green number: hero green darkened to #0d8438 for 4.75:1 WCAG AA contrast on white
    number: '#0d8438',
    title: '#111A5C',
    description: '#5c5c70',
    chartLine: '#2b7ffb', // hero blue
    chartAreaStart: 'rgba(43, 127, 251, 0.32)',
    chartAreaEnd: 'rgba(43, 127, 251, 0.0)',
    marker: '#fb6b07', // hero orange
    markerStroke: '#ffffff',
    ghostLine: 'rgba(17, 26, 92, 0.25)', // faint indigo secondary line
    // Back plate: hero yellow softened with dashed border
    plateBg: 'linear-gradient(135deg, #fff7db 0%, #ffe68a 100%)',
    plateBorder: 'rgba(217, 164, 0, 0.70)',
    // Drop shadows for flat vs tilted states
    shadowFlat: '0 1px 2px rgba(26, 15, 92, 0.04), 0 14px 32px -14px rgba(26, 15, 92, 0.12)',
    shadowTilted: '0 calc(var(--r) * 18) calc(var(--r) * 36) calc(var(--r) * -10) rgba(26, 15, 92, 0.22), 0 calc(var(--r) * 2) calc(var(--r) * 6) rgba(26, 15, 92, 0.10)',
  },

  // Typography metrics in ref-px
  TYPE: {
    number: {
      fontSize: 19.5,
      lineHeight: 22,
      fontWeight: 400,
      left: 16.0,
      centerY: 27.5, // top: 16.5
    },
    title: {
      fontSize: 16.0,
      lineHeight: 20,
      fontWeight: 500,
      letterSpacing: '-0.015em',
      centerY: 114.0, // top: 104.0
      refWidth: 166.0,
    },
    description: {
      fontSize: 10.5,
      lineHeight: 13.5, // exact pitch from ref_4
      fontWeight: 400,
      maxWidth: 217.0, // first line width in ref_4
      paddingX: 15.5,
      line1CenterY: 140.5,
      line2CenterY: 155.0,
      line3CenterY: 168.5,
    },
  },

  // Chart paths and geometry (in 248.33 x 194 card coordinates)
  CHART: {
    // Main polyline vertices from pixel analysis of ref_4 (rounded joins, r ≈ 3)
    vertices: [
      { x: 15.0, y: 101.5 },
      { x: 40.0, y: 95.5 },
      { x: 53.5, y: 84.0 },
      { x: 75.0, y: 83.5 },
      { x: 92.0, y: 69.5 },
      { x: 115.0, y: 67.5 },
      { x: 120.0, y: 48.5 },
      { x: 132.5, y: 44.5 },
      { x: 155.0, y: 61.5 },
      { x: 167.0, y: 50.5 },
      { x: 188.5, y: 51.5 },
      { x: 203.5, y: 35.5 },
      { x: 229.5, y: 30.0 },
    ],
    strokeWidth: 1.1,
    joinRadius: 3.0,
    areaBottomY: 108.0, // area gradient fades to transparent by y=108

    // Marker dot position and radius
    marker: {
      cx: 132.5,
      cy: 44.5,
      r: 2.7,
      strokeWidth: 1.2,
    },

    // Ghost dashed secondary line
    ghost: {
      points: [
        { x: 20.0, y: 78.0 },
        { x: 50.0, y: 54.0 },
        { x: 85.0, y: 66.0 },
        { x: 110.0, y: 52.0 },
        { x: 145.0, y: 68.0 },
        { x: 185.0, y: 54.0 },
        { x: 225.0, y: 25.0 },
      ],
      strokeWidth: 0.8,
      dash: '2.2 2.2',
    },
  },

  // Dual Poses: flat and final tilted pose (measured from ref_4 and ref_3)
  POSE: {
    flat: {
      rotate: 0,
      x: 0,
      y: 0,
    },
    tilted: {
      rotate: -4.5, // deg CCW (measured: -4.50 deg)
      x: 13.5,      // ref-px translation of center
      y: -7.0,      // ref-px translation of center
    },
    default: 'tilted', // final reference state
  },

  // Back plate geometry & slivers (measured in ref_3)
  PLATE: {
    x: 0,
    y: 0,
    w: 248.33,
    h: 194.0,
    r: 14.0,
    leftSliver: 7.0,   // ref-px exposed on left
    bottomSliver: 19.5, // ref-px exposed at bottom
    borderDash: '3 2',
    borderWidth: 1.0,
  },

  // Reference corner coordinates of tilted face (for dev validation probes)
  TILTED_CORNERS: {
    TL: { x: 7.0, y: 3.5 },
    TR: { x: 252.5, y: -15.0 },
    BL: { x: 22.5, y: 196.5 },
    BR: { x: 268.0, y: 174.5 },
  },
};

// 6. Responsive Breakpoints (container query width)
export const BREAKPOINTS = {
  desktop: 900,
  tablet: 560,
};

// 7. CHUNK 3: STAT CARDS CONFIGURATION
export const STAT = {
  COLORS: {
    value: '#111A5C', // brand navy indigo (> 15:1 contrast on white)
    delta: '#58617d', // secondary navy-muted token (6.07:1 contrast on white, >= 4.5:1 WCAG AA)
    label: '#5c5c70', // secondary cool gray (6.21:1 contrast on white)
    tileBorder: 'rgba(26, 15, 92, 0.10)',
    tileShadow: '0 1px 2px rgba(26, 15, 92, 0.08)',
  },
  GEOMETRY: {
    cardWidth: 119.17,
    cardHeight: 65,
    row1: {
      top: 10.0,
      left: 10.5,
      valueCenterY: 19.5,
      deltaCenterY: 14.25, // 5.25 ref-px above value center
      gap: 3.0, // gap after value right edge
    },
    row2: {
      top: 32.0,
      left: 10.0,
      iconSize: 22.75,
      iconRadius: 5.0,
      iconCenterY: 43.5,
      labelCenterY: 44.75,
      gap: 6.75, // label starts at 10.0 + 22.75 + 6.75 = 39.5
    },
  },
};

// 8. CHUNK 3: FILE CARD CONFIGURATION
export const FILE = {
  COLORS: {
    name: '#111A5C', // brand navy indigo (15.9:1 contrast on white)
    meta: '#5c5c70', // secondary gray (6.21:1 contrast on white)
    buttonText: '#111A5C',
    buttonBorder: 'rgba(26, 15, 92, 0.18)',
    buttonHoverBg: 'rgba(26, 15, 92, 0.04)',
    buttonFocusRing: 'rgba(17, 26, 92, 0.60)',
    iconGradientStart: '#ff822e',
    iconGradientEnd: '#df5300',
  },
  GEOMETRY: {
    cardWidth: 248.33,
    cardHeight: 65,
    paddingLeft: 11.5,
    paddingRight: 11.33,
    icon: {
      size: 36.0,
      radius: 9.0,
      centerY: 33.0,
      gap: 7.0, // text column starts at 11.5 + 36.0 + 7.0 = 54.5
    },
    text: {
      left: 54.5,
      nameCenterY: 26.5,
      metaCenterY: 40.5,
    },
    button: {
      left: 175.0,
      width: 62.0,
      height: 25.5,
      radius: 13.0,
      centerY: 32.75,
      top: 20.0,
      labelWidth: 33.5,
    },
  },
};

// 9. CHUNK 4: CONTENT CARD CONFIGURATION
export const CONTENT_CARD = {
  COLORS: {
    title: '#111A5C', // brand navy indigo (15.9:1 contrast against white)
    description: '#5c5c70', // secondary text token (6.21:1 contrast against white)
    tileBg: '#f5f5fa', // quiet cool gray tile surface against white card
    tileBorder: 'rgba(26, 15, 92, 0.06)',
    tileHighlight: 'inset 0 1px 0 rgba(255, 255, 255, 0.90)',
    tileShadow: '0 1px 2px rgba(26, 15, 92, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.90)',
    probeTileBg: '#000000',
  },
  GEOMETRY: {
    cardWidth: 248.33,
    cardHeight: 269.0,
    iconRowsHeight: 137.0, // rows end at y 137
    tile: {
      width: 51.0,
      height: 51.0,
      radius: 12.0,
      pitchX: 61.0,
      pitchY: 61.0,
      gapX: 10.0,
      gapY: 10.0,
    },
    track: {
      tileCount: 7,
      width: 417.0, // 7 * 51 + 6 * 10 = 417 ref-px
      halfTrack: 208.5, // 417 / 2 = 208.5 ref-px (exact center anchor)
    },
    rows: [
      {
        id: '1',
        top: 24.0, // calibrated: 24r + 1px card border = 25.0 ref-px from outer card box
        height: 51.0,
        // Repeating cycle: [Figma, Photoshop, Webflow]
        // Centers: 2.2 (Webflow), 63.2 (Figma), 124.2 (Photoshop), 185.2 (Webflow), 246.2 (Figma)
        icons: ['photoshop', 'webflow', 'figma', 'photoshop', 'webflow', 'figma', 'photoshop'],
      },
      {
        id: '2',
        top: 85.0, // calibrated: 85r + 1px card border = 86.0 ref-px from outer card box
        height: 51.0,
        // Repeating cycle: [TikTok, Instagram, PowerPoint]
        // Centers: 2.2 (PowerPoint), 63.2 (TikTok), 124.2 (Instagram), 185.2 (PowerPoint), 246.2 (TikTok)
        icons: ['instagram', 'powerpoint', 'tiktok', 'instagram', 'powerpoint', 'tiktok', 'instagram'],
      },
    ],
    mask: {
      leftTransparent: 3.0,
      leftOpaque: 18.0,
      rightOpaque: 18.0,
      rightTransparent: 3.0,
    },
    title: {
      centerY: 175.25,
      fontSize: 16,
      lineHeight: 20,
      top: 164.75, // calibrated: 164.75r + 1px border = 165.75 - 10/2 => center y 175.25
      fontWeight: 500,
      letterSpacing: '0.005em',
      width: 161.25,
    },
    description: {
      firstLineCenterY: 201.75,
      linePitch: 13.8, // measured mathematical pitch between line centers: 201.75, 215.55, 229.35, 243.15
      fontSize: 10.5,
      lineHeight: 13.8,
      top: 193.85, // calibrated: 193.85r + 1px border + 13.8/2 => center y 201.75
      blockWidth: 216.0,
      fontWeight: 400,
      letterSpacing: '-0.01em',
    },
  },
};

/**
 * 7. AI Card Configuration (Chunk 5)
 * Calibrated against reference frames ref_3_final_tilted.png and ref_4_flat_pose_full_opacity.png
 * AI card origin in frame: (571.0, 297.25), box: 248.33 x 194.0 ref-px
 */
export const AI_CARD = {
  slot: 'ai',
  width: 248.33,
  height: 194.0,
  cardBorderRadius: 14.0,
  colors: {
    darkTeal: '#072a44',     // deep blue-teal top-left
    midAqua: '#0e6f7e',      // mid aqua
    brightMint: '#36d399',   // bright mint bottom glow
    heroBlue: '#2b7ffb',     // hero blue
    heroGreen: '#19b954',    // hero green
    pillBg: 'rgba(255, 255, 255, 0.20)',
    pillBorder: 'rgba(255, 255, 255, 0.35)',
    sparkleTileBg: 'rgba(255, 255, 255, 0.28)',
    sparkleTileBorder: 'rgba(255, 255, 255, 0.40)',
    caret: 'rgba(255, 255, 255, 0.90)',
    placeholder: 'rgba(255, 255, 255, 0.85)',
    shadow: '0 calc(var(--r) * 6) calc(var(--r) * 14) calc(var(--r) * -6) rgba(26, 15, 92, 0.18)',
  },
  panel: {
    left: 14.5, // 14.5 ref-px from outer card left (13.5r + 1px border)
    top: 14.25, // 14.25 ref-px from outer card top (13.25r + 1px border)
    width: 219.33,
    height: 60.0,
    radius: 11.0,
    cardLeft: 13.5,
    cardTop: 13.25,
  },
  pill: {
    panelLeft: 10.0, // 24.5 - 14.5 = 10.0 ref-px
    panelTop: 11.25, // 25.5 - 14.25 = 11.25 ref-px
    width: 199.33,
    height: 37.25,
    radius: 10.0,
  },
  sparkleTile: {
    pillLeft: 6.5, // calibrated for 1px pill border: 24.5 + 1.0 + 6.5 = 32.0 ref-px
    pillTop: 5.75, // calibrated for 1px pill border: 25.5 + 1.0 + 5.75 = 32.25 ref-px
    size: 23.0,
    radius: 6.0,
  },
  sparkleGlyph: {
    size: 14.0,
    stroke: 1.1,
  },
  caret: {
    pillLeft: 34.75, // calibrated for 1px pill border: 24.5 + 1.0 + 34.75 = 60.25 ref-px
    pillTop: 12.0,   // calibrated for 1px pill border: 25.5 + 1.0 + 12.0 = 38.5 ref-px
    width: 1.25,
    height: 11.75,
  },
  placeholder: {
    pillLeft: 37.0,  // calibrated for 1px pill border: 24.5 + 1.0 + 37.0 = 62.5 ref-px
    centerY: 18.25,  // 44.75 - 25.5 - 1.0 = 18.25 ref-px
    fontSize: 11.0,
    lineHeight: 14.0,
    top: 11.25,      // 18.25 - 7.0 = 11.25 ref-px (center y = 44.75 ref-px)
    width: 64.0,
    fontWeight: 400,
    letterSpacing: '-0.015em',
  },
  title: {
    centerX: 124.15,
    centerY: 100.25,
    fontSize: 16.0,
    lineHeight: 20.0,
    top: 89.25, // calibrated: 89.25r + 1px border + 10.0 = 100.25r center
    fontWeight: 500,
    letterSpacing: '0.005em',
    width: 156.75,
  },
  description: {
    firstLineCenterY: 126.5,
    linePitch: 13.75, // measured mathematical pitch between line centers: 126.5, 140.25, 154.0, 167.5
    fontSize: 10.5,
    lineHeight: 13.75,
    top: 118.625, // calibrated: 118.625r + 1px border + 13.75/2 = 126.5r center
    blockWidth: 217.5,
    fontWeight: 400,
    letterSpacing: '-0.01em',
  },
};

// 10. CHUNK 6: MOTION CONFIGURATION
export const MOTION = {
  // Global feature flags for optional extras (default false)
  EXTRAS: {
    hoverLift: false,
    chartDraw: false,
    countUp: false,
  },

  // Header word-by-word and elements timing
  header: {
    eyebrow: {
      duration: 0.4,
      delay: 0.0,
    },
    words: {
      duration: 0.4,
      baseDelay: 0.08,
      stagger: 0.09,
    },
    subtext: {
      duration: 0.4,
      delay: 0.55,
    },
  },

  // 7 Bento Cards entrance stagger
  cards: {
    yOffset: 10, // ref-px (+10r)
    duration: 0.85, // seconds
    // ease-out cubic for y: cubic-bezier(0.33, 1, 0.68, 1)
    cubicBezier: [0.33, 1, 0.68, 1],
    delays: {
      revenue: 0.38,
      content: 0.63,
      'stat-a': 0.75,
      file: 0.75,
      'stat-b': 0.95,
      ai: 1.05,
    },
  },

  // Revenue card tilt sequence
  tilt: {
    delay: 2.10, // seconds from section trigger
    spring: {
      stiffness: 220,
      damping: 19,
      mass: 1,
    },
    target: {
      rotate: -4.5, // deg CCW (matches REVENUE.POSE.tilted.rotate)
      x: 13.5,      // ref-px translation (matches REVENUE.POSE.tilted.x)
      y: -7.0,      // ref-px translation (matches REVENUE.POSE.tilted.y)
    },
    plateFadeDuration: 0.35, // seconds for yellow plate opacity 0 -> 1
  },
};


