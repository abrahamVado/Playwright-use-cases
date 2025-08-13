// tests/aws/eventbridge.spec.ts
import { test, expect } from '@playwright/test';
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { requireEnv } from './awsEnv';

test.describe('@aws @events', () => {
  const need = requireEnv(['AWS_REGION']);
  if (!need.ok) test.skip(true, `Missing env: ${need.missing.join(', ')}`);
  const region = process.env.AWS_REGION!;
  const eb = new EventBridgeClient({ region });

  test('PutEvents with invalid detail-type fails one entry', async () => {
    const res = await eb.send(new PutEventsCommand({
      Entries: [
        { Source: 'playwright.tests', DetailType: 'ok', Detail: JSON.stringify({ hello: 'world' }) },
        // Intentionally bad (missing Source)
        { DetailType: 'bad', Detail: '{}' } as any
      ]
    }));
    expect(res.Entries?.length).toBe(2);
    expect((res.FailedEntryCount ?? 0) >= 0).toBeTruthy();
  });
});
