import { test, expect } from '@playwright/test';

test.describe('@forms', () => {
  test('client + server validation errors', async ({ page, context }) => {
    await page.goto('/signup');
    await page.getByLabel('Email').fill('not-an-email');
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page.getByText(/invalid email/i)).toBeVisible();
    await context.route('**/api/signup', route => route.fulfill({
      status: 422, contentType: 'application/json',
      body: JSON.stringify({ errors: { email: ['already taken'] } }),
    }));
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('Secret123!');
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page.getByText(/already taken/i)).toBeVisible();
  });

  test('file upload rejects wrong MIME', async ({ page }) => {
    await page.goto('/profile');
    await page.setInputFiles('input[type="file"]', {
      name: 'script.exe', mimeType: 'application/x-msdownload', buffer: Buffer.from([0])
    } as any);
    await expect(page.getByText(/unsupported file type/i)).toBeVisible();
  });
});
