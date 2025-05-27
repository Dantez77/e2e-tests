// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    headless: true,
    browserName: 'chromium',
  },
  workers: 1,
  fullyParallel: false,
});
