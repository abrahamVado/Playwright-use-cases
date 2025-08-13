import { test, expect } from '@playwright/test';

/**
 * Select2 & Custom Dropdowns – starter example
 * Works for Select2 and similar custom selects (async lists, search, multi-select).
 * GIF suggestion: record opening the dropdown, typing, and selecting a value.
 */
test('select a value in Select2', async ({ page }) => {
  await page.goto('/page-with-select2'); // e.g. /users/new

  // Open the Select2 widget
  await page.locator('.select2-selection').first().click();

  // Type into the search box
  const query = 'Mexico';
  await page.locator('.select2-search__field').fill(query);

  // Wait for async results and choose by visible text
  const option = page.locator('.select2-results__option', { hasText: query });
  await expect(option).toBeVisible();
  await option.click();

  // Assertion: selection visible in the "selection rendered" area
  await expect(page.locator('.select2-selection__rendered')).toContainText(query);
});

// Multi-select helper pattern (inline for readability)
async function select2Choose(page, text: string) {
  await page.locator('.select2-selection').click();
  await page.locator('.select2-search__field').fill(text);
  await page.locator('.select2-results__option', { hasText: text }).click();
}
