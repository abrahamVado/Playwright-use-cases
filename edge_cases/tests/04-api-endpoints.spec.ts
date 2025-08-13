import { test, expect } from '@playwright/test';

// already have: "cart API payload OK"

// Validate both request headers and response status
test('cart API includes JSON header and gets 200', async ({ page }) => {
  await page.goto('/cart.html');

  const reqP = page.waitForRequest(r => r.url().includes('/api/cart') && r.method() === 'POST');
  const resP = page.waitForResponse(r => r.url().includes('/api/cart') && r.request().method() === 'POST');

  await page.locator('[data-test="add-to-cart"]').click();

  const req = await reqP;
  expect(req.headers()['content-type']).toContain('application/json');

  const res = await resP;
  expect(res.status()).toBe(200);
});

// (Nice for video) show that we can capture the payload and print it
test('cart API logs payload shape', async ({ page }) => {
  await page.goto('/cart.html');

  const reqP = page.waitForRequest(r => r.url().includes('/api/cart') && r.method() === 'POST');
  await page.locator('[data-test="add-to-cart"]').click();

  const req = await reqP;
  const payload = req.postDataJSON();
  console.log('Cart payload:', payload); // shows in test output
  expect(payload).toMatchObject({ productId: 123, quantity: 1 });
});
