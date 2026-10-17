import { spawnSync } from "node:child_process"
import { readFile, readdir } from "node:fs/promises"
import { join } from "node:path"

const mode = process.argv[2] ?? "on"
if (!["on", "off"].includes(mode)) throw new Error("Choose on or off.")
const off = mode === "off"
const env = {
  ...process.env,
  PUBLIC_GA_TRACKING_ID: off ? "" : "G-TEST000000",
  PORTFOLIO_ANALYTICS_MODE: mode,
}
const run = (args: string[]) => {
  const result = spawnSync("npm", args, { env, stdio: "inherit" })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}
run([
  "run",
  "build",
  ...(off ? ["--", "--outDir", ".astro/analytics-off"] : []),
])
if (off) {
  const directory = ".astro/analytics-off"
  for (const file of (await readdir(directory, { recursive: true })).filter(
    file => file.endsWith(".html"),
  )) {
    const html = await readFile(join(directory, file), "utf8")
    if (
      /google-analytics-id|src=["'][^"']*analytics\.js|googletagmanager\.com/.test(
        html,
      )
    )
      throw new Error(`Tracking reference in analytics-off HTML: ${file}`)
  }
  run([
    "run",
    "test:e2e:built",
    "--",
    "--project=desktop",
    "tests/analytics.spec.ts",
  ])
} else {
  run(["run", "test:e2e:built"])
}
