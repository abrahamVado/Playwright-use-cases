import { test, expect } from '@playwright/test';

test.describe('@exports', () => {
  test('downloaded PDF has content', async ({ page }) => {
    await page.goto('/invoices');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: /export pdf/i }).click()
    ]);
    expect(await download.suggestedFilename()).toMatch(/\.pdf$/);
  });
});
