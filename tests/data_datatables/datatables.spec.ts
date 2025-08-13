import { test, expect } from '@playwright/test';

test.describe('@data @datatables', () => {
  test('server-side search and sort are applied', async ({ page }) => {
    await page.goto('/orders');
    await page.getByRole('searchbox', { name: /search/i }).fill('INV-2025');
    await page.waitForResponse(r => r.url().includes('/api/orders') && r.request().method() === 'GET');
    await page.getByRole('columnheader', { name: /date/i }).click();
    await page.waitForResponse(r => r.url().includes('order[0][dir]=asc'));
    await page.getByRole('columnheader', { name: /date/i }).click();
    await page.waitForResponse(r => r.url().includes('order[0][dir]=desc'));
    const firstRow = page.locator('table tbody tr').first();
    await expect(firstRow).toContainText('INV-2025');
  });

  test('pagination changes rows', async ({ page }) => {
    await page.goto('/orders');
    const firstCell = page.locator('table tbody tr:first-child td:first-child');
    const idPage1 = await firstCell.textContent();
    await page.getByRole('button', { name: /next/i }).click();
    await page.waitForResponse(/\/api\/orders/);
    await expect(firstCell).not.toHaveText(idPage1 || '');
  });
});
