import React, { useCallback } from "react"
import { Link } from "gatsby"
import Particles from "react-particles"
import tsparticlesConfig from "./tsparticles-config.json"
import { loadFull } from "tsparticles"
import ghIcon from "../../icons/github-original.svg"
import contactIcon from "../../icons/envelope.svg"
export default function Hero() {
  const particlesInit = useCallback(async engine => {
    await loadFull(engine)
  }, [])
  return (
    <section className="hero is-grad is-medium is-dark">
      <Particles
        id="tsparticles"
        options={tsparticlesConfig}
        init={particlesInit}
      />
      <div className="hero-body">
        <div className="container has-text-centered">
          <h1 className="is-size-1 hero-title has-text-weight-bold is-family-secondary has-text-white animate__animated animate__bounceInDown animate__slow">
            Hey, I'm Aser
          </h1>
          <h2 className="subtitle is-size-2 is-family-primary has-text-white animate__animated animate__bounceIn animate__delay-2s">
            Web Developer
          </h2>
          <div className="buttons are-medium is-centered animate__animated animate__fadeInUp animate__delay-2s">
            <a
              className="button is-dark is-size-5 has-text-weight-semibold has-text-white"
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
              className="button is-dark is-size-5 has-text-weight-semibold has-text-white"
              to="/contact"
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
