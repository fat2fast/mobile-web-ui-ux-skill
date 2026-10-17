const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const { measure, keyboardFocus } = require('./contrast-helpers.cjs');
const { evidence } = require('./evidence-helpers.cjs');

async function scan(page, state, rows) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
  rows.push({ state, state_oracle: 'passed', violations: results.violations, incomplete: results.incomplete.map(v => ({ id: v.id, targets: v.nodes.map(n => n.target) })), disposition: results.violations.length ? 'FAIL' : results.incomplete.length ? 'review required' : 'PASS' });
}

const journeys = [
  { id: 'order', url: 'http://127.0.0.1:4178/orders', button: '.mobile-list .row-action' },
  { id: 'comparison', url: 'http://127.0.0.1:4177', button: '.select-plan-btn' },
  { id: 'form', url: 'http://127.0.0.1:4181', button: 'button[type=submit]' },
];

for (const journey of journeys) {
  test(`scoped accessibility states ${journey.id}`, async ({ page }, info) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(journey.url);
    if (journey.id === 'comparison') await expect(page.getByRole('region', { name: 'Cloud plans comparison matrix' })).toHaveClass(/comparison-scroll-container/);
    const rows = [];
    await scan(page, 'initial', rows);
    const button = page.locator(journey.button).first();
    await expect(button).toHaveAccessibleName(/\S/);
    await keyboardFocus(page, button);
    await scan(page, 'keyboard-focus', rows);
    if (journey.id === 'order') {
      const checkbox = page.locator('.mobile-list input[type=checkbox]').first();
      await checkbox.check();
      await expect(checkbox).toBeChecked();
      await expect(page.getByRole('button', { name: 'Follow-up selected (1)' })).toBeEnabled();
      await scan(page, 'selected', rows);
      await button.click();
      await expect(page.getByRole('status').filter({ hasText: 'Follow-up recorded' })).toBeVisible();
      await scan(page, 'success', rows);
    } else if (journey.id === 'comparison') {
      await button.click();
      await expect(page.getByRole('status')).toHaveText('Selected plan: Starter Plan');
      await scan(page, 'selected-success', rows);
    } else {
      await button.click();
      await expect(page.locator('#startDate')).toHaveAttribute('aria-invalid', 'true');
      await expect(page.locator('#startDate')).toHaveAttribute('aria-describedby', 'startDate-error');
      await expect(page.locator('#startDate-error')).toHaveText(/\S/);
      await scan(page, 'error', rows);
    }
    await evidence(info, page, `a11y ${journey.id}`, rows, { trigger: 'load, keyboard Tab, actual selection or submit transition', criterion: 'scoped axe WCAG A/AA tags plus explicit names/status/error associations', disposition: rows.some(r => r.disposition !== 'PASS') ? 'FAIL' : 'PASS' });
    expect(rows.flatMap(r => r.violations)).toEqual([]);
    expect(rows.flatMap(r => r.incomplete), 'Applicable incomplete results require disposition').toEqual([]);
  });
}

test('order selection action row leaves record controls unobscured', async ({ page }, info) => {
  const rows = [];
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 480 });
    await page.goto('http://127.0.0.1:4178/orders');
    await page.locator('.mobile-list input[type=checkbox]').first().check();
    await expect(page.getByRole('button', { name: 'Follow-up selected (1)' })).toBeEnabled();
    for (const control of [page.locator('.mobile-list input[type=checkbox]').last(), page.getByRole('button', { name: 'Open details for ORD-1004' })]) {
      await keyboardFocus(page, control);
      const geometry = await control.evaluate(el => {
        const r = el.getBoundingClientRect(), bar = document.querySelector('.bulk-actions').getBoundingClientRect();
        const scroller = document.querySelector('.order-results-pane').getBoundingClientRect();
        return { top: r.top, bottom: r.bottom, barTop: bar.top, scrollerTop: scroller.top, hit: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]].every(([x, y]) => el.contains(document.elementFromPoint(r.left + r.width * x, r.top + r.height * y))) };
      });
      expect(geometry.top).toBeGreaterThanOrEqual(geometry.scrollerTop);
      expect(geometry.bottom).toBeLessThanOrEqual(geometry.barTop);
      expect(geometry.hit).toBe(true);
      rows.push({ width, ...geometry, state: 'selected-keyboard-focus', state_oracle: 'passed' });
    }
    await page.getByRole('button', { name: 'Open details for ORD-1004' }).click();
    await expect(page).toHaveURL(/orders\/ORD-1004$/);
    await page.getByRole('button', { name: 'Back to orders' }).click();
    await expect(page.getByRole('button', { name: 'Follow-up selected (1)' })).toBeEnabled();
    await page.getByRole('button', { name: 'Follow-up selected (1)' }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Follow-up recorded' })).toHaveText('Follow-up recorded for ORD-1001');
    await page.locator('.mobile-list input[type=checkbox]').last().check();
    await page.getByRole('button', { name: 'Clear selection' }).click();
    await expect(page.getByRole('button', { name: 'Follow-up selected (0)' })).toBeDisabled();
  }
  await evidence(info, page, 'order unobscured controls', rows, { state: 'selected-short-viewport', trigger: 'select, keyboard traversal, detail/Back, bulk and Clear', criterion: 'target visibility and keyboard interaction' });
});

test('negative probe detects insufficient rendered text contrast', async ({ page }, info) => {
  await page.goto('http://127.0.0.1:4181');
  const heading = page.locator('h1');
  expect((await measure(heading)).disposition).toBe('PASS');
  const previous = await heading.getAttribute('style');
  try {
    await heading.evaluate(el => { el.style.color = '#eeeeee'; el.style.backgroundColor = '#ffffff'; });
    const injected = await measure(heading);
    expect(injected.disposition).toBe('FAIL');
    await evidence(info, page, 'contrast probe', [{ ...injected, expected_failure_detected: true }], { state: 'injected-low-contrast', trigger: 'test-only style injection; helper asserts FAIL' });
  } finally {
    await heading.evaluate((el, old) => old === null ? el.removeAttribute('style') : el.setAttribute('style', old), previous);
  }
  expect((await measure(heading)).disposition).toBe('PASS');
});

test('negative probe detects color-only status', async ({ page }, info) => {
  await page.goto('http://127.0.0.1:4177');
  await page.getByRole('button', { name: 'Select Starter', exact: true }).click();
  const status = page.getByRole('status');
  await expect(status).toHaveText('Selected plan: Starter Plan');
  const previous = await status.innerHTML();
  const hasMeaning = async () => status.evaluate(el => Boolean(el.textContent.trim()) || Boolean(el.querySelector('svg[aria-label],img[alt]:not([alt=""])')));
  expect(await hasMeaning()).toBe(true);
  try {
    await status.evaluate(el => { el.textContent = ''; el.style.minHeight = '24px'; });
    expect(await hasMeaning()).toBe(false);
    await evidence(info, page, 'color probe', [{ expected_failure_detected: true, rule: 'status requires visible non-color meaning', actual: 'empty status text, no named icon' }], { state: 'injected-color-only', trigger: 'remove status content at runtime; semantic assertion detects absence' });
  } finally {
    await status.evaluate((el, html) => { el.innerHTML = html; el.style.removeProperty('min-height'); }, previous);
  }
  expect(await hasMeaning()).toBe(true);
});

test('negative probe detects removed keyboard focus indicator', async ({ page }, info) => {
  await page.goto('http://127.0.0.1:4181');
  const button = page.getByRole('button', { name: 'Submit request' });
  await keyboardFocus(page, button);
  expect((await measure(button, 'focus')).disposition).toBe('PASS');
  const previous = await button.getAttribute('style');
  try {
    await button.evaluate(el => { el.style.setProperty('outline', 'none', 'important'); el.style.setProperty('box-shadow', 'none', 'important'); });
    const missing = await measure(button, 'focus');
    expect(missing.disposition).toBe('review required');
    expect(missing.reason).toMatch(/focus|ring/i);
    await evidence(info, page, 'focus probe', [{ ...missing, expected_failure_detected: true }], { state: 'injected-no-focus', trigger: 'Tab focus, test-only removal of outline and shadow' });
  } finally {
    await button.evaluate((el, old) => old === null ? el.removeAttribute('style') : el.setAttribute('style', old), previous);
  }
  expect((await measure(button, 'focus')).disposition).toBe('PASS');
});

test('inactive exception does not exempt essential enabled borders', async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:4178/orders');
  await expect(page.getByRole('button', { name: 'Follow-up selected (0)' })).toBeDisabled();
  await page.goto('http://127.0.0.1:4181');
  const input = page.locator('#startDate');
  await expect(input).toBeEnabled();
  expect((await measure(input, 'border')).disposition).toBe('PASS');
  const previous = await input.getAttribute('style');
  try {
    await input.evaluate(el => el.style.borderColor = '#dddddd');
    const border = await measure(input, 'border');
    expect(border.disposition).toBe('FAIL');
    await evidence(info, page, 'inactive boundary', [{ ...border, expected_failure_detected: true, inactive_exception: 'only the separately asserted disabled button' }], { state: 'enabled-border-probe', trigger: 'assert disabled button separately; inject weak enabled input border' });
  } finally {
    await input.evaluate((el, old) => old === null ? el.removeAttribute('style') : el.setAttribute('style', old), previous);
  }
});
