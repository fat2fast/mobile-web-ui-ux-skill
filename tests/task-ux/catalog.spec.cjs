const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const AxeBuilder = require('@axe-core/playwright').default;
const { measure, keyboardFocus } = require('./contrast-helpers.cjs');
const { evidence } = require('./evidence-helpers.cjs');
const CANDIDATE = 'http://127.0.0.1:4184';

for (const width of [320, 390, 1280]) {
  test(`catalog workflow at ${width}px preserves exact product information`, async ({ page }, info) => {
    expect(fs.readFileSync(path.join(__dirname, '../../evals/fixtures/catalog/src/catalog-data.js'), 'utf8')).toBe(fs.readFileSync(path.join(__dirname, '../../evals/implementations/task-first/catalog/src/catalog-data.js'), 'utf8'));
    await page.setViewportSize({ width, height: 844 });
    await page.goto(CANDIDATE);
    const ids = () => page.locator('[data-product-id]:visible').evaluateAll(elements => elements.map(el => el.dataset.productId));
    expect(await ids()).toEqual(['FIELD-03', 'FIELD-01', 'FIELD-02', 'HOME-01', 'HOME-02', 'HOME-03']);
    await expect(page.getByRole('status')).toHaveText('6 products shown · 0 selected for comparison');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width === 1280) await expect(page.locator('.desktop-catalog')).toBeVisible();
    await page.getByRole('combobox', { name: 'Category', exact: true }).selectOption('Portable');
    await page.getByLabel('In stock only', { exact: true }).check();
    expect(await ids()).toEqual(['FIELD-03', 'FIELD-01']);
    await page.getByRole('checkbox', { name: 'Compare FIELD-01', exact: true }).check();
    await page.getByLabel('In stock only', { exact: true }).uncheck();
    await page.getByRole('checkbox', { name: 'Compare FIELD-02', exact: true }).check();
    const matrix = page.getByRole('region', { name: 'Product comparison' });
    await expect(matrix).toBeVisible();
    for (const value of ['$799.00 USD', '$1,099.00 USD', '600 Wh', '1000 Wh', '7.5 kg', '12 kg', 'In stock', 'Preorder']) await expect(matrix.getByRole('cell', { name: value, exact: true })).toBeVisible();
    await expect(matrix.getByRole('columnheader').last()).toContainText('distinguishing suffix North');
    await page.getByLabel('Search products', { exact: true }).fill('no-match');
    await expect(page.getByRole('heading', { name: 'No products match' })).toBeVisible();
    await expect(matrix).toBeVisible();
    await page.getByRole('button', { name: 'Show all products' }).click();
    await expect(page.getByRole('status')).toHaveText('6 products shown · 2 selected for comparison');
    await page.getByRole('combobox', { name: 'Sort products', exact: true }).selectOption('name');
    expect((await ids()).slice(0,3)).toEqual(['FIELD-02','FIELD-03','FIELD-01']);
    await page.getByRole('button', { name: 'Reset filters', exact: true }).click();
    expect((await ids())[0]).toBe('FIELD-03');
    await matrix.getByRole('button', { name: 'Remove FIELD-01', exact: true }).click();
    await expect(page.getByRole('checkbox', { name: 'Compare FIELD-01', exact: true })).not.toBeChecked();
    for (const id of ['FIELD-01','FIELD-02','FIELD-03','HOME-01','HOME-02','HOME-03']) await page.getByRole('checkbox', { name: `Compare ${id}`, exact: true }).check();
    await expect(matrix.getByRole('columnheader')).toHaveCount(7);
    await expect(matrix.getByRole('cell', { name: '$1,599.50 USD', exact: true })).toBeVisible();
    await expect(matrix.getByRole('cell', { name: 'Unavailable', exact: true })).toBeVisible();
    await evidence(info, page, `catalog task ${width}`, [{ state: 'filtered-selected-reset-all-six', state_oracle: 'passed', exact_values_preserved: true, selection_cap: null }], { state: 'all-six-selected', trigger: 'browse/filter/select/empty/reset/sort/remove/select-all', criterion: 'catalog task and data/desktop invariants' });
    await page.reload();
    await expect(page.getByRole('status')).toHaveText('6 products shown · 0 selected for comparison');
  });
}

test('catalog baseline preserves data and desktop operations', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 844 });
  await page.goto('http://127.0.0.1:4183');
  await expect(page.getByRole('row')).toHaveCount(7);
  await page.getByLabel('Search products').fill('HOME-01');
  await expect(page.getByRole('row')).toHaveCount(2);
  await expect(page.getByRole('cell', { name: '$1,599.50 USD', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Reset filters' }).click();
  await page.getByRole('checkbox', { name: 'Compare FIELD-01', exact: true }).check();
  await page.getByRole('checkbox', { name: 'Compare FIELD-02', exact: true }).check();
  await expect(page.getByRole('region', { name: 'Product comparison' })).toBeVisible();
  await page.setViewportSize({ width: 320, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(true);
});

test('catalog rendered contrast and accessibility states', async ({ page }, info) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(CANDIDATE);
  const records = [];
  const scan = async state => {
    const result = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
    records.push({ state, state_oracle: 'passed', violations: result.violations, incomplete: result.incomplete });
    expect(result.violations).toEqual([]);
    expect(result.incomplete).toEqual([]);
  };
  await scan('initial');
  for (const locator of [page.locator('h1'),page.locator('.mobile-catalog .price').first(),page.locator('.mobile-catalog .stock').first(),page.getByRole('button',{name:'Reset filters',exact:true})]) {
    const result = await measure(locator);
    records.push({ state: 'normal', state_oracle: 'passed', ...result });
    expect(result.disposition, JSON.stringify(result)).toBe('PASS');
  }
  const reset = page.getByRole('button', { name: 'Reset filters', exact: true });
  await keyboardFocus(page, reset);
  const focused = await measure(reset, 'focus');
  expect(focused.disposition, JSON.stringify(focused)).toBe('PASS');
  records.push({ state: 'keyboard-focus', state_oracle: 'passed', ...focused });
  await page.getByRole('checkbox', { name:'Compare FIELD-01',exact:true }).check();
  await page.getByRole('checkbox', { name:'Compare FIELD-02',exact:true }).check();
  await scan('selected-comparison');
  await page.getByLabel('Search products').fill('no-match');
  await expect(page.getByRole('heading', { name:'No products match' })).toBeVisible();
  await scan('empty-with-selection');
  await evidence(info,page,'catalog rendered states',records,{state:'empty-with-selection',trigger:'load, Tab, compare two, search no-match',criterion:'representative contrast and scoped accessibility'});
});
