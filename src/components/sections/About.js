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
    <section id="about" className="py-16 px-4">
      <h3 className="pb-6 text-center text-4xl font-bold">About Me</h3>
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 rounded-md bg-white p-6 shadow-[0_0.5em_1em_-0.125em_rgba(10,10,10,0.1),0_0_0_1px_rgba(10,10,10,0.02)]">
          <p className="text-center text-xl">
            I am a
            <span className="font-semibold"> project manager </span>
            and
            <span className="font-semibold"> web developer </span>
            based in
            <span className="font-semibold"> Melbourne, Australia</span>.
          </p>
          <p className="mt-2 text-center text-xl">
            I have experience with the following web technologies and
            platforms:
          </p>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,2fr))] gap-4">
          {data.allSkillsJson.nodes.map(skill => (
            <Skilltem {...skill} key={skill.title} />
          ))}
        </div>
      </div>
    </section>
  )
}
