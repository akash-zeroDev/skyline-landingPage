import { launchBrowser, createContext } from './browser-helper.mjs';

async function runDiagnosis() {
  const browser = await launchBrowser();
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });

  console.log('--- TEST A: Wheel scrolling (100px steps, 50ms apart) ---');
  {
    const page = await context.newPage();
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('domcontentloaded');

    // Monitor when data-reveal-state changes to animating
    await page.evaluate(() => {
      window._diagLog = [];
      const section = document.querySelector('#what-we-do');
      const revSlot = document.querySelector('[data-slot="revenue"]');
      let triggerTime = null;

      function getVisibleFraction(el) {
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const top = Math.max(0, rect.top);
        const bottom = Math.min(vh, rect.bottom);
        const visibleHeight = Math.max(0, bottom - top);
        return visibleHeight / rect.height;
      }

      const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.attributeName === 'data-reveal-state') {
            const state = section.getAttribute('data-reveal-state');
            if (state === 'animating' && triggerTime === null) {
              triggerTime = performance.now();
              window._diagLog.push({
                event: 'trigger_animating',
                scrollY: window.scrollY,
                sectionVisibleFraction: getVisibleFraction(section),
                revenueVisibleFraction: getVisibleFraction(revSlot),
                timestamp: triggerTime,
              });
            }
          }
        }
      });
      observer.observe(section, { attributes: true });

      // Poll revenue visibility
      const interval = setInterval(() => {
        const revFrac = getVisibleFraction(revSlot);
        if (revFrac >= 0.7 && !window._logged70) {
          window._logged70 = true;
          window._diagLog.push({
            event: 'revenue_70pct_visible',
            scrollY: window.scrollY,
            sectionVisibleFraction: getVisibleFraction(section),
            revenueVisibleFraction: revFrac,
            timestamp: performance.now(),
            timeSinceTrigger: triggerTime ? (performance.now() - triggerTime) / 1000 : null,
            sectionRevealState: section.getAttribute('data-reveal-state'),
          });
        }
      }, 16);
    });

    // Scroll with wheel events in 100px steps, 50ms apart
    for (let i = 0; i < 20; i++) {
      await page.mouse.wheel(0, 100);
      await page.waitForTimeout(50);
    }

    await page.waitForTimeout(2500); // let animations run
    const logs = await page.evaluate(() => window._diagLog);
    console.log('Wheel Scroll Logs:', JSON.stringify(logs, null, 2));
    await page.close();
  }

  console.log('--- TEST B: Nav link /#work smooth scrolling ---');
  {
    const page = await context.newPage();
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('domcontentloaded');

    await page.evaluate(() => {
      window._diagLog = [];
      const section = document.querySelector('#what-we-do');
      const revSlot = document.querySelector('[data-slot="revenue"]');
      let triggerTime = null;

      function getVisibleFraction(el) {
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const top = Math.max(0, rect.top);
        const bottom = Math.min(vh, rect.bottom);
        const visibleHeight = Math.max(0, bottom - top);
        return visibleHeight / rect.height;
      }

      const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
          if (m.attributeName === 'data-reveal-state') {
            const state = section.getAttribute('data-reveal-state');
            if (state === 'animating' && triggerTime === null) {
              triggerTime = performance.now();
              window._diagLog.push({
                event: 'trigger_animating',
                scrollY: window.scrollY,
                sectionVisibleFraction: getVisibleFraction(section),
                revenueVisibleFraction: getVisibleFraction(revSlot),
                timestamp: triggerTime,
              });
            }
          }
        }
      });
      observer.observe(section, { attributes: true });

      const interval = setInterval(() => {
        const revFrac = getVisibleFraction(revSlot);
        if (revFrac >= 0.7 && !window._logged70) {
          window._logged70 = true;
          window._diagLog.push({
            event: 'revenue_70pct_visible',
            scrollY: window.scrollY,
            sectionVisibleFraction: getVisibleFraction(section),
            revenueVisibleFraction: revFrac,
            timestamp: performance.now(),
            timeSinceTrigger: triggerTime ? (performance.now() - triggerTime) / 1000 : null,
            sectionRevealState: section.getAttribute('data-reveal-state'),
          });
        }
      }, 16);
    });

    // Click nav link or navigate to #work
    const workLink = await page.$('a[href*="#work"]');
    if (workLink) {
      await workLink.click();
    } else {
      await page.evaluate(() => {
        window.location.hash = '#work';
      });
    }

    await page.waitForTimeout(3000);
    const logs = await page.evaluate(() => window._diagLog);
    console.log('Nav Link Logs:', JSON.stringify(logs, null, 2));
    await page.close();
  }

  await browser.close();
}

runDiagnosis().catch(console.error);
