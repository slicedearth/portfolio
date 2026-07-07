import React from "react"
import Header from "./Header"
import Footer from "./Footer"
import "../../styles/global.css"

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col pt-16">{children}</main>
      <Footer />
    </div>
  )
}
