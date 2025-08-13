import type { BrowserContext } from '@playwright/test';

export async function setSlow3G(context: BrowserContext) {
  await context.route('**/*', async route => {
    const delay = 400 + Math.random() * 800; // ~slow 3G latency
    await new Promise(r => setTimeout(r, delay));
    return route.continue();
  });
}

export async function goOffline(context: BrowserContext) {
  await context.setOffline(true);
}

export function hugeJSON(sizeKB = 1024) {
  const s = 'x'.repeat(1024);
  return JSON.stringify({ blob: s.repeat(sizeKB) });
}

export function trickyString() {
  return '\u200F' + '👩🏽‍🚀' + ' ' + '𝟘𝟙𝟚' + '<img onerror=alert(1)>' + 'مرحبا';
}
