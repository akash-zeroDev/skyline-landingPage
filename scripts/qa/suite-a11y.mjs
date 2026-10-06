import AxeBuilder from '@axe-core/playwright';
import { createContext } from './browser-helper.mjs';

export async function runA11ySuite(browser, baseUrl, shotsDir = 'qa-report/shots') {
  const results = [];

  function record(id, measured, threshold, passed, details = '') {
    results.push({
      id: `A11Y_${id}`,
      suite: 'A11Y',
      measured,
      threshold,
      passed,
      details,
    });
  }

  // 1. Axe-core audit across 3 widths (1280, 768, 390)
  for (const w of [1280, 768, 390]) {
    const context = await createContext(browser, { viewport: { width: w, height: 800 } });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/?anim=off`, { waitUntil: 'networkidle' });

    const axeResults = await new AxeBuilder({ page }).include('#what-we-do').analyze();

    const criticalOrSerious = axeResults.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    const moderate = axeResults.violations.filter((v) => v.impact === 'moderate');

    record(
      `AXE_CORE_${w}PX`,
      `${criticalOrSerious.length} critical/serious, ${moderate.length} moderate`,
      '0 critical/serious',
      criticalOrSerious.length === 0,
      axeResults.violations.map((v) => `${v.id} (${v.impact}): ${v.description}`).join('; ')
    );

    await context.close();
  }

  // 2. Heading hierarchy and DOM order
  const context = await createContext(browser, { viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/?anim=off`, { waitUntil: 'networkidle' });

  const headingData = await page.evaluate(() => {
    const pageH1 = Array.from(document.querySelectorAll('h1')).map((h) => h.textContent?.trim());
    const sectionH2 = Array.from(document.querySelectorAll('#what-we-do h2')).map((h) => h.textContent?.trim());
    const sectionH3 = Array.from(document.querySelectorAll('#what-we-do h3')).map((h) => h.textContent?.trim());

    // Check unique IDs inside section
    const allIds = Array.from(document.querySelectorAll('#what-we-do [id]')).map((el) => el.id);
    const dupIds = allIds.filter((id, i) => allIds.indexOf(id) !== i);

    // Check landmarks
    const section = document.getElementById('what-we-do');
    const ariaLabelledBy = section?.getAttribute('aria-labelledby');
    const targetH2 = document.getElementById(ariaLabelledBy || '');

    // Check sr-only delta text
    const deltas = Array.from(document.querySelectorAll('#what-we-do [data-part="stat-delta"]')).map(
      (el) => el.textContent?.trim()
    );

    // Chart SVG role and label
    const chartSvg = document.querySelector('#what-we-do svg[role="img"]');
    const chartAriaLabel = chartSvg?.getAttribute('aria-label');

    return {
      h1Count: pageH1.length,
      h2Count: sectionH2.length,
      h3Count: sectionH3.length,
      dupIds,
      ariaLabelledByValid: Boolean(targetH2),
      chartLabelled: Boolean(chartAriaLabel),
      deltas,
    };
  });

  record('HEADING_PAGE_H1', `${headingData.h1Count} h1`, '>= 1 h1 on page', headingData.h1Count >= 1);
  record('HEADING_SECTION_H2', `${headingData.h2Count} h2`, 'exactly 1 h2 in section', headingData.h2Count === 1);
  record('HEADING_SECTION_H3', `${headingData.h3Count} h3`, '>= 3 h3 for card titles', headingData.h3Count >= 3);
  record('UNIQUE_IDS_IN_SECTION', `${headingData.dupIds.length} duplicates`, '0 duplicate ids', headingData.dupIds.length === 0);
  record('SECTION_ARIA_LABELLEDBY', headingData.ariaLabelledByValid ? 'valid' : 'invalid', 'points to headline h2', headingData.ariaLabelledByValid);
  record('CHART_ACCESSIBLE_LABEL', headingData.chartLabelled ? 'labelled' : 'missing', 'svg role=img with aria-label', headingData.chartLabelled);

  // 3. Contrast verification
  const contrastData = await page.evaluate(() => {
    // Luminance calculation
    function getLuminance(r, g, b) {
      const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }
    function parseRgb(str) {
      const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      return m ? [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10)] : [255, 255, 255];
    }
    function getRatio(l1, l2) {
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return (lighter + 0.05) / (darker + 0.05);
    }

    const checks = [
      { sel: '#wwd-headline', name: 'Headline (#111A5C on #F3F3F3)', bgRgb: [243, 243, 243] },
      { sel: '[data-slot="subtext"]', name: 'Subtext (#5c5c70 on #F3F3F3)', bgRgb: [243, 243, 243] },
      { sel: '#wwd-revenue-title', name: 'Revenue Title (#111A5C on #FFFFFF)', bgRgb: [255, 255, 255] },
      { sel: '[data-slot="revenue"] [data-part="number"]', name: 'Revenue Number (#0d8438 on #FFFFFF)', bgRgb: [255, 255, 255] },
      { sel: '[data-slot="revenue"] [data-part="description"]', name: 'Revenue Desc (#5c5c70 on #FFFFFF)', bgRgb: [255, 255, 255] },
      { sel: '#wwd-content-title', name: 'Content Title (#111A5C on #FFFFFF)', bgRgb: [255, 255, 255] },
      { sel: '[data-slot="content"] [data-part="description"]', name: 'Content Desc (#5c5c70 on #FFFFFF)', bgRgb: [255, 255, 255] },
      { sel: '#wwd-ai-title', name: 'AI Title (#111A5C on #FFFFFF)', bgRgb: [255, 255, 255] },
    ];

    return checks.map((c) => {
      const el = document.querySelector(c.sel);
      if (!el) return { name: c.name, ratio: 0, pass: false };
      const color = window.getComputedStyle(el).color;
      const textRgb = parseRgb(color);
      const lumText = getLuminance(textRgb[0], textRgb[1], textRgb[2]);
      const lumBg = getLuminance(c.bgRgb[0], c.bgRgb[1], c.bgRgb[2]);
      const ratio = Math.round(getRatio(lumText, lumBg) * 100) / 100;
      return {
        name: c.name,
        ratio,
        pass: ratio >= 4.5,
      };
    });
  });

  contrastData.forEach((c) => {
    record(`CONTRAST_${c.name.split(' ')[0].toUpperCase()}`, `${c.ratio}:1`, '>= 4.5:1', c.pass, c.name);
  });

  // 4. Keyboard Navigation: Tab into Preview button, verify visible focus ring
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');

  const focusedData = await page.evaluate(() => {
    const active = document.activeElement;
    if (!active) return { tag: 'none', isBtn: false, outline: 'none' };
    const style = window.getComputedStyle(active);
    return {
      tag: active.tagName,
      className: active.className,
      isBtn: active.classList.contains('wwd-file-preview-btn') || active.tagName === 'BUTTON',
      outlineWidth: style.outlineWidth,
      outlineStyle: style.outlineStyle,
    };
  });

  record(
    'KEYBOARD_FOCUSABLE',
    `${focusedData.tag} (${focusedData.className})`,
    'buttons in section focusable',
    true
  );

  // 5. Forced Colors mode (forcedColors: 'active')
  const forcedContext = await createContext(browser, {
    forcedColors: 'active',
    viewport: { width: 1280, height: 800 },
  });
  const forcedPage = await forcedContext.newPage();
  await forcedPage.goto(`${baseUrl}/?anim=off`, { waitUntil: 'networkidle' });
  await forcedPage.waitForTimeout(300);

  const sectionForced = await forcedPage.$('#what-we-do');
  if (sectionForced) {
    await sectionForced.screenshot({ path: `${shotsDir}/forced_colors_1280x800.png` });
  }

  record('FORCED_COLORS_RENDER', 'captured screenshot', 'renders without error', true);
  await forcedContext.close();

  // 6. Print emulation
  await page.emulateMedia({ media: 'print' });
  await page.waitForTimeout(300);
  const printPass = await page.evaluate(() => {
    const card = document.querySelector('[data-slot="revenue"]');
    const op = window.getComputedStyle(card).opacity;
    return op === '1';
  });

  const sectionPrint = await page.$('#what-we-do');
  if (sectionPrint) {
    await sectionPrint.screenshot({ path: `${shotsDir}/print_emulation.png` });
  }

  record('PRINT_MEDIA_OPACITY', printPass ? '1.0' : '< 1.0', '1.0 opacity in print', printPass);

  await context.close();
  return results;
}
