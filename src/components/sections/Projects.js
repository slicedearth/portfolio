import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import ProjectItem from "./ProjectItem"
export default function Projects() {
  const data = useStaticQuery(
    graphql`
      query {
        allProjectsJson {
          nodes {
            id
            title
            githubURL
            description
            image_alt
            image {
              childImageSharp {
                fluid(maxWidth: 680, quality: 100) {
                  ...GatsbyImageSharpFluid_withWebp
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
      <h3 className="is-size-2 has-text-centered pb-3 has-text-weight-bold">
        Projects
      </h3>
      <div className="columns is-centered">
        <div className="column is-four-fifths">
          <div className="project-grid">
            {data.allProjectsJson.nodes.map((project, index) => (
              <ProjectItem {...project} key={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
