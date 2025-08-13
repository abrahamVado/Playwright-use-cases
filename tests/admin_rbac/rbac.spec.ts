import { test, expect } from '@playwright/test';

test.describe('@rbac', () => {
  test('admin sees settings link', async ({ page }) => {
    await page.goto('/dashboard?role=admin');
    await expect(page.getByRole('link', { name: /settings/i })).toBeVisible();
  });
  test('user cannot access settings page', async ({ page }) => {
    await page.goto('/settings?role=user');
    await expect(page.getByText(/403|forbidden/i)).toBeVisible();
  });
});
