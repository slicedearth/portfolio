import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "./fixtures"
import { readFileSync } from "node:fs"

const projects = JSON.parse(
  readFileSync(
    new URL("../src/content/projects/projects.json", import.meta.url),
    "utf8",
  ),
) as unknown[]

test("core portfolio experience works across browser engines", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  await expect(page.locator("[data-project-card]")).toHaveCount(projects.length)
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
  }

  const widths = await page.evaluate(() => ({
    content: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }))
  expect(widths.content).toBeLessThanOrEqual(widths.viewport)

  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})
