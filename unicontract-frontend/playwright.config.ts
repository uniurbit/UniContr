import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests-e2e',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
  },
  // webServer: {
  //   command: 'npx ng serve',
  //   port: 4200,
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120000,
  // },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
