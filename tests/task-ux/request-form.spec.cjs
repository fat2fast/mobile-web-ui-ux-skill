// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

async function capture(page, name) {
  if (!process.env.TASK_UX_SCREENSHOTS) return;
  fs.mkdirSync(process.env.TASK_UX_SCREENSHOTS, { recursive: true });
  await page.screenshot({ path: path.join(process.env.TASK_UX_SCREENSHOTS, name), fullPage: true });
}

const BASELINE_URL = 'http://127.0.0.1:4179';
const IMPL_URL = 'http://127.0.0.1:4181';

test.describe('Contextual Request Form - Baseline Observations', () => {
  test('baseline submit button uses fixed positioning that risks viewport occlusion at reduced height', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 480 });
    await page.goto(BASELINE_URL);

    const submitGeometry = await page.evaluate(() => {
      const btn = document.querySelector('button[type="submit"]');
      const parent = btn ? btn.parentElement : null;
      if (!btn || !parent) return null;
      const rect = parent.getBoundingClientRect();
      const style = getComputedStyle(parent);
      return {
        position: style.position,
        top: rect.top,
        bottom: rect.bottom,
        viewportHeight: window.innerHeight,
      };
    });

    expect(submitGeometry?.position).toBe('fixed');
    expect(submitGeometry?.bottom).toBe(480);
    expect(submitGeometry?.top).toBeLessThan(480);
  });

  test('baseline handles server 422 rejection and retains input values', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASELINE_URL);

    await page.locator('#startDate').fill('2026-11-01');
    await page.locator('#endDate').fill('2026-11-05');
    await page.locator('#reason').fill('REJECT');

    const [response] = await Promise.all([
      page.waitForResponse((res) => res.url().includes('/api/request') && res.request().method() === 'POST'),
      page.getByRole('button', { name: 'Submit request' }).click(),
    ]);

    expect(response.status()).toBe(422);
    await expect(page.getByRole('alert')).toContainText('Request reason rejected');

    // Values retained
    await expect(page.locator('#startDate')).toHaveValue('2026-11-01');
    await expect(page.locator('#endDate')).toHaveValue('2026-11-05');
  });

  test('baseline handles successful multipart file submission', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASELINE_URL);

    await page.locator('#startDate').fill('2026-11-01');
    await page.locator('#endDate').fill('2026-11-03');
    await page.locator('#reason').fill('Valid project need');

    await page.locator('#file').setInputFiles({
      name: 'receipt.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('Mock baseline receipt data'),
    });

    const [response] = await Promise.all([
      page.waitForResponse((res) => res.url().includes('/api/request') && res.request().method() === 'POST'),
      page.getByRole('button', { name: 'Submit request' }).click(),
    ]);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.requestId).toBe('REQ-2026-001');
    expect(body.fileReceived).toBe(true);
    await expect(page.getByRole('status')).toContainText('Submitted: REQ-2026-001');
  });
});

test.describe('Contextual Request Form - Task-First Implementation', () => {
  for (const width of [320, 375, 390, 430]) {
    test(`viewport ${width}px has zero horizontal overflow and clear geometric CTA clearance at reduced height`, async ({ page }) => {
      await page.setViewportSize({ width, height: 480 });
      await page.goto(IMPL_URL);

      const overflow = await page.evaluate(() => {
        return {
          windowWidth: window.innerWidth,
          docScrollWidth: document.documentElement.scrollWidth,
          hasHorizontalOverflow: document.documentElement.scrollWidth > window.innerWidth,
        };
      });
      expect(overflow.hasHorizontalOverflow).toBe(false);

      await page.locator('#file').focus();
      await expect(page.locator('#file')).toBeFocused();
      await page.locator('#file').scrollIntoViewIfNeeded();

      const clearance = await page.evaluate(() => {
        const fileInput = document.getElementById('file');
        const submitBtn = document.querySelector('button[type="submit"]');
        if (!fileInput || !submitBtn) return null;

        const fileRect = fileInput.getBoundingClientRect();
        const submitRect = submitBtn.getBoundingClientRect();

        const isStrictlyBelow = submitRect.top >= fileRect.bottom - 1;

        const centerX = fileRect.left + fileRect.width / 2;
        const centerY = fileRect.top + fileRect.height / 2;
        const topEl = document.elementFromPoint(centerX, centerY);
        const notOccluded = topEl ? (fileInput.contains(topEl) || topEl.contains(fileInput) || topEl.closest('.mobile-upload-container') !== null) : false;

        return {
          isStrictlyBelow,
          notOccluded,
          fileBottom: fileRect.bottom,
          submitTop: submitRect.top,
        };
      });

      expect(clearance?.isStrictlyBelow).toBe(true);
      expect(clearance?.notOccluded).toBe(true);
      if (width === 320 || width === 390) await capture(page, `request-form-${width}.png`);
    });
  }

  test('manual date typing, reactive days derivation, and range validation work', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(IMPL_URL);

    // Manual date typing
    await page.locator('#startDate').fill('2026-11-01');
    await page.locator('#endDate').fill('2026-11-05');

    // Verify derived days calculation (inclusive: Nov 1 to Nov 5 = 5 days)
    const durationBadge = page.locator('.derived-days');
    await expect(durationBadge).toBeVisible();
    await expect(durationBadge).toContainText('5 days (inclusive)');

    // Inverted range check: end before start
    await page.locator('#endDate').fill('2026-10-28');
    await expect(page.getByText('End date cannot be earlier than start date')).toBeVisible();

    // Fix end date
    await page.locator('#endDate').fill('2026-11-07');
    await expect(durationBadge).toContainText('7 days (inclusive)');
  });


  test('native date controls synchronize with manual ISO inputs and duration', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 640 });
    await page.goto(IMPL_URL);
    const startPicker = page.getByLabel('Choose start date');
    const endPicker = page.getByLabel('Choose end date');
    await expect(startPicker).toHaveAttribute('type', 'date');
    await startPicker.click();
    await startPicker.fill('2026-11-01');
    await endPicker.click();
    await endPicker.fill('2026-11-05');
    await expect(page.locator('#startDate')).toHaveValue('2026-11-01');
    await expect(page.locator('#endDate')).toHaveValue('2026-11-05');
    await expect(page.locator('.derived-days')).toContainText('5 days (inclusive)');
    await page.locator('#endDate').fill('2026-11-07');
    await expect(endPicker).toHaveValue('2026-11-07');
    await expect(page.locator('.derived-days')).toContainText('7 days (inclusive)');
    await page.locator('#startDate').fill('2026-11-');
    await expect(startPicker).toHaveValue('');
  });

  test('enforces calendar date validity and range bounds (2026-2027) with auto-focus', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(IMPL_URL);

    // Test 1: Invalid calendar date (2026-02-31 doesn\'t exist)
    await page.locator('#startDate').fill('2026-02-31');
    await page.locator('#endDate').fill('2026-03-05');
    await page.locator('#reason').fill('Valid reason text');

    const [resInvalidCalendar] = await Promise.all([
      page.waitForResponse((res) => res.url().includes('/api/request') && res.request().method() === 'POST'),
      page.getByRole('button', { name: 'Submit request' }).click(),
    ]);

    expect(resInvalidCalendar.status()).toBe(422);
    const body1 = await resInvalidCalendar.json();
    expect(body1.field).toBe('startDate');
    await expect(page.locator('#startDate-error')).toContainText('not a valid calendar date');
    await expect(page.locator('#startDate')).toBeFocused();
    await expect(page.locator('#startDate')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByLabel('Choose start date')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByLabel('Choose start date')).toHaveAttribute('aria-describedby', 'startDate-error');

    // Test 2: Out of bounds date (2028-01-01 beyond 2027-12-31)
    await page.locator('#startDate').fill('2028-01-01');
    await page.locator('#endDate').fill('2028-01-05');

    const [resOutOfBounds] = await Promise.all([
      page.waitForResponse((res) => res.url().includes('/api/request') && res.request().method() === 'POST'),
      page.getByRole('button', { name: 'Submit request' }).click(),
    ]);

    expect(resOutOfBounds.status()).toBe(422);
    const body2 = await resOutOfBounds.json();
    expect(body2.field).toBe('startDate');
    await expect(page.locator('#startDate-error')).toContainText('must be between 2026-01-01 and 2027-12-31');
    await expect(page.locator('#startDate')).toBeFocused();

    // Test 3: Start date present, end date blank -> focuses endDate
    await page.locator('#startDate').fill('2026-11-01');
    await page.locator('#endDate').fill('');

    const [resBlankEnd] = await Promise.all([
      page.waitForResponse((res) => res.url().includes('/api/request') && res.request().method() === 'POST'),
      page.getByRole('button', { name: 'Submit request' }).click(),
    ]);

    expect(resBlankEnd.status()).toBe(422);
    const body3 = await resBlankEnd.json();
    expect(body3.field).toBe('endDate');
    await expect(page.locator('#endDate-error')).toContainText('End date is required');
    await expect(page.locator('#endDate')).toBeFocused();
    await expect(page.locator('#endDate')).toHaveAttribute('aria-invalid', 'true');
  });


  test('reversed dates are rejected by the server and unrelated edits retain field errors', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 640 });
    await page.goto(IMPL_URL);
    await page.locator('#startDate').fill('2026-11-05');
    await page.locator('#endDate').fill('2026-11-01');
    await page.locator('#reason').fill('Valid reason');
    const [response] = await Promise.all([
      page.waitForResponse((res) => res.url().includes('/api/request') && res.request().method() === 'POST'),
      page.getByRole('button', { name: 'Submit request' }).click(),
    ]);
    expect(response.status()).toBe(422);
    await expect(page.locator('#endDate-error')).toBeVisible();
    await page.locator('#reason').fill('Updated valid reason');
    await expect(page.locator('#endDate-error')).toBeVisible();
    await expect(page.getByLabel('Choose end date')).toHaveAttribute('aria-describedby', 'endDate-error');
    await page.locator('#endDate').fill('2026-11-07');
    await expect(page.locator('#endDate-error')).toBeHidden();
    await expect(page.locator('.submit-container')).toContainText('checked again when you submit');
  });

  test('network error receives logical focus', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 640 });
    await page.goto(IMPL_URL);
    await page.locator('#startDate').fill('2026-11-01');
    await page.locator('#endDate').fill('2026-11-03');
    await page.locator('#reason').fill('Valid reason');
    await page.route('**/api/request', (route) => route.abort());
    await page.getByRole('button', { name: 'Submit request' }).click();
    await expect(page.locator('.server-alert')).toContainText('Network connection failed');
    await expect(page.locator('.server-alert')).toBeFocused();
  });

  test('enforces file type constraints, handles unsupported file with accessible inline error', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(IMPL_URL);

    await page.locator('#startDate').fill('2026-11-01');
    await page.locator('#endDate').fill('2026-11-05');
    await page.locator('#reason').fill('Legitimate business travel');

    // Attach unsupported file type (.exe)
    await page.locator('#file').setInputFiles({
      name: 'malicious.exe',
      mimeType: 'application/x-msdownload',
      buffer: Buffer.from('MZ binary executable mock'),
    });

    const [resUnsupported] = await Promise.all([
      page.waitForResponse((res) => res.url().includes('/api/request') && res.request().method() === 'POST'),
      page.getByRole('button', { name: 'Submit request' }).click(),
    ]);

    expect(resUnsupported.status()).toBe(422);
    const body = await resUnsupported.json();
    expect(body.field).toBe('file');
    expect(body.error).toContain('Unsupported file type');

    const fileInput = page.locator('#file');
    await expect(page.locator('#file-error')).toBeVisible();
    await expect(page.locator('#file-error')).toContainText('Unsupported file type');
    await expect(fileInput).toHaveAttribute('aria-invalid', 'true');
    await expect(fileInput).toHaveAttribute('aria-describedby', 'file-error');
    await expect(fileInput).toBeFocused();
  });


  test('oversized attachment remains server validated and can be removed', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 480 });
    await page.goto(IMPL_URL);
    await page.locator('#startDate').fill('2026-11-01');
    await page.locator('#endDate').fill('2026-11-03');
    await page.locator('#reason').fill('Valid business reason');
    await page.locator('#file').setInputFiles({
      name: 'oversize.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.alloc(5 * 1024 * 1024 + 1, 65),
    });
    const [response] = await Promise.all([
      page.waitForResponse((res) => res.url().includes('/api/request') && res.request().method() === 'POST'),
      page.getByRole('button', { name: 'Submit request' }).click(),
    ]);
    expect(response.status()).toBe(422);
    await expect(page.locator('#file-error')).toBeVisible();
    await expect(page.locator('#file')).toBeFocused();
    await page.getByRole('button', { name: 'Remove file' }).click();
    await expect(page.locator('#file-error')).toBeHidden();
    expect(await page.locator('#file').evaluate((el) => el.files.length)).toBe(0);
  });

  test('touch file delivery, real byte transmission, error recovery, focus shift, and resubmission', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(IMPL_URL);

    await page.locator('#startDate').fill('2026-11-01');
    await page.locator('#endDate').fill('2026-11-03');
    await page.locator('#reason').fill('REJECT');

    const fileBuffer = Buffer.from('Official medical leave doctor certificate documentation in PDF format');
    await page.locator('#file').setInputFiles({
      name: 'medical_certificate.pdf',
      mimeType: 'application/pdf',
      buffer: fileBuffer,
    });
    await expect(page.getByText('Selected: medical_certificate.pdf')).toBeVisible();

    // Submit with REJECT reason to test 422 error path
    const [res422] = await Promise.all([
      page.waitForResponse((res) => res.url().includes('/api/request') && res.request().method() === 'POST'),
      page.getByRole('button', { name: 'Submit request' }).click(),
    ]);

    expect(res422.status()).toBe(422);

    // Inline error associated via aria-describedby
    const reasonInput = page.locator('#reason');
    await expect(page.locator('#reason-error')).toBeVisible();
    await expect(page.locator('#reason-error')).toContainText('Request reason rejected');
    await capture(page, 'request-form-error-390.png');
    await expect(reasonInput).toHaveAttribute('aria-invalid', 'true');
    await expect(reasonInput).toHaveAttribute('aria-describedby', 'reason-error');

    // Focus automatically shifted to the invalid input
    await expect(reasonInput).toBeFocused();

    // All valid form values retained
    await expect(page.locator('#startDate')).toHaveValue('2026-11-01');
    await expect(page.locator('#endDate')).toHaveValue('2026-11-03');
    await expect(page.getByText('Selected: medical_certificate.pdf')).toBeVisible();

    // Correct reason and resubmit
    await reasonInput.fill('Scheduled annual personal leave');
    await expect(page.locator('#reason-error')).toBeHidden();
    await expect(reasonInput).toHaveAttribute('aria-invalid', 'false');
    await expect(page.getByText('Selected: medical_certificate.pdf')).toBeVisible();

    const [res200] = await Promise.all([
      page.waitForResponse((res) => res.url().includes('/api/request') && res.request().method() === 'POST'),
      page.getByRole('button', { name: 'Submit request' }).click(),
    ]);

    expect(res200.status()).toBe(200);
    const successData = await res200.json();

    // Assert real binary file receipt and contract adherence on server
    expect(successData.status).toBe('ok');
    expect(successData.requestId).toBe('REQ-2026-001');
    expect(successData.fileReceived).toBe(true);
    expect(successData.fileName).toBe('medical_certificate.pdf');
    expect(successData.bytesReceived).toBe(fileBuffer.byteLength);

    await expect(page.getByRole('status').filter({ hasText: 'Submitted' })).toContainText('Submitted: REQ-2026-001');
  });
});