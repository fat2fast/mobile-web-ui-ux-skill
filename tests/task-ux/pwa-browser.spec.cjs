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
function assertNoPrivate(entries) { expect(privateLeak(entries), 'private data must not enter CacheStorage').toBe(false); }

test('manifest, worker scope, history and deep link', async ({ page }) => {
  await controlled(page);
  await expect(page.locator('#display-mode')).toHaveText('Browser tab');
  const manifest = await page.evaluate(async () => (await fetch('/app/manifest.webmanifest')).json());
  expect(new URL(manifest.start_url, base).pathname.startsWith(manifest.scope)).toBe(true);
  expect((await page.request.get(new URL(manifest.icons[0].src, base).href)).ok()).toBe(true);
  expect(await page.evaluate(async () => (await navigator.serviceWorker.ready).scope)).toBe(base + '/app/');
  await page.getByRole('link', { name: 'Detail' }).click();
  await expect(page).toHaveURL(base + '/app/detail');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'PWA fixture' })).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(base + '/app/');
  await page.goForward();
  await expect(page).toHaveURL(base + '/app/detail');
});

test('offline fallback, mutations and same-context account isolation', async ({ page, context, request }) => {
  await controlled(page);
  await context.addCookies([{ name: 'user', value: 'A', url: base }]);
  const a = await page.evaluate(async () => ({ text: await (await fetch('/app/private.json')).text(), html: await (await fetch('/app/private')).text() }));
  expect(a.text).toContain('PRIVATE-A'); expect(a.html).toContain('PRIVATE-A');
  assertNoPrivate(await cacheContents(page));
  await page.evaluate(async () => { const c = await caches.open('negative-probe'); await c.put('/app/leak', new Response('PRIVATE-A')); });
  try { const poisoned = await cacheContents(page); expect(() => assertNoPrivate(poisoned)).toThrow('private data must not enter CacheStorage'); } finally { await page.evaluate(() => caches.delete('negative-probe')); }
  assertNoPrivate(await cacheContents(page));
  await context.clearCookies();
  expect(await page.evaluate(async () => (await fetch('/app/private.json', { cache: 'no-store' })).status)).toBe(401);
  await context.addCookies([{ name: 'user', value: 'B', url: base }]);
  expect(await page.evaluate(async () => (await fetch('/app/private.json')).text())).toContain('PRIVATE-B');
  const before = Number(await (await request.get(base + '/control/writes')).text());
  await context.setOffline(true);
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('#status')).toHaveText('Not saved');
  expect(await page.evaluate(async () => { try { await fetch('/app/write', { method: 'PUT' }); return 'unexpected success'; } catch { return 'offline failure'; } })).toBe('offline failure');
  await page.goto(base + '/app/private');
  await expect(page.getByRole('heading', { name: 'Offline' })).toBeVisible();
  expect(privateLeak(await cacheContents(page))).toBe(false);
  await context.setOffline(false);
  await page.goto(base + '/app/private');
  await expect(page.getByRole('heading', { name: 'PRIVATE-B' })).toBeVisible();
  expect(Number(await (await request.get(base + '/control/writes')).text())).toBe(before);
});

test('offline fallback ignores unrelated cache entries', async ({ page, context }) => {
  await page.goto(base + '/');
  await page.evaluate(async () => { const cache = await caches.open('unrelated-sentinel'); await cache.put('/app/offline.html', new Response('<h1>PRIVATE-A</h1>', {headers: {'Content-Type': 'text/html'}})); });
  await page.goto(base + '/app/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await expect.poll(() => page.evaluate(() => Boolean(navigator.serviceWorker.controller))).toBe(true);
  await context.setOffline(true);
  await page.goto(base + '/app/detail');
  await expect(page.getByRole('heading', { name: 'Offline' })).toBeVisible();
  await expect(page.getByText('PRIVATE-A')).toHaveCount(0);
  expect(await page.evaluate(() => caches.has('unrelated-sentinel'))).toBe(true);
});

test('worker rejects private or redirected precache responses', async ({ page, request }) => {
  await controlled(page);
  try {
    for (const mode of ['private', 'redirect']) {
      await request.post(base + '/control/assets?mode=' + mode);
      await request.post(base + '/control/version');
      const outcome = await page.evaluate(async () => {
        const reg = await navigator.serviceWorker.ready;
        const state = new Promise(resolve => reg.addEventListener('updatefound', () => {
          const worker = reg.installing;
          worker.addEventListener('statechange', () => { if (worker.state === 'redundant' || worker.state === 'installed') resolve(worker.state); });
        }, { once: true }));
        await reg.update();
        return state;
      });
      expect(outcome).toBe('redundant');
      assertNoPrivate(await cacheContents(page));
    }
  } finally { await request.post(base + '/control/assets?mode=safe'); }
});

test('simulated standalone keeps navigation and manifest scope rules', async ({ browser }) => {
  const context = await browser.newContext();
  await context.addInitScript(() => {
    const real = window.matchMedia.bind(window);
    window.matchMedia = query => query === '(display-mode: standalone)' ? { matches: true, media: query, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {}, dispatchEvent() { return false; } } : real(query);
  });
  const page = await context.newPage();
  try {
    await controlled(page);
    await expect(page.locator('#display-mode')).toHaveText('Standalone mode');
    const manifest = await page.evaluate(async () => (await fetch('/app/manifest.webmanifest')).json());
    const inScope = (start, scope) => new URL(start, base).pathname.startsWith(new URL(scope, base).pathname);
    expect(inScope(manifest.start_url, manifest.scope)).toBe(true);
    expect(inScope('/other', manifest.scope)).toBe(false);
    expect(inScope(manifest.start_url, '/wrong/')).toBe(false);
    await page.getByRole('link', { name: 'Detail' }).click();
    await page.goBack(); await expect(page).toHaveURL(base + '/app/');
    await page.goForward(); await expect(page).toHaveURL(base + '/app/detail');
  } finally { await context.close(); }
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
  const version = () => page.evaluate(() => new Promise(resolve => { const channel = new MessageChannel(); channel.port1.onmessage = event => resolve(event.data); navigator.serviceWorker.controller.postMessage('version', [channel.port2]); }));
  const previousVersion = await version();
  await page.locator('#draft').fill('unsaved');
  await page.evaluate(() => caches.open('unrelated-sentinel'));
  await request.post(base + '/control/version');
  await page.evaluate(async () => (await navigator.serviceWorker.ready).update());
  await expect.poll(() => page.evaluate(async () => Boolean((await navigator.serviceWorker.ready).waiting))).toBe(true);
  await expect(page.locator('#draft')).toHaveValue('unsaved');
  await expect(page.getByRole('button', { name: 'Apply update' })).toBeVisible();
  await page.getByRole('button', { name: 'Apply update' }).click();
  await expect(page.locator('#update-status')).toHaveText('Save your draft before updating');
  await expect(page.locator('#draft')).toHaveValue('unsaved');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('#status')).toHaveText('Saved');
  expect(await (await request.get(base + '/app/saved-draft')).text()).toBe('unsaved');
  await page.getByRole('button', { name: 'Apply update' }).click();
  await expect(page.locator('#update-status')).toHaveText('Update active');
  expect(await version()).not.toBe(previousVersion);
  await expect(page.getByRole('button', { name: 'Apply update' })).toBeHidden();
  await expect.poll(() => page.evaluate(async () => (await caches.keys()).filter(x => x.startsWith('pwa-fixture-')).length)).toBe(1);
  expect(await page.evaluate(() => caches.has('unrelated-sentinel'))).toBe(true);
  await page.reload();
  expect(await (await request.get(base + '/app/saved-draft')).text()).toBe('unsaved');
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

for (const width of [320, 390, 1280]) {
  test(`task and overlay remain usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 600 });
    await controlled(page);
    await page.locator('#draft').fill('A long draft label and content without losing the user input');
    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(page.getByRole('button', { name: 'Close menu' })).toBeFocused();
    await page.getByRole('button', { name: 'Close menu' }).click();
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.locator('#status')).toHaveText('Saved');
  });
}

test('install offer is event gated and dismissible without blocking task', async ({ page }) => {
  await controlled(page);
  await expect(page.locator('#install-offer')).toBeHidden();
  await page.evaluate(() => { const event = new Event('beforeinstallprompt', { cancelable: true }); event.prompt = () => { throw new Error('not user requested'); }; window.dispatchEvent(event); });
  await expect(page.locator('#install-offer')).toBeVisible();
  await page.getByRole('button', { name: 'Dismiss' }).click();
  await expect(page.locator('#install-offer')).toBeHidden();
  await page.locator('#draft').fill('still usable');
  await page.getByRole('button', { name: 'Save' }).click();
  await expect(page.locator('#status')).toHaveText('Saved');
});

for (const state of ['denied', 'unsupported']) {
  test(`notification ${state} fallback`, async ({ page }) => {
    await page.addInitScript(state => {
      if (state === 'unsupported') delete window.Notification;
      else Object.defineProperty(window, 'Notification', { configurable: true, value: { permission: 'denied', requestPermission: () => { throw new Error('unexpected request'); } } });
    }, state);
    await controlled(page);
    await page.getByRole('button', { name: 'Enable notifications' }).click();
    await expect(page.locator('#permission')).toHaveText(state);
    await page.getByRole('button', { name: 'Check notifications' }).click();
    await expect(page.locator('#subscription')).toHaveText('Not subscribed');
  });
}

test('revoked permission and absent subscription do not claim delivery', async ({ page }) => {
  await page.addInitScript(() => {
    window.mockPermission = 'granted';
    Object.defineProperty(window, 'Notification', { configurable: true, value: { get permission() { return window.mockPermission; } } });
  });
  await controlled(page);
  await page.getByRole('button', { name: 'Check notifications' }).click();
  await expect(page.locator('#subscription')).toHaveText('Not subscribed');
  await page.evaluate(() => { window.mockPermission = 'denied'; });
  await page.getByRole('button', { name: 'Check notifications' }).click();
  await expect(page.locator('#subscription')).toHaveText('Not subscribed');
});

test('saving does not discard edits made while the request is pending', async ({ page }) => {
  await controlled(page);
  let release;
  const gate = new Promise(resolve => { release = resolve; });
  let received;
  const requestStarted = new Promise(resolve => { received = resolve; });
  await page.route('**/app/write', async route => { received(); await gate; await route.continue(); });
  await page.locator('#draft').fill('first');
  await page.getByRole('button', { name: 'Save' }).click();
  await requestStarted;
  await page.locator('#draft').fill('later edit');
  release();
  await expect(page.locator('#status')).toHaveText('Saved');
  await expect(page.locator('#draft')).toHaveValue('later edit');
});

test('stale CSRF is rejected and a current PUT reaches the server', async ({ page, request }) => {
  await controlled(page);
  const count = async () => Number(await (await request.get(base + '/control/writes')).text());
  const before = await count();
  const stale = await page.evaluate(async () => (await fetch('/app/write', { method: 'POST', headers: {'X-CSRF-Token': 'fixture-stale'}, body: 'old' })).status);
  expect(stale).toBe(403);
  expect(await count()).toBe(before);
  const current = await page.evaluate(async () => (await fetch('/app/write', { method: 'PUT', headers: {'X-CSRF-Token': 'fixture-current'}, body: 'current' })).status);
  expect(current).toBe(200);
  expect(await count()).toBe(before + 1);
});
