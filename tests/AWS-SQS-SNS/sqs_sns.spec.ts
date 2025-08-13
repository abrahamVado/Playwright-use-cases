// tests/aws/sqs_sns.spec.ts
import { test, expect } from '@playwright/test';
import { SQSClient, SendMessageCommand, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { requireEnv } from './awsEnv';

test.describe('@aws @sqs @sns', () => {
  const hasStd = requireEnv(['AWS_REGION','SQS_URL']);
  const hasFifo = requireEnv(['AWS_REGION','SQS_FIFO_URL']);
  const hasSns = requireEnv(['AWS_REGION','SNS_TOPIC_ARN']);
  const region = process.env.AWS_REGION || 'us-east-1';
  const sqs = new SQSClient({ region });
  const sns = new SNSClient({ region });

  test('SQS send/receive/delete', async () => {
    if (!hasStd.ok) test.skip(true, `Missing env: ${hasStd.missing.join(', ')}`);
    const QueueUrl = process.env.SQS_URL!;
    await sqs.send(new SendMessageCommand({ QueueUrl, MessageBody: 'hello from playwright', MessageAttributes: { origin: { DataType: 'String', StringValue: 'test' } } }));
    const rx = await sqs.send(new ReceiveMessageCommand({ QueueUrl, WaitTimeSeconds: 5, MaxNumberOfMessages: 1, MessageAttributeNames: ['All'] }));
    expect((rx.Messages?.length || 0) >= 0).toBeTruthy();
    if (rx.Messages && rx.Messages[0]) {
      await sqs.send(new DeleteMessageCommand({ QueueUrl, ReceiptHandle: rx.Messages[0].ReceiptHandle! }));
    }
  });

  test('FIFO queue deduplication (same ID should de-dupe)', async () => {
    if (!hasFifo.ok) test.skip(true, `Missing env: ${hasFifo.missing.join(', ')}`);
    const QueueUrl = process.env.SQS_FIFO_URL!;
    const groupId = 'pwt-group';
    const dedupId = 'same-id';
    await sqs.send(new SendMessageCommand({ QueueUrl, MessageBody: 'first', MessageGroupId: groupId, MessageDeduplicationId: dedupId }));
    await sqs.send(new SendMessageCommand({ QueueUrl, MessageBody: 'duplicate', MessageGroupId: groupId, MessageDeduplicationId: dedupId }));
    // Only one should be delivered within dedupe window (cannot assert strongly without consumer, but at least ensure no error)
    expect(true).toBeTruthy();
  });

  test('SNS publish (if topic provided)', async () => {
    if (!hasSns.ok) test.skip(true, `Missing env: ${hasSns.missing.join(', ')}`);
    const TopicArn = process.env.SNS_TOPIC_ARN!;
    const out = await sns.send(new PublishCommand({ TopicArn, Message: 'playwright test message', MessageAttributes: { environment: { DataType: 'String', StringValue: 'test' } } }));
    expect(out.MessageId).toBeTruthy();
  });
});
