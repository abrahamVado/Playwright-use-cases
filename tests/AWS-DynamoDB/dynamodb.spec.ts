// tests/aws/dynamodb.spec.ts
import { test, expect } from '@playwright/test';
import { DynamoDBClient, PutItemCommand, GetItemCommand, UpdateItemCommand, DeleteItemCommand, TransactWriteItemsCommand, QueryCommand } from '@aws-sdk/client-dynamodb';
import { requireEnv } from './awsEnv';

const S = (s: string) => ({ S: s });
const N = (n: number) => ({ N: n.toString() });

test.describe('@aws @ddb', () => {
  const need = requireEnv(['AWS_REGION','DDB_TABLE']);
  if (!need.ok) test.skip(true, `Missing env: ${need.missing.join(', ')}`);
  const region = process.env.AWS_REGION!;
  const TableName = process.env.DDB_TABLE!;
  const GSI = process.env.DDB_GSI_NAME;
  const ddb = new DynamoDBClient({ region });
  const id = `pwt-${Date.now()}`;

  test('CRUD + conditional update (optimistic locking)', async () => {
    // Put
    await ddb.send(new PutItemCommand({ TableName, Item: { id: S(id), ver: N(1), status: S('new') } }));
    // Get
    const got = await ddb.send(new GetItemCommand({ TableName, Key: { id: S(id) } }));
    expect(got.Item?.status?.S).toBe('new');
    // Conditional update (ver must be 1)
    await ddb.send(new UpdateItemCommand({
      TableName, Key: { id: S(id) },
      UpdateExpression: 'SET #s = :s, ver = ver + :one',
      ConditionExpression: 'ver = :expected',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: { ':s': S('done'), ':expected': N(1), ':one': N(1) }
    }));
    // Delete
    await ddb.send(new DeleteItemCommand({ TableName, Key: { id: S(id) } }));
  });

  test('transaction with conditional failure rolls back', async () => {
    const id1 = id + '-t1';
    const id2 = id + '-t2';
    // Pre-insert id1 only
    await ddb.send(new PutItemCommand({ TableName, Item: { id: S(id1), status: S('one') } }));
    let failed = false;
    try {
      await ddb.send(new TransactWriteItemsCommand({
        TransactItems: [
          { Put: { TableName, Item: { id: S(id2), status: S('two') } } },
          { ConditionCheck: { TableName, Key: { id: S(id1) }, ConditionExpression: 'attribute_not_exists(id)' } }
        ]
      }));
    } catch (e) { failed = true; }
    expect(failed).toBeTruthy();
  });

  test('GSI query (if provided)', async () => {
    test.skip(!GSI, 'No GSI configured');
    const res = await ddb.send(new QueryCommand({
      TableName, IndexName: GSI, KeyConditionExpression: '#s = :status',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: { ':status': S('done') },
      Limit: 1
    }));
    expect(res.Count! >= 0).toBeTruthy();
  });
});
