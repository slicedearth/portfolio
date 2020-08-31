import React from "react"
import Img from "gatsby-image"
import { useStaticQuery, graphql } from "gatsby"

export default function Projects() {
  const data = useStaticQuery(
    graphql`
      fragment fluidImage on File {
        childImageSharp {
          fluid(maxWidth: 1000) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      query {
        imageOne: file(relativePath: { eq: "githubFinder.png" }) {
          ...fluidImage
        }
        imageTwo: file(relativePath: { eq: "wearitReact.png" }) {
          ...fluidImage
        }
        imageThree: file(relativePath: { eq: "wearitEJS.png" }) {
          ...fluidImage
        }
        imageFour: file(relativePath: { eq: "revueMongoDB.png" }) {
          ...fluidImage
        }
        imageFive: file(relativePath: { eq: "revueSQLite.png" }) {
          ...fluidImage
        }
        imageSix: file(relativePath: { eq: "portfolio.png" }) {
          ...fluidImage
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
            <div className="project-item">
              <figure className="image mb-3">
                <Img fluid={data.imageOne.childImageSharp.fluid} />
              </figure>
              <p className="title is-size-4 has-text-centered">GitHub Finder</p>
              <p className="has-text-centered subtitle is-size-6">
                React website that uses the GitHub API to search for users and
                display information from their profile.
              </p>
              <button className="button is-dark is-fullwidth  has-text-weight-semibold">
                GitHub Repository
              </button>
            </div>
            <div className="project-item">
              <figure className="image mb-3">
                <Img fluid={data.imageTwo.childImageSharp.fluid} />
              </figure>
              <p className="title is-size-4 has-text-centered">WearIt React</p>
              <p className="has-text-centered subtitle is-size-6">
                Clothing store website built with React featuring a contact form
                and newsletter signup via Mailchimp.
              </p>
              <button className="button is-dark is-fullwidth  has-text-weight-semibold">
                GitHub Repository
              </button>
            </div>
            <div className="project-item">
              <figure className="image mb-3">
                <Img fluid={data.imageThree.childImageSharp.fluid} />
              </figure>
              <p className="title is-size-4 has-text-centered">WearIt EJS</p>
              <p className="has-text-centered subtitle is-size-6">
                Clothing store website with a dark mode toggle, built with EJS
                and Express.
              </p>
              <button className="button is-dark is-fullwidth  has-text-weight-semibold">
                GitHub Repository
              </button>
            </div>
            <div className="project-item">
              <figure className="image mb-3">
                <Img fluid={data.imageFour.childImageSharp.fluid} />
              </figure>
              <p className="title is-size-4 has-text-centered">ReVue MongoDB</p>
              <p className="has-text-centered subtitle is-size-6">
                Music review website built with Vue and MongoDB.
              </p>
              <button className="button is-dark is-fullwidth  has-text-weight-semibold">
                GitHub Repository
              </button>
            </div>
            <div className="project-item">
              <figure className="image mb-3">
                <Img fluid={data.imageFive.childImageSharp.fluid} />
              </figure>
              <p className="title is-size-4 has-text-centered">ReVue SQLite</p>
              <p className="has-text-centered subtitle is-size-6">
                Music review website built with Vue and SQLite.
              </p>
              <button className="button is-dark is-fullwidth  has-text-weight-semibold">
                GitHub Repository
              </button>
            </div>
            <div className="project-item">
              <figure className="image mb-3">
                <Img fluid={data.imageSix.childImageSharp.fluid} />
              </figure>
              <p className="title is-size-4 has-text-centered">Portfolio</p>
              <p className="has-text-centered subtitle is-size-6">
                Personal portfolio website built with Gatsby and Bulma.
              </p>
              <button className="button is-dark is-fullwidth  has-text-weight-semibold">
                GitHub Repository
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
