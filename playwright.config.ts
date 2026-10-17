import { defineConfig } from "@playwright/test"

const port = Number(process.env.PORTFOLIO_TEST_PORT ?? 4322)
const baseURL = `http://127.0.0.1:${port}`
const outDir =
  process.env.PORTFOLIO_ANALYTICS_MODE === "off"
    ? ".astro/analytics-off"
    : "dist"

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: "line",
  workers: 1,
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  webServer: {
    // Keep the preview process owned by the test runner, including automatic cleanup.
    env: { ASTRO_PREVIEW_BACKGROUND: "1" },
    command: `npm run preview -- --host 127.0.0.1 --port ${port} --outDir ${outDir}`,
    url: baseURL,
    reuseExistingServer: false,
    timeout: 30_000,
  },
  projects: [
    {
      name: "desktop",
      testMatch: /(?:portfolio|hero|analytics)\.spec\.ts/,
      use: {
        browserName: "chromium",
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "tablet",
      testMatch: /portfolio\.spec\.ts/,
      use: {
        browserName: "chromium",
        viewport: { width: 820, height: 1180 },
        hasTouch: true,
      },
    },
    {
      name: "mobile",
      testMatch: /portfolio\.spec\.ts/,
      use: {
        browserName: "chromium",
        viewport: { width: 390, height: 844 },
        hasTouch: true,
        isMobile: true,
      },
    },
    {
      name: "narrow-mobile",
      testMatch: /portfolio\.spec\.ts/,
      use: {
        browserName: "chromium",
        viewport: { width: 320, height: 800 },
        hasTouch: true,
        isMobile: true,
      },
    },
    {
      name: "firefox-desktop",
      testMatch: /cross-browser\.spec\.ts/,
      use: {
        browserName: "firefox",
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "webkit-mobile",
      testMatch: /cross-browser\.spec\.ts/,
      use: {
        browserName: "webkit",
        viewport: { width: 390, height: 844 },
        hasTouch: true,
        isMobile: true,
      },
    },
  ],
})
