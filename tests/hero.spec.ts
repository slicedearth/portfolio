import { expect, test } from "./fixtures"
import type { Page } from "@playwright/test"
import sharp from "sharp"

const earth = (page: Page) => page.locator("[data-sliced-earth]")

for (const failure of ["module", "webgl", "surface", "relief"]) {
  test(`optional globe falls back when ${failure} fails`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", error => errors.push(error.message))
    if (failure === "module")
      await page.route(/sliced-earth-scene.*\.js/, route => route.abort())
    if (failure === "surface" || failure === "relief")
      await page.route(new RegExp(`earth-${failure}.*\\.webp`), route =>
        route.abort(),
      )
    if (failure === "webgl")
      await page.addInitScript(() => {
        const original = HTMLCanvasElement.prototype.getContext
        Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
          value: function (
            this: HTMLCanvasElement,
            type: string,
            ...args: unknown[]
          ) {
            return type.startsWith("webgl")
              ? null
              : Reflect.apply(original, this, [type, ...args])
          },
        })
      })
    await page.goto("/")
    await expect(earth(page)).toHaveAttribute(
      "data-earth-motion",
      "unavailable",
    )
    await expect(earth(page)).toHaveAttribute("data-earth-handoff", "static")
    await expect(page.locator("[data-hero-image]")).toHaveCSS("opacity", "1")
    await page.getByRole("link", { name: "Explore projects" }).click()
    await expect(page).toHaveURL(/#projects$/)
    expect(errors).toEqual([])
  })
}

for (const withdrawal of ["reduce", "dispose"]) {
  test(`pending scene cannot complete after ${withdrawal}`, async ({
    page,
  }) => {
    const errors: string[] = []
    page.on("pageerror", error => errors.push(error.message))
    let release!: () => void
    const gate = new Promise<void>(resolve => {
      release = resolve
    })
    await page.route(/earth-surface.*\.webp/, async route => {
      await gate
      await route.continue()
    })
    try {
      await page.goto("/", { waitUntil: "domcontentloaded" })
      await expect(earth(page)).toHaveAttribute("data-earth-motion", "loading")
      if (withdrawal === "reduce")
        await page.emulateMedia({ reducedMotion: "reduce" })
      else
        await page.evaluate(() =>
          document.dispatchEvent(new Event("astro:before-swap")),
        )
      await expect(earth(page)).toHaveAttribute(
        "data-earth-motion",
        withdrawal === "reduce" ? "static" : "disposed",
      )
      release()
      await page.waitForTimeout(200)
      await expect(earth(page)).not.toHaveAttribute(
        "data-earth-handoff",
        "complete",
      )
      expect(errors).toEqual([])
    } finally {
      release()
    }
  })
}

test("live preferences, static choice, pointer input and context loss are respected", async ({
  page,
}, testInfo) => {
  await page.addInitScript(() => {
    const contexts: WebGL2RenderingContext[] = []
    const activity = { draws: 0, contexts }
    Object.defineProperty(window, "__globeActivity", { value: activity })
    const original = HTMLCanvasElement.prototype.getContext
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      value: function (
        this: HTMLCanvasElement,
        type: string,
        ...args: unknown[]
      ) {
        const result = Reflect.apply(original, this, [type, ...args])
        if (type === "webgl2" && result && !contexts.includes(result))
          contexts.push(result)
        return result
      },
    })
    const draw = WebGL2RenderingContext.prototype.drawElements
    WebGL2RenderingContext.prototype.drawElements = function (...args) {
      activity.draws += 1
      return draw.apply(this, args)
    }
  })
  await page.goto("/")
  await expect(earth(page)).toHaveAttribute("data-earth-motion", "running")
  const canvasImage = await page.locator("[data-earth-canvas]").screenshot()
  expect((await sharp(canvasImage).stats()).entropy).toBeGreaterThan(1)
  await testInfo.attach("rendered-globe", {
    body: canvasImage,
    contentType: "image/png",
  })
  await page.mouse.move(1100, 230)
  await expect(earth(page)).toHaveAttribute("data-earth-pointer", "active")
  await page.getByRole("heading", { level: 1 }).hover()
  await expect(earth(page)).toHaveAttribute("data-earth-pointer", "active")
  await page.mouse.move(5, 5)
  await expect(earth(page)).toHaveAttribute("data-earth-pointer", "idle")
  await page.locator("#about").scrollIntoViewIfNeeded()
  await page.waitForTimeout(200)
  const draws = await page.evaluate(
    () =>
      (window as unknown as { __globeActivity: { draws: number } })
        .__globeActivity.draws,
  )
  await page.waitForTimeout(200)
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { __globeActivity: { draws: number } })
          .__globeActivity.draws,
    ),
  ).toBe(draws)
  await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }))
  await page.getByRole("button", { name: "Static view" }).focus()
  await page.keyboard.press("Enter")
  await expect(earth(page)).toHaveAttribute("data-earth-motion", "static")
  for (const width of [767, 1024, 600, 1440])
    await page.setViewportSize({ width, height: 900 })
  await expect(
    page.getByRole("button", { name: "Animate globe" }),
  ).toHaveAttribute("aria-pressed", "true")
  await page.getByRole("button", { name: "Animate globe" }).click()
  await expect(earth(page)).toHaveAttribute("data-earth-motion", "running")
  await page.emulateMedia({ reducedMotion: "reduce" })
  await expect(earth(page)).toHaveAttribute("data-earth-motion", "static")
  await page.emulateMedia({ reducedMotion: "no-preference" })
  await expect(earth(page)).toHaveAttribute("data-earth-motion", "running")
  for (let index = 0; index < 2; index += 1) {
    await page.evaluate(() =>
      document.dispatchEvent(new Event("astro:page-load")),
    )
    await expect(earth(page)).toHaveAttribute("data-earth-motion", "running")
  }
  expect(
    await page.evaluate(
      () =>
        (
          window as unknown as {
            __globeActivity: { contexts: WebGL2RenderingContext[] }
          }
        ).__globeActivity.contexts.filter(context => !context.isContextLost())
          .length,
    ),
  ).toBe(1)
  await page
    .locator("[data-earth-canvas]")
    .evaluate(element =>
      (element as HTMLCanvasElement)
        .getContext("webgl2")
        ?.getExtension("WEBGL_lose_context")
        ?.loseContext(),
    )
  await expect(earth(page)).toHaveAttribute("data-earth-motion", "unavailable")
  await expect(page.locator("[data-hero-image]")).toHaveCSS("opacity", "1")
})
