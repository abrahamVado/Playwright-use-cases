import { test, expect } from '@playwright/test';

// Freeze Date.now for deterministic UI logic
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const fixed = new Date('2028-02-29T23:59:55Z').valueOf();
    // @ts-ignore
    Date.now = () => fixed;
  });
});

test.describe('@time | Leap year, DST, EOM', () => {
  test('end-of-month rollover works', async ({ page }) => {
    await page.goto('/billing');
    await expect(page.getByText(/next charge/i)).toContainText('Mar 31');
  });

  test('token not yet valid due to clock skew', async ({ page, context }) => {
    let tries = 0;
    await context.route('**/api/profile', route => {
      tries++;
      if (tries === 1) return route.fulfill({ status: 401, headers: { 'www-authenticate': 'clock-skew' } });
      return route.fulfill({ status: 200, body: JSON.stringify({ name: 'Abraham' }) });
    });
    await page.goto('/dashboard');
    await expect(page.getByText('Abraham')).toBeVisible();
  });
});
