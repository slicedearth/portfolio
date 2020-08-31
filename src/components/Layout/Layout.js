import React from "react"
import Header from "./Header"
import Footer from "./Footer"
import "../../styles/main.scss"
if (typeof window !== "undefined") {
  // eslint-disable-next-line global-require
  require("smooth-scroll/dist/smooth-scroll.polyfills.min.js")('a[href*="#"]')
}

export default function Layout({ children }) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  )
}
