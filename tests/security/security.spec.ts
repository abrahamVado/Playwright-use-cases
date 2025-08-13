import { test, expect } from '@playwright/test';

test.describe('@security | CSP, mixed content, cookies', () => {
  test('refuses mixed content image', async ({ page, context }) => {
    await context.route('**/product/**', route => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ name: 'Thing', image: 'http://insecure.example.com/x.png' })
    }));
    await page.goto('/product/123');
    await expect(page.getByText(/blocked insecure image/i)).toBeVisible();
  });
});
