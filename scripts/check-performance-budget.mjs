import { readFile, readdir, stat } from "node:fs/promises"
import { extname, join, normalize } from "node:path"
import { gzipSync } from "node:zlib"

const limits = {
  css: 70 * 1024,
  deferredGzip: 30 * 1024,
  deferredRaw: 80 * 1024,
  font: 220 * 1024,
  html: 90 * 1024,
  image: 550 * 1024,
  initialJavaScript: 70 * 1024,
  optionalSceneGzip: 140 * 1024,
  optionalSceneRaw: 560 * 1024,
  socialImage: 900 * 1024,
}

try {
  await stat("dist")
} catch {
  throw new Error("No build output found. Run npm run build first.")
}

const files = []
const walk = async directory => {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) {
      await walk(path)
    } else {
      files.push({ path, size: (await stat(path)).size })
    }
  }
}
await walk("dist")

const html = await readFile("dist/index.html", "utf8")
const initialScriptPaths = new Set(
  [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+\.js(?:\?[^"']*)?)/g)]
    .map(([, source]) => source)
    .filter(source => source.startsWith("/"))
    .map(source => normalize(join("dist", source.split("?")[0]))),
)

for (const publicEntry of ["dist/analytics.js", "dist/mobile-nav.js"]) {
  if (files.some(file => file.path === publicEntry)) {
    initialScriptPaths.add(publicEntry)
  }
}

const javascriptFiles = files.filter(file => extname(file.path) === ".js")
const initialJavaScript = javascriptFiles.filter(file =>
  initialScriptPaths.has(normalize(file.path)),
)
const optionalSceneJavaScript = javascriptFiles.filter(file =>
  file.path.includes("sliced-earth-scene."),
)
const deferredJavaScript = javascriptFiles.filter(
  file =>
    !initialScriptPaths.has(normalize(file.path)) &&
    !optionalSceneJavaScript.includes(file),
)
const inlineJavaScriptTotal = [
  ...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi),
]
  .filter(
    ([, attributes]) =>
      !/\bsrc\s*=/.test(attributes) &&
      !/\btype=["']application\/ld\+json["']/.test(attributes),
  )
  .reduce((total, [, , source]) => total + Buffer.byteLength(source), 0)
const initialJavaScriptTotal =
  inlineJavaScriptTotal +
  initialJavaScript.reduce((total, file) => total + file.size, 0)
const deferredJavaScriptTotal = deferredJavaScript.reduce(
  (total, file) => total + file.size,
  0,
)
const gzipTotal = async selectedFiles => {
  const sizes = await Promise.all(
    selectedFiles.map(
      async file => gzipSync(await readFile(file.path), { level: 9 }).length,
    ),
  )
  return sizes.reduce((total, size) => total + size, 0)
}

const deferredJavaScriptGzip = await gzipTotal(deferredJavaScript)
const optionalSceneJavaScriptTotal = optionalSceneJavaScript.reduce(
  (total, file) => total + file.size,
  0,
)
const optionalSceneJavaScriptGzip = await gzipTotal(optionalSceneJavaScript)

const failures = []
const checkTotal = (name, total, limit) => {
  if (total <= limit) return
  failures.push(
    `${name} totals ${Math.ceil(total / 1024)} KiB; budget is ${Math.ceil(
      limit / 1024,
    )} KiB`,
  )
}

checkTotal(
  "Initial JavaScript",
  initialJavaScriptTotal,
  limits.initialJavaScript,
)
checkTotal("Deferred JavaScript", deferredJavaScriptTotal, limits.deferredRaw)
checkTotal(
  "Deferred JavaScript (gzip)",
  deferredJavaScriptGzip,
  limits.deferredGzip,
)
checkTotal(
  "Optional hero scene",
  optionalSceneJavaScriptTotal,
  limits.optionalSceneRaw,
)
checkTotal(
  "Optional hero scene (gzip)",
  optionalSceneJavaScriptGzip,
  limits.optionalSceneGzip,
)

const cssTotal = files
  .filter(file => extname(file.path) === ".css")
  .reduce((total, file) => total + file.size, 0)
checkTotal("CSS", cssTotal, limits.css)

const fontTotal = files
  .filter(file => extname(file.path) === ".woff2")
  .reduce((total, file) => total + file.size, 0)
checkTotal("WOFF2 fonts", fontTotal, limits.font)

const htmlSize = (await stat("dist/index.html")).size
checkTotal("HTML", htmlSize, limits.html)

const socialImagePath = normalize("dist/og-image.png")

for (const image of files.filter(
  file =>
    normalize(file.path) !== socialImagePath &&
    [".avif", ".jpg", ".jpeg", ".png", ".webp"].includes(
      extname(file.path).toLowerCase(),
    ),
)) {
  if (image.size <= limits.image) continue
  failures.push(
    `${image.path} is ${Math.ceil(image.size / 1024)} KiB; image budget is ${
      limits.image / 1024
    } KiB`,
  )
}

const socialImage = files.find(file => normalize(file.path) === socialImagePath)
if (socialImage && socialImage.size > limits.socialImage) {
  failures.push(
    `${socialImage.path} is ${Math.ceil(
      socialImage.size / 1024,
    )} KiB; social image budget is ${limits.socialImage / 1024} KiB`,
  )
}

if (failures.length > 0) {
  throw new Error(`Performance budget exceeded:\n${failures.join("\n")}`)
}

console.log(
  [
    "Performance budget passed:",
    `${Math.ceil(initialJavaScriptTotal / 1024)} KiB initial JS`,
    `${Math.ceil(deferredJavaScriptTotal / 1024)} KiB deferred JS`,
    `${Math.ceil(deferredJavaScriptGzip / 1024)} KiB deferred JS gzip`,
    `${Math.ceil(optionalSceneJavaScriptTotal / 1024)} KiB optional hero JS`,
    `${Math.ceil(optionalSceneJavaScriptGzip / 1024)} KiB optional hero JS gzip`,
    `${Math.ceil(cssTotal / 1024)} KiB CSS`,
    `${Math.ceil(fontTotal / 1024)} KiB fonts`,
  ].join(" "),
)
