export type HeaderRule = { path: string; headers: Record<string, string> }

export const parseHeaderRules = (source: string): HeaderRule[] => {
  const rules: HeaderRule[] = []
  for (const line of source.split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue
    if (!/^\s/.test(line)) {
      rules.push({ path: line.trim(), headers: {} })
      continue
    }
    const separator = line.indexOf(":")
    if (!rules.length || separator < 0)
      throw new Error(`Invalid header: ${line}`)
    rules.at(-1)!.headers[line.slice(0, separator).trim().toLowerCase()] = line
      .slice(separator + 1)
      .trim()
  }
  return rules
}
export const headersFor = (rules: HeaderRule[], pathname: string) => {
  const matched = rules.filter(rule =>
    rule.path.endsWith("*")
      ? pathname.startsWith(rule.path.slice(0, -1))
      : pathname === rule.path,
  )
  return Object.assign(
    {},
    ...matched
      .sort((a, b) => a.path.length - b.path.length)
      .map(rule => rule.headers),
  ) as Record<string, string>
}
export const parseCsp = (policy: string) => {
  const directives = new Map<string, string[]>()
  for (const raw of policy.split(";")) {
    const [name, ...values] = raw.trim().split(/\s+/)
    if (!name) continue
    if (directives.has(name))
      throw new Error(`Duplicate CSP directive: ${name}`)
    directives.set(name, values)
  }
  return directives
}
export const assertCsp = (policy: string) => {
  const directives = parseCsp(policy)
  for (const [name, values] of Object.entries({
    "default-src": ["'self'"],
    "base-uri": ["'self'"],
    "object-src": ["'none'"],
    "form-action": ["'none'"],
    "frame-ancestors": ["'none'"],
  })) {
    if (JSON.stringify(directives.get(name)) !== JSON.stringify(values))
      throw new Error(`Expected restrictive ${name}`)
  }
  for (const name of ["script-src", "script-src-elem", "style-src"]) {
    const sources = directives.get(name) ?? directives.get("script-src") ?? []
    if (
      !sources.includes("'self'") ||
      sources.some(value =>
        ["'unsafe-inline'", "'unsafe-eval'", "*", "https:", "data:"].includes(
          value,
        ),
      )
    )
      throw new Error(`Unsafe ${name}`)
  }
  // Analytics and debugger hosts are optional capabilities, not baseline restrictions.
  return directives
}
