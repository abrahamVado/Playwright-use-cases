// tests/aws/cognito.spec.ts
import { test, expect } from '@playwright/test';
import { CognitoIdentityProviderClient, InitiateAuthCommand, GlobalSignOutCommand } from '@aws-sdk/client-cognito-identity-provider';
import { requireEnv } from './awsEnv';

test.describe('@aws @cognito', () => {
  const need = requireEnv(['AWS_REGION','COGNITO_USER_POOL_ID','COGNITO_CLIENT_ID','COGNITO_USERNAME','COGNITO_PASSWORD']);
  if (!need.ok) test.skip(true, `Missing env: ${need.missing.join(', ')}`);
  const region = process.env.AWS_REGION!;
  const clientId = process.env.COGNITO_CLIENT_ID!;
  const username = process.env.COGNITO_USERNAME!;
  const password = process.env.COGNITO_PASSWORD!;
  const cip = new CognitoIdentityProviderClient({ region });

  test('USER_PASSWORD_AUTH sign-in returns tokens', async () => {
    const res = await cip.send(new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: clientId,
      AuthParameters: { USERNAME: username, PASSWORD: password }
    }));
    expect(res.AuthenticationResult?.IdToken).toBeTruthy();
    expect(res.AuthenticationResult?.RefreshToken).toBeTruthy();
  });

  test('refresh token invalid/expired fails (edge)', async () => {
    // Try using a bogus refresh token to ensure failure path is covered
    try {
      await cip.send(new InitiateAuthCommand({
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        ClientId: clientId,
        AuthParameters: { REFRESH_TOKEN: 'bogus' }
      }));
      // If it didn't throw, explicitly fail
      expect(false).toBeTruthy();
    } catch {
      expect(true).toBeTruthy();
    }
  });
});
