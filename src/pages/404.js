import React from "react"
import Layout from "../components/Layout/Layout"
import { Link } from "gatsby"
import Seo from "../components/SEO"

export default function NotFound() {
  return (
    <Layout>
      <section className="flex flex-1 flex-col items-center justify-center px-4 py-24">
        <div className="animate-fade-in-up mx-auto max-w-4xl text-center">
          <h1 className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text font-code text-6xl font-bold text-transparent">
            404
          </h1>
          <h2 className="mt-2 font-code text-4xl text-gray-200">
            Page Not Found!
          </h2>
          <Link
            to="/"
            className="mt-8 inline-block rounded-full border border-white/10 bg-slate-800 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:border-accent/50 hover:bg-slate-700 hover:shadow-xl hover:shadow-accent/10"
          >
            Go Back
          </Link>
        </div>
      </section>
    </Layout>
  )
}

export const Head = () => <Seo title="404: Not Found" />
