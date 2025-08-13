import { test, expect } from '@playwright/test';

test.describe('@ui @dropdown', () => {
  test('native <select> selects by value', async ({ page }) => {
    await page.goto('/settings');
    await page.getByLabel('Language').selectOption('es-MX');
    await expect(page.getByLabel('Language')).toHaveValue('es-MX');
  });

  test('custom dropdown filters + selects option', async ({ page }) => {
    await page.goto('/products');
    const dropdown = page.getByTestId('category-dropdown');
    await dropdown.click();
    await dropdown.getByRole('textbox').fill('Electr');
    await page.getByRole('option', { name: 'Electronics' }).click();
    await expect(dropdown).toHaveText(/Electronics/);
  });
});
