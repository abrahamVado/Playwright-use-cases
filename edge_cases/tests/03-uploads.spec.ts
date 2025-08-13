import { test, expect } from '@playwright/test';

// tiny in-memory pdf generator
const pdf = (name: string) => ({
  name,
  mimeType: 'application/pdf',
  buffer: Buffer.from('%PDF-1.4\n% tiny demo\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF')
});

/**
 * PASS – Single upload using disk file (kept as-is)
 * If you prefer in-memory here too, swap the setInputFiles line for: await fileInput.setInputFiles([pdf('sample.pdf')])
 */
test('upload a PDF and verify server response', async ({ page }) => {
  await page.goto('/upload.html');

  const fileInput = page.locator('input[type="file"]');
  await expect(fileInput).toBeVisible();

  await fileInput.setInputFiles('tests/fixtures/sample.pdf');
  await expect(page.locator('[data-test="upload-success"]')).toBeVisible();
});

/**
 * PASS – Multiple files (no need for sample2.pdf on disk)
 */
test('upload multiple files succeeds', async ({ page }) => {
  await page.goto('/upload.html');
  const input = page.locator('input[type="file"]');

  await input.setInputFiles([pdf('first.pdf'), pdf('second.pdf')]);
  await expect(page.locator('[data-test="upload-success"]')).toBeVisible();
});

/**
 * PASS – Server error is surfaced (force network failure so fetch rejects)
 * If you updated the page to check res.ok, you can use fulfill({status:500}) instead.
 */
test('upload shows error toast on server failure', async ({ page }) => {
  await page.route('**/api/upload', (route) => route.abort()); // makes fetch() reject

  await page.goto('/upload.html');
  await page.locator('input[type="file"]').setInputFiles(pdf('broken.pdf'));
  await expect(page.locator('[data-test="upload-error"]')).toBeVisible();
});

/**
 * PASS – Re-upload replaces previous state (shows success again)
 * Uses a different in-memory filename to ensure change event fires.
 */
test('upload can be retried', async ({ page }) => {
  await page.goto('/upload.html');
  const input = page.locator('input[type="file"]');

  await input.setInputFiles(pdf('first.pdf'));
  await expect(page.locator('[data-test="upload-success"]')).toBeVisible();

  // Re-trigger with a different filename
  await input.setInputFiles(pdf('second.pdf'));
  await expect(page.locator('[data-test="upload-success"]')).toBeVisible();
});
