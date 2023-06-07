import React from "react"
import Layout from "../components/Layout/Layout"
import Projects from "../components/sections/Projects"
import About from "../components/sections/About"
import Hero from "../components/sections/Hero"
import Seo from "../components/SEO"
export default function Home() {
  return (
    <Layout>
      <Seo title="Home" />
      <Hero />
      <Projects />
      <About />
    </Layout>
  )
}
