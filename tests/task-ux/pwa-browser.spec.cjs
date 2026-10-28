const { test, expect } = require('@playwright/test');
const base = 'http://127.0.0.1:4187';

async function controlled(page) {
  await page.goto(base + '/app/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
}
async function cacheContents(page) {
  return page.evaluate(async () => {
    const result = [];
    for (const name of await caches.keys()) {
      const cache = await caches.open(name);
      for (const request of await cache.keys()) result.push({ name, url: request.url, body: await (await cache.match(request)).text() });
    }
    return result;
  });
}
function privateLeak(entries) { return entries.some(entry => /PRIVATE-[AB]/.test(entry.url + entry.body)); }

test('manifest, worker scope, history and deep link', async ({ page }) => {
  await controlled(page);
  const manifest = await page.evaluate(async () => (await fetch('/app/manifest.webmanifest')).json());
  expect(new URL(manifest.start_url, base).pathname.startsWith(manifest.scope)).toBe(true);
  expect(await page.evaluate(async () => (await navigator.serviceWorker.ready).scope)).toBe(base + '/app/');
  await page.getByRole('link', { name: 'Detail' }).click();
  await expect(page).toHaveURL(base + '/app/detail');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'PWA fixture' })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(base + '/app/');
});

test('offline fallback, mutations and same-context account isolation', async ({ page, context, request }) => {
  await controlled(page);
  await context.addCookies([{ name: 'user', value: 'A', url: base }]);
  const a = await page.evaluate(async () => ({ text: await (await fetch('/app/private.json')).text(), html: await (await fetch('/app/private')).text() }));
  expect(a.text).toContain('PRIVATE-A'); expect(a.html).toContain('PRIVATE-A');
  expect(privateLeak(await cacheContents(page))).toBe(false);
  await page.evaluate(async () => { const c = await caches.open('negative-probe'); await c.put('/app/leak', new Response('PRIVATE-A')); });
  try { expect(privateLeak(await cacheContents(page))).toBe(true); } finally { await page.evaluate(() => caches.delete('negative-probe')); }
  expect(privateLeak(await cacheContents(page))).toBe(false);
  await context.clearCookies();
  await context.addCookies([{ name: 'user', value: 'B', url: base }]);
  expect(await page.evaluate(async () => (await fetch('/app/private.json')).text())).toContain('PRIVATE-B');
  const before = Number(await (await request.get(base + '/control/writes')).text());
  await context.setOffline(true);
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('#status')).toHaveText('Not saved');
  await page.goto(base + '/app/private');
  await expect(page.getByRole('heading', { name: 'Offline' })).toBeVisible();
  expect(privateLeak(await cacheContents(page))).toBe(false);
  await context.setOffline(false);
  await page.goto(base + '/app/private');
  await expect(page.getByRole('heading', { name: 'PRIVATE-B' })).toBeVisible();
  expect(Number(await (await request.get(base + '/control/writes')).text())).toBe(before);
});

test('HTTP cache negative control detects stale account content', async ({ page, context }) => {
  await controlled(page);
  await context.addCookies([{ name: 'user', value: 'A', url: base }]);
  const get = suffix => page.evaluate(async suffix => (await fetch('/app/private.json' + suffix)).text(), suffix);
  expect(await get('?unsafe=1')).toContain('PRIVATE-A');
  await context.clearCookies(); await context.addCookies([{ name: 'user', value: 'B', url: base }]);
  expect(await get('?unsafe=1')).toContain('PRIVATE-A');
  expect(await get('')).toContain('PRIVATE-B');
});

test('waiting update preserves draft and cleans only owned caches', async ({ page, request }) => {
  await controlled(page);
  await page.locator('#draft').fill('unsaved');
  await page.evaluate(() => caches.open('unrelated-sentinel'));
  await request.post(base + '/control/version');
  await page.evaluate(async () => (await navigator.serviceWorker.ready).update());
  await expect.poll(() => page.evaluate(async () => Boolean((await navigator.serviceWorker.ready).waiting))).toBe(true);
  await expect(page.locator('#draft')).toHaveValue('unsaved');
  await page.locator('#draft').fill('');
  await page.evaluate(async () => (await navigator.serviceWorker.ready).waiting.postMessage('activate'));
  await expect.poll(() => page.evaluate(async () => (await caches.keys()).filter(x => x.startsWith('pwa-fixture-')).length)).toBe(1);
  expect(await page.evaluate(() => caches.has('unrelated-sentinel'))).toBe(true);
});

test('permission requires a gesture and notification targets stay in scope', async ({ page, context }) => {
  await page.addInitScript(() => {
    window.permissionCalls = 0;
    Object.defineProperty(window, 'Notification', { configurable: true, value: { permission: 'default', requestPermission: async () => { window.permissionCalls++; return 'denied'; } } });
  });
  await controlled(page);
  expect(await page.evaluate(() => window.permissionCalls)).toBe(0);
  await page.getByRole('button', { name: 'Enable notifications' }).click();
  await expect(page.locator('#permission')).toHaveText('denied');
  expect(await page.evaluate(() => window.permissionCalls)).toBe(1);
  expect(await page.evaluate(() => window.safeTarget('https://example.org/'))).toBeNull();
  expect(await page.evaluate(() => window.safeTarget('/other'))).toBeNull();
  expect(await page.evaluate(() => window.safeTarget('/app/detail'))).toBe(base + '/app/detail');
  await context.addCookies([{ name: 'user', value: 'B', url: base }]);
  expect(await page.evaluate(async () => (await fetch(window.safeTarget('/app/tenant-a'))).status)).toBe(403);
});
