import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"
import sharp from "sharp"

test("homepage presents the portfolio without accessibility violations", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Hey, I'm Aser.",
    }),
  ).toBeVisible()
  await expect(page.getByRole("heading", { name: "WHOISleuth" })).toBeVisible()
  await expect(page.locator("#main-content")).toBeVisible()
  await expect(page).toHaveTitle("Aser - Software Engineer | slicedearth")

  const pageWidth = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }))
  expect(pageWidth.content).toBeLessThanOrEqual(pageWidth.viewport)

  await page.evaluate(async () => {
    await Promise.all(
      document
        .getAnimations()
        .filter(animation => animation.playState === "running")
        .map(animation => animation.finished),
    )
  })
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})

test("hero selects an appropriate presentation for each viewport", async ({
  page,
}, testInfo) => {
  const requestedAssets: string[] = []
  page.on("request", request => requestedAssets.push(request.url()))

  await page.goto("/")

  const earth = page.locator("[data-sliced-earth]")
  const canvas = earth.locator("[data-earth-canvas]")
  const terrain = page.locator("[data-hero-image]")
  await expect
    .poll(
      () =>
        terrain.evaluate(image =>
          image instanceof HTMLImageElement ? image.naturalWidth : 0,
        ),
      { timeout: 10_000 },
    )
    .toBeGreaterThan(0)

  expect(requestedAssets.some(asset => asset.endsWith(".webm"))).toBe(false)
  await expect(terrain).toHaveAttribute("loading", "eager")
  await expect(terrain).toHaveAttribute("fetchpriority", "high")

  if (testInfo.project.name === "desktop") {
    await expect(earth).toHaveAttribute("data-earth-ready", "true", {
      timeout: 10_000,
    })
    await expect(canvas).toHaveCSS("opacity", "1")

    const dimensions = await canvas.evaluate(element => {
      const canvasElement = element as HTMLCanvasElement
      return {
        backingHeight: canvasElement.height,
        backingWidth: canvasElement.width,
        cssHeight: canvasElement.clientHeight,
        cssWidth: canvasElement.clientWidth,
      }
    })
    expect(dimensions.backingWidth).toBeGreaterThanOrEqual(
      dimensions.cssWidth * 1.49,
    )
    expect(dimensions.backingHeight).toBeGreaterThanOrEqual(
      dimensions.cssHeight * 1.49,
    )

    const canvasBounds = await canvas.boundingBox()
    expect(canvasBounds).not.toBeNull()
    const canvasImage = await page.screenshot({ clip: canvasBounds! })
    const imageStats = await sharp(canvasImage).stats()
    expect(
      Math.max(...imageStats.channels.map(channel => channel.stdev)),
    ).toBeGreaterThan(8)
  } else {
    await page.waitForTimeout(1_200)
    await expect(earth).not.toHaveAttribute("data-earth-ready", "true")
    await expect(canvas).toHaveCSS("opacity", "0")
    expect(
      requestedAssets.some(asset => /sliced-earth-scene|three/i.test(asset)),
    ).toBe(false)
    expect((await terrain.screenshot()).length).toBeGreaterThan(5_000)
  }
})

test("featured project uses a static project image", async ({ page }) => {
  await page.route(/sliced-earth-scene/, route => route.abort())
  await page.goto("/#projects")

  await expect(page.locator("html")).toHaveAttribute(
    "data-reveal-motion",
    "ready",
  )
  const featuredProject = page
    .locator("[data-project-card]")
    .filter({ has: page.getByRole("heading", { name: "WHOISleuth" }) })
  await expect(featuredProject.locator("video")).toHaveCount(0)
  await expect(featuredProject.locator("img")).toHaveCSS("object-fit", "cover")
  await expect(featuredProject).toHaveAttribute("data-reveal-delay", "90")
  await expect(featuredProject).toHaveAttribute("data-reveal-state", "visible")
})

test("brand mark interaction reinforces the sliced layers", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Hover behaviour")

  await page.route(/sliced-earth-scene/, route => route.abort())
  await page.goto("/")

  const homeLink = page.getByRole("link", { name: "slicedearth home" })
  const topLayer = homeLink.locator('[data-brand-layer="top"]')
  await homeLink.hover()
  await expect
    .poll(() => topLayer.evaluate(layer => getComputedStyle(layer).transform))
    .not.toBe("none")
})

test("analytics queues immediately and loads remotely after interaction", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop",
    "Analytics behaviour runs once",
  )

  await page.route("https://www.googletagmanager.com/**", route =>
    route.abort(),
  )
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  await expect(page.locator("[data-google-analytics]")).toHaveCount(0)
  expect(
    await page.evaluate(
      () =>
        (
          window as typeof window & {
            dataLayer?: unknown[]
          }
        ).dataLayer?.length ?? 0,
    ),
  ).toBeGreaterThanOrEqual(2)

  await page.keyboard.press("Tab")
  await expect(page.locator("[data-google-analytics]")).toHaveCount(1)
})

test("reduced motion retains the static hero", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Motion preference check")

  const requestedAssets: string[] = []
  page.on("request", request => requestedAssets.push(request.url()))
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.waitForTimeout(1_200)

  expect(
    requestedAssets.some(asset => /sliced-earth-scene|three/i.test(asset)),
  ).toBe(false)
  await expect(page.locator("[data-sliced-earth]")).not.toHaveAttribute(
    "data-earth-ready",
    "true",
  )
  await expect(page.locator("[data-earth-canvas]")).toHaveCSS("opacity", "0")
  await expect(page.locator("[data-reveal]").first()).toBeVisible()
})

test("mobile navigation keeps closed links out of view", async ({
  page,
}, testInfo) => {
  test.skip(
    !["mobile", "narrow-mobile"].includes(testInfo.project.name),
    "Mobile-only navigation check",
  )

  await page.goto("/")

  const menu = page.locator("[data-mobile-nav]")
  const toggle = menu.locator('summary[aria-label="Toggle navigation"]')
  const projectsLink = menu.getByRole("link", { name: "Projects" })

  await expect(menu).not.toHaveAttribute("open")
  await expect(projectsLink).not.toBeVisible()

  await toggle.click()
  await expect(menu).toHaveAttribute("open", "")
  await expect(projectsLink).toBeVisible()

  await page.evaluate(async () => {
    await Promise.all(
      document
        .getAnimations()
        .filter(animation => animation.playState === "running")
        .map(animation => animation.finished),
    )
  })
  const openMenuResults = await new AxeBuilder({ page }).analyze()
  expect(openMenuResults.violations).toEqual([])

  await projectsLink.click()
  await expect(menu).not.toHaveAttribute("open")
})

test("404 pages are excluded from indexing", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Metadata check runs once")

  const response = await page.goto("/definitely-not-a-real-page")

  expect(response?.status()).toBe(404)
  await expect(page.getByRole("heading", { name: "404" })).toBeVisible()
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, nofollow",
  )
})
