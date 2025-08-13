// tests/aws/cloudfront.spec.ts
import { test, expect } from '@playwright/test';
import { requireEnv } from './awsEnv';
import { CloudFrontClient, CreateInvalidationCommand } from '@aws-sdk/client-cloudfront';

test.describe('@aws @cf', () => {
  const hasUrl = requireEnv(['CF_PUBLIC_URL']);
  if (!hasUrl.ok) test.skip(true, `Missing env: ${hasUrl.missing.join(', ')}`);

  test('serves with cache and via HTTPS', async ({ request }) => {
    const url = process.env.CF_PUBLIC_URL!;
    const res = await request.get(url);
    expect(res.ok()).toBeTruthy();
    const h = res.headers();
    expect(h['x-cache']).toBeTruthy();
    expect(h['cache-control']).toBeTruthy();
    expect(url.startsWith('https://')).toBeTruthy();
  });

  test('optional: invalidation works', async () => {
    const need = requireEnv(['AWS_REGION','CF_DISTRIBUTION_ID']);
    test.skip(!need.ok, `Missing env: ${need.missing.join(', ')}`);
    const region = process.env.AWS_REGION!;
    const id = process.env.CF_DISTRIBUTION_ID!;
    const cf = new CloudFrontClient({ region });
    const callerRef = 'pwt-' + Date.now();
    const out = await cf.send(new CreateInvalidationCommand({
      DistributionId: id,
      InvalidationBatch: { CallerReference: callerRef, Paths: { Quantity: 1, Items: ['/*'] } }
    }));
    expect(out.Invalidation?.Id).toBeTruthy();
  });
});
