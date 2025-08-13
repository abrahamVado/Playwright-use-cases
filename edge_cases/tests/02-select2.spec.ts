import { test, expect } from '@playwright/test';

// already have: "select a value in Select2"

// Case-insensitive search works
test('select2 search is case-insensitive', async ({ page }) => {
  await page.goto('/page-with-select2.html');
  await page.locator('.select2-selection').click();

  await page.locator('.select2-search__field').fill('mexico'); // lower-case
  const option = page.locator('.select2-results__option', { hasText: 'Mexico' });
  await expect(option).toBeVisible();
  await option.click();

  await expect(page.locator('.select2-selection__rendered')).toContainText('Mexico');
});

// Change selection after one is already chosen
test('select2 can change selection', async ({ page }) => {
  await page.goto('/page-with-select2.html');

  await page.locator('.select2-selection').click();
  await page.locator('.select2-search__field').fill('Mexico');
  await page.locator('.select2-results__option', { hasText: 'Mexico' }).click();
  await expect(page.locator('.select2-selection__rendered')).toContainText('Mexico');

  // Open again and switch to Spain
  await page.locator('.select2-selection').click();
  await page.locator('.select2-search__field').fill('Spain');
  await page.locator('.select2-results__option', { hasText: 'Spain' }).click();

  await expect(page.locator('.select2-selection__rendered')).toContainText('Spain');
});

// Clicking outside closes dropdown
test('select2 closes on outside click', async ({ page }) => {
  await page.goto('/page-with-select2.html');

  await page.locator('.select2-selection').click();
  await expect(page.locator('.select2-dropdown')).toBeVisible();

  // Click outside (body)
  await page.click('body', { position: { x: 5, y: 5 } });
  await expect(page.locator('.select2-dropdown')).toBeHidden();
});
