/**
 * Harbor visual capture — renders key operator pages to PNGs so they can be
 * inspected when no browser is available to the agent.
 *
 * Usage:
 *   BASE_URL=http://localhost:3000 \
 *   INFINIBAY_TOKEN="<paste your JWT from devtools → Application → Local Storage → 'token'>" \
 *   node scripts/harbor-shots.mjs
 *
 * Without INFINIBAY_TOKEN it still captures the (unauthenticated) sign-in page,
 * which already exercises Harbor inputs/buttons/typography.
 *
 * Output: ./.screenshots/<name>.png
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const TOKEN = process.env.INFINIBAY_TOKEN || '';
const OUT = '.screenshots';
mkdirSync(OUT, { recursive: true });

// Pages worth seeing. Authenticated ones only fire when a token is provided.
const PUBLIC_PAGES = [['sign-in', '/auth/sign-in']];
const AUTH_PAGES = [
  ['overview', '/overview'],
  ['departments', '/departments'],
  ['desktops', '/desktops'],
  ['pools', '/pools'],
  ['blueprints', '/blueprints'],
  ['scripts', '/scripts'],
  ['applications', '/applications'],
  ['settings', '/settings'],
];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  colorScheme: 'dark',
});
const page = await ctx.newPage();
page.on('console', (m) => { if (m.type() === 'error') console.log('  [console.error]', m.text().slice(0, 200)); });

async function shot(name, path) {
  const url = BASE + path;
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  } catch (e) {
    console.log(`! ${name} (${path}) nav warning: ${e.message.split('\n')[0]}`);
  }
  await page.waitForTimeout(1200); // let Harbor mount/animate
  const file = `${OUT}/${name}.png`;
  await page.screenshot({ path: file, fullPage: true });
  console.log(`✓ ${name} -> ${file}  (final URL: ${page.url()})`);
}

for (const [name, path] of PUBLIC_PAGES) await shot(name, path);

if (TOKEN) {
  // Seed the token the same way the app does, then reload into an authed session.
  await page.goto(BASE + '/overview', { waitUntil: 'domcontentloaded' });
  await page.evaluate((t) => localStorage.setItem('token', t), TOKEN);
  for (const [name, path] of AUTH_PAGES) await shot(name, path);
} else {
  console.log('No INFINIBAY_TOKEN set — captured sign-in only. Set it to capture authed pages.');
}

await browser.close();
console.log('\nDone. PNGs in ./.screenshots/');
