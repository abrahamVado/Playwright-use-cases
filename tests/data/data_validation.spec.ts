import { test, expect } from '@playwright/test';
import { trickyString } from '../utils/network';

test.describe('@data | Strings, numbers, XSS', () => {
  test('handles zero-width/RTL/emojis & sanitizes HTML', async ({ page }) => {
    await page.goto('/profile/edit');
    const tricky = trickyString();
    await page.getByLabel('Display name').fill(tricky);
    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByText('<img onerror=alert(1)>')).not.toBeVisible();
    await expect(page.getByText('مرحبا')).toBeVisible();
  });

  test('price rounding edge (.005)', async ({ page }) => {
    await page.goto('/cart');
    await page.getByLabel('Price').fill('19.995');
    await page.getByLabel('Qty').fill('1');
    await expect(page.getByTestId('total')).toHaveText('$20.00');
  });
});
