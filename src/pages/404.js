import React from "react"
import Layout from "../components/Layout/Layout"
import { Link } from "gatsby"
import Seo from "../components/SEO"

export default function NotFound() {
  return (
    <Layout>
      <Seo title="404: Not Found" />
      <section className="section is-large nf-body">
        <div className="columns is-centered mt-6">
          <div className="column has-text-centered is-four-fifths">
            <h1 className="title has-text-weight-bold is-family-code error-head is-size-1-touch">
              404
            </h1>
            <h2 className="subtitle is-family-code error-subhead is-size-2-touch">
              Page Not Found!
            </h2>
            <Link
              role="button"
              className="button is-dark has-text-weight-semibold is-large"
              href="/"
            >
              Go Back
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  )
}
