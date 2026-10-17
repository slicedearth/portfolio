import { analyticsEnabled, expect, test } from "./fixtures"
import { readFileSync } from "node:fs"

const [project] = JSON.parse(
  readFileSync(
    new URL("../src/content/projects/projects.json", import.meta.url),
    "utf8",
  ),
) as Array<{ title: string; deployedURL: string }>

test("analytics is either absent or queues named outbound events using the fake build ID", async ({
  page,
}) => {
  const requests: string[] = []
  page.on("request", request => {
    if (new URL(request.url()).hostname !== "127.0.0.1")
      requests.push(request.url())
  })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/?fixture=local-only")
  if (!analyticsEnabled) {
    await expect(
      page.locator(
        'meta[name="google-analytics-id"], script[src="/analytics.js"]',
      ),
    ).toHaveCount(0)
    await page.keyboard.press("Tab")
    await page.waitForTimeout(4_100)
    expect(await page.evaluate(() => window.dataLayer)).toBeUndefined()
    expect(requests).toEqual([])
    return
  }
  await expect(
    page.locator('meta[name="google-analytics-id"]'),
  ).toHaveAttribute("content", "G-TEST000000")
  await expect(page.locator("[data-google-analytics]")).toHaveCount(0)
  await page.keyboard.press("Tab")
  await expect(page.locator("[data-google-analytics]")).toHaveCount(1)
  for (const selector of [
    '[data-analytics-type="project_website_link"]',
    '[data-analytics-type="github_profile_link"]',
  ]) {
    const link = page.locator(selector).first()
    await link.evaluate(element =>
      element.addEventListener("click", event => event.preventDefault(), {
        once: true,
      }),
    )
    await link.click()
  }
  const entries = await page.evaluate(() =>
    window.dataLayer?.map(entry => Array.from(entry)),
  )
  expect(entries).toEqual(
    expect.arrayContaining([
      [
        "event",
        "select_content",
        {
          content_type: "project_website_link",
          content_id: project.title,
          link_url: project.deployedURL,
        },
      ],
      [
        "event",
        "select_content",
        expect.objectContaining({
          content_type: "github_profile_link",
          content_id: "hero",
        }),
      ],
    ]),
  )
  expect(
    requests.every(
      url => url === "https://www.googletagmanager.com/gtag/js?id=G-TEST000000",
    ),
  ).toBe(true)
})

test("debug mode preserves the disabled advertising settings without loading real telemetry", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/?_dbg=fixture")
  if (!analyticsEnabled) {
    await expect(page.locator("[data-google-analytics]")).toHaveCount(0)
    expect(await page.evaluate(() => window.dataLayer)).toBeUndefined()
    return
  }
  await expect(page.locator("[data-google-analytics]")).toHaveCount(1)
  const config = await page.evaluate(() =>
    window.dataLayer
      ?.map(entry => Array.from(entry))
      .find(entry => entry[0] === "config"),
  )
  expect(config?.[1]).toBe("G-TEST000000")
  expect(config?.[2]).toMatchObject({
    allow_ad_personalization_signals: false,
    allow_google_signals: false,
    cookie_expires: 0,
    debug_mode: true,
  })
})
