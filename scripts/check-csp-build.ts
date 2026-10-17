import { readFile, readdir } from "node:fs/promises"
import { join } from "node:path"
import { parse, type DefaultTreeAdapterMap } from "parse5"
import { assertCsp, headersFor, parseHeaderRules } from "./production-policy.ts"

const rules = parseHeaderRules(await readFile("dist/_headers", "utf8"))
const headers = headersFor(rules, "/")
assertCsp(headers["content-security-policy"] ?? "")
if (!headers["cache-control"]?.split(/,\s*/).includes("no-transform"))
  throw new Error("HTML must retain no-transform.")
if (
  !headersFor(rules, "/_astro/example.js")["cache-control"]?.includes(
    "immutable",
  )
)
  throw new Error("Hashed assets must retain immutable caching.")
const htmlFiles = (await readdir("dist", { recursive: true })).filter(file =>
  file.endsWith(".html"),
)
const inspect = (node: DefaultTreeAdapterMap["node"]) => {
  if ("tagName" in node && node.tagName === "script") {
    const attrs = new Map(node.attrs.map(attr => [attr.name, attr.value]))
    const text = node.childNodes
      .map(child => ("value" in child ? child.value : ""))
      .join("")
    if (
      !attrs.has("src") &&
      attrs.get("type") !== "application/ld+json" &&
      text.trim()
    )
      throw new Error("Executable inline script blocked by production CSP")
  }
  if ("childNodes" in node) node.childNodes.forEach(inspect)
}
for (const file of htmlFiles)
  inspect(parse(await readFile(join("dist", file), "utf8")))
console.log(
  `CSP structure and scripts passed for ${htmlFiles.length} HTML files.`,
)
