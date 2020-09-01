import React, { useState } from "react"
import { useStaticQuery, graphql, Link } from "gatsby"

export default function Header() {
  const [isActive, setisActive] = useState(false)

  const data = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
      }
    `
  )
  return (
    <nav
      className="navbar is-fixed-top"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <Link
          className="navbar-item is-family-secondary has-text-weight-bold is-size-4"
          to="/"
        >
          {data.site.siteMetadata.title}
        </Link>

        <div
          onClick={() => {
            setisActive(!isActive)
          }}
          role="button"
          className={`navbar-burger burger ${isActive ? "is-active" : ""}`}
          data-target="navMenu"
          aria-label="menu"
          aria-expanded="false"
          aria-hidden="true"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </div>
      </div>

      <div
        id="navMenu"
        className={`navbar-menu ${isActive ? "is-active" : ""}`}
      >
        <div className="navbar-end">
          <Link
            to="/#projects"
            className="navbar-item has-text-centered-touch has-text-weight-bold"
          >
            Projects
          </Link>
          <Link
            to="/#about"
            className="navbar-item has-text-centered-touch has-text-weight-bold"
          >
            About Me
          </Link>
          <Link
            to="/#contact"
            className="navbar-item has-text-centered-touch has-text-weight-bold"
          >
            Contact
          </Link>
        </div>
      </div>
    </nav>
  )
}
