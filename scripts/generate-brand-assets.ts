import { readFile } from "node:fs/promises"
import { chromium } from "@playwright/test"
import sharp from "sharp"

const mark = await readFile("src/assets/brand/slicedearth-mark.svg")
const font = await readFile(
  "public/fonts/archivo-latin-variable.woff2",
  "base64",
)
const background = await sharp("src/assets/brand/hero-slicedearth.webp")
  .resize(1200, 630, { fit: "cover", position: "center" })
  .modulate({ brightness: 0.72 })
  .png()
  .toBuffer()

await sharp(mark).resize(32, 32).png().toFile("public/favicon-32.png")
await sharp(mark).resize(180, 180).png().toFile("public/apple-touch-icon.png")

// Render with the same self-hosted font as the site, rather than SVG font fallbacks.
const browser = await chromium.launch()
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  })
  await page.setContent(`<!doctype html><html><head><style>
    @font-face { font-family: Archivo; font-weight: 400 700; src: url(data:font/woff2;base64,${font}) format('woff2'); }
    * { box-sizing: border-box; }
    body { margin: 0; width: 1200px; height: 630px; color: white; font-family: Archivo, sans-serif; background: #070a0e url(data:image/png;base64,${background.toString("base64")}) center / cover; }
    main { position: absolute; inset: 64px; border: 2px solid #53616a; padding: 28px 30px; background: rgb(7 10 14 / 34%); }
    header { display: flex; gap: 20px; align-items: center; font-size: 42px; font-weight: 700; }
    img { width: 72px; height: 72px; }
    h1 { margin: 70px 0 48px; font-size: 70px; font-weight: 700; line-height: 1.2; letter-spacing: 0; }
    p { display: flex; align-items: center; gap: 20px; margin: 0; color: #c5ced3; font-size: 27px; }
    p::before { content: ''; width: 56px; height: 4px; background: #5eead4; }
    </style></head><body><main>
    <header><img src="data:image/svg+xml;base64,${mark.toString("base64")}" alt=""><span>slicedearth</span></header>
    <h1>Digital projects &amp;<br>web operations.</h1>
    <p>Aser / Domains, public data and useful web tools.</p>
    </main></body></html>`)
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: "public/og-image.png" })
} finally {
  await browser.close()
}
console.log("Generated favicon, touch icon and Open Graph image.")
