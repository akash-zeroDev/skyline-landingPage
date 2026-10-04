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
  social: {
    id: 'social',
    name: 'Social Media',
    watermark: 'Social',
    artboardWidth: 1536,
    artboardHeight: 1024,
    centerX: 777.6,
    centerY: 527.0,
    width: 176.8,
    height: 230.5,
    rotation: 25.5,
    borderRadius: 16,
    zIndex: 45,
    // Calibrated percentage coordinates for sub-pixel 1536x1024 alignment
    leftPct: (777.6 / 1536) * 100, // 50.625%
    topPct: (527.0 / 1024) * 100,  // 51.4648%
    widthPct: (176.8 / 1536) * 100, // 11.5104%
    heightPct: (230.5 / 1024) * 100, // 22.5098%
    spring: {
      stiffness: 60,
      damping: 14,
      mass: 1,
      delay: 0.95,
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

/**
 * Cursor Layout Configuration for Skyline Digital Media Hero Section
 * 
 * Target Measurements from Reference Image B:
 * - Tip Position: (473.0, 548.0) on 1536x1024
 * - Unrotated container size: 90x133.8
 * - Rotation: -15.0 deg
 */
export const CURSOR_LAYOUT = {
  id: 'cursor',
  artboardWidth: 1536,
  artboardHeight: 1024,
  tipX: 473.0,
  tipY: 548.0,
  width: 90.0,
  height: 133.8,
  rotation: -15.0,
  zIndex: 100, // Above L2 tray lip (z:60)
  leftPct: ((473.0 - 7.2) / 1536) * 100,
  topPct: ((548.0 - 7.2) / 1024) * 100,
  widthPct: (90.0 / 1536) * 100,
  heightPct: (133.8 / 1024) * 100,
  spring: {
    stiffness: 70,
    damping: 12,
    mass: 1,
    delay: 0.4,
  },
} as const;

/**
 * Toggle Layout & States Configuration for Skyline Digital Media Hero Section
 * 
 * Target Measurements from Reference Image B (ON) and Image C (OFF):
 * - Image C Canvas: 1536 x 1024 (aspect 3:2)
 * - Bezel bounds: width ~1293px, height ~543px (aspect ratio ~2.38:1)
 * - Track bounds: width ~1131px, height ~403px
 * - Knob diameter: 360px (bounding size in 1536x1024 asset space)
 * - Knob center ON: (392, 502)
 * - Knob center OFF: (1135, 502)
 * - Knob travel distance: 743px (206.38% of knob width, 65.69% of track length)
 * - Track OFF colors: vertical gradient from #d8dbe0 (top-center) to #c3c7cf (bottom/edges)
 * - Track ON colors: vivid green gradient
 * - Spring configuration: stiffness 380, damping 32, mass 0.9 (~400ms settle)
 */
export const TOGGLE_LAYOUT = {
  id: 'toggle',
  artboardWidth: 1536,
  artboardHeight: 1024,
  centerX: 1167.9,
  centerY: 368.2,
  width: 311.0,
  height: 207.33,
  rotation: 17.82, // +17.82 deg clockwise (left end higher)
  zIndex: 65, // above tray lip 60, below cursor 100
  leftPct: (1167.9 / 1536) * 100, // 76.0352%
  topPct: (368.2 / 1024) * 100,   // 35.9570%
  widthPct: (311.0 / 1536) * 100, // 20.2474%
  heightPct: (207.33 / 1024) * 100, // 20.2471%
  aspectRatio: '1536 / 1024',
  knobWidthPct: (400.0 / 1536) * 100, // 26.0417%
  knobHeightPct: (400.0 / 1024) * 100, // 39.0625%
  knobOnLeftPct: 15.7030,
  knobOnTopPct: 29.9258,
  knobTravelDistancePx: 605.0,
  knobTravelPctOfKnob: (605.0 / 380.0) * 100, // 159.2105%
  knobTravelPctOfTrack: (605.0 / 1098.0) * 100, // 55.1002%
  spring: {
    stiffness: 380,
    damping: 32,
    mass: 0.9,
  },
  entranceSpring: {
    stiffness: 80,
    damping: 12,
    mass: 1,
    delay: 1.8,
  },
  reducedMotionDuration: 0.12,
} as const;

export const TOGGLE_STATES = {
  on: {
    label: 'ON',
    trackOpacity: 1,
    knobX: '0%',
    ariaChecked: true,
  },
  off: {
    label: 'OFF',
    trackOpacity: 0,
    knobX: `${TOGGLE_LAYOUT.knobTravelPctOfKnob.toFixed(2)}%`,
    ariaChecked: false,
  },
} as const;

/**
 * Icon Cluster Layout Configuration for Skyline Digital Media Hero Section
 * 
 * Target Measurements from Reference Image B (staticHero.png, 1536x1024):
 * - Black Bolt Tile: Center (1104.0, 675.5), 145.3x145.2px, Rotation +10.1 deg
 * - Frosted Fingerprint Tile: Center (1200.0, 734.5), 153.2x151.3px, Rotation +7.4 deg
 * - Blue Lock Tile: Center (1315.7, 791.9), 153.0x153.0px, Rotation -5.9 deg
 * - Silver Padlock: Center (1347.0, 785.0), 102.0x144.0px, Rotation +21.4 deg
 * - Stacking: Black (z:55) -> Frosted (z:60) -> Blue (z:65) -> Padlock (z:70)
 */
export const ICON_CLUSTER_LAYOUT = {
  artboardWidth: 1536,
  artboardHeight: 1024,
  bolt: {
    id: 'bolt',
    centerX: 1084.1,
    centerY: 676.4,
    width: 212.6, // Asset has transparent padding (857px tile inside 1254px canvas -> 145.3px tile)
    height: 212.6,
    rotation: 10.1, // +10.1 deg clockwise
    borderRadiusPct: 22,
    zIndex: 55,
    leftPct: (1084.1 / 1536) * 100, // 70.5794%
    topPct: (676.4 / 1024) * 100,   // 66.0547%
    widthPct: (212.6 / 1536) * 100, // 13.8411%
    heightPct: (212.6 / 1024) * 100,// 20.7617%
    spring: {
      stiffness: 80,
      damping: 12,
      mass: 1,
      delay: 2.0,
    },
  },
  fingerprint: {
    id: 'fingerprint',
    centerX: 1206.4,
    centerY: 733.4,
    width: 153.2,
    height: 151.3,
    rotation: 7.4, // +7.4 deg clockwise
    borderRadiusPct: 22,
    zIndex: 60,
    leftPct: (1206.4 / 1536) * 100, // 78.5417%
    topPct: (733.4 / 1024) * 100,   // 71.6211%
    widthPct: (153.2 / 1536) * 100, // 9.9740%
    heightPct: (151.3 / 1024) * 100,// 14.7754%
    blurPx: 16,
    spring: {
      stiffness: 80,
      damping: 12,
      mass: 1,
      delay: 2.1,
    },
  },
  blue: {
    id: 'blue',
    centerX: 1320.7,
    centerY: 796.9,
    width: 153.0,
    height: 153.0,
    rotation: -5.9, // -5.9 deg counter-clockwise
    borderRadiusPct: 22,
    zIndex: 65,
    leftPct: (1320.7 / 1536) * 100, // 85.9831%
    topPct: (796.9 / 1024) * 100,   // 77.8223%
    widthPct: (153.0 / 1536) * 100, // 9.9609%
    heightPct: (153.0 / 1024) * 100,// 14.9414%
    spring: {
      stiffness: 80,
      damping: 12,
      mass: 1,
      delay: 2.2,
    },
  },
  padlock: {
    id: 'padlock',
    centerX: 1346.1,
    centerY: 747.6,
    width: 123.8, // 550px body inside 667px asset -> 102.0px body
    height: 144.8,
    rotation: 21.4, // +21.4 deg clockwise
    zIndex: 70,
    leftPct: (1346.1 / 1536) * 100, // 87.6367%
    topPct: (747.6 / 1024) * 100,   // 73.0078%
    widthPct: (123.8 / 1536) * 100, // 8.0599%
    heightPct: (144.8 / 1024) * 100,// 14.1406%
    spring: {
      stiffness: 80,
      damping: 12,
      mass: 1,
      delay: 2.25,
    },
  },
} as const;


