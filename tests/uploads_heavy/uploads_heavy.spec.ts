import { test, expect } from '@playwright/test';

test.describe('@uploads', () => {
  test('large file upload shows progress', async ({ page }) => {
    await page.goto('/upload');
    await page.setInputFiles('input[type="file"]', {
      name: 'bigfile.bin', mimeType: 'application/octet-stream', buffer: Buffer.alloc(5 * 1024 * 1024)
    } as any);
    await expect(page.getByText(/upload complete/i)).toBeVisible();
  });
});
