import { test, expect } from '@playwright/test';

test.describe('@visual', () => {
  test('header component looks correct (mask dynamic)', async ({ page }) => {
    await page.goto('/');
    const mask = [page.locator('[data-testid="live-counter"]')];
    await expect(page.locator('header')).toHaveScreenshot('header.png', {
      mask,
      animations: 'disabled',
      scale: 'css',
      maxDiffPixels: 100,
    });
  });

  test('full page (dark mode project)', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveScreenshot('dashboard-dark.png', { fullPage: true });
  });
});
