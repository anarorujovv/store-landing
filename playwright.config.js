import { defineConfig } from "@playwright/test";
const baseURL = process.env.SELLER_TEST_BASE_URL || "http://127.0.0.1:4173";
export default defineConfig({
  testDir: "./tests/ui",
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  outputDir: "./test-results",
  reporter: "list",
  use: {
    baseURL,
    viewport: { width: 1440, height: 1000 },
    launchOptions: {
      ...(process.env.CHROME_EXECUTABLE
        ? { executablePath: process.env.CHROME_EXECUTABLE }
        : process.platform === "darwin"
          ? {
              executablePath:
                "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            }
          : {}),
    },
    screenshot: "only-on-failure",
  },
  webServer: process.env.SELLER_TEST_BASE_URL
    ? undefined
    : {
        command: "npm run dev",
        url: "http://127.0.0.1:4173",
        reuseExistingServer: !process.env.CI,
      },
});
