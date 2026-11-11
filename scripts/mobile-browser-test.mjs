import { chromium, webkit, devices } from 'playwright';
import { mkdir } from 'node:fs/promises';

const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:4173/green-iguanas/';
const output = 'mobile-test-results';
const routes = [
  ['home', '#/'],
  ['bobby-kills', '#/character/bobby-kills'],
  ['indigo', '#/character/indigo'],
  ['owen', '#/character/owen'],
  ['freed', '#/character/freed'],
  ['heilbrun', '#/character/heilbrun'],
  ['dice', '#/dice'],
  ['dragonbowl', '#/dragonbowl'],
];
const browsers = [
  ['chromium-android', chromium, devices['Pixel 7']],
  ['webkit-iphone', webkit, devices['iPhone 13']],
];
let failures = 0;
await mkdir(output, { recursive: true });
for (const [name, browserType, device] of browsers) {
  const browser = await browserType.launch({ headless: true });
  try {
    const context = await browser.newContext({ ...device, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('crash', () => errors.push('Browser page crashed'));
    for (const [label, hash] of routes) {
      const at = `${base}${hash}`;
      try {
        const response = await page.goto(at, { waitUntil: 'networkidle', timeout: 30000 });
        if (response && !response.ok()) throw new Error(`HTTP ${response.status()}`);
        await page.locator('#main-content').waitFor({ state: 'visible', timeout: 15000 });
        await page.waitForTimeout(350);
        const dimensions = await page.evaluate(() => ({
          documentWidth: document.documentElement.scrollWidth,
          viewportWidth: document.documentElement.clientWidth,
          heading: document.querySelector('h1')?.textContent?.trim() || '',
        }));
        if (dimensions.documentWidth > dimensions.viewportWidth + 3) {
          throw new Error(`Horizontal overflow: ${dimensions.documentWidth}px document / ${dimensions.viewportWidth}px viewport`);
        }
        if (!dimensions.heading) throw new Error('Missing page H1');
        if (errors.length) throw new Error(errors.splice(0).join('; '));
        if (label === 'home') {
          const cards = await page.locator('a.cinematic-hero').count();
          if (cards !== 5) throw new Error(`Expected 5 character cards, got ${cards}`);
        }
        await page.screenshot({ path: `${output}/${name}-${label}.png`, animations: 'disabled' });
        console.log(`PASS ${name}: ${label} (${dimensions.viewportWidth}px)`);
      } catch (error) {
        failures++;
        console.error(`FAIL ${name}: ${label}: ${error.message}`);
        await page.screenshot({ path: `${output}/${name}-${label}-failure.png`, timeout: 5000 }).catch(() => {});
        errors.length = 0;
      }
    }
    await context.close();
  } finally {
    await browser.close();
  }
}
if (failures) {
  console.error(`Mobile tests: ${failures} failure(s)`);
  process.exitCode = 1;
} else {
  console.log('Mobile tests passed in Chromium and WebKit.');
}
