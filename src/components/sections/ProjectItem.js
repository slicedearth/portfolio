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
    <div className="flex flex-col rounded-xl border border-white/10 bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40">
      <figure className="mb-3 overflow-hidden rounded-lg border border-white/10">
        <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400"></span>
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400"></span>
          <span className="h-2.5 w-2.5 rounded-full bg-green-400"></span>
        </div>
        {image && (
          <GatsbyImage
            image={image.childImageSharp.gatsbyImageData}
            alt={image_alt}
          />
        )}
      </figure>
      <p className="text-center text-xl font-semibold text-white">{title}</p>
      <p className="mt-1 mb-3 flex-1 text-center text-sm text-gray-400">
        {description}
      </p>
      <a
        className="mt-auto flex items-center justify-center gap-3 rounded-full border border-white/10 bg-slate-800 px-4 py-2 font-semibold text-white transition-all duration-300 hover:border-accent/50 hover:bg-slate-700 hover:shadow-lg hover:shadow-accent/10"
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
