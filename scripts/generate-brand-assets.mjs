import { readFile } from "node:fs/promises"
import sharp from "sharp"

const markPath = "src/assets/brand/slicedearth-mark.svg"
const heroPath = "src/assets/brand/hero-slicedearth.webp"
const fontPath = "public/fonts/archivo-latin-variable.woff2"

const [mark, font] = await Promise.all([
  readFile(markPath),
  readFile(fontPath, "base64"),
])

await Promise.all([
  sharp(mark).resize(32, 32).png().toFile("public/favicon-32.png"),
  sharp(mark).resize(180, 180).png().toFile("public/apple-touch-icon.png"),
])

const background = await sharp(heroPath)
  .resize(1200, 630, { fit: "cover", position: "center" })
  .modulate({ brightness: 0.72 })
  .png()
  .toBuffer()

const overlay = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <style>
      @font-face {
        font-family: "Archivo";
        font-weight: 700;
        src: url("data:font/woff2;base64,${font}") format("woff2");
      }
      text { font-family: "Archivo", sans-serif; font-weight: 700; }
    </style>
    <rect width="1200" height="630" fill="#070a0e" opacity="0.34"/>
    <rect x="64" y="64" width="1072" height="502" fill="none" stroke="#53616a" stroke-width="2"/>
    <image href="data:image/svg+xml;base64,${mark.toString("base64")}" x="96" y="94" width="72" height="72"/>
    <text x="188" y="145" fill="#ffffff" font-size="42">slicedearth</text>
    <text x="96" y="300" fill="#ffffff" font-size="74">Software engineering and</text>
    <text x="96" y="385" fill="#ffffff" font-size="74">project delivery.</text>
    <rect x="96" y="455" width="56" height="4" fill="#5eead4"/>
    <text x="172" y="470" fill="#c5ced3" font-size="28">Dependable tools for security, public data and the web.</text>
  </svg>
`)

await sharp(background)
  .composite([{ input: overlay }])
  .png({ compressionLevel: 9 })
  .toFile("public/og-image.png")

console.log("Generated favicon, touch icon and Open Graph image.")
