import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    timezoneId: 'America/Mexico_City'
  },

  projects: [
    {
      name: 'chromium-default',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'chromium-dark-esMX',
      use: {
        ...devices['Desktop Chrome'],
        colorScheme: 'dark',
        locale: 'es-MX',
        timezoneId: 'America/Mexico_City',
      },
    },
    {
      name: 'firefox-reduced-motion',
      use: {
        ...devices['Desktop Firefox'],
        reducedMotion: 'reduce',
      },
    },
    {
      name: 'webkit-rtl-mobile',
      use: {
        ...devices['iPhone 13'],
        locale: 'ar',
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'chromium-high-contrast',
      use: {
        ...devices['Desktop Chrome'],
        forcedColors: 'active',
      },
    },
  ],
});
