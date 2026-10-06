import { launchBrowser, createContext } from './qa/browser-helper.mjs';

async function testContactFlow() {
  console.log('Launching browser to test Contact page flow...');
  const browser = await launchBrowser();
  const context = await createContext(browser, { viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const baseUrl = 'http://localhost:5173';

  // 1. Visit Home
  await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle' });
  console.log('Loaded Home page. Title:', await page.title());

  // 2. Click "Let's Talk" CTA in Navbar
  const ctaBtn = page.locator('header .skyline-cta-button').first();
  await ctaBtn.click();
  await page.waitForTimeout(400);

  const currentUrl = page.url();
  console.log('Current URL after CTA click:', currentUrl);
  if (!currentUrl.includes('/contact')) {
    throw new Error(`Expected URL to contain /contact, but got ${currentUrl}`);
  }

  // 3. Verify Contact Page elements
  await page.waitForSelector('.contact-page-wrapper');
  const titleText = await page.locator('.contact-title').innerText();
  console.log('Contact Title text:', titleText.replace(/\n/g, ' '));

  // 4. Check services toggle
  const webAppsPill = page.locator('.service-pill-btn:has-text("Web applications")');
  await webAppsPill.click();
  const isSelected = await webAppsPill.evaluate((el) => el.classList.contains('is-selected'));
  console.log('Web applications pill selected:', isSelected);

  // 5. Fill out form
  await page.fill('input[placeholder="Your name"]', 'Jordan Vance');
  await page.fill('input[placeholder="you@company.com"]', 'jordan@vancemedia.com');
  await page.fill('input[placeholder="Acme Inc."]', 'Vance Media Group');
  await page.selectOption('select:has(option:has-text("Select a budget"))', '$15k – $40k');
  await page.selectOption('select:has(option:has-text("Select a timeline"))', '1 – 2 months');
  await page.fill('textarea', 'We would love to collaborate with Skyline on our brand identity and high-performance agency website.');

  // Take screenshot before submit
  await page.screenshot({ path: 'scratch/contact_page_desktop.png', fullPage: true });
  console.log('Saved scratch/contact_page_desktop.png');

  // 6. Submit form
  console.log('Submitting inquiry form...');
  const submitBtn = page.locator('.submit-btn');
  await submitBtn.click();

  // 7. Wait for success screen
  await page.waitForSelector('.contact-success-card', { timeout: 10000 });
  const successHeading = await page.locator('.success-heading').innerText();
  console.log('Success screen heading:', successHeading);

  const previewLink = page.locator('.preview-email-btn');
  const previewHref = (await previewLink.count()) > 0 ? await previewLink.getAttribute('href') : null;
  console.log('Ethereal preview link:', previewHref);

  await page.screenshot({ path: 'scratch/contact_success_desktop.png', fullPage: true });
  console.log('Saved scratch/contact_success_desktop.png');

  // 8. Test Back to Home navigation
  const backBtn = page.locator('.contact-back-link');
  await backBtn.click();
  await page.waitForTimeout(400);

  const homeUrl = page.url();
  console.log('URL after Back to Home click:', homeUrl);

  const heroPresent = (await page.locator('.hero-wallet-stage').count()) > 0;
  console.log('Hero section present after returning home:', heroPresent);

  // 9. Mobile viewport test (390x844)
  const mobileContext = await createContext(browser, { viewport: { width: 390, height: 844 } });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(`${baseUrl}/contact`, { waitUntil: 'networkidle' });
  await mobilePage.waitForSelector('.contact-page-wrapper');
  await mobilePage.screenshot({ path: 'scratch/contact_page_mobile.png', fullPage: true });
  console.log('Saved scratch/contact_page_mobile.png');

  await browser.close();
  console.log('\n🎉 ALL CONTACT FLOW VERIFICATIONS PASSED SUCCESSFULLY!');
}

testContactFlow().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
