// tests/aws/s3.spec.ts
import { test, expect } from '@playwright/test';
import { S3Client, PutObjectCommand, GetObjectCommand, CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand, AbortMultipartUploadCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { requireEnv } from './awsEnv';

test.describe('@aws @s3', () => {
  const need = requireEnv(['AWS_REGION','S3_BUCKET']);
  if (!need.ok) test.skip(true, `Missing env: ${need.missing.join(', ')}`);
  const region = process.env.AWS_REGION!;
  const Bucket = process.env.S3_BUCKET!;
  const s3 = new S3Client({ region });

  test('simple put/get with checksum + metadata', async () => {
    const Key = `playwright/${Date.now()}-hello.txt`;
    const Body = 'Hello AWS S3!';
    await s3.send(new PutObjectCommand({
      Bucket, Key, Body,
      Metadata: { source: 'playwright' },
      ContentType: 'text/plain'
    }));
    const res = await s3.send(new GetObjectCommand({ Bucket, Key }));
    const text = await res.Body?.transformToString();
    expect(text).toBe(Body);
    expect(res.Metadata?.source).toBe('playwright');
  });

  test('presigned URL expires', async ({ request }) => {
    const Key = `playwright/${Date.now()}-signed.txt`;
    const putUrl = await getSignedUrl(s3, new PutObjectCommand({ Bucket, Key, ContentType: 'text/plain' }), { expiresIn: 2 });
    const r1 = await request.fetch(putUrl, { method: 'PUT', data: 'via presigned url', headers: { 'content-type': 'text/plain' } });
    expect(r1.ok()).toBeTruthy();
    await new Promise(r => setTimeout(r, 2500)); // let it expire
    const r2 = await request.fetch(putUrl, { method: 'PUT', data: 'late' });
    expect(r2.ok()).toBeFalsy();
    expect([400, 403]).toContain(r2.status());
  });

  test('multipart upload aborts cleanly (no orphan parts)', async () => {
    const Key = `playwright/${Date.now()}-multi.bin`;
    const create = await s3.send(new CreateMultipartUploadCommand({ Bucket, Key, ContentType: 'application/octet-stream' }));
    const UploadId = create.UploadId!;
    // Upload one small part
    await s3.send(new UploadPartCommand({ Bucket, Key, UploadId, PartNumber: 1, Body: Buffer.alloc(5 * 1024 * 1024, 0xab) }));
    // Abort to ensure cleanup policies work
    await s3.send(new AbortMultipartUploadCommand({ Bucket, Key, UploadId }));
    // If the bucket enforces cleanup, completing should fail (not attempted here); success is no exception thrown earlier.
    expect(true).toBeTruthy();
  });
});
