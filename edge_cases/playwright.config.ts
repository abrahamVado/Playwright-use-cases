import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'node server.js',
    url: 'http://localhost:3000',
    timeout: 30000,
    reuseExistingServer: !process.env.CI,
  },
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
});
