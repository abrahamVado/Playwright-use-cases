import { test, expect } from '@playwright/test';

test.describe('@storage @pwa | Quotas, SW, cache busting', () => {
  test('gracefully handles IndexedDB upgrade failure', async ({ page }) => {
    await page.addInitScript(() => {
      const _open = indexedDB.open as any;
      indexedDB.open = function(name: string, version?: number) {
        const req = _open.call(this, name, version);
        setTimeout(() => req.onerror?.({ target: { error: new Error('upgrade fail') } }), 0);
        return req;
      } as any;
    });
    await page.goto('/app');
    await expect(page.getByText(/falling back to memory cache/i)).toBeVisible();
  });

  test('clears old SW cache on version bump', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/updated to v2/i)).toBeVisible();
  });
});
