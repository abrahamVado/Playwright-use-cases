import { test, expect, FrameLocator } from '@playwright/test';

/**
 * ===================================================================
 *  IFAME NAVIGATION – FULL EXAMPLE WITH HAPPY PATH + FAILURE PATHS
 * ===================================================================
 * This file demonstrates:
 *   1. A successful end-to-end interaction inside an iframe (happy path)
 *   2. A front-end validation failure scenario
 *   3. A back-end/server failure scenario (simulated)
 * 
 * Why this matters:
 *   - Iframes are notorious for causing flaky tests if you don’t handle
 *     readiness states, different origins, or delayed rendering properly.
 *   - By pairing happy path and failure path tests, you ensure that your
 *     app gracefully handles both success and failure cases.
 *   - These examples also show how to use Playwright’s routing and
 *     assertion APIs to validate user experience, not just DOM states.
 * 
 * Recommended usage:
 *   - Replace `#editor-iframe`, `data-test="..."` selectors, and URLs
 *     with your actual application values.
 *   - Keep failure-path tests in CI to prevent regressions in error handling.
 */

// ================================================================
//  1. HAPPY PATH – User fills the form inside an iframe and saves
// ================================================================
test('fill and save inside an iframe (happy path)', async ({ page }) => {
  // Step 1: Go to the page containing the iframe
  await page.goto('/page-with-iframe'); // Example: /editor or /checkout

  // Step 2: Grab a FrameLocator for the iframe by its selector
  const frame = page.frameLocator('#editor-iframe');

  // Step 3: Wait until the iframe signals it's ready
  await waitForFrameReady(frame);

  // Step 4: Fill the "title" input INSIDE the iframe
  await frame.locator('[data-test="title"]').fill('Hello from Playwright');

  // Step 5: Click the save button inside the iframe
  await frame.locator('[data-test="save-btn"]').click();

  // Step 6: Assert that the iframe shows a "success" toast
  await expect(frame.locator('[data-test="toast-success"]')).toHaveText(/saved/i);
});

// ====================================================================
//  2. FAILURE PATH – Validation error if user tries to save without title
// ====================================================================
test('shows validation error when saving without title', async ({ page }) => {
  await page.goto('/page-with-iframe');

  const frame = page.frameLocator('#editor-iframe');
  await waitForFrameReady(frame);

  // Intentionally NOT filling the title field to trigger validation error
  await frame.locator('[data-test="save-btn"]').click();

  // Expect a specific validation message inside the iframe
  await expect(frame.locator('[data-test="error-title-required"]')).toBeVisible();
  
  // Optional: also check for a toast or banner error message
  await expect(frame.locator('[data-test="toast-error"]')).toContainText(/required|title/i);
});

// ===================================================================
//  3. FAILURE PATH – Backend error (forced 500 response to save request)
// ===================================================================
test('surfaces error toast when backend save fails (500)', async ({ page }) => {
  // Step 1: Intercept the network call to the save API and respond with a 500
  await page.route('**/api/iframe/save', async (route) => {
    await route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal Error (forced in test)' }),
    });
  });

  // Step 2: Navigate to the page with the iframe
  await page.goto('/page-with-iframe');

  // Step 3: Wait until iframe is ready
  const frame = page.frameLocator('#editor-iframe');
  await waitForFrameReady(frame);

  // Step 4: Fill the title to avoid front-end validation error
  await frame.locator('[data-test="title"]').fill('This will fail on purpose');

  // Step 5: Click save – backend will respond with 500 because of the route above
  await frame.locator('[data-test="save-btn"]').click();

  // Step 6: Assert that a user-friendly error toast is visible
  await expect(frame.locator('[data-test="toast-error"]')).toBeVisible();

  // Step 7: Check that the toast contains relevant text (error, failed, retry, etc.)
  await expect(frame.locator('[data-test="toast-error"]')).toContainText(/error|failed|retry/i);
});

// ===================================================================
//  Helper: Wait for the iframe to be "ready" before interacting
// ===================================================================
async function waitForFrameReady(
  frame: FrameLocator,
  selector = '[data-test="iframe-ready"]',
  timeout = 5000
) {
  try {
    await frame.locator(selector).waitFor({ state: 'visible', timeout });
  } catch (err) {
    // Adding more context helps debug flakiness and selector issues
    throw new Error(
      `❌ Iframe never reported ready via selector "${selector}" within ${timeout}ms.\n` +
      `💡 Debug tips:\n` +
      `  - Ensure the selector exists *inside* the iframe's DOM.\n` +
      `  - Check that the iframe's "src" is same-origin so Playwright can access it.\n` +
      `  - If using a loader/spinner, wait for it to disappear before interacting.`
    );
  }
}
