/**
 * Central Card Layout Configuration for Skyline Digital Media Hero Section
 * 
 * Master Artboard: 1536 x 1024 (aspect ratio 3:2)
 * 
 * Target Measurements from Reference Image:
 * - Center: (177.5, 291.5)
 * - Width: 143.0, Height: 196.0
 * - Rotation: -24.4 deg
 * - Corner Radius: 16px
 * - Z-Index: 10
 */

export interface CardConfig {
  id: string;
  name: string;
  watermark: string;
  artboardWidth: number;
  artboardHeight: number;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  rotation: number;
  skewX?: number;
  borderRadius: number;
  zIndex: number;
  leftPct: number;
  topPct: number;
  widthPct: number;
  heightPct: number;
  spring: {
    stiffness: number;
    damping: number;
    mass: number;
    delay: number;
  };
}

export const CARD_LAYOUT = {
  uiUx: {
    id: 'uiUx',
    name: 'UI/UX Design',
    watermark: 'Design',
    artboardWidth: 1536,
    artboardHeight: 1024,
    centerX: 177.5,
    centerY: 291.5,
    width: 144.2,
    height: 199.0,
    rotation: -24.4,
    borderRadius: 16,
    zIndex: 10,
    // Calibrated percentage coordinates for sub-pixel 1536x1024 alignment
    leftPct: (178.8 / 1536) * 100, // 11.641%
    topPct: (294.8 / 1024) * 100,  // 28.789%
    widthPct: (144.2 / 1536) * 100, // 9.388%
    heightPct: (199.0 / 1024) * 100, // 19.434%
    spring: {
      stiffness: 60,
      damping: 14,
      mass: 1,
      delay: 0.2,
    },
  },
  seo: {
    id: 'seo',
    name: 'SEO',
    watermark: 'SEO',
    artboardWidth: 1536,
    artboardHeight: 1024,
    centerX: 327.0,
    centerY: 348.5,
    width: 172.0,
    height: 230.5,
    rotation: 9.8,
    borderRadius: 16,
    zIndex: 20,
    // Calibrated percentage coordinates for sub-pixel 1536x1024 alignment
    leftPct: (327.0 / 1536) * 100, // 21.2891%
    topPct: (348.5 / 1024) * 100,  // 34.0332%
    widthPct: (172.0 / 1536) * 100, // 11.1979%
    heightPct: (230.5 / 1024) * 100, // 22.5098%
    spring: {
      stiffness: 60,
      damping: 14,
      mass: 1,
      delay: 0.35,
    },
  },
  branding: {
    id: 'branding',
    name: 'Branding',
    watermark: 'Brand',
    artboardWidth: 1536,
    artboardHeight: 1024,
    centerX: 467.2,
    centerY: 442.4,
    width: 214.5,
    height: 288.5,
    rotation: -18.6,
    borderRadius: 16,
    zIndex: 30,
    // Calibrated percentage coordinates for sub-pixel 1536x1024 alignment
    leftPct: (467.2 / 1536) * 100, // 30.4167%
    topPct: (442.4 / 1024) * 100,  // 43.2031%
    widthPct: (214.5 / 1536) * 100, // 13.9648%
    heightPct: (288.5 / 1024) * 100, // 28.1738%
    spring: {
      stiffness: 60,
      damping: 14,
      mass: 1,
      delay: 0.5,
    },
  },
  app: {
    id: 'app',
    name: 'App Dev',
    watermark: 'App',
    artboardWidth: 1536,
    artboardHeight: 1024,
    centerX: 506.0,
    centerY: 500.2,
    width: 186.5,
    height: 254.1,
    rotation: -1.65,
    skewX: -16.5,
    borderRadius: 16,
    zIndex: 40,
    // Calibrated percentage coordinates for sub-pixel 1536x1024 alignment
    leftPct: (506.0 / 1536) * 100, // 32.9427%
    topPct: (500.2 / 1024) * 100,  // 48.8477%
    widthPct: (186.5 / 1536) * 100, // 12.1419%
    heightPct: (254.1 / 1024) * 100, // 24.8145%
    spring: {
      stiffness: 60,
      damping: 14,
      mass: 1,
      delay: 0.65,
    },
  },
  web: {
    id: 'web',
    name: 'Web Design',
    watermark: '</> Web',
    artboardWidth: 1536,
    artboardHeight: 1024,
    centerX: 687.0,
    centerY: 501.0,
    width: 208.5,
    height: 289.0,
    rotation: -32.0,
    borderRadius: 16,
    zIndex: 50,
    // Calibrated percentage coordinates for sub-pixel 1536x1024 alignment
    leftPct: (687.0 / 1536) * 100, // 44.7266%
    topPct: (501.0 / 1024) * 100,  // 48.9258%
    widthPct: (208.5 / 1536) * 100, // 13.5742%
    heightPct: (289.0 / 1024) * 100, // 28.2227%
    spring: {
      stiffness: 60,
      damping: 14,
      mass: 1,
      delay: 0.8,
    },
  },
} as const;

/**
 * Tray Layout Configuration for Skyline Digital Media Hero Section
 * 
 * Master Artboard: 1536 x 1024
 * 
 * Target Measurements from Reference Image B:
 * - Outer Bounding Box: x in [367.0, 917.0], y in [411.0, 552.0]
 * - Outer Center: (642.0, 481.5)
 * - Outer Width: 550.0px, Outer Height: 141.0px
 * - Corner Radius: 31px (outer), 21px (inner)
 * - Rim Thickness: ~10px
 * - Rotation: 0.0 deg
 * - Clip Line: Y = 547.0px (vertical centerline of front lip)
 */
export const TRAY_CLIP_Y = 547.0;
export const TRAY_CLIP_LINE_PCT = (TRAY_CLIP_Y / 1024) * 100; // 53.4180%

export const TRAY_LAYOUT = {
  id: 'tray',
  name: 'Wallet Slot Tray',
  artboardWidth: 1536,
  artboardHeight: 1024,
  centerX: 642.0,
  centerY: 481.5,
  width: 550.5,
  height: 141.0,
  rotation: 0.0,
  borderRadius: 31,
  rimThickness: 10,
  clipY: TRAY_CLIP_Y,
  clipLinePct: TRAY_CLIP_LINE_PCT,
  leftPct: (642.0 / 1536) * 100, // 41.7969%
  topPct: (481.5 / 1024) * 100,  // 47.0215%
  widthPct: (550.5 / 1536) * 100, // 35.8398%
  heightPct: (141.0 / 1024) * 100, // 13.7695%
  zIndex: {
    shadow: 2,
    back: 5,
    cards: 10,
    front: 60,
  },
  spring: {
    stiffness: 80,
    damping: 15,
    mass: 1,
    delay: 0.1,
  },
} as const;

export default CARD_LAYOUT;
