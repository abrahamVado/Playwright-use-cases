import { test, expect } from '@playwright/test';

// already have: "fill and save inside an iframe"

// Validation error shows, then fix and save successfully in one flow
test('iframe: error then fix -> success', async ({ page }) => {
  await page.goto('/page-with-iframe.html');
  const frame = page.frameLocator('#editor-iframe');

  await frame.locator('[data-test="iframe-ready"]').waitFor({ state: 'attached' });

  // Trigger validation error
  await frame.locator('[data-test="save-btn"]').click();
  await expect(frame.locator('[data-test="error-title-required"]')).toBeVisible();

  // Fix and save
  await frame.locator('[data-test="title"]').fill('Now valid');
  await frame.locator('[data-test="save-btn"]').click();
  await expect(frame.locator('[data-test="toast-success"]')).toBeVisible();
});

// Backend failure surfaces error toast
test('iframe: backend 500 shows error toast', async ({ page }) => {
  await page.route('**/api/iframe/save', r => r.fulfill({ status: 500, body: 'boom' }));

  await page.goto('/page-with-iframe.html');
  const frame = page.frameLocator('#editor-iframe');
  await frame.locator('[data-test="iframe-ready"]').waitFor({ state: 'attached' });

  await frame.locator('[data-test="title"]').fill('Will fail');
  await frame.locator('[data-test="save-btn"]').click();
  await expect(frame.locator('[data-test="toast-error"]')).toBeVisible();
});
