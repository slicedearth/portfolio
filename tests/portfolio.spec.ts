import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "./fixtures"
import { readFileSync } from "node:fs"

const projects = JSON.parse(
  readFileSync(
    new URL("../src/content/projects/projects.json", import.meta.url),
    "utf8",
  ),
) as Array<{ title: string }>

test("homepage presents the portfolio without accessibility violations", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  await expect(page.getByRole("heading", { name: "WHOISleuth" })).toBeVisible()
  const projectHeadings = page.locator("[data-project-card] h3")
  await expect(projectHeadings).toHaveText(
    projects.map(project => project.title),
  )
  await expect(page.locator("#main-content")).toBeVisible()

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
  test.setTimeout(testInfo.project.name === "desktop" ? 60_000 : 30_000)
  const requestedAssets: string[] = []
  page.on("request", request => requestedAssets.push(request.url()))
  await page.addInitScript(() => {
    const states: string[] = []
    Object.defineProperty(window, "__earthMotionStates", { value: states })

    document.addEventListener("DOMContentLoaded", () => {
      const earth = document.querySelector<HTMLElement>("[data-sliced-earth]")
      if (!earth) return

      const recordState = () => {
        const state = earth.dataset.earthMotion
        if (state && states.at(-1) !== state) states.push(state)
      }
      recordState()
      new MutationObserver(recordState).observe(earth, {
        attributeFilter: ["data-earth-motion"],
      })
    })
  })

  await page.goto("/")

  const earth = page.locator("[data-sliced-earth]")
  const canvas = earth.locator("[data-earth-canvas]")
  const terrain = page.locator("[data-hero-image]")

  expect(requestedAssets.some(asset => asset.endsWith(".webm"))).toBe(false)
  expect(
    requestedAssets.some(asset => asset.includes("hero-slicedearth")),
  ).toBe(true)
  await expect(terrain).toHaveAttribute("loading", "eager")
  await expect(terrain).toHaveAttribute("fetchpriority", "high")

  if (testInfo.project.name === "desktop") {
    await expect(earth).toHaveAttribute("data-earth-ready", "true", {
      timeout: 10_000,
    })
    await expect(earth).toHaveAttribute("data-earth-handoff", "complete", {
      timeout: 3_000,
    })
    await expect(earth).toHaveAttribute("data-earth-motion", "running", {
      timeout: 3_000,
    })
    await expect(canvas).toHaveCSS("opacity", "1")
    await expect(canvas).toHaveCSS("transition-duration", "0s")
    await expect(terrain).toHaveCSS("opacity", "0")
    await expect(terrain).toHaveCSS("transition-duration", "0s")

    const motionStates = await page.evaluate(
      () =>
        (
          window as typeof window & {
            __earthMotionStates?: string[]
          }
        ).__earthMotionStates ?? [],
    )
    expect(motionStates).toContain("paused")
    expect(motionStates.indexOf("paused")).toBeLessThan(
      motionStates.indexOf("running"),
    )

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
      dimensions.cssWidth * 0.74,
    )
    expect(dimensions.backingHeight).toBeGreaterThanOrEqual(
      dimensions.cssHeight * 0.74,
    )
    expect(dimensions.backingWidth).toBeLessThanOrEqual(
      dimensions.cssWidth * 1.51,
    )
    expect(dimensions.backingHeight).toBeLessThanOrEqual(
      dimensions.cssHeight * 1.51,
    )
  } else {
    await terrain.evaluate(async element => {
      if (!(element instanceof HTMLImageElement)) {
        throw new Error("Hero poster is not an image element")
      }
      if (!element.complete || element.naturalWidth === 0)
        await element.decode()
    })
    expect(
      await terrain.evaluate(image =>
        image instanceof HTMLImageElement ? image.naturalWidth : 0,
      ),
    ).toBeGreaterThan(0)
    await page.waitForTimeout(1_200)
    await expect(earth).not.toHaveAttribute("data-earth-ready", "true")
    await expect(earth).not.toHaveAttribute("data-earth-motion", "running")
    await expect(canvas).toHaveCSS("opacity", "0")
    await expect(page.locator("[data-earth-toggle]")).toBeHidden()
    expect(
      requestedAssets.some(asset => /sliced-earth-scene|three/i.test(asset)),
    ).toBe(false)
    expect((await terrain.screenshot()).length).toBeGreaterThan(5_000)
  }
})

test("large desktop layouts keep the page in proportion", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop",
    "Large viewport check runs once",
  )

  await page.emulateMedia({ reducedMotion: "reduce" })

  for (const viewport of [
    { width: 2560, height: 1440 },
    { width: 3840, height: 2160 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto("/")

    const layout = await page.evaluate(() => {
      const frame = document.querySelector<HTMLElement>(".site-frame")
      const hero = document.querySelector<HTMLElement>(".hero-shell")
      const projects = document.querySelector<HTMLElement>("#projects")
      const poster = document.querySelector<HTMLElement>("[data-hero-image]")
      const canvas = document.querySelector<HTMLElement>("[data-earth-canvas]")

      if (!frame || !hero || !projects || !poster || !canvas) {
        throw new Error("Large-screen layout elements are missing")
      }

      return {
        viewportWidth: document.documentElement.clientWidth,
        contentWidth: document.documentElement.scrollWidth,
        frame: frame.getBoundingClientRect().toJSON(),
        hero: hero.getBoundingClientRect().toJSON(),
        projects: projects.getBoundingClientRect().toJSON(),
        poster: poster.getBoundingClientRect().toJSON(),
        canvas: canvas.getBoundingClientRect().toJSON(),
      }
    })

    expect(layout.contentWidth).toBeLessThanOrEqual(layout.viewportWidth)
    expect(layout.frame.width).toBeGreaterThanOrEqual(viewport.width * 0.65)
    expect(layout.frame.width).toBeLessThanOrEqual(viewport.width * 0.76)
    expect(layout.frame.left).toBeCloseTo(
      viewport.width - layout.frame.right,
      0,
    )
    expect(layout.hero.height).toBeLessThanOrEqual(viewport.height * 0.75)
    expect(layout.projects.top).toBeLessThan(viewport.height)
    expect(layout.poster).toEqual(layout.canvas)
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
  await expect(featuredProject).toHaveAttribute("data-reveal-state", "visible")
})

test("project screenshots remain fully visible across major viewports", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop",
    "Responsive image framing runs once",
  )

  await page.emulateMedia({ reducedMotion: "reduce" })

  for (const viewport of [
    { width: 320, height: 800 },
    { width: 390, height: 844 },
    { width: 639, height: 900 },
    { width: 640, height: 900 },
    { width: 768, height: 1024 },
    { width: 820, height: 1180 },
    { width: 1023, height: 900 },
    { width: 1024, height: 900 },
    { width: 1440, height: 900 },
    { width: 1536, height: 960 },
    { width: 1920, height: 1080 },
    { width: 2560, height: 1440 },
    { width: 3200, height: 1800 },
    { width: 3840, height: 2160 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto("/#projects")

    const alignment = await page.evaluate(() => {
      const navigation = document.querySelector('nav[aria-label="Primary"]')!
      const controls = Array.from(navigation.children).filter(
        element => element.getBoundingClientRect().width > 0,
      )
      return {
        frames: Array.from(document.querySelectorAll(".site-frame")).map(
          element => element.getBoundingClientRect().toJSON(),
        ),
        navigationLeft: controls[0].getBoundingClientRect().left,
        navigationRight: controls.at(-1)!.getBoundingClientRect().right,
      }
    })
    const contentFrame = alignment.frames[0]
    for (const frame of alignment.frames) {
      expect(frame.left).toBeCloseTo(contentFrame.left, 0)
      expect(frame.right).toBeCloseTo(contentFrame.right, 0)
    }
    expect(alignment.navigationLeft).toBeCloseTo(contentFrame.left, 0)
    expect(alignment.navigationRight).toBeCloseTo(contentFrame.right, 0)

    const projectImages = page.locator("[data-project-image]")
    await expect(projectImages).toHaveCount(projects.length)

    for (let index = 0; index < (await projectImages.count()); index += 1) {
      const projectImage = projectImages.nth(index)
      await projectImage.scrollIntoViewIfNeeded()
      await expect(projectImage).toBeVisible()
      await expect
        .poll(() =>
          projectImage.evaluate(image =>
            image instanceof HTMLImageElement ? image.naturalWidth : 0,
          ),
        )
        .toBeGreaterThan(0)
    }

    const imageStates = await projectImages.evaluateAll(images =>
      images.map(image => {
        const element = image as HTMLImageElement
        const bounds = element.getBoundingClientRect()
        const frameBounds = element.closest("figure")!.getBoundingClientRect()
        const card = element.closest<HTMLElement>("[data-project-card]")!
        const mediaBounds = element.closest("a")!.getBoundingClientRect()
        const contentBounds = card
          .querySelector("h3")!
          .parentElement!.getBoundingClientRect()

        return {
          complete: element.complete,
          naturalHeight: element.naturalHeight,
          naturalWidth: element.naturalWidth,
          bounds: bounds.toJSON(),
          frameBounds: frameBounds.toJSON(),
          variant: card.dataset.projectVariant,
          mediaBounds: mediaBounds.toJSON(),
          contentBounds: contentBounds.toJSON(),
        }
      }),
    )

    for (const image of imageStates) {
      expect(image.complete).toBe(true)
      expect(image.naturalWidth).toBeGreaterThan(0)
      expect(image.naturalHeight).toBeGreaterThan(0)
      // Responsive image candidates may round their intrinsic height by a pixel.
      const naturalHeight =
        (image.bounds.width * image.naturalHeight) / image.naturalWidth
      expect(Math.abs(image.bounds.height - naturalHeight)).toBeLessThanOrEqual(
        1,
      )
      for (const frame of [image.frameBounds, image.mediaBounds]) {
        expect(image.bounds.left).toBeGreaterThanOrEqual(frame.left - 1)
        expect(image.bounds.top).toBeGreaterThanOrEqual(frame.top - 1)
        expect(image.bounds.right).toBeLessThanOrEqual(frame.right + 1)
        expect(image.bounds.bottom).toBeLessThanOrEqual(frame.bottom + 1)
      }
      if (image.variant === "compact") {
        expect(image.mediaBounds.bottom).toBeLessThanOrEqual(
          image.contentBounds.top + 1,
        )
      }
    }

    const pageWidth = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      content: document.documentElement.scrollWidth,
    }))
    expect(pageWidth.content).toBeLessThanOrEqual(pageWidth.viewport)
  }
})

test("enlarged text keeps content and navigation usable", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Text reflow runs once")
  await page.emulateMedia({ reducedMotion: "reduce" })

  for (const viewport of [
    { width: 320, height: 800 },
    { width: 390, height: 844 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport)
    await page.goto("/")
    await page.evaluate(async () => {
      document.documentElement.style.fontSize = "200%"
      await document.fonts.ready
    })

    const layout = await page.evaluate(() => {
      const hero = document
        .querySelector(".hero-shell")!
        .getBoundingClientRect()
      return {
        viewport: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth,
        clippedText: Array.from(
          document.querySelectorAll("h1, h2, h3, p, a, li"),
        )
          .filter(
            element =>
              element.clientWidth &&
              element.scrollWidth > element.clientWidth + 1,
          )
          .map(element => element.textContent?.trim()),
        heroClips: Array.from(
          document.querySelectorAll(
            ".hero-title, .hero-shell p, .hero-shell a",
          ),
        ).some(element => {
          const bounds = element.getBoundingClientRect()
          return (
            bounds.left < hero.left ||
            bounds.right > hero.right ||
            bounds.bottom > hero.bottom
          )
        }),
      }
    })
    expect(layout.content).toBeLessThanOrEqual(layout.viewport)
    expect(layout.clippedText).toEqual([])
    expect(layout.heroClips).toBe(false)

    const menu = page.locator("[data-mobile-nav]")
    if (await menu.isVisible()) {
      await menu.locator("summary").focus()
      await page.keyboard.press("Enter")
      await expect(menu).toHaveAttribute("open")
      await page.keyboard.press("Tab")
      const destination = menu.getByRole("link").first()
      await expect(destination).toBeFocused()
      await page.keyboard.press("Enter")
      await expect(menu).not.toHaveAttribute("open")
    }
  }
})

test("portfolio content remains visible without JavaScript", async ({
  browser,
  baseURL,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Static rendering runs once")
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  })
  try {
    await context.route("**/*", route =>
      new URL(route.request().url()).origin === new URL(baseURL!).origin
        ? route.continue()
        : route.abort(),
    )
    const page = await context.newPage()
    await page.goto(baseURL!)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    for (const section of await page.locator("[data-reveal]").all()) {
      await expect(section).toHaveCSS("opacity", "1")
    }
  } finally {
    await context.close()
  }
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

test("reduced motion retains the static hero", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Motion preference check")

  const requestedAssets: string[] = []
  page.on("request", request => requestedAssets.push(request.url()))
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  const terrain = page.locator("[data-hero-image]")
  await terrain.evaluate(async element => {
    if (element instanceof HTMLImageElement) await element.decode()
  })
  await page.waitForTimeout(1_200)

  expect(
    requestedAssets.some(asset => /sliced-earth-scene|three/i.test(asset)),
  ).toBe(false)
  await expect(page.locator("[data-sliced-earth]")).not.toHaveAttribute(
    "data-earth-ready",
    "true",
  )
  await expect(page.locator("[data-earth-canvas]")).toHaveCSS("opacity", "0")
  expect(
    await terrain.evaluate(image =>
      image instanceof HTMLImageElement ? image.naturalWidth : 0,
    ),
  ).toBeGreaterThan(0)
  await expect(page.locator("[data-reveal]").first()).toBeVisible()
})

test("mobile navigation supports keyboard dismissal and link navigation", async ({
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

  await toggle.focus()
  await page.keyboard.press("Enter")
  await expect(menu).toHaveAttribute("open", "")
  await expect(projectsLink).toBeVisible()
  await page.keyboard.press("Tab")
  await expect(projectsLink).toBeFocused()
  await page.keyboard.press("Escape")
  await expect(menu).not.toHaveAttribute("open")
  await expect(toggle).toBeFocused()
  await page.keyboard.press("Enter")
  await expect(menu).toHaveAttribute("open")
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
  await expect
    .poll(() =>
      page
        .locator("#projects h2")
        .evaluate(element => element.getBoundingClientRect().top),
    )
    .toBeGreaterThan(72)
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

test("homepage metadata uses the primary domain", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "Metadata check runs once")

  await page.goto("/")

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://www.slicedearth.dev/",
  )
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
    "content",
    "https://www.slicedearth.dev/",
  )
  await expect(page.locator("html")).toHaveAttribute("lang", "en-AU")
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
    "content",
    "en_AU",
  )
  await expect(page.locator('meta[name="twitter:image:alt"]')).toHaveAttribute(
    "content",
    /slicedearth/,
  )

  const structuredData = JSON.parse(
    (await page.locator('script[type="application/ld+json"]').textContent()) ??
      "{}",
  ) as {
    "@graph"?: Array<{
      "@type"?: string
      itemListElement?: unknown[]
      numberOfItems?: number
      url?: string
    }>
  }
  const profilePage = structuredData["@graph"]?.find(
    item => item["@type"] === "ProfilePage",
  )
  const projectList = structuredData["@graph"]?.find(
    item => item["@type"] === "ItemList",
  )

  expect(profilePage?.url).toBe("https://www.slicedearth.dev/")
  expect(projectList?.numberOfItems).toBe(projects.length)
  expect(projectList?.itemListElement).toHaveLength(projects.length)
  const person = structuredData["@graph"]?.find(
    item => item["@type"] === "Person",
  )
  expect(person).not.toHaveProperty("jobTitle")
})

test("project actions have contextual accessible names and safe new-tab links", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop",
    "Shared link semantics run once",
  )
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/#projects")
  for (const project of projects) {
    const card = page.locator("[data-project-card]").filter({
      has: page.getByRole("heading", { name: project.title, exact: true }),
    })
    await expect(
      card.getByRole("link", {
        name: `Source code for ${project.title}`,
        exact: true,
      }),
    ).toBeVisible()
    for (const link of await card.getByRole("link").all()) {
      await expect(link).toHaveAttribute("target", "_blank")
      await expect(link).toHaveAttribute("rel", /noopener/)
      await expect(link).toHaveAttribute("rel", /noreferrer/)
      expect(await link.getAttribute("aria-label")).toContain(project.title)
      await expect(link).toHaveAccessibleDescription(/\S/)
    }
  }
})
