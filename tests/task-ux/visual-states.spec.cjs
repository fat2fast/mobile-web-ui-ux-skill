const { test, expect } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");
const { createHash } = require("node:crypto");
const { evidence } = require("./evidence-helpers.cjs");
const { measure, keyboardFocus } = require("./contrast-helpers.cjs");
const {
  installFonts,
  usedFonts,
  fonts,
  fontIdentity,
} = require("./visual-fonts.cjs");
test.beforeEach(async ({ page }) => {
  await installFonts(page);
});
const root = path.resolve(__dirname, "../..");
const journeys = {
  orders: {
    url: "http://127.0.0.1:4178/orders",
    heading: "Orders",
    action: (page) =>
      page.getByRole("button", { name: "Export visible", exact: true }),
  },
  comparison: {
    url: "http://127.0.0.1:4177",
    heading: "Cloud Hosting Plan Comparison",
    action: (page) => page.locator(".select-plan-btn").first(),
  },
  form: {
    url: "http://127.0.0.1:4181",
    heading: "Submit Workplace Request",
    action: (page) =>
      page.getByRole("button", { name: "Submit request", exact: true }),
  },
  catalog: {
    url: "http://127.0.0.1:4184",
    heading: "Power station catalog",
    action: (page) =>
      page.getByRole("button", { name: "Reset filters", exact: true }),
  },
  navigation: {
    url: "http://127.0.0.1:4186/overview",
    heading: "Overview",
    action: (page) =>
      page.getByRole("link", { name: "Open tasks", exact: true }),
  },
};
const digest = (file) =>
  createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const transitionDiagnostics = new WeakMap();
async function ready(page) {
  const faces = await usedFonts(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
  return faces;
}
async function orderGeometry(page) {
  return page.evaluate(() => {
    const button = document.querySelector(".bulk-actions button:last-child");
    if (!button) return null;
    const describe = (el) => {
      const r = el.getBoundingClientRect(),
        s = getComputedStyle(el);
      return {
        rect: { x: r.x, y: r.y, width: r.width, height: r.height },
        fontFamily: s.fontFamily,
        fontWeight: s.fontWeight,
        fontSize: s.fontSize,
        lineHeight: s.lineHeight,
        borderRadius: s.borderRadius,
        borderWidth: s.borderWidth,
      };
    };
    return {
      dpr: devicePixelRatio,
      button: describe(button),
      previous: button.previousElementSibling
        ? describe(button.previousElementSibling)
        : null,
    };
  });
}
async function navigate(page, url) {
  await page.goto(url);
  await ready(page);
}
async function assertLayout(page) {
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
}
async function snapshot(page, info, id, state) {
  const faces = await ready(page);
  await assertLayout(page);
  if (id.startsWith("orders-")) {
    const diagnostics = {
      before: transitionDiagnostics.get(page) || null,
      before_capture: { geometry: await orderGeometry(page), faces },
    };
    const file = info.outputPath("order-render-diagnostic.json");
    fs.writeFileSync(file, JSON.stringify(diagnostics, null, 2));
    await info.attach("order-render-diagnostic", {
      path: file,
      contentType: "application/json",
    });
  }
  const referenceName = id + "-r2.png";
  await expect(page).toHaveScreenshot(referenceName, {
    fullPage: true,
    animations: "disabled",
    caret: "hide",
    maxDiffPixels: 0,
    threshold: 0,
  });
  const expected = info.snapshotPath(referenceName);
  const actual = info.outputPath("actual.png"),
    reference = info.outputPath("expected.png");
  const captureAttempts = [];
  let actualBuffer;
  for (let attempt = 0; attempt < 4; attempt++) {
    const buffer = await page.screenshot({
      fullPage: true,
      animations: "disabled",
      caret: "hide",
    });
    const file = info.outputPath("actual-attempt-" + attempt + ".png");
    fs.writeFileSync(file, buffer);
    const sha256 = createHash("sha256").update(buffer).digest("hex");
    captureAttempts.push({ file, sha256 });
    actualBuffer = buffer;
    if (sha256 === digest(expected)) break;
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    );
  }
  fs.writeFileSync(actual, actualBuffer);
  expect(
    digest(actual),
    "Bounded capture must retain an exact current image, never reference substitution",
  ).toBe(digest(expected));
  fs.copyFileSync(expected, reference);
  const actualFonts = await usedFonts(page);
  expect(actualFonts.length).toBeGreaterThan(0);
  expect(
    actualFonts.every(
      (font) =>
        font.isCustomFont &&
        fonts.some((known) => known.postScriptName === font.postScriptName),
    ),
  ).toBe(true);
  const environment =
    "linux-chromium-" +
    page.context().browser().version() +
    "-dejavu-" +
    fontIdentity;
  expect(process.platform).toBe("linux");
  const baselinePath = path.relative(root, expected).split(path.sep).join("/");
  const generation = info.config.updateSnapshots === "missing";
  const registry = JSON.parse(
    fs.readFileSync(path.join(__dirname, "visual-baselines.json")),
  );
  const approved = registry.baselines.find((item) => item.snapshot_id === id);
  if (!generation) {
    expect(
      approved,
      "A reviewer must inspect and approve each baseline",
    ).toBeTruthy();
    expect(approved.verdict).toBe("approved");
    expect(approved.reviewer.trim()).not.toBe("");
    expect(approved.path).toBe(baselinePath);
    expect(approved.sha256).toBe(digest(expected));
    expect(approved.environment).toBe(environment);
    expect(
      digest(actual),
      "Zero-tolerance actual PNG must equal reviewed reference",
    ).toBe(digest(expected));
  }
  const artifactRoot = path.resolve(
    process.env.TASK_UX_ARTIFACTS || info.config.outputDir,
  );
  await evidence(
    info,
    page,
    "visual " + id,
    [
      {
        state,
        state_oracle: "passed",
        snapshot_id: id,
        zero_pixel_tolerance: true,
        capture_attempts: captureAttempts.map(({ file, sha256 }) => ({
          file: path.basename(file),
          sha256,
        })),
        font_files: fonts,
        browser_used_fonts: actualFonts,
      },
    ],
    {
      state,
      trigger: "source-owned state transition; see visual matrix",
      criterion:
        "reviewed visual regression plus explicit task/layout assertions",
      disposition: generation ? "NOT REVIEWED" : "PASS",
      artifactFiles: [
        actual,
        reference,
        ...captureAttempts.map((attempt) => attempt.file),
      ],
      snapshot: {
        snapshot_id: id,
        path: baselinePath,
        sha256: digest(expected),
        environment,
        actual_path: path
          .relative(artifactRoot, actual)
          .split(path.sep)
          .join("/"),
        expected_path: path
          .relative(artifactRoot, reference)
          .split(path.sep)
          .join("/"),
      },
    },
  );
}
for (const [name, journey] of Object.entries(journeys))
  for (const width of [320, 375, 390, 430, 1280]) {
    test(`visual normal ${name} ${width}`, async ({ page }, info) => {
      await page.setViewportSize({ width, height: 844 });
      await navigate(page, journey.url);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        journey.heading,
      );
      await expect(journey.action(page)).toBeVisible();
      await snapshot(page, info, `normal-${name}-${width}`, "normal");
    });
  }
async function prepare(page, name, state) {
  if (state === "long-label" && name === "orders")
    await page.route("**/src/main.jsx*", async (route) => {
      try {
        const response = await route.fetch();
        const source = await response.text();
        const pattern = /\bcustomer:\s*(["'])Lan Nguyen\1/g;
        expect([...source.matchAll(pattern)]).toHaveLength(1);
        const replacement =
          "customer: " +
          JSON.stringify(
            "Warehouse procurement customer with a long distinguishing suffix North",
          );
        await route.fulfill({
          response,
          body: source.replace(pattern, () => replacement),
        });
      } catch (error) {
        await route.abort();
        throw error;
      }
    });
  await navigate(page, journeys[name].url);
  if (name === "orders")
    transitionDiagnostics.set(page, {
      geometry: await orderGeometry(page),
      faces: await usedFonts(page),
    });
  if (name === "orders") {
    if (state === "selected-empty") {
      await page.locator('input[aria-label="Select ORD-1001"]:visible').check();
      await page.getByLabel("Search orders", { exact: true }).fill("no-match");
      await expect(
        page.getByRole("button", {
          name: "Follow-up selected (1)",
          exact: true,
        }),
      ).toBeEnabled();
      await expect(
        page.getByRole("button", { name: "Clear filters", exact: true }),
      ).toBeVisible();
    } else {
      const fullName =
        "Warehouse procurement customer with a long distinguishing suffix North";
      const label = page
        .getByText(fullName, { exact: true })
        .filter({ visible: true });
      await expect(label).toHaveCount(1);
      await expect(label).toBeVisible();
      await expect(label).toHaveText(fullName);
    }
  } else if (name === "comparison") {
    await page.locator(".select-plan-btn").first().click();
    await expect(page.getByRole("status")).toHaveText(
      "Selected plan: Starter Plan",
    );
  } else if (name === "form") {
    await page.locator("#startDate").fill("2026-11-01");
    await page.locator("#endDate").fill("2026-11-03");
    await page.locator("#reason").fill("REJECT");
    await page.locator("#file").setInputFiles({
      name: "evaluation-document-distinguishing-suffix-South.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("Local evaluation document bytes"),
    });
    const [rejection] = await Promise.all([
      page.waitForResponse(
        (res) =>
          res.url().includes("/api/request") &&
          res.request().method() === "POST",
      ),
      page.getByRole("button", { name: "Submit request", exact: true }).click(),
    ]);
    expect(rejection.status()).toBe(422);
    await expect(page.locator("#reason-error")).toContainText(
      "Request reason rejected",
    );
    if (state === "success") {
      await page.locator("#reason").fill("Scheduled evaluation leave");
      const [accepted] = await Promise.all([
        page.waitForResponse(
          (res) =>
            res.url().includes("/api/request") &&
            res.request().method() === "POST",
        ),
        page
          .getByRole("button", { name: "Submit request", exact: true })
          .click(),
      ]);
      expect(accepted.status()).toBe(200);
      const receipt = page
        .getByRole("status")
        .filter({ hasText: /^Submitted:/ });
      await expect(receipt).toHaveCount(1);
      await expect(receipt).toHaveText("Submitted: REQ-2026-001");
    }
  } else if (name === "catalog") {
    await page
      .getByRole("checkbox", { name: "Compare FIELD-01", exact: true })
      .check();
    await page
      .getByRole("checkbox", { name: "Compare FIELD-02", exact: true })
      .check();
    await page.getByLabel("Search products", { exact: true }).fill("no-match");
    await expect(
      page.getByRole("heading", { name: "No products match", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("region", { name: "Product comparison" }),
    ).toContainText("$1,099.00 USD");
  } else {
    if (state === "restricted") {
      await navigate(page, "http://127.0.0.1:4186/admin?role=viewer");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "Access restricted",
      );
    }
    if (state === "long-detail") {
      await navigate(page, "http://127.0.0.1:4186/tasks/TASK-01");
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "Warehouse handover checklist — distinguishing suffix North",
      );
      await expect(
        page.getByRole("link", { name: "Edit task", exact: true }),
      ).toBeVisible();
    }
    if (state === "edit-error") {
      await navigate(page, "http://127.0.0.1:4186/tasks/TASK-01/edit");
      await page.getByLabel("Task title", { exact: true }).fill("");
      await page
        .getByRole("button", { name: "Save task", exact: true })
        .click();
      await expect(page.getByRole("alert")).toHaveText("Enter a task title.");
    }
  }
}
const states = {
  orders: ["selected-empty", "long-label"],
  comparison: ["selected"],
  form: ["server-error-selected", "success"],
  catalog: ["selected-empty"],
  navigation: ["edit-error", "long-detail", "restricted"],
};
for (const [name, variants] of Object.entries(states))
  for (const state of variants)
    for (const width of [390, 1280]) {
      test(`visual state ${name} ${state} ${width}`, async ({ page }, info) => {
        await page.setViewportSize({ width, height: 844 });
        await prepare(page, name, state);
        await snapshot(page, info, `${name}-${state}-${width}`, state);
      });
    }
for (const [name, journey] of Object.entries(journeys)) {
  test(`reflow and text resize proxies ${name}`, async ({ page }, info) => {
    const records = [];
    await page.setViewportSize({ width: 320, height: 844 });
    await navigate(page, journey.url);
    await assertLayout(page);
    await expect(journey.action(page)).toBeVisible();
    records.push({
      state: "effective-320-reflow-proxy",
      state_oracle: "passed",
      actual_browser_zoom: false,
    });
    const reflow = info.outputPath("reflow-proxy.png");
    await page.screenshot({ path: reflow, fullPage: true });
    await page.setViewportSize({ width: 1280, height: 844 });
    await page.reload();
    await ready(page);
    const before = await page
      .locator("html")
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    await page
      .locator("html")
      .evaluate((el, size) => (el.style.fontSize = size * 2 + "px"), before);
    const after = await page
      .locator("html")
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(after).toBe(before * 2);
    await assertLayout(page);
    await expect(journey.action(page)).toBeVisible();
    const text = info.outputPath("root-font-proxy.png");
    await page.screenshot({ path: text, fullPage: true });
    records.push({
      state: "200-percent-root-font-proxy",
      state_oracle: "passed",
      before,
      after,
      actual_text_only_browser_review: false,
    });
    await evidence(info, page, "resize proxies " + name, records, {
      state: "root-font-proxy",
      trigger: "320 CSS viewport; double root font size at1280",
      criterion:
        "headless proxies only; actual browser400%/text-only200% NOT RUN",
      artifactFiles: [reflow, text],
    });
  });
}
test("visual negative probe detects a hidden required action", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await navigate(page, journeys.navigation.url);
  const action = journeys.navigation.action(page);
  await expect(action).toBeVisible();
  const handle = await action.elementHandle(),
    previous = await handle.getAttribute("style");
  try {
    await handle.evaluate((el) => (el.style.display = "none"));
    let detected = false;
    try {
      await expect(action).toBeVisible({ timeout: 200 });
    } catch {
      detected = true;
    }
    expect(detected).toBe(true);
    await evidence(
      info,
      page,
      "visual action probe",
      [
        {
          state: "hidden-action",
          state_oracle: "passed",
          expected_failure_detected: true,
        },
      ],
      {
        state: "injected-hidden-action",
        trigger:
          "hide required Open tasks action; behavioral assertion must fail",
        criterion: "expected-negative detection",
      },
    );
  } finally {
    await handle.evaluate(
      (el, old) =>
        old === null
          ? el.removeAttribute("style")
          : el.setAttribute("style", old),
      previous,
    );
    await handle.dispose();
  }
  await expect(action).toBeVisible();
});

test("order long-content and desktop scrolling contracts", async ({
  page,
}, info) => {
  const records = [],
    files = [];
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await prepare(page, "orders", "long-label");
    const total = page.locator(".mobile-list .order-total").first();
    await expect(total).toHaveText("$125.00");
    const geometry = await total.evaluate((el) => {
      const price = el.getBoundingClientRect(),
        name = el.previousElementSibling.getBoundingClientRect(),
        card = el.closest("article").getBoundingClientRect(),
        range = document.createRange();
      range.selectNodeContents(el);
      return {
        lines: range.getClientRects().length,
        separate: name.right <= price.left,
        contained: price.left >= card.left && price.right <= card.right,
      };
    });
    expect(geometry).toEqual({ lines: 1, separate: true, contained: true });
    records.push({
      state: "mobile-long-label",
      state_oracle: "passed",
      width,
      ...geometry,
    });
    await page.unroute("**/src/main.jsx*");
  }
  for (const state of ["normal", "long-label", "selected-empty"]) {
    await page.setViewportSize({ width: 1280, height: 844 });
    if (state === "normal") await navigate(page, journeys.orders.url);
    else await prepare(page, "orders", state);
    await assertLayout(page);
    const table = page.locator(".desktop-table");
    const bounds = await table.evaluate((el) => {
      el.scrollLeft = el.scrollWidth;
      const r = el.getBoundingClientRect();
      return {
        left: r.left,
        right: r.right,
        overflow: getComputedStyle(el).overflowX,
        scrollable: el.scrollWidth > el.clientWidth,
      };
    });
    expect(bounds.scrollable).toBe(true);
    expect(bounds.overflow).toBe("auto");
    expect(bounds.right).toBeLessThanOrEqual(1280);
    const header = page
      .locator(".desktop-table th")
      .filter({ hasText: /^Action$/ });
    const rect = await header.boundingBox();
    expect(rect.x).toBeGreaterThanOrEqual(bounds.left);
    expect(rect.x + rect.width).toBeLessThanOrEqual(bounds.right + 1);
    const screenshot = info.outputPath("desktop-" + state + "-right-edge.png");
    await page.screenshot({ path: screenshot, fullPage: true });
    files.push(screenshot);
    if (state === "selected-empty") {
      await page
        .getByRole("button", { name: "Clear filters", exact: true })
        .click();
      await expect(page.locator(".desktop-table tbody tr")).toHaveCount(4);
    }
    await table.evaluate((el) => (el.scrollLeft = 0));
    const action = page
      .locator(".desktop-table tbody tr")
      .first()
      .getByRole("button", { name: "Follow-up", exact: true });
    await keyboardFocus(page, action);
    const hit = await action.evaluate((el) => {
      const r = el.getBoundingClientRect(),
        b = el.closest(".desktop-table").getBoundingClientRect();
      return {
        visible:
          r.left >= b.left &&
          r.right <= b.right &&
          r.left >= 0 &&
          r.right <= innerWidth,
        hit: el.contains(
          document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2),
        ),
      };
    });
    expect(hit).toEqual({ visible: true, hit: true });
    const focus = await measure(action, "focus");
    expect(focus.disposition, JSON.stringify(focus)).toBe("PASS");
    await page.keyboard.press("Enter");
    await expect(
      page.getByRole("status").filter({ hasText: "Follow-up recorded" }),
    ).toHaveText("Follow-up recorded for ORD-1001");
    records.push({
      state,
      state_oracle: "passed",
      contained_table_scroll: true,
      keyboard_action: true,
      ...hit,
      focus,
    });
    await page.unroute("**/src/main.jsx*");
  }
  await evidence(info, page, "order responsive containment", records, {
    state: "desktop-keyboard-action",
    trigger:
      "long labels320/390; desktop normal/long/empty scroll and keyboard action/recovery",
    criterion:
      "exact one-line monetary data and bounded preserved desktop table reachability",
    artifactFiles: files,
  });
});
