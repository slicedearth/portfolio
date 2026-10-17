export const serialiseJsonLd = (value: unknown) =>
  JSON.stringify(value).replace(/</g, "\\u003c")
