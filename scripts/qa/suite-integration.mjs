import { SECTION_ID, GEOMETRY, MOTION } from '../../src/components/whatWeDo/config.js';
import { createContext } from './browser-helper.mjs';

export async function runIntegrationSuite(browser, baseUrl) {
  const results = [];

  function record(id, measured, threshold, passed, details = '') {
    results.push({
      id: `INTEGRATION_${id}`,
      suite: 'INTEGRATION',
      measured,
      threshold,
      passed,
      details,
    });
  }

  // 1. ANCHOR RULE & ID CHECK
  {
    const context = await createContext(browser, { viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/?anim=off`, { waitUntil: 'networkidle' });

    const anchorCheck = await page.evaluate((expectedSectionId) => {
      // Find all IDs on page
      const allIdEls = Array.from(document.querySelectorAll('[id]'));
      const idMap = {};
      const duplicateIds = [];
      allIdEls.forEach((el) => {
        const id = el.getAttribute('id');
        if (idMap[id]) duplicateIds.push(id);
        idMap[id] = (idMap[id] || 0) + 1;
      });

      // Find navbar services link
      const navLinks = Array.from(document.querySelectorAll('nav a, header a'));
      const servicesLink = navLinks.find((a) => (a.textContent || '').trim().toLowerCase().includes('services'));
      const servicesHref = servicesLink ? servicesLink.getAttribute('href') : null;

      // Check section element
      const sectionEl = document.getElementById(expectedSectionId);
      const heroEl = document.querySelector('.hero-artboard') || document.querySelector('[data-slot="hero"]');

      return {
        hasSection: Boolean(sectionEl),
        sectionId: expectedSectionId,
        duplicateIds,
        servicesHref,
        heroHasServicesId: Boolean(document.querySelector('#services:not(.wwd-section)')),
        allIds: Object.keys(idMap),
      };
    }, SECTION_ID);

    // Rule check: if #services is already owned by Hero / other element, SECTION_ID must stay 'what-we-do'
    const anchorPass = anchorCheck.hasSection && anchorCheck.duplicateIds.length === 0;
    record(
      'ANCHOR_RULE_SECTION_ID',
      `id="${SECTION_ID}", duplicates: [${anchorCheck.duplicateIds.join(', ')}]`,
      'valid SECTION_ID with zero duplicate IDs',
      anchorPass,
      anchorCheck.heroHasServicesId
        ? 'Hero owns #services; section retained id="what-we-do" as per Anchor Rule'
        : 'Section id matches configuration'
    );

    // 2. SCROLL MARGIN TOP CHECK
    const scrollMargin = await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const comp = window.getComputedStyle(el);
      const val = comp.scrollMarginTop;
      const px = parseFloat(val) || 0;

      // Navbar measurements
      const nav = document.querySelector('nav') || document.querySelector('header');
      const navRect = nav ? nav.getBoundingClientRect() : { bottom: 78, height: 54, top: 24 };
      const navTotalHeight = navRect.bottom;

      return {
        raw: val,
        px,
        navTotalHeight,
        requiredMin: navTotalHeight + 24,
      };
    }, SECTION_ID);

    const smPass = scrollMargin && scrollMargin.px >= (scrollMargin.requiredMin - 2);
    record(
      'SCROLL_MARGIN_TOP',
      `${scrollMargin ? scrollMargin.px : 0}px (${scrollMargin?.raw})`,
      `>= ${scrollMargin ? scrollMargin.requiredMin : 102}px (navbar + 24px clearance)`,
      smPass,
      `Calculated scrollMarginTop: ${scrollMargin?.px}px`
    );

    // 3. ANCHOR JUMP DESKTOP (1280x800)
    await page.goto(`${baseUrl}/#${SECTION_ID}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const desktopJump = await page.evaluate((id) => {
      const sec = document.getElementById(id);
      const eyebrow = sec?.querySelector('[data-slot="eyebrow"]') || sec?.querySelector('p');
      const nav = document.querySelector('nav') || document.querySelector('header');
      const navBottom = nav ? nav.getBoundingClientRect().bottom : 78;
      const ebRect = eyebrow ? eyebrow.getBoundingClientRect() : null;

      return {
        navBottom,
        eyebrowTop: ebRect ? ebRect.top : 0,
        isVisible: ebRect ? ebRect.top >= navBottom : false,
        clearance: ebRect ? ebRect.top - navBottom : 0,
      };
    }, SECTION_ID);

    record(
      'ANCHOR_JUMP_DESKTOP_1280',
      `clearance: ${Math.round(desktopJump.clearance)}px (top: ${Math.round(desktopJump.eyebrowTop)}px vs navBottom: ${Math.round(desktopJump.navBottom)}px)`,
      'eyebrowTop >= navBottom (clearance >= 0px)',
      desktopJump.isVisible,
      desktopJump.isVisible ? 'Eyebrow fully visible below fixed navbar' : 'Eyebrow obscured by navbar'
    );

    await context.close();
  }

  // 4. ANCHOR JUMP MOBILE (390x844)
  {
    const context = await createContext(browser, { viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/#${SECTION_ID}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    const mobileJump = await page.evaluate((id) => {
      const sec = document.getElementById(id);
      const eyebrow = sec?.querySelector('[data-slot="eyebrow"]') || sec?.querySelector('p');
      const nav = document.querySelector('nav') || document.querySelector('header');
      const navBottom = nav ? nav.getBoundingClientRect().bottom : 68;
      const ebRect = eyebrow ? eyebrow.getBoundingClientRect() : null;

      return {
        navBottom,
        eyebrowTop: ebRect ? ebRect.top : 0,
        isVisible: ebRect ? ebRect.top >= navBottom : false,
        clearance: ebRect ? ebRect.top - navBottom : 0,
      };
    }, SECTION_ID);

    record(
      'ANCHOR_JUMP_MOBILE_390',
      `clearance: ${Math.round(mobileJump.clearance)}px (top: ${Math.round(mobileJump.eyebrowTop)}px vs navBottom: ${Math.round(mobileJump.navBottom)}px)`,
      'eyebrowTop >= navBottom (clearance >= 0px)',
      mobileJump.isVisible,
      mobileJump.isVisible ? 'Eyebrow fully visible on mobile' : 'Eyebrow obscured by mobile header'
    );

    await context.close();
  }

  // 5. REVEAL TRIGGERS ON SCROLL & PLAYS ONCE
  {
    const context = await createContext(browser, { viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();
    // Load at root without hash or anim=off
    await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    const initialReveal = await page.evaluate((id) => {
      const sec = document.getElementById(id);
      return sec ? sec.getAttribute('data-reveal-state') : null;
    }, SECTION_ID);

    // Scroll to section
    await page.evaluate((id) => {
      const sec = document.getElementById(id);
      if (sec) sec.scrollIntoView({ behavior: 'auto' });
    }, SECTION_ID);

    // Wait for scroll debounce + settle guard (120ms + margin)
    await page.waitForTimeout(600);

    const afterScrollState = await page.evaluate((id) => {
      const sec = document.getElementById(id);
      return sec ? sec.getAttribute('data-reveal-state') : null;
    }, SECTION_ID);

    // Wait until animation settles (3.5s)
    await page.waitForTimeout(3500);

    const finalState = await page.evaluate((id) => {
      const sec = document.getElementById(id);
      return sec ? sec.getAttribute('data-reveal-state') : null;
    }, SECTION_ID);

    // Scroll away and back
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(400);
    await page.evaluate((id) => {
      const sec = document.getElementById(id);
      if (sec) sec.scrollIntoView({ behavior: 'auto' });
    }, SECTION_ID);
    await page.waitForTimeout(400);

    const replayCheck = await page.evaluate((id) => {
      const sec = document.getElementById(id);
      return sec ? sec.getAttribute('data-reveal-state') : null;
    }, SECTION_ID);

    const isReenter = MOTION.REPLAY === 'reenter';
    const scrollPass = (afterScrollState === 'animating' || afterScrollState === 'settled') &&
                       finalState === 'settled' &&
                       (isReenter ? (replayCheck === 'animating' || replayCheck === 'settled' || replayCheck === 'pending') : replayCheck === 'settled');

    record(
      'REVEAL_TRIGGERS_ON_SCROLL_ONCE',
      `initial=${initialReveal}, afterScroll=${afterScrollState}, final=${finalState}, afterScrollAgain=${replayCheck}`,
      isReenter ? 'triggers on scroll, settles, replays on re-entry' : 'triggers on scroll, settles, does not replay',
      scrollPass,
      isReenter ? 'Reveal settles and replays according to MOTION.REPLAY=reenter' : 'Reveal is single-trigger and settles reliably'
    );

    await context.close();
  }

  // 6. SMALL VIEWPORT HEIGHT TRIGGER (390x500)
  {
    const context = await createContext(browser, { viewport: { width: 390, height: 500 } });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(200);

    await page.evaluate((id) => {
      const sec = document.getElementById(id);
      if (sec) {
        const top = sec.getBoundingClientRect().top + window.scrollY;
        window.scrollTo(0, top - 100);
      }
    }, SECTION_ID);

    await page.waitForFunction((id) => {
      const sec = document.getElementById(id);
      const st = sec ? sec.getAttribute('data-reveal-state') : null;
      return st === 'animating' || st === 'settled';
    }, SECTION_ID, { timeout: 3000 }).catch(() => {});

    const smallHeightState = await page.evaluate((id) => {
      const sec = document.getElementById(id);
      return sec ? sec.getAttribute('data-reveal-state') : null;
    }, SECTION_ID);

    const smallPass = smallHeightState === 'animating' || smallHeightState === 'settled';
    record(
      'REVEAL_SMALL_HEIGHT_390x500',
      `state=${smallHeightState}`,
      'animating or settled',
      smallPass,
      'Section triggers even when section is taller than viewport'
    );

    await context.close();
  }

  // 7. HERO-TO-SECTION SEAM (Bounding box collision & vertical gap)
  {
    const context = await createContext(browser, { viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/?anim=off`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    const seamMetrics = await page.evaluate((id) => {
      const sec = document.getElementById(id);
      const eyebrow = sec?.querySelector('[data-slot="eyebrow"]') || sec?.querySelector('p');
      const secGrid = sec?.querySelector('.wwd-grid');
      const heroArtboard = document.querySelector('.hero-artboard') || document.querySelector('#services') || document.querySelector('#about');

      // Find all absolute elements in Hero
      const heroEls = heroArtboard ? Array.from(heroArtboard.querySelectorAll('*')) : [];
      let lowestHeroBottom = 0;
      let lowestHeroEl = null;

      heroEls.forEach((el) => {
        const pos = window.getComputedStyle(el).position;
        if (pos === 'absolute' || pos === 'fixed' || pos === 'relative') {
          const rect = el.getBoundingClientRect();
          const pageBottom = rect.bottom + window.scrollY;
          if (rect.height > 0 && rect.width > 0 && pageBottom > lowestHeroBottom) {
            lowestHeroBottom = pageBottom;
            lowestHeroEl = el.className || el.tagName;
          }
        }
      });

      const secTop = sec ? sec.getBoundingClientRect().top + window.scrollY : 0;
      const ebTop = eyebrow ? eyebrow.getBoundingClientRect().top + window.scrollY : secTop;
      const gapToEyebrow = ebTop - lowestHeroBottom;
      const gapSecToHero = secTop - (heroArtboard ? (heroArtboard.getBoundingClientRect().bottom + window.scrollY) : 0);

      // Hero elements vs Section header / cards collision check
      let collisionCount = 0;
      const ebRect = eyebrow ? eyebrow.getBoundingClientRect() : null;
      const gridRect = secGrid ? secGrid.getBoundingClientRect() : null;

      heroEls.forEach((el) => {
        const b = el.getBoundingClientRect();
        if (b.width === 0 || b.height === 0) return;
        if (ebRect && !(b.right < ebRect.left || b.left > ebRect.right || b.bottom < ebRect.top || b.top > ebRect.bottom)) {
          collisionCount++;
        }
        if (gridRect && !(b.right < gridRect.left || b.left > gridRect.right || b.bottom < gridRect.top || b.top > gridRect.bottom)) {
          collisionCount++;
        }
      });

      // Background color check
      const heroBg = heroArtboard ? window.getComputedStyle(heroArtboard).backgroundColor : 'unknown';
      const bodyBg = window.getComputedStyle(document.body).backgroundColor;

      return {
        lowestHeroBottom,
        lowestHeroEl,
        ebTop,
        gapToEyebrow,
        gapSecToHero,
        collisionCount,
        heroBg,
        bodyBg,
      };
    }, SECTION_ID);

    const seamPass = seamMetrics.collisionCount === 0 && seamMetrics.gapToEyebrow >= 30;
    record(
      'HERO_SEAM_CLEARANCE',
      `gapToEyebrow=${Math.round(seamMetrics.gapToEyebrow)}px, collisions=${seamMetrics.collisionCount}`,
      'gap >= 30px, 0 collisions',
      seamPass,
      `Vertical gap from Hero bottom to eyebrow: ${Math.round(seamMetrics.gapToEyebrow)}px (heroBg: ${seamMetrics.heroBg}, bodyBg: ${seamMetrics.bodyBg})`
    );

    await context.close();
  }

  // 8. PAGE AFTER SECTION (Bottom clearance for tilted card)
  {
    const context = await createContext(browser, { viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/?anim=off&pose=tilted`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);

    const bottomMetrics = await page.evaluate((id) => {
      const sec = document.getElementById(id);
      const grid = sec?.querySelector('.wwd-grid');
      const revenueCard = sec?.querySelector('[data-slot="revenue"]');
      const face = revenueCard?.querySelector('[data-part="face"]');

      const secRect = sec?.getBoundingClientRect();
      const gridRect = grid?.getBoundingClientRect();
      const faceRect = face?.getBoundingClientRect();

      const paddingBottom = sec ? parseFloat(window.getComputedStyle(sec).paddingBottom) || 0 : 0;
      const faceHangover = faceRect && gridRect ? Math.max(0, faceRect.bottom - gridRect.bottom) : 0;
      const netBottomClearance = paddingBottom - faceHangover;

      return {
        paddingBottom,
        faceHangover,
        netBottomClearance,
      };
    }, SECTION_ID);

    const bottomPass = bottomMetrics.netBottomClearance >= 20;
    record(
      'PAGE_AFTER_BOTTOM_CLEARANCE',
      `netClearance=${Math.round(bottomMetrics.netBottomClearance)}px (paddingBottom: ${Math.round(bottomMetrics.paddingBottom)}px, faceHangover: ${Math.round(bottomMetrics.faceHangover)}px)`,
      '>= 20px clearance',
      bottomPass,
      'Sufficient padding below grid prevents collision with any subsequent sections'
    );

    await context.close();
  }

  // 9. CSS VARIABLE COLLISION CHECK (--r)
  {
    const context = await createContext(browser, { viewport: { width: 1280, height: 800 } });
    const page = await context.newPage();
    await page.goto(`${baseUrl}/?anim=off`, { waitUntil: 'networkidle' });

    const varCheck = await page.evaluate(() => {
      const collidingElements = [];
      const all = Array.from(document.querySelectorAll('*'));
      all.forEach((el) => {
        if (el.closest('.wwd-section')) return;
        const inline = el.style.cssText.match(/--r\s*:/);
        if (inline) {
          collidingElements.push(el.tagName + (el.className ? '.' + el.className : ''));
        }
      });
      return {
        count: collidingElements.length,
        collidingElements,
      };
    });

    const varPass = varCheck.count === 0;
    record(
      'CSS_VAR_R_COLLISION',
      `outside definitions: ${varCheck.count}`,
      '0 outside definitions',
      varPass,
      varPass ? '--r is uniquely scoped to .wwd-section' : `Collisions found on: ${varCheck.collidingElements.join(', ')}`
    );

    await context.close();
  }

  return results;
}
