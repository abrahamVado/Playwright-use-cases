import { test, expect } from '@playwright/test';

test.describe('@auth | Session refresh & multi-tab', () => {
  test('refresh token on 401 mid-request', async ({ page, context }) => {
    let first = true;
    await context.route('**/api/profile', route => {
      if (first) { first = false; return route.fulfill({ status: 401 }); }
      return route.fulfill({ status: 200, body: JSON.stringify({ name: 'Abraham' }) });
    });
    await page.goto('/dashboard');
    await expect(page.getByText('Abraham')).toBeVisible();
  });

  test('logout in one tab logs out others', async ({ context }) => {
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    await Promise.all([page1.goto('/account'), page2.goto('/account')]);
    await page1.getByRole('button', { name: /logout/i }).click();
    await expect(page2.getByText(/session ended/i)).toBeVisible();
  });
});
