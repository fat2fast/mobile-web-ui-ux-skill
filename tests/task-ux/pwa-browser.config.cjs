const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: '.', testMatch: 'pwa-browser.spec.cjs', workers: 1,
  use: { browserName: 'chromium', headless: true },
  webServer: { command: 'node ../../evals/fixtures/pwa-browser/server.cjs', url: 'http://127.0.0.1:4187/app/', reuseExistingServer: false, timeout: 30000 },
});
