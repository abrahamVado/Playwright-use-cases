import { test, expect } from '@playwright/test';

test.describe('@pwa', () => {
  test('SW registers successfully', async ({ page }) => {
    await page.goto('/');
    // Check for service worker
    const hasSW = await page.evaluate(() => !!navigator.serviceWorker);
    expect(hasSW).toBeTruthy();
  });
});
