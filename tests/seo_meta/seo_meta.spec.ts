import { test, expect } from '@playwright/test';

test.describe('@seo', () => {
  test('has basic meta tags', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(desc).not.toBeNull();
  });
});
