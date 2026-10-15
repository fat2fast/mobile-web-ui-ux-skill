// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  testMatch: /.*\.spec\.cjs/,
  timeout: 45000,
  fullyParallel: false,
  workers: 1,
  reporter: [
    ['list'],
    ['json', { outputFile: 'artifacts/test-results.json' }],
  ],
  use: {
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      },
    },
  ],
  webServer: [
    {
      command: 'npm --prefix ../../evals/fixtures/order-dashboard run dev',
      url: 'http://127.0.0.1:4173/orders',
      reuseExistingServer: false,
      timeout: 60000,
    },
    {
      command: 'npm --prefix ../../evals/implementations/task-first/order-dashboard run dev',
      url: 'http://127.0.0.1:4178/orders',
      reuseExistingServer: false,
      timeout: 60000,
    },
    {
      command: 'npm --prefix ../../evals/fixtures/comparison-table run dev',
      url: 'http://127.0.0.1:4176',
      reuseExistingServer: false,
      timeout: 60000,
    },
    {
      command: 'npm --prefix ../../evals/implementations/task-first/comparison-table run dev',
      url: 'http://127.0.0.1:4177',
      reuseExistingServer: false,
      timeout: 60000,
    },
    {
      command: 'node ../../evals/fixtures/request-form/server.js',
      port: 4180,
      reuseExistingServer: false,
      timeout: 30000,
    },
    {
      command: 'npm --prefix ../../evals/fixtures/request-form run dev',
      url: 'http://127.0.0.1:4179',
      reuseExistingServer: false,
      timeout: 60000,
    },
    {
      command: 'node ../../evals/implementations/task-first/request-form/server.js',
      port: 4182,
      reuseExistingServer: false,
      timeout: 30000,
    },
    {
      command: 'npm --prefix ../../evals/implementations/task-first/request-form run dev',
      url: 'http://127.0.0.1:4181',
      reuseExistingServer: false,
      timeout: 60000,
    },
  ],
});