import React from "react"
import Layout from "../components/Layout/Layout"
import SEO from "../components/SEO"
import ContactForm from "../components/sections/ContactForm"
import Hero from "../components/sections/Hero"

export default function Contact() {
  return (
    <Layout>
      <SEO title="Contact" />
      <Hero />
      <ContactForm />
    </Layout>
  )
}
