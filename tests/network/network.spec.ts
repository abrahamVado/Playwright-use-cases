import { test, expect } from '@playwright/test';
import { setSlow3G, goOffline, hugeJSON } from '../utils/network';

test.describe('@network | Network & performance edges', () => {
  test('handles retryable 500s on slow network', async ({ page, context }) => {
    await setSlow3G(context);
    let first = true;
    await context.route('**/api/orders', route => {
      if (first) { first = false; return route.fulfill({ status: 500, body: JSON.stringify({ error: 'boom' }) }); }
      return route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
    });
    await page.goto('/orders');
    await expect(page.getByText(/retry/i)).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
  });

  test('renders huge payload without freezing UI', async ({ page, context }) => {
    await context.route('**/api/feed', route => route.fulfill({
      status: 200, contentType: 'application/json', body: hugeJSON(2048)
    }));
    await page.goto('/feed');
    await expect(page.getByText(/loaded/i)).toBeVisible();
  });

  test('offline mode shows fallback UI', async ({ page, context }) => {
    await goOffline(context);
    await page.goto('/');
    await expect(page.getByText(/you are offline/i)).toBeVisible();
    await context.setOffline(false);
  });
});
