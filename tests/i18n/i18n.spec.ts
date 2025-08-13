import { test, expect } from '@playwright/test';

test.describe('@i18n', () => {
  test('RTL layout flips', async ({ page }) => {
    await page.goto('/?lang=ar');
    await expect(page.locator('body')).toHaveAttribute('dir', 'rtl');
  });
  test('long German text does not overflow', async ({ page }) => {
    await page.goto('/?lang=de');
    await expect(page.locator('h1')).toHaveCSS('overflow-wrap', 'break-word');
  });
});
