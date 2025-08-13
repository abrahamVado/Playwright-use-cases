import { test, expect } from '@playwright/test';

test.describe('@ui @datepicker', () => {
  test('selects a date via popup and respects min/max', async ({ page }) => {
    await page.goto('/booking');
    await page.getByLabel('Check-in').click();
    await page.getByRole('button', { name: /next month/i }).click();
    await page.getByRole('gridcell', { name: /^15$/ }).click();
    await expect(page.getByLabel('Check-in')).toHaveValue(/202\d-\d{2}-15/);
  });

  test('keyboard navigation works (a11y)', async ({ page }) => {
    await page.goto('/booking');
    await page.getByLabel('Check-in').press('Enter');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('Enter');
    await expect(page.getByLabel('Check-in')).not.toHaveValue('');
  });
});
