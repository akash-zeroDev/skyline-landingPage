import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import opentype from 'opentype.js';
import puppeteer from 'puppeteer-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Helper to compute deterministic FNV-1a hash
export function computeHeadlineHash(fontSize, lines) {
  const str = `${fontSize}:` + lines.map(l => `${l.text}|${l.x}|${l.baseline}`).join(';');
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16);
}

// Helper to split a path data string into closed contours at each 'M'
function splitContours(fillD) {
  return fillD
    .trim()
    .split(/(?=M)/)
    .filter(Boolean)
    .map(c => {
      const trimmed = c.trim();
      return (trimmed.endsWith('Z') || trimmed.endsWith('z')) ? trimmed : trimmed + 'Z';
    });
}

async function main() {
  const args = process.argv.slice(2);
  let targetUrl = 'http://localhost:5173';
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--url' && args[i + 1]) {
      targetUrl = args[i + 1];
      i++;
    } else if (args[i].startsWith('--url=')) {
      targetUrl = args[i].split('=')[1];
    }
  }

  const urlObj = new URL(targetUrl);
  urlObj.searchParams.set('headlineRender', 'text');
  urlObj.searchParams.set('anim', 'off');
  const fullUrl = urlObj.toString();

  console.log(`[headline:paths] Connecting to ${fullUrl}...`);

  // Load font
  const fontPath = path.join(__dirname, 'fonts', 'Anton-Regular.ttf');
  if (!fs.existsSync(fontPath)) {
    console.error(`[headline:paths] Font file not found at ${fontPath}`);
    process.exit(1);
  }
  const fontBuffer = fs.readFileSync(fontPath);
  const font = opentype.parse(fontBuffer.buffer.slice(fontBuffer.byteOffset, fontBuffer.byteOffset + fontBuffer.byteLength));

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    headless: 'new',
    defaultViewport: { width: 1536, height: 1024 }
  });

  let pageData;
  try {
    const page = await browser.newPage();
    await page.goto(fullUrl, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.evaluate(() => document.fonts.ready);

    pageData = await page.evaluate(() => {
      const texts = Array.from(document.querySelectorAll('.hero-headline svg text[data-headline-line]'));
      if (!texts.length) {
        // Fallback selector
        const fallbackTexts = Array.from(document.querySelectorAll('.hero-headline svg text'));
        return fallbackTexts.map((t, idx) => {
          const chars = [];
          const num = t.getNumberOfChars();
          for (let i = 0; i < num; i++) {
            const pt = t.getStartPositionOfChar(i);
            chars.push({ char: t.textContent[i], x: pt.x, y: pt.y });
          }
          return {
            lineIndex: idx,
            text: t.textContent,
            baseline: Number(t.getAttribute('y')),
            x: Number(t.getAttribute('x')),
            chars,
          };
        });
      }

      return texts.map((t) => {
        const lineIdx = Number(t.getAttribute('data-headline-line'));
        const chars = [];
        const num = t.getNumberOfChars();
        for (let i = 0; i < num; i++) {
          const pt = t.getStartPositionOfChar(i);
          chars.push({ char: t.textContent[i], x: pt.x, y: pt.y });
        }
        return {
          lineIndex: lineIdx,
          text: t.textContent,
          baseline: Number(t.getAttribute('y')),
          x: Number(t.getAttribute('x')),
          chars,
        };
      });
    });
  } catch (err) {
    console.error('[headline:paths] Failed to extract glyph data from browser:', err);
    await browser.close();
    process.exit(1);
  } finally {
    await browser.close();
  }

  if (!pageData || pageData.length === 0) {
    console.error('[headline:paths] No headline lines found in page DOM.');
    process.exit(1);
  }

  const fontSize = 128;
  const hashLines = pageData.map(l => ({ text: l.text, x: l.x, baseline: l.baseline }));
  const sourceHash = computeHeadlineHash(fontSize, hashLines);

  let totalGlyphs = 0;
  let totalContours = 0;

  const lines = pageData.map((lineData) => {
    const glyphs = [];
    for (const charData of lineData.chars) {
      if (charData.char === ' ') continue; // skip spaces
      const glyph = font.charToGlyph(charData.char);
      if (!glyph) {
        console.error(`[headline:paths] Missing glyph for character "${charData.char}"`);
        process.exit(1);
      }
      const glyphPath = glyph.getPath(charData.x, charData.y, fontSize);
      const fill = glyphPath.toPathData(2);
      const contours = splitContours(fill);

      glyphs.push({
        char: charData.char,
        fill,
        contours,
      });

      totalGlyphs++;
      totalContours += contours.length;
    }

    return { glyphs };
  });

  const outputObj = {
    sourceHash,
    fontSize,
    lines,
  };

  const dataDir = path.join(rootDir, 'src', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const outPath = path.join(dataDir, 'headlinePaths.json');
  const jsonContent = JSON.stringify(outputObj, null, 2);
  fs.writeFileSync(outPath, jsonContent, 'utf-8');
  const stat = fs.statSync(outPath);

  console.log(`[headline:paths] Success!`);
  console.log(`  Source Hash   : ${sourceHash}`);
  console.log(`  Total Glyphs  : ${totalGlyphs}`);
  console.log(`  Total Contours: ${totalContours}`);
  console.log(`  Output Path   : ${outPath}`);
  console.log(`  File Size     : ${(stat.size / 1024).toFixed(2)} KB`);
}

main().catch((err) => {
  console.error('[headline:paths] Fatal error:', err);
  process.exit(1);
});
