import React, { useState } from "react"
import { useStaticQuery, graphql, Link } from "gatsby"

export default function Header() {
  const [isActive, setisActive] = useState(false)

  const data = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
          }
        }
      }
    `
  )
  return (
    <nav
      className="fixed inset-x-0 top-0 z-50 bg-gradient-to-br from-gradient-1 via-gradient-2 to-gradient-3"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          className="font-secondary text-2xl font-bold text-white [text-shadow:2px_2px_#333]"
          to="/"
        >
          {data.site.siteMetadata.title}
        </Link>

        <button
          onClick={() => {
            setisActive(!isActive)
          }}
          type="button"
          className="flex flex-col items-center justify-center gap-1.5 sm:hidden"
          aria-label="menu"
          aria-expanded={isActive}
        >
          <span
            className={`block h-0.5 w-6 bg-white transition-transform ${
              isActive ? "translate-y-2 rotate-45" : ""
            }`}
          ></span>
          <span
            className={`block h-0.5 w-6 bg-white transition-opacity ${
              isActive ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block h-0.5 w-6 bg-white transition-transform ${
              isActive ? "-translate-y-2 -rotate-45" : ""
            }`}
          ></span>
        </button>

        <div className="hidden items-center gap-6 sm:flex">
          <Link
            to="/#projects"
            className="font-bold text-white hover:underline"
          >
            Projects
          </Link>
          <Link to="/#about" className="font-bold text-white hover:underline">
            About Me
          </Link>
        </div>
      </div>

      {isActive && (
        <div className="flex flex-col items-center gap-4 pb-4 sm:hidden">
          <Link
            to="/#projects"
            className="font-bold text-white hover:underline"
            onClick={() => setisActive(false)}
          >
            Projects
          </Link>
          <Link
            to="/#about"
            className="font-bold text-white hover:underline"
            onClick={() => setisActive(false)}
          >
            About Me
          </Link>
        </div>
      )}
    </nav>
  )
}
