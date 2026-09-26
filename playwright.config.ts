import { defineConfig, devices } from "@playwright/test";

if (!process.env.DEV_URL) {
  throw new Error("DEV_URL must contain the deployed PR preview URL.");
}

export default defineConfig({
  testDir: "./tests/e2e",
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  webServer: process.env.PLAYWRIGHT_LOCAL_SERVER
    ? {
        command: "pnpm dev --hostname 127.0.0.1",
        url: process.env.DEV_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
  use: {
    ...devices["Desktop Chrome"],
    baseURL: process.env.DEV_URL,
    trace: "on-first-retry",
  },
});
