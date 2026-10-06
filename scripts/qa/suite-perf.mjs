import fs from 'fs';
import zlib from 'zlib';
import { createContext } from './browser-helper.mjs';

export async function runPerfSuite(browser, baseUrl) {
  const results = [];

  function record(id, measured, threshold, passed, details = '') {
    results.push({
      id: `PERF_${id}`,
      suite: 'PERF',
      measured,
      threshold,
      passed,
      details,
    });
  }

  const context = await createContext(browser, { viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  // 1. CLS and Layout Shift contribution of section
  await page.addInitScript(() => {
    window.__clsScore = 0;
    window.__layoutShifts = [];
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          window.__clsScore += entry.value;
          window.__layoutShifts.push(entry);
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });

  await page.goto(`${baseUrl}/?replay=1`, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => document.getElementById('what-we-do')?.scrollIntoView());
  await page.waitForTimeout(3500);

  const cls = await page.evaluate(() => Math.round(window.__clsScore * 1000) / 1000);
  record('CLS_CONTRIBUTION', cls, '< 0.05', cls < 0.05);

  // 2. Idle State Check after timeline completes
  const idleData = await page.evaluate(() => {
    const section = document.getElementById('what-we-do');
    const anims = document.getAnimations ? document.getAnimations().filter(a => section?.contains(a.effect?.target)) : [];

    const willChangeEls = Array.from(section?.querySelectorAll('*') || []).filter(el => {
      const wc = window.getComputedStyle(el).willChange;
      return wc && wc !== 'auto';
    });

    const slots = ['stat-a', 'stat-b', 'content', 'file', 'ai'];
    const nonCleanTransforms = slots.filter(s => {
      const el = document.querySelector(`[data-slot="${s}"]`);
      if (!el) return false;
      const tf = window.getComputedStyle(el).transform;
      return tf !== 'none';
    });

    return {
      runningAnimationsCount: anims.length,
      willChangeCount: willChangeEls.length,
      nonCleanTransforms,
    };
  });

  record('IDLE_RUNNING_ANIMATIONS', `${idleData.runningAnimationsCount}`, '0 animations running', idleData.runningAnimationsCount === 0);
  record('IDLE_WILL_CHANGE_LEAK', `${idleData.willChangeCount}`, '0 will-change residual', idleData.willChangeCount === 0);
  record('IDLE_SLOT_CLEAN_TRANSFORMS', `${idleData.nonCleanTransforms.length} non-clean`, '0 non-clean transforms', idleData.nonCleanTransforms.length === 0, idleData.nonCleanTransforms.join(', '));

  // 3. Production leak check: inspect dist/ files
  let hasDist = fs.existsSync('dist');
  if (hasDist) {
    const distAssets = fs.readdirSync('dist/assets');
    const leaks = [];
    const forbidden = ['DebugOverlay', '__wwdReplay', 'guides=1', 'probe=1'];

    for (const file of distAssets) {
      if (file.endsWith('.js')) {
        const code = fs.readFileSync(`dist/assets/${file}`, 'utf-8');
        forbidden.forEach(str => {
          if (code.includes(str)) leaks.push(`${file} contains "${str}"`);
        });
      }
    }

    record('PRODUCTION_DEV_LEAK_CHECK', `${leaks.length} leaks`, '0 dev leaks in dist', leaks.length === 0, leaks.join('; '));

    // Bundle size
    const jsFiles = distAssets.filter(f => f.endsWith('.js'));
    const cssFiles = distAssets.filter(f => f.endsWith('.css'));
    let totalGzip = 0;
    for (const f of [...jsFiles, ...cssFiles]) {
      const raw = fs.readFileSync(`dist/assets/${f}`);
      totalGzip += zlib.gzipSync(raw).length;
    }
    const totalGzipKb = (totalGzip / 1024).toFixed(2);
    record('TOTAL_BUNDLE_GZIP_SIZE', `${totalGzipKb} KB`, '< 250 KB', totalGzip < 250 * 1024);
  }

  // 4. Font loading layout shift check
  await page.goto(`${baseUrl}/?anim=off`, { waitUntil: 'domcontentloaded' });
  const fontShift = await page.evaluate(async () => {
    const h2 = document.getElementById('wwd-headline');
    const boxBefore = h2 ? h2.getBoundingClientRect() : null;
    await document.fonts.ready;
    const boxAfter = h2 ? h2.getBoundingClientRect() : null;
    if (!boxBefore || !boxAfter) return 0;
    return Math.abs(boxAfter.width - boxBefore.width);
  });

  record('FONT_LOAD_LAYOUT_SHIFT', `${fontShift.toFixed(3)}px`, '< 1.0px', fontShift < 1.0);

  await context.close();
  return results;
}
