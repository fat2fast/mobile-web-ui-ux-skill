const { test, expect } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");
const AxeBuilder = require("@axe-core/playwright").default;
const { measure, keyboardFocus } = require("./contrast-helpers.cjs");
const { evidence } = require("./evidence-helpers.cjs");
const URL = "http://127.0.0.1:4186";
const original = "Warehouse handover checklist — distinguishing suffix North";
for (const width of [320, 390, 1280]) {
  test(`navigation workflow at ${width}px preserves edit and browser history`, async ({
    page,
  }, info) => {
    // Preserve the source data contract without freezing the JSX implementation.
    const dataFile = "navigation-data.js";
    expect(
      fs.readFileSync(
        path.join(__dirname, "../../evals/fixtures/navigation/src", dataFile),
      ),
    ).toEqual(
      fs.readFileSync(
        path.join(__dirname, "../../evals/implementations/task-first/navigation/src", dataFile),
      ),
    );
    await page.setViewportSize({ width, height: 844 });
    await page.goto(URL + "/overview");
    await page.getByRole("link", { name: "Open tasks", exact: true }).click();
    await page.getByLabel("Search tasks", { exact: true }).fill("TASK-01");
    await page.getByRole("link", { name: original, exact: true }).click();
    const detailUrl = page.url();
    const popupPromise = page.context().waitForEvent("page");
    await page
      .getByRole("link", { name: "Edit task", exact: true })
      .click({ modifiers: ["Control"] });
    const popup = await popupPromise;
    await popup.waitForLoadState();
    expect(page.url()).toBe(detailUrl);
    expect(new globalThis.URL(popup.url()).pathname).toBe(
      "/tasks/TASK-01/edit",
    );
    await popup.close();
    await page.getByRole("link", { name: "Edit task", exact: true }).click();
    await page
      .getByLabel("Task title", { exact: true })
      .fill("Cancelled draft North");
    await page.getByRole("button", { name: "Cancel", exact: true }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(original);
    await expect(
      page.getByRole("region", { name: "Task details" }),
    ).toContainText("Status: Open");
    await page.getByRole("link", { name: "Edit task", exact: true }).click();
    await page.getByLabel("Task title", { exact: true }).fill("");
    await page.getByRole("button", { name: "Save task", exact: true }).click();
    await expect(page.getByRole("alert")).toHaveText("Enter a task title.");
    await expect(page.getByLabel("Task title", { exact: true })).toBeFocused();
    const updated = "Reviewed handover checklist — distinguishing suffix North";
    await page.getByLabel("Task title", { exact: true }).fill(updated);
    await expect(page.locator("#title-error")).toHaveCount(0);
    await expect(page.getByLabel("Task title", { exact: true })).toHaveAttribute(
      "aria-invalid",
      "false",
    );
    await expect(page.getByLabel("Task title", { exact: true })).not.toHaveAttribute(
      "aria-describedby",
      "title-error",
    );
    await page
      .getByRole("combobox", { name: "Task status", exact: true })
      .selectOption("Done");
    await page.getByRole("button", { name: "Save task", exact: true }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(updated);
    await expect(
      page.getByRole("region", { name: "Task details" }),
    ).toContainText("Status: Done");
    await page.goBack();
    await expect(page.getByLabel("Search tasks", { exact: true })).toHaveValue(
      "TASK-01",
    );
    await expect(page.getByRole("status")).toHaveText("1 tasks shown");
    await expect(
      page.getByRole("link", { name: updated, exact: true }),
    ).toBeVisible();
    await page.goBack();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Overview",
    );
    const nav = page.getByRole("navigation", {
      name: width < 960 ? "Mobile workspace" : "Workspace",
      exact: true,
    });
    await expect(
      nav.getByRole("link", { name: "Overview", exact: true }),
    ).toHaveAttribute("aria-current", "page");
    if (width < 960) {
      const open = page.getByRole("button", {
        name: "More destinations",
        exact: true,
      });
      await open.focus();
      await page.keyboard.press("Enter");
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(open).toBeFocused();
      await open.click();
      await page
        .getByRole("button", { name: "Close navigation", exact: true })
        .click();
      await expect(open).toBeFocused();
      await open.click();
      await page.mouse.click(1, 1);
      await expect(page.getByRole("dialog")).not.toBeVisible();
      await expect(open).toBeFocused();
      await open.click();
      await page
        .getByRole("dialog")
        .getByRole("link", { name: "Documents", exact: true })
        .click();
    } else
      await nav.getByRole("link", { name: "Documents", exact: true }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Documents",
    );
    await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
    if (width < 960) {
      const reopen = page.getByRole("button", {
        name: "More destinations",
        exact: true,
      });
      await reopen.click();
      await page.keyboard.press("Escape");
      await expect(reopen).toBeFocused();
      await reopen.click();
      await page.setViewportSize({ width: 1280, height: 844 });
      await expect(page.getByRole("dialog")).not.toBeVisible();
      await expect(
        page.getByRole("navigation", { name: "Workspace", exact: true }),
      ).toBeVisible();
      await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
      await page.setViewportSize({ width, height: 844 });
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await evidence(
      info,
      page,
      `navigation task ${width}`,
      [
        {
          state: "saved-back-secondary",
          state_oracle: "passed",
          history_context: true,
          exact_values: true,
        },
      ],
      {
        state: "documents",
        trigger:
          "overview/tasks/search/detail/edit/error/save/Back/Back/secondary",
        criterion: "navigation task, route, data and desktop contracts",
      },
    );
  });
}
test("navigation direct links refresh and local role guards", async ({
  page,
}, info) => {
  await page.goto(URL + "/tasks/TASK-01/edit?role=viewer");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Access restricted",
  );
  await expect(page.getByLabel("Task title", { exact: true })).toHaveCount(0);
  await page.reload();
  await expect(
    page.getByRole("region", { name: "Restricted destination" }),
  ).toBeVisible();
  await page.goto(URL + "/admin?role=viewer");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Access restricted",
  );
  await expect(
    page.getByRole("link", { name: "Administration", exact: true }),
  ).toHaveCount(0);
  await page.goto(URL + "/tasks/TASK-02/edit?role=editor");
  await page
    .getByLabel("Task title", { exact: true })
    .fill("Cancelled direct draft South");
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Procurement review — distinguishing suffix South",
  );
  await page.goto(URL + "/tasks/TASK-02/edit?role=editor");
  await page
    .getByLabel("Task title", { exact: true })
    .fill("  Exact entered title South  ");
  await page.getByRole("button", { name: "Save task", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Exact entered title South",
  );
  expect(await page.getByRole("heading", { level: 1 }).textContent()).toBe(
    "  Exact entered title South  ",
  );
  expect(new globalThis.URL(page.url()).pathname).toBe("/tasks/TASK-02");
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Procurement review — distinguishing suffix South",
  );
  await page.goto(URL + "/tasks/UNKNOWN");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Not found");
  await evidence(
    info,
    page,
    "navigation routes and roles",
    [
      {
        state: "direct-routes",
        state_oracle: "passed",
        viewer_guard: true,
        reload_reset: true,
      },
    ],
    {
      state: "not-found",
      trigger:
        "viewer edit/admin direct, refresh, editor direct save, refresh, unknown ID",
      criterion: "local role and route contracts; not production authorization",
    },
  );
});
test("navigation baseline retains all editor destinations and save behavior", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("http://127.0.0.1:4185/overview");
  await page
    .getByRole("button", { name: "Open navigation", exact: true })
    .click();
  await expect(page.getByRole("dialog").getByRole("link")).toHaveCount(12);
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "Tasks", exact: true })
    .click();
  await page.getByRole("link", { name: original, exact: true }).click();
  await page.getByRole("link", { name: "Edit task", exact: true }).click();
  await page
    .getByRole("combobox", { name: "Task status", exact: true })
    .selectOption("Done");
  await page.getByRole("button", { name: "Save task", exact: true }).click();
  await expect(
    page.getByRole("region", { name: "Task details" }),
  ).toContainText("Status: Done");
});
test("navigation rendered accessibility and keyboard states", async ({
  page,
}, info) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(URL + "/overview");
  const records = [];
  for (const state of ["overview", "open-menu", "edit-error", "restricted"]) {
    if (state === "open-menu") {
      await page
        .getByRole("button", { name: "More destinations", exact: true })
        .click();
      await page.screenshot({
        path: info.outputPath("dialog-heading.png"),
        fullPage: true,
      });
    }
    if (state === "edit-error") {
      await page.keyboard.press("Escape");
      await page.goto(URL + "/tasks/TASK-01/edit");
      await page.getByLabel("Task title", { exact: true }).fill("");
      await page
        .getByRole("button", { name: "Save task", exact: true })
        .click();
    }
    if (state === "restricted") await page.goto(URL + "/admin?role=viewer");
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(result.violations).toEqual([]);
    const unresolved = [];
    for (const finding of result.incomplete) {
      for (const node of finding.nodes) {
        const bounded =
          state === "open-menu" &&
          finding.id === "color-contrast" &&
          node.target.length === 1 &&
          node.target[0] === "#destinations-heading" &&
          node.any.some(
            (check) => check.data?.messageKey === "elmPartiallyObscuring",
          );
        if (!bounded) {
          unresolved.push({ id: finding.id, node });
          continue;
        }
        const heading = page.locator("#destinations-heading");
        await expect(page.getByRole("dialog")).toBeVisible();
        await expect(heading).toBeVisible();
        const geometry = await heading.evaluate((el) => {
          const r = el.getBoundingClientRect(),
            d = el.closest("dialog"),
            b = d.getBoundingClientRect();
          return {
            modal: d.matches(":modal"),
            inside:
              r.left >= b.left &&
              r.top >= b.top &&
              r.right <= b.right &&
              r.bottom <= b.bottom &&
              r.left >= 0 &&
              r.top >= 0 &&
              r.right <= innerWidth &&
              r.bottom <= innerHeight,
            unobscured: [
              [0.1, 0.1],
              [0.5, 0.5],
              [0.9, 0.9],
            ].every(([x, y]) =>
              el.contains(
                document.elementFromPoint(
                  r.left + r.width * x,
                  r.top + r.height * y,
                ),
              ),
            ),
          };
        });
        expect(geometry).toEqual({
          modal: true,
          inside: true,
          unobscured: true,
        });
        const pair = await measure(heading);
        expect(pair.disposition, JSON.stringify(pair)).toBe("PASS");
        const screenshot = info.outputPath("dialog-heading.png");
        await page.screenshot({ path: screenshot, fullPage: true });
        records.push({
          state,
          state_oracle: "passed",
          finding_id: finding.id,
          target: node.target,
          disposition: "resolved-by-rendered-check",
          ...geometry,
          measurement: pair,
        });
      }
    }
    expect(
      unresolved,
      "Unreviewed scanner incomplete nodes fail closed",
    ).toEqual([]);
    records.push({
      state,
      state_oracle: "passed",
      violations: result.violations,
      incomplete: result.incomplete,
    });
  }
  const link = page.getByRole("link", { name: "Return to tasks", exact: true });
  await keyboardFocus(page, link);
  for (const mode of ["text", "focus"]) {
    const result = await measure(link, mode);
    expect(result.disposition, JSON.stringify(result)).toBe("PASS");
    records.push({
      state: "restricted-keyboard",
      state_oracle: "passed",
      ...result,
    });
  }
  await evidence(info, page, "navigation rendered states", records, {
    state: "restricted-keyboard",
    trigger: "overview/menu/edit validation/restricted/Tab",
    criterion: "scoped accessibility and rendered contrast",
    artifactFiles: [info.outputPath("dialog-heading.png")],
  });
});
