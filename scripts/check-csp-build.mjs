import { readFile, readdir } from "node:fs/promises"
import path from "node:path"

const root = process.cwd()
const headers = await readFile(path.join(root, "public", "_headers"), "utf8")
const scriptPolicy = headers.match(/Content-Security-Policy:[^\n]*/)?.[0] ?? ""

if (!scriptPolicy.includes("script-src 'self'")) {
  throw new Error("Expected the production CSP to restrict scripts to self.")
}

if (scriptPolicy.includes("'unsafe-inline'")) {
  throw new Error("The production CSP must not allow unsafe inline scripts.")
}

const htmlFiles = (await readdir(path.join(root, "dist"), { recursive: true }))
  .filter(file => file.endsWith(".html"))
  .map(file => path.join(root, "dist", file))

const executableInlineScript =
  /<script(?![^>]*\bsrc=)(?![^>]*\btype=["']application\/ld\+json["'])[^>]*>\s*\S/i

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8")
  if (executableInlineScript.test(html)) {
    throw new Error(
      `${path.relative(root, file)} contains executable inline JavaScript blocked by the production CSP.`,
    )
  }
}

console.log(
  `CSP check passed for ${htmlFiles.length} generated HTML ${htmlFiles.length === 1 ? "file" : "files"}.`,
)
