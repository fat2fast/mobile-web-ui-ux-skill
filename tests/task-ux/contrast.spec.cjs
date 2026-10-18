const { test, expect } = require('@playwright/test');
const { contrast, composite, textThreshold, measure, keyboardFocus, pngPixel } = require('./contrast-helpers.cjs');
const { evidence } = require('./evidence-helpers.cjs');

test('contrast helper reference and boundary assertions', async ({ page }, info) => {
  expect(contrast([0, 0, 0], [1, 1, 1])).toBe(21);
  expect(contrast([0.5, 0.5, 0.5], [0.5, 0.5, 0.5])).toBe(1);
  expect(composite([1, 0, 0, 0.5], [0, 0, 1, 1])).toEqual([0.5, 0, 0.5, 1]);
  expect(composite([1, 0, 0, 0], [0, 1, 0, 0])).toEqual([0, 0, 0, 0]);
  // Independent grayscale oracle: invert the sRGB transfer for luminance .175.
  const boundary = 1.055 * (0.175 ** (1 / 2.4)) - 0.055;
  expect(contrast([boundary, boundary, boundary], [0, 0, 0])).toBeCloseTo(4.5, 12);
  expect(contrast([boundary - 0.0001, boundary - 0.0001, boundary - 0.0001], [0, 0, 0])).toBeLessThan(4.5);
  expect(textThreshold(24, 400)).toBe(3);
  expect(textThreshold(14 * 96 / 72, 700)).toBe(3);
  expect(textThreshold(18.66, 700)).toBe(4.5);
  expect(textThreshold(16, 700)).toBe(4.5);
  await page.setContent('<body style="background:white"><p style="color:rgb(0 0 0 / .5)">Alpha</p></body>');
  const alpha = await measure(page.locator('p'));
  expect(alpha.disposition, JSON.stringify(alpha)).not.toBe('review required');
  expect(alpha.foreground.slice(0, 3)).toEqual([0.5, 0.5, 0.5]);
  await page.setContent('<body style="background:white"><section style="opacity:.5;background:rgb(255,0,0)"><p style="color:black">Nested</p></section></body>');
  const nested = await measure(page.locator('p'));
  expect(nested.disposition, JSON.stringify(nested)).not.toBe('review required');
  expect(nested.foreground.slice(0, 3)).toEqual([0.5, 0.5, 0.5]);
  expect(nested.background.slice(0, 3)).toEqual([1, 0.5, 0.5]);
  await page.locator('p').evaluate(el => el.style.color = 'oklch(.5 0 0)');
  const neutral = await measure(page.locator('p'));
  expect(neutral.disposition, JSON.stringify(neutral)).not.toBe('review required');
  // oklch neutral L=.5 has linear luminance .125, before ancestor opacity.
  const neutralSrgb = 1.055 * (0.125 ** (1 / 2.4)) - 0.055;
  expect(neutral.foreground[0]).toBeCloseTo((neutralSrgb + 1) / 2, 4);
  // Check the transparent-canvas model against an actual untouched rendered pixel.
  await page.setContent('<body style="margin:0"><p style="margin:100px;color:black">Canvas</p></body>');
  const canvasPair = await measure(page.locator('p'));
  expect(canvasPair.disposition, JSON.stringify(canvasPair)).not.toBe('review required');
  const png = await page.screenshot({ clip: { x: 0, y: 0, width: 1, height: 1 }, animations: 'disabled' });
  expect(pngPixel(png)).toEqual(canvasPair.background.slice(0, 3).map(v => Math.round(v * 255)));
  await page.locator('body').evaluate(el => el.style.backgroundImage = 'linear-gradient(white,black)');
  expect((await measure(page.locator('p'))).disposition).toBe('review required');
  await page.setContent('<body style="background:white"><div style="margin:50px;background:oklch(.577 .245 27.325);width:100px;height:100px"></div><p style="color:oklch(.577 .245 27.325)">Error</p><button style="margin:50px;outline:none;box-shadow:0 0 0 2px #2563eb">Ring</button></body>');
  const mapped = await measure(page.locator('p'));
  expect(mapped.disposition, JSON.stringify(mapped)).not.toBe('review required');
  expect(mapped.conversions.length).toBeGreaterThan(0);
  expect(pngPixel(await page.screenshot({ clip: { x: 75, y: 75, width: 1, height: 1 } }))).toEqual(mapped.foreground.slice(0, 3).map(v => Math.round(v * 255)));
  await keyboardFocus(page, page.locator('button'));
  expect((await measure(page.locator('button'), 'focus')).disposition).toBe('PASS');
  await page.locator('button').evaluate(el => el.style.boxShadow = 'inset 0 0 0 2px blue');
  expect((await measure(page.locator('button'), 'focus')).disposition).toBe('review required');
  expect((await measure(page.locator('p'), 'border')).disposition).toBe('review required');
  await page.setContent('<body style="background:white"><p style="color:black;background:oklch(.577 .245 27.325);opacity:.5">Unsupported mapped group</p></body>');
  const mappedGroup = await measure(page.locator('p'));
  expect(mappedGroup.disposition).toBe('review required');
  expect(mappedGroup.reason).toContain('group opacity');
  await evidence(info, page, 'contrast helper', [{ oracle: 'black/white=21, same=1, alpha, threshold boundary, complex painting rejected' }], { state: 'helper-reference', trigger: 'independent numeric and rendered inputs', criterion: 'relative luminance arithmetic' });
});

const journeys = [
  { id: 'order', url: 'http://127.0.0.1:4178/orders', button: '.mobile-list .row-action', text: '.result-count', selected: 'Follow-up selected (1)' },
  { id: 'comparison', url: 'http://127.0.0.1:4177', button: '.select-plan-btn', text: '.plan-header .text-blue-700' },
  { id: 'form', url: 'http://127.0.0.1:4181', button: 'button[type=submit]', text: '#startDate-hint' },
];

for (const journey of journeys) {
  test(`rendered contrast matrix ${journey.id}`, async ({ page }, info) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(journey.url);
    const rows = [];
    const artifactFiles = [];
    async function row(locator, state, trigger, kind = 'text') {
      const result = await measure(locator, kind);
      rows.push({ locator: locator.toString(), state, trigger, state_oracle: 'passed', criterion: kind === 'text' ? '1.4.3 AA' : '1.4.11 AA', ...result });
      const screenshot = info.outputPath(`state-${rows.length}-${state}.png`);
      await page.screenshot({ path: screenshot, fullPage: true });
      artifactFiles.push(screenshot);
    }
    await row(page.locator('h1'), 'normal', 'load, heading visible');
    await row(page.locator(journey.text).first(), 'normal', 'load, content visible');
    const button = page.locator(journey.button).first();
    await row(button, 'normal', 'load, button visible');
    await button.hover();
    expect(await button.evaluate(el => el.matches(':hover'))).toBe(true);
    // Wait for source CSS transitions, not for an assumed final token value.
    await button.evaluate(async el => { await Promise.all(el.getAnimations().filter(a => a.effect?.getTiming().iterations !== Infinity).map(a => a.finished.catch(() => {}))); });
    await row(button, 'hover', 'pointer hover, :hover asserted');
    await page.mouse.down();
    try {
      expect(await button.evaluate(el => el.matches(':active'))).toBe(true);
      await row(button, 'active', 'pointer down, :active asserted');
    } finally {
      // Release away from the button so a measurement does not submit/act.
      await page.mouse.move(1, 1);
      await page.mouse.up();
    }
    await keyboardFocus(page, button);
    await row(button, 'keyboard-focus', 'Tab traversal, focused and :focus-visible asserted', 'focus');
    if (journey.id === 'order') {
      const bulk = page.getByRole('button', { name: 'Follow-up selected (0)' });
      await expect(bulk).toBeDisabled();
      rows.push({ state: 'disabled', trigger: 'empty selection', state_oracle: 'passed', disposition: 'exception', criterion: '1.4.3 / 1.4.11', reason: 'Inactive HTML button, verified disabled; does not waive other criteria' });
      const check = page.locator('.mobile-list input[type=checkbox]').first();
      await check.check();
      await expect(check).toBeChecked();
      const appearance = await check.evaluate(el => {
        const s = getComputedStyle(el);
        return { appearance: s.appearance, accentColor: s.accentColor, backgroundImage: s.backgroundImage, boxShadow: s.boxShadow, borderWidth: s.borderWidth, filter: s.filter };
      });
      expect(appearance).toEqual({ appearance: 'auto', accentColor: 'auto', backgroundImage: 'none', boxShadow: 'none', borderWidth: '0px', filter: 'none' });
      rows.push({ state: 'selected-native-indicator', trigger: 'check first order and assert checked', state_oracle: 'passed', criterion: '1.4.11 AA', disposition: 'exception', appearance, source: 'order-dashboard native input and style.css: author rules set font and target dimensions; no indicator appearance/accent override', reason: 'Indicator appearance determined by user agent without author modification; computed native appearance inspected, not inferred from input type alone' });
      const selected = page.getByRole('button', { name: journey.selected });
      await expect(selected).toBeEnabled();
      await row(selected, 'selection-dependent-action-text', 'check first order, checked and bulk enabled asserted');
      await row(page.locator('.mobile-list .card-heading span').first(), 'status', 'source order status visible');
    } else if (journey.id === 'comparison') {
      await button.click();
      await expect(page.getByRole('status')).toHaveText('Selected plan: Starter Plan');
      await row(page.getByRole('status'), 'selected-success', 'select Starter, visible status asserted');
    } else {
      await row(page.locator('#startDate'), 'normal-essential-border', 'labeled input visible', 'border');
      await button.click();
      await expect(page.locator('#startDate')).toHaveAttribute('aria-invalid', 'true');
      await expect(page.locator('#startDate-error')).toBeVisible();
      await row(page.locator('#startDate-error'), 'error', 'submit empty, aria-invalid and visible error asserted');
      await row(page.locator('#startDate'), 'error-border', 'submit empty, field invalid asserted', 'border');
      await page.locator('#startDate').fill('2026-11-01');
      await page.locator('#endDate').fill('2026-11-03');
      await page.locator('#reason').fill('Valid project need');
      await button.click();
      await expect(page.locator('.receipt-banner')).toContainText('Submitted:');
      await row(page.locator('.receipt-banner'), 'success', 'valid submit, receipt visible asserted');
    }
    rows.push({ state: 'unsupported', disposition: 'not applicable', reason: 'No theme switch or warning transition in this journey source; no synthetic production state added', state_oracle: 'passed' });
    await evidence(info, page, `contrast ${journey.id}`, rows, { artifactFiles, disposition: rows.some(r => r.disposition === 'FAIL' || r.disposition === 'review required') ? 'FAIL' : 'PASS' });
    expect(rows.filter(r => ['FAIL', 'review required'].includes(r.disposition))).toEqual([]);
  });
}
