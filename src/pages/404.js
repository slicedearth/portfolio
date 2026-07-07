import React from "react"
import Layout from "../components/Layout/Layout"
import { Link } from "gatsby"
import Seo from "../components/SEO"

export default function NotFound() {
  return (
    <Layout>
      <Seo title="404: Not Found" />
      <section className="py-24 px-4">
        <div className="mx-auto mt-12 max-w-4xl text-center">
          <h1 className="font-code text-6xl font-bold">404</h1>
          <h2 className="mt-2 font-code text-4xl">Page Not Found!</h2>
          <Link
            to="/"
            className="mt-8 inline-block rounded-md bg-black/80 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-black"
          >
            Go Back
          </Link>
        </div>
      </section>
    </Layout>
  )
}
