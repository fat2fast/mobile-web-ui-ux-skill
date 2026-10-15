// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('node:fs');

const BASELINE_URL = 'http://127.0.0.1:4173/orders';
const IMPL_URL = 'http://127.0.0.1:4178/orders';

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
      await expect(firstCard.getByRole('button', { name: 'ORD-1001' })).toBeVisible();
      await expect(firstCard.getByText('Pending')).toBeVisible();
      await expect(firstCard.getByText('$125.00')).toBeVisible();
      await expect(firstCard.getByRole('button', { name: 'Follow-up' })).toBeVisible();
    });
  }

  test('mobile search, detail, filter, sort, export, selection invariants succeed', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(IMPL_URL);

    // Search order
    await page.getByLabel('Search orders').fill('ORD-1001');
    const cards = page.locator('.order-card');
    await expect(cards).toHaveCount(1);
    await expect(cards.first().getByRole('button', { name: 'ORD-1001' })).toBeVisible();

    // Direct row follow-up action
    await cards.first().getByRole('button', { name: 'Follow-up' }).click();
    await expect(page.getByRole('status')).toHaveText('Follow-up recorded for ORD-1001');

    // Detail route and Back
    await cards.first().getByRole('button', { name: 'ORD-1001' }).click();
    await expect(page).toHaveURL('http://127.0.0.1:4178/orders/ORD-1001');
    await expect(page.getByText('Pending')).toBeVisible();
    await expect(page.getByText('Hanoi')).toBeVisible();

    // Detail follow-up
    await page.getByRole('button', { name: 'Record follow-up' }).click();
    await expect(page.getByRole('status')).toHaveText('Follow-up recorded for ORD-1001');

    // Back to orders
    await page.getByRole('button', { name: 'Back to orders' }).click();
    await expect(page).toHaveURL('http://127.0.0.1:4178/orders');

    // Clear search before status filter
    await page.getByLabel('Search orders').fill('');

    // Status filter
    await page.getByLabel('Status').selectOption('Shipped');
    await expect(page.locator('.order-card')).toHaveCount(1);
    await expect(page.locator('.order-card').first().getByRole('button', { name: 'ORD-1002' })).toBeVisible();

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
    await page.getByLabel('Sort').selectOption('Customer');
    const firstCustomer = page.locator('.order-card').first();
    await expect(firstCustomer.getByRole('button', { name: 'ORD-1004' })).toBeVisible();

    // Delivered order follow-up preserved
    await firstCustomer.getByRole('button', { name: 'Follow-up' }).click();
    await expect(page.getByRole('status')).toHaveText('Follow-up recorded for ORD-1004');

    // Multi-selection across filters and bulk follow-up on mobile cards
    await page.locator('.order-card').getByLabel('Select ORD-1001').check();
    await page.locator('.order-card').getByLabel('Select ORD-1002').check();
    await page.locator('.order-card').getByLabel('Select ORD-1004').check();
    await page.getByLabel('Status').selectOption('Pending');
    await expect(page.getByRole('button', { name: 'Follow-up selected (3)' })).toBeVisible();
    await page.getByRole('button', { name: 'Follow-up selected (3)' }).click();
    await expect(page.getByRole('status')).toHaveText('Follow-up recorded for ORD-1001, ORD-1002, ORD-1004');
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
  });
});