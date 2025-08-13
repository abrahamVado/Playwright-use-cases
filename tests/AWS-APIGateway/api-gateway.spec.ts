// tests/aws/api-gateway.spec.ts
import { test, expect } from '@playwright/test';
import { requireEnv } from './awsEnv';

test.describe('@aws @apigw', () => {
  const need = requireEnv(['API_URL']);
  if (!need.ok) test.skip(true, `Missing env: ${need.missing.join(', ')}`);
  const base = process.env.API_URL!;

  test('health responds with JSON schema-ish shape', async ({ request }) => {
    const res = await request.get(base + '/status');
    expect(res.ok()).toBeTruthy();
    const json = await res.json();
    expect(json).toHaveProperty('uptime');
    expect(json).toHaveProperty('version');
  });

  test('rate limit 429 respected with Retry-After', async ({ request }) => {
    const res = await request.get(base + '/ratelimited');
    if (res.status() === 429) {
      const retry = Number(res.headers()['retry-after'] ?? '1');
      await new Promise(r => setTimeout(r, retry * 1000));
      const res2 = await request.get(base + '/ratelimited');
      expect(res2.ok()).toBeTruthy();
    } else {
      expect([200, 204]).toContain(res.status());
    }
  });

  test('CORS headers present', async ({ request }) => {
    const res = await request.get(base + '/status', { headers: { origin: 'https://example.com' } });
    const h = res.headers();
    expect(h['access-control-allow-origin'] === '*' || h['access-control-allow-origin'] === 'https://example.com').toBeTruthy();
  });
});
