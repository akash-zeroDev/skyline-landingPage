import { useEffect, useRef } from 'react';
import './FluidWaveCanvas.css';

/**
 * FluidWaveCanvas
 * Interactive 2D spring-damper fluid wave physics engine.
 * Discretizes liquid surface into interconnected harmonic oscillators (Euler wave equation).
 * Supports cursor splashing, wave propagation, layered depth, and ambient fluid motion.
 */
export function FluidWaveCanvas({
  springCount = 80,
  tension = 0.022,
  damping = 0.038,
  spread = 0.24,
  fillHeight = 0.33, // Resting level: ~33% from bottom, resting below the main description
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let isVisible = true;
    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Spring structure: array of { y, targetY, speed }
    let springs = [];
    let bgSprings = [];

    const initSprings = (w, h) => {
      const targetY = h * (1 - fillHeight);
      const bgTargetY = h * (1 - (fillHeight + 0.05)); // Background layer slightly higher

      springs = [];
      bgSprings = [];

      for (let i = 0; i < springCount; i++) {
        springs.push({
          y: targetY,
          targetY,
          speed: 0,
        });
        bgSprings.push({
          y: bgTargetY,
          targetY: bgTargetY,
          speed: 0,
        });
      }
    };

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      initSprings(width, height);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // IntersectionObserver to pause rendering when footer is offscreen
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    // Mouse / Pointer splash interaction
    let lastMouseX = null;
    let lastMouseY = null;
    let lastTime = performance.now();

    const splash = (x, force) => {
      if (width <= 0 || springs.length === 0) return;
      const index = Math.round((x / width) * (springCount - 1));
      const clampedForce = Math.max(-25, Math.min(25, force));

      const radius = 4;
      for (let i = -radius; i <= radius; i++) {
        const targetIdx = index + i;
        if (targetIdx >= 0 && targetIdx < springCount) {
          const falloff = 1 - Math.abs(i) / (radius + 1);
          springs[targetIdx].speed += clampedForce * falloff;
          if (bgSprings[targetIdx]) {
            bgSprings[targetIdx].speed += clampedForce * 0.7 * falloff;
          }
        }
      }
    };

    const handlePointerMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const now = performance.now();
      const dt = Math.max(1, now - lastTime);

      if (lastMouseX !== null && lastMouseY !== null) {
        const dy = y - lastMouseY;
        const speed = (dy / dt) * 16;
        // Splash when cursor passes near or enters water surface
        const targetY = height * (1 - fillHeight);
        if (Math.abs(y - targetY) < height * 0.4) {
          splash(x, speed * 0.45);
        }
      }

      lastMouseX = x;
      lastMouseY = y;
      lastTime = now;
    };

    const handlePointerEnter = (e) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      splash(x, 10); // Friendly entrance splash
      lastMouseX = x;
      lastMouseY = e.clientY - rect.top;
      lastTime = performance.now();
    };

    const handlePointerLeave = () => {
      lastMouseX = null;
      lastMouseY = null;
    };

    container.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('pointerenter', handlePointerEnter, { passive: true });
    container.addEventListener('pointerleave', handlePointerLeave, { passive: true });

    // Physics Update Loop
    let time = 0;

    const updatePhysics = () => {
      time += 0.025;

      const targetY = height * (1 - fillHeight);
      const bgTargetY = height * (1 - (fillHeight + 0.05));

      // 1. Ambient gentle breathing
      const ambientAmp = prefersReducedMotion ? 0.6 : 3.0;
      for (let i = 0; i < springCount; i++) {
        const ratio = i / springCount;
        const waveOffset = Math.sin(time * 1.8 + ratio * Math.PI * 2.5) * ambientAmp;
        const bgWaveOffset = Math.cos(time * 1.4 + ratio * Math.PI * 2.0) * (ambientAmp * 0.9);

        // Update Foreground Springs (Hooke's Law)
        const s = springs[i];
        const diff = s.y - (targetY + waveOffset);
        s.speed += -tension * diff - damping * s.speed;
        s.y += s.speed;

        // Update Background Springs
        const bs = bgSprings[i];
        const bgDiff = bs.y - (bgTargetY + bgWaveOffset);
        bs.speed += -(tension * 0.9) * bgDiff - damping * bs.speed;
        bs.y += bs.speed;
      }

      // 2. Neighbor Wave Propagation Passes (Euler wave transmission)
      const passes = 8;
      for (let p = 0; p < passes; p++) {
        // Foreground propagation
        for (let i = 0; i < springCount; i++) {
          if (i > 0) {
            const leftDiff = spread * (springs[i].y - springs[i - 1].y);
            springs[i - 1].speed += leftDiff;
            springs[i - 1].y += leftDiff;
          }
          if (i < springCount - 1) {
            const rightDiff = spread * (springs[i].y - springs[i + 1].y);
            springs[i + 1].speed += rightDiff;
            springs[i + 1].y += rightDiff;
          }

          // Background propagation
          if (i > 0) {
            const leftDiffBg = (spread * 0.85) * (bgSprings[i].y - bgSprings[i - 1].y);
            bgSprings[i - 1].speed += leftDiffBg;
            bgSprings[i - 1].y += leftDiffBg;
          }
          if (i < springCount - 1) {
            const rightDiffBg = (spread * 0.85) * (bgSprings[i].y - bgSprings[i + 1].y);
            bgSprings[i + 1].speed += rightDiffBg;
            bgSprings[i + 1].y += rightDiffBg;
          }
        }
      }
    };

    // Render loop
    const render = () => {
      if (isVisible && width > 0 && height > 0) {
        updatePhysics();

        ctx.clearRect(0, 0, width, height);

        const dx = width / (springCount - 1);

        // --- LAYER 1: Background Wave (Lighter mint depth layer) ---
        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.lineTo(0, bgSprings[0].y);

        for (let i = 0; i < springCount - 1; i++) {
          const x1 = i * dx;
          const y1 = bgSprings[i].y;
          const x2 = (i + 1) * dx;
          const y2 = bgSprings[i + 1].y;
          const xc = (x1 + x2) / 2;
          const yc = (y1 + y2) / 2;
          ctx.quadraticCurveTo(x1, y1, xc, yc);
        }
        ctx.lineTo(width, bgSprings[springCount - 1].y);
        ctx.lineTo(width, height);
        ctx.closePath();

        const bgGrad = ctx.createLinearGradient(0, height * (1 - fillHeight - 0.1), 0, height);
        bgGrad.addColorStop(0, 'rgba(167, 243, 208, 0.55)'); // #A7F3D0 luminous mint
        bgGrad.addColorStop(1, 'rgba(110, 231, 183, 0.35)'); // #6EE7B7
        ctx.fillStyle = bgGrad;
        ctx.fill();

        // --- LAYER 2: Foreground Wave (Primary Mint Gradient) ---
        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.lineTo(0, springs[0].y);

        for (let i = 0; i < springCount - 1; i++) {
          const x1 = i * dx;
          const y1 = springs[i].y;
          const x2 = (i + 1) * dx;
          const y2 = springs[i + 1].y;
          const xc = (x1 + x2) / 2;
          const yc = (y1 + y2) / 2;
          ctx.quadraticCurveTo(x1, y1, xc, yc);
        }
        ctx.lineTo(width, springs[springCount - 1].y);
        ctx.lineTo(width, height);
        ctx.closePath();

        const fgGrad = ctx.createLinearGradient(0, height * (1 - fillHeight - 0.05), 0, height);
        // Mint shade matching reference (#6EE7B7 down to #34D399)
        fgGrad.addColorStop(0, 'rgba(110, 231, 183, 0.90)'); // #6EE7B7
        fgGrad.addColorStop(0.55, 'rgba(86, 224, 168, 0.94)'); // Fresh mint body
        fgGrad.addColorStop(1, 'rgba(52, 211, 153, 0.96)'); // #34D399 bottom seal
        ctx.fillStyle = fgGrad;
        ctx.fill();

        // --- LAYER 3: Surface Crest Highlight Line ---
        ctx.beginPath();
        ctx.moveTo(0, springs[0].y);
        for (let i = 0; i < springCount - 1; i++) {
          const x1 = i * dx;
          const y1 = springs[i].y;
          const x2 = (i + 1) * dx;
          const y2 = springs[i + 1].y;
          const xc = (x1 + x2) / 2;
          const yc = (y1 + y2) / 2;
          ctx.quadraticCurveTo(x1, y1, xc, yc);
        }
        ctx.lineTo(width, springs[springCount - 1].y);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.lineWidth = 2.0;
        ctx.stroke();

        // Secondary subtle mint crest line
        ctx.beginPath();
        ctx.moveTo(0, springs[0].y + 1);
        for (let i = 0; i < springCount - 1; i++) {
          const x1 = i * dx;
          const y1 = springs[i].y + 1;
          const x2 = (i + 1) * dx;
          const y2 = springs[i + 1].y + 1;
          const xc = (x1 + x2) / 2;
          const yc = (y1 + y2) / 2;
          ctx.quadraticCurveTo(x1, y1, xc, yc);
        }
        ctx.lineTo(width, springs[springCount - 1].y + 1);
        ctx.strokeStyle = 'rgba(110, 231, 183, 0.85)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerenter', handlePointerEnter);
      container.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [springCount, tension, damping, spread, fillHeight]);

  return (
    <div ref={containerRef} className="fluid-wave-container" aria-hidden="true">
      <canvas ref={canvasRef} className="fluid-wave-canvas" />
    </div>
  );
}

export default FluidWaveCanvas;
