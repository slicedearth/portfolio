import { readFile, readdir } from "node:fs/promises"
import path from "node:path"

const root = process.cwd()
const headers = await readFile(path.join(root, "public", "_headers"), "utf8")
const scriptPolicy = headers.match(/Content-Security-Policy:[^\n]*/)?.[0] ?? ""
const globalHeaders =
  headers.match(/^\/\*[ \t]*\n((?:[ \t]+[^\n]*(?:\n|$))*)/m)?.[1] ?? ""
const globalCachePolicy = globalHeaders.match(/Cache-Control:[^\n]*/)?.[0] ?? ""
const openerPolicy =
  globalHeaders.match(/Cross-Origin-Opener-Policy:[^\n]*/)?.[0] ?? ""

const requiredPolicySources = {
  "connect-src": [
    "'self'",
    "https://*.google-analytics.com",
    "https://*.analytics.google.com",
    "https://www.googletagmanager.com",
  ],
  "font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
  "img-src": [
    "'self'",
    "data:",
    "https://*.google-analytics.com",
    "https://www.googletagmanager.com",
    "https://ssl.gstatic.com",
    "https://www.gstatic.com",
  ],
  "script-src-elem": [
    "'self'",
    "https://www.googletagmanager.com",
    "https://tagmanager.google.com",
  ],
  "style-src": [
    "'self'",
    "https://www.googletagmanager.com",
    "https://tagmanager.google.com",
    "https://fonts.googleapis.com",
  ],
}

if (!scriptPolicy.includes("script-src 'self'")) {
  throw new Error("Expected the production CSP to restrict scripts to self.")
}

if (scriptPolicy.includes("'unsafe-inline'")) {
  throw new Error("The production CSP must not allow unsafe inline scripts.")
}

if (!/(?:^|,)\s*no-transform(?:,|$)/.test(globalCachePolicy)) {
  throw new Error(
    "Expected the global cache policy to prevent edge script injection with no-transform.",
  )
}

for (const [directive, requiredSources] of Object.entries(
  requiredPolicySources,
)) {
  const configuredSources =
    scriptPolicy
      .match(new RegExp(`(?:^|;\\s*)${directive}\\s+([^;]+)`))?.[1]
      ?.split(/\s+/) ?? []

  for (const source of requiredSources) {
    if (!configuredSources.includes(source)) {
      throw new Error(
        `Expected ${directive} to allow ${source} for analytics debugging.`,
      )
    }
  }
}

if (openerPolicy && !/:\s*unsafe-none\s*$/i.test(openerPolicy)) {
  throw new Error(
    "The global opener policy must allow the Tag Assistant debug window handshake.",
  )
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
