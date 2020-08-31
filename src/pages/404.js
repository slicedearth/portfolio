import React from "react"
import Layout from "../components/Layout/Layout"

export default function NotFound() {
  return (
    <Layout>
      <div className="hero is-large is-transparent">
        <div className="hero-body has-text-centered">
          <h1 className="title has-text-weight-bold is-size-1 is-family-code">
            404
          </h1>
          <h2 className="subtitle is-size-2 is-family-code">Page Not Found!</h2>
          <a
            role="button"
            className="button is-dark has-text-weight-semibold"
            href="/"
          >
            Go Back
          </a>
        </div>
      </div>
    </Layout>
  )
}
