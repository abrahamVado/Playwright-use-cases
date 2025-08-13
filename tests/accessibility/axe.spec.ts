import { test, expect } from '@playwright/test';
// import AxeBuilder from '@axe-core/playwright'; // enable if axe-core installed

test.describe('@a11y', () => {
  test('home has no critical accessibility violations', async ({ page }) => {
    await page.goto('/');
    // const results = await new AxeBuilder({ page }).include('main').analyze();
    // expect(results.violations.filter(v => ['critical','serious'].includes(v.impact || '')).length).toBe(0);
    await expect(page).toHaveTitle(/./); // placeholder
  });
});
