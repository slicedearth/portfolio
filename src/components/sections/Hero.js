import React from "react"
import { Link } from "gatsby"
import ghIcon from "../../icons/github-original.svg"
import contactIcon from "../../icons/envelope.svg"
export default function Hero() {
  return (
    <section className="hero is-grad is-medium ">
      <div className="hero-body">
        <div className="container has-text-centered">
          <h1 className="is-size-1 has-text-weight-bold is-family-secondary has-text-white">
            Hey, I'm Aser
          </h1>
          <h2 className="subtitle is-size-2 is-family-primary has-text-white">
            Junior Web Developer
          </h2>
          <div className="buttons are-medium is-centered">
            <a
              className="button is-dark is-size-5 has-text-weight-semibold"
              href="https://www.github.com/slicedearth"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="icon is-large">
                <img className="svgIcon" src={ghIcon} alt="GitHub Icon" />
              </span>
              <span>GitHub Profile</span>
            </a>
            <Link
              className="button is-dark is-size-5 has-text-weight-semibold"
              to="/#contact"
            >
              <span className="icon is-large">
                <img className="svgIcon" src={contactIcon} alt="Contact Icon" />
              </span>
              <span>Get In Touch</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
