import React from "react"
import githubFinderIMG from "../../images/githubFinder.png"
import wearitReactIMG from "../../images/wearitReact.png"
import wearitEJSIMG from "../../images/wearitEJS.png"
import revueMongoDBIMG from "../../images/revueMongoDB.png"
import revueSQLiteIMG from "../../images/revueSQLite.png"
import portfolioIMG from "../../images/portfolio.png"

export default function Projects() {
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
                <img src={githubFinderIMG} alt="" />
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
                <img src={wearitReactIMG} alt="" />
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
                <img src={wearitEJSIMG} alt="" />
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
                <img src={revueMongoDBIMG} alt="" />
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
                <img src={revueSQLiteIMG} alt="" />
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
                <img src={portfolioIMG} alt="" />
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
