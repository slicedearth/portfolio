import React from "react"
import { Link } from "gatsby"
import Particles from "preact-particles"
import ghIcon from "../../icons/github-original.svg"
import contactIcon from "../../icons/envelope.svg"

export default function Hero() {
  return (
    <section className="hero is-grad is-medium">
      <Particles
        id="tsparticles"
        params={{
          backgroundMask: {
            cover: {
              color: {
                value: "#fff",
              },
              opacity: 0.1,
            },
            enable: true,
          },
          detectRetina: true,
          fpsLimit: 60,
          particles: {
            color: {
              value: ["#000"],
            },
            move: {
              attract: {
                enable: true,
                rotateX: 600,
                rotateY: 1200,
              },
              direction: "none",
              enable: true,
              noise: {
                delay: {
                  random: {
                    enable: false,
                    minimumValue: 0,
                  },
                  value: 0,
                },
                enable: false,
              },
              outMode: "bounce",
              random: false,
              speed: 10,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
                factor: 1000,
              },
              limit: 0,
              value: 30,
            },
            opacity: {
              value: 1,
            },
            shape: {
              options: {
                character: {
                  value: ["</>", "{}", "!==", ">_", "[]", "#"],
                  font: "Ubuntu Mono",
                  style: "",
                  weight: "700",
                  fill: true,
                },
                char: {
                  value: ["</>", "{}", "!==", ">_", "[]", "#"],
                  font: "Ubuntu Mono",
                  style: "",
                  weight: "700",
                  fill: true,
                },
              },
              type: "char",
            },
            size: {
              random: {
                enable: true,
                minimumValue: 5,
              },
              value: 20,
            },
          },
          pauseOnBlur: true,
        }}
      />
      <div className="hero-body">
        <div className="container has-text-centered">
          <h1 className="is-size-1 hero-title has-text-weight-bold is-family-secondary has-text-white">
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
