import React from "react"
import { GatsbyImage } from "gatsby-plugin-image"
export default function ProjectItem({
  title,
  image,
  image_alt,
  description,
  githubURL,
}) {
  return (
    <div className="project-item">
      <figure className="image mb-3">
        {image && (
          <GatsbyImage
            image={image.childImageSharp.gatsbyImageData}
            alt={image_alt}
          />
        )}
      </figure>
      <p className="title is-size-4 has-text-centered">{title}</p>
      <p className="has-text-centered subtitle is-size-6">{description}</p>
      <a
        className="button is-dark is-fullwidth  has-text-weight-semibold"
        href={githubURL}
        rel="noopener noreferrer"
        target="_blank"
      >
        View Code on GitHub
      </a>
    </div>
  )
}
