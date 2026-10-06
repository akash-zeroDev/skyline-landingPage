import fs from 'fs';
import { chromium, devices } from 'playwright';

/**
 * Returns the best available Chromium executable on the host system.
 */
export function getChromiumExecutablePath() {
  const candidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/Applications/Opera.app/Contents/MacOS/Opera',
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return undefined;
}

/**
 * Launches a Chromium browser instance using the system browser.
 */
export async function launchBrowser(options = {}) {
  const executablePath = getChromiumExecutablePath();
  const launchOptions = {
    headless: true,
    ...options,
  };
  if (executablePath && !options.executablePath) {
    launchOptions.executablePath = executablePath;
  }
  return await chromium.launch(launchOptions);
}

/**
 * Creates a browser context with optional device profile and viewport.
 */
export async function createContext(browser, options = {}) {
  const contextOptions = {
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    ...options,
  };
  return await browser.newContext(contextOptions);
}

export { devices };
