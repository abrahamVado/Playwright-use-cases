import { test, expect } from '@playwright/test';

/**
 * API Endpoint Assertions – starter example
 * Pair UI actions with request/response checks and payload validation.
 * GIF suggestion: show the UI click + the test runner logging the matched API call.
 */
test('create order triggers correct API call', async ({ page }) => {
  await page.goto('/orders'); // e.g. orders index

  // Arm request waiter BEFORE clicking (avoids race conditions)
  const requestPromise = page.waitForRequest((req) => {
    return req.url().includes('/api/orders') && req.method() === 'POST';
  });

  // Perform UI action
  await page.locator('[data-test="create-order"]').click();

  // Get the matching request and validate payload
  const request = await requestPromise;
  const body = request.postDataJSON?.() ?? tryParseJSON(request.postData() || '');
  expect(body).toMatchObject({
    items: expect.any(Array),
    total: expect.any(Number),
  });

  // Validate the response as well (optional but powerful)
  const response = await page.waitForResponse((res) =>
    res.url().includes('/api/orders') && res.request().method() === 'POST'
  );
  expect(response.status()).toBeLessThan(400);
});

function tryParseJSON(raw: string) {
  try { return JSON.parse(raw); } catch { return {}; }
}
