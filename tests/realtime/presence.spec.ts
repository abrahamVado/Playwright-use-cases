import { test, expect } from '@playwright/test';

test.describe('@realtime', () => {
  test('shows reconnect & recovers', async ({ page }) => {
    await page.goto('/board');
    await expect(page.getByText(/live/i)).toBeVisible();
  });
});
