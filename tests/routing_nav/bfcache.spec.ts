import { test, expect } from '@playwright/test';

test.describe('@nav', () => {
  test('bfcache survives back/forward', async ({ page }) => {
    await page.goto('/products');
    await page.getByRole('link', { name: /details/i }).first().click();
    const name = await page.getByTestId('product-name').textContent();
    await page.goBack();
    await page.goForward();
    await expect(page.getByTestId('product-name')).toHaveText(name || '');
  });
});
