import { readFile } from "node:fs/promises"
import path from "node:path"
import { parse, type DefaultTreeAdapterMap } from "parse5"

type HtmlNode = DefaultTreeAdapterMap["node"]

const html = await readFile(
  path.join(process.cwd(), "dist", "index.html"),
  "utf8",
)
const document = parse(html)
const externalLinks = new Set<string>()

const visit = (node: HtmlNode) => {
  if ("tagName" in node && node.tagName === "a") {
    const href = node.attrs?.find(attribute => attribute.name === "href")?.value
    if (href?.startsWith("http://") || href?.startsWith("https://")) {
      externalLinks.add(href)
    }
  }

  if ("childNodes" in node) {
    for (const child of node.childNodes) visit(child)
  }
}

visit(document)

if (externalLinks.size === 0) {
  throw new Error("No external links were found in dist/index.html.")
}

const check = async (url: string, method: "GET" | "HEAD") => {
  const response = await fetch(url, {
    method,
    redirect: "follow",
    headers: {
      Accept:
        "text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8",
      "User-Agent": "slicedearth-portfolio-link-check/1.0",
      ...(method === "GET" ? { Range: "bytes=0-0" } : {}),
    },
    signal: AbortSignal.timeout(15_000),
  })

  await response.body?.cancel()
  return response
}

const failures: string[] = []

for (const url of [...externalLinks].sort()) {
  let response: Response | undefined
  let error: unknown

  for (const method of ["HEAD", "GET"] as const) {
    try {
      response = await check(url, method)
      if (response.ok || (response.status >= 300 && response.status < 400)) {
        break
      }
    } catch (requestError) {
      error = requestError
    }
  }

  if (
    response?.ok ||
    (response && response.status >= 300 && response.status < 400)
  ) {
    console.log(`OK ${response.status} ${url}`)
  } else {
    const errorMessage =
      error instanceof Error ? error.message : "request failed"
    failures.push(
      `${url} (${response ? `HTTP ${response.status}` : errorMessage})`,
    )
  }
}

if (failures.length > 0) {
  throw new Error(`External link check failed:\n- ${failures.join("\n- ")}`)
}

console.log(`Checked ${externalLinks.size} external links.`)
