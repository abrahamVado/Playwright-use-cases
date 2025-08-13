import { test, expect } from '@playwright/test';

test.describe('@api', () => {
  test('GET /api/orders returns paginated list', async ({ request }) => {
    const res = await request.get('/api/orders?limit=5&page=1');
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(Array.isArray(json.items)).toBe(true);
    expect(json.items.length).toBeLessThanOrEqual(5);
    expect(json).toMatchObject({ page: 1 });
  });

  test('POST /api/orders validates payload and creates resource', async ({ request }) => {
    const payload = { customerId: 123, items: [{ sku: 'ABC', qty: 2 }] };
    const res = await request.post('/api/orders', { data: payload });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body).toEqual(expect.objectContaining({
      id: expect.any(String),
      status: 'created',
      total: expect.any(Number),
    }));
  });

  test('handles 429 with Retry-After', async ({ request }) => {
    const res = await request.get('/api/ratelimited');
    if (res.status() === 429) {
      const retry = Number(res.headers()['retry-after'] ?? '1');
      await new Promise(r => setTimeout(r, retry * 1000));
      const res2 = await request.get('/api/ratelimited');
      expect(res2.ok()).toBeTruthy();
    } else {
      expect(res.ok()).toBeTruthy();
    }
  });
});
