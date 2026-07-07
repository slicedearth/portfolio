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
    <section id="about" className="bg-bg px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center lg:mb-16">
          <p className="text-sm font-semibold tracking-widest text-accent uppercase">
            Who I Am
          </p>
          <h3 className="mt-2 text-4xl font-bold text-white">About Me</h3>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-accent to-accent-2"></div>
        </div>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="rounded-xl border border-white/10 bg-surface p-6">
            <p className="text-center text-xl text-gray-200 lg:text-left">
              I am a
              <span className="font-semibold text-white">
                {" "}
                project manager{" "}
              </span>
              and
              <span className="font-semibold text-white"> web developer </span>
              based in
              <span className="font-semibold text-white">
                {" "}
                Melbourne, Australia
              </span>
              .
            </p>
            <p className="mt-2 text-center text-xl text-gray-200 lg:text-left">
              Tools I work with:
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
            {data.allSkillsJson.nodes.map(skill => (
              <Skilltem {...skill} key={skill.title} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
