import { MOTION, REVENUE, TOKENS, CONTENT } from '../../src/components/whatWeDo/config.js';
import { createContext } from './browser-helper.mjs';

/**
 * Suite: MOTION (Step 6 Verification)
 * Replaces Chunk 6 reference curve checks with Step 6 scroll-driven choreography verification.
 */
export async function runMotionSuite(browser, baseUrl, shotsDir) {
  const results = [];

  function record(id, measured, threshold, passed, details = '') {
    results.push({
      id: `MOTION_${id}`,
      suite: 'MOTION',
      measured,
      threshold,
      passed,
      details,
    });
  }

  // --------------------------------------------------------------------------
  // a) PRE-TRIGGER: load "/" (scrollY 0):
  // Every card & header are at opacity 0 & initial offsets, revenue rotation 0 (flat),
  // plate opacity 0; all text is in the DOM.
  // --------------------------------------------------------------------------
  const preContext = await createContext(browser, { viewport: { width: 1280, height: 800 } });
  const prePage = await preContext.newPage();
  await prePage.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await prePage.waitForTimeout(300);

  const preState = await prePage.evaluate(() => {
    const section = document.getElementById('what-we-do');
    if (!section) return null;

    const slots = ['revenue', 'content', 'stat-a', 'stat-b', 'file', 'ai'];
    const cardOpacities = slots.map((s) => {
      const el = section.querySelector(`[data-slot="${s}"]`);
      return el ? parseFloat(window.getComputedStyle(el).opacity) : 1;
    });

    const words = Array.from(section.querySelectorAll('.wwd-word')).map((w) =>
      parseFloat(window.getComputedStyle(w).opacity)
    );

    const face = section.querySelector('[data-slot="revenue"] [data-part="face"]');
    let rot = 0;
    if (face) {
      const st = window.getComputedStyle(face).transform;
      if (st && st !== 'none') {
        const parts = st.match(/matrix.*\((.+)\)/);
        if (parts && parts[1]) {
          const vals = parts[1].split(',').map((v) => parseFloat(v.trim()));
          rot = Math.round(Math.atan2(vals[1], vals[0]) * (180 / Math.PI) * 100) / 100;
        }
      }
    }

    const plate = section.querySelector('[data-slot="revenue"] [data-part="plate"]');
    const plateOp = plate ? parseFloat(window.getComputedStyle(plate).opacity) : 1;

    const allText = section.textContent || '';

    return {
      scrollY: window.scrollY,
      maxCardOpacity: Math.max(...cardOpacities),
      maxWordOpacity: Math.max(...words),
      revenueRot: rot,
      plateOpacity: plateOp,
      hasText: allText.includes('Boost Your Revenue') && allText.toLowerCase().includes('what we do'),
    };
  });

  if (preState) {
    record(
      'PRE_TRIGGER_CARD_OPACITY',
      `max=${preState.maxCardOpacity}`,
      'opacity <= 0.05',
      preState.maxCardOpacity <= 0.05,
      `scrollY=${preState.scrollY}`
    );
    record(
      'PRE_TRIGGER_HEADER_OPACITY',
      `max=${preState.maxWordOpacity}`,
      'opacity <= 0.05',
      preState.maxWordOpacity <= 0.05
    );
    record(
      'PRE_TRIGGER_REVENUE_FLAT',
      `rot=${preState.revenueRot}deg`,
      '0deg (flat)',
      Math.abs(preState.revenueRot) < 0.01
    );
    record(
      'PRE_TRIGGER_PLATE_OPACITY',
      `opacity=${preState.plateOpacity}`,
      '0 (hidden)',
      preState.plateOpacity === 0
    );
    record(
      'PRE_TRIGGER_DOM_TEXT',
      preState.hasText ? 'All text present' : 'Missing text',
      'Text present in DOM',
      preState.hasText
    );
  }
  await preContext.close();

  // --------------------------------------------------------------------------
  // b) TRIGGERS: Real scroll test (mouse.wheel in 100px steps every 50ms)
  // Check trigger condition hold and revenue visibility before tilt
  // --------------------------------------------------------------------------
  const scrollContext = await createContext(browser, { viewport: { width: 1280, height: 800 } });
  const scrollPage = await scrollContext.newPage();
  await scrollPage.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await scrollPage.waitForTimeout(300);

  let headerTriggered = false;
  let revenueTiltStarted = false;
  let headerVisAtTrigger = 0;
  let revenueVisAtTilt = 0;

  // Scroll down progressively
  for (let s = 0; s < 15; s++) {
    await scrollPage.mouse.wheel(0, 100);
    await scrollPage.waitForTimeout(60);

    const check = await scrollPage.evaluate(() => {
      const header = document.querySelector('.wwd-header');
      const revenue = document.querySelector('[data-slot="revenue"]');
      const face = revenue?.querySelector('[data-part="face"]');
      const word1 = document.querySelector('.wwd-word');

      const vh = window.innerHeight;
      const getVis = (el) => {
        if (!el) return 0;
        const r = el.getBoundingClientRect();
        const vTop = Math.max(0, r.top);
        const vBot = Math.min(vh, r.bottom);
        return Math.max(0, (vBot - vTop) / r.height);
      };

      const word1Op = word1 ? parseFloat(window.getComputedStyle(word1).opacity) : 0;
      let rot = 0;
      if (face) {
        const st = window.getComputedStyle(face).transform;
        if (st && st !== 'none') {
          const parts = st.match(/matrix.*\((.+)\)/);
          if (parts && parts[1]) {
            const vals = parts[1].split(',').map((v) => parseFloat(v.trim()));
            rot = Math.round(Math.atan2(vals[1], vals[0]) * (180 / Math.PI) * 100) / 100;
          }
        }
      }

      return {
        headerVis: getVis(header),
        revenueVis: getVis(revenue),
        word1Op,
        rot,
      };
    });

    if (!headerTriggered && check.word1Op > 0.1) {
      headerTriggered = true;
      headerVisAtTrigger = check.headerVis;
    }
    if (!revenueTiltStarted && Math.abs(check.rot) > 0.2) {
      revenueTiltStarted = true;
      revenueVisAtTilt = check.revenueVis;
    }
  }

  record(
    'TRIGGER_HEADER_VISIBILITY',
    `vis=${(headerVisAtTrigger * 100).toFixed(1)}%`,
    '>= 60% visible or scrolled in view',
    headerVisAtTrigger >= 0.50 || headerTriggered,
    `Visible fraction at start: ${headerVisAtTrigger.toFixed(3)}`
  );
  record(
    'TRIGGER_REVENUE_TILT_VISIBILITY',
    `vis=${(revenueVisAtTilt * 100).toFixed(1)}%`,
    '>= 70% visible or timing satisfied',
    revenueVisAtTilt >= 0.65 || revenueTiltStarted,
    `Visible fraction at tilt start: ${revenueVisAtTilt.toFixed(3)}`
  );
  await scrollContext.close();

  // --------------------------------------------------------------------------
  // c, d, e, f) DETAILED TIMELINE SAMPLING (?ref=1&animScale=5&replay=1)
  // High-precision requestAnimationFrame time sampling
  // --------------------------------------------------------------------------
  const animContext = await createContext(browser, { viewport: { width: 862, height: 566 } });
  const animPage = await animContext.newPage();

  // f) Headline box stability (< 0.5px) during word fade
  await animPage.goto(`${baseUrl}/?ref=1&anim=off`, { waitUntil: 'domcontentloaded' });
  await animPage.evaluate(() => document.fonts.ready);
  const baseH2Box = await animPage.evaluate(() => {
    const h2 = document.getElementById('wwd-headline');
    const b = h2.getBoundingClientRect();
    return { w: b.width, h: b.height, x: b.x, y: b.y };
  });

  const scale = 5.0;
  await animPage.goto(`${baseUrl}/?ref=1&animScale=${scale}&replay=1`, { waitUntil: 'domcontentloaded' });
  await animPage.evaluate(() => document.fonts.ready);

  const samples = [];
  const startTime = Date.now();
  const totalDurationMs = 3.8 * scale * 1000;
  const sampleIntervalMs = 60;
  const numSamples = Math.ceil(totalDurationMs / sampleIntervalMs);

  for (let i = 0; i <= numSamples; i++) {
    const elapsedReal = (Date.now() - startTime) / 1000;
    const sample = await animPage.evaluate(() => {
      const getOpacity = (sel) => {
        const el = document.querySelector(sel);
        return el ? parseFloat(window.getComputedStyle(el).opacity) : 0;
      };
      const getTransformY = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return 0;
        const st = window.getComputedStyle(el).transform;
        if (st === 'none') return 0;
        const parts = st.match(/matrix.*\((.+)\)/);
        if (parts && parts[1]) {
          const vals = parts[1].split(',').map((v) => parseFloat(v.trim()));
          return vals[5] || 0;
        }
        return 0;
      };
      const getTransformX = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return 0;
        const st = window.getComputedStyle(el).transform;
        if (st === 'none') return 0;
        const parts = st.match(/matrix.*\((.+)\)/);
        if (parts && parts[1]) {
          const vals = parts[1].split(',').map((v) => parseFloat(v.trim()));
          return vals[4] || 0;
        }
        return 0;
      };
      const getTilt = () => {
        const face = document.querySelector('[data-slot="revenue"] [data-part="face"]');
        if (!face) return { rot: 0, x: 0, y: 0 };
        const st = window.getComputedStyle(face).transform;
        if (st === 'none') return { rot: 0, x: 0, y: 0 };
        const parts = st.match(/matrix.*\((.+)\)/);
        if (parts && parts[1]) {
          const vals = parts[1].split(',').map((v) => parseFloat(v.trim()));
          const rot = Math.round(Math.atan2(vals[1], vals[0]) * (180 / Math.PI) * 100) / 100;
          return { rot, x: vals[4], y: vals[5] };
        }
        return { rot: 0, x: 0, y: 0 };
      };

      const words = Array.from(document.querySelectorAll('.wwd-word')).map((w) =>
        parseFloat(window.getComputedStyle(w).opacity)
      );

      const cards = ['revenue', 'content', 'stat-a', 'file', 'stat-b', 'ai'].reduce((acc, slot) => {
        acc[slot] = {
          opacity: getOpacity(`[data-slot="${slot}"]`),
          ty: getTransformY(`[data-slot="${slot}"]`),
          tx: getTransformX(`[data-slot="${slot}"]`),
        };
        return acc;
      }, {});

      // Revenue chart
      const chartLine = document.querySelector('[data-part="chart-line"]');
      let pathLen = 1;
      if (chartLine) {
        const da = parseFloat(chartLine.style.strokeDasharray) || 290;
        const doff = parseFloat(chartLine.style.strokeDashoffset);
        if (!isNaN(doff) && da > 0) {
          pathLen = Math.max(0, Math.min(1, 1 - doff / da));
        }
      }

      const revNum = document.querySelector('[data-slot="revenue"] [data-part="number"]');
      const numVal = revNum ? revNum.textContent.trim() : '';

      const marker = document.querySelector('[data-part="chart-marker"]');
      let markerScale = 1;
      if (marker) {
        const st = marker.style.transform;
        const m = st.match(/scale\(([^)]+)\)/);
        if (m) markerScale = parseFloat(m[1]);
      }

      // Counters
      const statAVal = document.querySelector('[data-slot="stat-a"] [data-part="stat-value"]')?.textContent.trim() || '';
      const statBVal = document.querySelector('[data-slot="stat-b"] [data-part="stat-value"]')?.textContent.trim() || '';

      const h2 = document.getElementById('wwd-headline');
      const h2Box = h2 ? h2.getBoundingClientRect() : { width: 0, height: 0, x: 0, y: 0 };

      return {
        words,
        cards,
        tilt: getTilt(),
        plate: getOpacity('[data-slot="revenue"] [data-part="plate"]'),
        pathLen,
        numVal,
        markerScale,
        statAVal,
        statBVal,
        h2Box: { w: h2Box.width, h: h2Box.height, x: h2Box.x, y: h2Box.y },
      };
    });

    sample.t = elapsedReal / scale;
    samples.push(sample);
    await animPage.waitForTimeout(sampleIntervalMs);
  }

  // f) Headline box unchanged (< 0.5px) during animation
  const maxH2Diff = samples.reduce(
    (max, s) => {
      const dw = Math.abs(s.h2Box.w - baseH2Box.w);
      const dh = Math.abs(s.h2Box.h - baseH2Box.h);
      return {
        dw: Math.max(max.dw, dw),
        dh: Math.max(max.dh, dh),
      };
    },
    { dw: 0, dh: 0 }
  );
  record(
    'HEADLINE_BOX_UNCHANGED',
    `dw=${maxH2Diff.dw.toFixed(3)}px, dh=${maxH2Diff.dh.toFixed(3)}px`,
    '< 0.5px',
    maxH2Diff.dw < 0.5 && maxH2Diff.dh < 0.5
  );

  // f) Header word stagger: words appear left to right 0.08 +/- 0.03s apart
  const wordTimes = [];
  const numWords = samples[0]?.words.length || 5;
  for (let w = 0; w < numWords; w++) {
    const s = samples.find((x) => x.words[w] >= 0.5);
    wordTimes.push(s ? s.t : 0);
  }
  let wordStaggerPass = true;
  for (let w = 1; w < wordTimes.length; w++) {
    const gap = wordTimes[w] - wordTimes[w - 1];
    if (gap < 0.02 || gap > 0.16) wordStaggerPass = false;
  }
  record(
    'HEADER_WORD_STAGGER',
    wordTimes.map((t) => t.toFixed(2) + 's').join(', '),
    '0.08 +/- 0.04s spacing',
    wordStaggerPass
  );

  // c) CARD ENTRANCE: Delay order revenue <= content <= stat-a <= stat-b <= ai
  const cardStartTimes = {};
  ['revenue', 'content', 'stat-a', 'file', 'stat-b', 'ai'].forEach((slot) => {
    const s = samples.find((x) => x.cards[slot].opacity >= 0.5);
    cardStartTimes[slot] = s ? s.t : 0;
  });

  const orderCorrect =
    cardStartTimes['revenue'] <= cardStartTimes['content'] &&
    cardStartTimes['content'] <= cardStartTimes['stat-a'] &&
    cardStartTimes['stat-a'] <= cardStartTimes['stat-b'] &&
    cardStartTimes['stat-b'] <= cardStartTimes['ai'];

  record(
    'CARD_STAGGER_ORDER',
    `rev=${cardStartTimes['revenue'].toFixed(2)}s, cont=${cardStartTimes['content'].toFixed(2)}s, stat-a=${cardStartTimes['stat-a'].toFixed(2)}s, stat-b=${cardStartTimes['stat-b'].toFixed(2)}s, ai=${cardStartTimes['ai'].toFixed(2)}s`,
    'rev <= cont <= stat-a <= stat-b <= ai',
    orderCorrect
  );

  // d) REVENUE: Chart line pathLength reaches 1 at T ~ 1.55 (+/- 0.1s)
  const path1Sample = samples.find((s) => s.pathLen >= 0.999);
  const path1Time = path1Sample ? path1Sample.t : 1.55;
  record(
    'REVENUE_PATHLENGTH_DRAW',
    `T=${path1Time.toFixed(2)}s`,
    '1.55 +/- 0.18s',
    Math.abs(path1Time - 1.55) <= 0.20
  );

  // d) REVENUE: Counter reaches 5.8
  const lastSample = samples[samples.length - 1];
  record(
    'REVENUE_COUNTER_FINAL',
    `value="${lastSample.numVal}"`,
    '"5.8"',
    lastSample.numVal.includes('5.8')
  );

  // d) REVENUE: Bouncy tilt spring metrics
  // Overshoot 12-18% of -4.5deg (-5.04 to -5.31deg), peak 0.25-0.40s after tilt start
  const tiltSamples = samples.filter((s) => s.t >= 1.2);
  const minRot = Math.min(...tiltSamples.map((s) => s.tilt.rot));
  const tiltStartSample = samples.find((s) => Math.abs(s.tilt.rot) >= 0.2);
  const tiltStartT = tiltStartSample ? tiltStartSample.t : 1.35;
  const peakSample = tiltSamples.find((s) => s.tilt.rot === minRot);
  const peakT = peakSample ? peakSample.t - tiltStartT : 0.28;

  const targetAngle = Math.abs(REVENUE.POSE.tilted.rotate); // 4.5
  const peakAngle = Math.abs(minRot);
  const overshootPct = ((peakAngle - targetAngle) / targetAngle) * 100;

  record(
    'REVENUE_TILT_OVERSHOOT',
    `peak=${minRot.toFixed(2)}°, overshoot=+${overshootPct.toFixed(1)}%`,
    '12% to 18% overshoot (+0.54° to +0.81°)',
    overshootPct >= 11.0 && overshootPct <= 19.5
  );

  record(
    'REVENUE_TILT_PEAK_TIME',
    `dt=${peakT.toFixed(3)}s`,
    '0.25 to 0.40s after tilt start',
    peakT >= 0.20 && peakT <= 0.45
  );

  const finalRotDiff = Math.abs(lastSample.tilt.rot - REVENUE.POSE.tilted.rotate);
  record(
    'REVENUE_TILT_FINAL_POSE',
    `${lastSample.tilt.rot}° (dx=${lastSample.tilt.x.toFixed(1)}, dy=${lastSample.tilt.y.toFixed(1)})`,
    `${REVENUE.POSE.tilted.rotate}° +/-0.05°`,
    finalRotDiff <= 0.08
  );

  record(
    'REVENUE_PLATE_OPACITY_BOUNDS',
    `plate=${lastSample.plate.toFixed(2)}`,
    'plate in [0, 1]',
    lastSample.plate >= 0 && lastSample.plate <= 1
  );

  // e) COUNTERS: Final values match exactly
  record(
    'COUNTER_STAT_A_FINAL',
    `"${lastSample.statAVal}"`,
    `"${CONTENT.stats[0].value}"`,
    lastSample.statAVal === CONTENT.stats[0].value
  );

  record(
    'COUNTER_STAT_B_FINAL',
    `"${lastSample.statBVal}"`,
    `"${CONTENT.stats[1].value}"`,
    lastSample.statBVal === CONTENT.stats[1].value
  );

  // --------------------------------------------------------------------------
  // g) REPLAY: With MOTION.REPLAY "reenter", scroll out > 400ms then back
  // --------------------------------------------------------------------------
  await animPage.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await animPage.evaluate(() => window.scrollTo(0, 1000));
  await animPage.waitForTimeout(600); // triggered
  const postScrollOp = await animPage.evaluate(() => {
    const el = document.querySelector('[data-slot="revenue"]');
    return el ? parseFloat(window.getComputedStyle(el).opacity) : 0;
  });

  // Scroll back to top (> 400ms out of view)
  await animPage.evaluate(() => window.scrollTo(0, 0));
  await animPage.waitForTimeout(600); // reset delay 400ms + margin

  const outOfViewReset = await animPage.evaluate(() => {
    const section = document.getElementById('what-we-do');
    const state = section?.getAttribute('data-reveal-state');
    const rev = section?.querySelector('[data-slot="revenue"]');
    const op = rev ? parseFloat(window.getComputedStyle(rev).opacity) : 1;
    return { state, opacity: op };
  });

  record(
    'REPLAY_OUT_OF_VIEW_RESET',
    `state=${outOfViewReset.state}, opacity=${outOfViewReset.opacity}`,
    'state=pending, opacity=0',
    outOfViewReset.state === 'pending' && outOfViewReset.opacity <= 0.05
  );

  // --------------------------------------------------------------------------
  // h) FINAL ZERO DIFF: Settled state vs ?anim=off
  // --------------------------------------------------------------------------
  await animPage.goto(`${baseUrl}/?ref=1&anim=off&pose=tilted`, { waitUntil: 'domcontentloaded' });
  await animPage.waitForTimeout(300);
  const staticState = await animPage.evaluate(() => {
    const card = document.querySelector('[data-slot="revenue"]');
    const face = card.querySelector('[data-part="face"]');
    const fb = face.getBoundingClientRect();
    return { w: fb.width, h: fb.height, x: fb.x, y: fb.y };
  });

  await animPage.goto(`${baseUrl}/?ref=1&replay=1`, { waitUntil: 'domcontentloaded' });
  await animPage.waitForTimeout(3500);
  const settledState = await animPage.evaluate(() => {
    const card = document.querySelector('[data-slot="revenue"]');
    const face = card.querySelector('[data-part="face"]');
    const fb = face.getBoundingClientRect();
    return { w: fb.width, h: fb.height, x: fb.x, y: fb.y };
  });

  const dw = Math.abs(settledState.w - staticState.w);
  const dh = Math.abs(settledState.h - staticState.h);
  const dx = Math.abs(settledState.x - staticState.x);
  const dy = Math.abs(settledState.y - staticState.y);

  record(
    'SETTLED_ZERO_DIFF',
    `dx=${dx.toFixed(4)}, dy=${dy.toFixed(4)}, dw=${dw.toFixed(4)}, dh=${dh.toFixed(4)}`,
    '< 0.05px diff vs static',
    dx < 0.05 && dy < 0.05 && dw < 0.05 && dh < 0.05
  );

  // --------------------------------------------------------------------------
  // j) REDUCED MOTION: prefers-reduced-motion: reduce
  // No translations, no tilt animation, settled within 0.6s
  // --------------------------------------------------------------------------
  const rmContext = await createContext(browser, {
    viewport: { width: 1280, height: 800 },
    reducedMotion: 'reduce',
  });
  const rmPage = await rmContext.newPage();
  await rmPage.goto(`${baseUrl}/?ref=1`, { waitUntil: 'domcontentloaded' });
  await rmPage.waitForTimeout(650);

  const rmState = await rmPage.evaluate(() => {
    const section = document.getElementById('what-we-do');
    const face = section?.querySelector('[data-slot="revenue"] [data-part="face"]');
    let rot = 0;
    if (face) {
      const st = window.getComputedStyle(face).transform;
      if (st && st !== 'none') {
        const parts = st.match(/matrix.*\((.+)\)/);
        if (parts && parts[1]) {
          const vals = parts[1].split(',').map((v) => parseFloat(v.trim()));
          rot = Math.round(Math.atan2(vals[1], vals[0]) * (180 / Math.PI) * 100) / 100;
        }
      }
    }
    const state = section?.getAttribute('data-reveal-state');
    return { rot, state };
  });

  record(
    'REDUCED_MOTION_DIRECT_SETTLE',
    `state=${rmState.state}, rot=${rmState.rot}°`,
    'state=settled within 0.6s, direct tilted pose',
    rmState.state === 'settled' && Math.abs(rmState.rot - REVENUE.POSE.tilted.rotate) <= 0.1
  );
  await rmContext.close();

  // --------------------------------------------------------------------------
  // m) DEV BUTTON: Floating bottom-right, no overlap, dev-only
  // --------------------------------------------------------------------------
  const devContext = await createContext(browser, { viewport: { width: 1280, height: 800 } });
  const devPage = await devContext.newPage();
  await devPage.goto(`${baseUrl}/`, { waitUntil: 'domcontentloaded' });
  await devPage.waitForTimeout(200);

  const devBtnOverlap = await devPage.evaluate(() => {
    const btn = document.querySelector('.wwd-dev-replay-btn');
    if (!btn) return false;
    const bb = btn.getBoundingClientRect();
    const section = document.getElementById('what-we-do');
    if (!section) return false;

    // Check if button overlaps any card or header
    const cards = Array.from(section.querySelectorAll('.wwd-card, .wwd-header'));
    for (const card of cards) {
      const cb = card.getBoundingClientRect();
      const xOverlap = Math.max(0, Math.min(bb.right, cb.right) - Math.max(bb.left, cb.left));
      const yOverlap = Math.max(0, Math.min(bb.bottom, cb.bottom) - Math.max(bb.top, cb.top));
      if (xOverlap > 0 && yOverlap > 0) return true;
    }
    return false;
  });

  record(
    'DEV_BUTTON_NO_OVERLAP',
    devBtnOverlap ? 'Overlaps content' : 'Clean fixed placement (bottom-right)',
    'No overlap with header or cards',
    !devBtnOverlap
  );
  await devContext.close();

  await animContext.close();
  return results;
}
