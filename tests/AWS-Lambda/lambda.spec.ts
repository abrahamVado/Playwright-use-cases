// tests/aws/lambda.spec.ts
import { test, expect } from '@playwright/test';
import { LambdaClient, InvokeCommand } from '@aws-sdk/client-lambda';
import { requireEnv } from './awsEnv';

test.describe('@aws @lambda', () => {
  const need = requireEnv(['AWS_REGION','LAMBDA_FN']);
  if (!need.ok) test.skip(true, `Missing env: ${need.missing.join(', ')}`);
  const region = process.env.AWS_REGION!;
  const FunctionName = process.env.LAMBDA_FN!;
  const lambda = new LambdaClient({ region });

  test('invoke happy path', async () => {
    const res = await lambda.send(new InvokeCommand({
      FunctionName,
      Payload: Buffer.from(JSON.stringify({ ping: 'pong' })),
    }));
    expect(res.StatusCode && res.StatusCode >= 200 && res.StatusCode < 300).toBeTruthy();
  });

  test('invalid JSON payload returns handled error', async () => {
    const res = await lambda.send(new InvokeCommand({
      FunctionName,
      Payload: Buffer.from('{bad-json'),
    }));
    // Function should trap JSON.parse and return 200 with error field, or 4xx/5xx; accept either but assert non-empty payload
    expect(res.Payload?.length).toBeGreaterThan(0);
  });
});
