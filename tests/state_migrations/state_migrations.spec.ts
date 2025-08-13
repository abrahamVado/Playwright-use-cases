import { test, expect } from '@playwright/test';

test.describe('@state', () => {
  test('handles corrupted localStorage', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('appState', 'not-json'));
    await page.goto('/');
    await expect(page.getByText(/resetting state/i)).toBeVisible();
  });
});
