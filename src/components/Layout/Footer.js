import React from "react"

export default function Footer() {
  return (
    <footer className="footer is-grad has-text-white has-text-centered">
      <p>&copy; slicedearth 2021</p>
      <p>
        Built with{" "}
        <a
          href="https://gatsbyjs.com/"
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
  )
}
