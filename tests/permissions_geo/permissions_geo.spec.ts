import { test, expect } from '@playwright/test';

test.describe('@permissions', () => {
  test('geo denied shows manual location input', async ({ context, page }) => {
    await context.grantPermissions([], { origin: 'https://localhost:3000' });
    await page.goto('/');
    await expect(page.getByText(/enter your city/i)).toBeVisible();
  });
});
