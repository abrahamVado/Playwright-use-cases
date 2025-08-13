import { test, expect } from '@playwright/test';

test.describe('@locale @a11y | Locale & accessibility basics', () => {
  test('es-MX decimal and currency formatting', async ({ page }) => {
    await page.goto('/pricing?locale=es-MX');
    await expect(page.getByTestId('total')).toHaveText(/\$\s?1,234\.56/);
  });

  test('keyboard-only modal open/close', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
  });

  test('async results announced via aria-live', async ({ page }) => {
    await page.goto('/search');
    await page.getByRole('textbox', { name: /search/i }).fill('playwright');
    await page.getByRole('button', { name: /go/i }).click();
    await expect(page.getByRole('status')).toHaveText(/results/i);
  });
});
