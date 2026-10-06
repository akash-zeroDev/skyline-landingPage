import { GEOMETRY, TYPE, REVENUE, STAT, FILE, CONTENT_CARD, AI_CARD } from '../../src/components/whatWeDo/config.js';
import { createContext } from './browser-helper.mjs';

export async function runGeometrySuite(browser, baseUrl) {
  const results = [];

  function record(id, measured, threshold, passed, details = '') {
    results.push({
      id: `GEOMETRY_${id}`,
      suite: 'GEOMETRY',
      measured,
      threshold,
      passed,
      details,
    });
  }

  const context = await createContext(browser, { viewport: { width: 862, height: 566 } });
  const page = await context.newPage();

  // 1. Reference Mode: 7 Slot Boxes vs GEOMETRY (?ref=1&anim=off&pose=tilted)
  await page.goto(`${baseUrl}/?ref=1&anim=off&pose=tilted`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);

  const slotBoxes = await page.evaluate((expectedCards) => {
    const grid = document.querySelector('.wwd-grid');
    const gb = grid.getBoundingClientRect();

    const data = {};
    for (const [key, exp] of Object.entries(expectedCards)) {
      const el = document.querySelector(`[data-slot="${exp.slot}"]`);
      if (!el) continue;
      const b = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      data[key] = {
        x: Math.round((b.left - gb.left) * 100) / 100,
        y: Math.round((b.top - gb.top) * 100) / 100,
        w: Math.round(b.width * 100) / 100,
        h: Math.round(b.height * 100) / 100,
        r: parseFloat(style.borderRadius) || 0,
      };
    }
    return data;
  }, GEOMETRY.cards);

  for (const [key, exp] of Object.entries(GEOMETRY.cards)) {
    const act = slotBoxes[key];
    if (!act) {
      record(`SLOT_${key}`, 'missing', 'rendered', false, `Card [data-slot="${exp.slot}"] not found`);
      continue;
    }
    const dx = Math.abs(act.x - exp.x);
    const dy = Math.abs(act.y - exp.y);
    const dw = Math.abs(act.w - exp.w);
    const dh = Math.abs(act.h - exp.h);
    const dr = Math.abs(act.r - exp.r);

    const posPass = dx <= 2.0 && dy <= 2.0;
    const sizePass = dw <= 2.0 && dh <= 2.0;
    const rPass = dr <= 1.0;

    record(
      `SLOT_${key}_POS`,
      `(${act.x}, ${act.y})`,
      `(${exp.x}, ${exp.y}) +/-2`,
      posPass,
      `dx=${dx.toFixed(2)}, dy=${dy.toFixed(2)}`
    );
    record(
      `SLOT_${key}_SIZE`,
      `${act.w}x${act.h}`,
      `${exp.w}x${exp.h} +/-2`,
      sizePass,
      `dw=${dw.toFixed(2)}, dh=${dh.toFixed(2)}`
    );
    record(
      `SLOT_${key}_RADIUS`,
      `${act.r}px`,
      `${exp.r}px +/-1`,
      rPass,
      `dr=${dr.toFixed(2)}`
    );
  }

  // 2. Header alignment and font sizes
  const headerMetrics = await page.evaluate((expectedHeader) => {
    const h2 = document.getElementById('wwd-headline');
    const eyebrow = document.querySelector('[data-slot="eyebrow"]');
    const subtext = document.querySelector('[data-slot="subtext"]');
    const container = document.querySelector('.wwd-container');

    const cb = container.getBoundingClientRect();
    const cMidX = cb.left + cb.width / 2;

    const hb = h2 ? h2.getBoundingClientRect() : null;
    const eb = eyebrow ? eyebrow.getBoundingClientRect() : null;
    const sb = subtext ? subtext.getBoundingClientRect() : null;

    const grid = document.querySelector('.wwd-grid');
    const gb = grid.getBoundingClientRect();

    return {
      h2MidXDiff: hb ? Math.abs((hb.left + hb.width / 2) - cMidX) : null,
      ebMidXDiff: eb ? Math.abs((eb.left + eb.width / 2) - cMidX) : null,
      sbMidXDiff: sb ? Math.abs((sb.left + sb.width / 2) - cMidX) : null,
      h2CenterY: hb ? (hb.top + hb.height / 2) - gb.top : null,
      ebCenterY: eb ? (eb.top + eb.height / 2) - gb.top : null,
      h2FontSize: hb ? parseFloat(window.getComputedStyle(h2).fontSize) : null,
      ebFontSize: eb ? parseFloat(window.getComputedStyle(eyebrow).fontSize) : null,
      sbFontSize: sb ? parseFloat(window.getComputedStyle(subtext).fontSize) : null,
    };
  }, GEOMETRY.header);

  record('HEADER_CENTERING', `${headerMetrics.h2MidXDiff?.toFixed(2)}px diff`, '<= 2.0px', (headerMetrics.h2MidXDiff || 0) <= 2.0);
  record('HEADER_HEADLINE_FONT', `${headerMetrics.h2FontSize}px`, `${TYPE.headline}px`, headerMetrics.h2FontSize === TYPE.headline);
  record('HEADER_EYEBROW_FONT', `${headerMetrics.ebFontSize}px`, `${TYPE.eyebrow}px`, headerMetrics.ebFontSize === TYPE.eyebrow);
  record('HEADER_SUBTEXT_FONT', `${headerMetrics.sbFontSize}px`, `${TYPE.subtext}px`, headerMetrics.sbFontSize === TYPE.subtext);

  // 3. Revenue Card: Flat Pose (?pose=flat) vs Tilted Pose (?pose=tilted)
  await page.goto(`${baseUrl}/?ref=1&anim=off&pose=flat`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(300);

  const revFlatData = await page.evaluate(() => {
    const card = document.querySelector('[data-slot="revenue"]');
    const face = card.querySelector('[data-part="face"]');
    const num = card.querySelector('[data-part="number"]');
    const title = card.querySelector('[data-part="title"]');
    const desc = card.querySelector('[data-part="description"]');
    const plate = card.querySelector('[data-part="plate"]');

    const cb = card.getBoundingClientRect();
    const nb = num.getBoundingClientRect();
    const tb = title.getBoundingClientRect();
    const db = desc.getBoundingClientRect();

    const tf = window.getComputedStyle(face).transform;
    const plateOp = parseFloat(window.getComputedStyle(plate).opacity);

    return {
      numX: nb.left - cb.left,
      numCenterY: (nb.top + nb.height / 2) - cb.top,
      titleCenterY: (tb.top + tb.height / 2) - cb.top,
      descY: db.top - cb.top,
      transform: tf,
      plateOpacity: plateOp,
    };
  });

  record('REV_FLAT_NUM_POS', `(${revFlatData.numX.toFixed(1)}, ${revFlatData.numCenterY.toFixed(1)})`, `(${REVENUE.TYPE.number.left}, ${REVENUE.TYPE.number.centerY}) +/-2`, Math.abs(revFlatData.numX - REVENUE.TYPE.number.left) <= 2 && Math.abs(revFlatData.numCenterY - REVENUE.TYPE.number.centerY) <= 2);
  record('REV_FLAT_PLATE_OPACITY', revFlatData.plateOpacity, 0, revFlatData.plateOpacity === 0);

  // Switch to tilted pose
  await page.goto(`${baseUrl}/?ref=1&anim=off&pose=tilted`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(300);

  const revTiltedData = await page.evaluate(() => {
    const card = document.querySelector('[data-slot="revenue"]');
    const face = card.querySelector('[data-part="face"]');
    const plate = card.querySelector('[data-part="plate"]');
    const tf = window.getComputedStyle(face).transform;
    const plateOp = parseFloat(window.getComputedStyle(plate).opacity);
    const fb = face.getBoundingClientRect();
    const cb = card.getBoundingClientRect();

    let rot = 0;
    const parts = tf.match(/matrix.*\((.+)\)/);
    if (parts && parts[1]) {
      const vals = parts[1].split(',').map(v => parseFloat(v.trim()));
      rot = Math.atan2(vals[1], vals[0]) * (180 / Math.PI);
    }

    return {
      rot: Math.round(rot * 100) / 100,
      plateOpacity: plateOp,
      faceWidth: fb.width,
      faceHeight: fb.height,
      centerDx: (fb.left + fb.width / 2) - (cb.left + cb.width / 2),
      centerDy: (fb.top + fb.height / 2) - (cb.top + cb.height / 2),
    };
  });

  const rotDiff = Math.abs(revTiltedData.rot - REVENUE.POSE.tilted.rotate);
  record('REV_TILTED_ROTATION', `${revTiltedData.rot}°`, `${REVENUE.POSE.tilted.rotate}° +/-0.5°`, rotDiff <= 0.5);
  record('REV_TILTED_PLATE_OPACITY', revTiltedData.plateOpacity, 1.0, revTiltedData.plateOpacity === 1.0);

  // 4. Content Card Probes & Mask Ramp (?probe=1)
  await page.goto(`${baseUrl}/?ref=1&anim=off&probe=1`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(300);

  const contentProbes = await page.evaluate(() => {
    const card = document.querySelector('[data-slot="content"]');
    const title = card.querySelector('[data-part="title"]');
    const desc = card.querySelector('[data-part="description"]');
    const tiles = Array.from(card.querySelectorAll('[data-part~="icon-tile"], [data-part~="tile"]'));

    const cb = card.getBoundingClientRect();
    const tb = title.getBoundingClientRect();
    const db = desc.getBoundingClientRect();

    return {
      titleCenterY: (tb.top + tb.height / 2) - cb.top,
      descY: db.top - cb.top,
      tileCount: tiles.length,
      firstTileWidth: tiles[0] ? tiles[0].getBoundingClientRect().width : 0,
      firstTileHeight: tiles[0] ? tiles[0].getBoundingClientRect().height : 0,
    };
  });

  record('CONTENT_TITLE_Y', `${contentProbes.titleCenterY.toFixed(2)}r`, `${CONTENT_CARD.GEOMETRY.title.centerY}r +/-2`, Math.abs(contentProbes.titleCenterY - CONTENT_CARD.GEOMETRY.title.centerY) <= 2.0);
  record('CONTENT_TILE_SIZE', `${contentProbes.firstTileWidth}x${contentProbes.firstTileHeight}`, `${CONTENT_CARD.GEOMETRY.tile.width}x${CONTENT_CARD.GEOMETRY.tile.height} +/-1.5`, Math.abs(contentProbes.firstTileWidth - CONTENT_CARD.GEOMETRY.tile.width) <= 1.5);

  // 5. AI Card metrics
  const aiMetrics = await page.evaluate(() => {
    const card = document.querySelector('[data-slot="ai"]');
    const panel = card.querySelector('[data-part="glow-panel"]');
    const pill = card.querySelector('[data-part~="input-pill"], [data-part~="input-mock"]');
    const title = card.querySelector('[data-part="title"]');

    const cb = card.getBoundingClientRect();
    const pb = panel ? panel.getBoundingClientRect() : null;
    const plb = pill ? pill.getBoundingClientRect() : null;
    const tb = title ? title.getBoundingClientRect() : null;

    return {
      panelW: pb ? pb.width : 0,
      panelH: pb ? pb.height : 0,
      pillW: plb ? plb.width : 0,
      pillH: plb ? plb.height : 0,
      titleCenterY: tb ? (tb.top + tb.height / 2) - cb.top : 0,
    };
  });

  record('AI_PANEL_SIZE', `${aiMetrics.panelW}x${aiMetrics.panelH}`, `${AI_CARD.panel.width}x${AI_CARD.panel.height} +/-2`, Math.abs(aiMetrics.panelW - AI_CARD.panel.width) <= 2.0 && Math.abs(aiMetrics.panelH - AI_CARD.panel.height) <= 2.0);
  record('AI_PILL_SIZE', `${aiMetrics.pillW}x${aiMetrics.pillH}`, `${AI_CARD.pill.width}x${AI_CARD.pill.height} +/-2`, Math.abs(aiMetrics.pillW - AI_CARD.pill.width) <= 2.0 && Math.abs(aiMetrics.pillH - AI_CARD.pill.height) <= 2.0);
  record('AI_TITLE_Y', `${aiMetrics.titleCenterY.toFixed(2)}r`, `${AI_CARD.title.centerY}r +/-2`, Math.abs(aiMetrics.titleCenterY - AI_CARD.title.centerY) <= 2.0);

  // 6. Scale Invariance (container widths 900, 1160, 1400, 1800)
  for (const w of [900, 1160, 1400, 1800]) {
    const vpW = w === 900 ? 940 : w;
    await page.setViewportSize({ width: vpW, height: 900 });
    await page.goto(`${baseUrl}/?anim=off`, { waitUntil: 'domcontentloaded' });
    const ratioData = await page.evaluate(() => {
      const container = document.querySelector('.wwd-container');
      const contentCard = document.querySelector('[data-slot="content"]');
      const cb = container.getBoundingClientRect();
      const ccb = contentCard.getBoundingClientRect();
      const r = cb.width / 771;
      const refW = ccb.width / r;
      return { r, refW };
    });

    const diff = Math.abs(ratioData.refW - GEOMETRY.cards.content.w);
    record(`SCALE_${w}PX`, `${ratioData.refW.toFixed(2)} ref-px`, `${GEOMETRY.cards.content.w} +/-1`, diff <= 1.0, `containerW=${w}, r=${ratioData.r.toFixed(3)}`);
  }

  await context.close();
  return results;
}
