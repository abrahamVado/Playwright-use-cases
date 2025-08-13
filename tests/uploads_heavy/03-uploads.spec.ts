import { test, expect } from '@playwright/test';

/**
 * File Uploads – starter example
 * Uses setInputFiles to bypass flaky drag-and-drop.
 * GIF suggestion: record the file chooser (or a fake progress bar) completing.
 */
test('upload a PDF and verify server response', async ({ page }) => {
  await page.goto('/upload'); // e.g. /assets/new

  // Point directly to the file input
  const fileInput = page.locator('input[type="file"]');
  await expect(fileInput).toBeVisible();

  // Upload a sample file from fixtures
  await fileInput.setInputFiles('tests/fixtures/sample.pdf');

  // If your UI shows progress, assert here (replace selector)
  // await expect(page.locator('[data-test="upload-progress"]')).toHaveText('100%');

  // Verify server acknowledged the upload (adjust URL/path/status to your app)
  const response = await page.waitForResponse((res) =>
    res.url().includes('/api/upload') && res.request().method() === 'POST'
  );
  expect(response.ok()).toBeTruthy();

  // Optional: assert response JSON for metadata
  try {
    const json = await response.json();
    expect(json).toMatchObject({ status: 'ok' }); // replace per your API
  } catch {
    // If the API doesn't return JSON, skip
  }
});
