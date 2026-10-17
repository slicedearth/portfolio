import { test } from "node:test"
import assert from "node:assert/strict"
import { serialiseJsonLd } from "../src/utils/json-ld.ts"
import {
  assertCsp,
  headersFor,
  parseHeaderRules,
} from "../scripts/production-policy.ts"

test("JSON-LD cannot terminate its script element", () => {
  const fixture = {
    title: "</script><script>alert(1)</script>",
    description: "<img onerror='alert(1)'>",
  }
  const serialised = serialiseJsonLd(fixture)
  assert.equal(serialised.includes("<"), false)
  assert.deepEqual(JSON.parse(serialised), fixture)
})
test("specific asset cache overrides broad HTML cache without losing security headers", () => {
  const rules = parseHeaderRules(
    "/_astro/*\n  Cache-Control: immutable\n\n/*\n  Cache-Control: no-transform\n  X-Frame-Options: DENY\n",
  )
  assert.equal(
    headersFor(rules, "/_astro/example.js")["cache-control"],
    "immutable",
  )
  assert.equal(headersFor(rules, "/")["cache-control"], "no-transform")
  assert.equal(
    headersFor(rules, "/_astro/example.js")["x-frame-options"],
    "DENY",
  )
})
test("CSP restrictions do not require analytics/debug hosts", () => {
  const policy =
    "default-src 'self'; base-uri 'self'; object-src 'none'; form-action 'none'; frame-ancestors 'none'; script-src 'self'; style-src 'self'"
  assert.doesNotThrow(() => assertCsp(policy))
  assert.throws(() => assertCsp(policy + "; script-src 'unsafe-inline'"))
  assert.throws(() =>
    assertCsp(
      policy.replace("script-src 'self'", "script-src 'self' 'unsafe-eval'"),
    ),
  )
})
