import { test, expect } from '@playwright/test';

test.describe('@sec-headers', () => {
  test('CSP header present', async ({ request }) => {
    const res = await request.get('/');
    expect(res.headers()).toHaveProperty('content-security-policy');
  });
});
