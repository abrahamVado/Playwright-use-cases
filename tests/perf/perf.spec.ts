import { test, expect } from '@playwright/test';

test.describe('@perf', () => {
  test('homepage loads within budget', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(3000);
  });
});
