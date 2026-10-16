// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

async function capture(page, name) {
  if (!process.env.TASK_UX_SCREENSHOTS) return;
  fs.mkdirSync(process.env.TASK_UX_SCREENSHOTS, { recursive: true });
  await page.screenshot({ path: path.join(process.env.TASK_UX_SCREENSHOTS, name), fullPage: true });
}

const BASELINE_URL = 'http://127.0.0.1:4173/orders';
const IMPL_URL = 'http://127.0.0.1:4178/orders';

async function loadOrderSourceVariant(page, original, replacement) {
  await page.route('**/src/main.jsx*', async (route) => {
    const response = await route.fetch();
    const source = await response.text();
    expect(source).toContain(original);
    await route.fulfill({ response, body: source.replace(original, replacement) });
  });
  await page.goto(IMPL_URL);
}

test.describe('Dense Order Dashboard - Baseline Observations', () => {
  test('baseline table causes horizontal overflow and measures scroll distance to action', async ({ page }) => {
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(BASELINE_URL);

      const metrics = await page.evaluate(() => {
        const table = document.querySelector('table');
        const actionBtn = document.querySelector('tbody tr:first-child td:last-child button');
        const actionRect = actionBtn ? actionBtn.getBoundingClientRect() : null;
        return {
          windowWidth: window.innerWidth,
          tableScrollWidth: table ? table.scrollWidth : 0,
          documentScrollWidth: document.documentElement.scrollWidth,
          requiresScroll: document.documentElement.scrollWidth > window.innerWidth || (table && table.scrollWidth > window.innerWidth),
          actionRight: actionRect ? actionRect.right : 0,
          requiredHorizontalScrollToReachAction: actionRect ? Math.max(0, actionRect.right - window.innerWidth) : 0,
        };
      });

      expect(metrics.requiresScroll).toBe(true);
      // Baseline requires substantial sideways scroll (> 500px) to reach row follow-up button
      expect(metrics.requiredHorizontalScrollToReachAction).toBeGreaterThan(400);
    }
  });

  test('baseline preserves search, detail, filter, sort, export, selection invariants', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 844 });
    await page.goto(BASELINE_URL);

    // Search
    await page.getByLabel('Search orders').fill('ORD-1001');
    await expect(page.locator('tbody tr')).toHaveCount(1);
    await expect(page.getByRole('button', { name: 'ORD-1001' })).toBeVisible();

    // Detail route & Back
    await page.getByRole('button', { name: 'ORD-1001' }).click();
    await expect(page).toHaveURL('http://127.0.0.1:4173/orders/ORD-1001');
    await expect(page.getByText('Pending')).toBeVisible();
    await page.getByRole('button', { name: 'Record follow-up' }).click();
    await expect(page.getByRole('status')).toHaveText('Follow-up recorded for ORD-1001');
    await page.getByRole('button', { name: 'Back to orders' }).click();
    await expect(page).toHaveURL('http://127.0.0.1:4173/orders');

    // Clear search before status filter
    await page.getByLabel('Search orders').fill('');

    // Filter & Export CSV
    await page.getByLabel('Status').selectOption('Shipped');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export visible' }).click(),
    ]);
    const csvContent = fs.readFileSync(await download.path(), 'utf8');
    expect(csvContent.trim()).toContain('ORD-1002,Minh Tran,Shipped,$89.50');

    // Reset filters
    await page.getByRole('button', { name: 'Reset filters' }).click();
    await expect(page.locator('tbody tr')).toHaveCount(4);

    // Multi-select and bulk action
    await page.getByLabel('Select ORD-1001').check();
    await page.getByLabel('Select ORD-1002').check();
    await page.getByLabel('Select ORD-1004').check();
    await page.getByLabel('Status').selectOption('Pending');
    await expect(page.getByRole('button', { name: 'Follow-up selected (3)' })).toBeVisible();
    await page.getByRole('button', { name: 'Follow-up selected (3)' }).click();
    await expect(page.getByRole('status')).toHaveText('Follow-up recorded for ORD-1001, ORD-1002, ORD-1004');
  });
});

test.describe('Dense Order Dashboard - Task-First Mobile Implementation', () => {
  for (const width of [320, 390]) {
    test(`primary task at ${width}px requires 0px horizontal scrolling to reach action`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(IMPL_URL);

      // Verify mobile list is visible and cards fit without horizontal scroll
      const listRegion = page.getByRole('region', { name: 'Orders list' });
      await expect(listRegion).toBeVisible();

      const cardMetrics = await page.evaluate(() => {
        const card = document.querySelector('.order-card');
        const main = document.querySelector('main');
        const actionBtn = document.querySelector('.order-card:first-child button:last-child');
        const actionRect = actionBtn ? actionBtn.getBoundingClientRect() : null;
        return {
          windowWidth: window.innerWidth,
          docScrollWidth: document.documentElement.scrollWidth,
          cardClientWidth: card ? card.clientWidth : 0,
          cardScrollWidth: card ? card.scrollWidth : 0,
          mainScrollWidth: main ? main.scrollWidth : 0,
          mainClientWidth: main ? main.clientWidth : 0,
          actionRight: actionRect ? actionRect.right : 0,
          requiredHorizontalScrollToReachAction: actionRect ? Math.max(0, actionRect.right - window.innerWidth) : 0,
        };
      });

      // No horizontal overflow on card container
      expect(cardMetrics.cardScrollWidth).toBeLessThanOrEqual(cardMetrics.cardClientWidth + 1);
      expect(cardMetrics.mainScrollWidth).toBeLessThanOrEqual(cardMetrics.mainClientWidth + 2);

      // Exact 0px horizontal scroll required to reach the primary action
      expect(cardMetrics.requiredHorizontalScrollToReachAction).toBe(0);

      // Priority data and action are immediately visible on the first card
      const firstCard = page.locator('.order-card').first();
      await expect(firstCard.getByRole('button', { name: 'Open details for ORD-1001' })).toBeVisible();
      await expect(firstCard.getByText('Pending')).toBeVisible();
      await expect(firstCard.getByText('$125.00')).toBeVisible();
      await expect(firstCard.getByRole('button', { name: 'Follow-up' })).toBeVisible();
      await capture(page, `orders-${width}.png`);
    });
  }

  test('mobile search, detail, filter, sort, export, selection invariants succeed', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(IMPL_URL);

    // Search order
    await page.getByLabel('Search orders').fill('ORD-1001');
    const cards = page.locator('.order-card');
    await expect(cards).toHaveCount(1);
    await expect(cards.first().getByRole('button', { name: 'Open details for ORD-1001' })).toBeVisible();

    // Direct row follow-up action
    await cards.first().getByRole('button', { name: 'Follow-up' }).click();
    await expect(page.getByRole('status').filter({ hasText: /^Follow-up recorded for / })).toHaveText('Follow-up recorded for ORD-1001');

    // Detail route and Back
    await cards.first().getByRole('button', { name: 'Open details for ORD-1001' }).click();
    await expect(page).toHaveURL('http://127.0.0.1:4178/orders/ORD-1001');
    await expect(page.getByText('Pending')).toBeVisible();
    await expect(page.getByText('Hanoi')).toBeVisible();

    // Detail follow-up
    await page.getByRole('button', { name: 'Record follow-up' }).click();
    await expect(page.getByRole('status').filter({ hasText: /^Follow-up recorded for / })).toHaveText('Follow-up recorded for ORD-1001');

    // Back to orders
    await page.getByRole('button', { name: 'Back to orders' }).click();
    await expect(page).toHaveURL('http://127.0.0.1:4178/orders');

    // Clear search before status filter
    await page.getByLabel('Search orders').fill('');

    // Status filter
    await page.getByLabel('Status').selectOption('Shipped');
    await expect(page.locator('.order-card')).toHaveCount(1);
    await expect(page.locator('.order-card').first().getByRole('button', { name: 'Open details for ORD-1002' })).toBeVisible();

    // Export CSV
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export visible' }).click(),
    ]);
    const csvContent = fs.readFileSync(await download.path(), 'utf8');
    expect(csvContent.trim()).toContain('ORD-1002,Minh Tran,Shipped,$89.50');

    // Reset filters
    await page.getByRole('button', { name: 'Reset filters' }).click();
    await expect(page.locator('.order-card')).toHaveCount(4);

    // Sort by Customer
    await page.getByLabel('Sort').selectOption('customer');
    const firstCustomer = page.locator('.order-card').first();
    await expect(firstCustomer.getByRole('button', { name: 'Open details for ORD-1004' })).toBeVisible();

    // Delivered order follow-up preserved
    await firstCustomer.getByRole('button', { name: 'Follow-up' }).click();
    await expect(page.getByRole('status').filter({ hasText: /^Follow-up recorded for / })).toHaveText('Follow-up recorded for ORD-1004');

    // Multi-selection across filters and bulk follow-up on mobile cards
    await page.locator('.order-card').getByLabel('Select ORD-1001').check();
    await page.locator('.order-card').getByLabel('Select ORD-1002').check();
    await page.locator('.order-card').getByLabel('Select ORD-1004').check();
    await page.getByLabel('Status').selectOption('Pending');
    await expect(page.getByRole('button', { name: 'Follow-up selected (3)' })).toBeVisible();
    await page.getByRole('button', { name: 'Follow-up selected (3)' }).click();
    await expect(page.getByRole('status').filter({ hasText: /^Follow-up recorded for / })).toHaveText('Follow-up recorded for ORD-1001, ORD-1002, ORD-1004');
  });

  test('desktop table layout is preserved at 1280px', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 844 });
    await page.goto(IMPL_URL);

    // Desktop table container is visible, mobile cards are hidden
    await expect(page.locator('.desktop-table')).toBeVisible();
    await expect(page.getByRole('region', { name: 'Orders list' })).toBeHidden();

    // Verify all 10 table headers are present
    const headers = ['Select', 'ID', 'Customer', 'Status', 'Total', 'Date', 'Items', 'Channel', 'City', 'Action'];
    for (const h of headers) {
      await expect(page.locator('.desktop-table th').filter({ hasText: h })).toBeVisible();
    }
    await expect(page.locator('.desktop-table tbody tr')).toHaveCount(4);
    await capture(page, 'orders-1280.png');
  });
});
  test('mobile navigation is reachable and dismisses with Escape, backdrop, and route choice', async ({ page }) => {
    for (const width of [320, 375, 390, 430, 600, 601, 767, 768, 1023]) {
      await page.setViewportSize({ width, height: 640 });
      await page.goto(IMPL_URL);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      const trigger = page.getByRole('button', { name: 'Open navigation' });
      await trigger.click();
      const menu = page.getByRole('dialog', { name: 'Navigation' });
      await expect(menu).toBeVisible();
      await menu.getByRole('button', { name: 'Close navigation' }).click();
      await expect(menu).toBeHidden();
      await expect(trigger).toBeFocused();
      await trigger.click();
      await page.keyboard.press('Escape');
      await expect(menu).toBeHidden();
      await expect(trigger).toBeFocused();
      await trigger.click();
      await page.mouse.click(4, 100);
      await expect(menu).toBeHidden();
      await trigger.click();
      await menu.getByRole('link', { name: 'Reports' }).click();
      await expect(page).toHaveURL(/\/reports$/);
      await expect(menu).toBeHidden();
      await trigger.click();
      await menu.getByRole('link', { name: 'Settings' }).click();
      await expect(page).toHaveURL(/\/settings$/);
      await trigger.click();
      await menu.getByRole('link', { name: 'Orders' }).focus();
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/\/orders$/);
    }
  });

  test('selection, details, empty recovery and hidden selected orders remain independent', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto(IMPL_URL);
    const checkbox = page.getByRole('checkbox', { name: 'Select ORD-1001' });
    await checkbox.check();
    await expect(page.getByRole('button', { name: 'Follow-up selected (1)' })).toBeEnabled();
    await page.getByRole('button', { name: 'Open details for ORD-1001' }).click();
    await expect(page).toHaveURL(/\/orders\/ORD-1001$/);
    await page.getByRole('button', { name: 'Back to orders' }).click();
    await expect(checkbox).toBeChecked();
    await page.getByRole('region', { name: 'Orders list' }).getByRole('checkbox', { name: 'Select ORD-1004' }).check();
    await page.getByLabel('Status').selectOption('Pending');
    await expect(page.getByRole('button', { name: 'Follow-up selected (2)' })).toBeVisible();
    await page.getByLabel('Search orders').fill('no-such-order');
    await expect(page.getByText('No orders match your search and status filter.')).toBeVisible();
    const [emptyDownload] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: 'Export visible' }).click(),
    ]);
    expect(fs.readFileSync(await emptyDownload.path(), 'utf8').trim()).toBe('id,customer,status,total');
    await page.getByRole('button', { name: 'Clear filters' }).click();
    await expect(page.getByRole('region', { name: 'Orders list' }).locator('article')).toHaveCount(4);
    await expect(page.getByRole('region', { name: 'Orders list' }).getByRole('checkbox', { name: 'Select ORD-1004' })).toBeChecked();
    await page.getByRole('button', { name: 'Follow-up selected (2)' }).click();
    await expect(page.getByRole('status').filter({ hasText: /^Follow-up recorded for / })).toHaveText('Follow-up recorded for ORD-1001, ORD-1004');
  });

  test('bulk selection remains reachable with a 20-record test data variant', async ({ page }) => {
    const extraOrders = Array.from({ length: 20 }, (_, index) => ({
      id: `ORD-${2001 + index}`,
      customer: `Customer ${index + 1}`,
      status: index % 2 ? 'Shipped' : 'Pending',
      total: '$10.00',
      date: '2026-10-14',
      items: 1,
      channel: 'Web',
      city: 'Hanoi',
    }));
    await page.route('**/src/main.jsx*', async (route) => {
      const response = await route.fetch();
      const source = await response.text();
      const marker = 'const orders = [';
      expect(source).toContain(marker);
      await route.fulfill({ response, body: source.replace(marker, `${marker}\n  ${extraOrders.map((order) => JSON.stringify(order)).join(',\n  ')},`) });
    });
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto(IMPL_URL);
    await expect(page.getByRole('region', { name: 'Orders list' }).getByRole('article')).toHaveCount(24);

    await page.getByRole('checkbox', { name: 'Select ORD-1001' }).check();
    const bulkAction = page.getByRole('button', { name: 'Follow-up selected (1)' });
    const bar = await bulkAction.boundingBox();
    expect(bar.y + bar.height).toBeLessThanOrEqual(640);
    await page.getByRole('region', { name: 'Orders list' }).getByRole('article').last().getByRole('button', { name: 'Follow-up' }).click();
    await expect(page.getByRole('status').filter({ hasText: /^Follow-up recorded for / })).toHaveText('Follow-up recorded for ORD-2020');
    await page.getByRole('checkbox', { name: 'Select ORD-2020' }).check();
    await page.getByLabel('Status').selectOption('Pending');
    await expect(page.getByRole('button', { name: 'Follow-up selected (2)' })).toBeVisible();
    await page.getByRole('button', { name: 'Follow-up selected (2)' }).click();
    await expect(page.getByRole('status').filter({ hasText: /^Follow-up recorded for / })).toHaveText('Follow-up recorded for ORD-1001, ORD-2020');
  });

  test('task journey accepts a semantic section instead of an article wrapper', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await loadOrderSourceVariant(page,
      'React.createElement("article", { key: order.id, className: "order-card',
      'React.createElement("section", { key: order.id, className: "order-card');
    await expect(page.locator('section.order-card')).toHaveCount(4);
    await page.getByRole('checkbox', { name: 'Select ORD-1001' }).check();
    await expect(page.getByRole('button', { name: 'Follow-up selected (1)' })).toBeEnabled();
    await page.getByRole('button', { name: 'Follow-up' }).first().click();
    await expect(page.getByRole('status').filter({ hasText: /^Follow-up recorded for / })).toHaveText('Follow-up recorded for ORD-1001');
    await page.getByRole('button', { name: 'Open details for ORD-1001' }).click();
    await expect(page).toHaveURL(/\/orders\/ORD-1001$/);
  });

  test('task assertions expose a seeded lost action', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await loadOrderSourceVariant(page, 'onClick: () => act(order)', 'onClick: () => {}');
    await page.getByRole('button', { name: 'Follow-up' }).first().click();
    await expect(page.getByRole('status').filter({ hasText: /^Follow-up recorded for / })).toHaveCount(0);
  });

  test('task assertions expose a seeded inaccessible drawer', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await loadOrderSourceVariant(page, '"aria-label": "Navigation"', '"aria-label": ""');
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await expect(page.locator('dialog[open]')).toBeVisible();
    await expect(page.getByRole('dialog', { name: 'Navigation' })).toHaveCount(0);
  });

  test('task assertions expose a seeded checkbox detail misfire', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await loadOrderSourceVariant(page, 'onChange: () => toggleSelect(order.id)', 'onChange: () => go("/orders/" + order.id)');
    await page.getByRole('checkbox', { name: 'Select ORD-1001' }).click();
    await expect(page).toHaveURL(/\/orders\/ORD-1001$/);
  });

  test('mobile record controls have 44px hit regions and a visible focus indicator', async ({ page }) => {
    for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 640 });
    await page.goto(IMPL_URL);
    const controls = [
      page.getByRole('button', { name: 'Open navigation' }),
      page.getByRole('region', { name: 'Orders list' }).getByRole('checkbox', { name: 'Select ORD-1001' }),
      page.getByRole('button', { name: 'Open details for ORD-1001' }),
      page.locator('.order-card').first().getByRole('button', { name: 'Follow-up' }),
    ];
    await page.getByRole('button', { name: 'Open navigation' }).click();
    const closeBox = await page.getByRole('button', { name: 'Close navigation' }).boundingBox();
    expect(closeBox.width).toBeGreaterThanOrEqual(44);
    expect(closeBox.height).toBeGreaterThanOrEqual(44);
    await page.keyboard.press('Escape');
    for (const control of controls) {
      const box = await control.boundingBox();
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
      await control.focus();
      expect(await control.evaluate((el) => getComputedStyle(el).outlineStyle)).not.toBe('none');
    }
    await page.getByRole('region', { name: 'Orders list' }).getByRole('checkbox', { name: 'Select ORD-1001' }).check();
    for (const name of ['Clear selection', 'Follow-up selected (1)']) {
      const box = await page.getByRole('button', { name }).boundingBox();
      expect(box.height).toBeGreaterThanOrEqual(44);
      expect(box.x + box.width).toBeLessThanOrEqual(width);
    }
    }
  });

  test('resizing from mobile to desktop closes navigation', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 640 });
    await page.goto(IMPL_URL);
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await page.setViewportSize({ width: 1280, height: 844 });
    await expect(page.getByRole('dialog', { name: 'Navigation' })).toBeHidden();
    await page.locator('.desktop-nav').getByRole('link', { name: 'Reports' }).click();
    await expect(page).toHaveURL(/\/reports$/);
  });

  test('long customer labels stay within the record and the 1024px desktop boundary is usable', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto(IMPL_URL);
    await page.locator('.order-card').first().locator('span').filter({ hasText: 'Lan Nguyen' }).evaluate((el) => {
      el.textContent = 'Lan Nguyen with a very long customer name for narrow phone layouts';
    });
    const firstCard = page.locator('.order-card').first();
    expect(await firstCard.evaluate((el) => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    await expect(firstCard.getByRole('button', { name: 'Follow-up' })).toBeVisible();
    await page.setViewportSize({ width: 1024, height: 844 });
    await expect(page.locator('.desktop-nav')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Open navigation' })).toBeHidden();
    await expect(page.locator('.desktop-table')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1024);
  });

  test('direct detail link, missing order, and desktop navigation remain available', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 844 });
    await page.goto('http://127.0.0.1:4178/orders/ORD-1001');
    await expect(page.getByText('Hanoi')).toBeVisible();
    await page.getByRole('button', { name: 'Back to orders' }).click();
    await expect(page).toHaveURL(IMPL_URL);
    await page.goto('http://127.0.0.1:4178/orders/UNKNOWN');
    await expect(page.getByText('Order not found.')).toBeVisible();
    await page.locator('.desktop-nav').getByRole('link', { name: 'Reports' }).click();
    await expect(page).toHaveURL(/\/reports$/);
    await expect(page.locator('.desktop-table')).toBeHidden();
  });
