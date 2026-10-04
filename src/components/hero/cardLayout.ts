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
} as const;

export default CARD_LAYOUT;
