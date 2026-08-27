import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

test("core portfolio experience works across browser engines", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  await expect(
    page.getByRole("heading", { level: 1, name: "Hey, I'm Aser." }),
  ).toBeVisible()
  await expect(page.locator("[data-project-card]")).toHaveCount(6)
  await expect(page.locator("[data-sliced-earth]")).not.toHaveAttribute(
    "data-earth-ready",
    "true",
  )

  const projectImages = page.locator("[data-project-image]")
  await projectImages.last().scrollIntoViewIfNeeded()

  for (let index = 0; index < (await projectImages.count()); index += 1) {
    const image = projectImages.nth(index)
    await image.scrollIntoViewIfNeeded()
    await expect
      .poll(() =>
        image.evaluate(element =>
          element instanceof HTMLImageElement ? element.naturalWidth : 0,
        ),
      )
      .toBeGreaterThan(0)
    await expect(image).toHaveCSS("object-fit", "contain")
  }

  const widths = await page.evaluate(() => ({
    content: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }))
  expect(widths.content).toBeLessThanOrEqual(widths.viewport)

  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})
