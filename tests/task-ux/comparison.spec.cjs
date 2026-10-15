// @ts-check
const { test, expect } = require('@playwright/test');

const BASELINE_URL = 'http://127.0.0.1:4176';
const IMPL_URL = 'http://127.0.0.1:4177';

test.describe('Aligned Comparison Table - Baseline Observations', () => {
  test('baseline table requires horizontal scroll and lacks sticky labels', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASELINE_URL);

    const metrics = await page.evaluate(() => {
      const container = document.querySelector('.comparison-container');
      const rowHeader = document.querySelector('.attribute-label');
      return {
        hasHorizontalScroll: container ? container.scrollWidth > container.clientWidth : false,
        isSticky: rowHeader ? getComputedStyle(rowHeader).position === 'sticky' : false,
      };
    });

    expect(metrics.hasHorizontalScroll).toBe(true);
    // Baseline does not pin row labels
    expect(metrics.isSticky).toBe(false);
  });

  test('baseline handles plan selection action', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 844 });
    await page.goto(BASELINE_URL);

    await page.getByRole('button', { name: 'Select Standard' }).click();
    await expect(page.getByRole('status')).toHaveText('Selected plan: Standard Plan');
  });
});

test.describe('Aligned Comparison Table - Task-First Implementation', () => {
  for (const width of [320, 390]) {
    test(`comparison table at ${width}px preserves alignment, sticky labels and scroll cues`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(IMPL_URL);

      // Verify visual scroll cue is displayed on mobile
      const scrollCue = page.locator('.scroll-cue');
      await expect(scrollCue).toBeVisible();
      await expect(scrollCue).toContainText('Swipe horizontally to compare');

      // Verify table semantic structure
      await expect(page.locator('table')).toBeVisible();
      await expect(page.locator('th[scope="col"]')).toHaveCount(5); // Attributes + 4 plans

      // Check sticky attribute headers
      const stickyCheck = await page.evaluate(() => {
        const stickyTh = document.querySelector('.sticky-col');
        const style = stickyTh ? getComputedStyle(stickyTh) : null;
        return {
          position: style ? style.position : '',
          left: style ? style.left : '',
        };
      });
      expect(stickyCheck.position).toBe('sticky');
      expect(stickyCheck.left).toBe('0px');

      // Scroll horizontally and verify pinned attribute header remains at left edge
      const pinnedAfterScroll = await page.evaluate(() => {
        const scroller = document.querySelector('.comparison-scroll-container');
        if (!scroller) return false;
        scroller.scrollLeft = 200;
        const containerRect = scroller.getBoundingClientRect();
        const headerRect = scroller.querySelector('tbody .sticky-col')?.getBoundingClientRect();
        if (!headerRect) return false;
        return Math.abs(headerRect.left - containerRect.left) <= 2;
      });
      expect(pinnedAfterScroll).toBe(true);
    });
  }

  test('all metrics, units, and plan selection actions are preserved', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(IMPL_URL);

    // Verify all 4 plan names and units
    const expectedMetrics = ['$19 / mo', '$49 / mo', '$99 / mo', '$249 / mo', '2 cores', '80 GB NVMe', '99.99%'];
    for (const metric of expectedMetrics) {
      await expect(page.locator('.comparison-table').getByText(metric).first()).toBeVisible();
    }

    // Trigger plan selection
    await page.getByRole('button', { name: 'Select Starter' }).click();
    await expect(page.getByRole('status')).toHaveText('Selected plan: Starter Plan');

    await page.getByRole('button', { name: 'Select Pro' }).click();
    await expect(page.getByRole('status')).toHaveText('Selected plan: Pro Plan');
  });

  test('keyboard traversal navigates cells and triggers plan selection', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(IMPL_URL);

    // Focus scroll container
    await page.locator('.comparison-scroll-container').focus();

    // Tab through interactive elements until reaching a selection button
    let reachedButton = false;
    for (let i = 0; i < 35; i++) {
      await page.keyboard.press('Tab');
      const activeTag = await page.evaluate(() => document.activeElement?.tagName);
      const activeClass = await page.evaluate(() => document.activeElement?.className);
      if (activeTag === 'BUTTON' && String(activeClass).includes('select-plan-btn')) {
        reachedButton = true;
        break;
      }
    }
    expect(reachedButton).toBe(true);

    // Trigger selection with Enter key
    await page.keyboard.press('Enter');
    await expect(page.getByRole('status')).toContainText('Selected plan:');
  });

  test('desktop layout at 1280px displays full comparison matrix without mobile cues', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 844 });
    await page.goto(IMPL_URL);

    // Mobile scroll cue is hidden on desktop
    await expect(page.locator('.scroll-cue')).toBeHidden();

    // All plans visible simultaneously
    for (const plan of ['Starter Plan', 'Standard Plan', 'Pro Plan', 'Enterprise Plan']) {
      await expect(page.getByText(plan).first()).toBeVisible();
    }
  });
});