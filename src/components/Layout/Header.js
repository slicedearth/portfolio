import React, { useState } from "react"
import { useStaticQuery, graphql, Link } from "gatsby"

function NavLink({ to, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="group relative font-bold text-gray-300 transition-colors hover:text-white"
    >
      {children}
      <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-accent transition-all duration-300 group-hover:w-full"></span>
    </Link>
  )
}

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
      className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-bg/80 backdrop-blur-md"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text font-secondary text-2xl font-bold text-transparent"
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
            className={`block h-0.5 w-6 bg-gray-300 transition-transform ${
              isActive ? "translate-y-2 rotate-45" : ""
            }`}
          ></span>
          <span
            className={`block h-0.5 w-6 bg-gray-300 transition-opacity ${
              isActive ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block h-0.5 w-6 bg-gray-300 transition-transform ${
              isActive ? "-translate-y-2 -rotate-45" : ""
            }`}
          ></span>
        </button>

        <div className="hidden items-center gap-8 sm:flex">
          <NavLink to="/#projects">Projects</NavLink>
          <NavLink to="/#about">About Me</NavLink>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-300 sm:hidden ${
          isActive ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col items-center gap-4 pb-4">
          <NavLink to="/#projects" onClick={() => setisActive(false)}>
            Projects
          </NavLink>
          <NavLink to="/#about" onClick={() => setisActive(false)}>
            About Me
          </NavLink>
        </div>
      </div>
    </nav>
  )
}
