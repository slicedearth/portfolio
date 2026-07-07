import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import ProjectItem from "./ProjectItem"
export default function Projects() {
  const data = useStaticQuery(
    graphql`
      {
        allProjectsJson {
          nodes {
            id
            title
            githubURL
            description
            image_alt
            image {
              childImageSharp {
                gatsbyImageData(width: 680, quality: 100, layout: CONSTRAINED)
              }
            }
          }
        }
      }
    `
  )
  return (
    <section id="projects" className="bg-surface/40 px-4 py-20">
      <div className="mb-12 text-center">
        <p className="text-sm font-semibold tracking-widest text-accent uppercase">
          My Work
        </p>
        <h3 className="mt-2 text-4xl font-bold text-white">Projects</h3>
        <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-accent to-accent-2"></div>
      </div>
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {data.allProjectsJson.nodes.map((project, index) => (
            <ProjectItem {...project} key={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
