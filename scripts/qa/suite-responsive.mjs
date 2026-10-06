import { createContext } from './browser-helper.mjs';

export async function runResponsiveSuite(browser, baseUrl, shotsDir = 'qa-report/shots') {
  const results = [];

  function record(id, measured, threshold, passed, details = '') {
    results.push({
      id: `RESPONSIVE_${id}`,
      suite: 'RESPONSIVE',
      measured,
      threshold,
      passed,
      details,
    });
  }

  const viewports = [
    { w: 320, h: 640, name: '320x640' },
    { w: 375, h: 667, name: '375x667' },
    { w: 390, h: 844, name: '390x844' },
    { w: 414, h: 896, name: '414x896' },
    { w: 600, h: 900, name: '600x900' },
    { w: 768, h: 1024, name: '768x1024' },
    { w: 820, h: 1180, name: '820x1180' },
    { w: 899, h: 800, name: '899x800' },
    { w: 900, h: 800, name: '900x800' },
    { w: 1024, h: 768, name: '1024x768' },
    { w: 1280, h: 800, name: '1280x800' },
    { w: 1440, h: 900, name: '1440x900' },
    { w: 1536, h: 960, name: '1536x960' },
    { w: 1920, h: 1080, name: '1920x1080' },
    { w: 2560, h: 1440, name: '2560x1440' },
    { w: 844, h: 390, name: 'landscape_844x390' },
  ];

  const zoomConfigs = [
    { w: 640, h: 400, dsf: 1, name: 'zoom_200pct_viewport_640x400' },
    { w: 1280, h: 800, dsf: 2, name: 'zoom_200pct_retina_1280x800' },
  ];

  for (const vp of viewports) {
    const context = await createContext(browser, { viewport: { width: vp.w, height: vp.h } });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/?anim=off`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(200);

    const data = await page.evaluate(() => {
      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;
      const noHScroll = docW <= winW + 1; // 1px rounding margin

      // Check text clipping
      const textEls = Array.from(document.querySelectorAll('#what-we-do p, #what-we-do h2, #what-we-do h3, #what-we-do span'));
      const clipped = textEls.filter((el) => {
        if (el.classList.contains('sr-only')) return false;
        if (window.getComputedStyle(el).textOverflow === 'ellipsis') return false;
        return el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 2;
      }).map((el) => el.textContent?.slice(0, 20));

      // Check text minimum sizes
      const minSizes = textEls.map((el) => {
        if (el.classList.contains('sr-only') || el.classList.contains('wwd-eyebrow-dot')) return 999;
        return parseFloat(window.getComputedStyle(el).fontSize) || 999;
      });
      const minFontSize = Math.min(...minSizes);

      // Check container layout
      const container = document.querySelector('.wwd-container');
      const cw = container ? container.getBoundingClientRect().width : 0;
      const grid = document.querySelector('.wwd-grid');
      const cols = grid ? window.getComputedStyle(grid).gridTemplateColumns.split(' ').length : 0;

      // Pairwise overlap check among card slots
      const slots = ['revenue', 'stat-a', 'stat-b', 'content', 'file', 'ai'];
      const slotBoxes = slots.map((s) => {
        const el = document.querySelector(`[data-slot="${s}"]`);
        return { slot: s, rect: el ? el.getBoundingClientRect() : null };
      }).filter((s) => s.rect);

      const overlaps = [];
      for (let i = 0; i < slotBoxes.length; i++) {
        for (let j = i + 1; j < slotBoxes.length; j++) {
          const r1 = slotBoxes[i].rect;
          const r2 = slotBoxes[j].rect;
          // Intersection rectangle
          const xLeft = Math.max(r1.left, r2.left);
          const xRight = Math.min(r1.right, r2.right);
          const yTop = Math.max(r1.top, r2.top);
          const yBottom = Math.min(r1.bottom, r2.bottom);
          if (xRight > xLeft && yBottom > yTop) {
            overlaps.push(`${slotBoxes[i].slot} & ${slotBoxes[j].slot}`);
          }
        }
      }

      return {
        docW,
        winW,
        noHScroll,
        clippedCount: clipped.length,
        clippedSamples: clipped.slice(0, 3),
        minFontSize,
        containerW: cw,
        cols,
        overlapCount: overlaps.length,
        overlaps,
      };
    });

    record(`HSCROLL_${vp.name}`, `scrollW=${data.docW}, winW=${data.winW}`, 'scrollW <= winW', data.noHScroll);
    record(`TEXT_CLIPPING_${vp.name}`, `${data.clippedCount} clipped`, '0 clipped', data.clippedCount === 0, data.clippedSamples.join('; '));
    record(`MIN_FONT_${vp.name}`, `${data.minFontSize}px`, '>= 10.5px (>=11px micro)', data.minFontSize >= 10.5);
    record(`SLOT_OVERLAPS_${vp.name}`, `${data.overlapCount} overlaps`, '0 slot overlaps', data.overlapCount === 0, data.overlaps.join(', '));

    // Capture screenshot into qa-report/shots/
    const section = await page.$('#what-we-do');
    if (section) {
      try {
        await section.screenshot({ path: `${shotsDir}/responsive_${vp.name}.png`, timeout: 3000 });
      } catch (e) {
        // Continue if font wait timed out
      }
    }

    await context.close();
  }

  // 2. Zoom test
  for (const z of zoomConfigs) {
    const context = await createContext(browser, {
      viewport: { width: z.w, height: z.h },
      deviceScaleFactor: z.dsf,
    });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/?anim=off`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(200);

    const noHScroll = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1);
    record(`ZOOM_HSCROLL_${z.name}`, noHScroll ? 'no scroll' : 'scroll detected', 'no horizontal scroll', noHScroll);

    const section = await page.$('#what-we-do');
    if (section) {
      try {
        await section.screenshot({ path: `${shotsDir}/${z.name}.png`, timeout: 3000 });
      } catch (e) {
        // Continue if font wait timed out
      }
    }

    await context.close();
  }

  // 3. Touch target on Preview button
  const touchContext = await createContext(browser, { viewport: { width: 390, height: 844 } });
  const touchPage = await touchContext.newPage();
  await touchPage.goto(`${baseUrl}/?anim=off`, { waitUntil: 'domcontentloaded' });
  await touchPage.waitForSelector('.wwd-file-preview-btn');

  const touchData = await touchPage.evaluate(() => {
    const btn = document.querySelector('.wwd-file-preview-btn');
    if (!btn) return { w: 0, h: 0 };
    const b = btn.getBoundingClientRect();
    return { w: b.width, h: b.height };
  });

  const touchPass = touchData.w >= 24 && touchData.h >= 24;
  record('TOUCH_TARGET_PREVIEW_BTN', `${touchData.w.toFixed(1)}x${touchData.h.toFixed(1)}px`, '>= 24x24px', touchPass);

  await touchContext.close();
  return results;
}
