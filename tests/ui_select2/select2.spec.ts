import { test, expect } from '@playwright/test';

test.describe('@ui @select2', () => {
  test('Select2 single select via search', async ({ page }) => {
    await page.goto('/users/new');
    const s2 = page.locator('.select2-container').first();
    await s2.click();
    await page.locator('.select2-search__field').fill('mex');
    await page.getByRole('option', { name: /Mexico/i }).click();
    await expect(s2).toContainText('Mexico');
  });

  test('Select2 multi select + clear', async ({ page }) => {
    await page.goto('/users/new');
    const multi = page.locator('#roles + .select2');
    await multi.click();
    await page.locator('.select2-search__field').fill('Admin');
    await page.getByRole('option', { name: /Admin/i }).click();
    await multi.click();
    await page.locator('.select2-search__field').fill('Editor');
    await page.getByRole('option', { name: /Editor/i }).click();
    await expect(multi).toContainText(/Admin.*Editor/);
    await multi.locator('.select2-selection__choice__remove').first().click();
    await expect(multi).not.toContainText('Admin');
  });
});
