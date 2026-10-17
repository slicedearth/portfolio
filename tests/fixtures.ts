import { test as base, expect } from "@playwright/test"

export const analyticsEnabled = process.env.PORTFOLIO_ANALYTICS_MODE !== "off"
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route(
      /^https:\/\/(?:[^/]+\.)?(?:googletagmanager|google-analytics|analytics\.google)\.com\//,
      route =>
        route.fulfill({
          status: 200,
          contentType: "text/javascript",
          body: "",
        }),
    )
    await use(page)
  },
})
export { expect }
