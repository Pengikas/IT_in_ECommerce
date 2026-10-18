import base from "./playwright.config";
import { defineConfig } from "@playwright/test";
export default defineConfig({
  ...base,
  testDir: "./tests/api",
  outputDir: "test-api-results",
  testIgnore: [],
  use: { ...base.use, baseURL: "http://127.0.0.1:5174" },
  webServer: {
    command: "npm run dev -- --mode api-test --host 0.0.0.0 --port 5174",
    url: "http://127.0.0.1:5174",
    reuseExistingServer: !process.env.CI,
  },
});
