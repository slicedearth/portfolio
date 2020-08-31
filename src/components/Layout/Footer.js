import React from "react"

export default function Footer() {
  return (
    <div>
      <footer className="footer is-grad">
        <p className="has-text-centered has-text-white">&copy; Abymar 2020</p>
        <p className="has-text-centered has-text-white">
          Built with{" "}
          <a
            href="https://gatsbyjs.org/"
            rel="noopener noreferrer"
            target="_blank"
            className="footer-link"
          >
            Gatsby
          </a>{" "}
          &{" "}
          <a
            href="https://bulma.io"
            rel="noopener noreferrer"
            target="_blank"
            className="footer-link"
          >
            Bulma
          </a>
        </p>
      </footer>
    </div>
  )
}
