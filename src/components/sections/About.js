import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Skilltem from "./SkillItem"

export default function About() {
  const data = useStaticQuery(
    graphql`
      query {
        allSkillsJson {
          nodes {
            icon {
              extension
              publicURL
            }
            title
            icon_alt
          }
        }
      }
    `
  )
  return (
    <section id="about" className="section section-padding">
      <h3 className="is-size-3 has-text-centered pb-3 has-text-weight-bold">
        About Me
      </h3>
      <div className="columns is-centered">
        <div className="column is-four-fifths">
          <div className="card-box mb-3">
            <p className="is-size-4 has-text-centered">
              I am based in{" "}
              <span className="has-text-weight-semibold">
                Melbourne, Australia
              </span>{" "}
              and have recently completed a{" "}
              <span className="has-text-weight-semibold">
                Diploma of Website Development
              </span>
              .
            </p>
            <p className="is-size-4 has-text-centered">
              I am proficient with the following web technologies...
            </p>
          </div>
          <div className="skill-grid">
            {data.allSkillsJson.nodes.map(skill => (
              <Skilltem {...skill} key={skill.title} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
