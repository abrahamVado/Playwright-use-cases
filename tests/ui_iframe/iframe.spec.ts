import { test, expect } from '@playwright/test';

test.describe('@ui @iframe', () => {
  test('fills card fields inside third-party iframe', async ({ page }) => {
    await page.goto('/checkout');
    const frame = page.frameLocator('#payment-iframe');
    await expect(frame.getByText(/loading/i)).toBeHidden();
    await frame.getByPlaceholder('Card number').fill('4242 4242 4242 4242');
    await frame.getByPlaceholder('MM / YY').fill('12 / 30');
    await frame.getByPlaceholder('CVC').fill('123');
    await page.getByRole('button', { name: /pay/i }).click();
    await expect(page.getByRole('alert')).toHaveText(/payment successful/i);
  });
});
