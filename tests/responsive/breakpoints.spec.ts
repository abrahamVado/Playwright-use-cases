import { test, expect } from '@playwright/test';

for (const w of [360, 768, 1024, 1440]) {
  test(`@responsive layout ok at ${w}px`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto('/dashboard');
    await expect(page.getByTestId('nav-drawer')).toBeVisible();
  });
}
