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
    <section id="projects" className="py-16 px-4">
      <h3 className="pb-6 text-center text-4xl font-bold">Projects</h3>
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
