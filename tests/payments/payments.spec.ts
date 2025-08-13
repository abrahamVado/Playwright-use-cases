import { test, expect } from '@playwright/test';

test.describe('@payments', () => {
  test('3-D Secure challenge handled', async ({ page }) => {
    await page.goto('/checkout');
    await page.getByRole('button', { name: /pay/i }).click();
    await expect(page.getByText(/authentication successful/i)).toBeVisible();
  });
});
