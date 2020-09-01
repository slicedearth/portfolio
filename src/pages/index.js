import React from "react"
import Layout from "../components/Layout/Layout"
import Projects from "../components/sections/Projects"
import About from "../components/sections/About"
import Contact from "../components/sections/Contact"
import Hero from "../components/sections/Hero"
import SEO from "../components/SEO"
export default function Home() {
  return (
    <Layout>
      <SEO title="Home" />
      <Hero />
      <Projects />
      <About />
      <Contact />
    </Layout>
  )
}
