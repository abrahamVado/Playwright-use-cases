import { test, expect } from '@playwright/test';

test.describe('@ui | Focus, iframe, drag-drop', () => {
  test('handles slow payment iframe', async ({ page, context }) => {
    await context.route('**/payment-iframe', async route => {
      await new Promise(r => setTimeout(r, 3000));
      return route.continue();
    });
    await page.goto('/checkout');
    await expect(page.getByText(/loading payment/i)).toBeVisible();
    await expect(page.frameLocator('#payment').getByRole('textbox')).toBeVisible();
  });

  test('drag-and-drop works', async ({ page }) => {
    await page.goto('/board');
    const src = page.getByTestId('card-1');
    const dst = page.getByTestId('column-done');
    await src.dragTo(dst);
    await expect(page.getByTestId('column-done').getByTestId('card-1')).toBeVisible();
  });
});
