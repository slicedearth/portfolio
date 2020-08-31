import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import ProjectItem from "./ProjectItem"
export default function Projects() {
  const data = useStaticQuery(
    graphql`
      query {
        allProject {
          nodes {
            id
            title
            githubURL
            description
            image_alt
            image {
              childImageSharp {
                fluid(maxWidth: 1000) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    `
  )
  return (
    <section id="projects" className="section section-padding">
      <h3 className="is-size-3 has-text-centered pb-3 has-text-weight-bold">
        Projects
      </h3>
      <div className="columns is-centered">
        <div className="column is-four-fifths">
          <div className="project-grid">
            {data.allProject.nodes.map(project => (
              <ProjectItem {...project} key={project.title} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
