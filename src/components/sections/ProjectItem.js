import React from "react"
import { GatsbyImage } from "gatsby-plugin-image"
import ghIcon from "../../icons/github-original.svg"

export default function ProjectItem({
  title,
  image,
  image_alt,
  description,
  githubURL,
}) {
  return (
    <div className="flex flex-col rounded-md bg-white p-5 shadow-[0_0.5em_1em_-0.125em_rgba(10,10,10,0.1),0_0_0_1px_rgba(10,10,10,0.02)]">
      <figure className="mb-3">
        {image && (
          <GatsbyImage
            image={image.childImageSharp.gatsbyImageData}
            alt={image_alt}
          />
        )}
      </figure>
      <p className="text-center text-xl font-semibold">{title}</p>
      <p className="mt-1 mb-3 flex-1 text-center text-sm text-gray-600">
        {description}
      </p>
      <a
        className="mt-auto flex items-center justify-center gap-3 rounded-md bg-black/80 px-4 py-2 font-semibold text-white transition-colors hover:bg-black"
        href={githubURL}
        rel="noopener noreferrer"
        target="_blank"
      >
        <img className="h-5 w-5" src={ghIcon} alt="GitHub Icon" />
        <span>View on GitHub</span>
      </a>
    </div>
  )
}
