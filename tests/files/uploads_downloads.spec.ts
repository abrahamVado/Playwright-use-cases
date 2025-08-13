import { test, expect } from '@playwright/test';

test.describe('@uploads @downloads | Files in/out', () => {
  test('rejects wrong MIME type on upload', async ({ page }) => {
    await page.goto('/profile');
    const file = { name: 'malware.exe', mimeType: 'application/x-msdownload', buffer: Buffer.from([0x00]) };
    await page.setInputFiles('input[type=file]', file as any);
    await expect(page.getByText(/unsupported file type/i)).toBeVisible();
  });

  test('download completes and file is present', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'webkit download path quirks');
    await page.goto('/reports');
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.getByRole('button', { name: /export csv/i }).click(),
    ]);
    const path = await download.path();
    expect(path).toBeTruthy();
  });
});
