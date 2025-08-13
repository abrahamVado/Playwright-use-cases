# Playwright Use Cases – Starter Examples

This repo contains four **battle-tested starter examples** your team can adapt:
1. Iframe Navigation
2. Select2 & Custom Dropdowns
3. File Uploads
4. API Endpoint Assertions

> These specs are **self-contained** and use generic selectors/URLs you should replace with your app’s values.
> Each file includes comments and a "GIF suggestion" so you can record a quick demo for your post.

## How to run
```bash
npm init -y
npm i -D @playwright/test
npx playwright install
# Run everything
npx playwright test
# Or run a single file
npx playwright test tests/01-iframes.spec.ts
```
