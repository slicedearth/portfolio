import React from "react"
import Header from "./Header"
import Footer from "./Footer"
import "../../styles/main.scss"

export default function Layout({ children }) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  )
}
