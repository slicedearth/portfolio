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
      <h3 className="is-size-2 has-text-centered pb-3 has-text-weight-bold">
        About Me
      </h3>
      <div className="columns is-centered">
        <div className="column is-four-fifths">
          <div className="card-box mb-3">
            <p className="is-size-4 has-text-centered">
              I am a
              <span className="has-text-weight-semibold">
                {" "}
                project manager{" "}
              </span>
              and
              <span className="has-text-weight-semibold"> web developer </span>
              based in
              <span className="has-text-weight-semibold">
                {" "}
                Melbourne, Australia
              </span>
              .
            </p>
            <p className="is-size-4 has-text-centered">
              I have experience with the following web technologies and
              platforms:
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
