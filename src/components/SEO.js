import React from "react"
import { useStaticQuery, graphql } from "gatsby"

export default function Seo({
  description = ``,
  lang = `en`,
  title,
  pathname,
}) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            siteUrl
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  const canonical = pathname
    ? `${site.siteMetadata.siteUrl}${pathname}`
    : undefined

  return (
    <>
      <html lang={lang} />
      <title>{`${site.siteMetadata.title} | ${title}`}</title>
      {canonical && <link rel="canonical" href={canonical} />}
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
    </>
  )
}
